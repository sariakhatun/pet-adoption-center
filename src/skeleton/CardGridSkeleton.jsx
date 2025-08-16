import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-4 bg-white rounded shadow dark:bg-gray-700">
          <Skeleton height={180} className="rounded" />
          <div className="mt-4">
            <Skeleton height={20} width="80% dark:bg-gray-700" />
            <Skeleton height={16} width="60%" className="mt-2 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGridSkeleton;
