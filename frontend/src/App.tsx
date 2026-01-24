import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import SimpleLayout from "./layout/SimpleLayout";
import ModuleLayout from "./layout/ModuleLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { PomodoroProvider } from "./context/PomodoroContext";
import { HabitsProvider } from "./context/HabitsContext";
import PomodoroMiniWidget from "./components/productivity/PomodoroMiniWidget";
import { Component, ReactNode } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Tasks from "./pages/modules/Tasks";
import TasksGuide from "./pages/modules/TasksGuide";
import TargetDetail from "./components/targets/TargetDetail";
import Finance from "./pages/modules/Finance";
import Productivity from "./pages/modules/Productivity";
import Habits from "./pages/modules/Habits";
import HabitDetail from "./components/habits/HabitDetail";
import Storage from "./pages/modules/Storage";
import Journals from "./pages/modules/Journals";
import Categories from "./pages/modules/Categories";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-400">Something went wrong</h2>
            <p className="mb-4 text-red-600 dark:text-red-300">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  try {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error("ProtectedRoute error:", error);
    return <Navigate to="/login" replace />;
  }
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  try {
    const { isAuthenticated, isAdmin } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error("AdminProtectedRoute error:", error);
    return <Navigate to="/dashboard" replace />;
  }
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  try {
    const { isAuthenticated } = useAuth();
    
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error("PublicRoute error:", error);
    return <>{children}</>;
  }
};

export default function App() {
  try {
    const { isAuthenticated } = useAuth();

    return (
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <PomodoroProvider>
            <HabitsProvider>
              {/* Show the mini widget across the whole app (while authenticated) */}
              {isAuthenticated ? <PomodoroMiniWidget /> : null}

              <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <PublicRoute>
                    <VerifyEmail />
                  </PublicRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />

              {/* Dashboard Route - Simple Layout (no sidebar) */}
              <Route
                element={
                  <ProtectedRoute>
                    <SimpleLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } 
                />
              </Route>

              {/* Module Routes - Module Layout (with sidebar) */}
              <Route
                element={
                  <ProtectedRoute>
                    <ModuleLayout />
                  </ProtectedRoute>
                }
              >
                {/* Tasks routes - more specific routes first */}
                <Route path="/tasks/guide" element={<TasksGuide />} />
                <Route path="/tasks/list" element={<Tasks />} />
                <Route path="/tasks/targets/:id" element={<TargetDetail />} />
                <Route path="/tasks/targets" element={<Tasks />} />
                <Route path="/tasks/categories" element={<Tasks />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/finance/transactions" element={<Finance />} />
                <Route path="/finance/budget" element={<Finance />} />
                <Route path="/finance/categories" element={<Finance />} />
                <Route path="/finance/guide" element={<Finance />} />
                <Route path="/finance" element={<Finance />} />
                {/* Productivity routes - more specific routes first */}
                <Route path="/productivity/guide" element={<Productivity />} />
                <Route path="/productivity/pomodoro" element={<Productivity />} />
                <Route path="/productivity/schedule" element={<Productivity />} />
                <Route path="/productivity/reports" element={<Productivity />} />
                <Route path="/productivity" element={<Productivity />} />
                {/* Habits routes - more specific routes first */}
                <Route path="/habits/guide" element={<Habits />} />
                <Route path="/habits/list" element={<Habits />} />
                <Route path="/habits/streaks" element={<Habits />} />
                <Route path="/habits/:id" element={<HabitDetail />} />
                <Route path="/habits" element={<Habits />} />
                {/* Storage routes - more specific routes first */}
                <Route path="/storage/files" element={<Storage />} />
                <Route path="/storage/links" element={<Storage />} />
                <Route path="/storage/notes" element={<Storage />} />
                <Route path="/storage/guide" element={<Storage />} />
                <Route path="/storage" element={<Storage />} />
                {/* Journals routes */}
                <Route path="/journals/list" element={<Journals />} />
                <Route path="/journals/new" element={<Journals />} />
                <Route path="/journals/edit/:id" element={<Journals />} />
                <Route path="/journals/view/:id" element={<Journals />} />
                <Route path="/journals/calendar" element={<Journals />} />
                <Route path="/journals/notes" element={<Journals />} />
                <Route path="/journals/guide" element={<Journals />} />
                <Route path="/journals/categories" element={<Categories />} />
                <Route path="/journals" element={<Journals />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </HabitsProvider>
          </PomodoroProvider>
        </Router>
      </ErrorBoundary>
  );
  } catch (error) {
    console.error("App error:", error);
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-400">Application Error</h2>
          <p className="mb-4 text-red-600 dark:text-red-300">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
