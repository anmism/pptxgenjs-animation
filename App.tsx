"use client";

import { useState } from "react";
import {
  Layers,
  Download,
  RefreshCw,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Github,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import CodeViewer from "./components/CodeViewer";
import ShapeList from "./components/ShapeList";
import { generatePptxFile } from "./services/pptxService";
import {
  ANIMATION_GROUPS,
  ANIMATION_OPTIONS_CONFIG,
  DEFAULT_SHAPE_COLORS,
} from "./constants";
import { AnimationCategory, SlideShape } from "./types";
import { Button } from "./components/ui/button";
// import JSONImport from "./components/JSONImport";

function App() {
  const [shapes, setShapes] = useState<SlideShape[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SHAPES_PER_SLIDE = 9;
  const totalSlides = Math.max(1, Math.ceil(shapes.length / SHAPES_PER_SLIDE));
  const startIdx = currentSlide * SHAPES_PER_SLIDE;
  const endIdx = startIdx + SHAPES_PER_SLIDE;
  const currentShapes = shapes.slice(startIdx, endIdx);

  const handleAddAnimation = (type: string, category: AnimationCategory) => {
    const gridIndex = shapes.length % 9;
    const col = gridIndex % 3;
    const row = Math.floor(gridIndex / 3);

    const baseX = 0.5;
    const baseY = 1.5;
    const itemW = 2.5;
    const itemH = 1.2;
    const gap = 0.2;

    const newShape: SlideShape = {
      id: Math.random().toString(36).substr(2, 9),
      shapeType: "rect",
      color: DEFAULT_SHAPE_COLORS[shapes.length % DEFAULT_SHAPE_COLORS.length],
      animation: {
        type,
        category,
        duration: 1000,
        delay: 0,
        trigger: "onClick",
      },
      x: baseX + col * (itemW + gap),
      y: baseY + row * (itemH + gap),
      w: itemW,
      h: itemH,
    };

    setShapes([...shapes, newShape]);
    setSidebarOpen(false);
  };

  const handleAddAllAnimation = () => {
    const allShapes: SlideShape[] = [];
    let shapeIndex = 0;

    // Helper function to create a shape with proper grid positioning
    const createShape = (
      type: string,
      category: AnimationCategory,
      options?: any
    ): SlideShape => {
      const gridIndex = shapeIndex % 9;
      const col = gridIndex % 3;
      const row = Math.floor(gridIndex / 3);

      const baseX = 0.5;
      const baseY = 1.5;
      const itemW = 2.5;
      const itemH = 1.2;
      const gap = 0.2;

      const shape: SlideShape = {
        id: Math.random().toString(36).substr(2, 9),
        shapeType: "rect",
        color: DEFAULT_SHAPE_COLORS[shapeIndex % DEFAULT_SHAPE_COLORS.length],
        animation: {
          type,
          category,
          duration: 1000,
          delay: 0,
          trigger: "onClick",
          options: options || {},
        },
        x: baseX + col * (itemW + gap),
        y: baseY + row * (itemH + gap),
        w: itemW,
        h: itemH,
      };

      shapeIndex++;
      return shape;
    };

    // Process each animation type with all its variations
    ANIMATION_GROUPS.forEach(({ category, items }) => {
      items.forEach((animType) => {
        const config = ANIMATION_OPTIONS_CONFIG[animType];

        if (!config) {
          // No options - add single animation
          allShapes.push(createShape(animType, category));
        } else if (config.isColorPicker) {
          // Color picker animations - add with different colors
          const colors = ["FF0000", "00FF00", "0000FF", "FFFF00"];
          colors.forEach((color) => {
            allShapes.push(
              createShape(animType, category, { [config.key]: color })
            );
          });
        } else if (config.directionKey && config.amountKey) {
          // Animations with both direction and amount (spin, growshrink)
          config.directionOptions?.forEach((dirOpt: any) => {
            config.amountOptions?.forEach((amtOpt: any) => {
              allShapes.push(
                createShape(animType, category, {
                  [config.directionKey]: dirOpt.value,
                  [config.amountKey]: amtOpt.value,
                })
              );
            });
          });
        } else if (config.key === "shape" && config.directionKey) {
          // Shape animations with shape type and direction
          config.options?.forEach((shapeOpt: any) => {
            config.directionOptions?.forEach((dirOpt: any) => {
              allShapes.push(
                createShape(animType, category, {
                  [config.key]: shapeOpt.value,
                  [config.directionKey]: dirOpt.value,
                })
              );
            });
          });
        } else if (config.options) {
          // Regular options (direction, spokes, level, etc.)
          config.options.forEach((opt: any) => {
            allShapes.push(
              createShape(animType, category, { [config.key]: opt.value })
            );
          });
        }
      });
    });

    setShapes(allShapes);
    setCurrentSlide(0);
    setSidebarOpen(false);
  };

  const handleUpdateShape = (updatedShape: SlideShape) => {
    setShapes(shapes.map((s) => (s.id === updatedShape.id ? updatedShape : s)));
  };

  const handleRemoveShape = (id: string) => {
    const newShapes = shapes.filter((s) => s.id !== id);
    setShapes(newShapes);
    if (currentSlide > 0 && startIdx >= newShapes.length) {
      setCurrentSlide(Math.max(0, currentSlide - 1));
    }
  };

  const handleReset = () => {
    setShapes([]);
    setCurrentSlide(0);
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      await generatePptxFile(shapes);
    } catch (error) {
      console.error("Failed to generate PPTX", error);
      alert("Failed to generate PPTX. See console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex-shrink-0 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="hidden sm:block min-w-0">
            <h1 className="text-base uppercase  md:text-lg font-medium text-slate-900 truncate">
              Pptxgenjs - Animations
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all"
            onClick={() => {
              window.open(
                "https://www.npmjs.com/package/@bapunhansdah/pptxgenjs",
                "_blank"
              );
            }}
          >
            <Github className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">Reset</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={shapes.length === 0 || isGenerating}
            className={`
              flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-bold text-white rounded-lg shadow-sm transition-all flex-shrink-0
              ${
                shapes.length === 0
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }
            `}
          >
            {isGenerating ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isGenerating ? "Generating..." : "Download"}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop or Mobile Overlay */}
        <div
          className={`
            fixed md:relative inset-y-14 md:inset-y-0 left-0 z-40 md:z-0 w-64 md:w-72
            transform transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
            md:translate-x-0
          `}
        >
          <Sidebar onAddAnimation={handleAddAnimation} />
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed md:hidden inset-0 top-14 bg-black/30 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-4 h-full p-3 md:p-6 overflow-auto">
            {/* Shape List */}
            <div className="flex-1 flex flex-col h-full min-h-0 lg:min-h-full">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 md:p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Objects</span>
                      <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-medium">
                        {shapes.length}
                      </span>
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => handleAddAllAnimation()}
                      size="sm"
                      className="flex-shrink-0 cursor-pointer"
                      disabled={isGenerating}
                    >
                      Add All Animations
                    </Button>
                  </div>
                  {totalSlides > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentSlide(Math.max(0, currentSlide - 1))
                        }
                        disabled={currentSlide === 0}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        {currentSlide + 1}/{totalSlides}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentSlide(
                            Math.min(totalSlides - 1, currentSlide + 1)
                          )
                        }
                        disabled={currentSlide === totalSlides - 1}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <ShapeList
                  shapes={currentShapes}
                  onRemove={handleRemoveShape}
                  onUpdate={handleUpdateShape}
                  startIdx={startIdx}
                />
              </div>
            </div>

            {/* <div className="flex-1 flex flex-col h-full min-h-0">
              <JSONImport />
            </div> */}

            {/* Code Preview - Hidden on mobile, visible on lg */}
            <div className="hidden lg:flex flex-col h-full min-h-0 flex-1">
              <CodeViewer shapes={shapes} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
