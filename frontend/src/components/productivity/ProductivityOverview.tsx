import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { CalenderIcon, TimeIcon, FileIcon, PlusIcon } from "../../icons";
import { schedulesService, Schedule } from "../../services/schedulesService";
import { timeTrackingsService, TimeTracking } from "../../services/timeTrackingsService";
import { formatLocalDate, minutesToHM, startOfWeek } from "./utils";

export default function ProductivityOverview() {
  const [loading, setLoading] = useState(true);
  const [timeEntries, setTimeEntries] = useState<TimeTracking[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatLocalDate(today), [today]);
  const weekStartStr = useMemo(() => formatLocalDate(startOfWeek(today)), [today]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [weekEntries, allSchedules] = await Promise.all([
          timeTrackingsService.getAll({ date_from: weekStartStr, date_to: todayStr }),
          schedulesService.getAll({ date_from: `${weekStartStr}T00:00:00`, date_to: `${todayStr}T23:59:59` }),
        ]);
        setTimeEntries(weekEntries);
        setSchedules(allSchedules);
      } catch (e) {
        console.error("Error loading productivity data:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [todayStr, weekStartStr]);

  const todayMinutes = useMemo(
    () => timeEntries.filter((t) => (t.date || "").slice(0, 10) === todayStr).reduce((s, t) => s + t.duration_minutes, 0),
    [timeEntries, todayStr]
  );

  const weekMinutes = useMemo(
    () => timeEntries.reduce((s, t) => s + t.duration_minutes, 0),
    [timeEntries]
  );

  const upcoming = useMemo(() => {
    const now = new Date();
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return schedules
      .filter((s) => !s.is_completed)
      .filter((s) => {
        const start = new Date(s.start_time);
        return start >= now && start <= endOfToday;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 5);
  }, [schedules]);

  const recentEntries = useMemo(() => {
    return [...timeEntries]
      .sort((a, b) => {
        const da = (a.date || "").slice(0, 10);
        const db = (b.date || "").slice(0, 10);
        if (da !== db) return db.localeCompare(da);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })
      .slice(0, 6);
  }, [timeEntries]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Productivity & Time
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your time, run focus sessions, and plan your day.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-purple-500/10 dark:to-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <TimeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "—" : minutesToHM(todayMinutes)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-blue-500/10 dark:to-blue-500/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <FileIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "—" : minutesToHM(weekMinutes)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-orange-500/10 dark:to-orange-500/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <CalenderIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "—" : upcoming.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-theme-xs dark:border-gray-700 dark:from-green-500/10 dark:to-green-500/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
              <PlusIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Entries (week)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "—" : timeEntries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/productivity/pomodoro"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition-all hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-800"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Focus</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Start Pomodoro</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Run a focus session and save it to your logs.</p>
        </Link>
        <Link
          to="/productivity/reports"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition-all hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-800"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Logs</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">View Reports</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Add, edit, and analyze your time entries.</p>
        </Link>
        <Link
          to="/productivity/schedule"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition-all hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-800"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Planning</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Manage Schedule</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Create simple time blocks and reminders.</p>
        </Link>
      </div>

      {/* Upcoming today */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Today</h2>
            <Link to="/productivity/schedule" className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">
              Open
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse dark:bg-gray-700" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No upcoming schedule items for today.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((s) => (
                <div key={s.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{s.title}</p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {new Date(s.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                      Upcoming
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Time Entries</h2>
            <Link to="/productivity/reports" className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">
              Open
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse dark:bg-gray-700" />
              ))}
            </div>
          ) : recentEntries.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No time entries yet. Start a Pomodoro or add a log.</p>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((t) => (
                <div key={t.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{t.activity}</p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {t.category} • {t.date?.slice(0, 10)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                      {minutesToHM(t.duration_minutes)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


