import { useState, useEffect } from "react";

export default function LocalTimeDisplay() {
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
    <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-white/30 bg-white/10 px-3 py-2 sm:px-4 sm:py-3 shadow-sm backdrop-blur-sm w-full sm:w-auto">
      <svg
        className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-base sm:text-lg font-bold text-white tabular-nums truncate">
          {formatTime(currentTime)}
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-blue-100">
          <span className="truncate">{formatDate(currentTime)}</span>
          {timezone && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="font-medium truncate hidden sm:inline">{timezone}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
