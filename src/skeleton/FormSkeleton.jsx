import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FormSkeleton = ({ fields = 5 }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      {/* Page Title */}
      <Skeleton height={32} width="60%" />

      {/* Form Fields */}
      {[...Array(fields)].map((_, i) => (
        <div key={i}>
          <Skeleton height={16} width="30%" className="mb-2" /> {/* Label */}
          <Skeleton height={40} /> {/* Input */}
        </div>
      ))}

      {/* Submit Button */}
      <div className="pt-4">
        <Skeleton height={40} width="30%" />
      </div>
    </div>
  );
};

export default FormSkeleton;
