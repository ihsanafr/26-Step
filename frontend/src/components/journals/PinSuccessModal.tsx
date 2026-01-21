import { useEffect } from "react";
import { ShootingStarIcon } from "../../icons";

interface PinSuccessModalProps {
  isOpen: boolean;
  isPinned: boolean;
  onClose: () => void;
}

export default function PinSuccessModal({ isOpen, isPinned, onClose }: PinSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto close after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-[100001] pointer-events-none">
      <div className="pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="rounded-xl bg-white px-4 py-3 shadow-lg dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/20 shrink-0">
              <ShootingStarIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {isPinned ? "Note pinned successfully!" : "Note unpinned successfully!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
