import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Category, CreateCategoryData, UpdateCategoryData } from "../../services/categoriesService";

interface CategoryFormProps {
  category?: Category;
  onSave: (data: CreateCategoryData | UpdateCategoryData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    description: "",
    color: "#3b82f6",
    icon: "📌",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsMounted(false);
    setTimeout(() => {
      onCancel();
    }, 250);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading && !isClosing) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isClosing]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        color: category.color || "#3b82f6",
        icon: category.icon || "📌",
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleChange = (field: keyof CreateCategoryData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading && !isClosing) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-start justify-center bg-black/50 p-4 pt-8 md:pt-16 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto ${
        isMounted && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-2xl my-8 rounded-2xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-800 transition-all duration-300 ease-out ${
          isMounted && !isClosing ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {category ? "Edit Category" : "Create New Category"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter category description"
                rows={4}
                className="h-24 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={(e) => handleChange("icon", e.target.value)}
                  placeholder="📌"
                  maxLength={2}
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    className="h-11 w-20 cursor-pointer rounded-lg border border-gray-300 bg-transparent shadow-theme-xs dark:border-gray-700"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading || isClosing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? "Saving..." : category ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;

