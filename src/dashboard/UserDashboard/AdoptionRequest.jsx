import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import AdoptionRequestSkeleton from "@/skeleton/AdoptionRequestSkeleton";

const AdoptionRequest = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

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
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update adoption status", "error");
      console.error(err);
    }
  };

  if (isLoading)
    return <AdoptionRequestSkeleton></AdoptionRequestSkeleton>

  if (requests.length === 0)
    return (
      <p className="text-gray-500 text-center text-lg">
        No adoption requests found.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#34B7A7] mb-6 text-center sm:text-left">
        Adoption Requests for Your Pets
      </h2>

      {/* TABLE FOR LG+ */}
      <div className="hidden lg:block border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {["Pet", "Adopter Name", "Email", "Phone", "Address", "Status", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="text-left px-6 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req._id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.petImage}
                      alt={req.petName}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <span className="text-base font-medium">{req.petName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-center">
                  {req.adopterName}
                </td>
                <td className="px-6 py-4 max-w-xs break-words text-sm">
                  {req.adopterEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{req.phone}</td>
                <td className="px-6 py-4 max-w-xs truncate text-sm">{req.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`capitalize px-3 py-1 rounded text-sm ${
                      req.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status || "pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD LIST FOR SMALL/MEDIUM SCREENS */}
      <div className="lg:hidden space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={req.petImage}
                alt={req.petName}
                className="w-16 h-16 rounded object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{req.petName}</h3>
                <p className="text-sm text-gray-600">{req.adopterName}</p>
                <p className="text-sm text-gray-600 break-words max-w-xs">
                  {req.adopterEmail}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              <strong>Phone:</strong> {req.phone}
            </p>
            <p className="text-sm text-gray-600 mb-2 truncate max-w-xs">
              <strong>Address:</strong> {req.address}
            </p>

            <span
              className={`capitalize px-2 py-1 rounded text-sm inline-block mb-3 ${
                req.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : req.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {req.status || "pending"}
            </span>

            <div className="flex gap-3 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                disabled={req.status === "accepted"}
                onClick={() => handleStatusUpdate(req._id, "accepted")}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                disabled={req.status === "rejected"}
                onClick={() => handleStatusUpdate(req._id, "rejected")}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionRequest;
