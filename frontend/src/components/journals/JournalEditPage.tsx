import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { journalsService, Journal } from "../../services/journalsService";
import { formatLocalDate } from "../productivity/utils";
import RichTextEditor from "../common/RichTextEditor";
import { stripHtml } from "../../utils/text";
import { ChevronLeftIcon } from "../../icons";
import { getMoodEmoji, getWeatherEmoji, JOURNAL_COLORS } from "../../utils/journal";
import { Skeleton } from "../common/Skeleton";
import AlertModal from "../common/AlertModal";

type FormData = {
  title: string;
  content: string;
  date: string;
  mood: string;
  weather: string;
  location: string;
  is_private: boolean;
  color: string;
  cover_image: string; // URL (persisted)
};

const MOODS = ["Happy", "Calm", "Grateful", "Excited", "Neutral", "Stressed", "Sad", "Angry"];
const WEATHER = ["Sunny", "Cloudy", "Rainy", "Windy", "Stormy", "Snowy"];

export default function JournalEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const formRef = useRef<HTMLFormElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [journal, setJournal] = useState<Journal | null>(null);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>("");
  const [alertModal, setAlertModal] = useState<{ open: boolean; title: string; message: string; type?: "error" | "warning" | "info" | "success" }>({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const initial = useMemo<FormData>(() => {
    if (journal) {
      return {
        title: journal.title ?? "",
        content: journal.content ?? "",
        date: (journal.date || "").slice(0, 10) || formatLocalDate(new Date()),
        mood: journal.mood ?? "",
        weather: journal.weather ?? "",
        location: journal.location ?? "",
        is_private: !!journal.is_private,
        color: journal.color || JOURNAL_COLORS[0].value,
        cover_image: journal.cover_image || "",
      };
    }
    return {
      title: "",
      content: "",
      date: formatLocalDate(new Date()),
      mood: "",
      weather: "",
      location: "",
      is_private: false,
      color: JOURNAL_COLORS[0].value,
      cover_image: "",
    };
  }, [journal]);

  const [form, setForm] = useState<FormData>(initial);

  useEffect(() => {
    if (journal) {
      setForm(initial);
      setCoverFile(null);
      setCoverPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    }
  }, [journal, initial]);

  // Ensure color always has a value
  useEffect(() => {
    if (!form.color || form.color.trim() === "") {
      setForm((f) => ({ ...f, color: JOURNAL_COLORS[0].value }));
    }
  }, [form.color]);

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
        setAlertModal({
          open: true,
          title: "Error",
          message: "Failed to load journal. Redirecting...",
          type: "error",
        });
        setTimeout(() => {
          navigate("/journals/list");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, navigate]);

  const handleCoverUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setAlertModal({
        open: true,
        title: "Invalid File Type",
        message: "Please select an image file.",
        type: "error",
      });
      if (e.target) e.target.value = "";
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setAlertModal({
        open: true,
        title: "File Too Large",
        message: "Image size must be less than 5MB. Please choose a smaller image.",
        type: "error",
      });
      if (e.target) e.target.value = "";
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      setCoverPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setCoverFile(file);
      // Clear persisted URL until we upload on save
      setForm((f) => ({ ...f, cover_image: "" }));
    } catch (err) {
      console.error("Error preparing image:", err);
      setAlertModal({
        open: true,
        title: "Upload Error",
        message: "Failed to prepare image. Please try again.",
        type: "error",
      });
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setForm((f) => ({ ...f, cover_image: "" }));
  };

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    // Basic validation
    if (!form.title.trim()) {
      setAlertModal({
        open: true,
        title: "Validation Error",
        message: "Please enter a title for your journal entry.",
        type: "warning",
      });
      return;
    }
    
    // Ensure color is always set and valid
    let colorToSave = form.color?.trim();
    if (!colorToSave || !JOURNAL_COLORS.some((c) => c.value === colorToSave)) {
      colorToSave = JOURNAL_COLORS[0].value;
    }

    try {
      setSaving(true);

      let coverImageToSave: string | null = form.cover_image || null;
      if (coverFile) {
        console.log("🔵 [JournalEdit] Uploading cover file:", {
          fileName: coverFile.name,
          fileSize: coverFile.size,
          fileType: coverFile.type,
        });
        try {
        const uploaded = await journalsService.uploadCover(coverFile);
        console.log("🟢 [JournalEdit] Upload response:", uploaded);
          if (!uploaded.url) {
            throw new Error("Server did not return cover image URL");
          }
        coverImageToSave = uploaded.url;
        } catch (uploadError: any) {
          console.error("❌ [JournalEdit] Cover upload error:", uploadError);
          const errorMessage = uploadError?.response?.data?.message || uploadError?.message || "Failed to upload cover image";
          setAlertModal({
            open: true,
            title: "Upload Error",
            message: errorMessage,
            type: "error",
          });
          setSaving(false);
          return;
        }
      }

      const journalData = {
        title: form.title.trim(),
        content: form.content || "",
        date: form.date,
        mood: form.mood || null,
        weather: form.weather || null,
        location: form.location || null,
        is_private: form.is_private,
        color: colorToSave,
        cover_image: coverImageToSave,
      };
      console.log("🔵 [JournalEdit] Updating journal with data:", journalData);
      const updated = await journalsService.update(Number(id), journalData);
      console.log("🟢 [JournalEdit] Journal updated:", updated);
      navigate("/journals/list");
    } catch (e: any) {
      console.error("Error updating journal:", e);
      const errorMessage = e?.response?.data?.message || e?.message || "Failed to save journal. Please try again.";
      setAlertModal({
        open: true,
        title: "Error",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-6 w-20 mb-3" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="space-y-5">
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <ChevronLeftIcon className="h-4 w-4" /> Back
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Journal Entry</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update your journal entry with formatting, alignment, and images.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/journals/list")} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              }
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <form ref={formRef} id="journal-edit-form" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Mood</label>
                <select
                  value={form.mood}
                  onChange={(e) => setForm((f) => ({ ...f, mood: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">—</option>
                  {MOODS.map((m) => (
                    <option key={m} value={m}>
                      {getMoodEmoji(m)} {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Weather</label>
                <select
                  value={form.weather}
                  onChange={(e) => setForm((f) => ({ ...f, weather: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">—</option>
                  {WEATHER.map((w) => (
                    <option key={w} value={w}>
                      {getWeatherEmoji(w)} {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Location (optional)</label>
            <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          </div>

          {/* Color and Cover */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Journal Color *</label>
              <div className="flex flex-wrap gap-3">
                {JOURNAL_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                    className={`relative h-12 w-12 rounded-xl border-2 transition-all ${
                      form.color === c.value
                        ? "border-gray-900 dark:border-white scale-110 ring-2 ring-offset-2 ring-brand-500"
                        : "border-gray-300 dark:border-gray-600 hover:scale-105 hover:border-gray-400"
                    } cursor-pointer`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {form.color === c.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="h-6 w-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Choose a color for your journal. If you upload a cover image, the color will be used as fallback.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image (optional)</label>
              <input
                ref={coverInputRef}
                id="journal-cover-upload-edit"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverUpload}
              />
              {(coverPreviewUrl || form.cover_image) ? (
                <div className="relative group">
                  <img src={coverPreviewUrl || form.cover_image} alt="Cover" className="h-40 w-full rounded-xl object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors">
                    <label
                      htmlFor="journal-cover-upload-edit"
                      className="opacity-0 group-hover:opacity-100 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900 transition-opacity hover:bg-white cursor-pointer"
                    >
                      Change Image
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute right-2 top-2 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="journal-cover-upload-edit"
                  className="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600 transition hover:border-brand-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-brand-500 cursor-pointer"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">Click to upload cover image</p>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </label>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Upload a cover image for your journal. If not provided, the selected color will be used.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              placeholder="Write your thoughts..."
            />
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{stripHtml(form.content).split(/\s+/).filter(Boolean).length} words</span>
              <span>{stripHtml(form.content).length} chars</span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.is_private}
              onChange={(e) => setForm((f) => ({ ...f, is_private: e.target.checked }))}
            />
            Private entry
          </label>
        </form>
      </div>

      <AlertModal
        isOpen={alertModal.open}
        onClose={() => setAlertModal({ open: false, title: "", message: "" })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}

