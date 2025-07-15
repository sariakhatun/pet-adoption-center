import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdoptionRequestSkeleton from "@/skeleton/AdoptionRequestSkeleton";

const PAGE_SIZE = 10;

const AllPets = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState(0);
  const [selectedPet, setSelectedPet] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch pets data with pagination
  const { data = { total: 0, pets: [] }, refetch, isLoading, isError } = useQuery({
    queryKey: ["all-pets", pageIndex],
    queryFn: async () => {
      const res = await axiosSecure.get(`/all-pets?page=${pageIndex}&limit=${PAGE_SIZE}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  // Delete selected pet with confirmation
  const handleDelete = async () => {
    if (!selectedPet) return;
    const result = await Swal.fire({
      title: `Delete ${selectedPet.petName}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/pets/${selectedPet._id}`);
        setDialogOpen(false);
        setSelectedPet(null);
        refetch();
        Swal.fire("Deleted!", "Pet has been deleted.", "success");
      } catch (error) {
        console.error("Delete failed", error);
        Swal.fire("Error", "Failed to delete the pet.", "error");
      }
    }
  };

  // Toggle adoption status with confirmation
  const toggleAdoption = async (pet) => {
    const confirmResult = await Swal.fire({
      title: pet.adopted ? "Mark as Not Adopted?" : "Mark as Adopted?",
      text: `Pet: ${pet.petName}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axiosSecure.patch(`/pets/${pet._id}`, {
          adopted: !pet.adopted,
        });
        refetch();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: pet.adopted ? "Marked as Not Adopted." : "Marked as Adopted.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire("Error", "Failed to update pet status.", "error");
      }
    }
  };

  // Define table columns with actions and status
  const columns = useMemo(() => [
    {
      header: "S/N",
      cell: ({ row }) => pageIndex * PAGE_SIZE + row.index + 1,
    },
    {
      header: "Pet Name",
      accessorKey: "petName",
    },
    {
      header: "Category",
      accessorKey: "petCategory",
    },
    {
      header: "Image",
      accessorKey: "petImage",
      cell: ({ getValue }) => (
        <img
          src={getValue()}
          alt="pet"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      header: "Status",
      accessorKey: "adopted",
      cell: ({ row }) =>
        row.original.adopted ? (
          <span className="text-green-600 font-medium">Adopted</span>
        ) : (
          <span className="text-red-600 font-medium">Not Adopted</span>
        ),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const pet = row.original;
        return (
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
            >
              <FaEdit />
            </Button>
            <Dialog
              open={dialogOpen && selectedPet?._id === pet._id}
              onOpenChange={setDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setSelectedPet(pet)}
                >
                  <FaTrash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete{" "}
                    <span className="text-red-600">{pet.petName}</span>?
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
              className={
                pet.adopted ? "bg-red-600 text-white" : "bg-green-600 text-white"
              }
              onClick={() => toggleAdoption(pet)}
            >
              <FaCheck className="mr-1" />
              {pet.adopted ? "Mark Not Adopted" : "Mark Adopted"}
            </Button>
          </div>
        );
      },
    },
  ], [pageIndex, dialogOpen, selectedPet, navigate]);

  // Create react-table instance
  const table = useReactTable({
    data: data.pets || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(data.total / PAGE_SIZE),
  });

  if (isLoading) return <AdoptionRequestSkeleton />;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500 dark:text-red-400">
        Failed to load pets
      </p>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-white dark:bg-gray-900 rounded-md">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#34B7A7] mb-6 text-center sm:text-left">
        All Pets ({data.total})
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded border border-gray-300 dark:border-gray-700">
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 rounded-md">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="border px-4 py-2 text-left text-gray-700 dark:text-gray-300"
                  >
                    {header.isPlaceholder ? null : header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="border px-4 py-2 text-gray-900 dark:text-gray-100"
                  >
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.pets.map((pet, index) => (
          <div
            key={pet._id}
            className="bg-white dark:bg-gray-800 rounded shadow p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#34B7A7]">{pet.petName}</h3>
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {index + 1 + pageIndex * PAGE_SIZE}
              </span>
            </div>
            <img
              src={pet.petImage}
              alt="Pet"
              className="w-full h-40 object-cover rounded"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Category: {pet.petCategory}
            </p>
            <p
              className={`text-sm font-semibold ${
                pet.adopted ? "text-green-600" : "text-red-600"
              }`}
            >
              {pet.adopted ? "Adopted" : "Not Adopted"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
              >
                <FaEdit />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setSelectedPet(pet);
                  setDialogOpen(true);
                }}
              >
                <FaTrash />
              </Button>
              <Button
                size="sm"
                className={pet.adopted ? "bg-red-600 text-white" : "bg-green-600 text-white"}
                onClick={() => toggleAdoption(pet)}
              >
                <FaCheck className="mr-1" />
                {pet.adopted ? "Mark Not Adopted" : "Mark Adopted"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex(p => Math.max(p - 1, 0))}
          >
            Previous
          </Button>
          <span className="self-center text-sm mt-1 text-gray-900 dark:text-gray-100">
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={pageIndex >= table.getPageCount() - 1}
            onClick={() =>
              setPageIndex(p => Math.min(p + 1, table.getPageCount() - 1))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllPets;
