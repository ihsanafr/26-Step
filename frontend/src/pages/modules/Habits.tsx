import { useLocation, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import HabitList from "../../components/habits/HabitList";
import HabitsOverview from "../../components/habits/HabitsOverview";
import HabitsGuide from "../../components/habits/HabitsGuide";
import HabitsStreakCalendar from "../../components/habits/HabitsStreakCalendar";
import { useState, useEffect } from "react";
import { Habit, HabitLog, habitsService } from "../../services/habitsService";

export default function Habits() {
  const location = useLocation();
  const path = location.pathname;

  // Dashboard - Overview
  if (path === "/habits" || path === "/habits/") {
    return <HabitsDashboard />;
  }

  // Habits List
  if (path === "/habits/list") {
    return (
      <>
        <PageMeta
          title="Habit List - Lifesync"
          description="Manage your daily habits"
        />
        <HabitList />
      </>
    );
  }

  // Streaks View - shows only streak information
  if (path === "/habits/streaks") {
    return <HabitsStreaksView />;
  }

  // User Guide (accessed from bottom sidebar button)
  if (path === "/habits/guide") {
    return (
      <>
        <PageMeta
          title="Habits & Streaks Guide - Lifesync"
          description="Learn how to use the Habits & Streaks module effectively"
        />
        <HabitsGuide />
      </>
    );
  }

  // Default fallback to dashboard
  return <HabitsDashboard />;
}

// Streaks View Component - Shows only habits with streaks
function HabitsStreaksView() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const habitsData = await habitsService.getAll();
      setHabits(habitsData);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeHabits = habits.filter((h) => h.is_active);
  const habitsWithStreaks = activeHabits.filter((h) => h.current_streak > 0 || h.longest_streak > 0);

  return (
    <>
      <PageMeta
        title="Habit Streaks - Lifesync"
        description="View your habit streaks and progress"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
            🔥 Habit Streaks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your consistency and celebrate your progress
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl border border-gray-200 bg-gray-100 animate-pulse dark:border-gray-700 dark:bg-gray-800"
                />
              ))}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            <div>
              <div className="mb-4 h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-xl border border-gray-200 bg-gray-100 animate-pulse dark:border-gray-700 dark:bg-gray-800"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : habitsWithStreaks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <span className="text-4xl">🔥</span>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">No active streaks yet</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Start completing your habits daily to build streaks!
            </p>
          </div>
        ) : (
          <>
            {/* Streak Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-orange-200 bg-linear-to-br from-orange-50 to-orange-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-orange-500/10 dark:to-orange-500/5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">🔥</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Active Streaks</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {habitsWithStreaks.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-yellow-200 bg-linear-to-br from-yellow-50 to-yellow-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-yellow-500/10 dark:to-yellow-500/5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">⚡</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Streak</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {Math.round(
                        habitsWithStreaks.reduce((sum, h) => sum + h.current_streak, 0) / 
                        habitsWithStreaks.length
                      )}
                      <span className="text-sm font-normal ml-1">days</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-green-200 bg-linear-to-br from-green-50 to-green-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-green-500/10 dark:to-green-500/5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">🏆</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Streak</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {Math.max(...habitsWithStreaks.map((h) => h.longest_streak))}
                      <span className="text-sm font-normal ml-1">days</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Single Calendar (view only) */}
            <HabitsStreakCalendar
              habits={activeHabits}
              title="Streak Calendar"
              subtitle="Click a date to see which habits were completed on that day."
            />

            {/* Habits Sorted by Streak */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                All Streaks ({habitsWithStreaks.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {habitsWithStreaks
                  .sort((a, b) => b.current_streak - a.current_streak)
                  .map((habit) => (
                    <div
                      key={habit.id}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all hover:shadow-theme-md hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-800"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-3xl">{habit.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                            {habit.name}
                          </h3>
                          {habit.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-500/10">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            🔥 Current
                          </span>
                          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            {habit.current_streak} days
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-500/10">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            🏆 Best
                          </span>
                          <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            {habit.longest_streak} days
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Dashboard Component
function HabitsDashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<{ [key: number]: HabitLog }>({});
  const [loading, setLoading] = useState(true);

  const activeHabits = habits.filter((h) => h.is_active);

  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const habitsData = await habitsService.getAll();
      setHabits(habitsData);
      
      // Load today's logs for each habit
      const today = formatLocalDate(new Date());
      const logsMap: { [key: number]: HabitLog } = {};
      
      await Promise.all(
        habitsData.map(async (habit) => {
          try {
            const logs = await habitsService.getLogs(habit.id, today, today);
            if (logs.length > 0 && logs[0].completed) {
              logsMap[habit.id] = logs[0];
            }
          } catch (error) {
            console.error(`Error loading logs for habit ${habit.id}:`, error);
          }
        })
      );
      
      setTodayLogs(logsMap);
    } catch (error) {
      console.error("Error loading habits data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Habits & Streaks Dashboard - Lifesync"
        description="Build good habits and maintain streaks"
      />
      
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-500 via-rose-500 to-pink-500 p-8 text-white shadow-xl">
          <div className="relative z-10">
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">Habits & Streaks</h1>
            <p className="mb-6 text-lg text-orange-100 md:text-xl">
              Build positive habits, track your progress, and maintain motivating streaks
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/habits/list"
                className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm hover:bg-white/25"
              >
                Habit List
              </Link>
              <Link
                to="/habits/streaks"
                className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm hover:bg-white/25"
              >
                View Streaks
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        {loading ? (
          // Loading State
          <div className="space-y-6">
            {/* Stats Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl border border-gray-200 bg-gray-100 animate-pulse dark:border-gray-700 dark:bg-gray-800"
                />
              ))}
            </div>

            {/* Habits Skeleton */}
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl border border-gray-200 bg-gray-100 animate-pulse dark:border-gray-700 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Overview Statistics */}
            <HabitsOverview habits={habits} todayLogs={todayLogs} />

            {/* Single Streak Calendar (view only) */}
            {activeHabits.length > 0 && (
              <div className="mt-8">
                <HabitsStreakCalendar
                  habits={activeHabits}
                  title="Streak Calendar"
                  subtitle="Click a date to see which habits were completed on that day."
                />
              </div>
            )}

            {/* My Habits section removed (keep only summary + calendar) */}
          </>
        )}
      </div>
    </>
  );
}

