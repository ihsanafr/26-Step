import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import DatePicker from "../form/input/DatePicker";
import { Journal } from "../../services/journalsService";
import { formatLocalDate } from "../productivity/utils";
import RichTextEditor from "../common/RichTextEditor";
import { stripHtml } from "../../utils/text";
import { getMoodEmoji, getWeatherEmoji, JOURNAL_COLORS } from "../../utils/journal";
import journalNoteCategoriesService, { JournalNoteCategory } from "../../services/journalNoteCategoriesService";

type FormData = {
  title: string;
  content: string;
  date: string;
  mood: string;
  weather: string;
  location: string;
  is_private: boolean;
  color: string;
  cover_image: string;
  category_id: number | null;
  newCategoryName: string;
};

const MOODS = ["Happy", "Calm", "Grateful", "Excited", "Neutral", "Stressed", "Sad", "Angry"];
const WEATHER = ["Sunny", "Cloudy", "Rainy", "Windy", "Stormy", "Snowy"];

export default function JournalFormModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
  editing,
  mode = "edit",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
  editing?: Journal | null;
  mode?: "edit" | "view";
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [categories, setCategories] = useState<JournalNoteCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const initial = useMemo<FormData>(() => {
    if (editing) {
      return {
        title: editing.title ?? "",
        content: editing.content ?? "",
        date: (editing.date || "").slice(0, 10) || formatLocalDate(new Date()),
        mood: editing.mood ?? "",
        weather: editing.weather ?? "",
        location: editing.location ?? "",
        is_private: !!editing.is_private,
        color: editing.color || JOURNAL_COLORS[0].value,
        cover_image: editing.cover_image || "",
        category_id: editing.category_id ?? null,
        newCategoryName: "",
      };
    }
    return {
      title: "",
      content: "",
      date: formatLocalDate(new Date()),
      mood: "",
      weather: "",
      location: "",
      is_private: false,
      color: JOURNAL_COLORS[0].value,
      cover_image: "",
      category_id: null,
      newCategoryName: "",
    };
  }, [editing]);

  const [form, setForm] = useState<FormData>(initial);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      // Reset form when modal opens, ensuring content is loaded
      if (editing) {
        setForm({
          title: editing.title ?? "",
          content: editing.content ?? "",
          date: (editing.date || "").slice(0, 10) || formatLocalDate(new Date()),
          mood: editing.mood ?? "",
          weather: editing.weather ?? "",
          location: editing.location ?? "",
          is_private: !!editing.is_private,
          color: editing.color || JOURNAL_COLORS[0].value,
          cover_image: editing.cover_image || "",
          category_id: editing.category_id ?? null,
          newCategoryName: "",
        });
      } else {
        setForm(initial);
      }
      loadCategories();
    }
  }, [isOpen, editing]);

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

  const handleCreateCategory = async () => {
    if (!form.newCategoryName.trim()) return;
    try {
      setCreatingCategory(true);
      const newCategory = await journalNoteCategoriesService.create({
        name: form.newCategoryName.trim(),
        color: form.color,
      });
      setCategories([...categories, newCategory]);
      setForm((f) => ({
        ...f,
        category_id: newCategory.id,
        newCategoryName: "",
      }));
      setShowNewCategory(false);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setCreatingCategory(false);
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

  const handleCoverUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("Failed to read image"));
        r.readAsDataURL(file);
      });
      setForm((f) => ({ ...f, cover_image: dataUrl }));
    } catch (err) {
      console.error("Error reading image:", err);
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveCover = () => {
    setForm((f) => ({ ...f, cover_image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;
    await onSave({
      title: form.title,
      content: form.content,
      date: form.date,
      mood: form.mood || null,
      weather: form.weather || null,
      location: form.location || null,
      is_private: form.is_private,
      color: form.color || null,
      cover_image: form.cover_image || null,
      category_id: form.category_id || null,
    });
  };

  if (!isOpen) return null;

  const readOnly = mode === "view";

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
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-transform duration-200 dark:border-gray-700 dark:bg-gray-800 ${
          isMounted && !isClosing ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
              {readOnly ? "Journal Entry" : editing ? "Edit Journal" : "New Journal"}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Capture your thoughts with mood and context.
            </p>
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
              disabled={readOnly}
              placeholder="Enter journal title"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <DatePicker value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} disabled={readOnly} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Mood</label>
                <select
                  value={form.mood}
                  onChange={(e) => setForm((f) => ({ ...f, mood: e.target.value }))}
                  disabled={readOnly}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">—</option>
                  {MOODS.map((m) => (
                    <option key={m} value={m}>
                      {getMoodEmoji(m)} {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Weather</label>
                <select
                  value={form.weather}
                  onChange={(e) => setForm((f) => ({ ...f, weather: e.target.value }))}
                  disabled={readOnly}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">—</option>
                  {WEATHER.map((w) => (
                    <option key={w} value={w}>
                      {getWeatherEmoji(w)} {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Location (optional)</label>
              <Input 
                value={form.location} 
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} 
                disabled={readOnly}
                placeholder="e.g., Home, Office, Park"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              {loadingCategories ? (
                <div className="h-11 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 animate-pulse" />
              ) : (
                <div className="space-y-2">
                  <select
                    value={form.category_id || ""}
                    onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value ? parseInt(e.target.value) : null }))}
                    disabled={readOnly}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <option value="">— No Category —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                      </option>
                    ))}
                  </select>
                  {!readOnly && !showNewCategory ? (
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      + Create new category
                    </button>
                  ) : !readOnly && showNewCategory ? (
                    <div className="flex gap-2">
                      <Input
                        value={form.newCategoryName}
                        onChange={(e) => setForm((f) => ({ ...f, newCategoryName: e.target.value }))}
                        placeholder="Category name"
                        className="flex-1"
                        disabled={readOnly}
                      />
                      <Button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={creatingCategory || !form.newCategoryName.trim()}
                        size="sm"
                      >
                        {creatingCategory ? "..." : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowNewCategory(false);
                          setForm((f) => ({ ...f, newCategoryName: "" }));
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Color and Cover */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Journal Color *</label>
              <div className="flex flex-wrap gap-3">
                {JOURNAL_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => !readOnly && setForm((f) => ({ ...f, color: c.value }))}
                    disabled={readOnly}
                    className={`relative h-12 w-12 rounded-xl border-2 transition-all ${
                      form.color === c.value
                        ? "border-gray-900 dark:border-white scale-110 ring-2 ring-offset-2 ring-brand-500"
                        : "border-gray-300 dark:border-gray-600 hover:scale-105 hover:border-gray-400"
                    } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
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
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Choose a color for your journal. If you upload a cover image, the color will be used as fallback.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image (optional)</label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
                disabled={readOnly}
              />
              {form.cover_image ? (
                <div className="relative">
                  <img src={form.cover_image} alt="Cover" className="h-40 w-full rounded-xl object-cover" />
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="absolute right-2 top-2 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                    >
                      Remove Cover
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => !readOnly && coverInputRef.current?.click()}
                  disabled={readOnly}
                  className="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600 transition hover:border-brand-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-brand-500"
                >
                  {readOnly ? "No cover image" : "Click to upload cover image"}
                </button>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Upload a cover image for your journal. If not provided, the selected color will be used.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            {readOnly ? (
              <div className="rounded-xl border border-gray-300 bg-transparent p-4 shadow-theme-xs dark:border-gray-700">
                <div
                  className="tiptap text-gray-900 dark:text-white/90"
                  dangerouslySetInnerHTML={{ __html: form.content || "<p></p>" }}
                />
              </div>
            ) : (
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                placeholder="Write your thoughts..."
              />
            )}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{stripHtml(form.content).split(/\s+/).filter(Boolean).length} words</span>
              <span>{stripHtml(form.content).length} chars</span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.is_private}
              onChange={(e) => setForm((f) => ({ ...f, is_private: e.target.checked }))}
              disabled={readOnly}
            />
            Private entry
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Close
            </Button>
            {!readOnly ? (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}


