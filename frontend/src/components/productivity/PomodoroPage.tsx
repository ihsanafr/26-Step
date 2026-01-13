import { useMemo, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { CheckCircleIcon, TimeIcon } from "../../icons";
import { usePomodoro } from "../../context/PomodoroContext";
import TaskPickerModal from "./TaskPickerModal";
import { Task } from "../../services/tasksService";

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const PRESETS = [
  { id: "classic", name: "Classic (25/5/15)", focus: 25, short_break: 5, long_break: 15 },
  { id: "deep", name: "Deep Work (50/10/20)", focus: 50, short_break: 10, long_break: 20 },
  { id: "sprint", name: "Sprint (15/3/10)", focus: 15, short_break: 3, long_break: 10 },
];

export default function PomodoroPage() {
  const {
    mode,
    durations,
    isRunning,
    secondsLeft,
    activity,
    category,
    notes,
    lastMessage,
    setMode,
    setDurations,
    setMeta,
    start,
    pause,
    reset,
    stopAndSave,
  } = usePomodoro();

  const [presetId, setPresetId] = useState<string>(() => {
    const match = PRESETS.find(
      (p) => p.focus === durations.focus && p.short_break === durations.short_break && p.long_break === durations.long_break
    );
    return match?.id ?? "custom";
  });

  // Tasks integration for activity (modal)
  const [taskPickerOpen, setTaskPickerOpen] = useState(false);

  const progress = useMemo(() => {
    const totalSeconds = Math.max(1, Math.round(durations[mode] * 60));
    return (totalSeconds - secondsLeft) / totalSeconds;
  }, [secondsLeft, durations, mode]);

  const circumference = 2 * Math.PI * 88;
  const progressOffset = circumference * (1 - progress);

  const totalSeconds = Math.max(1, Math.round(durations[mode] * 60));
  const modeLabel = mode === "focus" ? "Focus" : mode === "short_break" ? "Short Break" : "Long Break";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Pomodoro</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Run focus sessions and automatically save them to your time logs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Timer */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TimeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{modeLabel}</span>
            </div>
            {lastMessage ? <span className="text-sm text-gray-600 dark:text-gray-400">{lastMessage}</span> : null}
          </div>

          <div className="mb-6 flex items-center justify-center">
            <div className="relative h-56 w-56">
              <svg className="h-56 w-56 -rotate-90 transform">
                <circle
                  cx="112"
                  cy="112"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                  className={`transition-all duration-700 ${
                    isRunning ? "text-brand-500 dark:text-brand-400" : "text-gray-400"
                  }`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-gray-900 dark:text-white">{formatMMSS(secondsLeft)}</div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {mode === "focus" ? "Focus time" : "Break time"}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => !isRunning && setMode("focus")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                mode === "focus"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              } ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={isRunning}
            >
              Focus
            </button>
            <button
              type="button"
              onClick={() => !isRunning && setMode("short_break")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                mode === "short_break"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              } ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={isRunning}
            >
              Short Break
            </button>
            <button
              type="button"
              onClick={() => !isRunning && setMode("long_break")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                mode === "long_break"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              } ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={isRunning}
            >
              Long Break
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isRunning ? (
              <Button onClick={start} startIcon={<span className="text-lg">▶</span>}>
                Start
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={pause} startIcon={<span className="text-lg">⏸</span>}>
                  Pause
                </Button>
                <button
                  type="button"
                  onClick={() => void stopAndSave()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-theme-xs transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  <span className="text-lg">⏹</span>
                  Stop & Save
                </button>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => {
                reset();
              }}
              startIcon={<span className="text-lg">↻</span>}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Right: Session details + settings */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Save Settings</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Activity from Tasks (optional)</p>
                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                      Pick a task title as your activity (opens a popup).
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setTaskPickerOpen(true)}
                    disabled={isRunning}
                    className="shrink-0"
                  >
                    Pick Task
                  </Button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Activity</label>
                <Input value={activity} onChange={(e) => setMeta({ activity: e.target.value })} placeholder="e.g., Deep work, Study" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <Input value={category} onChange={(e) => setMeta({ category: e.target.value })} placeholder="e.g., Focus, Study" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setMeta({ notes: e.target.value })}
                  rows={3}
                  placeholder="What did you work on?"
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    When a <strong>Focus</strong> timer finishes, it will automatically be saved into <strong>Reports</strong>.
                    If you stop early, we save the minutes you completed (min 1 minute).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Durations (minutes)</h2>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Template</label>
              <select
                value={presetId}
                onChange={(e) => {
                  const id = e.target.value;
                  setPresetId(id);
                  const p = PRESETS.find((x) => x.id === id);
                  if (p) setDurations({ focus: p.focus, short_break: p.short_break, long_break: p.long_break });
                }}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white/70 px-3 text-sm text-gray-900 shadow-theme-xs ring-1 ring-gray-200/60 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:ring-gray-700 dark:focus:border-brand-800"
                disabled={isRunning}
              >
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>
              {isRunning ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Pause/stop to change template.</p> : null}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Focus</label>
                <Input
                  type="number"
                  min="1"
                  value={durations.focus}
                  onChange={(e) => {
                    setPresetId("custom");
                    setDurations({ ...durations, focus: Number(e.target.value || 25) });
                  }}
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Short</label>
                <Input
                  type="number"
                  min="1"
                  value={durations.short_break}
                  onChange={(e) => {
                    setPresetId("custom");
                    setDurations({ ...durations, short_break: Number(e.target.value || 5) });
                  }}
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Long</label>
                <Input
                  type="number"
                  min="1"
                  value={durations.long_break}
                  onChange={(e) => {
                    setPresetId("custom");
                    setDurations({ ...durations, long_break: Number(e.target.value || 15) });
                  }}
                  disabled={isRunning}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPresetId("classic");
                    const p = PRESETS.find((x) => x.id === "classic")!;
                    reset();
                    setMode("focus");
                    setDurations({ focus: p.focus, short_break: p.short_break, long_break: p.long_break });
                  }}
                  disabled={isRunning}
                >
                  Reset Defaults
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskPickerModal
        isOpen={taskPickerOpen}
        onClose={() => setTaskPickerOpen(false)}
        onSelect={(t: Task) => {
          setMeta({
            activity: t.title,
            category: t.category || "Tasks",
            notes: t.target?.title ? `Target: ${t.target.title}` : notes,
          });
        }}
      />
    </div>
  );
}


