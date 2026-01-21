import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/button/Button";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { Skeleton } from "../common/Skeleton";
import { notesService, Note } from "../../services/notesService";
import journalNoteCategoriesService, { JournalNoteCategory } from "../../services/journalNoteCategoriesService";
import NoteFormModal from "./NoteFormModal";
import NoteDetailModal from "./NoteDetailModal";
import PinSuccessModal from "./PinSuccessModal";
import { FileIcon, MoreDotIcon, PencilIcon, PlusIcon, SearchIcon, ShootingStarIcon, TrashBinIcon, GridIcon, TableIcon } from "../../icons";
import { formatIndonesianDate } from "../../utils/date";

export default function NotesList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Note[]>([]);
  const [masterCategories, setMasterCategories] = useState<JournalNoteCategory[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [pinnedFilter, setPinnedFilter] = useState<"all" | "pinned" | "unpinned">("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Note | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Modal state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pin success modal
  const [pinSuccessModal, setPinSuccessModal] = useState<{ open: boolean; isPinned: boolean }>({ open: false, isPinned: false });

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
    const loadCategories = async () => {
      try {
        const data = await journalNoteCategoriesService.getAll();
        setMasterCategories(data);
      } catch (e) {
        console.error("Error loading categories:", e);
      }
    };
    void loadCategories();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, pinnedFilter]);

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

  // Use master categories for filter dropdown
  const categories = useMemo(() => {
    return masterCategories.sort((a, b) => a.name.localeCompare(b.name));
  }, [masterCategories]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((n) => {
      // Handle category filter - support both string and object
      if (category) {
        const noteCategory = typeof n.category === "string" 
          ? n.category 
          : (n.category && typeof n.category === "object" && "name" in n.category) 
            ? n.category.name 
            : "";
        if (noteCategory !== category) return false;
      }
      if (pinnedFilter === "pinned" && !n.is_pinned) return false;
      if (pinnedFilter === "unpinned" && n.is_pinned) return false;
      if (!q) return true;
      const noteCategory = typeof n.category === "string" 
        ? n.category 
        : (n.category && typeof n.category === "object" && "name" in n.category) 
          ? n.category.name 
          : "";
      return (
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q) ||
        noteCategory.toLowerCase().includes(q)
      );
    });
  }, [items, search, category, pinnedFilter]);

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
      if (editing) {
        await notesService.update(editing.id, data);
        // Update selected note if it's the same
        if (selectedNote && selectedNote.id === editing.id) {
          const updated = await notesService.getById(editing.id);
          setSelectedNote(updated);
        }
      } else {
        await notesService.create(data);
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
      await notesService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      // Close modal if the deleted note is currently selected
      if (selectedNote && selectedNote.id === deleteModal.item.id) {
        setIsModalOpen(false);
        setSelectedNote(null);
      }
      await load();
    } finally {
      setDeleting(false);
    }
  };

  const togglePin = async (n: Note) => {
    try {
      const newPinnedState = !n.is_pinned;
      const updated = await notesService.update(n.id, { is_pinned: newPinnedState });
      // Update local state without reloading
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === n.id ? updated : item))
      );
      // Update selected note if it's the same
      if (selectedNote && selectedNote.id === n.id) {
        setSelectedNote(updated);
      }
      // Show success modal
      setPinSuccessModal({ open: true, isPinned: newPinnedState });
    } catch (e) {
      console.error("Error pinning note:", e);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleEditFromModal = (note: Note) => {
    setEditing(note);
    setShowForm(true);
    setIsModalOpen(false);
  };

  const handleDeleteFromModal = (note: Note) => {
    setDeleteModal({ open: true, item: note });
    setIsModalOpen(false);
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
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Search & Filter</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Find notes quickly by searching or filtering</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Search</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <SearchIcon className="h-5 w-5" />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, content, or category..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-400 transition-all focus:border-brand-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:border-brand-600"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-theme-xs transition-all focus:border-brand-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:border-brand-600"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.icon ? `${c.icon} ` : ""}{c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={pinnedFilter}
              onChange={(e) => setPinnedFilter(e.target.value as any)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-theme-xs transition-all focus:border-brand-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:border-brand-600"
            >
              <option value="all">All Notes</option>
              <option value="pinned">Pinned Only</option>
              <option value="unpinned">Unpinned Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {filtered.length === 1 ? "1 note" : `${filtered.length} notes`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(search || category || pinnedFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setPinnedFilter("all");
                  }}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Clear filters
                </button>
              )}
              <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                <button
                  onClick={() => setViewMode("table")}
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === "table"
                      ? "bg-brand-500 text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                  title="Table view"
                >
                  <TableIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === "card"
                      ? "bg-brand-500 text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                  title="Card view"
                >
                  <GridIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={100} className="rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <FileIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-base font-medium text-gray-900 dark:text-white">No notes found</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {search || category || pinnedFilter !== "all" 
                ? "Try adjusting your filters to see more results" 
                : "Create your first note to get started"}
            </p>
          </div>
        ) : viewMode === "table" ? (
          <>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedItems.map((n) => {
              const categoryName = typeof n.category === "string" 
                ? n.category 
                : (n.category && typeof n.category === "object" && "name" in n.category) 
                  ? n.category.name 
                  : null;
              const categoryIcon = typeof n.category === "object" && n.category && "icon" in n.category && n.category.icon
                ? n.category.icon
                : null;
              const categoryColor = typeof n.category === "object" && n.category && "color" in n.category && n.category.color
                ? n.category.color
                : null;

              return (
                <div 
                  key={n.id} 
                  className="group flex items-start justify-between gap-4 p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/50 cursor-pointer border-l-4"
                  style={{
                    borderLeftColor: n.color || 'transparent',
                  }}
                  onClick={() => handleNoteClick(n)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {n.title}
                          </h4>
                          {n.is_pinned && (
                            <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                              <ShootingStarIcon className="h-3 w-3" />
                              Pinned
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          {categoryName && (
                            <span className="inline-flex items-center gap-1.5">
                              {categoryIcon && <span className="text-sm">{categoryIcon}</span>}
                              <span className="font-medium">{categoryName}</span>
                            </span>
                          )}
                          <span className="text-gray-400 dark:text-gray-500">•</span>
                          <span>{formatIndonesianDate(n.created_at || "")}</span>
                        </div>
                        <p className="mt-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-2">
                          {n.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => togglePin(n)}
                      className={`rounded-lg p-2 transition-all ${
                        n.is_pinned
                          ? "text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10"
                          : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      }`}
                      title={n.is_pinned ? "Unpin note" : "Pin note"}
                    >
                      <ShootingStarIcon className="h-5 w-5" />
                    </button>

                    <div className="relative" ref={menuOpenId === n.id ? menuRef : null}>
                      <button
                        type="button"
                        onClick={() => setMenuOpenId((id) => (id === n.id ? null : n.id))}
                        className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        title="More options"
                      >
                        <MoreDotIcon className="h-5 w-5" />
                      </button>
                      {menuOpenId === n.id && (
                        <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenId(null);
                              setEditing(n);
                              setShowForm(true);
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit Note
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenId(null);
                              setDeleteModal({ open: true, item: n });
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                            Delete Note
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedItems.map((n) => {
                  const categoryName = typeof n.category === "string" 
                    ? n.category 
                    : (n.category && typeof n.category === "object" && "name" in n.category) 
                      ? n.category.name 
                      : null;
                  const categoryIcon = typeof n.category === "object" && n.category && "icon" in n.category && n.category.icon
                    ? n.category.icon
                    : null;

                  return (
                    <div
                      key={n.id}
                      className="group relative flex flex-col rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 cursor-pointer border-l-4"
                      style={{
                        borderLeftColor: n.color || 'transparent',
                      }}
                      onClick={() => handleNoteClick(n)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                          {n.title}
                        </h4>
                        {n.is_pinned && (
                          <ShootingStarIcon className="h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 flex-1">
                        {n.content}
                      </p>
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          {categoryName && (
                            <span className="inline-flex items-center gap-1">
                              {categoryIcon && <span>{categoryIcon}</span>}
                              <span>{categoryName}</span>
                            </span>
                          )}
                          {categoryName && <span>•</span>}
                          <span>{formatIndonesianDate(n.created_at || "")}</span>
                        </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => togglePin(n)}
                          className={`rounded-md p-1.5 transition-all ${
                            n.is_pinned
                              ? "text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10"
                              : "text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700"
                          }`}
                          title={n.is_pinned ? "Unpin" : "Pin"}
                        >
                          <ShootingStarIcon className="h-4 w-4" />
                        </button>
                        <div className="relative" ref={menuOpenId === n.id ? menuRef : null}>
                          <button
                            type="button"
                            onClick={() => setMenuOpenId((id) => (id === n.id ? null : n.id))}
                            className="rounded-md p-1.5 text-gray-400 transition-all hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700"
                            title="More options"
                          >
                            <MoreDotIcon className="h-4 w-4" />
                          </button>
                            {menuOpenId === n.id && (
                              <div className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    setEditing(n);
                                    setShowForm(true);
                                  }}
                                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                  Edit Note
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    setDeleteModal({ open: true, item: n });
                                  }}
                                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                  <TrashBinIcon className="h-4 w-4" />
                                  Delete Note
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Pagination - Style like TransactionsList */}
        {filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-6 py-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Note Detail Modal */}
      <NoteDetailModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onEdit={handleEditFromModal}
        onDelete={handleDeleteFromModal}
        onPin={togglePin}
      />

      {/* Pin Success Modal */}
      <PinSuccessModal
        isOpen={pinSuccessModal.open}
        isPinned={pinSuccessModal.isPinned}
        onClose={() => setPinSuccessModal({ open: false, isPinned: false })}
      />

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


