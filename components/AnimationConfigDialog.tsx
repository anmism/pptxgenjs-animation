import {
  ANIMATION_OPTIONS_CONFIG,
} from "@/constants";
import { AnimationOptions, SlideShape } from "@/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface AnimationConfigDialogProps {
  open: boolean;
  shape: SlideShape | null;
  onSave: (updatedShape: SlideShape) => void;
  onOpenChange: (open: boolean) => void;
}

const AnimationConfigDialog: React.FC<AnimationConfigDialogProps> = ({
  open,
  shape,
  onSave,
  onOpenChange,
}) => {
  const [duration, setDuration] = useState(1000);
  const [delay, setDelay] = useState(0);
  const [trigger, setTrigger] = useState("onClick");
  const [primaryOption, setPrimaryOption] = useState("");
  const [secondaryOption, setSecondaryOption] = useState("");
  const [color, setColor] = useState("FFFF00");

  // Initialize form values when shape changes
  useEffect(() => {
    if (shape) {
      setDuration(shape.animation.duration || 1000);
      setDelay(shape.animation.delay || 0);
      setTrigger(shape.animation.trigger || "onClick");

      const options = shape.animation.options || {};
      console.log(options);
      const config =
        ANIMATION_OPTIONS_CONFIG[shape.animation.type.toLowerCase()];

      if (config) {
        // Set primary option (direction, shape, spokes, etc.)
        if (config.key && options[config.key]) {
          setPrimaryOption(String(options[config.key]));
        } else if (config.directionOptions && options.direction) {
          setPrimaryOption(String(options.direction));
        } else {
          setPrimaryOption("");
        }

        // Set secondary option (for animations with amount)
        if (config.amountKey && options[config.amountKey]) {
          setSecondaryOption(String(options[config.amountKey]));
        } else if (config.directionKey && options[config.directionKey]) {
          setSecondaryOption(String(options[config.directionKey]));
        } else {
          setSecondaryOption("");
        }

        // Set color
        if (config.isColorPicker && options.color) {
          setColor(options.color);
        }
      }
    }
  }, [shape]);

  if (!shape || !open) return null;

  const config = ANIMATION_OPTIONS_CONFIG[shape.animation.type.toLowerCase()];

  const handleSave = () => {
    const updatedShape: SlideShape = {
      ...shape,
      animation: {
        ...shape.animation,
        duration,
        delay,
        trigger,
        options: {},
      },
    };

    // Build options object based on config
    if (config) {
      const options: AnimationOptions = {};
      console.log(config);

      // Handle color picker animations
      if (config.isColorPicker) {
        options.color = color;
      }

            // Handle shape animations (shape + direction)
      else if (config.key && config.directionKey) {
        if (primaryOption) options[config.key] = primaryOption;
        if (secondaryOption) options[config.directionKey] = secondaryOption;
      }

      // Handle standard option (direction, shape, spokes, etc.)
      else if (config.options && primaryOption ) {
        const key = config.key;
        // Convert to number for spokes
        options[key] = key === "spokes" ? Number(primaryOption) : primaryOption;
      }

      // Handle animations with both direction and amount (spin, growshrink)
      else if (config.directionOptions && config.amountOptions) {
        if (primaryOption) options.direction = primaryOption;
        if (secondaryOption) options.amount = secondaryOption;
      }




      // Only add options if there are any
      if (Object.keys(options).length > 0) {
        updatedShape.animation.options = options;
      }
    }

    onSave(updatedShape);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Configure {shape.animation.type}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (ms)
            </label>
            <input
              type="number"
              min="100"
              step="100"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Delay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delay (ms)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trigger */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="onClick">On Click</option>
              <option value="withPrevious">With Previous</option>
              <option value="afterPrevious">After Previous</option>
            </select>
          </div>

          {/* Animation-specific options */}
          {config && (
            <>
              {/* Color Picker */}
              {config.isColorPicker && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {config.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={`#${color}`}
                      onChange={(e) =>
                        setColor(e.target.value.replace("#", ""))
                      }
                      className="h-10 w-20 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) =>
                        setColor(e.target.value.replace("#", ""))
                      }
                      placeholder="FFFF00"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Standard options (direction, shape, spokes, etc.) */}
              {config.options && !config.directionOptions && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {config.label}
                  </label>
                  <select
                    value={primaryOption}
                    onChange={(e) => setPrimaryOption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select {config.label.toLowerCase()}
                    </option>
                    {config.options.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Shape with direction */}
              {config.key && config.directionKey && config.options && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shape
                    </label>
                    <select
                      value={primaryOption}
                      onChange={(e) => setPrimaryOption(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select shape</option>
                      {config.options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Direction
                    </label>
                    <select
                      value={secondaryOption}
                      onChange={(e) => setSecondaryOption(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select direction</option>
                      {config.directionOptions.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Direction + Amount (spin, growshrink) */}
              {config.directionOptions && config.amountOptions && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Direction
                    </label>
                    <select
                      value={primaryOption}
                      onChange={(e) => setPrimaryOption(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select direction</option>
                      {config.directionOptions.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <select
                      value={secondaryOption}
                      onChange={(e) => setSecondaryOption(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select amount</option>
                      {config.amountOptions.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimationConfigDialog;
