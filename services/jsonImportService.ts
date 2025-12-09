// services/jsonImportService.ts
import PptxGenJS from "@bapunhansdah/pptxgenjs";
import {
  JSONPresentation,
  JSONSlide,
  JSONSlideObject,
  JSONTextObject,
  JSONShapeObject,
  JSONImageObject,
  JSONTableObject,
  JSONChartObject,
} from "../json-import";

export class JSONImportService {
  /**
   * Validate JSON structure
   */
  static validateJSON(json: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!json || typeof json !== "object") {
      errors.push("Invalid JSON: Root must be an object");
      return { valid: false, errors };
    }

    if (!Array.isArray(json.slides)) {
      errors.push("Invalid JSON: 'slides' array is required");
      return { valid: false, errors };
    }

    if (json.slides.length === 0) {
      errors.push("Invalid JSON: At least one slide is required");
      return { valid: false, errors };
    }

    json.slides.forEach((slide: any, index: number) => {
      if (!Array.isArray(slide.objects)) {
        errors.push(`Slide ${index + 1}: 'objects' array is required`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Convert JSON to PPTX
   */
  static async generatePPTXFromJSON(
    json: JSONPresentation,
    fileName: string = "imported-presentation.pptx"
  ): Promise<void> {
    const pptx = new PptxGenJS();

    // Set presentation properties
    if (json.title) pptx.title = json.title;
    if (json.author) pptx.author = json.author;
    if (json.company) pptx.company = json.company;
    if (json.subject) pptx.subject = json.subject;
    if (json.layout) pptx.layout = json.layout;

    // Process each slide
    for (const slideData of json.slides) {
      const slide = pptx.addSlide();

      // Add background
      if (slideData.background) {
        slide.background = slideData.background as any;
      }

      // Add slide number
      if (slideData.slideNumber) {
        slide.slideNumber = slideData.slideNumber as any;
      }

      // Add notes
      if (slideData.notes) {
        slide.addNotes(slideData.notes);
      }

      // Process each object on the slide
      for (const obj of slideData.objects) {
        await this.addObjectToSlide(slide, obj);
      }
    }

    // Generate file
    await pptx.writeFile({ fileName });
  }

  /**
   * Add object to slide based on type
   */
  private static async addObjectToSlide(
    slide: any,
    obj: JSONSlideObject
  ): Promise<void> {
    switch (obj.type) {
      case "text":
        this.addText(slide, obj.data as JSONTextObject);
        break;
      case "shape":
        this.addShape(slide, obj.data as JSONShapeObject);
        break;
      case "image":
        await this.addImage(slide, obj.data as JSONImageObject);
        break;
      case "table":
        this.addTable(slide, obj.data as JSONTableObject);
        break;
      case "chart":
        this.addChart(slide, obj.data as JSONChartObject);
        break;
      default:
        console.warn(`Unknown object type: ${obj.type}`);
    }
  }

  /**
   * Add text to slide
   */
  private static addText(slide: any, data: JSONTextObject): void {
    slide.addText(data.text, data.options || {});
  }

  /**
   * Add shape to slide
   */
  private static addShape(slide: any, data: JSONShapeObject): void {
    const shapeName = data.shape.toUpperCase();
    slide.addShape(shapeName, data.options || {});
  }

  /**
   * Add image to slide
   */
  private static async addImage(slide: any, data: JSONImageObject): Promise<void> {
    const options = { ...data.options };
    
    if (data.path) {
      options.path = data.path;
    } else if (data.data) {
      options.data = data.data;
    }

    slide.addImage(options);
  }

  /**
   * Add table to slide
   */
  private static addTable(slide: any, data: JSONTableObject): void {
    const tableRows = data.rows.map((row) =>
      row.map((cell) => {
        if (typeof cell === "string") {
          return { text: cell };
        }
        return cell;
      })
    );

    slide.addTable(tableRows, data.options || {});
  }

  /**
   * Add chart to slide
   */
  private static addChart(slide: any, data: JSONChartObject): void {
    slide.addChart(data.type, data.data, data.options || {});
  }

  /**
   * Generate code preview from JSON
   */
  static generateCodeFromJSON(json: JSONPresentation): string {
    let code = `import PptxGenJS from "@bapunhansdah/pptxgenjs";\n\n`;
    code += `const pptx = new PptxGenJS();\n\n`;

    // Add presentation properties
    if (json.title) code += `pptx.title = "${json.title}";\n`;
    if (json.author) code += `pptx.author = "${json.author}";\n`;
    if (json.company) code += `pptx.company = "${json.company}";\n`;
    if (json.subject) code += `pptx.subject = "${json.subject}";\n`;
    if (json.layout) code += `pptx.layout = "${json.layout}";\n`;

    code += `\n`;

    // Add slides
    json.slides.forEach((slideData, index) => {
      code += `// ===== Slide ${index + 1} =====\n`;
      code += `const slide${index + 1} = pptx.addSlide();\n\n`;

      // Background
      if (slideData.background) {
        code += `slide${index + 1}.background = ${JSON.stringify(slideData.background, null, 2)};\n\n`;
      }

      // Objects
      slideData.objects.forEach((obj, objIndex) => {
        code += `// Object ${objIndex + 1}: ${obj.type}\n`;
        code += this.generateObjectCode(`slide${index + 1}`, obj);
        code += `\n`;
      });

      // Notes
      if (slideData.notes) {
        code += `slide${index + 1}.addNotes("${slideData.notes}");\n\n`;
      }
    });

    code += `pptx.writeFile({ fileName: "presentation.pptx" });\n`;

    return code;
  }

  /**
   * Generate code for a single object
   */
  private static generateObjectCode(slideName: string, obj: JSONSlideObject): string {
    switch (obj.type) {
      case "text": {
        const data = obj.data as JSONTextObject;
        const textStr =
          typeof data.text === "string"
            ? `"${data.text}"`
            : JSON.stringify(data.text);
        return `${slideName}.addText(${textStr}, ${JSON.stringify(data.options || {}, null, 2)});\n`;
      }
      case "shape": {
        const data = obj.data as JSONShapeObject;
        return `${slideName}.addShape("${data.shape}", ${JSON.stringify(data.options || {}, null, 2)});\n`;
      }
      case "image": {
        const data = obj.data as JSONImageObject;
        const options = { ...data.options };
        if (data.path) options.path = data.path;
        if (data.data) options.data = data.data;
        return `${slideName}.addImage(${JSON.stringify(options, null, 2)});\n`;
      }
      case "table": {
        const data = obj.data as JSONTableObject;
        return `${slideName}.addTable(${JSON.stringify(data.rows, null, 2)}, ${JSON.stringify(data.options || {}, null, 2)});\n`;
      }
      case "chart": {
        const data = obj.data as JSONChartObject;
        return `${slideName}.addChart("${data.type}", ${JSON.stringify(data.data, null, 2)}, ${JSON.stringify(data.options || {}, null, 2)});\n`;
      }
      default:
        return `// Unknown type: ${obj.type}\n`;
    }
  }
}