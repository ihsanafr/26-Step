import { useState, useEffect } from "react";
import { Habit, HabitLog, habitsService } from "../../services/habitsService";

interface HabitCalendarProps {
  habit: Habit;
  onDateClick?: (date: string) => void | Promise<void>;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habit, onDateClick }) => {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // IMPORTANT: Use local date formatting (not toISOString) to avoid timezone shifting issues.
  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    loadLogs();
  }, [habit.id, currentMonth, habit.current_streak]);

  const loadLogs = async () => {
    try {
      setLoading(true);
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = getDaysInMonth();

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
      {/* Header with Habit Info */}
      <div className="mb-6 flex items-center gap-4">
        <div className="text-4xl">{habit.icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{habit.name}</h3>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>🔥 {habit.current_streak} days</span>
            <span>🏆 {habit.longest_streak} days</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={previousMonth}
          className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-bold text-gray-600 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const completed = day !== null && isDateCompleted(day);
          const today = day !== null && isToday(day);
          const streak = day !== null ? getStreakForDate(day) : 0;
          const isStreak = day !== null && isStreakDay(day);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day!)}
              disabled={day === null || !onDateClick}
              className={`group relative h-20 rounded-2xl text-base transition-all duration-200 ${
                day === null
                  ? "cursor-default"
                  : onDateClick
                    ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    : "cursor-default"
              } ${
                completed
                  ? "bg-gradient-to-br from-rose-500/90 to-orange-500/90 text-white font-bold shadow-lg ring-1 ring-white/20 dark:ring-white/10"
                  : "bg-gray-100/70 text-gray-700 shadow-sm ring-1 ring-gray-200/60 dark:bg-gray-700/60 dark:text-gray-200 dark:ring-gray-700"
              } ${
                today && !completed
                  ? "ring-2 ring-brand-500 dark:ring-brand-400"
                  : ""
              } ${day !== null && onDateClick ? "hover:shadow-xl" : ""}`}
            >
              {completed ? (
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-70" />
              ) : null}

              <div className="relative flex flex-col items-center justify-center h-full">
                <span className={`text-lg font-bold ${day === null ? "opacity-0" : ""}`}>{day}</span>

                {completed ? (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-black/15 px-2 py-0.5 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm">
                    <span className="text-[11px]">🔥</span>
                    {streak > 0 ? streak : 1}
                  </span>
                ) : (
                  <span className="mt-1 text-[11px] text-gray-500 opacity-0 group-hover:opacity-70 dark:text-gray-400">
                    view
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-200/80 ring-1 ring-gray-200 dark:bg-gray-700/70 dark:ring-gray-700"></div>
          <span className="text-gray-600 dark:text-gray-400">Not completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gradient-to-br from-rose-500/90 to-orange-500/90 ring-1 ring-white/20 dark:ring-white/10"></div>
          <span className="text-gray-600 dark:text-gray-400">Completed / Streak 🔥</span>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;

