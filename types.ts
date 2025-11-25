export type AnimationCategory = "Entrance" | "Emphasis" | "Exit" | "Path"

export interface AnimationDefinition {
  type: AnimationType
  category: AnimationCategory
  duration?: number
  delay?: number
  trigger?: AnimationTrigger
  options?: AnimationOptions
}


// Mock types for demonstration
export interface AnimationOptions {
  direction?: string
  shape?: string
  spokes?: number
  color?: string
  level?: string
  amount?: string
  [key: string]: any
}

export interface SlideShape {
  id: string
  shapeType: string
  x: number
  y: number
  w: number
  h: number
  color: string
  animation: {
    type: string
    category: string
    duration: number
    delay?: number
    trigger?: string
    options?: AnimationOptions
  }
}



export type FlyDirection = "top" | "bottom" | "left" | "right" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

export type SplitDirection = "horizontalIn" | "horizontalOut" | "verticalIn" | "verticalOut"
export type WipeDirection = "bottom" | "top" | "left" | "right"
export type ShapeMaskType = "circle" | "box" | "diamond" | "plus"
export type ShapeDirection = "in" | "out"
export type FloatDirection = "floatUp" | "floatDown"
export type ZoomDirection = "slideCenter" | "objectCenter"
export type SpinDirection = "clockwise" | "counterClockwise"
export type SpinAmount = "quarterSpin" | "halfSpin" | "fullSpin" | "twoSpins"
export type GrowShrinkDirection = "horizontal" | "vertical" | "both"
export type GrowShrinkAmount = "tiny" | "smaller" | "larger" | "huge"
export type TransparencyLevel = "25%" | "50%" | "75%" | "100%" | number

export type AnimationTrigger = "onClick" | "withPrevious" | "afterPrevious"

export type EntranceAnimation =
  | "appear"
  | "fadein"
  | "flyin"
  | "floatin"
  | "split"
  | "wipe"
  | "shape"
  | "wheel"
  | "randombars"
  | "zoom"
  | "grow"
  | "growandturn"
  | "swivel"
  | "bounce"

export type EmphasisAnimation =
  | "pulse"
  | "colorpulse"
  | "teeter"
  | "spin"
  | "growshrink"
  | "desaturate"
  | "darken"
  | "lighten"
  | "transparency"
  | "objectcolor"
  | "complementarycolor"
  | "linecolor"
  | "fillcolor"

export type ExitAnimation =
  | "disappear"
  | "fadeout"
  | "flyout"
  | "floatout"
  | "splitexit"
  | "wipeexit"
  | "shapeexit"
  | "wheelexit"
  | "randombarsexit"
  | "shrinkandturn"
  | "zoomexit"
  | "swivelexit"
  | "bounceexit"

export type PathAnimation = "pathdown" | "patharcdown" | "pathturnright" | "pathcircle" | "pathzigzag"

export type AnimationType = EntranceAnimation | EmphasisAnimation | ExitAnimation | PathAnimation

export type WheelSpokes = 1 | 2 | 3 | 4 | 8
export type RandomBarsDirection = "horizontal" | "vertical"

export interface AnimationOptions {
  flyDirection?: FlyDirection
  splitDirection?: SplitDirection
  wipeDirection?: WipeDirection
  shapeMask?: ShapeMaskType
  shapeDirection?: ShapeDirection
  floatDirection?: FloatDirection
  zoomDirection?: ZoomDirection
  spinDirection?: SpinDirection
  spinAmount?: SpinAmount
  growShrinkDirection?: GrowShrinkDirection
  growShrinkAmount?: GrowShrinkAmount
  transparencyLevel?: TransparencyLevel
  wheelSpokes?: WheelSpokes
  randomBarsDirection?: RandomBarsDirection
  color?: string // hex color without '#', e.g., 'FFFF00'
}
