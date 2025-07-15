import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import AdoptionRequestSkeleton from "@/skeleton/AdoptionRequestSkeleton";

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [donators, setDonators] = useState([]);

  const { data: campaigns = [], isLoading, error, refetch } = useQuery({
    queryKey: ["my-donations", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-donations-campaign?email=${user.email}`);
      return res.data;
    },
  });

  const handlePauseToggle = async (id, paused) => {
    try {
      await axiosSecure.patch(`/donation-campaigns/${id}`, { paused: !paused });
      refetch();
    } catch (err) {
      console.error("Pause toggle failed:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Pet Name",
        accessorKey: "petName",
      },
      {
        header: "Max Amount",
        accessorKey: "maxDonationAmount",
        cell: ({ getValue }) => `৳${getValue()}`,
      },
      {
        header: "Progress",
        accessorKey: "donatedAmount",
        cell: ({ row }) => {
          const donated = row.original.donatedAmount || 0;
          const max = row.original.maxDonationAmount || 1;
          const percentage = Math.min((donated / max) * 100, 100);
          return (
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          );
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const campaign = row.original;
          return (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={campaign.paused ? "secondary" : "destructive"}
                size="sm"
                onClick={() => handlePauseToggle(campaign._id, campaign.paused)}
              >
                {campaign.paused ? "Resume" : "Pause"}
              </Button>
              <Button
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => navigate(`/dashboard/edit-donation/${campaign._id}`)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-[#34B7A7] text-white"
                onClick={async () => {
                  setSelectedCampaign(campaign);
                  try {
                    const res = await axiosSecure.get(
                      `/donation-campaigns/${campaign._id}/donators`
                    );
                    setDonators(res.data || []);
                  } catch (err) {
                    console.error("Failed to fetch donators:", err);
                    setDonators([]);
                  }
                  setDialogOpen(true);
                }}
              >
                View Donators
              </Button>
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: campaigns,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  if (isLoading) return <AdoptionRequestSkeleton></AdoptionRequestSkeleton>
  if (error) return <p className="text-center text-red-500">Failed to load campaigns.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-[#34B7A7] text-center md:text-left">
        My Donation Campaigns ({campaigns.length})
      </h2>

      {/* Table view for md and above */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto border rounded-md">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {cell.column.columnDef.cell
                      ? cell.column.columnDef.cell(cell)
                      : cell.getValue()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {campaigns.map((campaign) => {
          const donated = campaign.donatedAmount || 0;
          const max = campaign.maxDonationAmount || 1;
          const percentage = Math.min((donated / max) * 100, 100);

          return (
            <div
              key={campaign._id}
              className="border rounded-lg p-4 shadow-sm space-y-2"
            >
              <div>
                <p className="font-bold text-lg">{campaign.petName}</p>
                <p className="text-sm text-gray-600">
                  Max Donation: ৳{campaign.maxDonationAmount}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={campaign.paused ? "secondary" : "destructive"}
                  onClick={() => handlePauseToggle(campaign._id, campaign.paused)}
                >
                  {campaign.paused ? "Resume" : "Pause"}
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => navigate(`/dashboard/edit-donation/${campaign._id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-[#34B7A7] text-white"
                  onClick={async () => {
                    setSelectedCampaign(campaign);
                    try {
                      const res = await axiosSecure.get(
                        `/donation-campaigns/${campaign._id}/donators`
                      );
                      setDonators(res.data || []);
                    } catch (err) {
                      console.error("Failed to fetch donators:", err);
                      setDonators([]);
                    }
                    setDialogOpen(true);
                  }}
                >
                  View Donators
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}

      {/* Donators Dialog */}
      {selectedCampaign && (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Donators for {selectedCampaign.petName}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Here's a list of users who have donated to this campaign.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 max-h-60 overflow-y-auto mt-2">
              {donators.length === 0 ? (
                <p className="text-sm text-gray-500">No donations yet.</p>
              ) : (
                donators.map((donator, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm border-b py-1"
                  >
                    <span>{donator.donorName}</span>
                    <span>৳{donator.amount}</span>
                  </div>
                ))
              )}
            </div>
            <AlertDialogCancel className="mt-4">Close</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default MyDonationCampaigns;
