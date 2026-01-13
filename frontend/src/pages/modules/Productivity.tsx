import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ProductivityOverview from "../../components/productivity/ProductivityOverview";
import PomodoroPage from "../../components/productivity/PomodoroPage";
import ReportsPage from "../../components/productivity/ReportsPage";
import SchedulePage from "../../components/productivity/SchedulePage";
import ProductivityGuide from "../../components/productivity/ProductivityGuide";

export default function Productivity() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/productivity" || path === "/productivity/") {
    return (
      <>
        <PageMeta title="Productivity & Time - Lifesync" description="Time tracking, focus, and planning" />
        <ProductivityOverview />
      </>
    );
  }

  // Temporary placeholders for upcoming sub-pages (will be implemented next)
  if (path === "/productivity/pomodoro") {
    return (
      <>
        <PageMeta title="Pomodoro - Lifesync" description="Run focus sessions" />
        <PomodoroPage />
      </>
    );
  }

  if (path === "/productivity/schedule") {
    return (
      <>
        <PageMeta title="Schedule - Lifesync" description="Plan your day" />
        <SchedulePage />
      </>
    );
  }

  if (path === "/productivity/reports") {
    return (
      <>
        <PageMeta title="Reports - Lifesync" description="Review your time logs" />
        <ReportsPage />
      </>
    );
  }

  if (path === "/productivity/guide") {
    return (
      <>
        <PageMeta title="Productivity Guide - Lifesync" description="How to use Productivity & Time module" />
        <ProductivityGuide />
      </>
    );
  }

  return (
    <>
      <PageMeta title="Productivity & Time - Lifesync" description="Time tracking, focus, and planning" />
      <ProductivityOverview />
    </>
  );
}

