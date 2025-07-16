import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SingleCardSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 items-center">
        {/* Left: Pet Image */}
        <div className="md:w-1/2 w-full flex justify-center items-start">
          <Skeleton className="w-full h-[450px] lg:h-[650px] rounded-lg" />
        </div>

        {/* Right: Pet Info */}
        <div className="md:w-1/2 w-full space-y-4">
          <Skeleton className="h-10 w-2/3" /> {/* Pet name */}
          <Skeleton className="h-6 w-1/3" /> {/* Age */}
          <Skeleton className="h-6 w-1/2" /> {/* Location */}
          <Skeleton className="h-6 w-1/3" /> {/* Category */}
          <Skeleton className="h-6 w-full" /> {/* Short Description */}
          <Skeleton className="h-6 w-1/4" /> {/* Status */}
          <Skeleton className="h-5 w-2/3" /> {/* Uploader */}
          <Skeleton className="h-5 w-1/2" /> {/* Created At */}
          <Skeleton className="h-24 w-full rounded" /> {/* Long Description */}

          {/* Adopt Button */}
          <Skeleton className="h-10 w-full md:w-1/2 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SingleCardSkeleton;
