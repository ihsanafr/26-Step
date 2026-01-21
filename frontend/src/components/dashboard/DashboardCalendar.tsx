import { useEffect, useMemo, useState } from "react";
import { activitiesService, ActivityByDate } from "../../services/activitiesService";
import { CalenderIcon } from "../../icons";
import Button from "../ui/button/Button";
import { Skeleton } from "../common/Skeleton";
import { formatLocalDate } from "../../utils/date";

function getMonthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay()); // Sunday start

  const days: (Date | null)[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function getActivityCount(activities: ActivityByDate | undefined): number {
  if (!activities) return 0;
  return (
    (activities.tasks || 0) +
    (activities.habits || 0) +
    (activities.journals || 0) +
    (activities.transactions || 0) +
    (activities.schedules || 0) +
    (activities.time_trackings || 0) +
    (activities.files || 0) +
    (activities.notes || 0) +
    (activities.links || 0)
  );
}

interface ActivityIndicator {
  type: string;
  count: number;
  color: string;
  iconPath: string;
}

function getActivityIndicators(activities: ActivityByDate | undefined): ActivityIndicator[] {
  if (!activities) return [];
  const indicators: ActivityIndicator[] = [];
  
  if (activities.tasks) {
    indicators.push({
      type: "tasks",
      count: activities.tasks,
      color: "bg-blue-500",
      iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    });
  }
  if (activities.habits) {
    indicators.push({
      type: "habits",
      count: activities.habits,
      color: "bg-orange-500",
      iconPath: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    });
  }
  // Combine journals and notes into Journal & Notes
  const journalNotesCount = (activities.journals || 0) + (activities.notes || 0);
  if (journalNotesCount > 0) {
    indicators.push({
      type: "journals",
      count: journalNotesCount,
      color: "bg-pink-500",
      iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    });
  }
  if (activities.transactions) {
    indicators.push({
      type: "transactions",
      count: activities.transactions,
      color: "bg-green-500",
      iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    });
  }
  // Combine schedules and time_trackings into Productivity & Time
  const productivityCount = (activities.schedules || 0) + (activities.time_trackings || 0);
  if (productivityCount > 0) {
    indicators.push({
      type: "productivity",
      count: productivityCount,
      color: "bg-purple-500",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    });
  }
  
  // Combine files and links into Storage (notes are now in Journal & Notes)
  const storageCount = (activities.files || 0) + (activities.links || 0);
  if (storageCount > 0) {
    indicators.push({
      type: "storage",
      count: storageCount,
      color: "bg-indigo-500",
      iconPath: "M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 5.25 4h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5A2.25 2.25 0 0 1 21.75 9v.776",
    });
  }
  
  return indicators;
}

interface DashboardCalendarProps {
  onDateClick: (date: string) => void;
}

export default function DashboardCalendar({ onDateClick }: DashboardCalendarProps) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [loading, setLoading] = useState(true);
  const [activitiesByDate, setActivitiesByDate] = useState<Record<string, ActivityByDate>>({});

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0);
        const data = await activitiesService.getByDateRange(
          formatLocalDate(monthStart),
          formatLocalDate(monthEnd)
        );
        setActivitiesByDate(data);
      } catch (error) {
        console.error("Error loading activities:", error);
        setActivitiesByDate({});
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [year, monthIndex]);

  const grid = useMemo(() => getMonthGrid(year, monthIndex), [year, monthIndex]);

  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Activity Calendar</h2>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">View all your activities across modules</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex items-center gap-2">
            <CalenderIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 sm:h-5 sm:w-5" />
            <p className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">{monthLabel}</p>
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

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={360} className="rounded-2xl" />
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 sm:gap-2 sm:mb-2 sm:text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="px-1 py-0.5 font-semibold text-center sm:px-2 sm:py-1">
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{d.slice(0, 1)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {grid.map((d, idx) => {
                const isCurrentMonth = d.getMonth() === monthIndex;
                const key = formatLocalDate(d);
                const activities = activitiesByDate[key];
                const activityCount = getActivityCount(activities);
                const todayKey = formatLocalDate(new Date());
                const isToday = key === todayKey;
                const activityIndicators = getActivityIndicators(activities);

                return (
                  <button
                    key={`${key}-${idx}`}
                    type="button"
                    onClick={() => onDateClick(key)}
                    className={`group relative h-12 rounded-lg border p-1 text-left transition-all sm:h-20 sm:rounded-2xl sm:p-2 ${
                      isToday
                        ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/20 dark:border-brand-600 dark:bg-brand-500/10"
                        : activityCount > 0
                        ? "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800/40"
                        : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800/40"
                    } ${!isCurrentMonth ? "opacity-40" : ""}`}
                    title={key}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold sm:text-sm ${isToday ? "text-brand-700 dark:text-brand-300" : "text-gray-900 dark:text-white"}`}>
                        {d.getDate()}
                      </span>
                      {activityCount > 0 ? (
                        <span className="rounded-full bg-purple-100 px-1 py-0.5 text-[9px] font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 sm:px-2 sm:text-xs">
                          {activityCount}
                        </span>
                      ) : null}
                    </div>

                    {activityCount > 0 ? (
                      <div className="mt-1 flex flex-wrap items-center gap-0.5 sm:mt-2 sm:gap-1">
                        {activityIndicators.slice(0, 5).map((indicator, i) => (
                          <div
                            key={i}
                            className="group/indicator relative flex items-center"
                            title={`${indicator.type}: ${indicator.count}`}
                          >
                            {indicator.count > 1 ? (
                              <span className={`flex h-3 w-3 items-center justify-center rounded-full text-[7px] font-bold text-white sm:h-4 sm:w-4 sm:text-[9px] ${indicator.color}`}>
                                {indicator.count}
                              </span>
                            ) : (
                              <div className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${indicator.color}`} />
                            )}
                          </div>
                        ))}
                        {activityIndicators.length > 5 && (
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400 sm:h-2 sm:w-2" title={`+${activityIndicators.length - 5} more`} />
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 text-[8px] text-gray-400 opacity-0 transition group-hover:opacity-100 dark:text-gray-500 sm:mt-6 sm:text-[10px]">
                        view
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
