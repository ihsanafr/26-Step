import { Link } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePomodoro } from "../../context/PomodoroContext";
import { TimeIcon } from "../../icons";

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type PositionCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function PomodoroMiniWidget() {
  const { isRunning, secondsLeft, mode, activity, widgetDismissed, dismissWidget, showWidget, pause, stopAndSave } =
    usePomodoro();

  if (!isRunning) return null;

  const label =
    mode === "focus" ? "Focus" : mode === "short_break" ? "Short Break" : "Long Break";

  // draggable position (persisted)
  const STORAGE_KEY = "productivity.pomodoro.widgetPos.v1";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>(() => ({ x: 20, y: 20 }));
  const [menuOpen, setMenuOpen] = useState(false);
  const dragRef = useRef<{ dx: number; dy: number; dragging: boolean }>({ dx: 0, dy: 0, dragging: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { x: number; y: number };
        if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
          setPos({ x: parsed.x, y: parsed.y });
          return;
        }
      }
    } catch {
      // ignore
    }

    // default to bottom-left-ish on first load
    const fallbackY = Math.max(20, window.innerHeight - 160);
    setPos({ x: 20, y: fallbackY });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    } catch {
      // ignore
    }
  }, [pos]);

  const clamp = (x: number, y: number) => {
    const el = containerRef.current;
    const w = el?.offsetWidth ?? 320;
    const h = el?.offsetHeight ?? 120;
    const maxX = Math.max(8, window.innerWidth - w - 8);
    const maxY = Math.max(8, window.innerHeight - h - 8);
    return { x: Math.min(Math.max(8, x), maxX), y: Math.min(Math.max(8, y), maxY) };
  };

  const snapToCorner = (corner: PositionCorner) => {
    const el = containerRef.current;
    const w = el?.offsetWidth ?? 320;
    const h = el?.offsetHeight ?? 120;
    const padding = 16;

    let newPos: { x: number; y: number };
    switch (corner) {
      case "top-left":
        newPos = { x: padding, y: padding };
        break;
      case "top-right":
        newPos = { x: window.innerWidth - w - padding, y: padding };
        break;
      case "bottom-left":
        newPos = { x: padding, y: window.innerHeight - h - padding };
        break;
      case "bottom-right":
        newPos = { x: window.innerWidth - w - padding, y: window.innerHeight - h - padding };
        break;
    }
    setPos(clamp(newPos.x, newPos.y));
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent | PointerEvent) => {
      const el = menuRef.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && !el.contains(target)) {
        setMenuOpen(false);
      }
    };
    // Use both mousedown and pointerdown for better compatibility
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("pointerdown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [menuOpen]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = containerRef.current;
    if (!el) return;
    dragRef.current.dragging = true;
    dragRef.current.dx = e.clientX - pos.x;
    dragRef.current.dy = e.clientY - pos.y;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const next = clamp(e.clientX - dragRef.current.dx, e.clientY - dragRef.current.dy);
    setPos(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    dragRef.current.dragging = false;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const activityLabel = useMemo(() => (activity || "").trim() || "Focus Session", [activity]);

  // If dismissed, show a small chip to restore
  if (widgetDismissed) {
    return (
      <button
        type="button"
        onClick={showWidget}
        style={{ left: pos.x, top: pos.y }}
        className="fixed z-[100001] inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-2 text-sm font-semibold text-gray-900 shadow-lg backdrop-blur-md transition hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/80 dark:text-white"
        title="Show Pomodoro"
      >
        <TimeIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <span className="tabular-nums">{formatMMSS(secondsLeft)}</span>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-[100001] w-[320px] rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="min-w-0 flex-1 cursor-move select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          title="Drag to move"
        >
          <div className="flex items-center gap-2">
            <TimeIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {label} • <span className="font-bold">{formatMMSS(secondsLeft)}</span>
            </p>
          </div>
          <p className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
            {activityLabel}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Running in background. You can navigate freely.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/productivity/pomodoro"
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            Open
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label="Position Menu"
              title="Position Menu"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-[100002]"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="p-2">
                  <div className="mb-1 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Posisi
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      snapToCorner("top-left");
                    }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center justify-between"
                  >
                    <span>Kiri Atas</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      snapToCorner("top-right");
                    }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center justify-between"
                  >
                    <span>Kanan Atas</span>
                    <svg className="h-4 w-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      snapToCorner("bottom-left");
                    }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center justify-between"
                  >
                    <span>Kiri Bawah</span>
                    <svg className="h-4 w-4 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      snapToCorner("bottom-right");
                    }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center justify-between"
                  >
                    <span>Kanan Bawah</span>
                    <svg className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismissWidget();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Close"
            title="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={pause}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={() => void stopAndSave()}
          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Stop
        </button>
      </div>
    </div>
  );
}


