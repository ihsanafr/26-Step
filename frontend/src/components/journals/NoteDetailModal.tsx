import { useEffect, useState } from "react";
import { Note } from "../../services/notesService";
import { formatIndonesianDate } from "../../utils/date";
import { ShootingStarIcon, PencilIcon, TrashBinIcon } from "../../icons";
import Button from "../ui/button/Button";

interface NoteDetailModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onPin: (note: Note) => void;
}

export default function NoteDetailModal({
  note,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onPin,
}: NoteDetailModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isClosing) handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setIsMounted(false);
    setTimeout(() => onClose(), 200);
  };

  if (!isOpen || !note) return null;

  const categoryName = typeof note.category === "string" 
    ? note.category 
    : (note.category && typeof note.category === "object" && "name" in note.category) 
      ? note.category.name 
      : null;
  const categoryIcon = typeof note.category === "object" && note.category && "icon" in note.category && note.category.icon
    ? note.category.icon
    : null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isMounted && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isClosing) handleClose();
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
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">Note Details</h2>
              {note.is_pinned && (
                <ShootingStarIcon className="h-5 w-5 shrink-0 text-orange-500 dark:text-orange-400" />
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">View and manage your note.</p>
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

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              {note.title}
            </div>
          </div>

          {/* Category */}
          {categoryName && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-900">
                {categoryIcon && <span className="text-lg">{categoryIcon}</span>}
                <span className="text-gray-900 dark:text-white">{categoryName}</span>
              </div>
            </div>
          )}

          {/* Color */}
          {note.color && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Note Color</label>
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: note.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Note color indicator</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <div className="min-h-[200px] rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 whitespace-pre-wrap">
              {note.content || <span className="text-gray-400 dark:text-gray-500 italic">No content</span>}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {formatIndonesianDate(note.created_at || "")}</span>
            {note.updated_at && note.updated_at !== note.created_at && (
              <span>• Updated: {formatIndonesianDate(note.updated_at)}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => onPin(note)}
              startIcon={<ShootingStarIcon className="h-4 w-4" />}
              className={note.is_pinned ? "text-orange-600 dark:text-orange-400" : ""}
            >
              {note.is_pinned ? "Unpin" : "Pin"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleClose();
                setTimeout(() => onEdit(note), 200);
              }}
              startIcon={<PencilIcon className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleClose();
                setTimeout(() => onDelete(note), 200);
              }}
              startIcon={<TrashBinIcon className="h-4 w-4" />}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-300 dark:border-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
