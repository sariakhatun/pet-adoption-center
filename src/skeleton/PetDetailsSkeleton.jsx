import React from "react";

const PetDetailsSkeleton = () => {
  return (
    <div className="max-w-full my-12 mx-auto py-12 animate-pulse">
      {/* Main container */}
      <div className="flex flex-col md:flex-row gap-8 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600 items-center">
        {/* Image Skeleton */}
        <div className="md:w-1/2 flex justify-center items-start">
          <div className="rounded-lg w-full lg:h-[650px] max-h-[450px] bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Details Skeleton */}
        <div className="md:w-1/2 space-y-4">
          {/* Name */}
          <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />

          {/* Info lines */}
          <div className="space-y-2">
            <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-5 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-5 w-1/4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Long Description */}
          <div className="space-y-2 mt-4">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Button Skeleton */}
          <div className="mt-6 h-12 w-full bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default PetDetailsSkeleton;
