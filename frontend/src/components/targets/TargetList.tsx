import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../ui/button/Button";
import { Target, targetsService } from "../../services/targetsService";
import { PlusIcon, PencilIcon, TrashBinIcon, TargetIcon, CheckCircleIcon, TimeIcon, ListIcon, AngleLeftIcon, AngleRightIcon } from "../../icons";
import TargetForm from "./TargetForm";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { TargetCardSkeleton } from "../common/Skeleton";
import { tasksService } from "../../services/tasksService";

const TargetList: React.FC = () => {
  const navigate = useNavigate();
  const [targets, setTargets] = useState<Target[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; target: Target | null }>({
    isOpen: false,
    target: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    loadTargets();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const loadTargets = async () => {
    try {
      setLoading(true);
      const [targetsData, tasksData] = await Promise.all([
        targetsService.getAll(),
        tasksService.getAll(),
      ]);
      console.log("✅ Targets loaded:", targetsData);
      setTargets(targetsData || []);
      setTasks(tasksData || []);
    } catch (error: any) {
      console.error("❌ Error loading targets:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      // Set empty array on error to prevent undefined issues
      setTargets([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTargets = targets
    .filter((target) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          target.title.toLowerCase().includes(query) ||
          target.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && target.status !== statusFilter) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by order first, then by created_at
      const orderA = a.order ?? 999999;
      const orderB = b.order ?? 999999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleCreate = () => {
    setEditingTarget(undefined);
    setShowForm(true);
  };

  const handleEdit = (target: Target) => {
    setEditingTarget(target);
    setShowForm(true);
  };

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      console.log("💾 Saving target:", data);
      if (editingTarget) {
        console.log("✏️ Updating target:", editingTarget.id);
        await targetsService.update(editingTarget.id, data);
        console.log("✅ Target updated successfully");
        setShowForm(false);
        setEditingTarget(undefined);
        await loadTargets();
      } else {
        console.log("➕ Creating new target");
        const newTarget = await targetsService.create(data);
        console.log("✅ Target created successfully:", newTarget);
        setShowForm(false);
        setEditingTarget(undefined);
        // Navigate to target detail page
        if (newTarget && newTarget.id) {
          navigate(`/tasks/targets/${newTarget.id}`);
        } else {
          await loadTargets();
        }
      }
    } catch (error: any) {
      console.error("❌ Error saving target:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (target: Target) => {
    setDeleteModal({ isOpen: true, target });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.target) return;

    try {
      setDeleting(true);
      console.log("🗑️ Deleting target:", deleteModal.target.id);
      await targetsService.delete(deleteModal.target.id);
      console.log("✅ Target deleted successfully");
      setDeleteModal({ isOpen: false, target: null });
      await loadTargets();
    } catch (error: any) {
      console.error("❌ Error deleting target:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
    } finally {
      setDeleting(false);
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

  // Calculate stats
  const stats = {
    total: targets.length,
    active: targets.filter((t) => t.status === "active").length,
    completed: targets.filter((t) => t.status === "completed").length,
    paused: targets.filter((t) => t.status === "paused").length,
    averageProgress: targets.length > 0
      ? targets.reduce((sum, t) => {
        const progress = getProgressPercentage(t);
        return sum + progress;
      }, 0) / targets.length
      : 0,
    totalTasks: tasks.filter((t) => t.target_id !== null && t.target_id !== undefined).length,
    completedTasks: tasks.filter((t) => (t.target_id !== null && t.target_id !== undefined) && (t.status === "finish" || t.status === "completed")).length,
  };

  const totalPages = Math.ceil(filteredTargets.length / pageSize);
  const pagedItems = filteredTargets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        {/* Summary Statistics Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl border border-gray-200 bg-gray-100 animate-pulse dark:border-gray-700 dark:bg-gray-800"
            />
          ))}
        </div>

        {/* Filter Skeleton */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1 h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-11 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Target Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TargetCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Target & Goals</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Create targets and add tasks to achieve your goals</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate} startIcon={<PlusIcon className="w-5 h-5" />}>
              New Target
            </Button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Targets - Blue */}
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-blue-500/10 dark:to-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
                <TargetIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Targets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Active - Purple */}
          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-purple-500/10 dark:to-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
                <CheckCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>

          {/* Average Progress - Green */}
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-green-500/10 dark:to-green-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
                <TimeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(stats.averageProgress)}%</p>
              </div>
            </div>
          </div>

          {/* Total Tasks - Yellow */}
          <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-yellow-500/10 dark:to-yellow-500/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-500/20">
                <ListIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search targets..."
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 min-w-[200px] rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Target List */}
        {filteredTargets.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <TargetIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">No targets found</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== "all" ? "Try changing the search or filter" : "Start by creating a new target"}
            </p>
          </div>
        ) : (
          // Card View
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pagedItems.map((target, index) => {
                const progress = getProgressPercentage(target);
                // Gradient colors based on status
                const gradientClasses = target.status === "completed"
                  ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-500/5 border-green-200 hover:border-green-300 dark:border-gray-700 dark:hover:border-green-500/50"
                  : target.status === "paused"
                    ? "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-500/10 dark:to-yellow-500/5 border-yellow-200 hover:border-yellow-300 dark:border-gray-700 dark:hover:border-yellow-500/50"
                    : "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5 border-blue-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500/50";

                return (
                  <div
                    key={target.id}
                    className={`group relative rounded-xl border p-6 shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.01] ${gradientClasses}`}
                  >
                    {/* Menu Button - Top Right Corner */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === target.id ? null : target.id)}
                        className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        title="More options"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === target.id && (
                        <div
                          ref={(el) => {
                            if (target.id) menuRefs.current[target.id] = el;
                          }}
                          className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-theme-md dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
                        >
                          <Link
                            to={`/tasks/targets/${target.id}`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                                fill="currentColor"
                              />
                            </svg>
                            <span>View Details</span>
                          </Link>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleEdit(target);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <PencilIcon className="w-4 h-4 shrink-0" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDeleteClick(target);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            <TrashBinIcon className="w-4 h-4 shrink-0" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Header Section */}
                    <div className="mb-4 pr-20">
                      <div className="flex items-start gap-4">
                        {/* Order Number */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-500 dark:to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-theme-xs">
                          {(currentPage - 1) * pageSize + index + 1}
                        </div>

                        {/* Title and Description */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/tasks/targets/${target.id}`}
                            className="block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
                          >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2">
                              {target.title}
                            </h3>
                          </Link>
                          {target.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                              {target.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 capitalize">
                        {target.period}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${target.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                          : target.status === "completed"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                          }`}
                      >
                        {target.status}
                      </span>
                    </div>

                    {/* Progress Section */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {target.current_value} / {target.target_value} ({Math.round(progress)}%)
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 shadow-inner">
                        <div
                          className={`h-full transition-all duration-500 ${getProgressColor(progress)} shadow-theme-xs`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Component */}
            {filteredTargets.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    {[3, 6, 9, 12, 24, 48].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-md border border-gray-300 px-3 py-1.5 disabled:opacity-50 dark:border-gray-700 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    <AngleLeftIcon className="h-4 w-4" /> Prev
                  </button>
                  <div className="hidden sm:block">
                    Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages || 1}</span>
                  </div>
                  <button
                    className="rounded-md border border-gray-300 px-3 py-1.5 disabled:opacity-50 dark:border-gray-700 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next <AngleRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <TargetForm target={editingTarget} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={saving} />
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, target: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Target"
        message="Are you sure you want to delete this target? This action cannot be undone."
        itemName={deleteModal.target?.title}
        isLoading={deleting}
      />
    </>
  );
};

export default TargetList;
