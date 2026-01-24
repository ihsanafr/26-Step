import { useState } from "react";
import InfoModal from "./InfoModal";

interface DashboardFooterProps {
  onFeedbackClick?: () => void;
}

export default function DashboardFooter({ onFeedbackClick }: DashboardFooterProps) {
  const [modalType, setModalType] = useState<"about" | "privacy" | "terms" | null>(null);

  const openModal = (type: "about" | "privacy" | "terms") => (e: React.MouseEvent) => {
    e.preventDefault();
    setModalType(type);
  };

  return (
    <>
      <footer className="mt-16 border-t border-gray-200 bg-white/50 py-8 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Left: App Info */}
            <div className="flex flex-col items-center gap-2 md:items-start">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="26-step" className="h-8 w-8" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">26-step</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} 26-step. All rights reserved.
              </p>
            </div>

            {/* Center: Links */}
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#"
                onClick={openModal("about")}
                className="text-gray-600 font-medium transition-colors hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                About
              </a>
              <a
                href="#"
                onClick={openModal("privacy")}
                className="text-gray-600 font-medium transition-colors hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Privacy
              </a>
              <a
                href="#"
                onClick={openModal("terms")}
                className="text-gray-600 font-medium transition-colors hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400"
              >
                Terms
              </a>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onFeedbackClick?.();
                }}
                className="text-gray-600 font-medium transition-colors hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
              >
                Feedback
              </button>
            </div>

            {/* Right: Tagline */}
            <div className="flex flex-col items-center gap-2 md:items-end">
              <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                Made with ❤️ for productivity
              </p>
            </div>
          </div>
        </div>
      </footer>

      <InfoModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || "about"}
      />
    </>
  );
}
