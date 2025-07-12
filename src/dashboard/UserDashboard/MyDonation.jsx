import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const MyDonation = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: donations = [], isLoading, error } = useQuery(
    ["my-donations", user?.email],
    async () => {
      const res = await axiosSecure.get(`/my-donations?donorEmail=${user?.email}`);
      return res.data;
    },
    {
      enabled: !!user?.email,
    }
  );

  const refundMutation = useMutation(
    async (donationId) => {
      return axiosSecure.delete(`/donations/${donationId}`);
    },
    {
      onSuccess: () => {
        Swal.fire("Refund Requested", "Your donation has been refunded.", "success");
        queryClient.invalidateQueries(["my-donations", user?.email]);
      },
      onError: (err) => {
        Swal.fire("Error", err?.response?.data?.error || "Refund failed", "error");
      },
    }
  );

  if (isLoading) return <p className="text-center">Loading your donations...</p>;
  if (error) return <p className="text-center text-red-600">Failed to load donations</p>;
  if (!donations.length) return <p className="text-center">You have not made any donations yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-[#34B7A7] mb-6">My Donations</h2>
      <table className="w-full border rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Pet Image</th>
            <th className="py-2 px-4 text-left">Pet Name</th>
            <th className="py-2 px-4 text-left">Donated Amount</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id} className="border-t">
              <td className="py-2 px-4">
                <img
                  src={donation.petImage || "/placeholder.png"}
                  alt={donation.petName || "Pet"}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="py-2 px-4">{donation.petName || "N/A"}</td>
              <td className="py-2 px-4">৳{donation.amount.toFixed(2)}</td>
              <td className="py-2 px-4">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    Swal.fire({
                      title: "Request Refund?",
                      text: "Are you sure you want to refund this donation? This action cannot be undone.",
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
    </div>
  );
};

export default MyDonation;
