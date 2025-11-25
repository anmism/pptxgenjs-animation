"use client"

import type React from "react"
import { useState } from "react"
import { Copy, Check, Terminal } from "lucide-react"
import { SlideShape } from "@/types"

interface CodeViewerProps {
  shapes: SlideShape[]
}

const CodeViewer: React.FC<CodeViewerProps> = ({ shapes }) => {
  const [copied, setCopied] = useState(false)

  const generateCode = () => {
    let code = `import PptxGenJS from "@bapunhansdah/pptxgenjs";

const pptx = new PptxGenJS();

`

    if (shapes.length === 0) {
      code += `// Add animations from the sidebar to see code here...`
    } else {
      const SHAPES_PER_SLIDE = 9
      const totalSlides = Math.ceil(shapes.length / SHAPES_PER_SLIDE)

      for (let slideNum = 0; slideNum < totalSlides; slideNum++) {
        const startIdx = slideNum * SHAPES_PER_SLIDE
        const endIdx = Math.min(startIdx + SHAPES_PER_SLIDE, shapes.length)
        const slideShapes = shapes.slice(startIdx, endIdx)

        code += `// ===== Slide ${slideNum + 1}/${totalSlides} =====
const slide${slideNum + 1} = pptx.addSlide();

`

        slideShapes.forEach((shape, index) => {
          code += `// Shape ${startIdx + index + 1}: ${shape.animation.category} - ${shape.animation.type}
slide${slideNum + 1}.addShape(pptx.ShapeType.${shape.shapeType}, {
    x: ${shape.x}, y: ${shape.y}, w: ${shape.w}, h: ${shape.h},
    fill: { color: "${shape.color}" },
    line: { type: "none" },
    rectRadius: 0.2,
    align: "center",
    animation: {
        type: "${shape.animation.type}",
        duration: ${shape.animation.duration || 1000},`

          if (shape.animation.delay && shape.animation.delay > 0) {
            code += `
        delay: ${shape.animation.delay},`
          }

          if (shape.animation.trigger && shape.animation.trigger !== "onClick") {
            code += `
        trigger: "${shape.animation.trigger}",`
          }

          if (shape.animation.options) {
            code += ``
            Object.entries(shape.animation.options).forEach(([key, value]) => {
              if (typeof value === 'string') {
                code += `\n        ${key}: "${value}",`
              } else {
                code += `\n        ${key}: ${value},`
              }
            })
          }

          code += `
    }
});

`
        })
      }
    }

    code += `pptx.writeFile({ fileName: "demo-animation.pptx" });`
    return code
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 rounded-xl overflow-hidden shadow-xl border border-slate-700">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold">Code Preview</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs rounded-md transition-colors text-white"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed">
        <pre className="whitespace-pre-wrap text-blue-100">
          <code>{generateCode()}</code>
        </pre>
      </div>
    </div>
  )
}

export default CodeViewer
