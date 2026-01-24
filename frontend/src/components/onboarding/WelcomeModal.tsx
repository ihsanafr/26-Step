import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import Button from "../ui/button/Button";

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    // Delay untuk smooth animation
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-lg mx-4 rounded-2xl border p-6 shadow-2xl transition-all duration-200 ${isDark
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
          } ${isVisible ? "scale-100" : "scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 rounded-lg p-2 transition-all ${isDark
              ? "text-gray-400 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 shadow-lg shadow-indigo-500/20">
              <span className="text-4xl animate-bounce">👋</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"
              }`}>
              Selamat Datang di 26-step!
            </h2>
          </div>

          <div className={`mb-8 max-w-[400px] space-y-4 text-sm sm:text-base ${isDark ? "text-gray-300" : "text-gray-600"
            }`}>
            <p className="leading-relaxed">
              Aplikasi ini membantu Anda mengelola kehidupan sehari-hari dengan lebih efisien melalui berbagai modul yang tersedia.
            </p>

            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3 rounded-xl border border-transparent bg-gray-50/50 p-3 dark:bg-gray-700/30">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <span className="text-xs font-bold">1</span>
                </div>
                <p className="text-xs sm:text-sm">
                  <strong className={isDark ? "text-white" : "text-gray-900"}>6 Modul Utama:</strong> Tasks, Finance, Productivity, Habits, Storage, & Journal.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-transparent bg-gray-50/50 p-3 dark:bg-gray-700/30">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <span className="text-xs font-bold">2</span>
                </div>
                <p className="text-xs sm:text-sm">
                  <strong className={isDark ? "text-white" : "text-gray-900"}>Activity Calendar:</strong> Rekap semua aktivitas harian dalam satu tampilan kalender terpusat.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-transparent bg-gray-50/50 p-3 dark:bg-gray-700/30">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                  <span className="text-xs font-bold">3</span>
                </div>
                <p className="text-xs sm:text-sm">
                  <strong className={isDark ? "text-white" : "text-gray-900"}>Profile & Settings:</strong> Atur preferensi akun, foto profil, dan tema (Gelap/Terang).
                </p>
              </div>
            </div>

            <p className="pt-2 text-xs font-medium italic text-gray-400">
              Mulai jelajahi modul yang tersedia dan buat hidup Anda lebih terorganisir!
            </p>
          </div>

          {/* Action Button */}
          <div className="flex w-full justify-center">
            <Button
              onClick={handleClose}
              variant="primary"
              className="w-full max-w-[280px] py-3 text-base shadow-xl shadow-blue-500/25"
            >
              Mulai Menggunakan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
