import { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { Category, categoriesService } from "../../services/categoriesService";
import { defaultCategories } from "../../services/defaultCategories";
import { PlusIcon, PencilIcon, TrashBinIcon, TagIcon } from "../../icons";
import CategoryForm from "./CategoryForm";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { CategoryCardSkeleton } from "../common/Skeleton";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initializeCategories = async () => {
      try {
        console.log("Fetching categories...");
        const data = await categoriesService.getAll();
        console.log("Categories fetched:", data);
        
        // Remove duplicates based on name (case-insensitive)
        const uniqueCategories = data.reduce((acc: Category[], current) => {
          const exists = acc.find(cat => cat.name.toLowerCase() === current.name.toLowerCase());
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
        
        // If no categories exist, create default categories
        if (uniqueCategories.length === 0) {
          console.log("No categories found, creating default categories...");
          for (const defaultCat of defaultCategories) {
            try {
              console.log(`Creating category: ${defaultCat.name}`);
              await categoriesService.create(defaultCat);
            } catch (error) {
              console.error(`Error creating default category ${defaultCat.name}:`, error);
            }
          }
          // Fetch categories again after creating defaults
          console.log("Fetching categories after creating defaults...");
          const updatedData = await categoriesService.getAll();
          console.log("Categories after creating defaults:", updatedData);
          setCategories(updatedData);
        } else {
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error initializing categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      await fetchCategories();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
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
      await fetchCategories();
      setIsFormOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleCreateDefaults = async () => {
    try {
      setIsLoading(true);
      console.log("Manually creating default categories...");
      for (const defaultCat of defaultCategories) {
        try {
          console.log(`Creating category: ${defaultCat.name}`);
          await categoriesService.create(defaultCat);
        } catch (error) {
          console.error(`Error creating default category ${defaultCat.name}:`, error);
        }
      }
      // Fetch categories again after creating defaults
      await fetchCategories();
    } catch (error) {
      console.error("Error creating default categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate default categories from user-created categories
  const defaultCategoryNames = defaultCategories.map(cat => cat.name.toLowerCase());
  const defaultCategoriesList = categories.filter(cat => 
    defaultCategoryNames.includes(cat.name.toLowerCase())
  );
  const userCategories = categories.filter(cat => 
    !defaultCategoryNames.includes(cat.name.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        {/* My Categories Skeleton */}
        <div>
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Default Categories Skeleton */}
        <div>
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderCategoryCard = (category: Category) => (
    <div
      key={category.id}
      className="group rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all duration-300 hover:shadow-theme-md hover:scale-[1.02] hover:border-brand-300 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-brand-500"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-3xl"
          style={{ backgroundColor: category.color || "#3b82f6" }}
        >
          {category.icon || "📁"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => handleEdit(category)}
          className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
          title="Edit category"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDeleteClick(category)}
          className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/20"
          title="Delete category"
        >
          <TrashBinIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your task categories</p>
        </div>
        <Button onClick={handleCreate} startIcon={<PlusIcon className="w-5 h-5" />}>
          New Category
        </Button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <TagIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">No categories found</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Start by creating a new category or use default categories</p>
          <div className="mt-6">
            <Button onClick={handleCreateDefaults}>
              Create Default Categories
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* User Categories */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My Categories</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Categories you created</p>
            </div>
            {userCategories.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <TagIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">You haven't created any categories yet</p>
                <div className="mt-4">
                  <Button onClick={handleCreate} size="sm" startIcon={<PlusIcon className="w-4 h-4" />}>
                    Create Category
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userCategories.map(renderCategoryCard)}
              </div>
            )}
          </div>

          {/* Default Categories */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Default Categories</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Pre-defined categories available for all users</p>
            </div>
            {defaultCategoriesList.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">No default categories yet</p>
                <div className="mt-4">
                  <Button onClick={handleCreateDefaults} size="sm">
                    Create Default Categories
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {defaultCategoriesList.map(renderCategoryCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <CategoryForm
          category={selectedCategory || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title="Delete Category"
          message={`Are you sure you want to delete category "${selectedCategory.name}"? Tasks using this category will not be affected.`}
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
};

export default CategoryList;

