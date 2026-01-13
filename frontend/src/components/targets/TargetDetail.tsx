import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Target, targetsService } from "../../services/targetsService";
import { Task, tasksService } from "../../services/tasksService";
import { PlusIcon, PencilIcon, TrashBinIcon, ChevronLeftIcon, CheckCircleIcon, TimeIcon } from "../../icons";
import Button from "../ui/button/Button";
import TaskForm from "../tasks/TaskForm";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import PageMeta from "../common/PageMeta";
import { TaskCardSkeleton } from "../common/Skeleton";

const TargetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [target, setTarget] = useState<Target | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; task: Task | null }>({
    isOpen: false,
    task: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadTarget();
      loadTasks();
    }
  }, [id]);

  const loadTarget = async () => {
    try {
      const data = await targetsService.getById(parseInt(id!));
      setTarget(data);
    } catch (error) {
      console.error("Error loading target:", error);
      navigate("/tasks/targets");
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const allTasks = await tasksService.getAll();
      // Filter tasks that belong to this target
      const targetTasks = allTasks.filter((task) => task.target_id === parseInt(id!));
      setTasks(targetTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = async (data: any) => {
    try {
      setSaving(true);
      // Always set target_id for tasks created from target detail
      const taskData = { ...data, target_id: parseInt(id!) };
      
      if (editingTask) {
        await tasksService.update(editingTask.id, taskData);
      } else {
        await tasksService.create(taskData);
      }
      setShowTaskForm(false);
      setEditingTask(undefined);
      await loadTasks();
      // Reload target to get updated values
      await loadTarget();
    } catch (error) {
      console.error("Error saving task:", error);
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
      await tasksService.delete(deleteModal.task.id);
      setDeleteModal({ isOpen: false, task: null });
      await loadTasks();
      // Reload target to get updated values
      await loadTarget();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    const newStatus = (task.status === "finish" || task.status === "completed") ? "todo" : "finish";
    try {
      await tasksService.update(task.id, { status: newStatus as any, progress: newStatus === "finish" ? 100 : task.progress });
      await loadTasks();
      // Reload target to get updated values
      await loadTarget();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const getProgressPercentage = (target: Target) => {
    if (target.target_value === 0) return 0;
    return Math.min((target.current_value / target.target_value) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-600 dark:bg-green-500";
    if (percentage >= 75) return "bg-blue-600 dark:bg-blue-500";
    if (percentage >= 50) return "bg-yellow-600 dark:bg-yellow-500";
    return "bg-red-600 dark:bg-red-500";
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

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Target Info Skeleton */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex gap-4 mt-4">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mt-4"></div>
          </div>
        </div>

        {/* Tasks Section Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <TaskCardSkeleton key={i} viewMode="grid" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!target) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-800">
        <p className="text-lg font-medium text-gray-900 dark:text-white">Target not found</p>
        <Button onClick={() => navigate("/tasks/targets")} className="mt-4">
          Back to Targets
        </Button>
      </div>
    );
  }

  const progress = getProgressPercentage(target);
  const completedTasks = tasks.filter((t) => t.status === "finish" || t.status === "completed").length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <>
      <PageMeta
        title={`${target.title} - Target & Goals - 26-step`}
        description={target.description || `View details and tasks for ${target.title}`}
      />
      
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/tasks/targets")}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back to Targets & Goals
        </button>

        {/* Target Header Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{target.title}</h1>
              {target.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">{target.description}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 capitalize">
                  {target.period}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${
                    target.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                      : target.status === "completed"
                      ? "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                  }`}
                >
                  {target.status}
                </span>
                {target.start_date && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                    <TimeIcon className="w-4 h-4" />
                    Start: {new Date(target.start_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
                {target.end_date && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                    <TimeIcon className="w-4 h-4" />
                    End: {new Date(target.end_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>

              {/* Target Progress */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-300">Target Progress</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {target.current_value} / {target.target_value} ({Math.round(progress)}%)
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className={`h-full transition-all ${getProgressColor(progress)}`} style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Task Statistics */}
              {totalTasks > 0 && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Task Completion</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {completedTasks} / {totalTasks} ({Math.round(taskCompletionRate)}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all dark:from-purple-400 dark:to-purple-500"
                      style={{ width: `${taskCompletionRate}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Tasks related to this target ({tasks.length} {tasks.length === 1 ? "task" : "tasks"})
              </p>
            </div>
            <Button onClick={handleCreateTask} startIcon={<PlusIcon className="w-5 h-5" />}>
              Add Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-900/50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <TimeIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">No tasks yet</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Get started by adding tasks to achieve this target
              </p>
              <Button onClick={handleCreateTask} startIcon={<PlusIcon className="w-5 h-5" />} className="mt-4">
                Add First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className={`mt-0.5 shrink-0 rounded-full p-1.5 transition-all hover:scale-110 ${
                          task.status === "completed" || task.status === "finish"
                            ? "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10"
                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        }`}
                        title={task.status === "completed" || task.status === "finish" ? "Mark as pending" : "Mark as complete"}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-base font-semibold leading-tight ${
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
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                            {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusColor(task.status)}`}>
                            {getStatusLabel(task.status)}
                          </span>
                          {task.due_date && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                              <TimeIcon className="w-3.5 h-3.5" />
                              {new Date(task.due_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                        {task.progress > 0 && (
                          <div className="mt-3 flex items-center gap-3">
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
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{task.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => handleEditTask(task)}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(undefined);
          }}
          isLoading={saving}
        />
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

export default TargetDetail;

