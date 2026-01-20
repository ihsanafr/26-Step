import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/button/Button";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import DatePicker from "../form/input/DatePicker";
import { MoreDotIcon, PlusIcon, SearchIcon, PencilIcon, TrashBinIcon } from "../../icons";
import { TimeTracking, timeTrackingsService } from "../../services/timeTrackingsService";
import TimeTrackingFormModal from "./TimeTrackingFormModal";
import { formatLocalDate, minutesToHM } from "./utils";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<TimeTracking[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TimeTracking | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: TimeTracking | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await timeTrackingsService.getAll({
        category: category || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      });
      setEntries(data);
    } catch (e) {
      console.error("Error loading time trackings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return entries;
    return entries.filter((e) => {
      const a = (e.activity || "").toLowerCase();
      const c = (e.category || "").toLowerCase();
      const d = (e.description || "").toLowerCase();
      return a.includes(q) || c.includes(q) || d.includes(q);
    });
  }, [entries, q]);

  const categories = useMemo(() => {
    const set = new Set(entries.map((e) => e.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const totalMinutes = useMemo(() => filtered.reduce((s, e) => s + e.duration_minutes, 0), [filtered]);

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      if (editing) {
        await timeTrackingsService.update(editing.id, data);
      } else {
        await timeTrackingsService.create(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleting(true);
      await timeTrackingsService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      await load();
    } finally {
      setDeleting(false);
    }
  };

  // row menu
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (menuOpenId === null) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setMenuOpenId(null);
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [menuOpenId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Add, edit, and analyze your time logs.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          startIcon={<PlusIcon className="h-5 w-5" />}
        >
          Add Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-gray-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white/70 px-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:focus:border-brand-800"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <DatePicker
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white/70 px-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:focus:border-brand-800"
          />
          <DatePicker
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white/70 px-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:focus:border-brand-800"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total: <span className="font-semibold text-gray-900 dark:text-white">{minutesToHM(totalMinutes)}</span> •{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> entries
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setDateFrom(formatLocalDate(new Date()));
              setDateTo(formatLocalDate(new Date()));
            }}>
              Today
            </Button>
            <Button variant="outline" onClick={load}>
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Time Entries</h2>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse dark:bg-gray-700" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">No entries found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filtered.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{e.activity}</p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {e.category} • {e.date?.slice(0, 10)}
                    {e.description ? ` • ${e.description}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                    {minutesToHM(e.duration_minutes)}
                  </span>
                  <div className="relative" ref={menuOpenId === e.id ? menuRef : null}>
                    <button
                      type="button"
                      onClick={() => setMenuOpenId((id) => (id === e.id ? null : e.id))}
                      className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      title="Options"
                    >
                      <MoreDotIcon className="h-4 w-4" />
                    </button>
                    {menuOpenId === e.id ? (
                      <div className="absolute right-0 top-10 z-30 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenId(null);
                            setEditing(e);
                            setShowForm(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenId(null);
                            setDeleteModal({ open: true, item: e });
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <TrashBinIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TimeTrackingFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        onSave={handleSave}
        isLoading={saving}
        editing={editing}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this time entry?"
        itemName={deleteModal.item?.activity}
        isLoading={deleting}
      />
    </div>
  );
}


