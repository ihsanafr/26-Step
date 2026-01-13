import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/button/Button";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { Skeleton } from "../common/Skeleton";
import { journalsService, Journal } from "../../services/journalsService";
import JournalFormModal from "./JournalFormModal";
import { FileIcon, MoreDotIcon, PencilIcon, PlusIcon, SearchIcon, TrashBinIcon, LockIcon } from "../../icons";
import { stripHtml } from "../../utils/text";
import { formatIndonesianDate } from "../../utils/date";
import { getMoodEmoji, getWeatherEmoji, getJournalCardGradient } from "../../utils/journal";

export default function JournalList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Journal[]>([]);

  const [search, setSearch] = useState("");
  const [privacy, setPrivacy] = useState<"all" | "private" | "public">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title-asc" | "title-desc" | "date-asc" | "date-desc">("newest");

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"edit" | "view">("edit");
  const [editing, setEditing] = useState<Journal | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Journal | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await journalsService.getAll();
      setItems(data);
    } catch (e) {
      console.error("Error loading journals:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // create flow is handled by /journals/new page (not modal)

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


  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = items.filter((j) => {
      if (privacy === "private" && !j.is_private) return false;
      if (privacy === "public" && j.is_private) return false;
      if (!q) return true;
      return (
        (j.title || "").toLowerCase().includes(q) ||
        stripHtml(j.content || "").toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q) ||
        (j.weather || "").toLowerCase().includes(q) ||
        (j.mood || "").toLowerCase().includes(q)
      );
    });

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime();
        case "oldest":
          return new Date(a.created_at || a.date || 0).getTime() - new Date(b.created_at || b.date || 0).getTime();
        case "title-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "date-asc":
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        case "date-desc":
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [items, search, privacy, sortBy]);

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

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleting(true);
      await journalsService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      await load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Journal Entries</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Write reflections and track your mood.
          </p>
        </div>
        <Button
          onClick={() => {
            navigate("/journals/new");
          }}
          startIcon={<PlusIcon className="h-5 w-5" />}
        >
          New Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-800">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title/content..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as any)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white/70 px-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:focus:border-brand-800"
          >
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white/70 px-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:focus:border-brand-800"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={200} className="rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <FileIcon className="h-8 w-8 text-gray-500 dark:text-gray-300" />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">No journal entries found</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start writing your thoughts and reflections
          </p>
          <Button
            onClick={() => navigate("/journals/new")}
            className="mt-4"
            startIcon={<PlusIcon className="h-5 w-5" />}
          >
            Create Your First Entry
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((j) => {
            const cardColor = j.color || "#6366F1";
            const hasCover = !!j.cover_image;
            
            // Convert hex to rgba for background
            const hexToRgba = (hex: string, alpha: number) => {
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };

            return (
              <div
                key={j.id}
                className="group relative overflow-hidden rounded-2xl border shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02]"
                style={{
                  backgroundColor: hasCover ? undefined : hexToRgba(cardColor, 0.1),
                  borderColor: hasCover ? undefined : hexToRgba(cardColor, 0.3),
                }}
              >
                {/* Header: Cover Image or Color */}
                <div className="relative h-24 w-full overflow-hidden">
                  {j.cover_image ? (
                    <>
                      <img
                        src={j.cover_image}
                        alt={j.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Fallback to color if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent && j.color) {
                            parent.style.backgroundColor = j.color;
                          }
                        }}
                      />
                    </>
                  ) : j.color ? (
                    <div className="h-full w-full" style={{ backgroundColor: cardColor }} />
                  ) : (
                    <div className="h-full w-full" style={{ backgroundColor: cardColor }} />
                  )}
                </div>

                {/* Title and Menu between header and content */}
                <div 
                  className="flex items-start justify-between gap-3 border-b px-6 py-4"
                  style={{
                    borderColor: hasCover ? undefined : hexToRgba(cardColor, 0.2),
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{j.title}</h3>
                    {j.is_private && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gray-200/60 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700/60 dark:text-gray-200">
                        <LockIcon className="h-3 w-3" />
                        Private
                      </span>
                    )}
                  </div>
                  <div className="relative shrink-0" ref={menuOpenId === j.id ? menuRef : null}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId((id) => (id === j.id ? null : j.id));
                      }}
                      className="rounded-lg p-1.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      title="Options"
                    >
                      <MoreDotIcon className="h-5 w-5" />
                    </button>
                    {menuOpenId === j.id ? (
                      <div className="absolute right-0 top-9 z-[100] w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenId(null);
                            setEditing(j);
                            setFormMode("view");
                            setShowForm(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          <FileIcon className="h-4 w-4" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenId(null);
                            navigate(`/journals/edit/${j.id}`);
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
                            setDeleteModal({ open: true, item: j });
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

                {/* Content */}
                <div 
                  className="p-6"
                  style={{
                    backgroundColor: hasCover ? undefined : hexToRgba(cardColor, 0.05),
                  }}
                >
                  {/* Metadata and Content */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {formatIndonesianDate(j.date || "")}
                      {j.mood ? ` • ${getMoodEmoji(j.mood)} ${j.mood}` : ""}
                      {j.weather ? ` • ${getWeatherEmoji(j.weather)} ${j.weather}` : ""}
                      {j.location ? ` • ${j.location}` : ""}
                    </p>

                    {/* Content preview */}
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-3">
                      {stripHtml(j.content)}
                    </p>
                  </div>

                  {/* View button */}
                  <button
                    type="button"
                    onClick={() => navigate(`/journals/view/${j.id}`)}
                    className="mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
                    style={{
                      backgroundColor: cardColor,
                    }}
                    onMouseEnter={(e) => {
                      const hex = cardColor;
                      const r = parseInt(hex.slice(1, 3), 16);
                      const g = parseInt(hex.slice(3, 5), 16);
                      const b = parseInt(hex.slice(5, 7), 16);
                      e.currentTarget.style.backgroundColor = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = cardColor;
                    }}
                  >
                    View Entry
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <JournalFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        onSave={handleSave}
        isLoading={saving}
        editing={editing}
        mode={formMode}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry?"
        itemName={deleteModal.item?.title}
        isLoading={deleting}
      />
    </div>
  );
}


