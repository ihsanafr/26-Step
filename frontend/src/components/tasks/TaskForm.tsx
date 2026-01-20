import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import DatePicker from "../form/input/DatePicker";
import Label from "../form/Label";
import { Task, CreateTaskData, UpdateTaskData } from "../../services/tasksService";
import { categoriesService } from "../../services/categoriesService";
import { targetsService, Target } from "../../services/targetsService";

interface TaskFormProps {
  task?: Task;
  onSave: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    status: "todo",
    due_date: "",
    progress: 0,
    target_id: undefined,
    is_recurring: false,
    recurring_type: "daily",
    recurring_end_date: "",
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsMounted(false);
    // Wait for animation to complete before calling onCancel
    setTimeout(() => {
      onCancel();
    }, 250);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading && !isClosing) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isClosing]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    const fetchTargets = async () => {
      try {
        const data = await targetsService.getAll();
        setTargets(data);
      } catch (error) {
        console.error("Error fetching targets:", error);
      }
    };
    
    fetchCategories();
    fetchTargets();
  }, []);

  useEffect(() => {
    if (task) {
      // Normalize old status to new status
      let normalizedStatus = task.status || "todo";
      if (task.status === "pending") normalizedStatus = "todo";
      if (task.status === "in_progress") normalizedStatus = "on_progress";
      if (task.status === "completed") normalizedStatus = "finish";
      
      setFormData({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "",
        priority: task.priority || "medium",
        status: normalizedStatus as any,
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
        progress: task.progress || 0,
        target_id: task.target_id || undefined,
        is_recurring: task.is_recurring || false,
        recurring_type: task.recurring_type || "daily",
        recurring_end_date: task.recurring_end_date ? task.recurring_end_date.split("T")[0] : "",
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("📝 TaskForm: Submitting form with data:", formData);
    try {
      await onSave(formData);
      console.log("✅ TaskForm: Task saved successfully");
    } catch (error: any) {
      console.error("❌ TaskForm: Error saving task:", error);
      console.error("❌ TaskForm: Error response:", error.response?.data);
      console.error("❌ TaskForm: Error status:", error.response?.status);
      alert(`Failed to save task: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleChange = (field: keyof CreateTaskData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading && !isClosing) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-start justify-center bg-black/50 p-4 pt-8 md:pt-16 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto ${
        isMounted && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-2xl my-8 rounded-2xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-800 transition-all duration-300 ease-out ${
          isMounted && !isClosing ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter task description"
                rows={4}
                className="h-24 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Select category (optional)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="target_id">Target</Label>
                <select
                  id="target_id"
                  name="target_id"
                  value={formData.target_id || ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    setFormData((prev) => ({ ...prev, target_id: value }));
                  }}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Select target (optional)</option>
                  {targets.map((target) => (
                    <option key={target.id} value={target.id}>
                      {target.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="status">Status</Label>
                       <select
                         id="status"
                         name="status"
                         value={formData.status}
                         onChange={(e) => handleChange("status", e.target.value)}
                         className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                       >
                         <option value="todo">To Do</option>
                         <option value="on_progress">On Progress</option>
                         <option value="on_hold">On Hold</option>
                         <option value="finish">Finish</option>
                       </select>
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <DatePicker
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={(e) => handleChange("due_date", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <div className="flex items-center gap-4 mt-2">
                <input
                  id="progress"
                  name="progress"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.progress}
                  onChange={(e) => handleChange("progress", parseInt(e.target.value) || 0)}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-brand-500 hover:accent-brand-600 transition-colors"
                  style={{
                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${formData.progress}%, rgb(229 231 235) ${formData.progress}%, rgb(229 231 235) 100%)`
                  }}
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const clampedValue = Math.min(Math.max(value, 0), 100);
                    handleChange("progress", clampedValue);
                  }}
                  className="w-20"
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Recurring Task Section */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="is_recurring"
                  checked={formData.is_recurring || false}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      is_recurring: e.target.checked,
                      recurring_type: e.target.checked ? prev.recurring_type || "daily" : undefined,
                    }));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <Label htmlFor="is_recurring" className="mb-0 cursor-pointer">
                  Make this a recurring task
                </Label>
              </div>

              {formData.is_recurring && (
                <div className="space-y-4 mt-4 pl-7 border-l-2 border-brand-300 dark:border-brand-700">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="recurring_type">Repeat Every</Label>
                      <select
                        id="recurring_type"
                        name="recurring_type"
                        value={formData.recurring_type || "daily"}
                        onChange={(e) => handleChange("recurring_type", e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="recurring_end_date">End Date (Optional)</Label>
                      <DatePicker
                        id="recurring_end_date"
                        name="recurring_end_date"
                        value={formData.recurring_end_date || ""}
                        onChange={(e) => handleChange("recurring_end_date", e.target.value)}
                        min={formData.due_date || new Date().toISOString().split("T")[0]}
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Leave empty to repeat indefinitely
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-500/10">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      <strong>💡 Note:</strong> This task will automatically be created every{" "}
                      {formData.recurring_type === "daily" ? "day" : formData.recurring_type === "weekly" ? "week" : "month"}{" "}
                      starting from the due date. Each instance will appear as a separate task.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading || isClosing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
