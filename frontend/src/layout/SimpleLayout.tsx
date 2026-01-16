import { Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import UserDropdown from "../components/header/UserDropdown";
import { Link } from "react-router";

const SimpleLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="relative">
                {/* Outer box with blue-purple gradient */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-500/30 blur-sm"></div>
                {/* Inner box with logo - blue-purple gradient */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 shadow-lg">
                  <img src="/logo.svg" alt="26-step" className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">26-step</h2>
            </Link>

            {/* Right side - Theme toggle & User */}
            <div className="flex items-center gap-4">
              <ThemeToggleButton />
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default SimpleLayout;


