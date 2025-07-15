import React from "react";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}></div>
);

const DashboardHomeSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Skeleton */}
      <section className="rounded-lg bg-gradient-to-r from-[#34B7A7] to-[#1C7A7A] p-8 shadow-lg">
        <SkeletonBox className="h-8 w-48 mb-4" />
        <SkeletonBox className="h-4 w-full max-w-lg" />
      </section>

      {/* Stats Skeletons */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-6 rounded-xl shadow-md bg-gray-100 dark:bg-gray-800"
          >
            <SkeletonBox className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <SkeletonBox className="h-4 w-32" />
              <SkeletonBox className="h-6 w-20" />
            </div>
          </div>
        ))}
      </section>

      {/* Quick Links Skeleton */}
      <section>
        <SkeletonBox className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-5 rounded-lg shadow-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
            >
              <SkeletonBox className="h-8 w-8 rounded-full" />
              <SkeletonBox className="h-4 w-32" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardHomeSkeleton;
