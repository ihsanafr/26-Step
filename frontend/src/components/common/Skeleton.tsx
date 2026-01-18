import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-[shimmer_2s_infinite]",
    none: "",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Target Card Skeleton
export const TargetCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" height={20} />
            <Skeleton variant="text" width="90%" height={16} />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={70} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Skeleton variant="rectangular" width={60} height={24} />
        <Skeleton variant="rectangular" width={70} height={24} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={100} height={14} />
          <Skeleton variant="text" width={60} height={14} />
        </div>
        <Skeleton variant="rectangular" width="100%" height={8} />
      </div>
    </div>
  );
};

// Task Card Skeleton (Grid/List)
export const TaskCardSkeleton: React.FC<{ viewMode?: "list" | "grid" }> = ({ viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Skeleton variant="circular" width={20} height={20} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={16} />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width={60} height={24} />
            <Skeleton variant="rectangular" width={70} height={24} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-2 mb-3">
        <Skeleton variant="circular" width={24} height={24} />
        <div className="flex gap-1">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Skeleton variant="rectangular" width={60} height={24} />
        <Skeleton variant="rectangular" width={70} height={24} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={80} height={14} />
          <Skeleton variant="text" width={50} height={14} />
        </div>
        <Skeleton variant="rectangular" width="100%" height={6} />
      </div>
    </div>
  );
};

// Kanban Card Skeleton
export const KanbanCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 mb-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Skeleton variant="text" width="70%" height={16} />
        <Skeleton variant="circular" width={20} height={20} />
      </div>
      <Skeleton variant="text" width="90%" height={14} className="mb-2" />
      <div className="flex items-center gap-2 mb-2">
        <Skeleton variant="rectangular" width={50} height={20} />
        <Skeleton variant="rectangular" width={60} height={20} />
      </div>
      <Skeleton variant="rectangular" width="100%" height={4} />
    </div>
  );
};

// Category Card Skeleton
export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
      <Skeleton variant="text" width="80%" height={20} className="mb-2" />
      <Skeleton variant="text" width="60%" height={16} />
    </div>
  );
};

// Stat Card Skeleton
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <Skeleton variant="rectangular" width={48} height={48} />
        <Skeleton variant="text" width={60} height={20} />
      </div>
      <Skeleton variant="text" width="40%" height={24} className="mb-1" />
      <Skeleton variant="text" width="60%" height={16} />
    </div>
  );
};

// Overview Section Skeleton
export const OverviewSectionSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-3xl" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton variant="text" width={220} height={28} />
          <Skeleton variant="text" width={160} height={16} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4">
          <Skeleton variant="text" width={240} height={28} className="mb-2" />
          <Skeleton variant="text" width={200} height={16} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton variant="text" width={180} height={16} />
          <Skeleton variant="rectangular" width="100%" height={8} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton variant="text" width={180} height={24} />
          <Skeleton variant="text" width={120} height={16} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton variant="text" width={200} height={24} />
          <Skeleton variant="rectangular" width={120} height={32} />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4">
          <Skeleton variant="text" width={200} height={24} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div>
        <Skeleton variant="text" width={220} height={24} className="mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <TargetCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

