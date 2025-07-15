import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useReactTable, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaTrash, FaEdit, FaPause, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdoptionRequestSkeleton from "@/skeleton/AdoptionRequestSkeleton";

const PAGE_SIZE = 10;

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data = { total: 0, campaigns: [] }, refetch, isLoading, isError } = useQuery({
    queryKey: ["all-donations", pageIndex],
    queryFn: async () => {
      const res = await axiosSecure.get(`/all-donation-campaigns?page=${pageIndex}&limit=${PAGE_SIZE}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const handleDelete = async () => {
    if (!selectedCampaign) return;

    const result = await Swal.fire({
      title: `Delete "${selectedCampaign.petName}" campaign?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/donation-campaigns/${selectedCampaign._id}`);
        setDialogOpen(false);
        setSelectedCampaign(null);
        refetch();
        Swal.fire("Deleted!", "Campaign has been deleted.", "success");
      } catch (error) {
        console.error("Delete failed", error);
        Swal.fire("Error", "Failed to delete the campaign.", "error");
      }
    }
  };

  const togglePause = async (campaign) => {
    const action = campaign.paused ? "Unpause" : "Pause";
    const confirmResult = await Swal.fire({
      title: `${action} campaign?`,
      text: `"${campaign.petName}" will ${
        campaign.paused ? "allow donations again" : "not allow donations while paused"
      }.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axiosSecure.patch(`/donation-campaigns/${campaign._id}`, {
          paused: !campaign.paused,
        });
        refetch();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${action}d campaign.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Pause/unpause failed", error);
        Swal.fire("Error", "Failed to update campaign status.", "error");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "S/N",
        cell: ({ row }) => pageIndex * PAGE_SIZE + row.index + 1,
      },
      {
        header: "Pet Name",
        accessorKey: "petName",
      },
      {
        header: "Max Donation",
        accessorKey: "maxDonationAmount",
        cell: ({ getValue }) => `$${getValue()}`,
      },
      {
        header: "Status",
        accessorKey: "paused",
        cell: ({ getValue }) =>
          getValue() ? (
            <span className="text-red-600 font-semibold">Paused</span>
          ) : (
            <span className="text-green-600 font-semibold">Active</span>
          ),
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const campaign = row.original;
          return (
            <div className="flex gap-2 items-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/dashboard/edit-donation/${campaign._id}`)}
              >
                <FaEdit />
              </Button>

              <Dialog
                open={dialogOpen && selectedCampaign?._id === campaign._id}
                onOpenChange={setDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <FaTrash />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete{" "}
                      <span className="text-red-600">{campaign.petName}</span>?
                    </DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                variant={campaign.paused ? "secondary" : "default"}
                onClick={() => togglePause(campaign)}
                className={campaign.paused ? "bg-yellow-600 text-white" : ""}
              >
                {campaign.paused ? (
                  <>
                    <FaPlay className="mr-1" />
                    Unpause
                  </>
                ) : (
                  <>
                    <FaPause className="mr-1" />
                    Pause
                  </>
                )}
              </Button>
            </div>
          );
        },
      },
    ],
    [pageIndex, dialogOpen, selectedCampaign, navigate]
  );

  const table = useReactTable({
    data: data.campaigns || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(data.total / PAGE_SIZE),
  });

  if (isLoading) return <AdoptionRequestSkeleton></AdoptionRequestSkeleton>
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load campaigns</p>;

 return (
  <div className="p-4 sm:p-6 lg:p-10">
    <h2 className="text-xl sm:text-2xl font-bold text-[#34B7A7] mb-6 text-center sm:text-left">
      All Donation Campaigns ({data.total})
    </h2>

    {/* Table view for tablet and desktop */}
    <div className="hidden md:block overflow-x-auto rounded border">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-4 py-2 text-left">
                  {header.isPlaceholder ? null : header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-4 py-2">
                  {cell.column.columnDef.cell ? cell.column.columnDef.cell(cell) : cell.getValue()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile view (card style) */}
    <div className="md:hidden space-y-4">
      {data.campaigns.map((campaign, index) => (
        <div key={campaign._id} className="bg-white rounded border shadow p-4 space-y-2">
          <div className="flex justify-between">
            <h3 className="font-semibold text-[#34B7A7]">{campaign.petName}</h3>
            <span className="text-gray-500 text-sm">#{index + 1 + pageIndex * PAGE_SIZE}</span>
          </div>
          <p>
            Max Donation:{" "}
            <span className="font-medium">${campaign.maxDonationAmount}</span>
          </p>
          <p className={campaign.paused ? "text-red-600" : "text-green-600"}>
            {campaign.paused ? "Paused" : "Active"}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Edit Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/dashboard/edit-donation/${campaign._id}`)}
            >
              <FaEdit />
            </Button>

            {/* Delete Button */}
            <Dialog open={dialogOpen && selectedCampaign?._id === campaign._id} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <FaTrash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete{" "}
                    <span className="text-red-600">{campaign.petName}</span>?
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Pause/Unpause Button */}
            <Button
              size="sm"
              variant={campaign.paused ? "secondary" : "default"}
              className={campaign.paused ? "bg-yellow-600 text-white" : ""}
              onClick={() => togglePause(campaign)}
            >
              {campaign.paused ? (
                <>
                  <FaPlay className="mr-1" />
                  Unpause
                </>
              ) : (
                <>
                  <FaPause className="mr-1" />
                  Pause
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination */}
    {table.getPageCount() > 1 && (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <Button
          size="sm"
          variant="outline"
          disabled={pageIndex === 0}
          onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
        >
          Previous
        </Button>
        <span className="self-center text-sm mt-1">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={pageIndex >= table.getPageCount() - 1}
          onClick={() => setPageIndex((p) => Math.min(p + 1, table.getPageCount() - 1))}
        >
          Next
        </Button>
      </div>
    )}
  </div>
);

};

export default AllDonations;
