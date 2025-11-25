"use client"

import { AnimationCategory } from "./types"

export const ENTRANCE_ANIMATIONS = [
  "appear",
  "fadein",
  "flyin",
  "floatin",
  "split",
  "wipe",
  "shape",
  "wheel",
  "randombars",
  "zoom",
  "growandturn",
  "swivel",
  "bounce",
]

export const EMPHASIS_ANIMATIONS = [
  "pulse",
  "colorpulse",
  "teeter",
  "spin",
  "growshrink",
  "desaturate",
  "darken",
  "lighten",
  "transparency",
  "objectcolor",
  "complementarycolor",
  "linecolor",
  "fillcolor",
]

export const EXIT_ANIMATIONS = [
  "disappear",
  "fadeout",
  "flyout",
  "floatout",
  "splitexit",
  "wipeexit",
  "shapeexit",
  "wheelexit",
  "randombarsexit",
  "shrinkandturn",
  "zoomexit",
  "swivelexit",
  "bounceexit",
]

export const PATH_ANIMATIONS = ["pathdown", "patharcdown", "pathturnright", "pathcircle", "pathzigzag"]

export const ANIMATION_GROUPS: { category: AnimationCategory; items: string[]; color: string }[] = [
  {
    category: "Entrance",
    items: ENTRANCE_ANIMATIONS,
    color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  },
  {
    category: "Emphasis",
    items: EMPHASIS_ANIMATIONS,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  },
  {
    category: "Exit",
    items: EXIT_ANIMATIONS,
    color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  },
  {
    category: "Path",
    items: PATH_ANIMATIONS,
    color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  },
]

export const DEFAULT_SHAPE_COLORS = [
  "1E40AF", // Blue 800
  "047857", // Emerald 700
  "B91C1C", // Red 700
  "D97706", // Amber 600
  "7C3AED", // Violet 600
  "DB2777", // Pink 600
]

