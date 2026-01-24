import { useEffect, useMemo, useState } from "react";
import journalNoteCategoriesService, {
  JournalNoteCategory,
  CreateCategoryData,
  UpdateCategoryData,
} from "../../services/journalNoteCategoriesService";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { JOURNAL_COLORS } from "../../utils/journal";
import { PlusIcon, TagIcon, PencilIcon, TrashBinIcon, LockIcon } from "../../icons";
import PageMeta from "../../components/common/PageMeta";

type FormState = {
  id?: number | null;
  name: string;
  color: string;
  icon: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<JournalNoteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState<FormState>({ id: null, name: "", color: JOURNAL_COLORS[0].value, icon: "" });
  const [deleteTarget, setDeleteTarget] = useState<JournalNoteCategory | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const normalizeIcon = (val: string) => {
    if (!val) return "";
    const arr = Array.from(val.trim());
    return arr[0] || "";
  };

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  const defaultCategories = useMemo(() => sortedCategories.filter((c) => c.is_default), [sortedCategories]);
  const userCategories = useMemo(() => sortedCategories.filter((c) => !c.is_default), [sortedCategories]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await journalNoteCategoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      setSaving(true);
      if (form.id) {
        const payload: UpdateCategoryData = {
          name: form.name.trim(),
          color: form.color,
          icon: normalizeIcon(form.icon) || null,
        };
        const updated = await journalNoteCategoriesService.update(form.id, payload);
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const payload: CreateCategoryData = {
          name: form.name.trim(),
          color: form.color,
          icon: normalizeIcon(form.icon) || null,
        };
        const created = await journalNoteCategoriesService.create(payload);
        setCategories((prev) => [...prev, created]);
      }
      setIsFormVisible(false);
      setTimeout(() => {
        setShowForm(false);
        setForm({ id: null, name: "", color: JOURNAL_COLORS[0].value, icon: "" });
      }, 200);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: JournalNoteCategory) => {
    if (cat.is_default) return;
    setForm({ id: cat.id, name: cat.name, color: cat.color || JOURNAL_COLORS[0].value, icon: cat.icon || "" });
    setShowForm(true);
    setTimeout(() => setIsFormVisible(true), 10);
  };

  const handleOpenForm = () => {
    setForm({ id: null, name: "", color: JOURNAL_COLORS[0].value, icon: "" });
    setShowForm(true);
    setTimeout(() => setIsFormVisible(true), 10);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setTimeout(() => {
      setShowForm(false);
      setForm({ id: null, name: "", color: JOURNAL_COLORS[0].value, icon: "" });
    }, 200);
  };

  const openDeleteModal = (cat: JournalNoteCategory) => {
    if (cat.is_default) return;
    setDeleteTarget(cat);
    setShowDeleteModal(true);
    setTimeout(() => setIsDeleteVisible(true), 10);
  };

  const closeDeleteModal = () => {
    setIsDeleteVisible(false);
    setTimeout(() => {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }, 150);
  };

  const handleDelete = async (id: number, isDefault: boolean) => {
    if (isDefault) return;
    try {
      setDeletingId(id);
      await journalNoteCategoriesService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const CategoryCard = ({
    category,
    onEdit,
    onDelete,
    deleting,
    isDefault,
  }: {
    category: JournalNoteCategory;
    onEdit?: () => void;
    onDelete?: () => void;
    deleting?: boolean;
    isDefault?: boolean;
  }) => (
    <div
      className="group rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02] hover:border-brand-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-brand-400/80 dark:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-semibold text-white shadow"
          style={{ backgroundColor: category.color || "#6366F1" }}
        >
          {category.icon ? (
            <span className="text-2xl">{category.icon}</span>
          ) : (
            <TagIcon className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 dark:text-white truncate">{category.name}</p>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isDefault ? "Default category" : "Custom category"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDefault ? (
            <LockIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="rounded p-1 text-gray-500 transition hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded p-1 text-gray-500 transition hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                disabled={deleting}
                title={deleting ? "Deleting..." : "Delete"}
              >
                <TrashBinIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <PageMeta
        title="Journal Categories - 26-step"
        description="Manage your journal categories"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Journal & Notes Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage categories for journal entries and notes.</p>
        </div>
        <Button onClick={handleOpenForm} startIcon={<PlusIcon className="h-5 w-5" />}>
          New Category
        </Button>
      </div>

      {/* My Categories */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Categories</h2>
          {!loading && userCategories.length > 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">{userCategories.length} categories</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse dark:bg-gray-700" />
              ))}
            </div>
          ) : userCategories.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No categories yet. Create one to get started.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {userCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onEdit={() => handleEdit(cat)}
                  onDelete={() => openDeleteModal(cat)}
                  deleting={deletingId === cat.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Default Categories */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Default Categories</h2>
          {!loading && defaultCategories.length > 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">{defaultCategories.length} categories</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse dark:bg-gray-700" />
              ))}
            </div>
          ) : defaultCategories.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No default categories.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {defaultCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} isDefault />
              ))}
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div
          className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200 ${isFormVisible ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseForm();
          }}
        >
          <div
            className={`w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 ${isFormVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {form.id ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={handleCloseForm}
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Work, Ideas, Personal"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon (emoji)</label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="e.g., 💡"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional. You can paste an emoji here.</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                <div className="flex flex-wrap gap-3">
                  {JOURNAL_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                      className={`relative h-12 w-12 rounded-xl border-2 transition-all ${form.color === c.value
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
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={handleCloseForm} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || !form.name.trim()}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className={`fixed inset-0 z-[100001] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200 ${isDeleteVisible ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 ${isDeleteVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Category</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete category{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{deleteTarget?.name}</span>? This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => deleteTarget && handleDelete(deleteTarget.id, !!deleteTarget.is_default)}
                disabled={deletingId === deleteTarget?.id}
              >
                {deletingId === deleteTarget?.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
