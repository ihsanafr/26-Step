import { useEffect, useMemo, useState } from "react";
import { journalsService, Journal } from "../../services/journalsService";
import { notesService, Note } from "../../services/notesService";
import { Skeleton } from "../common/Skeleton";
import { GridIcon, FileIcon, TimeIcon, ShootingStarIcon } from "../../icons";
import { Link } from "react-router";
import { formatLocalDate, startOfWeek } from "../productivity/utils";
import { stripHtml } from "../../utils/text";
import { formatIndonesianDate } from "../../utils/date";
import { getMoodEmoji, getWeatherEmoji } from "../../utils/journal";

function countBy<T extends string>(arr: (T | null | undefined)[]) {
  const map = new Map<string, number>();
  arr.forEach((x) => {
    const key = (x || "").trim();
    if (!key) return;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

export default function JournalsOverview() {
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatLocalDate(today), [today]);
  const weekStartStr = useMemo(() => formatLocalDate(startOfWeek(today)), [today]);

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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Journals & Notes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Reflect, capture quick notes, and organize your thoughts with moods.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={120} className="rounded-xl" />
            ))}
          </div>
          <Skeleton variant="rectangular" width="100%" height={220} className="rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-blue-500/10 dark:to-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
                  <FileIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Entries Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayEntries.length}</p>
                </div>
              </div>
            </div>

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


            <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-orange-500/10 dark:to-orange-500/5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
                  <ShootingStarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pinned Notes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pinnedNotes.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Journals */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Entries</h2>
                <Link to="/journals/list" className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">
                  View all
                </Link>
              </div>
              {recentJournals.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">No entries yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentJournals.map((j) => (
                    <div key={j.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{j.title}</p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {formatIndonesianDate(j.date || "")}
                        {j.mood ? ` • ${getMoodEmoji(j.mood)} ${j.mood}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{stripHtml(j.content)}</p>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/journals/new"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Write new entry
              </Link>
            </div>

            {/* Insights */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Insights</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Top moods</p>
                  {topMoods.length === 0 ? (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">No mood data yet.</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {topMoods.slice(0, 6).map(([m, c]) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                        >
                          {m} <span className="rounded-full bg-white/60 px-2 py-0.5 text-[11px] dark:bg-white/10">{c}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Pinned notes</p>
                  {pinnedNotes.length === 0 ? (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">No pinned notes.</p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {pinnedNotes.map((n) => (
                        <div key={n.id} className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{n.title}</p>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{n.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link to="/journals/notes" className="mt-3 inline-block text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">
                    Manage notes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


