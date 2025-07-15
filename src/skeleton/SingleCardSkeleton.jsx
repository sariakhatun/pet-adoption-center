import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardGridSkeleton = ({ count = 6 }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label="Loading content"
    >
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="p-4 bg-white dark:bg-gray-800 rounded shadow dark:shadow-md"
          role="status"
          aria-live="polite"
        >
          <Skeleton
            height={180}
            className="rounded"
            baseColor={window.matchMedia('(prefers-color-scheme: dark)').matches ? "#2d3748" : "#e2e8f0"}
            highlightColor={window.matchMedia('(prefers-color-scheme: dark)').matches ? "#4a5568" : "#f0f4f8"}
          />
          <div className="mt-4">
            <Skeleton
              height={20}
              width="80%"
              baseColor={window.matchMedia('(prefers-color-scheme: dark)').matches ? "#2d3748" : "#e2e8f0"}
              highlightColor={window.matchMedia('(prefers-color-scheme: dark)').matches ? "#4a5568" : "#f0f4f8"}
            />
            <Skeleton
              height={16}
              width="60%"
              className="mt-2"
              baseColor={window.matchMedia('(prefers-color-scheme: dark)').matches ? "#2d3748" : "#e2e8f0"}
              highlightColor={window.matchMedia('(prefers-color-scheme: dark)').matches ? "#4a5568" : "#f0f4f8"}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGridSkeleton;
