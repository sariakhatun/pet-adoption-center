import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyPets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [selectedPet, setSelectedPet] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const { data: pets = [], refetch } = useQuery({
    queryKey: ["my-pets", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets?email=${user?.email}&all=true`);

      return res.data;
    },
  });

  // Delete handler
  const handleDelete = async () => {
    if (selectedPet) {
      try {
        await axiosSecure.delete(`/pets/${selectedPet._id}`);
        refetch();
        setShowDialog(false);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // Mark adopted handler
  const handleMarkAdopted = async (petId) => {
    try {
      await axiosSecure.patch(`/pets/${petId}`, { adopted: true });
      refetch();
    } catch (error) {
      console.error("Adopt update failed:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "S/N",
        cell: ({ row }) => row.index + 1,
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
        cell: ({ getValue }) =>
          getValue() ? (
            <span className="text-green-600 font-semibold">Adopted</span>
          ) : (
            <span className="text-red-500 font-semibold">Not Adopted</span>
          ),
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const pet = row.original;
          return (
            <div className="flex gap-2">
              {/* Update Button - navigate to update page */}
              <Button
                size="sm"
                variant="outline"
                  className="border-[#34B7A7] text-[#34B7A7] hover:bg-[#34B7A7] hover:text-white transition-colors"

                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
              >
                <FaEdit />
              </Button>

              {/* Delete with modal */}
              <AlertDialog open={showDialog && selectedPet?._id === pet._id}>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedPet(pet);
                      setShowDialog(true);
                    }}
                  >
                    <FaTrash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete{" "}
                      <span className="text-red-500 font-semibold">
                        {selectedPet?.petName}
                      </span>
                      ?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowDialog(false)}>
                      No
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Yes, Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Mark Adopted */}
             {pet.adopted ? (
  <Button
    size="sm"
    disabled
    className="bg-green-600 text-white cursor-not-allowed"
  >
    <FaCheck className="mr-1" />
    Adopted
  </Button>
) : (
  <Button
    size="sm"
    className="border border-green-600 text-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors"
    onClick={() => handleMarkAdopted(pet._id)}
  >
    <FaCheck className="mr-1" />
    Mark Adopted
  </Button>
)}

            </div>
          );
        },
      },
    ],
    [selectedPet, showDialog, navigate]
  );

  const table = useReactTable({
    data: pets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#34B7A7]">
        My Pets ({pets.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border rounded">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? null}
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
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
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
    </div>
  );
};

export default MyPets;
