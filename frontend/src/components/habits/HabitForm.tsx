import { useState, useEffect } from "react";
import { Habit, CreateHabitData } from "../../services/habitsService";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import DatePicker from "../form/input/DatePicker";
import { formatLocalDate } from "../../utils/date";

interface HabitFormProps {
  habit?: Habit;
  onSave: (data: CreateHabitData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({ habit, onSave, onCancel, isLoading }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState<CreateHabitData>({
    name: habit?.name || "",
    description: habit?.description || "",
    target_days: habit?.target_days || undefined,
    start_date: habit?.start_date || formatLocalDate(new Date()),
    is_active: habit?.is_active ?? true,
    color: habit?.color || "blue",
    icon: habit?.icon || "🔥",
  });

  // Initialize custom values if habit has custom color/icon
  useEffect(() => {
    if (habit) {
      // Check if color is a hex value (custom)
      if (habit.color && habit.color.startsWith("#")) {
        setCustomColor(habit.color);
        setShowCustomColorInput(true);
      }
      // Check if icon is not in predefined options (custom)
      if (habit.icon && !iconOptions.includes(habit.icon)) {
        setCustomIcon(habit.icon);
        setShowCustomIconInput(true);
      }
    }
  }, [habit]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  const colorOptions = [
    { value: "blue", label: "Blue", color: "bg-blue-500", hex: "#3b82f6" },
    { value: "purple", label: "Purple", color: "bg-purple-500", hex: "#a855f7" },
    { value: "green", label: "Green", color: "bg-green-500", hex: "#10b981" },
    { value: "yellow", label: "Yellow", color: "bg-yellow-500", hex: "#eab308" },
    { value: "red", label: "Red", color: "bg-red-500", hex: "#ef4444" },
    { value: "pink", label: "Pink", color: "bg-pink-500", hex: "#ec4899" },
    { value: "orange", label: "Orange", color: "bg-orange-500", hex: "#f97316" },
  ];

  const iconOptions = ["🔥", "💪", "📚", "🏃", "🧘", "💧", "🎯", "✍️", "🎨", "🎵", "🌱", "⚡"];
  
  const [customIcon, setCustomIcon] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [showCustomIconInput, setShowCustomIconInput] = useState(false);
  const [showCustomColorInput, setShowCustomColorInput] = useState(false);

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isMounted && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-transform duration-200 dark:border-gray-700 dark:bg-gray-800 ${
          isMounted && !isClosing ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {habit ? "Edit Habit" : "Create New Habit"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Habit Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Morning Exercise, Read 30 minutes"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add details about your habit..."
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
            <div className="space-y-3">
              <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, icon }));
                      setShowCustomIconInput(false);
                      setCustomIcon("");
                    }}
                    className={`rounded-lg p-3 text-2xl transition-all hover:scale-110 ${
                      formData.icon === icon && !showCustomIconInput
                        ? "bg-brand-100 ring-2 ring-brand-500 dark:bg-brand-500/20"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomIconInput(!showCustomIconInput);
                    if (!showCustomIconInput) {
                      setFormData((prev) => ({ ...prev, icon: customIcon || "" }));
                    } else {
                      setCustomIcon("");
                      setFormData((prev) => ({ ...prev, icon: iconOptions[0] }));
                    }
                  }}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-all ${
                    showCustomIconInput
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {showCustomIconInput ? "✓ Custom Icon" : "+ Custom Icon"}
                </button>
                {showCustomIconInput && (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={customIcon}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomIcon(value);
                        setFormData((prev) => ({ ...prev, icon: value || iconOptions[0] }));
                      }}
                      placeholder="Masukkan emoji atau teks"
                      maxLength={2}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-2xl focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    {customIcon && (
                      <div className="rounded-lg bg-gray-100 p-2 text-2xl dark:bg-gray-700">
                        {customIcon}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, color: option.value }));
                      setShowCustomColorInput(false);
                      setCustomColor("");
                    }}
                    className={`rounded-lg p-4 transition-all hover:scale-110 ${option.color} ${
                      formData.color === option.value && !showCustomColorInput
                        ? "ring-4 ring-gray-400 dark:ring-gray-500"
                        : ""
                    }`}
                    title={option.label}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomColorInput(!showCustomColorInput);
                    if (!showCustomColorInput) {
                      setFormData((prev) => ({ ...prev, color: customColor || colorOptions[0].value }));
                    } else {
                      setCustomColor("");
                      setFormData((prev) => ({ ...prev, color: colorOptions[0].value }));
                    }
                  }}
                  className={`flex-shrink-0 rounded-lg border px-3 py-2 text-sm transition-all ${
                    showCustomColorInput
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {showCustomColorInput ? "✓ Custom" : "+ Custom"}
                </button>
                {showCustomColorInput && (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="color"
                      value={customColor || "#3b82f6"}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomColor(value);
                        setFormData((prev) => ({ ...prev, color: value }));
                      }}
                      className="h-10 w-20 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColor || "#3b82f6"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === "") {
                          setCustomColor(value);
                          if (value.length === 7) {
                            setFormData((prev) => ({ ...prev, color: value }));
                          }
                        }
                      }}
                      placeholder="#3b82f6"
                      maxLength={7}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <div
                      className="h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: customColor || "#3b82f6" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <DatePicker
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Target Days */}
            <div>
              <label htmlFor="target_days" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Days (Optional)
              </label>
              <Input
                type="number"
                id="target_days"
                name="target_days"
                value={formData.target_days || ""}
                onChange={handleChange}
                placeholder="e.g., 30, 90, 365"
                min="1"
              />
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active habit (track daily progress)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : habit ? "Update Habit" : "Create Habit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;

