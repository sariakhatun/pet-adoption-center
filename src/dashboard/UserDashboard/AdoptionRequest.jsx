import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Swal from "sweetalert2";
import AdoptionRequestSkeleton from "@/skeleton/AdoptionRequestSkeleton";
import jsPDF from "jspdf";

const LIMIT = 5;

const toBase64 = (url) =>
  new Promise((resolve) => {
    if (!url) return resolve(null);
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = () => resolve(null);
    img.src = proxyUrl;
  });

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

  const totalPages = Math.ceil(requests.length / LIMIT);
  const paginatedRequests = requests.slice(page * LIMIT, page * LIMIT + LIMIT);

  // ── Generates a 2-page PDF for a SINGLE accepted adoption request. ──
  // Page 1: pet + adopter info (everything except the NID images).
  // Page 2: just the NID Front and NID Back images.
  const generateSingleRequestPDF = async (req) => {
    let adopterPhoto = null;
    try {
      const photosRes = await axiosSecure.post("/users/photos-by-emails", {
        emails: [req.adopterEmail],
      });
      const match = photosRes.data?.find((u) => u.email === req.adopterEmail);
      adopterPhoto = match?.photoURL || null;
    } catch (err) {
      console.error("Failed to fetch adopter photo:", err);
    }

    const doc = new jsPDF();
    const leftX = 14;
    const rightX = 118;
    const photoW = 40;
    const photoH = 40;

    const [userPhoto] = await Promise.all([
      adopterPhoto ? toBase64(adopterPhoto) : Promise.resolve(null),
    ]);

    // ── PAGE 1: Pet + Adopter info ──
    doc.setFontSize(18);
    doc.setTextColor(52, 183, 167);
    doc.text("PetNect - Adoption Request Details", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString("en-BD")}`, 14, 28);

    doc.setFontSize(14);
    doc.setTextColor(52, 183, 167);
    doc.setFont(undefined, "bold");
    doc.text("Pet Name:", 14, 42);
    doc.setTextColor(30, 30, 30);
    doc.text(req.petName, 50, 42);

    // Photo, centered horizontally on the page (A4 width = 210mm).
    const photoX = (210 - photoW) / 2;
    const photoRowY = 50;

    if (userPhoto) {
      doc.addImage(userPhoto, "JPEG", photoX, photoRowY, photoW, photoH);
    } else {
      doc.setFillColor(200, 200, 200);
      doc.rect(photoX, photoRowY, photoW, photoH, "F");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont(undefined, "normal");
      doc.text("No Photo", photoX + 4, photoRowY + photoH / 2);
    }

    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.setFont(undefined, "bold");
    const nameWrapped = doc.splitTextToSize(req.adopterName, photoW + 10);
    const nameY = photoRowY + photoH + 7;
    // Center each wrapped line under the photo.
    const nameTextWidth = Math.max(...nameWrapped.map((l) => doc.getTextWidth(l)));
    doc.text(nameWrapped, photoX + photoW / 2 - nameTextWidth / 2, nameY);

    // Divider line goes BELOW whichever is taller: the photo+name block on the
    // right, or the title text on the left — so it never cuts through the photo.
    const photoBlockBottom = nameY + (nameWrapped.length - 1) * 5 + 4;
    let y = Math.max(48, photoBlockBottom);
    doc.setDrawColor(52, 183, 167);
    doc.line(14, y, 196, y);
    y += 10;

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
      ["Requested At", req.requestedAt ? new Date(req.requestedAt).toLocaleString("en-BD") : "N/A"],
    ];

    doc.setFontSize(10);
    // Full page width is available here since NID images live on page 2 —
    // no right-side column to avoid, so text can wrap much wider.
    const textWrapWidth = 196 - (leftX + 38);

    lines.forEach(([label, value]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont(undefined, "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`${label}:`, leftX, y);
      doc.setFont(undefined, "normal");
      const wrapped = doc.splitTextToSize(String(value), textWrapWidth);
      doc.text(wrapped, leftX + 38, y);
      y += wrapped.length > 1 ? wrapped.length * 6 : 8;
    });

    // ── PAGE 2: NID Front + NID Back only ──
    doc.addPage();

    doc.setFontSize(16);
    doc.setTextColor(52, 183, 167);
    doc.setFont(undefined, "bold");
    doc.text("National ID (NID)", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, "normal");
    doc.text(`${req.adopterName} - ${req.petName}`, 14, 28);

    const [nidFront, nidBack] = await Promise.all([
      req.nidFrontImage ? toBase64(req.nidFrontImage) : Promise.resolve(null),
      req.nidBackImage ? toBase64(req.nidBackImage) : Promise.resolve(null),
    ]);

    const nidW = 180;
    const nidH = 108; // keeps a standard ID-card-ish aspect ratio, scaled up to fill the page width
    const nidX = (210 - nidW) / 2; // horizontally centered on A4 (210mm wide)

    let nidY = 42;

    if (nidFront) {
      doc.addImage(nidFront, "JPEG", nidX, nidY, nidW, nidH);
    } else {
      doc.setFillColor(230, 230, 230);
      doc.rect(nidX, nidY, nidW, nidH, "F");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("NID Front N/A", nidX + nidW / 2 - 18, nidY + nidH / 2);
    }
    doc.setFontSize(9);
    doc.setTextColor(52, 183, 167);
    doc.text("NID Front", nidX + nidW / 2 - 10, nidY + nidH + 7);

    nidY = nidY + nidH + 20;

    if (nidBack) {
      doc.addImage(nidBack, "JPEG", nidX, nidY, nidW, nidH);
    } else {
      doc.setFillColor(230, 230, 230);
      doc.rect(nidX, nidY, nidW, nidH, "F");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("NID Back N/A", nidX + nidW / 2 - 18, nidY + nidH / 2);
    }
    doc.setFontSize(9);
    doc.setTextColor(52, 183, 167);
    doc.text("NID Back", nidX + nidW / 2 - 9, nidY + nidH + 7);

    doc.save(`PetNect_${req.petName}_${req.adopterName}.pdf`.replace(/\s+/g, "_"));
  };

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

  // Download the 2-page PDF for a single accepted request. Shown as a
  // dedicated icon button in the Actions column, only enabled once accepted.
  const handleSingleDownload = async (req) => {
    try {
      await generateSingleRequestPDF(req);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to generate the PDF.", "error");
    }
  };

  const handleDownloadAllAccepted = async () => {
    const acceptedRequests = requests.filter((req) => req.status === "accepted");

    if (acceptedRequests.length === 0) {
      Swal.fire("No Data", "No accepted adoption requests found.", "info");
      return;
    }

    const emails = acceptedRequests.map((r) => r.adopterEmail);
    const photosRes = await axiosSecure.post("/users/photos-by-emails", { emails });
    const photoMap = {};
    photosRes.data.forEach((u) => { photoMap[u.email] = u.photoURL; });

    const enriched = acceptedRequests.map((r) => ({
      ...r,
      adopterPhoto: photoMap[r.adopterEmail] || null,
    }));

    const doc = new jsPDF();
    const PAGE_BOTTOM = 280; // safe bottom margin for A4 (page height ~297)

    doc.setFontSize(18);
    doc.setTextColor(52, 183, 167);
    doc.text("PetNect - All Accepted Adoptions", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString("en-BD")}`, 14, 28);
    doc.text(`Total Accepted: ${enriched.length}`, 14, 34);

    let y = 44;

    for (let index = 0; index < enriched.length; index++) {
      const req = enriched[index];

      const leftX = 14;
      const rightX = 118;
      const imgW = 75;
      const imgH = 45;
      const photoW = 36;
      const photoH = 36;

      // ── Pre-calculate the FULL height this entry needs (header + photo+name
      // row + divider + max(left info column, right NID column)) BEFORE drawing
      // anything, so we never split a row across the photo/NID/description
      // blocks. If it doesn't fit, start a fresh page first. ──
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

      doc.setFontSize(9);
      const textWrapWidth = rightX - (leftX + 36) - 4; // stop text before the NID column starts, with a small gap
      let leftColHeight = 0;
      lines.forEach(([, value]) => {
        const wrapped = doc.splitTextToSize(String(value), textWrapWidth);
        leftColHeight += wrapped.length > 1 ? wrapped.length * 6 : 7;
      });

      const nameWrappedEstimate = doc.splitTextToSize(req.adopterName, photoW + 20);
      const photoPullUp = 22; // photo top is pulled up this much above titleY — increase this to move photo further up
      const photoNameRowHeight = photoPullUp + photoH + 6 + nameWrappedEstimate.length * 5 + 4;
      const rightColHeight = imgH + 5 + 10 + imgH + 5; // NID front + label + gap + NID back + label
      const bodyHeight = Math.max(leftColHeight, rightColHeight);
      const headerRowHeight = photoNameRowHeight + 8; // photo/name row + divider gap
      const entryHeight = 4 + photoPullUp + headerRowHeight + bodyHeight + 16; // extra buffer so this entry's photo (pulled up) never touches the previous entry's bottom

      if (y + entryHeight > PAGE_BOTTOM) {
        doc.addPage();
        y = 20;
      }

      // ── Section header ──
      doc.setFontSize(12);
      doc.setTextColor(52, 183, 167);
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${req.petName}`, 14, y);
      const titleY = y;

      const [userPhoto, nidFront, nidBack] = await Promise.all([
        req.adopterPhoto ? toBase64(req.adopterPhoto) : Promise.resolve(null),
        req.nidFrontImage ? toBase64(req.nidFrontImage) : Promise.resolve(null),
        req.nidBackImage ? toBase64(req.nidBackImage) : Promise.resolve(null),
      ]);

      const photoX = rightX + imgW - photoW; // right-align with NID image column
      const photoRowY = titleY - photoPullUp;

      if (userPhoto) {
        doc.addImage(userPhoto, "JPEG", photoX, photoRowY, photoW, photoH);
      } else {
        doc.setFillColor(200, 200, 200);
        doc.rect(photoX, photoRowY, photoW, photoH, "F");
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.setFont(undefined, "normal");
        doc.text("No Photo", photoX + 4, photoRowY + photoH / 2);
      }

      // Name as plain text right under the photo — no box, no border.
      const nameY = photoRowY + photoH + 6;
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      doc.setFont(undefined, "bold");
      const nameWrapped = doc.splitTextToSize(req.adopterName, photoW + 20);
      doc.text(nameWrapped, photoX, nameY);

      // y continues from below the title text (left column flow), while the
      // photo block on the right is independently positioned above and may
      // extend lower than the title — the divider line uses whichever is lower.
      const photoBlockBottom = nameY + nameWrapped.length * 5 + 4;
      y = Math.max(titleY + 6, photoBlockBottom);

      // ── Divider line (drawn only under the photo/name row, full width) ──
      doc.setDrawColor(52, 183, 167);
      doc.line(14, y, 196, y);
      y += 8;

      const startY = y;

      // ── Right side: NID Front ──
      if (nidFront) {
        doc.addImage(nidFront, "JPEG", rightX, y, imgW, imgH);
      } else {
        doc.setFillColor(230, 230, 230);
        doc.rect(rightX, y, imgW, imgH, "F");
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.setFont(undefined, "normal");
        doc.text("NID Front N/A", rightX + 18, y + imgH / 2);
      }
      doc.setFontSize(7);
      doc.setTextColor(52, 183, 167);
      doc.setFont(undefined, "normal");
      doc.text("NID Front", rightX + 26, y + imgH + 5);

      // ── Right side: NID Back ──
      const nidBackY = y + imgH + 10;
      if (nidBack) {
        doc.addImage(nidBack, "JPEG", rightX, nidBackY, imgW, imgH);
      } else {
        doc.setFillColor(230, 230, 230);
        doc.rect(rightX, nidBackY, imgW, imgH, "F");
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.setFont(undefined, "normal");
        doc.text("NID Back N/A", rightX + 18, nidBackY + imgH / 2);
      }
      doc.setFontSize(7);
      doc.setTextColor(52, 183, 167);
      doc.text("NID Back", rightX + 26, nidBackY + imgH + 5);

      // ── Left side: info (guaranteed not to overlap NID column since we
      // pre-measured bodyHeight above and confirmed the whole entry fits
      // on this page — so no mid-entry page break can happen here). ──
      y = startY;
      doc.setFontSize(9);

      lines.forEach(([label, value]) => {
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`${label}:`, leftX, y);
        doc.setFont(undefined, "normal");
        const wrapped = doc.splitTextToSize(String(value), textWrapWidth);
        doc.text(wrapped, leftX + 36, y);
        y += wrapped.length > 1 ? wrapped.length * 6 : 7;
      });

      const rightBottom = nidBackY + imgH + 14;
      y = Math.max(y, rightBottom) + 16; // extra buffer: next entry's photo is pulled up above its title, so this gap must absorb that
    }

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
                    {req.status === "accepted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#34B7A7] border-[#34B7A7] hover:bg-[#34B7A7]/10"
                        onClick={() => handleSingleDownload(req)}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
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
              {req.status === "accepted" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-[#34B7A7] border-[#34B7A7] hover:bg-[#34B7A7]/10"
                  onClick={() => handleSingleDownload(req)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              )}
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