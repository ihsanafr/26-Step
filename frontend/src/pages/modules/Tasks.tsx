import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import TaskList from "../../components/tasks/TaskList";
import TargetList from "../../components/targets/TargetList";
import CategoryList from "../../components/categories/CategoryList";
import TasksOverview from "../../components/tasks/TasksOverview";

export default function Tasks() {
  const location = useLocation();
  const path = location.pathname;

  // Determine which component to show based on path
  if (path === "/tasks" || path === "/tasks/") {
    return (
      <>
        <PageMeta
          title="Tasks & Targets Dashboard - 26-step"
          description="Manage your daily tasks and achieve your targets"
        />
        <TasksOverview />
      </>
    );
  }

  if (path === "/tasks/list") {
    return (
      <>
        <PageMeta
          title="Tasks List - 26-step"
          description="Manage your daily tasks"
        />
        <TaskList />
      </>
    );
  }

  if (path === "/tasks/targets") {
    return (
      <>
        <PageMeta
          title="Targets - 26-step"
          description="Track your goals and achievements"
        />
        <TargetList />
      </>
    );
  }

  if (path === "/tasks/categories") {
    return (
      <>
        <PageMeta
          title="Categories - 26-step"
          description="Manage your task categories"
        />
        <CategoryList />
      </>
    );
  }

  // Default to overview
  return (
    <>
      <PageMeta
        title="Tasks & Targets Dashboard - 26-step"
        description="Manage your daily tasks and achieve your targets"
      />
      <TasksOverview />
    </>
  );
}
