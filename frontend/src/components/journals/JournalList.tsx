import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/button/Button";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { Skeleton } from "../common/Skeleton";
import Pagination from "../common/Pagination";
import { journalsService, Journal } from "../../services/journalsService";
import JournalFormModal from "./JournalFormModal";
import { FileIcon, MoreDotIcon, PencilIcon, PlusIcon, SearchIcon, TrashBinIcon, LockIcon } from "../../icons";
import { stripHtml } from "../../utils/text";
import { formatIndonesianDate } from "../../utils/date";
import { getMoodEmoji, getWeatherEmoji, getJournalCardGradient } from "../../utils/journal";
import { resolveAssetUrl } from "../../utils/url";

export default function JournalList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Journal[]>([]);

  const [search, setSearch] = useState("");
  // Privacy filter removed - no longer using private entries
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title-asc" | "title-desc" | "date-asc" | "date-desc">("newest");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

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
  }, [items, search, sortBy]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

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
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Journal Entries</h2>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
            Write reflections and track your mood.
          </p>
        </div>
        <Button
          onClick={() => {
            navigate("/journals/new");
          }}
          startIcon={<PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
          size="sm"
          className="text-xs sm:text-sm"
        >
          New Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-theme-xs dark:border-gray-800 dark:bg-gray-800 sm:p-4 md:p-5">
        <div className="grid gap-2 sm:gap-3 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 sm:left-3">
              <SearchIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title/content..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-2 pl-8 pr-2.5 text-xs text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800 sm:py-2.5 sm:pl-9 sm:pr-3 sm:text-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white/70 px-2.5 text-xs text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:focus:border-brand-800 sm:h-11 sm:px-3 sm:text-sm"
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
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800 sm:p-12 md:p-16">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 sm:mb-4 sm:h-16 sm:w-16">
            <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-300 sm:h-8 sm:w-8" />
          </div>
          <p className="text-base font-medium text-gray-900 dark:text-white sm:text-lg">No journal entries found</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-sm">
            Start writing your thoughts and reflections
          </p>
          <Button
            onClick={() => navigate("/journals/new")}
            className="mt-3 sm:mt-4"
            startIcon={<PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
            size="sm"
          >
            Create Your First Entry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((j) => {
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
                className={`group relative flex flex-col overflow-hidden rounded-2xl shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02] ${
                  hasCover ? "" : "border"
                }`}
                style={{
                  backgroundColor: hexToRgba(cardColor, 0.08),
                  borderColor: hasCover ? "transparent" : hexToRgba(cardColor, 0.3),
                }}
              >
                {/* Header: Cover Image or Color */}
                <div className="relative h-20 w-full overflow-hidden sm:h-24">
                  {j.cover_image ? (
                    <img
                      src={resolveAssetUrl(j.cover_image)}
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
                  ) : j.color ? (
                    <div className="h-full w-full" style={{ backgroundColor: cardColor }} />
                  ) : (
                    <div className="h-full w-full" style={{ backgroundColor: cardColor }} />
                  )}
                  
                  {/* Mood Emoji Box - Top Left Corner */}
                  {j.mood && (
                    <div 
                      className="absolute left-2 top-2 flex items-center justify-center rounded-xl shadow-2xl backdrop-blur-md bg-white/85 dark:bg-black/70 sm:left-3 sm:top-3 sm:rounded-2xl"
                      style={{
                        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                      }}
                    >
                      <span className="p-1.5 text-lg sm:p-2.5 sm:text-2xl">{getMoodEmoji(j.mood)}</span>
                    </div>
                  )}
                </div>

                {/* Title and Menu between header and content */}
                <div 
                  className="flex items-start justify-between gap-2 border-b px-4 py-3 sm:gap-3 sm:px-6 sm:py-4"
                  style={{
                    borderColor: hexToRgba(cardColor, 0.2),
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 sm:text-lg">{j.title}</h3>
                  </div>
                  <div className="relative shrink-0" ref={menuOpenId === j.id ? menuRef : null}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId((id) => (id === j.id ? null : j.id));
                      }}
                      className="rounded-lg p-1 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 sm:p-1.5"
                      title="Options"
                    >
                      <MoreDotIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    {menuOpenId === j.id ? (
                      <div className="absolute right-0 top-8 z-[100] w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:top-9 sm:w-44 sm:rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenId(null);
                            navigate(`/journals/view/${j.id}`);
                          }}
                          className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
                        >
                          <FileIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenId(null);
                            navigate(`/journals/edit/${j.id}`);
                          }}
                          className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
                        >
                          <PencilIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenId(null);
                            setDeleteModal({ open: true, item: j });
                          }}
                          className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
                        >
                          <TrashBinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Content - flex-grow to push button to bottom */}
                <div 
                  className="flex-grow p-4 sm:p-6"
                  style={{
                    backgroundColor: hexToRgba(cardColor, 0.05),
                  }}
                >
                    {/* Metadata and Content */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 sm:text-xs">
                          {formatIndonesianDate(j.date || "")}
                        </p>
                        {j.category && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-200/60 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 dark:bg-gray-700/60 dark:text-gray-200 sm:text-xs">
                            {j.category.icon && <span>{j.category.icon}</span>}
                            <span>{j.category.name}</span>
                          </span>
                        )}
                        {j.weather && (
                          <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 sm:text-xs">
                            {getWeatherEmoji(j.weather)} {j.weather}
                          </p>
                        )}
                        {j.location && (
                          <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 sm:text-xs">
                            📍 {j.location}
                          </p>
                        )}
                      </div>

                    {/* Content preview */}
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-3 sm:text-sm">
                      {stripHtml(j.content)}
                    </p>
                  </div>
                </div>

                {/* View button - at the bottom of card */}
                <div className="p-3 pt-0 mt-auto sm:p-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/journals/view/${j.id}`)}
                    className="w-full rounded-lg px-3 py-2 text-xs font-semibold text-white transition sm:px-4 sm:py-2.5 sm:text-sm"
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
          {filtered.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filtered.length}
                onItemsPerPageChange={(newItemsPerPage) => {
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1);
                }}
                itemsPerPageOptions={[12, 24, 48, 96]}
              />
            </div>
          )}
        </>
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


