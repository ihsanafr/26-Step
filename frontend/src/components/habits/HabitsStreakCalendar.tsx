import { useEffect, useMemo, useRef, useState } from "react";
import { Habit, HabitLog, habitsService } from "../../services/habitsService";

type DayDetail = {
  date: string; // YYYY-MM-DD
  habits: Array<{ habit: Habit; streakOnThatDay: number }>;
};

interface HabitsStreakCalendarProps {
  habits: Habit[];
  title?: string;
  subtitle?: string;
}

function formatLocalDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getDaysInMonthGrid(month: Date) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0=Sun

  const days: Array<number | null> = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);
  return days;
}

function isToday(month: Date, day: number | null) {
  if (day === null) return false;
  const t = new Date();
  return (
    day === t.getDate() &&
    month.getMonth() === t.getMonth() &&
    month.getFullYear() === t.getFullYear()
  );
}

function StreakDayModal({
  open,
  onClose,
  detail,
}: {
  open: boolean;
  onClose: () => void;
  detail: DayDetail | null;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const detailSnapshot = useRef<DayDetail | null>(null);

  const formatDateId = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  const requestClose = () => {
    // start exit animation
    setIsVisible(false);
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose();
      setIsMounted(false);
    }, 200);
  };

  useEffect(() => {
    if (!open) return;
    detailSnapshot.current = detail;
    setIsMounted(true);
    // trigger enter animation on next frame
    setIsVisible(false);
    requestAnimationFrame(() => setIsVisible(true));
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (!open && !isMounted) return null;
  const d = detailSnapshot.current;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={requestClose}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-transform duration-200 dark:border-gray-700 dark:bg-gray-800 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Streak Details</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{formatDateId(d?.date)}</p>
          </div>
          <button
            onClick={requestClose}
            className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {d && d.habits.length > 0 ? (
          <div className="space-y-3">
            {d.habits
              .sort((a, b) => b.streakOnThatDay - a.streakOnThatDay)
              .map(({ habit, streakOnThatDay }) => (
                <div
                  key={habit.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="text-2xl">{habit.icon}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{habit.name}</p>
                        {habit.description ? (
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {habit.description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="shrink-0 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 px-3 py-1 text-sm font-bold text-white">
                      🔥 {streakOnThatDay}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">No streaks recorded on this day.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HabitsStreakCalendar({
  habits,
  title = "📅 Streak Calendar",
  subtitle = "Click a date to see which habits were completed on that day.",
}: HabitsStreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [logsByHabit, setLogsByHabit] = useState<Record<number, HabitLog[]>>({});
  const [modal, setModal] = useState<{ open: boolean; detail: DayDetail | null }>({
    open: false,
    detail: null,
  });

  const activeHabits = useMemo(() => habits.filter((h) => h.is_active), [habits]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        // Load a buffer before the month so streak length can be computed for early month days.
        const from = addDays(monthStart, -60);
        const to = monthEnd;

        const entries = await Promise.all(
          activeHabits.map(async (h) => {
            const data = await habitsService.getLogs(h.id, formatLocalDate(from), formatLocalDate(to));
            const normalized = (data || []).map((log) => ({
              ...log,
              date: typeof log.date === "string" ? log.date.slice(0, 10) : String(log.date),
              completed: !!(log as any).completed,
            }));
            return [h.id, normalized] as const;
          })
        );

        const map: Record<number, HabitLog[]> = {};
        for (const [id, logs] of entries) map[id] = logs;
        setLogsByHabit(map);
      } catch (e) {
        console.error("Error loading streak calendar logs:", e);
        setLogsByHabit({});
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeHabits, currentMonth]);

  const completedDateSets = useMemo(() => {
    const sets: Record<number, Set<string>> = {};
    for (const h of activeHabits) {
      const logs = logsByHabit[h.id] || [];
      sets[h.id] = new Set(logs.filter((l) => l.completed).map((l) => l.date));
    }
    return sets;
  }, [activeHabits, logsByHabit]);

  const countCompletedOnDate = (date: string) => {
    let count = 0;
    for (const h of activeHabits) {
      if (completedDateSets[h.id]?.has(date)) count++;
    }
    return count;
  };

  const streakOnDateForHabit = (habitId: number, date: string) => {
    const set = completedDateSets[habitId];
    if (!set || !set.has(date)) return 0;
    let streak = 0;
    let cursor = new Date(date + "T00:00:00");
    while (true) {
      const d = formatLocalDate(cursor);
      if (set.has(d)) {
        streak++;
        cursor = addDays(cursor, -1);
      } else {
        break;
      }
    }
    return streak;
  };

  const openDetail = (day: number | null) => {
    if (day === null) return;
    const date = formatLocalDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    const list = activeHabits
      .filter((h) => completedDateSets[h.id]?.has(date))
      .map((h) => ({ habit: h, streakOnThatDay: streakOnDateForHabit(h.id, date) }))
      .filter((x) => x.streakOnThatDay > 0);

    setModal({ open: true, detail: { date, habits: list } });
  };

  const days = getDaysInMonthGrid(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Previous month"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Next month"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-700" />
        ) : (
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((d) => (
              <div key={d} className="p-3 text-center text-sm font-bold text-gray-600 dark:text-gray-400">
                {d}
              </div>
            ))}

            {days.map((day, idx) => {
              const dateStr =
                day === null ? null : formatLocalDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
              const count = dateStr ? countCompletedOnDate(dateStr) : 0;
              const today = isToday(currentMonth, day);

              const clickable = day !== null;
              const hasData = count > 0;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!clickable}
                  onClick={() => openDetail(day)}
                  className={`group relative h-20 rounded-2xl text-base transition-all duration-200 ${
                    day === null ? "cursor-default" : "cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  } ${
                    hasData
                      ? "bg-gradient-to-br from-rose-500/90 to-orange-500/90 text-white shadow-lg ring-1 ring-white/20 dark:ring-white/10"
                      : "bg-gray-100/70 text-gray-700 shadow-sm ring-1 ring-gray-200/60 dark:bg-gray-700/60 dark:text-gray-200 dark:ring-gray-700"
                  } ${
                    today && !hasData
                      ? "ring-2 ring-brand-500 dark:ring-brand-400"
                      : ""
                  } ${day !== null ? "hover:shadow-xl" : ""}`}
                >
                  {/* soft glow for streak days */}
                  {hasData ? (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-70" />
                  ) : null}

                  <div className="relative flex h-full flex-col items-center justify-center">
                    <span className={`text-lg font-bold ${day === null ? "opacity-0" : ""}`}>{day ?? ""}</span>

                    {hasData ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-black/15 px-2 py-0.5 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm">
                        <span className="text-[11px]">🔥</span>
                        {count}
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
        )}

        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-200/80 ring-1 ring-gray-200 dark:bg-gray-700/70 dark:ring-gray-700" />
            <span className="text-gray-600 dark:text-gray-400">No completions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gradient-to-br from-rose-500/90 to-orange-500/90 ring-1 ring-white/20 dark:ring-white/10" />
            <span className="text-gray-600 dark:text-gray-400">Completions (🔥 shows count)</span>
          </div>
        </div>
      </div>

      <StreakDayModal open={modal.open} detail={modal.detail} onClose={() => setModal({ open: false, detail: null })} />
    </>
  );
}


