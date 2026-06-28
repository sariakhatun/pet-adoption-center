import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const statusStyles = {
  accepted: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400",
};

const LIMIT = 5;

const MyAdoptionRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["myAdoptions", user?.email, page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-adoptions?page=${page}&limit=${LIMIT}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const adoptions = data?.adoptions ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  // Cancel mutation
  const { mutate: cancelRequest, isPending: cancelling } = useMutation({
    mutationFn: async (adoptionId) => {
      const res = await axiosSecure.delete(`/adoptions/${adoptionId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAdoptions"] });
      queryClient.invalidateQueries({ queryKey: ["adoptionCheck"] });
      Swal.fire({
        icon: "success",
        title: "Cancelled!",
        text: "Your adoption request has been cancelled.",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (err) => {
      Swal.fire("Error", err?.response?.data?.error || "Failed to cancel request.", "error");
    },
  });

  const handleCancel = async (adoptionId) => {
    const { isConfirmed } = await Swal.fire({
      title: "Cancel Request?",
      text: "Are you sure you want to cancel this adoption request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (!isConfirmed) return;
    cancelRequest(adoptionId);
  };

  if (isLoading)
    return <p className="text-center text-gray-500 mt-10">Loading your requests...</p>;

  if (total === 0)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-10">
        You haven't made any adoption requests yet.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#34B7A7] mb-6 text-center sm:text-left">
        My Adoption Requests
      </h2>

      {/* TABLE — lg+ screens */}
      <div className="hidden lg:block border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {["Pet", "Category", "Age", "Owner Email", "My Phone", "My Address", "Status", "Action"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adoptions.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img src={req.petImage} alt={req.petName} className="w-12 h-12 rounded object-cover" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{req.petName}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">{req.petCategory}</td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{req.petAge}</td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 break-words max-w-[180px]">{req.ownerEmail}</td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{req.phone}</td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-[160px] truncate">{req.address}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`capitalize px-3 py-1 rounded text-sm font-medium ${statusStyles[req.status] ?? statusStyles.pending}`}>
                    {req.status || "pending"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={req.status === "accepted" || cancelling}
                    onClick={() => handleCancel(req._id)}
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS — small/medium screens */}
      <div className="lg:hidden space-y-4">
        {adoptions.map((req) => (
          <div key={req._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
            <div className="flex items-center gap-4 mb-3">
              <img src={req.petImage} alt={req.petName} className="w-16 h-16 rounded object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{req.petName}</h3>
                <p className="text-sm text-gray-500 capitalize">{req.petCategory} · {req.petAge}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Owner:</strong> {req.ownerEmail}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>My Phone:</strong> {req.phone}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate"><strong>My Address:</strong> {req.address}</p>

            <div className="flex items-center justify-between mt-2">
              <span className={`capitalize px-3 py-1 rounded text-sm font-medium inline-block ${statusStyles[req.status] ?? statusStyles.pending}`}>
                {req.status || "pending"}
              </span>
              <Button
                size="sm"
                variant="destructive"
                disabled={req.status === "accepted" || cancelling}
                onClick={() => handleCancel(req._id)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i ? "default" : "outline"}
              className={page === i ? "bg-[#34B7A7] text-white hover:bg-[#2a9d8f]" : ""}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
        Showing page {page + 1} of {totalPages} · {total} total requests
      </p>
    </div>
  );
};

export default MyAdoptionRequests;