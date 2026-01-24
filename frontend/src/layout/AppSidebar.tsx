import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  GridIcon,
  TaskIcon,
  DollarLineIcon,
  TimeIcon,
  CheckCircleIcon,
  FolderIcon,
  FileIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <TaskIcon />,
    name: "Tasks & Targets",
    path: "/tasks",
  },
  {
    icon: <DollarLineIcon />,
    name: "Finance",
    path: "/finance",
  },
  {
    icon: <TimeIcon />,
    name: "Productivity",
    path: "/productivity",
  },
  {
    icon: <CheckCircleIcon />,
    name: "Habits",
    path: "/habits",
  },
  {
    icon: <FolderIcon />,
    name: "Storage",
    path: "/storage",
  },
  {
    icon: <FileIcon />,
    name: "Journal & Notes",
    path: "/journals",
  },
  {
    icon: <FileIcon />,
    name: "Journal Categories",
    path: "/journals/categories",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-[calc(100dvh-64px)] lg:h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex items-center gap-3 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
        >
          <img
            src="/logo.svg"
            alt="26-step"
            className="h-8 w-8 flex-shrink-0"
          />
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              26-step
            </span>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                {navItems.map((nav) => (
                  <li key={nav.name}>
                    <Link
                      to={nav.path}
                      className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                        } ${!isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "lg:justify-start"
                        }`}
                    >
                      <span
                        className={`flex items-center justify-center size-6 ${isActive(nav.path)
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                          }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;

