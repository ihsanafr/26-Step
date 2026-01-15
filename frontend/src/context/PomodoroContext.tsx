import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { timeTrackingsService } from "../services/timeTrackingsService";
import { formatLocalDate } from "../components/productivity/utils";

export type PomodoroMode = "focus" | "short_break" | "long_break";

export type PomodoroDurations = {
  focus: number;
  short_break: number;
  long_break: number;
};

type PomodoroState = {
  mode: PomodoroMode;
  durations: PomodoroDurations;
  isRunning: boolean;
  secondsLeft: number;
  activity: string;
  category: string;
  notes: string;
  widgetDismissed: boolean;
  lastMessage?: string | null;
};

type PomodoroContextValue = PomodoroState & {
  setMode: (m: PomodoroMode) => void;
  setDurations: (d: PomodoroDurations) => void;
  setMeta: (meta: { activity?: string; category?: string; notes?: string }) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  stopAndSave: () => Promise<void>;
  saveIfFinished: () => Promise<void>;
  dismissWidget: () => void;
  showWidget: () => void;
};

const STORAGE_KEY = "productivity.pomodoro.state.v1";

const DEFAULTS: PomodoroDurations = { focus: 25, short_break: 5, long_break: 15 };

type Persisted = {
  mode: PomodoroMode;
  durations: PomodoroDurations;
  isRunning: boolean;
  endAtMs: number | null;
  secondsLeft: number;
  activity: string;
  category: string;
  notes: string;
  widgetDismissed: boolean;
};

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [durations, setDurations] = useState<PomodoroDurations>(DEFAULTS);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(durations.focus * 60);
  const [activity, setActivity] = useState("Focus Session");
  const [category, setCategory] = useState("Focus");
  const [notes, setNotes] = useState("");
  const [widgetDismissed, setWidgetDismissed] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const endAtMsRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);

  const totalSecondsForMode = useMemo(() => Math.max(1, Math.round(durations[mode] * 60)), [durations, mode]);

  // Load persisted state once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Persisted;
      if (!parsed) return;
      setMode(parsed.mode ?? "focus");
      setDurations(parsed.durations ?? DEFAULTS);
      setActivity(parsed.activity ?? "Focus Session");
      setCategory(parsed.category ?? "Focus");
      setNotes(parsed.notes ?? "");
      setWidgetDismissed(!!parsed.widgetDismissed);
      
      const wasRunning = !!parsed.isRunning && !!parsed.endAtMs;
      
      if (wasRunning && parsed.endAtMs) {
        // Timer was running, recalculate secondsLeft based on endAtMs
        const now = Date.now();
        const remainingMs = parsed.endAtMs - now;
        const recalculatedSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
        
        if (recalculatedSeconds > 0) {
          // Timer is still valid, continue running
          setSecondsLeft(recalculatedSeconds);
          endAtMsRef.current = parsed.endAtMs; // Keep original endAtMs
          setIsRunning(true);
        } else {
          // Timer expired while away
          const totalSecondsForCurrentMode = Math.max(1, Math.round((parsed.durations ?? DEFAULTS)[parsed.mode ?? "focus"] * 60));
          setSecondsLeft(totalSecondsForCurrentMode);
          endAtMsRef.current = null;
          setIsRunning(false);
        }
      } else {
        // Timer was paused, use saved secondsLeft
        const totalSecondsForCurrentMode = Math.max(1, Math.round((parsed.durations ?? DEFAULTS)[parsed.mode ?? "focus"] * 60));
        setSecondsLeft(typeof parsed.secondsLeft === "number" && parsed.secondsLeft >= 0 && parsed.secondsLeft <= totalSecondsForCurrentMode 
          ? parsed.secondsLeft 
          : totalSecondsForCurrentMode);
        endAtMsRef.current = null;
        setIsRunning(false);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on changes
  useEffect(() => {
    const data: Persisted = {
      mode,
      durations,
      isRunning,
      endAtMs: endAtMsRef.current,
      secondsLeft,
      activity,
      category,
      notes,
      widgetDismissed,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [mode, durations, isRunning, secondsLeft, activity, category, notes, widgetDismissed]);

  // Keep secondsLeft accurate even when tab is in background
  const recompute = useCallback(() => {
    const endAt = endAtMsRef.current;
    if (!endAt) return;
    const now = Date.now();
    const next = Math.max(0, Math.ceil((endAt - now) / 1000));
    setSecondsLeft(next);
    // If timer reached 0, stop it
    if (next === 0) {
      endAtMsRef.current = null;
      setIsRunning(false);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }
    
    // Only start interval if endAtMs is set
    if (!endAtMsRef.current) {
      setIsRunning(false);
      return;
    }
    
    // Recompute immediately
    recompute();
    // Then set up interval
    tickRef.current = window.setInterval(recompute, 1000);
    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [isRunning, recompute]);

  const setMeta = useCallback((meta: { activity?: string; category?: string; notes?: string }) => {
    if (typeof meta.activity === "string") setActivity(meta.activity);
    if (typeof meta.category === "string") setCategory(meta.category);
    if (typeof meta.notes === "string") setNotes(meta.notes);
  }, []);

  // Wrapper for setMode to reset secondsLeft when mode changes (only if not running)
  const handleSetMode = useCallback((newMode: PomodoroMode) => {
    setMode(newMode);
    if (!isRunning) {
      const newTotal = Math.max(1, Math.round(durations[newMode] * 60));
      setSecondsLeft(newTotal);
    }
  }, [isRunning, durations]);

  // Wrapper for setDurations to reset secondsLeft when durations change (only if not running)
  const handleSetDurations = useCallback((newDurations: PomodoroDurations) => {
    setDurations(newDurations);
    if (!isRunning) {
      const newTotal = Math.max(1, Math.round(newDurations[mode] * 60));
      setSecondsLeft(newTotal);
    }
  }, [isRunning, mode]);

  const start = useCallback(() => {
    if (isRunning) return;
    const now = Date.now();
    const endAt = now + secondsLeft * 1000;
    endAtMsRef.current = endAt;
    // Immediately persist to ensure endAtMs is saved
    try {
      const data: Persisted = {
        mode,
        durations,
        isRunning: true,
        endAtMs: endAt,
        secondsLeft,
        activity,
        category,
        notes,
        widgetDismissed: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
    setIsRunning(true);
    setWidgetDismissed(false);
    setLastMessage(null);
  }, [isRunning, secondsLeft, mode, durations, activity, category, notes]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    // Calculate remaining seconds before clearing endAtMs
    const endAt = endAtMsRef.current;
    if (endAt) {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endAt - now) / 1000));
      setSecondsLeft(remaining);
    }
    endAtMsRef.current = null;
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    endAtMsRef.current = null;
    setIsRunning(false);
    setSecondsLeft(totalSecondsForMode);
    setLastMessage(null);
  }, [totalSecondsForMode]);

  const saveTimeEntry = useCallback(
    async (minutes: number, reason: "finished" | "stopped") => {
      if (!activity.trim()) return;
      await timeTrackingsService.create({
        activity: activity.trim(),
        category: (category.trim() || "Focus").trim(),
        duration_minutes: Math.max(1, Math.round(minutes)),
        date: formatLocalDate(new Date()),
        description: notes.trim()
          ? notes.trim()
          : reason === "finished"
            ? "Completed via Pomodoro"
            : "Saved from Pomodoro",
      });
    },
    [activity, category, notes]
  );

  const stopAndSave = useCallback(async () => {
    if (mode !== "focus") {
      // for breaks, just stop without saving
      endAtMsRef.current = null;
      setIsRunning(false);
      setSecondsLeft(totalSecondsForMode);
      return;
    }

    const total = totalSecondsForMode;
    const doneSeconds = Math.max(0, total - secondsLeft);
    const doneMinutes = doneSeconds / 60;
    endAtMsRef.current = null;
    setIsRunning(false);

    if (doneMinutes >= 1) {
      try {
        await saveTimeEntry(doneMinutes, "stopped");
        setLastMessage("Saved to time logs.");
      } catch (e) {
        console.error("Error saving stopped pomodoro:", e);
        setLastMessage("Failed to save.");
      }
    } else {
      setLastMessage("Stopped.");
    }

    setSecondsLeft(totalSecondsForMode);
  }, [mode, saveTimeEntry, secondsLeft, totalSecondsForMode]);

  const saveIfFinished = useCallback(async () => {
    if (mode !== "focus") return;
    try {
      await saveTimeEntry(durations.focus, "finished");
      setLastMessage("Focus session saved.");
    } catch (e) {
      console.error("Error saving finished pomodoro:", e);
      setLastMessage("Failed to save.");
    }
  }, [mode, saveTimeEntry, durations.focus]);

  // If timer reaches 0 while running, handle finish
  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft > 0) return;
    // Timer finished - already handled in recompute
    void saveIfFinished();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isRunning]);

  const value: PomodoroContextValue = {
    mode,
    durations,
    isRunning,
    secondsLeft,
    activity,
    category,
    notes,
    widgetDismissed,
    lastMessage,
    setMode: handleSetMode,
    setDurations: handleSetDurations,
    setMeta,
    start,
    pause,
    reset,
    stopAndSave,
    saveIfFinished,
    dismissWidget: () => setWidgetDismissed(true),
    showWidget: () => setWidgetDismissed(false),
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
  return ctx;
}


