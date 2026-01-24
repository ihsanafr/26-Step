import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronDownIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setIsLogoutOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutOpen(false);
    await logout();
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setIsLogoutOpen(false);
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const handleHomepage = () => {
    setIsOpen(false);
    navigate("/");
  };

  const handleAdmin = () => {
    setIsOpen(false);
    navigate("/admin");
  };

  return (
    <div className="relative" ref={dropdownRef} data-onboarding="profile">
      {/* Profile Photo Button */}
      <button
        onClick={toggleDropdown}
        className="relative flex items-center gap-1.5 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-full sm:gap-2"
        aria-label="Profile Menu"
      >
        <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-brand-400 dark:hover:border-brand-500 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
          {user?.avatar || user?.avatar_url ? (
            <img 
              src={user.avatar_url || user.avatar} 
              alt={user?.name || "User"} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=465fff&color=fff&size=128`;
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-semibold text-xs sm:text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 sm:h-4 sm:w-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu with smooth animation */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200 sm:w-64">
          {/* User Info Section */}
          <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 sm:px-4 sm:py-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate sm:text-xs">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1.5 sm:py-2">
            <button
              onClick={handleProfile}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-brand-400 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Profile</span>
            </button>

            <button
              onClick={handleHomepage}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-brand-400 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Back to Homepage</span>
            </button>

            {isAdmin && (
              <>
                <hr className="my-1.5 border-gray-200 dark:border-gray-700 sm:my-2" />
                <button
                  onClick={handleAdmin}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-purple-700 transition-colors hover:bg-purple-50 hover:text-purple-800 dark:text-purple-400 dark:hover:bg-purple-500/10 dark:hover:text-purple-300 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Admin Dashboard</span>
                </button>
              </>
            )}

            <hr className="my-1.5 border-gray-200 dark:border-gray-700 sm:my-2" />
            
            <button
              onClick={handleLogoutClick}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleLogoutCancel}
          ></div>
          <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in zoom-in-95 duration-200 sm:rounded-2xl sm:p-6">
            <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 sm:h-10 sm:w-10">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v4m0 4h.01M4.93 19h14.14a2 2 0 001.74-3l-7.07-12a2 2 0 00-3.48 0l-7.07 12a2 2 0 001.74 3z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                Confirm Logout
              </h3>
            </div>
            <p className="mb-4 text-xs text-gray-600 dark:text-gray-400 sm:mb-6 sm:text-sm">
              Are you sure you want to logout from the application?
            </p>
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <button
                onClick={handleLogoutCancel}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-4 sm:py-2 sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

