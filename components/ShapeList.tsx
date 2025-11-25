"use client"

import type React from "react"
import { useState } from "react"
import { Trash2, Settings2, Clock, Zap, Layers, MousePointer2, SlidersHorizontal } from "lucide-react"
import AnimationConfigDialog from "./AnimationConfigDialog"
import { cn } from "@/lib/utils"
import { SlideShape } from "@/types"

interface ShapeListProps {
  shapes: SlideShape[]
  onRemove: (id: string) => void
  onUpdate: (shape: SlideShape) => void
  startIdx: number
}

const ShapeList: React.FC<ShapeListProps> = ({ shapes, onRemove, onUpdate, startIdx }) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedShape, setSelectedShape] = useState<SlideShape | null>(null)

  // Empty State
  if (shapes.length === 0) {
    return (
      <div className="h-full p-4 flex flex-col">
        <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-8 transition-colors hover:border-slate-300 hover:bg-slate-50/50">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 shadow-sm">
            <Layers className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No animations</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[180px]">
            Add shapes to the slide to configure their entrance or exit.
          </p>
        </div>
      </div>
    )
  }

  const handleConfigOpen = (shape: SlideShape) => {
    setSelectedShape(shape)
    setConfigDialogOpen(true)
  }


  return (
    <>
      <div className="h-full overflow-y-auto p-3 custom-scrollbar">
        <div className="space-y-2.5">
          {shapes.map((shape, idx) => {
            // Helper to format options string safely
            const hasOptions = shape.animation.options && Object.keys(shape.animation.options).length > 0
            const optionsString = hasOptions ? Object.values(shape?.animation?.options ?? {}).join(", ") : "";

            return (  
              <div
                key={shape.id}
                className="group relative flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-transparent hover:bg-white hover:border-slate-200/60 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-all duration-200 ease-out"
              >
                {/* Visual Identifier / Index */}
                <div className="relative flex-shrink-0">
                  <div
                    className="absolute inset-0 opacity-20 rounded-lg blur-sm transition-opacity group-hover:opacity-40"
                  />
                  <div
                    className="relative w-10 h-10 rounded-lg flex items-center justify-center text-2xl font-mono font-bold shadow-sm border border-white/20"
                    style={{
                      color: `#${shape.color}`,
                    }}
                  >
                    {startIdx + idx + 1}
                  </div>
                </div>

                {/* Info Column */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800 text-sm truncate leading-none">
                      {shape.animation.type}
                    </h4>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    {/* Trigger Badge */}
                    <span className="flex-shrink-0 flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md border border-slate-100 shadow-sm">
                      <MousePointer2 className="w-3 h-3 text-slate-400" />
                      {shape.animation.trigger}
                    </span>

                    <div className="w-px h-3 bg-slate-200" />

                    {/* Time Stats */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="flex items-center gap-1 font-mono" title="Duration">
                        <Zap className="w-3 h-3 text-amber-500/80" />
                        {(shape.animation.duration || 1000) / 1000}s
                      </span>
                      <span className="flex items-center gap-1 font-mono" title="Delay">
                        <Clock className="w-3 h-3 text-blue-500/80" />
                        {(shape.animation.delay || 0) / 1000}s
                      </span>
                    </div>

                    {/* Options (Truncated if too long) */}
                    {hasOptions && (
                      <>
                        <div className="w-px h-3 bg-slate-200" />
                        <div className="flex items-center gap-1 min-w-0">
                            <SlidersHorizontal className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span 
                              className="truncate max-w-[100px] text-slate-600" 
                              title={optionsString}
                            >
                            {optionsString}
                            </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Floating Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pl-2">
                  <ActionButton
                    onClick={() => handleConfigOpen(shape)}
                    icon={<Settings2 className="w-3.5 h-3.5" />}
                    label="Edit"
                  />
                  <ActionButton
                    onClick={() => onRemove(shape.id)}
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    label="Remove"
                    variant="destructive"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <AnimationConfigDialog
        open={configDialogOpen}
        shape={selectedShape}
        onSave={onUpdate}
        onOpenChange={setConfigDialogOpen}
      />
    </>
  )
}

const ActionButton = ({ onClick, icon, label, variant }: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className={cn(
      "p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0",
      variant === "destructive"
        ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
        : "text-slate-400 hover:text-slate-900 hover:bg-slate-100",
    )}
    title={label}
  >
    {icon}
  </button>
)

export default ShapeList