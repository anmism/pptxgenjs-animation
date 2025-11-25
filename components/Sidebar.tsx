"use client"

import type React from "react"
import { useState } from "react"
import { Plus, ChevronDown, ChevronRight, PlayCircle } from "lucide-react"
import { ANIMATION_GROUPS } from "../constants"
import type { AnimationCategory } from "../types"

interface SidebarProps {
  onAddAnimation: (type: string, category: AnimationCategory) => void
}

const Sidebar: React.FC<SidebarProps> = ({ onAddAnimation }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    Entrance: true,
    Emphasis: false,
    Exit: false,
    Path: false,
  })

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="w-full h-full bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 overflow-hidden">
      <div className="p-3 md:p-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Animations</h2>
        <p className="text-xs text-slate-500">Tap to add shape</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-1.5">
        {ANIMATION_GROUPS.map((group) => (
          <div key={group.category} className="rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(group.category)}
              className="w-full flex items-center justify-between p-2.5 md:p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left border border-slate-200 rounded-md"
            >
              <div className="flex items-center gap-2 font-medium text-slate-700 text-sm">
                {openCategories[group.category] ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
                {group.category}
              </div>
              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full flex-shrink-0">
                {group.items.length}
              </span>
            </button>

            {openCategories[group.category] && (
              <div className="grid grid-cols-2 gap-1.5 md:gap-2 p-2 md:p-3">
                {group.items.map((anim) => (
                  <button
                    key={anim}
                    onClick={() => onAddAnimation(anim, group.category)}
                    className={`
                      text-xs px-2.5 py-2 md:py-2.5 rounded-md border transition-all duration-200 flex items-center justify-center gap-1
                      shadow-sm hover:shadow-md active:scale-95 text-center break-words font-medium
                      ${group.color}
                    `}
                    title={`Add ${anim}`}
                  >
                    {group.category === "Path" ? (
                      <PlayCircle className="w-3 h-3 flex-shrink-0" />
                    ) : (
                      <Plus className="w-3 h-3 flex-shrink-0" />
                    )}
                    <span className="truncate">{anim}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
