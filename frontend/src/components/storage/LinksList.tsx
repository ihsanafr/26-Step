import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/button/Button";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { Skeleton } from "../common/Skeleton";
import { linksService, Link } from "../../services/linksService";
import {
  AngleLeftIcon,
  AngleRightIcon,
  CopyIcon,
  GridIcon,
  ListIcon,
  MoreDotIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashBinIcon,
} from "../../icons";
import { formatIndonesianDate } from "../../utils/date";

// Simple Link Icon Component
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

// Simple Pin Icon Component
function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

export default function LinksList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Link[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState<"all" | "favorite" | "unfavorite">("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Link | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formFavorite, setFormFavorite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Link | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closingForm, setClosingForm] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const pageSize = 8;

  const load = async () => {
    try {
      setLoading(true);
      const data = await linksService.getAll();
      setItems(data);
    } catch (e) {
      console.error("Error loading links:", e);
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
    const set = new Set(items.map((l) => l.category).filter(Boolean) as string[]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((l) => {
      if (category && (l.category || "") !== category) return false;
      if (favoriteFilter === "favorite" && !l.is_favorite) return false;
      if (favoriteFilter === "unfavorite" && l.is_favorite) return false;
      if (!q) return true;
      return (
        (l.title || "").toLowerCase().includes(q) ||
        (l.url || "").toLowerCase().includes(q) ||
        (l.description || "").toLowerCase().includes(q) ||
        (l.category || "").toLowerCase().includes(q)
      );
    });
  }, [items, search, category, favoriteFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, favoriteFilter, items]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const handleNew = () => {
    setEditing(null);
    setFormTitle("");
    setFormUrl("");
    setFormDescription("");
    setFormCategory("");
    setFormFavorite(false);
    setClosingForm(false);
    setShowForm(true);
  };

  const handleEdit = (link: Link) => {
    setEditing(link);
    setFormTitle(link.title);
    setFormUrl(link.url);
    setFormDescription(link.description || "");
    setFormCategory(link.category || "");
    setFormFavorite(link.is_favorite);
    setClosingForm(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setClosingForm(true);
    setTimeout(() => {
      setShowForm(false);
      setEditing(null);
      setError(null);
      setClosingForm(false);
    }, 200);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formUrl.trim()) {
      setError("Title and URL are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const data = {
        title: formTitle.trim(),
        url: formUrl.trim(),
        description: formDescription.trim() || null,
        category: formCategory.trim() || null,
        is_favorite: formFavorite,
      };

      if (editing) {
        await linksService.update(editing.id, data);
      } else {
        await linksService.create(data);
      }
      closeForm();
      await load();
    } catch (error: any) {
      console.error("Error saving link:", error);
      setError(error.response?.data?.message || "Failed to save link");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFavorite = async (link: Link) => {
    try {
      const nextValue = !link.is_favorite;
      setItems((prev) =>
        prev.map((item) => (item.id === link.id ? { ...item, is_favorite: nextValue } : item))
      );
      await linksService.update(link.id, { is_favorite: nextValue });
    } catch (error) {
      setItems((prev) =>
        prev.map((item) => (item.id === link.id ? { ...item, is_favorite: link.is_favorite } : item))
      );
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCopyLink = async (link: Link) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedId(link.id);
      setTimeout(() => {
        setCopiedId((current) => (current === link.id ? null : current));
      }, 1500);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleting(true);
      await linksService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      await load();
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        {viewMode === "list" ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-full" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Links</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Save and organize important links
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                viewMode === "grid"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <GridIcon className="h-4 w-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                viewMode === "list"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <ListIcon className="h-4 w-4" />
              List
            </button>
          </div>
          <Button onClick={handleNew}>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative grow">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={favoriteFilter}
          onChange={(e) => setFavoriteFilter(e.target.value as "all" | "favorite" | "unfavorite")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Links</option>
          <option value="favorite">Favorites Only</option>
          <option value="unfavorite">Not Favorites</option>
        </select>
      </div>

      {/* Links */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-800">
          <LinkIcon className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
          <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {items.length === 0 ? "No links yet" : "No links found"}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {items.length === 0
              ? "Add your first link to get started"
              : "Try adjusting your search or filters"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((link) => {
            let hostname = "";
            try {
              hostname = new URL(link.url).hostname.replace("www.", "");
            } catch {
              hostname = link.url;
            }
            return (
              <div
                key={link.id}
                className={`group relative rounded-xl border p-3 shadow-theme-sm transition-all hover:shadow-theme-md ${
                  link.is_favorite
                    ? "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/20"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <div className="mb-1.5 flex items-start justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <LinkIcon className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === link.id ? null : link.id)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <MoreDotIcon className="h-5 w-5" />
                    </button>
                    {menuOpenId === link.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Open Link
                        </a>
                        <button
                          onClick={() => {
                            handleToggleFavorite(link);
                            setMenuOpenId(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <PinIcon className="h-4 w-4" />
                          {link.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(link);
                            setMenuOpenId(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteModal({ open: true, item: link });
                            setMenuOpenId(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                        >
                          <TrashBinIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-1.5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {link.title}
                  </h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {hostname}
                  </a>
                </div>
                {link.description && (
                  <p className="mb-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {link.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {link.category ? (
                      <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {link.category}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">-</span>
                    )}
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {formatIndonesianDate(link.created_at)}
                    </p>
                  </div>
                  {link.is_favorite && (
                    <PinIcon className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(link)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                  >
                    <CopyIcon className="h-4 w-4" />
                    {copiedId === link.id ? "Copied" : "Copy Link"}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Open Link
                  </a>
                  <button
                    onClick={() => handleToggleFavorite(link)}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                      link.is_favorite
                        ? "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-300"
                        : "border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                    }`}
                  >
                    <PinIcon className="h-4 w-4" />
                    {link.is_favorite ? "Favorite" : "Add Favorite"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">LINK</th>
                  <th className="px-4 py-3 text-left font-semibold">CATEGORY</th>
                  <th className="px-4 py-3 text-left font-semibold">CREATED</th>
                  <th className="px-4 py-3 text-right font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.map((link) => {
                  let hostname = "";
                  try {
                    hostname = new URL(link.url).hostname.replace("www.", "");
                  } catch {
                    hostname = link.url;
                  }
                  return (
                    <tr key={link.id} className="border-b border-gray-100 last:border-none dark:border-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                            <LinkIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white truncate">
                              {link.title}
                            </div>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {hostname}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {link.category ? (
                          <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                            {link.category}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatIndonesianDate(link.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopyLink(link)}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                          >
                            <CopyIcon className="h-4 w-4" />
                            {copiedId === link.id ? "Copied" : "Copy"}
                          </button>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                          >
                            <LinkIcon className="h-4 w-4" />
                            Open
                          </a>
                          <div className="relative">
                            <button
                              onClick={() => setMenuOpenId(menuOpenId === link.id ? null : link.id)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            >
                              <MoreDotIcon className="h-5 w-5" />
                            </button>
                            {menuOpenId === link.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                              >
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  <LinkIcon className="h-4 w-4" />
                                  Open Link
                                </a>
                                <button
                                  onClick={() => {
                                    handleToggleFavorite(link);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  <PinIcon className="h-4 w-4" />
                                  {link.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                                </button>
                                <button
                                  onClick={() => {
                                    handleEdit(link);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteModal({ open: true, item: link });
                                    setMenuOpenId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                                >
                                  <TrashBinIcon className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length > pageSize && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <div>
                Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                >
                  <AngleLeftIcon className="h-4 w-4" />
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                >
                  Next
                  <AngleRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 animate-in fade-in ${
            closingForm ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeForm}
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl transition-all duration-200 animate-in zoom-in-95 dark:border-gray-700 dark:bg-gray-800 ${
              closingForm ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {editing ? "Edit Link" : "Add Link"}
            </h2>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Google"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Optional description"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g., Work, Personal"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={formFavorite}
                  onChange={(e) => setFormFavorite(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="favorite" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as favorite
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saving || !formTitle.trim() || !formUrl.trim()}
                className="grow"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={closeForm} variant="outline" className="grow">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Link"
        message={`Are you sure you want to delete "${deleteModal.item?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
