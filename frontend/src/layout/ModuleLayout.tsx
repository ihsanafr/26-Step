import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import ModuleSidebar from "./ModuleSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex" data-main-layout>
      <div data-sidebar-container>
        <ModuleSidebar />
        <Backdrop />
      </div>
      <div
        data-main-content
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div data-content-area className="p-3 sm:p-4 md:p-6 mx-auto max-w-7xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const ModuleLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default ModuleLayout;
