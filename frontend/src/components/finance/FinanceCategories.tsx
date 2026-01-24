import { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button";
import { categoriesService, Category } from "../../services/categoriesService";
import CategoryForm from "../categories/CategoryForm";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { TagIcon, PlusIcon, PencilIcon, TrashBinIcon } from "../../icons";

type FinanceDefault = {
  name: string;
  icon: string;
  color: string;
  type: "Income" | "Expense";
};

const financeDefaults: FinanceDefault[] = [
  { name: "Shopping", icon: "🛒", color: "#8b5cf6", type: "Expense" },
  { name: "Bonus", icon: "🎁", color: "#10b981", type: "Income" },
  { name: "Salary", icon: "💰", color: "#22c55e", type: "Income" },
  { name: "Entertainment", icon: "🎬", color: "#f59e0b", type: "Expense" },
  { name: "Investment", icon: "📈", color: "#14b8a6", type: "Income" },
  { name: "Health", icon: "🏥", color: "#ec4899", type: "Expense" },
  { name: "Other (Income)", icon: "💵", color: "#22c55e", type: "Income" },
  { name: "Other (Expense)", icon: "🧾", color: "#ef4444", type: "Expense" },
  { name: "Food & Drinks", icon: "🍔", color: "#ef4444", type: "Expense" },
  { name: "Education", icon: "📚", color: "#06b6d4", type: "Expense" },
  { name: "Bills", icon: "💳", color: "#6366f1", type: "Expense" },
  { name: "Transportation", icon: "🚗", color: "#3b82f6", type: "Expense" },
  { name: "Work", icon: "💼", color: "#3b82f6", type: "Expense" },
  { name: "Personal", icon: "🏠", color: "#10b981", type: "Expense" },
  { name: "Family", icon: "👨‍👩‍👧‍👦", color: "#ec4899", type: "Expense" },
  { name: "Learning", icon: "📚", color: "#8b5cf6", type: "Expense" },
];

export default function FinanceCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading finance categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const defaultNames = useMemo(
    () => financeDefaults.map((c) => c.name.toLowerCase()),
    []
  );

  const processedCategories = useMemo(() => {
    const seen = new Set<string>();
    return categories.filter((c) => {
      const lowerName = c.name.toLowerCase();
      if (seen.has(lowerName)) return false;
      seen.add(lowerName);
      return true;
    });
  }, [categories]);

  const defaultCategories = useMemo(
    () => processedCategories.filter((c) => defaultNames.includes(c.name.toLowerCase())),
    [processedCategories, defaultNames]
  );

  const customCategories = useMemo(
    () => processedCategories.filter((c) => !defaultNames.includes(c.name.toLowerCase())),
    [processedCategories, defaultNames]
  );

  const getDefaultMeta = (name: string) =>
    financeDefaults.find((c) => c.name.toLowerCase() === name.toLowerCase());

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      setIsSubmitting(true);
      await categoriesService.delete(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      await load();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedCategory) {
        await categoriesService.update(selectedCategory.id, data);
      } else {
        await categoriesService.create(data);
      }
      setIsFormOpen(false);
      setSelectedCategory(null);
      await load();
    } catch (error) {
      console.error("Error saving category:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDefaults = async () => {
    try {
      setIsSubmitting(true);
      const data = await categoriesService.getAll();
      for (const def of financeDefaults) {
        const exists = data.some((c) => c.name.toLowerCase() === def.name.toLowerCase());
        if (!exists) {
          await categoriesService.create({
            name: def.name,
            description: def.type === "Income" ? "Income category" : "Expense category",
            color: def.color,
            icon: def.icon,
          });
        }
      }
      await load();
    } catch (error) {
      console.error("Error creating default categories:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCard = (category: Category) => {
    const meta = getDefaultMeta(category.name);
    const badge = meta?.type;
    return (
      <div
        key={category.id}
        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm transition-all hover:shadow-theme-md hover:scale-[1.01] dark:border-gray-800 dark:bg-gray-800"
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: category.color || meta?.color || "#3b82f6" }}
          >
            {category.icon || meta?.icon || "💼"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {category.name}
            </div>
            {badge && (
              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badge === "Income"
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300"
                  }`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(category)}
            className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(category)}
            className="rounded-lg p-2 text-rose-600 transition-all hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/20"
            title="Delete"
          >
            <TrashBinIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage income and expense categories
            </p>
          </div>
          <Button onClick={handleCreate} startIcon={<PlusIcon className="h-5 w-5" />}>
            Create Category
          </Button>
        </div>
      </div>

      {/* Custom Categories */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-500/20">
            <TagIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Categories</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your custom categories</p>
          </div>
        </div>
        {loading ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">Loading categories...</div>
        ) : customCategories.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-theme-xs dark:bg-gray-800">
              <TagIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No custom categories yet</p>
            <Button onClick={handleCreate} className="mt-4">
              Create Your First Category
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {customCategories.map(renderCard)}
          </div>
        )}
      </div>

      {/* Default Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Default Categories</h2>
          <Button onClick={handleCreateDefaults} variant="outline" disabled={isSubmitting}>
            Generate Defaults
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(defaultCategories.length ? defaultCategories : financeDefaults.map((def, idx) => ({
            id: -(idx + 1),
            name: def.name,
            description: "",
            color: def.color,
            icon: def.icon,
            created_at: "",
            updated_at: "",
          }))).map((cat) => renderCard(cat as Category))}
        </div>
      </div>

      {isFormOpen && (
        <CategoryForm
          category={selectedCategory || undefined}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}

      {isDeleteModalOpen && selectedCategory && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title="Delete Category"
          message={`Are you sure you want to delete the category "${selectedCategory.name}"?`}
          onConfirm={handleDelete}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
          }}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
