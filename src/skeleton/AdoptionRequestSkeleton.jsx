import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AdoptionRequestSkeleton = () => {
  const skeletonRows = 5; // how many fake rows to show

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-[#34B7A7]">
        Loading Adoption Requests...
      </h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="px-4 py-2">Pet</th>
              <th className="px-4 py-2">Adopter</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(skeletonRows)].map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Skeleton circle height={32} width={32} />
                    <Skeleton width={60} />
                  </div>
                </td>
                <td className="px-4 py-2"><Skeleton width={80} /></td>
                <td className="px-4 py-2"><Skeleton width={120} /></td>
                <td className="px-4 py-2"><Skeleton width={100} /></td>
                <td className="px-4 py-2"><Skeleton width={140} /></td>
                <td className="px-4 py-2"><Skeleton width={70} /></td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Skeleton width={60} height={30} />
                    <Skeleton width={60} height={30} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionRequestSkeleton;
