import { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { Task, tasksService } from "../../services/tasksService";
import { PlusIcon, PencilIcon, TrashBinIcon, CheckCircleIcon, TimeIcon, ListIcon, GridIcon, TableIcon, BoltIcon, AlertIcon } from "../../icons";
import TaskForm from "./TaskForm";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { TaskCardSkeleton, KanbanCardSkeleton } from "../common/Skeleton";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; task: Task | null }>({
    isOpen: false,
    task: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "kanban">("list");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter, categoryFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.category === categoryFilter);
    }

    setFilteredTasks(filtered);
  };

  const upsertTask = (task: Task) => {
    setTasks((prev) => {
      const index = prev.findIndex((item) => item.id === task.id);
      if (index === -1) {
        return [task, ...prev];
      }
      const next = [...prev];
      next[index] = task;
      return next;
    });
  };

  const removeTask = (taskId: number) => {
    setTasks((prev) => prev.filter((item) => item.id !== taskId));
  };

  const handleCreate = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      console.log("💾 TaskList: handleSave called with data:", data);
      
      if (editingTask) {
        console.log("📝 TaskList: Updating existing task ID:", editingTask.id);
        const updated = await tasksService.update(editingTask.id, data);
        console.log("✅ TaskList: Task updated successfully");
        upsertTask(updated);
      } else {
        console.log("🆕 TaskList: Creating new task...");
        const result = await tasksService.create(data);
        console.log("✅ TaskList: Task created successfully:", result);
        upsertTask(result);
      }
      
      setShowForm(false);
      setEditingTask(undefined);
    } catch (error: any) {
      console.error("❌ TaskList: Error saving task:", error);
      console.error("❌ TaskList: Error details:", error.response?.data);
      console.error("❌ TaskList: Error status:", error.response?.status);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (task: Task) => {
    setDeleteModal({ isOpen: true, task });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.task) return;

    try {
      setDeleting(true);
      const taskId = deleteModal.task.id;
      removeTask(taskId);
      await tasksService.delete(taskId);
      setDeleteModal({ isOpen: false, task: null });
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    // Toggle between todo and finish
    const newStatus = (task.status === "finish" || task.status === "completed") ? "todo" : "finish";
    try {
      const nextProgress = newStatus === "finish" ? 100 : task.progress;
      upsertTask({ ...task, status: newStatus as Task["status"], progress: nextProgress });
      const updated = await tasksService.update(task.id, { status: newStatus as any, progress: nextProgress });
      upsertTask(updated);
    } catch (error) {
      upsertTask(task);
      console.error("Error updating task:", error);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      const nextProgress = newStatus === "finish" ? 100 : task.progress;
      upsertTask({ ...task, status: newStatus as Task["status"], progress: nextProgress });
      const updated = await tasksService.update(task.id, { status: newStatus as any, progress: nextProgress });
      upsertTask(updated);
    } catch (error) {
      upsertTask(task);
      console.error("Error updating task status:", error);
    }
  };

  // Drag and Drop handlers - Simplified and more reliable
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    console.log("🎯 Drag Start:", task.title);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify(task));
  };

  const handleDragEnd = () => {
    console.log("🏁 Drag End");
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    console.log("📥 Drag Enter Column:", columnId);
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear if we're actually leaving the drop zone
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🎁 Drop Event Triggered! Target Status:", targetStatus);
    
    if (!draggedTask) {
      console.error("❌ No dragged task!");
      return;
    }
    
    console.log("📦 Dropping task:", draggedTask.title, "from", draggedTask.status, "to", targetStatus);
    
    // Normalize current status for comparison
    const normalizeStatus = (status: string) => {
      const statusMap: Record<string, string> = {
        "pending": "todo",
        "in_progress": "on_progress",
        "completed": "finish"
      };
      return statusMap[status] || status;
    };
    
    const currentStatus = normalizeStatus(draggedTask.status);
    
    // Only update if status is different
    if (currentStatus !== targetStatus) {
      console.log("✅ Updating status from", currentStatus, "to", targetStatus);
      try {
        await handleStatusChange(draggedTask, targetStatus);
        console.log("✅ Status updated successfully!");
      } catch (error) {
        console.error("❌ Error updating status:", error);
      }
    } else {
      console.log("ℹ️ Status is the same, no update needed");
    }
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "finish":
        return "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400";
      case "in_progress":
      case "on_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "pending":
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "on_progress":
        return "On Progress";
      case "on_hold":
        return "On Hold";
      case "finish":
        return "Finish";
      // Legacy status support
      case "pending":
        return "To Do";
      case "in_progress":
        return "On Progress";
      case "completed":
        return "Finish";
      default:
        return status;
    }
  };

  // Due Date Indicator Helper
  const getDueDateStatus = (dueDate: string | undefined): "overdue" | "due-today" | "due-soon" | "upcoming" | null => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "due-today";
    if (diffDays <= 3) return "due-soon";
    if (diffDays <= 7) return "upcoming";
    return null;
  };

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed" || t.status === "finish").length,
    inProgress: tasks.filter((t) => t.status === "in_progress" || t.status === "on_progress").length,
    pending: tasks.filter((t) => t.status === "pending" || t.status === "todo").length,
    onHold: tasks.filter((t) => t.status === "on_hold").length,
    completionRate: tasks.length > 0 
      ? (tasks.filter((t) => t.status === "completed" || t.status === "finish").length / tasks.length) * 100 
      : 0,
    highPriority: tasks.filter((t) => t.priority === "high" && t.status !== "completed" && t.status !== "finish").length,
  };


  // Get overdue tasks
  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      dueDate.setHours(0, 0, 0, 0);
      const isCompleted = task.status === "completed" || task.status === "finish";
      return !isCompleted && dueDate < today;
    });
  };

  const overdueTasks = getOverdueTasks();

  const getDueDateBadge = (dueDate: string | undefined) => {
    const status = getDueDateStatus(dueDate);
    if (!status) return null;
    
    const configs = {
      overdue: { label: "Overdue", className: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30" },
      "due-today": { label: "Due Today", className: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30" },
      "due-soon": { label: "Due Soon", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30" },
      upcoming: { label: "This Week", className: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30" },
    };
    
    const config = configs[status];
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const kanbanColumns = [
    { id: "todo", title: "To Do", color: "gray" },
    { id: "on_progress", title: "On Progress", color: "blue" },
    { id: "on_hold", title: "On Hold", color: "yellow" },
    { id: "finish", title: "Finish", color: "green" },
  ];

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => {
      // Support both new and legacy status
      if (status === "todo") return task.status === "todo" || task.status === "pending";
      if (status === "on_progress") return task.status === "on_progress" || task.status === "in_progress";
      if (status === "finish") return task.status === "finish" || task.status === "completed";
      return task.status === status;
    });
  };

  const categories = Array.from(new Set(tasks.map((t) => t.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Filter Skeleton */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1 h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex gap-3">
              <div className="h-11 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-11 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Task Cards Skeleton - Based on viewMode */}
        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["todo", "on_progress", "on_hold", "finish"].map((status) => (
              <div key={status} className="space-y-3">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                {[1, 2, 3].map((i) => (
                  <KanbanCardSkeleton key={i} />
                ))}
              </div>
            ))}
          </div>
        ) : viewMode === "list" ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <TaskCardSkeleton key={i} viewMode="list" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TaskCardSkeleton key={i} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your daily tasks</p>
          </div>
          <div className="flex gap-3">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                } rounded-l-lg`}
                title="List view"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
                title="Grid view"
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "kanban"
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                } rounded-r-lg`}
                title="Kanban view"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={handleCreate} startIcon={<PlusIcon className="w-5 h-5" />}>
              New Task
            </Button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Tasks - Blue */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02] hover:border-blue-300 dark:border-gray-700 dark:from-blue-500/10 dark:to-blue-500/5 dark:hover:border-blue-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {stats.completionRate > 0 ? `${Math.round(stats.completionRate)}% completed` : "No tasks yet"}
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-500/20">
                <ListIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Completed - Purple */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02] hover:border-purple-300 dark:border-gray-700 dark:from-purple-500/10 dark:to-purple-500/5 dark:hover:border-purple-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% of total` : "Great job!"}
                </p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3 transition-transform group-hover:scale-110 dark:bg-purple-500/20">
                <CheckCircleIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* In Progress - Green */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02] hover:border-green-300 dark:border-gray-700 dark:from-green-500/10 dark:to-green-500/5 dark:hover:border-green-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {stats.onHold > 0 ? `${stats.onHold} on hold` : "Keep going!"}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-3 transition-transform group-hover:scale-110 dark:bg-green-500/20">
                <BoltIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Overdue - Red */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-red-50 to-red-100 p-5 shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02] hover:border-red-300 dark:border-gray-700 dark:from-red-500/10 dark:to-red-500/5 dark:hover:border-red-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{overdueTasks.length}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {stats.highPriority > 0 ? `${stats.highPriority} high priority` : "All on track"}
                </p>
              </div>
              <div className="rounded-lg bg-red-100 p-3 transition-transform group-hover:scale-110 dark:bg-red-500/20">
                <AlertIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                <svg
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 min-w-[140px] rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="on_progress">On Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="finish">Finish</option>
              </select>
              {categories.length > 0 && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-11 min-w-[140px] rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <ListIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">No tasks found</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try changing filters or search keywords"
                : "Start by creating a new task"}
            </p>
          </div>
        ) : viewMode === "kanban" ? (
          // Kanban View
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kanbanColumns.map((column) => {
              const columnTasks = getTasksByStatus(column.id);
              const isOver = dragOverColumn === column.id;
              return (
                <div key={column.id} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      column.color === "green" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                      column.color === "blue" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                      column.color === "yellow" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
                      "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                    }`}>
                      {columnTasks.length}
                    </span>
                  </div>
                  <div 
                    className={`flex flex-col gap-3 min-h-[200px] rounded-lg p-3 transition-all ${
                      isOver 
                        ? "bg-brand-50 border-2 border-dashed border-brand-400 dark:bg-brand-500/10 dark:border-brand-500" 
                        : columnTasks.length === 0
                        ? "bg-gray-50 border-2 border-dashed border-gray-300 dark:bg-gray-800/30 dark:border-gray-700"
                        : "bg-transparent border-2 border-transparent"
                    }`}
                    onDragOver={(e) => handleDragOver(e)}
                    onDragEnter={(e) => handleDragEnter(e, column.id)}
                    onDragLeave={(e) => handleDragLeave(e)}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    {columnTasks.length === 0 && !isOver && (
                      <div className="flex h-full items-center justify-center py-8">
                        <p className="text-sm text-gray-400 dark:text-gray-600">
                          {draggedTask ? "Drop here" : "No tasks"}
                        </p>
                      </div>
                    )}
                    {isOver && columnTasks.length === 0 && (
                      <div className="flex h-full items-center justify-center py-8">
                        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
                          Drop task here
                        </p>
                      </div>
                    )}
                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`group rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                          draggedTask?.id === task.id 
                            ? "opacity-50 border-brand-400 ring-2 ring-brand-400/50 dark:border-brand-500 dark:ring-brand-500/50" 
                            : "border-gray-200 dark:border-gray-700"
                        } dark:bg-gray-800`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            {/* Drag Handle */}
                            <div className="cursor-grab active:cursor-grabbing pt-0.5 text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM5 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                              </svg>
                            </div>
                            <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                              {task.title}
                            </h4>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button
                              onClick={() => handleEdit(task)}
                              onMouseDown={(e) => e.stopPropagation()}
                              draggable={false}
                              className="rounded p-1.5 text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                              title="Edit task"
                            >
                              <PencilIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(task)}
                              onMouseDown={(e) => e.stopPropagation()}
                              draggable={false}
                              className="rounded p-1.5 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/20"
                              title="Delete task"
                            >
                              <TrashBinIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="mb-3 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                            {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                          </span>
                          {task.category && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              {task.category}
                            </span>
                          )}
                          {task.target && (
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-500/20 dark:text-purple-400">
                              🎯 {task.target.title}
                            </span>
                          )}
                        </div>

                        {task.due_date && (
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <TimeIcon className="w-3 h-3" />
                              {new Date(task.due_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                            </div>
                            {getDueDateBadge(task.due_date)}
                          </div>
                        )}

                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{task.progress}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-full transition-all ${
                                task.progress >= 100
                                  ? "bg-green-600 dark:bg-green-500"
                                  : task.progress >= 75
                                  ? "bg-blue-600 dark:bg-blue-500"
                                  : task.progress >= 50
                                  ? "bg-yellow-600 dark:bg-yellow-500"
                                  : "bg-red-600 dark:bg-red-500"
                              }`}
                              style={{ width: `${Math.max(task.progress, 0)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "grid gap-4"}>
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02] hover:border-brand-300 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-brand-500"
              >
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className={`shrink-0 rounded-full p-1.5 transition-all hover:scale-110 ${
                          task.status === "completed" || task.status === "finish"
                            ? "text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-500/10"
                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        }`}
                        title={task.status === "completed" ? "Mark as pending" : "Mark as complete"}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => handleEdit(task)}
                          className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                          title="Edit task"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(task)}
                          className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/20"
                          title="Delete task"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3
                        className={`text-lg font-semibold leading-tight ${
                          task.status === "completed" || task.status === "finish"
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>

                    {task.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Category:</span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {task.category}
                        </span>
                      </div>
                    )}

                    {task.target && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Target:</span>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/20 dark:text-purple-400">
                          🎯 {task.target.title}
                        </span>
                      </div>
                    )}

                    {task.due_date && (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <TimeIcon className="w-3.5 h-3.5" />
                          {new Date(task.due_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        {getDueDateBadge(task.due_date)}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-2 transition-all ${
                            task.progress >= 100
                              ? "bg-green-600 dark:bg-green-500"
                              : task.progress >= 75
                              ? "bg-blue-600 dark:bg-blue-500"
                              : task.progress >= 50
                              ? "bg-yellow-600 dark:bg-yellow-500"
                              : "bg-red-600 dark:bg-red-500"
                          }`}
                          style={{ width: `${Math.max(task.progress, 0)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{task.progress}%</span>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleStatus(task)}
                          className={`mt-0.5 shrink-0 rounded-full p-1.5 transition-all hover:scale-110 ${
                            task.status === "completed" || task.status === "finish"
                              ? "text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-500/10"
                              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                          }`}
                          title={task.status === "completed" ? "Mark as pending" : "Mark as complete"}
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-semibold leading-tight ${
                              task.status === "completed" || task.status === "finish"
                                ? "line-through text-gray-500 dark:text-gray-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                          {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                        {task.category && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {task.category}
                          </span>
                        )}
                        {task.target && (
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/20 dark:text-purple-400">
                            🎯 {task.target.title}
                          </span>
                        )}
                        {task.due_date && (
                          <div className="inline-flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                              <TimeIcon className="w-3.5 h-3.5" />
                              {new Date(task.due_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            {getDueDateBadge(task.due_date)}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-2 transition-all ${
                              task.progress >= 100
                                ? "bg-green-600 dark:bg-green-500"
                                : task.progress >= 75
                                ? "bg-blue-600 dark:bg-blue-500"
                                : task.progress >= 50
                                ? "bg-yellow-600 dark:bg-yellow-500"
                                : "bg-red-600 dark:bg-red-500"
                            }`}
                            style={{ width: `${Math.max(task.progress, 0)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{task.progress}%</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => handleEdit(task)}
                        className="rounded-lg p-2.5 text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                        title="Edit task"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task)}
                        className="rounded-lg p-2.5 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/20"
                        title="Delete task"
                      >
                        <TrashBinIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm task={editingTask} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={saving} />
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, task: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        itemName={deleteModal.task?.title}
        isLoading={deleting}
      />
    </>
  );
};

export default TaskList;
