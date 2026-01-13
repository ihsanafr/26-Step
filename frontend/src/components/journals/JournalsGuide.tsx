import PageMeta from "../common/PageMeta";
import { GridIcon, FileIcon, PlusIcon, CalenderIcon, ListIcon, InfoIcon, LockIcon, ShootingStarIcon } from "../../icons";

export default function JournalsGuide() {
  return (
    <>
      <PageMeta title="Journals & Notes Guide - Lifesync" description="How to use the Journals & Notes module" />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">User Guide: Journals & Notes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A short, practical flow to capture thoughts, reflect daily, and keep quick notes organized.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <InfoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recommended Flow</h2>
          </div>
          <ol className="ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              Use <strong className="text-gray-900 dark:text-white">Notes</strong> for quick capture during the day (ideas, reminders).
            </li>
            <li>
              Write a <strong className="text-gray-900 dark:text-white">Journal Entry</strong> for deeper reflection (mood, context).
            </li>
            <li>
              Use the <strong className="text-gray-900 dark:text-white">Calendar</strong> to review days you wrote and find entries quickly.
            </li>
          </ol>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <GridIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Dashboard</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>See entries today / this week and pinned notes.</li>
            <li>Quickly jump to Recent Entries or manage Notes.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
              <FileIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Journal Entries</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>
              Create a new entry from <strong className="text-gray-900 dark:text-white">Journal Entries</strong> using{" "}
              <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                <PlusIcon className="h-4 w-4" /> New Entry
              </span>{" "}
              (opens a full page editor).
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Add <strong className="text-gray-900 dark:text-white">Mood</strong> to track your emotional state.
              </li>
              <li>
                Use <strong className="text-gray-900 dark:text-white">Private entry</strong> (<LockIcon className="inline h-4 w-4" />) for sensitive notes.
              </li>
              <li>
                Use search and privacy filter to find entries fast.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <CalenderIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Calendar</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Each day shows a count badge if there are entries.</li>
            <li>Click a date to see the list of entries for that day.</li>
            <li>Use “Add for this date” to create an entry with the selected date.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-500/20">
              <ListIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Notes</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Use categories for grouping (Work, Ideas, Personal).</li>
            <li>
              Pin important notes (<ShootingStarIcon className="inline h-4 w-4" />) so they stay on top.
            </li>
            <li>Use search to find notes quickly.</li>
          </ul>
        </section>
      </div>
    </>
  );
}


