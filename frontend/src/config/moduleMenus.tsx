import type { ReactNode } from "react";
import {
  GridIcon,
  TaskIcon,
  DollarLineIcon,
  TimeIcon,
  CheckCircleIcon,
  FolderIcon,
  FileIcon,
  ListIcon,
  CalenderIcon,
  TargetIcon,
  TagIcon,
} from "../icons";

export type MenuItem = {
  name: string;
  icon: ReactNode;
  path: string;
};

// Define menu items for each module
export const moduleMenus: Record<string, MenuItem[]> = {
  "/tasks": [
    {
      icon: <GridIcon className="w-5 h-5" />,
      name: "Dashboard",
      path: "/tasks",
    },
    {
      icon: <TargetIcon className="w-5 h-5" />,
      name: "Target & Goals",
      path: "/tasks/targets",
    },
    {
      icon: <ListIcon className="w-5 h-5" />,
      name: "Task List",
      path: "/tasks/list",
    },
    {
      icon: <TagIcon className="w-5 h-5" />,
      name: "Category",
      path: "/tasks/categories",
    },
  ],
  "/finance": [
    {
      icon: <GridIcon className="w-5 h-5" />,
      name: "Dashboard",
      path: "/finance",
    },
    {
      icon: <DollarLineIcon className="w-5 h-5" />,
      name: "Transactions",
      path: "/finance/transactions",
    },
    {
      icon: <FileIcon className="w-5 h-5" />,
      name: "Budget",
      path: "/finance/budget",
    },
    {
      icon: <TagIcon className="w-5 h-5" />,
      name: "Categories",
      path: "/finance/categories",
    },
  ],
  "/productivity": [
    {
      icon: <GridIcon className="w-5 h-5" />,
      name: "Dashboard",
      path: "/productivity",
    },
    {
      icon: <TimeIcon className="w-5 h-5" />,
      name: "Pomodoro",
      path: "/productivity/pomodoro",
    },
    {
      icon: <CalenderIcon className="w-5 h-5" />,
      name: "Schedule",
      path: "/productivity/schedule",
    },
    {
      icon: <FileIcon className="w-5 h-5" />,
      name: "Reports",
      path: "/productivity/reports",
    },
  ],
  "/habits": [
    {
      icon: <GridIcon className="w-5 h-5" />,
      name: "Dashboard",
      path: "/habits",
    },
    {
      icon: <ListIcon className="w-5 h-5" />,
      name: "Habit List",
      path: "/habits/list",
    },
    {
      icon: <TimeIcon className="w-5 h-5" />,
      name: "Streaks",
      path: "/habits/streaks",
    },
  ],
  "/storage": [
    {
      icon: <GridIcon className="w-5 h-5" />,
      name: "Dashboard",
      path: "/storage",
    },
    {
      icon: <FolderIcon className="w-5 h-5" />,
      name: "Files",
      path: "/storage/files",
    },
    {
      icon: <ListIcon className="w-5 h-5" />,
      name: "Links",
      path: "/storage/links",
    },
  ],
  "/journals": [
    {
      icon: <GridIcon className="w-5 h-5" />,
      name: "Dashboard",
      path: "/journals",
    },
    {
      icon: <FileIcon className="w-5 h-5" />,
      name: "Journal Entries",
      path: "/journals/list",
    },
    {
      icon: <ListIcon className="w-5 h-5" />,
      name: "Notes",
      path: "/journals/notes",
    },
  ],
};

// Get menu items for a module path
export const getModuleMenu = (path: string): MenuItem[] => {
  // Extract base path (e.g., /tasks from /tasks/list)
  const basePath = "/" + path.split("/")[1];
  return moduleMenus[basePath] || moduleMenus["/tasks"]; // Default to tasks menu
};
