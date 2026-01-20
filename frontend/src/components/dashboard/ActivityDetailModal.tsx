import { useEffect, useRef, useState } from "react";
import { activitiesService, ActivityDetail } from "../../services/activitiesService";
import { Link } from "react-router";

interface ActivityDetailModalProps {
  open: boolean;
  date: string | null;
  onClose: () => void;
}

function formatDateId(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatTime(timeStr: string) {
  const d = new Date(timeStr);
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function ActivityDetailModal({ open, date, onClose }: ActivityDetailModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activityDetail, setActivityDetail] = useState<ActivityDetail | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (open && date) {
      setIsMounted(true);
      setIsVisible(false);
      requestAnimationFrame(() => setIsVisible(true));
      loadActivityDetail(date);
    } else {
      setIsVisible(false);
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = window.setTimeout(() => {
        setIsMounted(false);
        setActivityDetail(null);
      }, 200);
    }
  }, [open, date]);

  const loadActivityDetail = async (dateStr: string) => {
    try {
      setLoading(true);
      const data = await activitiesService.getByDate(dateStr);
      setActivityDetail(data);
    } catch (error) {
      console.error("Error loading activity detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestClose = () => {
    setIsVisible(false);
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose();
      setIsMounted(false);
    }, 200);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (!open && !isMounted) return null;

  const totalActivities =
    (activityDetail?.tasks?.length || 0) +
    (activityDetail?.habit_logs?.length || 0) +
    (activityDetail?.journals?.length || 0) +
    (activityDetail?.transactions?.length || 0) +
    (activityDetail?.schedules?.length || 0) +
    (activityDetail?.time_trackings?.length || 0) +
    (activityDetail?.files?.length || 0) +
    (activityDetail?.notes?.length || 0) +
    (activityDetail?.links?.length || 0);

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={requestClose}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-transform duration-200 dark:border-gray-700 dark:bg-gray-800 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activity Details</h3>
            {date && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{formatDateId(date)}</p>}
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

        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading activities...</p>
          </div>
        ) : totalActivities === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">No activities recorded on this day.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tasks Section */}
            {activityDetail?.tasks && activityDetail.tasks.length > 0 && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-500/10">
                <Link
                  to="/tasks"
                  className="mb-4 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-500/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tasks & Targets
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activityDetail.tasks.length} {activityDetail.tasks.length === 1 ? "task" : "tasks"}
                    </p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="space-y-2">
                  {activityDetail.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                            {task.category && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                                {task.category}
                              </span>
                            )}
                            {task.priority && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  task.priority === "high"
                                    ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                    : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                                }`}
                              >
                                {task.priority}
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                            {task.due_date && (
                              <span>Due: {new Date(task.due_date).toLocaleDateString("en-US")}</span>
                            )}
                            {task.progress !== undefined && task.progress !== null && (
                              <span>Progress: {task.progress}%</span>
                            )}
                            {task.target && (
                              <span>Target: {task.target.title}</span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                            task.status === "finish" || task.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                              : task.status === "in_progress" || task.status === "on_progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Habits Section */}
            {activityDetail?.habit_logs && activityDetail.habit_logs.length > 0 && (
              <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-800/50 dark:bg-orange-500/10">
                <Link
                  to="/habits"
                  className="mb-4 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-orange-100/50 dark:hover:bg-orange-500/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/20">
                    <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Habits & Streaks
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activityDetail.habit_logs.length} {activityDetail.habit_logs.length === 1 ? "habit" : "habits"}
                    </p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="space-y-2">
                  {activityDetail.habit_logs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-lg border border-orange-200 bg-white p-3 dark:border-orange-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-2xl shrink-0">{log.habit?.icon || "✓"}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white">{log.habit?.name || "Habit"}</p>
                            {log.habit?.description && (
                              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                {log.habit.description}
                              </p>
                            )}
                            {log.notes && (
                              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 italic">
                                Note: {log.notes}
                              </p>
                            )}
                            {log.habit && (log.habit.current_streak > 0 || log.habit.longest_streak > 0) && (
                              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                {log.habit.current_streak > 0 && (
                                  <span>🔥 Streak: {log.habit.current_streak} days</span>
                                )}
                                {log.habit.longest_streak > 0 && (
                                  <span>⭐ Best: {log.habit.longest_streak} days</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {log.completed && (
                          <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-500/20 dark:text-green-400">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Journals Section */}
            {activityDetail?.journals && activityDetail.journals.length > 0 && (
              <div className="rounded-xl border border-pink-200 bg-pink-50/50 p-4 dark:border-pink-800/50 dark:bg-pink-500/10">
                <Link
                  to="/journals"
                  className="mb-4 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-pink-100/50 dark:hover:bg-pink-500/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-500/20">
                    <svg className="h-5 w-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Journal & Notes
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activityDetail.journals.length} {activityDetail.journals.length === 1 ? "entry" : "entries"}
                    </p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="space-y-2">
                  {activityDetail.journals.map((journal) => (
                    <div
                      key={journal.id}
                      className="rounded-lg border border-pink-200 bg-white p-3 dark:border-pink-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">{journal.title}</p>
                          {journal.content && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                              {journal.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                              {journal.content.replace(/<[^>]*>/g, "").length > 150 && "..."}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                            {journal.mood && (
                              <span>😊 Mood: {journal.mood}</span>
                            )}
                            {journal.weather && (
                              <span>🌤️ {journal.weather}</span>
                            )}
                            {journal.location && (
                              <span>📍 {journal.location}</span>
                            )}
                            {journal.tags && Array.isArray(journal.tags) && journal.tags.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap">
                                {journal.tags.slice(0, 3).map((tag: string, idx: number) => (
                                  <span key={idx} className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700 dark:bg-pink-500/20 dark:text-pink-400">
                                    #{tag}
                                  </span>
                                ))}
                                {journal.tags.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{journal.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Transactions Section */}
            {activityDetail?.transactions && activityDetail.transactions.length > 0 && (
              <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-800/50 dark:bg-green-500/10">
                <Link
                  to="/finance"
                  className="mb-4 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-green-100/50 dark:hover:bg-green-500/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/20">
                    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Personal Finance
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activityDetail.transactions.length} {activityDetail.transactions.length === 1 ? "transaction" : "transactions"}
                    </p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="space-y-2">
                  {activityDetail.transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="rounded-lg border border-green-200 bg-white p-3 dark:border-green-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description || transaction.category || "Transaction"}
                          </p>
                          {transaction.category && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{transaction.category}</p>
                          )}
                        </div>
                        <span
                          className={`shrink-0 font-semibold text-sm ${
                            transaction.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}Rp{" "}
                          {parseFloat(transaction.amount).toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Productivity & Time Section (Combined Schedules + Time Trackings) */}
            {((activityDetail?.schedules && activityDetail.schedules.length > 0) || 
              (activityDetail?.time_trackings && activityDetail.time_trackings.length > 0)) && (
              <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800/50 dark:bg-purple-500/10">
                <Link
                  to="/productivity"
                  className="mb-4 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-purple-100/50 dark:hover:bg-purple-500/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20">
                    <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Productivity & Time
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {((activityDetail?.schedules?.length || 0) + (activityDetail?.time_trackings?.length || 0))} activities
                    </p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="space-y-2">
                  {/* Schedules */}
                  {activityDetail?.schedules && activityDetail.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="rounded-lg border border-purple-200 bg-white p-3 dark:border-purple-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">{schedule.title}</p>
                          {schedule.description && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {schedule.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                            {schedule.start_time && (
                              <span>
                                🕐 {formatTime(schedule.start_time)}
                                {schedule.end_time && ` - ${formatTime(schedule.end_time)}`}
                              </span>
                            )}
                            {schedule.location && (
                              <span>📍 {schedule.location}</span>
                            )}
                          </div>
                        </div>
                        {schedule.is_completed && (
                          <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-500/20 dark:text-green-400">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Time Trackings */}
                  {activityDetail?.time_trackings && activityDetail.time_trackings.map((tracking) => (
                    <div
                      key={tracking.id}
                      className="rounded-lg border border-purple-200 bg-white p-3 dark:border-purple-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">{tracking.activity}</p>
                          {tracking.description && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {tracking.description}
                            </p>
                          )}
                          {tracking.category && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Category: {tracking.category}
                            </p>
                          )}
                        </div>
                        {tracking.duration_minutes && (
                          <span className="shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
                            ⏱️ {Math.floor(tracking.duration_minutes / 60)}h {tracking.duration_minutes % 60}m
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Section (Combined Files + Notes + Links) */}
            {((activityDetail?.files && activityDetail.files.length > 0) || 
              (activityDetail?.notes && activityDetail.notes.length > 0) ||
              (activityDetail?.links && activityDetail.links.length > 0)) && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-800/50 dark:bg-indigo-500/10">
                <Link
                  to="/storage"
                  className="mb-4 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-indigo-100/50 dark:hover:bg-indigo-500/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20">
                    <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 5.25 4h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5A2.25 2.25 0 0 1 21.75 9v.776" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Storage
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {((activityDetail?.files?.length || 0) + (activityDetail?.notes?.length || 0) + (activityDetail?.links?.length || 0))} items
                    </p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="space-y-2">
                  {/* Files */}
                  {activityDetail?.files && activityDetail.files.map((file: any) => (
                    <div
                      key={file.id}
                      className="rounded-lg border border-indigo-200 bg-white p-3 dark:border-indigo-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📄</span>
                            <p className="font-medium text-gray-900 dark:text-white">{file.original_name || file.name}</p>
                          </div>
                          {file.description && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {file.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                            {file.category && (
                              <span>Category: {file.category}</span>
                            )}
                            {file.size && (
                              <span>Size: {(file.size / 1024).toFixed(2)} KB</span>
                            )}
                            {file.mime_type && (
                              <span>Type: {file.mime_type}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Notes */}
                  {activityDetail?.notes && activityDetail.notes.map((note: any) => (
                    <div
                      key={note.id}
                      className="rounded-lg border border-indigo-200 bg-white p-3 dark:border-indigo-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📝</span>
                            <p className="font-medium text-gray-900 dark:text-white">{note.title}</p>
                            {note.is_pinned && (
                              <span className="text-xs text-yellow-600 dark:text-yellow-400">📌</span>
                            )}
                          </div>
                          {note.content && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                              {note.content.substring(0, 150)}
                              {note.content.length > 150 && "..."}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                            {note.category && (
                              <span>Category: {note.category}</span>
                            )}
                            {note.tags && Array.isArray(note.tags) && note.tags.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap">
                                {note.tags.slice(0, 3).map((tag: string, idx: number) => (
                                  <span key={idx} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                                    #{tag}
                                  </span>
                                ))}
                                {note.tags.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{note.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Links */}
                  {activityDetail?.links && activityDetail.links.map((link: any) => (
                    <div
                      key={link.id}
                      className="rounded-lg border border-indigo-200 bg-white p-3 dark:border-indigo-800/50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🔗</span>
                            <p className="font-medium text-gray-900 dark:text-white">{link.title}</p>
                            {link.is_favorite && (
                              <span className="text-xs text-yellow-600 dark:text-yellow-400">⭐</span>
                            )}
                          </div>
                          {link.url && (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline line-clamp-1"
                            >
                              {link.url}
                            </a>
                          )}
                          {link.description && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                            {link.category && (
                              <span>Category: {link.category}</span>
                            )}
                            {link.tags && Array.isArray(link.tags) && link.tags.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap">
                                {link.tags.slice(0, 3).map((tag: string, idx: number) => (
                                  <span key={idx} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                                    #{tag}
                                  </span>
                                ))}
                                {link.tags.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{link.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
