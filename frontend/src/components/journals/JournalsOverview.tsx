import { useEffect, useMemo, useState } from "react";
import { journalsService, Journal } from "../../services/journalsService";
import { notesService, Note } from "../../services/notesService";
import { Skeleton } from "../common/Skeleton";
import { GridIcon, FileIcon, TimeIcon, ShootingStarIcon, CalenderIcon } from "../../icons";
import { Link, useNavigate } from "react-router";
import { formatLocalDate, startOfWeek } from "../productivity/utils";
import { stripHtml } from "../../utils/text";
import { formatIndonesianDate } from "../../utils/date";
import { getMoodEmoji, getWeatherEmoji } from "../../utils/journal";
import Button from "../ui/button/Button";

function countBy<T extends string>(arr: (T | null | undefined)[]) {
  const map = new Map<string, number>();
  arr.forEach((x) => {
    const key = (x || "").trim();
    if (!key) return;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

function formatYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getMonthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay()); // Sunday start

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function JournalsOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatLocalDate(today), [today]);
  const weekStartStr = useMemo(() => formatLocalDate(startOfWeek(today)), [today]);

  // Calendar state
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [j, n] = await Promise.all([journalsService.getAll(), notesService.getAll()]);
        setJournals(j);
        setNotes(n);
      } catch (e) {
        console.error("Error loading journals dashboard:", e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const weekEntries = useMemo(
    () => journals.filter((j) => (j.date || "").slice(0, 10) >= weekStartStr && (j.date || "").slice(0, 10) <= todayStr),
    [journals, weekStartStr, todayStr]
  );

  const todayEntries = useMemo(
    () => journals.filter((j) => (j.date || "").slice(0, 10) === todayStr),
    [journals, todayStr]
  );

  const topMoods = useMemo(() => countBy(journals.map((j) => j.mood)), [journals]);
  const topWeathers = useMemo(() => countBy(journals.map((j) => j.weather)), [journals]);
  const topCategories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    journals.forEach((j) => {
      if (j.category && typeof j.category === 'object' && j.category.name) {
        categoryMap.set(j.category.name, (categoryMap.get(j.category.name) || 0) + 1);
      }
    });
    notes.forEach((n) => {
      if (n.category && typeof n.category === 'object' && n.category.name) {
        categoryMap.set(n.category.name, (categoryMap.get(n.category.name) || 0) + 1);
      }
    });
    return Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [journals, notes]);

  const pinnedNotes = useMemo(() => notes.filter((n) => n.is_pinned).slice(0, 3), [notes]);
  const recentJournals = useMemo(() => journals.slice(0, 4), [journals]);
  const recentNotes = useMemo(() => notes.filter((n) => !n.is_pinned).slice(0, 3), [notes]);

  // Calculate total words
  const totalWords = useMemo(() => {
    const journalWords = journals.reduce((sum, j) => {
      const text = j.content ? j.content.replace(/<[^>]*>/g, '') : '';
      return sum + text.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);
    const noteWords = notes.reduce((sum, n) => {
      const text = n.content || '';
      return sum + text.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);
    return journalWords + noteWords;
  }, [journals, notes]);

  // Calculate average words per entry
  const avgWordsPerEntry = useMemo(() => {
    const totalEntries = journals.length + notes.length;
    return totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
  }, [journals.length, notes.length, totalWords]);

  // Find longest entry
  const longestEntry = useMemo(() => {
    let longest: { title: string; words: number; type: 'journal' | 'note' } | null = null;
    journals.forEach((j) => {
      const text = j.content ? j.content.replace(/<[^>]*>/g, '') : '';
      const words = text.split(/\s+/).filter(w => w.length > 0).length;
      if (!longest || words > longest.words) {
        longest = { title: j.title, words, type: 'journal' };
      }
    });
    notes.forEach((n) => {
      const text = n.content || '';
      const words = text.split(/\s+/).filter(w => w.length > 0).length;
      if (!longest || words > longest.words) {
        longest = { title: n.title, words, type: 'note' };
      }
    });
    return longest;
  }, [journals, notes]);

  // Calculate writing streak (consecutive days with entries)
  const writingStreak = useMemo(() => {
    const allDates = new Set<string>();
    journals.forEach((j) => {
      if (j.date) allDates.add(j.date.slice(0, 10));
    });
    notes.forEach((n) => {
      if (n.created_at) allDates.add(n.created_at.slice(0, 10));
    });
    
    const sortedDates = Array.from(allDates).sort().reverse();
    if (sortedDates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i] + 'T00:00:00');
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (formatYMD(date) === formatYMD(expectedDate)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, [journals, notes]);

  // Get most active day of week
  const mostActiveDay = useMemo(() => {
    const dayCounts = new Map<string, number>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    journals.forEach((j) => {
      if (j.date) {
        const date = new Date(j.date + 'T00:00:00');
        const dayName = dayNames[date.getDay()];
        dayCounts.set(dayName, (dayCounts.get(dayName) || 0) + 1);
      }
    });
    notes.forEach((n) => {
      if (n.created_at) {
        const date = new Date(n.created_at);
        const dayName = dayNames[date.getDay()];
        dayCounts.set(dayName, (dayCounts.get(dayName) || 0) + 1);
      }
    });
    
    if (dayCounts.size === 0) return null;
    const sorted = Array.from(dayCounts.entries()).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  }, [journals, notes]);

  // Calendar data
  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  
  const byDate = useMemo(() => {
    const map = new Map<string, (Journal | Note)[]>();
    // Add journals
    journals.forEach((j) => {
      const key = (j.date || "").slice(0, 10);
      map.set(key, [...(map.get(key) || []), j]);
    });
    // Add notes (using created_at as date)
    notes.forEach((n) => {
      const key = (n.created_at || "").slice(0, 10);
      map.set(key, [...(map.get(key) || []), n]);
    });
    return map;
  }, [journals, notes]);

  const grid = useMemo(() => getMonthGrid(year, monthIndex), [year, monthIndex]);
  const selectedEntries = useMemo(() => {
    if (!selectedDate) return [];
    return byDate.get(selectedDate) || [];
  }, [byDate, selectedDate]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 p-5 shadow-xl dark:from-brand-600 dark:via-brand-700 dark:to-purple-700 sm:rounded-3xl sm:p-6 md:p-8">
        <div className="relative z-10">
          <h1 className="mb-2 text-2xl font-bold text-white sm:mb-3 sm:text-3xl md:text-4xl lg:text-5xl">Journals & Notes</h1>
          <p className="mb-4 max-w-2xl text-sm text-white/90 sm:mb-5 sm:text-base md:mb-6 md:text-lg">
            Reflect on your day, capture quick thoughts, and organize your life's moments.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              to="/journals/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-brand-600 shadow-lg transition hover:bg-white/90 hover:shadow-xl sm:gap-2 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:py-3"
            >
              <FileIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Write New Entry
            </Link>
            <Link
              to="/journals/list"
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:py-3"
            >
              <GridIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              View All Entries
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-full w-full opacity-10">
          <div className="absolute right-[-50px] top-[-50px] h-[300px] w-[300px] rounded-full bg-white"></div>
          <div className="absolute bottom-[-100px] right-[100px] h-[200px] w-[200px] rounded-full bg-white"></div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={140} className="rounded-2xl" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              </div>
              <Skeleton variant="rectangular" width="100%" height={260} className="rounded-2xl" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid - 6 columns */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Total Entries */}
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-blue-500/10 dark:to-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
                  <GridIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{journals.length + notes.length}</p>
                </div>
              </div>
            </div>

            {/* Today */}
            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-green-500/10 dark:to-green-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
                  <FileIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayEntries.length}</p>
                </div>
              </div>
            </div>

            {/* This Week */}
            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-purple-500/10 dark:to-purple-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
                  <TimeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{weekEntries.length}</p>
                </div>
              </div>
            </div>

            {/* Pinned Notes */}
            <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-orange-500/10 dark:to-orange-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
                  <ShootingStarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pinned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pinnedNotes.length}</p>
                </div>
              </div>
            </div>

            {/* Total Words */}
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-indigo-500/10 dark:to-indigo-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-500/20">
                  <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Words</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWords.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Writing Streak */}
            <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-red-500/10 dark:to-red-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-500/20">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{writingStreak} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights Section */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg Words/Entry</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{avgWordsPerEntry}</p>
            </div>
            {longestEntry && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Longest Entry</p>
                <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white" title={longestEntry.title}>
                  {longestEntry.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{longestEntry.words} words</p>
              </div>
            )}
            {mostActiveDay && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Most Active Day</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{mostActiveDay}</p>
              </div>
            )}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Notes</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{notes.length}</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Entries - Takes 2 columns */}
            <div className="min-w-0 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
                <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">Recent Entries</h2>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Your latest journal moments</p>
                  </div>
                  <Link to="/journals/list" className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 sm:text-sm">
                    View all →
                </Link>
              </div>
              {recentJournals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                    <FileIcon className="mb-2 h-10 w-10 text-gray-300 dark:text-gray-600 sm:mb-3 sm:h-12 sm:w-12" />
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">No entries yet.</p>
                    <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-500 sm:text-xs">Start writing to see your entries here</p>
                  </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {recentJournals.map((j) => (
                      <Link
                        key={j.id}
                        to={`/journals/view/${j.id}`}
                        className="block overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 p-3 transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-700 dark:hover:bg-brand-900/20 sm:p-4"
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white sm:text-base">{j.title}</p>
                            <p className="mt-1 break-words text-[10px] font-medium text-gray-600 dark:text-gray-400 sm:text-xs">
                        {formatIndonesianDate(j.date || "")}
                        {j.mood ? ` • ${getMoodEmoji(j.mood)} ${j.mood}` : ""}
                              {j.weather ? ` • ${getWeatherEmoji(j.weather)}` : ""}
                      </p>
                      <p className="mt-1.5 line-clamp-2 break-words text-xs text-gray-700 dark:text-gray-300 sm:mt-2 sm:text-sm">{stripHtml(j.content)}</p>
                    </div>
                        </div>
                      </Link>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* Insights - Takes 1 column */}
            <div className="space-y-6">
              {/* Top Moods */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
                <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-white sm:mb-4 sm:text-lg">Top Moods</h3>
                {topMoods.length === 0 ? (
                  <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">No mood data yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {topMoods.slice(0, 6).map(([m, c]) => (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 px-2 py-1 text-xs font-semibold text-blue-900 shadow-sm dark:from-blue-500/20 dark:to-blue-600/20 dark:text-blue-300 sm:rounded-xl sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        {getMoodEmoji(m)} {m}
                        <span className="ml-0.5 rounded-lg bg-white/70 px-1.5 py-0.5 text-[10px] font-bold dark:bg-white/10 sm:ml-1 sm:px-2 sm:text-xs">{c}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Categories */}
              {topCategories.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
                  <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-white sm:mb-4 sm:text-lg">Top Categories</h3>
                  <div className="space-y-2">
                    {topCategories.map(([cat, count]) => {
                      // Find category icon from journals or notes
                      let categoryIcon = '';
                      const journalCat = journals.find(j => j.category && typeof j.category === 'object' && j.category.name === cat)?.category;
                      const noteCat = notes.find(n => n.category && typeof n.category === 'object' && n.category.name === cat)?.category;
                      if (journalCat && typeof journalCat === 'object' && 'icon' in journalCat) {
                        categoryIcon = journalCat.icon || '';
                      } else if (noteCat && typeof noteCat === 'object' && 'icon' in noteCat) {
                        categoryIcon = noteCat.icon || '';
                      }
                      return (
                        <div key={cat} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-2 dark:border-gray-700 dark:bg-gray-900/50 sm:p-3">
                          <div className="flex items-center gap-2">
                            {categoryIcon && <span className="text-lg">{categoryIcon}</span>}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{cat}</span>
                          </div>
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Top Weather */}
              {topWeathers.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
                  <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-white sm:mb-4 sm:text-lg">Top Weather</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {topWeathers.slice(0, 5).map(([w, c]) => (
                      <span
                        key={w}
                        className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-200 px-2 py-1 text-xs font-semibold text-cyan-900 shadow-sm dark:from-cyan-500/20 dark:to-cyan-600/20 dark:text-cyan-300 sm:rounded-xl sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm"
                      >
                        {getWeatherEmoji(w)} {w}
                        <span className="ml-0.5 rounded-lg bg-white/70 px-1.5 py-0.5 text-[10px] font-bold dark:bg-white/10 sm:ml-1 sm:px-2 sm:text-xs">{c}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pinned Notes */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">Pinned Notes</h3>
                  <Link 
                    to="/journals/notes" 
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 sm:text-sm"
                  >
                    View all →
                  </Link>
                </div>
                {pinnedNotes.length === 0 ? (
                  <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">No pinned notes.</p>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {pinnedNotes.map((n) => (
                      <Link
                        key={n.id}
                        to="/journals/notes"
                        className="block rounded-lg border border-gray-200 bg-gray-50/50 p-2 transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-700 dark:hover:bg-brand-900/20 sm:rounded-xl sm:p-3"
                      >
                        <div className="flex items-start gap-2">
                          {n.color && (
                            <div
                              className="mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: n.color }}
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate sm:text-sm">{n.title}</p>
                            <p className="mt-0.5 text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2 sm:mt-1 sm:text-xs">{n.content}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Notes */}
              {recentNotes.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
                  <div className="mb-3 flex items-center justify-between sm:mb-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">Recent Notes</h3>
                    <Link 
                      to="/journals/notes" 
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 sm:text-sm"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {recentNotes.map((n) => (
                      <Link
                        key={n.id}
                        to="/journals/notes"
                        className="block rounded-lg border border-gray-200 bg-gray-50/50 p-2 transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-700 dark:hover:bg-brand-900/20 sm:rounded-xl sm:p-3"
                      >
                        <div className="flex items-start gap-2">
                          {n.color && (
                            <div
                              className="mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: n.color }}
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate sm:text-sm">{n.title}</p>
                            <p className="mt-0.5 text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2 sm:mt-1 sm:text-xs">{n.content}</p>
                            {n.category && typeof n.category === 'object' && n.category.name && (
                              <div className="mt-1 flex items-center gap-1">
                                {n.category.icon && <span className="text-xs">{n.category.icon}</span>}
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">{n.category.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
              <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 p-2 dark:from-purple-500/20 dark:to-purple-600/20 sm:rounded-xl sm:p-3">
                    <CalenderIcon className="h-4 w-4 text-purple-600 dark:text-purple-400 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg md:text-xl">{monthLabel}</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">View your journal entries by date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                    className="text-xs sm:text-sm"
                  >
                    ← Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                    className="text-xs sm:text-sm"
                  >
                    Next →
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="grid grid-cols-7 gap-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 sm:gap-2 sm:text-xs">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="px-1 py-0.5 text-center sm:px-2 sm:py-1">
                      <span className="hidden sm:inline">{d}</span>
                      <span className="sm:hidden">{d.slice(0, 1)}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {grid.map((d, idx) => {
                    const isCurrentMonth = d.getMonth() === monthIndex;
                    const key = formatYMD(d);
                    const count = (byDate.get(key) || []).length;
                    const isSelected = selectedDate === key;
                    const todayKey = formatYMD(new Date());
                    const isToday = key === todayKey;

                    return (
                      <button
                        key={`${key}-${idx}`}
                        type="button"
                        onClick={() => setSelectedDate(isSelected ? null : key)}
                        className={`group relative h-12 rounded-lg border p-1 text-left transition-all sm:h-16 sm:rounded-xl sm:p-2 ${
                          isSelected
                            ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/20 dark:border-brand-600 dark:bg-brand-500/10"
                            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800/40"
                        } ${!isCurrentMonth ? "opacity-30" : ""}`}
                        title={key}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold sm:text-sm ${isToday ? "text-brand-700 dark:text-brand-300" : "text-gray-900 dark:text-white"}`}>
                            {d.getDate()}
                          </span>
                          {count > 0 ? (
                            <span className="rounded-full bg-purple-100 px-1 py-0.5 text-[9px] font-bold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 sm:rounded-lg sm:px-1.5 sm:text-xs">
                              {count}
                            </span>
                          ) : null}
                        </div>

                        {count > 0 ? (
                          <div className="mt-0.5 flex flex-wrap gap-0.5 sm:mt-1 sm:gap-1">
                            {(byDate.get(key) || []).slice(0, 2).map((j) => (
                              <span
                                key={j.id}
                                className="inline-block h-1 w-1 rounded-full bg-purple-400 dark:bg-purple-300 sm:h-1.5 sm:w-1.5"
                              />
                            ))}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Details */}
              {selectedDate && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-900/40 sm:mt-6 sm:p-4">
                  <div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white sm:text-sm">
                      {selectedEntries.length > 0
                        ? `${selectedEntries.length} ${selectedEntries.length === 1 ? "entry" : "entries"} on ${formatIndonesianDate(selectedDate)}`
                        : `No entries on ${formatIndonesianDate(selectedDate)}`}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/journals/new?date=${selectedDate}`)}
                      className="text-xs sm:text-sm"
                    >
                      Add Entry
                    </Button>
                  </div>

                  {selectedEntries.length > 0 && (
                    <div className="space-y-2">
                      {selectedEntries.map((entry) => {
                        const isNote = 'content' in entry && !('date' in entry);
                        return (
                          <Link
                            key={entry.id}
                            to={isNote ? "/journals/notes" : `/journals/view/${entry.id}`}
                            className="block rounded-lg border border-gray-200 bg-white p-2.5 transition-all hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-700 sm:p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  {isNote && (entry as Note).color && (
                                    <div
                                      className="h-3 w-3 shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                      style={{ backgroundColor: (entry as Note).color || undefined }}
                                    />
                                  )}
                                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate sm:text-sm">{entry.title}</p>
                                </div>
                                {!isNote && (
                                  <p className="mt-0.5 text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">
                                    {(entry as Journal).mood ? `${getMoodEmoji((entry as Journal).mood)} ${(entry as Journal).mood}` : ""}
                                    {(entry as Journal).weather ? ` • ${getWeatherEmoji((entry as Journal).weather)}` : ""}
                                    {(entry as Journal).location ? ` • ${(entry as Journal).location}` : ""}
                                  </p>
                                )}
                                {isNote && (entry as Note).category && typeof (entry as Note).category === 'object' && (entry as Note).category?.name && (
                                  <p className="mt-0.5 text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">
                                    {(entry as Note).category.icon ? `${(entry as Note).category.icon} ` : ''}{(entry as Note).category.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="mt-1.5 text-[10px] text-gray-700 dark:text-gray-300 line-clamp-2 sm:mt-2 sm:text-xs">
                              {isNote ? (entry as Note).content : stripHtml((entry as Journal).content)}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


