import { useState, useEffect } from "react";
import { Habit, HabitLog, habitsService } from "../../services/habitsService";
import { formatLocalDate as formatLocalDateUtil } from "../../utils/date";
import { CalenderIcon } from "../../icons";
import Button from "../ui/button/Button";
import { Skeleton } from "../common/Skeleton";

interface HabitCalendarProps {
  habit: Habit;
  onDateClick?: (date: string) => void | Promise<void>;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habit, onDateClick }) => {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Use utility function to ensure consistent local timezone handling
  const formatLocalDate = formatLocalDateUtil;

  useEffect(() => {
    loadLogs();
  }, [habit.id, currentMonth, habit.current_streak]);

  const loadLogs = async () => {
    try {
      // Only show loading skeleton if we don't have any logs yet (first load)
      const hasExistingLogs = logs.length > 0;
      if (!hasExistingLogs) {
        setLoading(true);
      }

      // Load logs for the current month
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Also load logs for streak calculation (if streak exists, load from streak start to today)
      let streakStartDate = startDate;
      if (habit.current_streak > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const calculatedStreakStart = new Date(today);
        calculatedStreakStart.setDate(calculatedStreakStart.getDate() - habit.current_streak + 1);
        // Use the earlier date to ensure we have all relevant logs
        if (calculatedStreakStart < startDate) {
          streakStartDate = calculatedStreakStart;
        }
      }
      
      const logsData = await habitsService.getLogs(
        habit.id,
        formatLocalDate(streakStartDate),
        formatLocalDate(endDate)
      );
      // Normalize dates to YYYY-MM-DD (API may return ISO timestamps) and ensure boolean completed
      const normalizedLogs = (logsData || []).map((log) => ({
        ...log,
        date: typeof log.date === "string" ? log.date.slice(0, 10) : String(log.date),
        completed: !!(log as any).completed,
      }));
      setLogs(normalizedLogs);
    } catch (error) {
      console.error("Error loading habit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getDateLog = (day: number): HabitLog | undefined => {
    if (day === null) return undefined;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = formatLocalDate(date);
    return logs.find(log => log.date === dateString && log.completed);
  };

  const isDateCompleted = (day: number): boolean => {
    return getDateLog(day) !== undefined;
  };

  // Calculate streak for a specific date (consecutive days backwards from that date)
  const getStreakForDate = (day: number): number => {
    if (day === null || !isDateCompleted(day)) return 0;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    let streak = 0;
    let checkDate = new Date(date);
    
    // Get all completed logs sorted by date
    const completedLogs = logs
      .filter(log => log.completed)
      .map(log => log.date)
      .sort()
      .reverse(); // Most recent first
    
    // Count consecutive days backwards from this date
    while (true) {
      const dateString = formatLocalDate(checkDate);
      const hasLog = completedLogs.includes(dateString);
      
      if (hasLog) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Highlight any completed day as streak (red/orange)
  const isStreakDay = (day: number): boolean => {
    return day !== null && isDateCompleted(day);
  };

  const isToday = (day: number): boolean => {
    if (day === null) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = async (day: number) => {
    if (day === null || !onDateClick) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = formatLocalDate(date);
    
    // Check if already completed
    const existingLog = getDateLog(day);
    if (existingLog) {
      // Toggle off - delete log
      try {
        await habitsService.deleteLog(habit.id, existingLog.id);
        await loadLogs();
      } catch (error) {
        console.error("Error deleting log:", error);
      }
    } else {
      // Toggle on - create log then reload
      try {
        await Promise.resolve(onDateClick(dateString));
        await loadLogs();
      } catch (error) {
        console.error("Error creating log:", error);
      }
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = getDaysInMonth();
  const monthLabel = currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
        <Skeleton variant="rectangular" width="100%" height={360} className="rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
      {/* Header with Habit Info */}
      <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
        <div className="text-3xl sm:text-4xl">{habit.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate sm:text-xl">{habit.name}</h3>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 sm:gap-4 sm:text-sm">
            <span>🔥 {habit.current_streak} days</span>
            <span>🏆 {habit.longest_streak} days</span>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex items-center gap-2">
          <CalenderIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 sm:h-5 sm:w-5" />
          <p className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            className="text-xs sm:text-sm"
          >
            ← Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="text-xs sm:text-sm"
          >
            Next →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 sm:gap-2 sm:text-xs mb-2">
        {weekDays.map((d) => (
          <div key={d} className="px-1 py-1 text-center sm:px-2">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Calendar days */}
        {days.map((day, index) => {
          const completed = day !== null && isDateCompleted(day);
          const today = day !== null && isToday(day);
          const streak = day !== null ? getStreakForDate(day) : 0;
          const isStreak = day !== null && isStreakDay(day);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(day!)}
              disabled={day === null || !onDateClick}
              className={`group relative h-12 rounded-lg border p-1 text-left transition-all sm:h-20 sm:rounded-2xl sm:p-2 ${
                completed
                  ? "border-orange-300 bg-orange-50 ring-2 ring-orange-400/30 dark:border-orange-500 dark:bg-orange-500/10"
                  : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800/40"
              } ${day === null ? "opacity-40 cursor-default" : onDateClick ? "cursor-pointer" : "cursor-default"} ${
                today ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold sm:text-sm ${today ? "text-blue-600 dark:text-blue-300" : completed ? "text-orange-700 dark:text-orange-300" : "text-gray-900 dark:text-white"}`}>
                  {day ?? ""}
                </span>
                {completed ? (
                  <span className="text-[10px] sm:text-xs">🔥</span>
                ) : null}
              </div>

              {completed ? (
                <div className="mt-1 text-[8px] font-semibold text-gray-600 dark:text-gray-300 sm:mt-2 sm:text-[10px]">
                  completed
                </div>
              ) : (
                <div className="mt-2 text-[8px] text-gray-400 opacity-0 transition group-hover:opacity-100 dark:text-gray-500 sm:mt-6 sm:text-[10px]">
                  {onDateClick ? "click" : "view"}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:mt-6 sm:gap-6 sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/40"></div>
          <span className="text-gray-600 dark:text-gray-400">Not completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-orange-300 bg-orange-50 ring-2 ring-orange-400/30 dark:border-orange-500 dark:bg-orange-500/10"></div>
          <span className="text-gray-600 dark:text-gray-400">Completed / Streak 🔥</span>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;

