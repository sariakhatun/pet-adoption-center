import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import AdoptionRequestSkeleton from "@/skeleton/AdoptionRequestSkeleton";
import jsPDF from "jspdf";

const LIMIT = 5;

const AdoptionRequest = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["adoptionRequests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/adoptions?ownerEmail=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Client-side pagination
  const totalPages = Math.ceil(requests.length / LIMIT);
  const paginatedRequests = requests.slice(page * LIMIT, page * LIMIT + LIMIT);

  const handleStatusUpdate = async (id, status) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to ${status} this request.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: status === "accepted" ? "#34B7A7" : "#e11d48",
        confirmButtonText: `Yes, ${status} it!`,
      });

      if (!isConfirmed) return;

      const res = await axiosSecure.patch(`/adoptions/${id}`, { status });

      if (res?.data?.message) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire("Warning", "Status updated, but response format is unexpected.", "warning");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err?.response?.data?.error || "Failed to update adoption status", "error");
    }
  };

  const handleDownloadAllAccepted = () => {
    const acceptedRequests = requests.filter((req) => req.status === "accepted");

    if (acceptedRequests.length === 0) {
      Swal.fire("No Data", "No accepted adoption requests found.", "info");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(52, 183, 167);
    doc.text("PetNect - All Accepted Adoptions", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString("en-BD")}`, 14, 28);
    doc.text(`Total Accepted: ${acceptedRequests.length}`, 14, 34);

    let y = 44;

    acceptedRequests.forEach((req, index) => {
      if (y > 250) { doc.addPage(); y = 20; }

      doc.setFontSize(12);
      doc.setTextColor(52, 183, 167);
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${req.petName} — ${req.adopterName}`, 14, y);
      y += 8;

      doc.setDrawColor(52, 183, 167);
      doc.line(14, y, 196, y);
      y += 6;

      const lines = [
        ["Adopter Name", req.adopterName],
        ["Adopter Email", req.adopterEmail],
        ["Phone", req.phone],
        ["Address", req.address],
        ["NID", req.nid || "N/A"],
        ["Occupation", req.occupation || "N/A"],
        ["House Type", req.houseType || "N/A"],
        ["Has Garden", req.hasGarden || "N/A"],
        ["Has Other Pets", req.hasOtherPets || "N/A"],
        ["Experience", req.experience || "N/A"],
        ["Reason", req.reason || "N/A"],
        ["Requested At", new Date(req.requestedAt).toLocaleString("en-BD")],
      ];

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      lines.forEach(([label, value]) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont(undefined, "bold");
        doc.text(`${label}:`, 14, y);
        doc.setFont(undefined, "normal");
        const wrapped = doc.splitTextToSize(String(value), 120);
        doc.text(wrapped, 65, y);
        y += wrapped.length > 1 ? wrapped.length * 6 : 8;
      });

      y += 8;
    });

    doc.save(`PetNect_Accepted_Adoptions_${new Date().toLocaleDateString("en-BD")}.pdf`);
  };

  if (isLoading) return <AdoptionRequestSkeleton />;

  if (requests.length === 0)
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center text-lg">
        No adoption requests found.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#34B7A7] text-center sm:text-left">
          Adoption Requests for Your Pets
        </h2>
        <Button
          onClick={handleDownloadAllAccepted}
          className="bg-[#34B7A7] hover:bg-[#2a9d8f] text-white"
          disabled={!requests.some((r) => r.status === "accepted")}
        >
          Download All Accepted (PDF)
        </Button>
      </div>

      {/* TABLE FOR LG+ */}
      <div className="hidden lg:block border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
        <table className="w-full min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {["Pet", "Adopter Name", "Email", "Phone", "Address", "Status", "Actions"].map((header) => (
                <th key={header} className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img src={req.petImage} alt={req.petName} className="w-12 h-12 rounded object-cover" />
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">{req.petName}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-base text-center text-gray-900 dark:text-gray-100">{req.adopterName}</td>
                <td className="px-3 py-4 max-w-xs break-words text-sm text-gray-700 dark:text-gray-300">{req.adopterEmail}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{req.phone}</td>
                <td className="px-3 py-4 max-w-xs truncate text-sm text-gray-700 dark:text-gray-300">{req.address}</td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className={`capitalize px-3 py-1 rounded text-sm ${
                    req.status === "accepted" ? "bg-green-100 text-[#34B7A7]"
                    : req.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400"
                  }`}>
                    {req.status || "pending"}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={req.status === "accepted"} onClick={() => handleStatusUpdate(req._id, "accepted")}>
                      Accept
                    </Button>
                    <Button size="sm" variant="destructive" disabled={req.status === "rejected"} onClick={() => handleStatusUpdate(req._id, "rejected")}>
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
        {paginatedRequests.map((req) => (
          <div key={req._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
            <div className="flex items-center gap-4 mb-2">
              <img src={req.petImage} alt={req.petName} className="w-16 h-16 rounded object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{req.petName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{req.adopterName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-words max-w-xs">{req.adopterEmail}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Phone:</strong> {req.phone}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate max-w-xs"><strong>Address:</strong> {req.address}</p>
            <span className={`capitalize px-2 py-1 rounded text-sm inline-block mb-3 ${
              req.status === "accepted" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"
              : req.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400"
            }`}>
              {req.status || "pending"}
            </span>
            <div className="flex gap-3 flex-wrap">
              <Button size="sm" variant="outline" className="flex-1" disabled={req.status === "accepted"} onClick={() => handleStatusUpdate(req._id, "accepted")}>
                Accept
              </Button>
              <Button size="sm" variant="destructive" className="flex-1" disabled={req.status === "rejected"} onClick={() => handleStatusUpdate(req._id, "rejected")}>
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i ? "default" : "outline"}
              className={page === i ? "bg-[#34B7A7] text-white hover:bg-[#2a9d8f]" : ""}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
            Next
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
        Showing page {page + 1} of {totalPages} · {requests.length} total requests
      </p>
    </div>
  );
};

export default AdoptionRequest;