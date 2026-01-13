import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Habit } from "../../services/habitsService";
import { PencilIcon, TrashBinIcon, CheckCircleIcon, EyeIcon, MoreDotIcon } from "../../icons";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
  onToggleToday: (habit: Habit) => void;
  todayCompleted: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onEdit,
  onDelete,
  onToggleToday,
  todayCompleted,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [menuOpen]);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 dark:from-blue-500/10 dark:to-blue-500/5 dark:border-gray-700 dark:hover:border-blue-500/50",
      purple: "from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300 dark:from-purple-500/10 dark:to-purple-500/5 dark:border-gray-700 dark:hover:border-purple-500/50",
      green: "from-green-50 to-green-100 border-green-200 hover:border-green-300 dark:from-green-500/10 dark:to-green-500/5 dark:border-gray-700 dark:hover:border-green-500/50",
      yellow: "from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-300 dark:from-yellow-500/10 dark:to-yellow-500/5 dark:border-gray-700 dark:hover:border-yellow-500/50",
      red: "from-red-50 to-red-100 border-red-200 hover:border-red-300 dark:from-red-500/10 dark:to-red-500/5 dark:border-gray-700 dark:hover:border-red-500/50",
      pink: "from-pink-50 to-pink-100 border-pink-200 hover:border-pink-300 dark:from-pink-500/10 dark:to-pink-500/5 dark:border-gray-700 dark:hover:border-pink-500/50",
      orange: "from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300 dark:from-orange-500/10 dark:to-orange-500/5 dark:border-gray-700 dark:hover:border-orange-500/50",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div
      className={`group relative rounded-xl border bg-gradient-to-br p-6 shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.01] ${getColorClasses(
        habit.color
      )}`}
    >
      {/* Header with Icon and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{habit.icon}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-lg p-2 text-gray-600 transition-all hover:bg-white/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              title="Options"
            >
              <MoreDotIcon className="w-4 h-4" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <Link
                  to={`/habits/${habit.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <EyeIcon className="h-4 w-4" />
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(habit);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(habit);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <TrashBinIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Streak Information */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔥</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Current Streak
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {habit.current_streak}
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
              days
            </span>
          </p>
        </div>

        <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🏆</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Longest Streak
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {habit.longest_streak}
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
              days
            </span>
          </p>
        </div>
      </div>

      {/* Today's Check-in */}
      <button
        onClick={() => onToggleToday(habit)}
        disabled={todayCompleted}
        className={`w-full rounded-lg px-4 py-3 font-semibold transition-all duration-300 ${
          todayCompleted
            ? "bg-green-100 text-green-700 cursor-default dark:bg-green-500/20 dark:text-green-400"
            : "bg-white text-gray-700 hover:bg-gray-50 hover:scale-[1.02] dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <CheckCircleIcon
            className={`w-5 h-5 ${
              todayCompleted ? "text-green-600 dark:text-green-400" : "text-gray-400"
            }`}
          />
          <span>{todayCompleted ? "Completed Today! 🎉" : "Mark Complete for Today"}</span>
        </div>
      </button>

      {/* Target days info */}
      {habit.target_days && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Target: {habit.target_days} days
          </p>
        </div>
      )}
    </div>
  );
};

export default HabitCard;

