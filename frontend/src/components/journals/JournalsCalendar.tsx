import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { journalsService, Journal } from "../../services/journalsService";
import { Skeleton } from "../common/Skeleton";
import { CalenderIcon, FileIcon, PlusIcon } from "../../icons";
import Button from "../ui/button/Button";
import JournalFormModal from "./JournalFormModal";
import { stripHtml } from "../../utils/text";

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

  const days: (Date | null)[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function JournalsCalendar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Journal[]>([]);

  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();

  const load = async () => {
    try {
      setLoading(true);
      const data = await journalsService.getAll({ month: monthIndex + 1, year });
      setItems(data);
    } catch (e) {
      console.error("Error loading calendar journals:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, monthIndex]);

  const byDate = useMemo(() => {
    const map = new Map<string, Journal[]>();
    items.forEach((j) => {
      const key = (j.date || "").slice(0, 10);
      map.set(key, [...(map.get(key) || []), j]);
    });
    return map;
  }, [items]);

  const grid = useMemo(() => getMonthGrid(year, monthIndex), [year, monthIndex]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedEntries = useMemo(() => (selectedDate ? byDate.get(selectedDate) || [] : []), [byDate, selectedDate]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Journal | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      if (editing) await journalsService.update(editing.id, data);
      else await journalsService.create(data);
      setShowForm(false);
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Calendar</h2>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">See your journal activity by date.</p>
        </div>
        <Button
          onClick={() => {
            navigate(`/journals/new?date=${formatYMD(new Date())}`);
          }}
          startIcon={<PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
          size="sm"
          className="text-xs sm:text-sm"
        >
          New Entry
        </Button>
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
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              className="text-xs sm:text-sm"
            >
              Next
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
                const key = formatYMD(d);
                const count = (byDate.get(key) || []).length;
                const isSelected = selectedDate === key;
                const todayKey = formatYMD(new Date());
                const isToday = key === todayKey;

                return (
                  <button
                    key={`${key}-${idx}`}
                    type="button"
                    onClick={() => setSelectedDate(key)}
                    className={`group relative h-12 rounded-lg border p-1 text-left transition-all sm:h-20 sm:rounded-2xl sm:p-2 ${
                      isSelected
                        ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/20 dark:border-brand-600 dark:bg-brand-500/10"
                        : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800/40"
                    } ${!isCurrentMonth ? "opacity-40" : ""}`}
                    title={key}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold sm:text-sm ${isToday ? "text-brand-700 dark:text-brand-300" : "text-gray-900 dark:text-white"}`}>
                        {d.getDate()}
                      </span>
                      {count > 0 ? (
                        <span className="rounded-full bg-purple-100 px-1 py-0.5 text-[9px] font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 sm:px-2 sm:text-xs">
                          {count}
                        </span>
                      ) : null}
                    </div>

                    {count > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-0.5 sm:mt-2 sm:gap-1">
                        {(byDate.get(key) || []).slice(0, 3).map((j) => (
                          <span
                            key={j.id}
                            className="inline-flex max-w-full truncate rounded bg-gray-100 px-1 py-0.5 text-[8px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200 sm:text-[10px] sm:px-1.5"
                          >
                            {j.mood || "Entry"}
                          </span>
                        ))}
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

      {/* Day detail */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800 sm:p-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 sm:h-5 sm:w-5" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate sm:text-lg">
              {selectedDate ? `Entries on ${selectedDate}` : "Pick a date"}
            </h3>
          </div>
          {selectedDate ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/journals/new?date=${selectedDate}`)}
              className="text-xs sm:text-sm"
            >
              Add for this date
            </Button>
          ) : null}
        </div>

        {!selectedDate ? (
          <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Select a day from the calendar to see details.</p>
        ) : selectedEntries.length === 0 ? (
          <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">No entries on this date.</p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {selectedEntries.map((j) => (
              <div key={j.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700 sm:rounded-xl sm:p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate sm:text-base">{j.title}</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {j.mood ? `${j.mood} • ` : ""}
                      {j.weather ? `${j.weather} • ` : ""}
                      {j.location ? j.location : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(j);
                      setShowForm(true);
                    }}
                    className="text-xs sm:text-sm"
                  >
                    View / Edit
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 line-clamp-3 sm:text-sm">{stripHtml(j.content)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <JournalFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        onSave={handleSave}
        isLoading={saving}
        editing={editing}
        mode="edit"
      />
    </div>
  );
}


