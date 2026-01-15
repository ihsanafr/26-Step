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

  const pinnedNotes = useMemo(() => notes.filter((n) => n.is_pinned).slice(0, 3), [notes]);
  const recentJournals = useMemo(() => journals.slice(0, 4), [journals]);

  // Calendar data
  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  
  const byDate = useMemo(() => {
    const map = new Map<string, Journal[]>();
    journals.forEach((j) => {
      const key = (j.date || "").slice(0, 10);
      map.set(key, [...(map.get(key) || []), j]);
    });
    return map;
  }, [journals]);

  const grid = useMemo(() => getMonthGrid(year, monthIndex), [year, monthIndex]);
  const selectedEntries = useMemo(() => (selectedDate ? byDate.get(selectedDate) || [] : []), [byDate, selectedDate]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 p-8 shadow-xl dark:from-brand-600 dark:via-brand-700 dark:to-purple-700">
        <div className="relative z-10">
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Journals & Notes</h1>
          <p className="mb-6 max-w-2xl text-lg text-white/90">
            Reflect on your day, capture quick thoughts, and organize your life's moments.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/journals/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-600 shadow-lg transition hover:bg-white/90 hover:shadow-xl"
            >
              <FileIcon className="h-5 w-5" />
              Write New Entry
            </Link>
            <Link
              to="/journals/list"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <GridIcon className="h-5 w-5" />
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
          <Skeleton variant="rectangular" width="100%" height={300} className="rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Stats Grid - 4 columns */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Entries */}
            <div className="group relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 p-6 shadow-theme-sm transition-all hover:shadow-theme-md hover:scale-[1.02] dark:border-blue-500/30 dark:from-blue-500/10 dark:via-blue-600/10 dark:to-blue-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Entries</p>
                  <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">{journals.length}</p>
                  <p className="mt-1 text-xs text-blue-600/70 dark:text-blue-400/70">All time</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-blue-200 to-blue-300 p-3 shadow-sm dark:from-blue-500/30 dark:to-blue-600/30">
                  <GridIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
              </div>
            </div>

            {/* Today */}
            <div className="group relative overflow-hidden rounded-2xl border border-green-200/50 bg-gradient-to-br from-green-50 via-emerald-100/50 to-green-50 p-6 shadow-theme-sm transition-all hover:shadow-theme-md hover:scale-[1.02] dark:border-green-500/30 dark:from-green-500/10 dark:via-emerald-600/10 dark:to-green-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Today</p>
                  <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">{todayEntries.length}</p>
                  <p className="mt-1 text-xs text-green-600/70 dark:text-green-400/70">Entries written</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-200 to-emerald-300 p-3 shadow-sm dark:from-green-500/30 dark:to-emerald-600/30">
                  <FileIcon className="h-6 w-6 text-green-700 dark:text-green-300" />
                </div>
              </div>
            </div>

            {/* This Week */}
            <div className="group relative overflow-hidden rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-50 p-6 shadow-theme-sm transition-all hover:shadow-theme-md hover:scale-[1.02] dark:border-purple-500/30 dark:from-purple-500/10 dark:via-purple-600/10 dark:to-purple-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">This Week</p>
                  <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-100">{weekEntries.length}</p>
                  <p className="mt-1 text-xs text-purple-600/70 dark:text-purple-400/70">Last 7 days</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-200 to-purple-300 p-3 shadow-sm dark:from-purple-500/30 dark:to-purple-600/30">
                  <TimeIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                </div>
              </div>
            </div>

            {/* Pinned Notes */}
            <div className="group relative overflow-hidden rounded-2xl border border-orange-200/50 bg-gradient-to-br from-orange-50 via-amber-100/50 to-orange-50 p-6 shadow-theme-sm transition-all hover:shadow-theme-md hover:scale-[1.02] dark:border-orange-500/30 dark:from-orange-500/10 dark:via-amber-600/10 dark:to-orange-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pinned</p>
                  <p className="mt-2 text-3xl font-bold text-orange-900 dark:text-orange-100">{pinnedNotes.length}</p>
                  <p className="mt-1 text-xs text-orange-600/70 dark:text-orange-400/70">Important notes</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-orange-200 to-amber-300 p-3 shadow-sm dark:from-orange-500/30 dark:to-amber-600/30">
                  <ShootingStarIcon className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Entries - Takes 2 columns */}
            <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Entries</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Your latest journal moments</p>
                  </div>
                  <Link to="/journals/list" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                    View all →
                </Link>
              </div>
              {recentJournals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileIcon className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No entries yet.</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Start writing to see your entries here</p>
                  </div>
              ) : (
                <div className="space-y-3">
                  {recentJournals.map((j) => (
                      <Link
                        key={j.id}
                        to={`/journals/view/${j.id}`}
                        className="block rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-700 dark:hover:bg-brand-900/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{j.title}</p>
                            <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {formatIndonesianDate(j.date || "")}
                        {j.mood ? ` • ${getMoodEmoji(j.mood)} ${j.mood}` : ""}
                              {j.weather ? ` • ${getWeatherEmoji(j.weather)}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{stripHtml(j.content)}</p>
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
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Top Moods</h3>
                  {topMoods.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No mood data yet.</p>
                  ) : (
                  <div className="flex flex-wrap gap-2">
                      {topMoods.slice(0, 6).map(([m, c]) => (
                        <span
                          key={m}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm dark:from-blue-500/20 dark:to-blue-600/20 dark:text-blue-300"
                        >
                        {getMoodEmoji(m)} {m}
                        <span className="ml-1 rounded-lg bg-white/70 px-2 py-0.5 text-xs font-bold dark:bg-white/10">{c}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              {/* Pinned Notes */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Pinned Notes</h3>
                  {pinnedNotes.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No pinned notes.</p>
                  ) : (
                  <div className="space-y-2">
                      {pinnedNotes.map((n) => (
                      <div key={n.id} className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
                        <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{n.title}</p>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{n.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Link 
                  to="/journals/notes" 
                  className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Manage notes →
                </Link>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 p-3 dark:from-purple-500/20 dark:to-purple-600/20">
                    <CalenderIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{monthLabel}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View your journal entries by date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                  >
                    ← Prev
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                  >
                    Next →
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="px-2 py-1 text-center">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
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
                        className={`group relative h-16 rounded-xl border p-2 text-left transition-all hover:scale-105 ${
                          isSelected
                            ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/20 dark:border-brand-600 dark:bg-brand-500/10"
                            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800/40"
                        } ${!isCurrentMonth ? "opacity-30" : ""}`}
                        title={key}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${isToday ? "text-brand-700 dark:text-brand-300" : "text-gray-900 dark:text-white"}`}>
                            {d.getDate()}
                          </span>
                          {count > 0 ? (
                            <span className="rounded-lg bg-purple-500 px-1.5 py-0.5 text-xs font-bold text-white">
                              {count}
                            </span>
                          ) : null}
                        </div>

                        {count > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(byDate.get(key) || []).slice(0, 2).map((j) => (
                              <span
                                key={j.id}
                                className="inline-block h-1.5 w-1.5 rounded-full bg-purple-400 dark:bg-purple-300"
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
                <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedEntries.length > 0
                        ? `${selectedEntries.length} ${selectedEntries.length === 1 ? "entry" : "entries"} on ${selectedDate}`
                        : `No entries on ${selectedDate}`}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/journals/new?date=${selectedDate}`)}
                    >
                      Add Entry
                    </Button>
                  </div>

                  {selectedEntries.length > 0 && (
                    <div className="space-y-2">
                      {selectedEntries.map((j) => (
                        <Link
                          key={j.id}
                          to={`/journals/view/${j.id}`}
                          className="block rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-700"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{j.title}</p>
                              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                                {j.mood ? `${getMoodEmoji(j.mood)} ${j.mood}` : ""}
                                {j.weather ? ` • ${getWeatherEmoji(j.weather)}` : ""}
                                {j.location ? ` • ${j.location}` : ""}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{stripHtml(j.content)}</p>
                        </Link>
                      ))}
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


