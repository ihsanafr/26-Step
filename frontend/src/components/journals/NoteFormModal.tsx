import { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { Note } from "../../services/notesService";
import journalNoteCategoriesService, { JournalNoteCategory } from "../../services/journalNoteCategoriesService";
import { JOURNAL_COLORS } from "../../utils/journal";

type FormData = {
  title: string;
  content: string;
  category_id: number | null;
  color: string;
  is_pinned: boolean;
};

export default function NoteFormModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
  editing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
  editing?: Note | null;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [categories, setCategories] = useState<JournalNoteCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const initial = useMemo<FormData>(() => {
    if (editing) {
      return {
        title: editing.title ?? "",
        content: editing.content ?? "",
        category_id: editing.category_id ?? null,
        color: editing.color || JOURNAL_COLORS[0].value,
        is_pinned: !!editing.is_pinned,
      };
    }
    return {
      title: "",
      content: "",
      category_id: null,
      color: JOURNAL_COLORS[0].value,
      is_pinned: false,
    };
  }, [editing]);

  const [form, setForm] = useState<FormData>(initial);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      setForm(initial);
      loadCategories();
    }
  }, [isOpen, initial]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await journalNoteCategoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading && !isClosing) handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isLoading, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setIsMounted(false);
    setTimeout(() => onClose(), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title: form.title,
      content: form.content,
      category_id: form.category_id || null,
      color: form.color || null,
      is_pinned: form.is_pinned,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isMounted && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading && !isClosing) handleClose();
      }}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-transform duration-200 dark:border-gray-700 dark:bg-gray-800 ${
          isMounted && !isClosing ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
              {editing ? "Edit Note" : "New Note"}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Quick capture for ideas, checklists, or snippets.</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <Input 
              value={form.title} 
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} 
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            {loadingCategories ? (
              <div className="h-11 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 animate-pulse" />
            ) : (
              <select
                value={form.category_id || ""}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value ? parseInt(e.target.value) : null }))}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="">— No Category —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Note Color *</label>
            <div className="flex flex-wrap gap-3">
              {JOURNAL_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                  className={`relative h-12 w-12 rounded-xl border-2 transition-all ${
                    form.color === c.value
                      ? "border-gray-900 dark:border-white scale-110 ring-2 ring-offset-2 ring-brand-500"
                      : "border-gray-300 dark:border-gray-600 hover:scale-105 hover:border-gray-400"
                  } cursor-pointer`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                  {form.color === c.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Choose a color for your note.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={8}
              placeholder="Write your note..."
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.is_pinned}
              onChange={(e) => setForm((f) => ({ ...f, is_pinned: e.target.checked }))}
            />
            Pin this note
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
