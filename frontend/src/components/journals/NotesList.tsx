import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/button/Button";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { Skeleton } from "../common/Skeleton";
import { notesService, Note } from "../../services/notesService";
import NoteFormModal from "./NoteFormModal";
import { FileIcon, MoreDotIcon, PencilIcon, PlusIcon, SearchIcon, ShootingStarIcon, TrashBinIcon } from "../../icons";

export default function NotesList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Note[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [pinnedFilter, setPinnedFilter] = useState<"all" | "pinned" | "unpinned">("all");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Note | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await notesService.getAll();
      setItems(data);
    } catch (e) {
      console.error("Error loading notes:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

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

  const categories = useMemo(() => {
    const set = new Set(items.map((n) => n.category).filter(Boolean) as string[]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((n) => {
      if (category && (n.category || "") !== category) return false;
      if (pinnedFilter === "pinned" && !n.is_pinned) return false;
      if (pinnedFilter === "unpinned" && n.is_pinned) return false;
      if (!q) return true;
      return (
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q) ||
        (n.category || "").toLowerCase().includes(q)
      );
    });
  }, [items, search, category, pinnedFilter]);

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      if (editing) await notesService.update(editing.id, data);
      else await notesService.create(data);
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
      await notesService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      await load();
    } finally {
      setDeleting(false);
    }
  };

  const togglePin = async (n: Note) => {
    try {
      await notesService.update(n.id, { is_pinned: !n.is_pinned });
      await load();
    } catch (e) {
      console.error("Error pinning note:", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Capture ideas quickly. Pin important notes and organize by category.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          startIcon={<PlusIcon className="h-5 w-5" />}
        >
          New Note
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
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
          <select
            value={pinnedFilter}
            onChange={(e) => setPinnedFilter(e.target.value as any)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white/70 px-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:focus:border-brand-800"
          >
            <option value="all">All</option>
            <option value="pinned">Pinned</option>
            <option value="unpinned">Unpinned</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{filtered.length} items</p>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={72} className="rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">No notes found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filtered.map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{n.title}</p>
                    {n.is_pinned ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                        <ShootingStarIcon className="h-3.5 w-3.5" />
                        Pinned
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {n.category ? `${n.category} • ` : ""}
                    {(n.created_at || "").slice(0, 10)}
                  </p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{n.content}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => togglePin(n)}
                    className={`rounded-lg p-2 transition-all ${
                      n.is_pinned
                        ? "text-orange-600 hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-orange-500/10"
                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                    title={n.is_pinned ? "Unpin" : "Pin"}
                  >
                    <ShootingStarIcon className="h-4 w-4" />
                  </button>

                  <div className="relative" ref={menuOpenId === n.id ? menuRef : null}>
                    <button
                      type="button"
                      onClick={() => setMenuOpenId((id) => (id === n.id ? null : n.id))}
                      className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      title="Options"
                    >
                      <MoreDotIcon className="h-4 w-4" />
                    </button>
                    {menuOpenId === n.id ? (
                      <div className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenId(null);
                            setEditing(n);
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
                            setDeleteModal({ open: true, item: n });
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

      <NoteFormModal
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
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        itemName={deleteModal.item?.title}
        isLoading={deleting}
      />
    </div>
  );
}


