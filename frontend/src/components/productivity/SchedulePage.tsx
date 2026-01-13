import { useEffect, useRef, useState } from "react";
import Button from "../ui/button/Button";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { schedulesService, Schedule } from "../../services/schedulesService";
import { CalenderIcon, MoreDotIcon, PencilIcon, PlusIcon, TrashBinIcon, CheckCircleIcon } from "../../icons";
import ScheduleFormModal from "./ScheduleFormModal";

function fmt(dt: string) {
  const d = new Date(dt);
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Schedule[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "done">("open");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Schedule | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

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

  const load = async () => {
    try {
      setLoading(true);
      const params =
        filter === "open" ? { is_completed: false } : filter === "done" ? { is_completed: true } : undefined;
      const data = await schedulesService.getAll(params as any);
      setItems(data);
    } catch (e) {
      console.error("Error loading schedules:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      if (editing) {
        await schedulesService.update(editing.id, data);
      } else {
        await schedulesService.create(data);
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
      await schedulesService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      await load();
    } finally {
      setDeleting(false);
    }
  };

  const toggleComplete = async (s: Schedule) => {
    try {
      await schedulesService.update(s.id, { is_completed: !s.is_completed });
      await load();
    } catch (e) {
      console.error("Error updating schedule:", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">Simple time blocks and reminders.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          startIcon={<PlusIcon className="h-5 w-5" />}
        >
          New Schedule
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { v: "open", label: "Open" },
          { v: "done", label: "Completed" },
          { v: "all", label: "All" },
        ].map((t) => (
          <button
            key={t.v}
            onClick={() => setFilter(t.v as any)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              filter === t.v
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h2>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse dark:bg-gray-700" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <CalenderIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">No schedule items yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleComplete(s)}
                    className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                      s.is_completed
                        ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "border-gray-300 text-gray-400 hover:text-gray-600 dark:border-gray-700 dark:hover:text-gray-200"
                    }`}
                    title={s.is_completed ? "Mark as open" : "Mark as completed"}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <div className="min-w-0">
                    <p className={`font-semibold truncate ${s.is_completed ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-900 dark:text-white"}`}>
                      {s.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {fmt(s.start_time)} → {fmt(s.end_time)}
                      {s.location ? ` • ${s.location}` : ""}
                    </p>
                    {s.description ? (
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{s.description}</p>
                    ) : null}
                  </div>
                </div>

                <div className="relative" ref={menuOpenId === s.id ? menuRef : null}>
                  <button
                    type="button"
                    onClick={() => setMenuOpenId((id) => (id === s.id ? null : s.id))}
                    className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    title="Options"
                  >
                    <MoreDotIcon className="h-4 w-4" />
                  </button>
                  {menuOpenId === s.id ? (
                    <div className="absolute right-0 top-10 z-30 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpenId(null);
                          setEditing(s);
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
                          setDeleteModal({ open: true, item: s });
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
            ))}
          </div>
        )}
      </div>

      <ScheduleFormModal
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
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule item?"
        itemName={deleteModal.item?.title}
        isLoading={deleting}
      />
    </div>
  );
}


