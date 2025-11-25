import { SlideShape } from "@/types";
import PptxGenJS from "@bapunhansdah/pptxgenjs";

export const generatePptxFile = async (shapes: SlideShape[]) => {
  const pptx = new PptxGenJS();

  const SHAPES_PER_SLIDE = 9;
  const totalSlides = Math.ceil(shapes.length / SHAPES_PER_SLIDE);

  for (let slideNum = 0; slideNum < totalSlides; slideNum++) {
    const slide = pptx.addSlide();
    const startIdx = slideNum * SHAPES_PER_SLIDE;
    const endIdx = Math.min(startIdx + SHAPES_PER_SLIDE, shapes.length);
    const slideShapes = shapes.slice(startIdx, endIdx);

    // Add slide title
    slide.addText(`Animation Demo - Slide ${slideNum + 1}/${totalSlides}`, {
      x: 0.5,
      y: 0.5,
      w: "90%",
      h: 0.5,
      fontSize: 24,
      fontFace: "Arial",
      color: "000000",
      bold: true,
    });

    slide.addText("Generated via @bapunhansdah/pptxgenjs playground", {
      x: 0.5,
      y: 1.0,
      w: "90%",
      h: 0.3,
      fontSize: 12,
      color: "888888",
      italic: true,
    });

    // Add shapes with their animations
    slideShapes.forEach((shape) => {
      // Build animation config - this is the KEY fix
      const animationConfig: any = {
        type: shape.animation.type,
        duration: shape.animation.duration || 1000,
      };

      // Add delay if present
      if (shape.animation.delay && shape.animation.delay > 0) {
        animationConfig.delay = shape.animation.delay;
      }

      // Add trigger if not default
      if (shape.animation.trigger && shape.animation.trigger !== "onClick") {
        animationConfig.trigger = shape.animation.trigger;
      }

      // Instead of nesting them under 'options'
      if (shape.animation.options) {
        Object.assign(animationConfig, shape.animation.options);
      }

      slide.addShape(pptx.ShapeType.rect, {
        x: shape.x,
        y: shape.y,
        w: shape.w,
        h: shape.h,
        fill: { color: shape.color },
        line: { type: "none" },
        rectRadius: 0.2,
        align: "center",
        animation: animationConfig,
      });
      slide.addText(shape.animation.type, {
        x: shape.x,
        y: shape.y,
        w: shape.w,
        h: 0.2,
        fontSize: 12,
        color: "FFFFFF",
        bold: true,
        align: "center",
         animation: {...animationConfig,trigger:"withPrevious"},
      });
      if (shape.animation.options?.direction) {
        slide.addText(shape.animation.options?.direction, {
          x: shape.x,
          y: shape.y + 0.2,
          w: shape.w,
          h: 0.2,
          fontSize: 10,
          color: "FFFFFF",
          align: "center",
           animation: {...animationConfig,trigger:"withPrevious"},
        });
      }
      if(shape.animation.options?.spokes) {
        slide.addText(String(shape.animation.options.spokes), {
          x: shape.x,
          y: shape.y + 0.2,
          w: shape.w,
          h: 0.2,
          fontSize: 10,
          color: "FFFFFF",
          align: "center",
           animation: {...animationConfig,trigger:"withPrevious"},
        });
      }
      if(shape.animation.options?.amount) {
        slide.addText(String(shape.animation.options.amount), {
          x: shape.x,
          y: shape.y + 0.2+0.2,
          w: shape.w,
          h: 0.2,
          fontSize: 10,
          color: "FFFFFF",
          align: "center",
           animation: {...animationConfig,trigger:"withPrevious"},
        });
        if(shape.animation.options?.level) {
          slide.addText(String(shape.animation.options.level), {
            x: shape.x,
            y: shape.y + 0.2+0.2,
            w: shape.w,
            h: 0.2,
            fontSize: 10,
            color: "FFFFFF",
            align: "center",
             animation: {...animationConfig,trigger:"withPrevious"},
          });
        }
        if(shape.animation.options?.color) {
          slide.addText(String(shape.animation.options.color), {
            x: shape.x,
            y: shape.y + 0.2,
            w: shape.w,
            h: 0.2,
            fontSize: 10,
            color: "FFFFFF",
            align: "center",
             animation: {...animationConfig,trigger:"withPrevious"},
          });
        }
      }
      if(shape.animation.options?.level) {
        slide.addText(String(shape.animation.options.level), {
          x: shape.x,
          y: shape.y + 0.2,
          w: shape.w,
          h: 0.2,
          fontSize: 10,
          color: "FFFFFF",
          align: "center",
           animation: {...animationConfig,trigger:"withPrevious"},
        });
      }
      if(shape.animation.options?.shape) {
        slide.addText(String(shape.animation.options.shape), {
          x: shape.x,
          y: shape.y + 0.2+0.2,
          w: shape.w,
          h: 0.2,
          fontSize: 10,
          color: "FFFFFF",
          align: "center",
           animation: {...animationConfig,trigger:"withPrevious"},
        });
      }
    });
  }

  await pptx.writeFile({ fileName: `animation-demo-${Date.now()}.pptx` });
};

// Helper function to validate animation config
export const validateAnimationConfig = (shape: SlideShape): boolean => {
  const { type, options }: any = shape.animation;

  // Define required options for each animation type
  const requiredOptions: Record<string, string[]> = {
    flyin: ["direction"],
    flyout: ["direction"],
    split: ["direction"],
    splitexit: ["direction"],
    wipe: ["direction"],
    wipeexit: ["direction"],
    shape: ["shape", "direction"],
    shapeexit: ["shape", "direction"],
    wheel: ["spokes"],
    wheelexit: ["spokes"],
    randombars: ["direction"],
    randombarsexit: ["direction"],
    floatin: ["direction"],
    floatout: ["direction"],
    zoom: ["direction"],
    zoomexit: ["direction"],
    spin: ["direction", "amount"],
    growshrink: ["direction", "amount"],
    transparency: ["level"],
    colorpulse: ["color"],
    objectcolor: ["color"],
    complementarycolor: ["color"],
    linecolor: ["color"],
    fillcolor: ["color"],
  };

  const required = requiredOptions[type.toLowerCase()];

  // No validation needed if animation has no required options
  if (!required) return true;

  // Check if all required options are present
  if (!options) return false;

  return required.every(
    (key) => options[key] !== undefined && options[key] !== ""
  );
};

// Updated code generation helper
export const generateAnimationCode = (shape: SlideShape): string => {
  let code = `slide.addShape(pptx.ShapeType.${shape.shapeType}, {
    x: ${shape.x},
    y: ${shape.y},
    w: ${shape.w},
    h: ${shape.h},
    fill: { color: "${shape.color}" },
    line: { type: "none" },
    animation: {
        type: "${shape.animation.type}",
        duration: ${shape.animation.duration || 1000},`;

  if (shape.animation.delay && shape.animation.delay > 0) {
    code += `\n        delay: ${shape.animation.delay},`;
  }

  if (shape.animation.trigger && shape.animation.trigger !== "onClick") {
    code += `\n        trigger: "${shape.animation.trigger}",`;
  }

  // Add each option directly (not nested)
  if (shape.animation.options) {
    Object.entries(shape.animation.options).forEach(([key, value]) => {
      if (typeof value === "string") {
        code += `\n        ${key}: "${value}",`;
      } else {
        code += `\n        ${key}: ${value},`;
      }
    });
  }

  code += `\n}\n});`;

  return code;
};
