import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { getModuleMenu } from "../config/moduleMenus";
import { HorizontaLDots, FileIcon, ArrowRightIcon } from "../icons";

const ModuleSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  // Get menu items for current module
  const navItems = getModuleMenu(location.pathname);

  const isActive = useCallback(
    (path: string) => {
      const currentPath = location.pathname;

      // Root module items like "/journals" should only be active on exact match (not on "/journals/list").
      const isRootModulePath = path.split("/").filter(Boolean).length === 1;
      if (isRootModulePath) {
        return currentPath === path || currentPath === `${path}/`;
      }

      // Non-root items can match exact or nested routes.
      return currentPath === path || currentPath.startsWith(path + "/");
    },
    [location.pathname]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
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
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/dashboard" className="text-xl font-bold text-gray-800 dark:text-white">
          {isExpanded || isHovered || isMobileOpen ? "26-step" : "26"}
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 flex-1">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="w-6 h-6" />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                {navItems.map((nav) => (
                  <li key={nav.path}>
                    <Link
                      to={nav.path}
                      className={`menu-item group ${
                        isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                      } ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "lg:justify-start"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center flex-shrink-0 ${
                          isActive(nav.path)
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
        
        {/* User Guide Button - Bottom of Sidebar */}
        <div className="mt-auto pb-6">
          <Link
            to={`${location.pathname.split('/')[1] ? '/' + location.pathname.split('/')[1] : '/tasks'}/guide`}
            className={`group relative flex items-center gap-3 rounded-xl border-2 border-dashed transition-all duration-300 ${
              isActive(`${location.pathname.split('/')[1] ? '/' + location.pathname.split('/')[1] : '/tasks'}/guide`)
                ? "bg-gradient-to-r from-brand-500 to-brand-600 border-brand-500 shadow-lg shadow-brand-500/50"
                : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 hover:border-brand-400 hover:shadow-md dark:from-gray-800 dark:to-gray-800/50 dark:border-gray-700 dark:hover:border-brand-500"
            } ${
              !isExpanded && !isHovered
                ? "justify-center p-3"
                : "justify-start p-4"
            }`}
          >
            <span
              className={`flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                isActive(`${location.pathname.split('/')[1] ? '/' + location.pathname.split('/')[1] : '/tasks'}/guide`)
                  ? "text-white"
                  : "text-brand-600 dark:text-brand-400"
              }`}
            >
              <FileIcon className="w-5 h-5" />
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span
                className={`text-sm font-semibold ${
                  isActive(`${location.pathname.split('/')[1] ? '/' + location.pathname.split('/')[1] : '/tasks'}/guide`)
                    ? "text-white"
                    : "text-gray-800 dark:text-white"
                }`}
              >
                User Guide
              </span>
            )}
            {(isExpanded || isHovered || isMobileOpen) && (
              <span
                className={`ml-auto transition-transform duration-300 group-hover:translate-x-1 ${
                  isActive(`${location.pathname.split('/')[1] ? '/' + location.pathname.split('/')[1] : '/tasks'}/guide`)
                    ? "text-white"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default ModuleSidebar;
