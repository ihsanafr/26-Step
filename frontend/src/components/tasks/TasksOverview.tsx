import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Task, tasksService } from "../../services/tasksService";
import { Target, targetsService } from "../../services/targetsService";
import { GridIcon, CheckCircleIcon, TimeIcon, ListIcon, TargetIcon, EyeIcon, AlertIcon, BoltIcon } from "../../icons";
import { OverviewSectionSkeleton } from "../common/Skeleton";

const TasksOverview: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, targetsData] = await Promise.all([
        tasksService.getAll(),
        targetsService.getAll(),
      ]);
      setTasks(tasksData);
      setTargets(targetsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats with new status support
  const stats = {
    tasks: {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "completed" || t.status === "finish").length,
      inProgress: tasks.filter((t) => t.status === "in_progress" || t.status === "on_progress").length,
      pending: tasks.filter((t) => t.status === "pending" || t.status === "todo").length,
      onHold: tasks.filter((t) => t.status === "on_hold").length,
      completionRate: tasks.length > 0 
        ? (tasks.filter((t) => t.status === "completed" || t.status === "finish").length / tasks.length) * 100 
        : 0,
    },
    targets: {
      total: targets.length,
      active: targets.filter((t) => t.status === "active").length,
      completed: targets.filter((t) => t.status === "completed").length,
      paused: targets.filter((t) => t.status === "paused").length,
      averageProgress: targets.length > 0
        ? targets.reduce((sum, t) => sum + (t.target_value > 0 ? (t.current_value / t.target_value) * 100 : 0), 0) / targets.length
        : 0,
    },
  };

  // Get tasks count per target
  const getTasksCountForTarget = (targetId: number) => {
    return tasks.filter((t) => t.target_id === targetId).length;
  };

  const getCompletedTasksCountForTarget = (targetId: number) => {
    return tasks.filter((t) => t.target_id === targetId && (t.status === "completed" || t.status === "finish")).length;
  };

  // Get upcoming tasks (due in next 7 days)
  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      dueDate.setHours(0, 0, 0, 0);
      const isCompleted = task.status === "completed" || task.status === "finish";
      return !isCompleted && dueDate >= today && dueDate <= nextWeek;
    }).sort((a, b) => {
      if (!a.due_date || !b.due_date) return 0;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
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

  // Calculate tasks by priority
  const tasksByPriority = {
    high: tasks.filter((t) => t.priority === "high" && t.status !== "completed" && t.status !== "finish").length,
    medium: tasks.filter((t) => t.priority === "medium" && t.status !== "completed" && t.status !== "finish").length,
    low: tasks.filter((t) => t.priority === "low" && t.status !== "completed" && t.status !== "finish").length,
  };

  // Calculate tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (task.category) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const upcomingTasks = getUpcomingTasks();
  const overdueTasks = getOverdueTasks();

  if (loading) {
    return <OverviewSectionSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">Tasks & Targets Dashboard</h1>
          <p className="mb-6 text-lg text-blue-100 md:text-xl">
            Manage your daily tasks and achieve your targets
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/tasks/list"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ListIcon className="h-4 w-4" />
              Task List
            </Link>
            <Link
              to="/tasks/targets"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <TargetIcon className="h-4 w-4" />
              Targets
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Tasks Statistics */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-500/20">
            <ListIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks Statistics</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Summary of your tasks statistics</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-blue-500/10 dark:to-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
                <ListIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tasks.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-green-500/10 dark:to-green-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tasks.completed}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-yellow-500/10 dark:to-yellow-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-500/20">
                <TimeIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tasks.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-gray-500/10 dark:to-gray-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-500/20">
                <GridIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tasks.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-5 shadow-theme-xs transition-all hover:shadow-theme-sm dark:border-gray-700 dark:from-gray-900/50 dark:to-blue-500/10">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Completion Rate</span>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                {stats.tasks.completed} of {stats.tasks.total} tasks completed
              </p>
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(stats.tasks.completionRate)}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 transition-all duration-500 dark:from-blue-400 dark:via-blue-500 dark:to-green-400"
              style={{ width: `${stats.tasks.completionRate}%` }}
            />
          </div>
        </div>
      </section>

      {/* Targets & Goals Statistics */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-500/20">
            <TargetIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Target & Goals Statistics</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Summary of your targets and goals</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-purple-500/10 dark:to-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
                <TargetIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Targets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.targets.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-blue-500/10 dark:to-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
                <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.targets.active}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-green-500/10 dark:to-green-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.targets.completed}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-yellow-500/10 dark:to-yellow-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-500/20">
                <TimeIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paused</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.targets.paused}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50 p-5 shadow-theme-xs transition-all hover:shadow-theme-sm dark:border-gray-700 dark:from-gray-900/50 dark:to-purple-500/10">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Average Progress</span>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                Across {stats.targets.total} {stats.targets.total === 1 ? "target" : "targets"}
              </p>
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(stats.targets.averageProgress)}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 transition-all duration-500 dark:from-purple-400 dark:via-purple-500 dark:to-indigo-400"
              style={{ width: `${Math.min(stats.targets.averageProgress, 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Quick Insights */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-500/20">
            <BoltIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Insights</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Important metrics at a glance</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Overdue Tasks */}
          <Link
            to="/tasks/list"
            className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-red-500/10 dark:to-red-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-500/20">
                <AlertIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueTasks.length}</p>
              </div>
            </div>
          </Link>

          {/* Upcoming Tasks */}
          <Link
            to="/tasks/list"
            className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-blue-500/10 dark:to-blue-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
                <TimeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming (7 days)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingTasks.length}</p>
              </div>
            </div>
          </Link>

          {/* High Priority Tasks */}
          <Link
            to="/tasks/list"
            className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-orange-500/10 dark:to-orange-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
                <BoltIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasksByPriority.high}</p>
              </div>
            </div>
          </Link>

          {/* Active Targets */}
          <Link
            to="/tasks/targets"
            className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-purple-500/10 dark:to-purple-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
                <TargetIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Targets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.targets.active}</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-500/20">
              <TimeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Tasks</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks due in the next 7 days</p>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingTasks.slice(0, 5).map((task) => {
              const dueDate = new Date(task.due_date!);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const diffTime = dueDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isToday = diffDays === 0;

              return (
                <Link
                  key={task.id}
                  to="/tasks/list"
                  className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`shrink-0 rounded-lg px-3 py-1.5 text-center ${
                      isToday
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                        : diffDays <= 3
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                    }`}>
                      <div className="text-xs font-medium">
                        {isToday ? "Today" : diffDays === 1 ? "Tomorrow" : `${diffDays} days`}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                            : "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                        }`}>
                          {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                        </span>
                        {task.category && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </Link>
              );
            })}
          </div>
          {upcomingTasks.length > 5 && (
            <div className="mt-4 text-center">
              <Link
                to="/tasks/list"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all {upcomingTasks.length} upcoming tasks →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-theme-sm dark:border-red-500/30 dark:bg-red-500/10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-100 p-3 dark:bg-red-500/20">
                <AlertIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-900 dark:text-red-300">Overdue Tasks</h2>
                <p className="text-sm text-red-700 dark:text-red-400">Tasks that are past their due date</p>
              </div>
            </div>
            <Link
              to="/tasks/list"
              className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {overdueTasks.slice(0, 5).map((task) => {
              const dueDate = new Date(task.due_date!);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const diffTime = today.getTime() - dueDate.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return (
                <Link
                  key={task.id}
                  to="/tasks/list"
                  className="group flex items-center justify-between rounded-lg border border-red-200 bg-white p-4 transition-all duration-300 hover:border-red-300 hover:shadow-md hover:scale-[1.01] dark:border-red-500/30 dark:bg-gray-800 dark:hover:border-red-500/50"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="shrink-0 rounded-lg bg-red-100 px-3 py-1.5 text-center dark:bg-red-500/20">
                      <div className="text-xs font-semibold text-red-700 dark:text-red-400">
                        {diffDays === 1 ? "1 day" : `${diffDays} days`} ago
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {task.title}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                            : "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                        }`}>
                          {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                        </span>
                        {task.category && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {task.category}
                          </span>
                        )}
                        {task.target && (
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            📍 {task.target.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </Link>
              );
            })}
          </div>
          {overdueTasks.length > 5 && (
            <div className="mt-4 text-center">
              <Link
                to="/tasks/list"
                className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                View all {overdueTasks.length} overdue tasks →
              </Link>
            </div>
          )}
        </section>
      ) : null}

      {/* Tasks by Priority */}
      {Object.values(tasksByPriority).some(count => count > 0) && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3 dark:bg-orange-500/20">
              <BoltIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks by Priority</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active tasks grouped by priority level</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-red-500/10 dark:to-red-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-500/20">
                  <BoltIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasksByPriority.high}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-yellow-500/10 dark:to-yellow-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-500/20">
                  <TimeIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Medium Priority</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasksByPriority.medium}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-green-500/10 dark:to-green-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Priority</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasksByPriority.low}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active Targets with Tasks */}
      {targets.filter((t) => t.status === "active").length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-500/20">
              <TargetIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Targets & Goals</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your active targets with related tasks</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {targets
              .filter((t) => t.status === "active")
              .map((target) => {
                const targetProgress = target.target_value > 0 
                  ? Math.min((target.current_value / target.target_value) * 100, 100) 
                  : 0;
                const tasksCount = getTasksCountForTarget(target.id);
                const completedTasksCount = getCompletedTasksCountForTarget(target.id);
                const taskProgress = tasksCount > 0 ? (completedTasksCount / tasksCount) * 100 : 0;

                return (
                  <Link
                    key={target.id}
                    to={`/tasks/targets/${target.id}`}
                    className="group rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all hover:shadow-theme-md hover:border-brand-300 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-brand-500"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {target.title}
                        </h3>
                        {target.description && (
                          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {target.description}
                          </p>
                        )}
                      </div>
                      <EyeIcon className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 capitalize">
                        {target.period}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800 dark:bg-purple-500/20 dark:text-purple-400">
                        {tasksCount} {tasksCount === 1 ? "task" : "tasks"}
                      </span>
                    </div>

                    {/* Target Progress */}
                    <div className="mb-3">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Target Progress</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {Math.round(targetProgress)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-full transition-all ${
                            targetProgress >= 100
                              ? "bg-green-600 dark:bg-green-500"
                              : targetProgress >= 75
                              ? "bg-blue-600 dark:bg-blue-500"
                              : targetProgress >= 50
                              ? "bg-yellow-600 dark:bg-yellow-500"
                              : "bg-red-600 dark:bg-red-500"
                          }`}
                          style={{ width: `${targetProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Task Progress */}
                    {tasksCount > 0 && (
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Task Completion</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {completedTasksCount}/{tasksCount} ({Math.round(taskProgress)}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all dark:from-purple-400 dark:to-purple-500"
                            style={{ width: `${taskProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
};

export default TasksOverview;
