import { CreateCategoryData } from './categoriesService';

export const defaultCategories: CreateCategoryData[] = [
  {
    name: "Work",
    description: "Work-related tasks and projects",
    color: "#3b82f6", // blue
    icon: "💼",
  },
  {
    name: "Personal",
    description: "Personal tasks and activities",
    color: "#10b981", // green
    icon: "🏠",
  },
  {
    name: "Health",
    description: "Health and fitness related tasks",
    color: "#ef4444", // red
    icon: "💪",
  },
  {
    name: "Learning",
    description: "Education and learning tasks",
    color: "#8b5cf6", // purple
    icon: "📚",
  },
  {
    name: "Shopping",
    description: "Shopping and errands",
    color: "#f59e0b", // amber
    icon: "🛒",
  },
  {
    name: "Family",
    description: "Family related tasks",
    color: "#ec4899", // pink
    icon: "👨‍👩‍👧‍👦",
  },
];

