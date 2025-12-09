export interface JSONSlide {
  background?: {
    color?: string;
    path?: string;
    data?: string;
    transparency?: number;
  };
  objects: JSONSlideObject[];
  slideNumber?: {
    x?: number;
    y?: number;
    fontSize?: number;
    color?: string;
  };
  notes?: string;
}

export interface JSONSlideObject {
  type: "text" | "shape" | "image" | "table" | "chart";
  data:
    | JSONTextObject
    | JSONShapeObject
    | JSONImageObject
    | JSONTableObject
    | JSONChartObject;
}

export interface JSONTextObject {
  text: string | Array<{ text: string; options?: any }>;
  options?: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    fontSize?: number;
    fontFace?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: "left" | "center" | "right" | "justify";
    valign?: "top" | "middle" | "bottom";
    fill?: { color?: string; transparency?: number };
    line?: any;
    shape?: string;
    [key: string]: any;
    animation?:
      | string
      | {
          type: string;
          trigger?: "onClick" | "withPrevious" | "afterPrevious";
          duration?: number;
          delay?: number;
          direction?: string;
        };
  };
}

export interface JSONShapeObject {
  shape: string;
  options?: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    fill?: { color?: string; transparency?: number };
    line?: {
      color?: string;
      width?: number;
      dashType?: string;
    };
    rotate?: number;
    flipH?: boolean;
    flipV?: boolean;
    [key: string]: any;
    animation?:
      | string
      | {
          type: string;
          trigger?: "onClick" | "withPrevious" | "afterPrevious";
          duration?: number;
          delay?: number;
          direction?: string;
        };
  };
}

export interface JSONImageObject {
  path?: string;
  data?: string;
  options?: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    rotate?: number;
    hyperlink?: {
      url?: string;
      tooltip?: string;
    };
    [key: string]: any;
    animation?:
      | string
      | {
          type: string;
          trigger?: "onClick" | "withPrevious" | "afterPrevious";
          duration?: number;
          delay?: number;
          direction?: string;
        };
  };
}

export interface JSONTableObject {
  rows: Array<Array<string | { text: string; options?: any }>>;
  options?: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    colW?: number | number[];
    rowH?: number | number[];
    border?: any;
    fill?: { color?: string };
    [key: string]: any;
    animation?:
      | string
      | {
          type: string;
          trigger?: "onClick" | "withPrevious" | "afterPrevious";
          duration?: number;
          delay?: number;
          direction?: string;
        };
  };
}

export interface JSONChartObject {
  type: string;
  data: Array<{
    name?: string;
    labels?: string[];
    values?: number[];
  }>;
  options?: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    showTitle?: boolean;
    title?: string;
    showLegend?: boolean;
    showValue?: boolean;
    [key: string]: any;
    animation?:
      | string
      | {
          type: string;
          trigger?: "onClick" | "withPrevious" | "afterPrevious";
          duration?: number;
          delay?: number;
          direction?: string;
        };
  };
}

export interface JSONPresentation {
  title?: string;
  author?: string;
  company?: string;
  subject?: string;
  layout?: string;
  slides: JSONSlide[];
}
