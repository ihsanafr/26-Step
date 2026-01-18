import PageMeta from "../common/PageMeta";
import { FolderIcon, FileIcon, InfoIcon, PlusIcon, SearchIcon } from "../../icons";

// Simple Link Icon Component
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

export default function StorageGuide() {
  return (
    <>
      <PageMeta title="Storage Guide - Lifesync" description="How to use the Storage module" />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">User Guide: Storage</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your files, notes, and important links in one organized place.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-500/20">
              <InfoIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            The Storage module helps you organize and manage all your digital assets. You can upload files, create folders, save important links, and take quick notes - all in one place.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <FolderIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Files Management</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-white">Upload Files:</strong> Click the "Upload Dokumen" button to add files. You can rename files during upload or keep the original name.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Create Folders:</strong> Organize files by creating folders. Maximum folder depth is 3 levels to keep things organized.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">View Files:</strong> Switch between grid and list view. Click on any file to preview it.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Edit Files:</strong> Use the options menu (three dots) to edit file name, category, or description.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Download Files:</strong> Download files with a confirmation notification. Files are downloaded with their original names.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Delete Files:</strong> Remove files you no longer need. This action cannot be undone.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Search & Filter:</strong> Use the search bar to find files by name, or filter by type and category.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
              <LinkIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Links Management</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Save important website links for quick access.</li>
            <li>Organize links with categories and mark favorites.</li>
            <li>Open links in new tabs directly from the storage module.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <FileIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Notes</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Create quick notes for ideas, reminders, or important information.</li>
            <li>Pin important notes to keep them at the top.</li>
            <li>Organize notes with categories for better management.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <SearchIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Tips & Best Practices</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Use descriptive file names to make searching easier.</li>
            <li>Create folders based on projects or categories for better organization.</li>
            <li>Regularly review and delete files you no longer need to save storage space.</li>
            <li>Use categories consistently to make filtering more effective.</li>
            <li>Mark important links as favorites for quick access.</li>
            <li>Preview files before downloading to ensure you have the right file.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
