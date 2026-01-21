import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Habit, HabitLog, habitsService } from "../../services/habitsService";
import { ChevronLeftIcon, PencilIcon, TrashBinIcon } from "../../icons";
import HabitCalendar from "./HabitCalendar";
import HabitForm from "./HabitForm";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { Skeleton } from "../common/Skeleton";
import { useHabits } from "../../context/HabitsContext";

const HabitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshHabits, updateHabit } = useHabits();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; habit: Habit | null }>({
    isOpen: false,
    habit: null,
  });
  const [deleting, setDeleting] = useState(false);

  const loadHabit = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const habitData = await habitsService.getById(parseInt(id));
      setHabit(habitData);
    } catch (error) {
      console.error("Error loading habit:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Redirect to habits list if ID is invalid or missing
  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      navigate("/habits", { replace: true });
      return;
    }
    loadHabit();
  }, [id, navigate, loadHabit]);

  const handleSave = async (data: any) => {
    if (!habit) return;
    try {
      setSaving(true);
      const updatedHabit = await habitsService.update(habit.id, data);
      setShowForm(false);
      await loadHabit();
      // Update context to keep data in sync
      updateHabit(updatedHabit);
      await refreshHabits();
    } catch (error) {
      console.error("Error saving habit:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    if (habit) {
      setDeleteModal({ isOpen: true, habit });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.habit) return;

    try {
      setDeleting(true);
      await habitsService.delete(deleteModal.habit.id);
      // Refresh context to remove deleted habit
      await refreshHabits();
      navigate("/habits/list");
    } catch (error) {
      console.error("Error deleting habit:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Calendar in detail page is read-only (view streaks only)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <Skeleton variant="rectangular" width="100%" height={200} className="mb-4" />
          <Skeleton variant="text" width="60%" height={32} className="mb-2" />
          <Skeleton variant="text" width="100%" height={20} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={80} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <Skeleton variant="text" width="40%" height={24} className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height={260} />
        </div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-800">
        <p className="text-lg font-medium text-gray-900 dark:text-white">Habit not found</p>
        <Link
          to="/habits/list"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Back to Habit List
        </Link>
      </div>
    );
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "from-blue-50 to-blue-100 border-blue-200 dark:from-blue-500/10 dark:to-blue-500/5 dark:border-gray-700",
      purple: "from-purple-50 to-purple-100 border-purple-200 dark:from-purple-500/10 dark:to-purple-500/5 dark:border-gray-700",
      green: "from-green-50 to-green-100 border-green-200 dark:from-green-500/10 dark:to-green-500/5 dark:border-gray-700",
      yellow: "from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-500/10 dark:to-yellow-500/5 dark:border-gray-700",
      red: "from-red-50 to-red-100 border-red-200 dark:from-red-500/10 dark:to-red-500/5 dark:border-gray-700",
      pink: "from-pink-50 to-pink-100 border-pink-200 dark:from-pink-500/10 dark:to-pink-500/5 dark:border-gray-700",
      orange: "from-orange-50 to-orange-100 border-orange-200 dark:from-orange-500/10 dark:to-orange-500/5 dark:border-gray-700",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          to="/habits/list"
          className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Back to Habit List</span>
        </Link>

        {/* Habit Header Card */}
        <div className={`rounded-2xl border bg-gradient-to-br p-6 shadow-theme-sm ${getColorClasses(habit.color)}`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="text-5xl">{habit.icon}</div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {habit.name}
                </h1>
                {habit.description && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg p-2 text-gray-600 transition-all hover:bg-white/50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                title="Edit habit"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/20"
                title="Delete habit"
              >
                <TrashBinIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl bg-white/70 dark:bg-gray-800/70 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Streak
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {habit.current_streak}
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-1">
                  days
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-white/70 dark:bg-gray-800/70 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏆</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Longest Streak
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {habit.longest_streak}
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-1">
                  days
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-white/70 dark:bg-gray-800/70 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📅</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Start Date
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(habit.start_date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="rounded-xl bg-white/70 dark:bg-gray-800/70 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Target Days
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {habit.target_days || "No target"}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
              habit.is_active
                ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400"
            }`}>
              {habit.is_active ? "Active" : "Archived"}
            </span>
            {habit.target_days && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round((habit.current_streak / habit.target_days) * 100)}% of target
              </span>
            )}
          </div>
        </div>

        {/* Calendar Section */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            📅 Completion Calendar
          </h2>
          <HabitCalendar habit={habit} />
        </div>
      </div>

      {showForm && (
        <HabitForm
          habit={habit}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          isLoading={saving}
        />
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, habit: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? All progress and streak data will be lost."
        itemName={deleteModal.habit?.name}
        isLoading={deleting}
      />
    </>
  );
};

export default HabitDetail;

