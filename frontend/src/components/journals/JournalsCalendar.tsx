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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">See your journal activity by date.</p>
        </div>
        <Button
          onClick={() => {
            navigate(`/journals/new?date=${formatYMD(new Date())}`);
          }}
          startIcon={<PlusIcon className="h-5 w-5" />}
        >
          New Entry
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalenderIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{monthLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            >
              Next
            </Button>
          </div>
        </div>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={360} className="rounded-2xl" />
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="px-2 py-1 font-semibold">
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
                    onClick={() => setSelectedDate(key)}
                    className={`group relative h-20 rounded-2xl border p-2 text-left transition-all ${
                      isSelected
                        ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/20 dark:border-brand-600 dark:bg-brand-500/10"
                        : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800/40"
                    } ${!isCurrentMonth ? "opacity-40" : ""}`}
                    title={key}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${isToday ? "text-brand-700 dark:text-brand-300" : "text-gray-900 dark:text-white"}`}>
                        {d.getDate()}
                      </span>
                      {count > 0 ? (
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                          {count}
                        </span>
                      ) : null}
                    </div>

                    {count > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(byDate.get(key) || []).slice(0, 3).map((j) => (
                          <span
                            key={j.id}
                            className="inline-flex max-w-full truncate rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                          >
                            {j.mood || "Entry"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-6 text-[10px] text-gray-400 opacity-0 transition group-hover:opacity-100 dark:text-gray-500">
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
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {selectedDate ? `Entries on ${selectedDate}` : "Pick a date"}
            </h3>
          </div>
          {selectedDate ? (
            <Button
              variant="outline"
              onClick={() => navigate(`/journals/new?date=${selectedDate}`)}
            >
              Add for this date
            </Button>
          ) : null}
        </div>

        {!selectedDate ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">Select a day from the calendar to see details.</p>
        ) : selectedEntries.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">No entries on this date.</p>
        ) : (
          <div className="space-y-3">
            {selectedEntries.map((j) => (
              <div key={j.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{j.title}</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {j.mood ? `${j.mood} • ` : ""}
                      {j.weather ? `${j.weather} • ` : ""}
                      {j.location ? j.location : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(j);
                      setShowForm(true);
                    }}
                  >
                    View / Edit
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{stripHtml(j.content)}</p>
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


