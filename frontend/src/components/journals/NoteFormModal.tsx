import { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { Note } from "../../services/notesService";

type FormData = {
  title: string;
  content: string;
  category: string;
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

  const initial = useMemo<FormData>(() => {
    if (editing) {
      return {
        title: editing.title ?? "",
        content: editing.content ?? "",
        category: editing.category ?? "",
        is_pinned: !!editing.is_pinned,
      };
    }
    return { title: "", content: "", category: "", is_pinned: false };
  }, [editing]);

  const [form, setForm] = useState<FormData>(initial);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      setForm(initial);
    }
  }, [isOpen, initial]);

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
      category: form.category || null,
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
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category (optional)</label>
            <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g., Work, Ideas, Personal" />
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


