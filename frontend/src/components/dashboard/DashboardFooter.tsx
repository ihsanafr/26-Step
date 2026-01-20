import { useState, useEffect } from "react";

export default function DashboardFooter() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    // Get timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz);
    } catch (error) {
      setTimezone("Local Time");
    }

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white/50 py-8 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left: App Info */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"></div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">26-step</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} 26-step. All rights reserved.
            </p>
          </div>

          {/* Center: Links */}
          <div className="flex items-center gap-4 text-sm">
            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Terms
            </a>
          </div>

          {/* Right: Tagline */}
          <div className="flex flex-col items-center gap-2 md:items-end">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Made with ❤️ for productivity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
