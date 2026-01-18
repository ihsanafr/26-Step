import { useEffect, useMemo, useState } from "react";
import { filesService } from "../../services/filesService";
import type { File } from "../../services/filesService";
import { notesService } from "../../services/notesService";
import type { Note } from "../../services/notesService";
import { linksService } from "../../services/linksService";
import type { Link } from "../../services/linksService";
import { Skeleton } from "../common/Skeleton";
import { Link as RouterLink, useNavigate } from "react-router";
import { FolderIcon, FileIcon } from "../../icons";

// Simple Link Icon Component
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

// Simple Pin Icon Component
function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}
import Button from "../ui/button/Button";
import { formatIndonesianDate } from "../../utils/date";
import { resolveAssetUrl } from "../../utils/url";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎥";
  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📽️";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "📦";
  return "📎";
}

export default function StorageOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [f, n, l] = await Promise.all([
          filesService.getAll().catch(() => []),
          notesService.getAll().catch(() => []),
          linksService.getAll().catch(() => []),
        ]);
        setFiles(f || []);
        setNotes(n || []);
        setLinks(l || []);
      } catch (e) {
        console.error("Error loading storage dashboard:", e);
        setFiles([]);
        setNotes([]);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + f.size, 0),
    [files]
  );

  const categories = useMemo(() => {
    const cats = new Set<string>();
    files.forEach((f) => f.category && cats.add(f.category));
    notes.forEach((n) => n.category && cats.add(n.category));
    links.forEach((l) => l.category && cats.add(l.category));
    return Array.from(cats);
  }, [files, notes, links]);

  const recentFiles = useMemo(() => files.slice(0, 4), [files]);
  const pinnedNotes = useMemo(() => notes.filter((n) => n.is_pinned).slice(0, 3), [notes]);
  const favoriteLinks = useMemo(() => links.filter((l) => l.is_favorite).slice(0, 4), [links]);

  const stats = [
    {
      label: "Total Files",
      value: files.length,
      icon: FolderIcon,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-200 dark:border-blue-800",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Links",
      value: links.length,
      icon: LinkIcon,
      color: "from-green-500 to-green-600",
      borderColor: "border-green-200 dark:border-green-800",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Storage Used",
      value: formatFileSize(totalSize),
      icon: FolderIcon,
      color: "from-orange-500 to-orange-600",
      borderColor: "border-orange-200 dark:border-orange-800",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: FolderIcon,
      color: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">Storage</h1>
          <p className="mb-6 text-lg text-indigo-100 md:text-xl">
            Manage your files, notes, and important links in one place
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/storage/files")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3.5 text-sm font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
            >
              <FolderIcon className="h-5 w-5" />
              Browse Files
            </button>
            <Button
              onClick={() => navigate("/storage/notes")}
              className="bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <FileIcon className="mr-2 h-5 w-5" />
              View Notes
            </Button>
            <Button
              onClick={() => navigate("/storage/links")}
              className="bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <LinkIcon className="mr-2 h-5 w-5" />
              Manage Links
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border-2 ${stat.borderColor} ${stat.bgColor} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
              <div className="relative z-10">
                <div className={`mb-3 inline-flex rounded-xl ${stat.bgColor} p-3`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Files - 2 columns */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Files</h2>
              <RouterLink
                to="/storage/files"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                View All →
              </RouterLink>
            </div>
            {recentFiles.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <FolderIcon className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p>No files yet</p>
                <Button
                  onClick={() => navigate("/storage/files")}
                  className="mt-4"
                  size="sm"
                >
                  Upload Files
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="group flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl dark:bg-gray-700">
                      {getFileIcon(file.mime_type)}
                    </div>
                    <div className="flex-grow">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {file.category || "Uncategorized"}
                      </div>
                    </div>
                    <a
                      href={resolveAssetUrl((file as any).url || `/storage/${file.path}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 opacity-0 transition-opacity hover:bg-indigo-100 group-hover:opacity-100 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                    >
                      Open
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Insights - 1 column */}
        <div className="space-y-6">
          {/* Favorite Links */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Favorite Links</h2>
              <RouterLink
                to="/storage/links"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                View All →
              </RouterLink>
            </div>
            {favoriteLinks.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <LinkIcon className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p>No favorite links</p>
              </div>
            ) : (
              <div className="space-y-2">
                {favoriteLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                  >
                    <LinkIcon className="h-5 w-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <div className="flex-grow min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {link.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {new URL(link.url).hostname}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