// Animation configuration constants
export const ANIMATION_OPTIONS_CONFIG: Record<string, any> = {
  flyin: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "top", label: "↑ Top" },
      { value: "bottom", label: "↓ Bottom" },
      { value: "left", label: "← Left" },
      { value: "right", label: "→ Right" },
      { value: "topLeft", label: "↖ Top Left" },
      { value: "topRight", label: "↗ Top Right" },
      { value: "bottomLeft", label: "↙ Bottom Left" },
      { value: "bottomRight", label: "↘ Bottom Right" },
    ],
  },
  flyout: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "top", label: "↑ Top" },
      { value: "bottom", label: "↓ Bottom" },
      { value: "left", label: "← Left" },
      { value: "right", label: "→ Right" },
      { value: "topLeft", label: "↖ Top Left" },
      { value: "topRight", label: "↗ Top Right" },
      { value: "bottomLeft", label: "↙ Bottom Left" },
      { value: "bottomRight", label: "↘ Bottom Right" },
    ],
  },
  split: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "horizontalIn", label: "Horizontal In" },
      { value: "horizontalOut", label: "Horizontal Out" },
      { value: "verticalIn", label: "Vertical In" },
      { value: "verticalOut", label: "Vertical Out" },
    ],
  },
  splitexit: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "horizontalIn", label: "Horizontal In" },
      { value: "horizontalOut", label: "Horizontal Out" },
      { value: "verticalIn", label: "Vertical In" },
      { value: "verticalOut", label: "Vertical Out" },
    ],
  },
  wipe: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "bottom", label: "From Bottom" },
      { value: "top", label: "From Top" },
      { value: "left", label: "From Left" },
      { value: "right", label: "From Right" },
    ],
  },
  wipeexit: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "bottom", label: "From Bottom" },
      { value: "top", label: "From Top" },
      { value: "left", label: "From Left" },
      { value: "right", label: "From Right" },
    ],
  },
  shape: {
    label: "Shape & Direction",
    key: "shape",
    options: [
      { value: "circle", label: "Circle" },
      { value: "box", label: "Box" },
      { value: "diamond", label: "Diamond" },
      { value: "plus", label: "Plus" },
    ],
    directionKey: "direction",
    directionOptions: [
      { value: "in", label: "In" },
      { value: "out", label: "Out" },
    ],
  },
  shapeexit: {
    label: "Shape & Direction",
    key: "shape",
    options: [
      { value: "circle", label: "Circle" },
      { value: "box", label: "Box" },
      { value: "diamond", label: "Diamond" },
      { value: "plus", label: "Plus" },
    ],
    directionKey: "direction",
    directionOptions: [
      { value: "in", label: "In" },
      { value: "out", label: "Out" },
    ],
  },
  wheel: {
    label: "Spokes",
    key: "spokes",
    options: [
      { value: 1, label: "1 Spoke" },
      { value: 2, label: "2 Spokes" },
      { value: 3, label: "3 Spokes" },
      { value: 4, label: "4 Spokes" },
      { value: 8, label: "8 Spokes" },
    ],
  },
  wheelexit: {
    label: "Spokes",
    key: "spokes",
    options: [
      { value: 1, label: "1 Spoke" },
      { value: 2, label: "2 Spokes" },
      { value: 3, label: "3 Spokes" },
      { value: 4, label: "4 Spokes" },
      { value: 8, label: "8 Spokes" },
    ],
  },
  randombars: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "horizontal", label: "Horizontal" },
      { value: "vertical", label: "Vertical" },
    ],
  },
  randombarsexit: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "horizontal", label: "Horizontal" },
      { value: "vertical", label: "Vertical" },
    ],
  },
  floatin: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "floatUp", label: "Float Up" },
      { value: "floatDown", label: "Float Down" },
    ],
  },
  floatout: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "floatUp", label: "Float Up" },
      { value: "floatDown", label: "Float Down" },
    ],
  },
  zoom: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "slideCenter", label: "Slide Center" },
      { value: "objectCenter", label: "Object Center" },
    ],
  },
  zoomexit: {
    label: "Direction",
    key: "direction",
    options: [
      { value: "slideCenter", label: "Slide Center" },
      { value: "objectCenter", label: "Object Center" },
    ],
  },
  spin: {
    label: "Direction & Amount",
    key: "direction",
    directionOptions: [
      { value: "clockwise", label: "Clockwise" },
      { value: "counterClockwise", label: "Counter Clockwise" },
    ],
    amountKey: "amount",
    amountOptions: [
      { value: "quarterSpin", label: "¼ Spin" },
      { value: "halfSpin", label: "½ Spin" },
      { value: "fullSpin", label: "1 Full Spin" },
      { value: "twoSpins", label: "2 Full Spins" },
    ],
  },
  growshrink: {
    label: "Direction & Amount",
    key: "direction",
    directionOptions: [
      { value: "horizontal", label: "Horizontal" },
      { value: "vertical", label: "Vertical" },
      { value: "both", label: "Both" },
    ],
    amountKey: "amount",
    amountOptions: [
      { value: "tiny", label: "Tiny" },
      { value: "smaller", label: "Smaller" },
      { value: "larger", label: "Larger" },
      { value: "huge", label: "Huge" },
    ],
  },
  transparency: {
    label: "Level",
    key: "level",
    options: [
      { value: "25%", label: "25%" },
      { value: "50%", label: "50%" },
      { value: "75%", label: "75%" },
      { value: "100%", label: "100%" },
    ],
  },
  colorpulse: {
    label: "Color",
    key: "color",
    isColorPicker: true,
  },
  objectcolor: {
    label: "Color",
    key: "color",
    isColorPicker: true,
  },
  complementarycolor: {
    label: "Color",
    key: "color",
    isColorPicker: true,
  },
  linecolor: {
    label: "Color",
    key: "color",
    isColorPicker: true,
  },
  fillcolor: {
    label: "Color",
    key: "color",
    isColorPicker: true,
  },
}
