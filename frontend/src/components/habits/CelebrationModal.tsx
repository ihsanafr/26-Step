import { useEffect, useState } from "react";
import { Habit } from "../../services/habitsService";

interface CelebrationModalProps {
  open: boolean;
  habit: Habit | null;
  onClose: () => void;
}

export default function CelebrationModal({ open, habit, onClose }: CelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setShowConfetti(true);
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
          setShowConfetti(false);
        }, 300);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShowConfetti(false);
    }
  }, [open, onClose]);

  if (!open && !isVisible) return null;

  // Generate confetti particles
  const confettiColors = ["#fbbf24", "#f59e0b", "#ef4444", "#ec4899", "#a855f7", "#6366f1", "#3b82f6", "#10b981", "#14b8a6"];
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: particle.color,
                left: `${particle.left}%`,
                top: "-10px",
                animation: `confettiFall ${particle.duration}s ${particle.delay}s ease-in forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md mx-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Celebration Content */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-5xl shadow-lg animate-bounce">
                🎉
              </div>
              <div className="absolute -inset-2 rounded-full bg-yellow-400/20 animate-ping" />
            </div>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Great Job!</h3>
          <p className="mb-1 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {habit?.icon} {habit?.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Habit completed successfully!
          </p>

          {habit && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50 to-red-50 p-4 dark:border-gray-700 dark:from-orange-900/20 dark:to-red-900/20">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Current Streak</div>
                  <div className="flex items-center gap-1 text-2xl font-bold text-orange-600 dark:text-orange-400">
                    <span>🔥</span>
                    <span>{habit.current_streak || 0}</span>
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-300 dark:bg-gray-600" />
                <div className="text-center">
                  <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Longest Streak</div>
                  <div className="flex items-center gap-1 text-2xl font-bold text-orange-600 dark:text-orange-400">
                    <span>🏆</span>
                    <span>{habit.longest_streak || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-orange-600 hover:to-red-600 hover:shadow-lg"
          >
            Keep Going! 💪
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
