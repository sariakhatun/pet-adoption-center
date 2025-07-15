import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SingleCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm p-4 bg-white shadow-md rounded-lg">
      {/* Image placeholder */}
      <Skeleton height={200} className="rounded-md" />

      {/* Title */}
      <div className="mt-4">
        <Skeleton height={20} width="60%" />
      </div>

      {/* Description */}
      <div className="mt-2">
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="85%" className="mt-1" />
      </div>

      {/* Tags or metadata */}
      <div className="mt-3 flex gap-2">
        <Skeleton height={20} width={60} />
        <Skeleton height={20} width={50} />
      </div>

      {/* Button */}
      <div className="mt-4">
        <Skeleton height={36} width="40%" />
      </div>
    </div>
  );
};

export default SingleCardSkeleton;
