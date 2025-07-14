import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

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
    return <p className="text-center py-10">Loading requests...</p>;

  if (requests.length === 0)
    return (
      <p className="text-gray-500 text-center text-lg">
        No adoption requests found.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#34B7A7] mb-6 text-center sm:text-left">
        Adoption Requests for Your Pets
      </h2>

      {/* TABLE VIEW FOR LARGE SCREENS */}
      <div className="hidden lg:block overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Pet
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Adopter Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.petImage}
                      alt={req.petName}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-sm font-medium">{req.petName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{req.adopterName}</td>
                <td className="px-4 py-3 break-words max-w-xs">{req.adopterEmail}</td>
                <td className="px-4 py-3">{req.phone}</td>
                <td className="px-4 py-3 max-w-xs truncate">{req.address}</td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD LIST VIEW FOR MOBILE & TABLET */}
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
