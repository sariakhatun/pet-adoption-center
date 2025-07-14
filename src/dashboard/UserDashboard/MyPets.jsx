import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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

const PAGE_SIZE = 10;

const MyPets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState(0);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const { data = { total: 0, pets: [] }, refetch, isLoading, isError } = useQuery({
    queryKey: ["my-pets", user?.email, pageIndex],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-pets?page=${pageIndex}&limit=${PAGE_SIZE}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDelete = async () => {
    if (selectedPet) {
      try {
        await axiosSecure.delete(`/pets/${selectedPet._id}`);
        setShowDialog(false);
        setSelectedPet(null);
        refetch();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

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
          <img src={getValue()} alt="pet" className="w-16 h-16 object-cover rounded" />
        ),
      },
      {
        header: "Status",
        accessorKey: "adopted",
        cell: ({ getValue }) =>
          getValue ? (
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
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-[#34B7A7] text-[#34B7A7] hover:bg-[#34B7A7] hover:text-white transition-colors"
                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
              >
                <FaEdit />
              </Button>

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
                      <span className="text-red-500 font-semibold">{selectedPet?.petName}</span>?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowDialog(false)}>No</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Yes, Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
    [pageIndex, selectedPet, showDialog, navigate]
  );

  const table = useReactTable({
    data: data?.pets || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.total || 0) / PAGE_SIZE),
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError) return <p className="text-center mt-10 text-red-600">Failed to load pets</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#34B7A7] text-center sm:text-left">
        My Pets ({data?.total || 0})
      </h2>

      {/* Table for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto border rounded text-sm sm:text-base">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left whitespace-nowrap cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : header.column.columnDef.header}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
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

      {/* Card/List for mobile */}
      <div className="md:hidden space-y-4">
        {data.pets.map((pet, idx) => (
          <div
            key={pet._id}
            className="border rounded-lg p-4 shadow-sm space-y-2 bg-white"
          >
            <div className="flex items-center space-x-4">
              <img
                src={pet.petImage}
                alt={pet.petName}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{pet.petName}</h3>
                <p className="text-sm text-gray-600">Category: {pet.petCategory}</p>
                <p className={pet.adopted ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                  {pet.adopted ? "Adopted" : "Not Adopted"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                className="border-[#34B7A7] text-[#34B7A7] hover:bg-[#34B7A7] hover:text-white transition-colors"
                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
              >
                <FaEdit />
              </Button>

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
                      <span className="text-red-500 font-semibold">{selectedPet?.petName}</span>?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowDialog(false)}>No</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Yes, Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {pet.adopted ? (
                <Button size="sm" disabled className="bg-green-600 text-white cursor-not-allowed">
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
          </div>
        ))}
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 text-sm sm:text-base">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <span>
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setPageIndex((old) => Math.min(old + 1, table.getPageCount() - 1))
            }
            disabled={pageIndex >= table.getPageCount() - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyPets;
