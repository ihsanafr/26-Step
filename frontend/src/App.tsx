import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import SimpleLayout from "./layout/SimpleLayout";
import ModuleLayout from "./layout/ModuleLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { PomodoroProvider } from "./context/PomodoroContext";
import PomodoroMiniWidget from "./components/productivity/PomodoroMiniWidget";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/modules/Tasks";
import TasksGuide from "./pages/modules/TasksGuide";
import TargetDetail from "./components/targets/TargetDetail";
import Finance from "./pages/modules/Finance";
import Productivity from "./pages/modules/Productivity";
import Habits from "./pages/modules/Habits";
import HabitDetail from "./components/habits/HabitDetail";
import Storage from "./pages/modules/Storage";
import Journals from "./pages/modules/Journals";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <ScrollToTop />
      <PomodoroProvider>
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
            <Route path="/storage" element={<Storage />} />
            <Route path="/journals" element={<Journals />} />
          <Route path="/journals/list" element={<Journals />} />
          <Route path="/journals/new" element={<Journals />} />
          <Route path="/journals/edit/:id" element={<Journals />} />
          <Route path="/journals/view/:id" element={<Journals />} />
          <Route path="/journals/calendar" element={<Journals />} />
          <Route path="/journals/notes" element={<Journals />} />
          <Route path="/journals/guide" element={<Journals />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PomodoroProvider>
    </Router>
  );
}
