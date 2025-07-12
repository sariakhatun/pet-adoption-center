import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import {
  AlertDialog as Dialog,
  AlertDialogContent as DialogContent,
  AlertDialogHeader as DialogHeader,
  AlertDialogTitle as DialogTitle,
  AlertDialogDescription as DialogDescription,
  AlertDialogCancel as DialogClose,
} from "@/components/ui/alert-dialog";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [donators, setDonators] = useState([]);

  // Fetch only campaigns of current logged-in user
  const { data: campaigns = [], refetch } = useQuery({
    queryKey: ["my-donations", user?.email],
    enabled: !!user?.email, // fetch only if email exists
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
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          );
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const campaign = row.original;
          return (
            <div className="flex gap-2">
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
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#34B7A7]">
        My Donation Campaigns ({campaigns.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border rounded">
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

      {selectedCampaign && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Donators for {selectedCampaign.petName}</DialogTitle>
              <DialogDescription>
                Here's a list of users who have donated to this campaign.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {donators.length === 0 ? (
                <p className="text-gray-500 text-sm">No donations yet.</p>
              ) : (
                donators.map((donator, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-1 text-sm border-b"
                  >
                    <span>{donator.donorName}</span>
                    <span>৳{donator.amount}</span>
                  </div>
                ))
              )}
            </div>

            <DialogClose asChild>
              <Button variant="outline" className="mt-4">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyDonationCampaigns;
