import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const AdoptionRequest = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch adoption requests using TanStack Query
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["adoptionRequests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/adoptions?ownerEmail=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleStatusUpdate = async (id, status) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `Are you sure?`,
        text: `You are about to ${status} this request.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: status === "accepted" ? "#34B7A7" : "#e11d48",
        confirmButtonText: `Yes, ${status} it!`,
      });

      if (!isConfirmed) return;

      const res = await axiosSecure.patch(`/adoptions/${id}`, { status });

      if (res.data.modifiedCount > 0) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Request ${status} successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        refetch(); // Refresh list
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update adoption status", "error");
      console.error(err);
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading requests...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#34B7A7] mb-6">
        Adoption Requests for Your Pets
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-lg">No adoption requests found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pet</TableHead>
              <TableHead>Adopter Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={req.petImage}
                      alt={req.petName}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span>{req.petName}</span>
                  </div>
                </TableCell>
                <TableCell>{req.adopterName}</TableCell>
                <TableCell>{req.adopterEmail}</TableCell>
                <TableCell>{req.phone}</TableCell>
                <TableCell>{req.address}</TableCell>
                <TableCell>
                  <span
                    className={`capitalize px-2 py-1 rounded text-sm ${
                      req.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status || "pending"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={req.status === "accepted"}
                      onClick={() => handleStatusUpdate(req._id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={req.status === "rejected"}
                      onClick={() => handleStatusUpdate(req._id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdoptionRequest;
