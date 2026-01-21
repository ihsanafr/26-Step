import { useEffect } from "react";
import { Note } from "../../services/notesService";
import { formatIndonesianDate } from "../../utils/date";
import { CloseIcon, ShootingStarIcon, PencilIcon, TrashBinIcon, MoreDotIcon } from "../../icons";
import Button from "../ui/button/Button";

interface NoteDetailSidebarProps {
  note: Note | null;
  isOpen: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onPin: (note: Note) => void;
}

export default function NoteDetailSidebar({
  note,
  isOpen,
  isFullscreen,
  onClose,
  onToggleFullscreen,
  onEdit,
  onDelete,
  onPin,
}: NoteDetailSidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Add blur class to sidebar, header, and content area with a small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        const header = document.querySelector('[data-header]');
        const contentArea = document.querySelector('[data-content-area]');
        
        const addBlur = (element: Element | null) => {
          if (element) {
            element.classList.add('backdrop-blur-md');
            (element as HTMLElement).style.backdropFilter = 'blur(12px)';
            (element as HTMLElement).style.WebkitBackdropFilter = 'blur(12px)';
            (element as HTMLElement).style.transition = 'backdrop-filter 0.4s cubic-bezier(0.4, 0, 0.2, 1), -webkit-backdrop-filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          }
        };
        
        addBlur(sidebar);
        addBlur(header);
        addBlur(contentArea);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    } else {
      document.body.style.overflow = "";
      // Remove blur class from sidebar, header, and content area
      const sidebar = document.querySelector('[data-sidebar]');
      const header = document.querySelector('[data-header]');
      const contentArea = document.querySelector('[data-content-area]');
      
      const removeBlur = (element: Element | null) => {
        if (element) {
          element.classList.remove('backdrop-blur-md');
          (element as HTMLElement).style.backdropFilter = '';
          (element as HTMLElement).style.WebkitBackdropFilter = '';
          (element as HTMLElement).style.transition = '';
        }
      };
      
      removeBlur(sidebar);
      removeBlur(header);
      removeBlur(contentArea);
    }
  }, [isOpen]);

  // Don't render if no note
  if (!note) return null;

  const categoryName = typeof note.category === "string" 
    ? note.category 
    : (note.category && typeof note.category === "object" && "name" in note.category) 
      ? note.category.name 
      : null;
  const categoryIcon = typeof note.category === "object" && note.category && "icon" in note.category && note.category.icon
    ? note.category.icon
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full bg-white shadow-2xl dark:bg-gray-800 ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        } ${isFullscreen ? "w-full" : "w-full sm:w-[600px] lg:w-[700px]"}`}
        style={{
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: isOpen ? 'transform, opacity' : 'auto',
        }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Note Details</h2>
              {note.is_pinned && (
                <ShootingStarIcon className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFullscreen}
                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                title="Close"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Title */}
            <div className="mb-6">
              <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{note.title}</h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {categoryName && (
                  <div className="flex items-center gap-2">
                    {categoryIcon && <span className="text-lg">{categoryIcon}</span>}
                    <span className="font-medium">{categoryName}</span>
                  </div>
                )}
                <span>•</span>
                <span>{formatIndonesianDate(note.created_at || "")}</span>
                {note.updated_at && note.updated_at !== note.created_at && (
                  <>
                    <span>•</span>
                    <span>Updated: {formatIndonesianDate(note.updated_at)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Color indicator */}
            {note.color && (
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</span>
                  <div
                    className="h-6 w-6 rounded-full ring-2 ring-gray-300 dark:ring-gray-600"
                    style={{ backgroundColor: note.color }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {note.content || <span className="text-gray-400 dark:text-gray-500 italic">No content</span>}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => onPin(note)}
                startIcon={<ShootingStarIcon className="h-4 w-4" />}
                className={note.is_pinned ? "text-orange-600 dark:text-orange-400" : ""}
              >
                {note.is_pinned ? "Unpin" : "Pin"}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => onEdit(note)}
                  startIcon={<PencilIcon className="h-4 w-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(note)}
                  startIcon={<TrashBinIcon className="h-4 w-4" />}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
