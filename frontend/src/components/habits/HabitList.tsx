import { useState, useEffect } from "react";
import { Habit, habitsService, HabitLog } from "../../services/habitsService";
import { PlusIcon, SearchIcon } from "../../icons";
import Button from "../ui/button/Button";
import HabitCard from "./HabitCard";
import HabitForm from "./HabitForm";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";

const HabitList: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<{ [key: number]: HabitLog }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; habit: Habit | null }>({
    isOpen: false,
    habit: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await habitsService.getAll();
      setHabits(data);
      
      // Load today's logs for each habit
      const formatLocalDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };
      const today = formatLocalDate(new Date());
      const logsMap: { [key: number]: HabitLog } = {};
      
      await Promise.all(
        data.map(async (habit) => {
          const logs = await habitsService.getLogs(habit.id, today, today);
          if (logs.length > 0 && logs[0].completed) {
            logsMap[habit.id] = logs[0];
          }
        })
      );
      
      setTodayLogs(logsMap);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingHabit(undefined);
    setShowForm(true);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      if (editingHabit) {
        await habitsService.update(editingHabit.id, data);
      } else {
        await habitsService.create(data);
      }
      setShowForm(false);
      setEditingHabit(undefined);
      await loadHabits();
    } catch (error) {
      console.error("Error saving habit:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (habit: Habit) => {
    setDeleteModal({ isOpen: true, habit });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.habit) return;

    try {
      setDeleting(true);
      await habitsService.delete(deleteModal.habit.id);
      setDeleteModal({ isOpen: false, habit: null });
      await loadHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleToday = async (habit: Habit) => {
    if (todayLogs[habit.id]) {
      // Already completed today
      return;
    }

    try {
      await habitsService.toggleToday(habit.id);
      await loadHabits();
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const activeHabits = habits.filter((h) => h.is_active);
  const archivedHabits = habits.filter((h) => !h.is_active);

  const q = search.trim().toLowerCase();
  const matchesQuery = (h: Habit) => {
    if (!q) return true;
    const name = (h.name || "").toLowerCase();
    const desc = (h.description || "").toLowerCase();
    return name.includes(q) || desc.includes(q);
  };

  const filteredActiveHabits = activeHabits.filter(matchesQuery);
  const filteredArchivedHabits = archivedHabits.filter(matchesQuery);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-gray-200 bg-gray-100 animate-pulse dark:border-gray-700 dark:bg-gray-800"
            />
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Habit List</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Search, manage, and complete your habits
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search habits..."
                className="w-full rounded-xl border border-gray-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            <Button onClick={handleCreate} startIcon={<PlusIcon className="w-5 h-5" />}>
              New Habit
            </Button>
          </div>
        </div>

        {/* Active Habits */}
        {activeHabits.length === 0 && archivedHabits.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <span className="text-4xl">🔥</span>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">No habits yet</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Start building positive habits and tracking your progress
            </p>
            <Button onClick={handleCreate} className="mt-4" startIcon={<PlusIcon className="w-5 h-5" />}>
              Create Your First Habit
            </Button>
          </div>
        ) : (
          <>
            {filteredActiveHabits.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Active Habits ({filteredActiveHabits.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredActiveHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onToggleToday={handleToggleToday}
                      todayCompleted={!!todayLogs[habit.id]}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredArchivedHabits.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-400">
                  Archived Habits ({filteredArchivedHabits.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArchivedHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onToggleToday={handleToggleToday}
                      todayCompleted={!!todayLogs[habit.id]}
                    />
                  ))}
                </div>
              </div>
            )}

            {q && filteredActiveHabits.length === 0 && filteredArchivedHabits.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No habits match <span className="font-semibold text-gray-900 dark:text-white">{search}</span>.
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>

      {showForm && (
        <HabitForm
          habit={editingHabit}
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

export default HabitList;

