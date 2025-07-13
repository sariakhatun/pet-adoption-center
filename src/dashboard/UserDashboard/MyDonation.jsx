import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const LIMIT = 5;

const MyDonation = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);

  // Fetch paginated donations
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-donations", user?.email, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-donations?donorEmail=${user?.email}&page=${page}&limit=${LIMIT}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const donations = data?.donations || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / LIMIT);

  // Mutation to delete (refund)
  const refundMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/donations/${id}`),
    onSuccess: () => {
      Swal.fire("Refunded", "Your donation has been refunded", "success");
      queryClient.invalidateQueries(["my-donations", user?.email, page]);
    },
    onError: () => {
      Swal.fire("Error", "Refund failed. Try again.", "error");
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center text-red-600">Error loading donations.</p>;
  if (!donations.length) return <p className="text-center">No donations found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-[#34B7A7] mb-6">
        My Donations (Page {page + 1})
      </h2>

     <table className="w-full border rounded-md overflow-hidden">
  <thead className="bg-gray-100">
    <tr>
      <th className="py-2 px-4 text-left">S/N</th>
      <th className="py-2 px-4 text-left">Pet Image</th>
      <th className="py-2 px-4 text-left">Pet Name</th>
      <th className="py-2 px-4 text-left">Donated Amount</th>
      <th className="py-2 px-4 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    {donations.map((donation, index) => (
      <tr key={donation._id} className="border-t">
        <td className="py-2 px-4 font-semibold">
          {page * LIMIT + index + 1}
        </td>
        <td className="py-2 px-4">
          <img
            src={donation.petImage || "/placeholder.png"}
            alt={donation.petName || "Pet"}
            className="w-16 h-16 object-cover rounded"
          />
        </td>
        <td className="py-2 px-4">{donation.petName || "N/A"}</td>
        <td className="py-2 px-4">
          ৳
          {typeof donation.amount === "number"
            ? donation.amount.toFixed(2)
            : "0.00"}
        </td>
        <td className="py-2 px-4">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              Swal.fire({
                title: "Request Refund?",
                text: "Are you sure you want to refund this donation?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, refund it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  refundMutation.mutate(donation._id);
                }
              });
            }}
            disabled={refundMutation.isLoading}
          >
            {refundMutation.isLoading ? "Processing..." : "Ask for Refund"}
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page + 1 >= pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MyDonation;
