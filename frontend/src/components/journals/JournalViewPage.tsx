import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { journalsService, Journal } from "../../services/journalsService";
import { Skeleton } from "../common/Skeleton";
import { ChevronLeftIcon, PencilIcon, TrashBinIcon } from "../../icons";
import { formatIndonesianDate } from "../../utils/date";
import { getMoodEmoji, getWeatherEmoji } from "../../utils/journal";
import { stripHtml } from "../../utils/text";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import Button from "../ui/button/Button";

export default function JournalViewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [journal, setJournal] = useState<Journal | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        navigate("/journals/list");
        return;
      }
      try {
        setLoading(true);
        const data = await journalsService.getById(Number(id));
        setJournal(data);
      } catch (e: any) {
        console.error("Error loading journal:", e);
        alert("Failed to load journal. Redirecting...");
        navigate("/journals/list");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!journal) return;
    try {
      setDeleting(true);
      await journalsService.delete(journal.id);
      navigate("/journals/list");
    } catch (e: any) {
      console.error("Error deleting journal:", e);
      alert("Failed to delete journal. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Journal not found</h2>
          <Button onClick={() => navigate("/journals/list")} className="mt-4">
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  const headerColor = journal.color || "#6366F1";
  const hasCover = !!journal.cover_image;

  return (
    <div className="space-y-6">
      {/* Header with Back and Action Buttons */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ChevronLeftIcon className="h-4 w-4" /> Back
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/journals/edit/${journal.id}`)}
            startIcon={<PencilIcon className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => setDeleteModal(true)}
            startIcon={<TrashBinIcon className="h-4 w-4" />}
            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Journal Card - Large Card with All Content */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-gray-800">
        {/* Cover Image or Color Header - Using User's Color */}
        {hasCover ? (
          <div className="relative h-64 w-full overflow-hidden">
            <img src={journal.cover_image!} alt={journal.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-32 w-full" style={{ backgroundColor: headerColor }} />
        )}

        {/* Content - All Journal Info Inside Card with Neutral Background */}
        <div className="bg-white p-8 dark:bg-gray-800">
          {/* Title */}
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{journal.title}</h2>

          {/* Date, Mood, Weather, Location */}
          <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 dark:border-gray-700">
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
              {formatIndonesianDate(journal.date)}
            </p>
            {journal.mood && (
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                {getMoodEmoji(journal.mood)} {journal.mood}
              </p>
            )}
            {journal.weather && (
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                {getWeatherEmoji(journal.weather)} {journal.weather}
              </p>
            )}
            {journal.location && (
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                📍 {journal.location}
              </p>
            )}
          </div>

          {/* Private Badge */}
          {journal.is_private && (
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-gray-200/60 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:bg-gray-700/60 dark:text-gray-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Private Entry
            </div>
          )}

          {/* Journal Content - Neutral Background for Readability */}
          <div
            className="tiptap text-base leading-relaxed text-gray-800 dark:text-gray-200"
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.875rem',
            }}
            dangerouslySetInnerHTML={{ __html: journal.content || "<p></p>" }}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Journal Entry"
        message={`Are you sure you want to delete "${journal.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

