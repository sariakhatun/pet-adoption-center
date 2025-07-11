import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import {
  AlertDialog as Dialog,
  AlertDialogTrigger as DialogTrigger,
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

  const { data: campaigns = [], refetch } = useQuery({
    queryKey: ["my-donations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-campaigns?email=${user?.email}`
      );
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
              {/* Pause / Resume */}
              <Button
                variant={campaign.paused ? "secondary" : "destructive"}
                size="sm"
                onClick={() => handlePauseToggle(campaign._id, campaign.paused)}
              >
                {campaign.paused ? "Resume" : "Pause"}
              </Button>

              {/* Edit */}
              <Button
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() =>
                  navigate(`/dashboard/edit-donation/${campaign._id}`)
                }
              >
                Edit
              </Button>

              {/* View Donators */}
              <Button
                size="sm"
                variant="outline"
                className='bg-[#34B7A7] text-white'
                onClick={() => {
                  setSelectedCampaign(campaign);
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

      {/* ✅ View Donators Dialog (Outside Table) */}
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
              {(selectedCampaign?.donators || []).length === 0 ? (
                <p className="text-gray-500 text-sm">No donations yet.</p>
              ) : (
                selectedCampaign.donators.map((donator, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-1 text-sm border-b"
                  >
                    <span>{donator.name}</span>
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
