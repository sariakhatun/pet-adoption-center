import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import TiptapEditor from "@/pages/shared/TiptapEditor";

const CreateDonationCampaign = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [donorType, setDonorType] = useState("individual");
  const [nidFrontUrl, setNidFrontUrl] = useState(null);
  const [nidBackUrl, setNidBackUrl] = useState(null);
  const [nidFrontUploading, setNidFrontUploading] = useState(false);
  const [nidBackUploading, setNidBackUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Upload_Key}`,
        formData
      );
      setImageUrl(res.data.data.url);
    } catch (err) {
      console.error("Image upload error:", err);
      Swal.fire("Error", "Image upload failed", "error");
    }
  };

  const handleNidUpload = async (e, side) => {
    const image = e.target.files[0];
    if (!image) return;
    side === "front" ? setNidFrontUploading(true) : setNidBackUploading(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Upload_Key}`,
        formData
      );
      const url = res.data.data.url;
      side === "front" ? setNidFrontUrl(url) : setNidBackUrl(url);
    } catch {
      Swal.fire("Error", `NID ${side} image upload failed`, "error");
    } finally {
      side === "front" ? setNidFrontUploading(false) : setNidBackUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      Swal.fire("Error", "Please upload a pet image", "error");
      return;
    }

    if (donorType === "individual" && (!nidFrontUrl || !nidBackUrl)) {
      Swal.fire("Error", "Please upload both sides of your NID", "error");
      return;
    }

    const ownerInfo =
      donorType === "individual"
        ? {
            donorType: "individual",
            ownerName: user.displayName,
            ownerEmail: user.email,
            ownerPhone: data.ownerPhone,
            ownerNID: data.ownerNID,
            nidFrontImage: nidFrontUrl,
            nidBackImage: nidBackUrl,
            reasonForDonation: data.reasonForDonation,
          }
        : {
            donorType: "rescue_center",
            ownerName: user.displayName,
            ownerEmail: user.email,
            organizationName: data.organizationName,
            registrationNumber: data.registrationNumber,
            organizationAddress: data.organizationAddress,
            ownerPhone: data.ownerPhone,
            website: data.website || "",
            reasonForDonation: data.reasonForDonation,
          };

    const campaignData = {
      petName: data.petName,
      petImage: imageUrl,
      maxDonationAmount: parseFloat(data.maxDonationAmount),
      donatedAmount: 0,
      donators: [],
      paused: false,
      donationDeadline: data.donationDeadline,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      createdBy: user.email,
      createdAt: new Date().toISOString(),
      ...ownerInfo,
    };

    try {
      const res = await axiosSecure.post("/donation-campaigns", campaignData);
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Donation Campaign Created",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        setImageUrl(null);
        setNidFrontUrl(null);
        setNidBackUrl(null);
        setDonorType("individual");
        navigate("/dashboard/my-campaigns");
      }
    } catch (err) {
      console.error("Campaign creation error:", err);
      Swal.fire("Error", "Failed to create campaign", "error");
    }
  };

  const inputClass = "dark:bg-gray-800 dark:text-gray-100";
  const textareaClass = "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white resize-none";

  const UploadBox = ({ url, uploading, side, label }) => (
    <div>
      <Label className="dark:text-gray-300" style={{ fontSize: 13 }}>{label}</Label>
      <div className="mt-1">
        <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 w-fit hover:border-[#34B7A7] transition-colors">
          <i
            className={`ti ${uploading ? "ti-loader-2" : "ti-upload"}`}
            style={{ fontSize: 15, color: "#34B7A7", animation: uploading ? "spin 1s linear infinite" : "none" }}
          />
          {uploading ? "Uploading..." : `Upload ${side}`}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleNidUpload(e, side)} />
        </label>
        {url ? (
          <img
            src={url}
            alt={`NID ${side}`}
            className="mt-2 h-28 object-cover rounded border-2 border-[#34B7A7] cursor-pointer"
            onClick={() => window.open(url, "_blank")}
          />
        ) : (
          <p className="text-red-500 text-xs mt-1">NID {side} image required</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mt-20 mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow space-y-6 my-12">
      <h2 className="text-2xl font-semibold text-[#34B7A7] dark:text-[#34B7A7] mb-6">
        Create Donation Campaign
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Donor Type */}
        <div>
          <Label className="dark:text-gray-300">I am a</Label>
          <select
            value={donorType}
            onChange={(e) => setDonorType(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white mt-1"
          >
            <option value="individual">Individual</option>
            <option value="rescue_center">Rescue Center / Organization</option>
          </select>
        </div>

        {/* Owner Name - auto fill */}
        <div>
          <Label className="dark:text-gray-300">Your Name</Label>
          <Input value={user?.displayName || ""} disabled className="dark:bg-gray-800 dark:text-gray-100 opacity-70" />
        </div>

        {/* Owner Email - auto fill */}
        <div>
          <Label className="dark:text-gray-300">Your Email</Label>
          <Input value={user?.email || ""} disabled className="dark:bg-gray-800 dark:text-gray-100 opacity-70" />
        </div>

        {/* Phone */}
        <div>
          <Label className="dark:text-gray-300">Phone Number</Label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            {...register("ownerPhone", { required: "Phone number is required" })}
            className={inputClass}
          />
          {errors.ownerPhone && <p className="text-red-500 text-sm">{errors.ownerPhone.message}</p>}
        </div>

        {/* Individual Fields */}
        {donorType === "individual" && (
          <>
            <div>
              <Label className="dark:text-gray-300">NID Number</Label>
              <Input
                placeholder="Enter your NID number"
                {...register("ownerNID", { required: "NID is required" })}
                className={inputClass}
              />
              {errors.ownerNID && <p className="text-red-500 text-sm">{errors.ownerNID.message}</p>}
            </div>

            {/* NID Images - 2 column */}
            <div className="grid grid-cols-2 gap-4">
              <UploadBox
                url={nidFrontUrl}
                uploading={nidFrontUploading}
                side="front"
                label="NID Front Side"
              />
              <UploadBox
                url={nidBackUrl}
                uploading={nidBackUploading}
                side="back"
                label="NID Back Side"
              />
            </div>
          </>
        )}

        {/* Rescue Center Fields */}
        {donorType === "rescue_center" && (
          <>
            <div>
              <Label className="dark:text-gray-300">Organization Name</Label>
              <Input
                placeholder="Enter organization name"
                {...register("organizationName", { required: "Organization name is required" })}
                className={inputClass}
              />
              {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName.message}</p>}
            </div>

            <div>
              <Label className="dark:text-gray-300">Registration Number</Label>
              <Input
                placeholder="Enter registration number"
                {...register("registrationNumber", { required: "Registration number is required" })}
                className={inputClass}
              />
              {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber.message}</p>}
            </div>

            <div>
              <Label className="dark:text-gray-300">Organization Address</Label>
              <Input
                placeholder="Enter organization address"
                {...register("organizationAddress", { required: "Address is required" })}
                className={inputClass}
              />
              {errors.organizationAddress && <p className="text-red-500 text-sm">{errors.organizationAddress.message}</p>}
            </div>

            <div>
              <Label className="dark:text-gray-300">Website (optional)</Label>
              <Input
                placeholder="https://your-organization.com"
                {...register("website")}
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* Reason for Donation */}
        <div>
          <Label className="dark:text-gray-300">Reason for Donation</Label>
          <textarea
            placeholder="Why do you need donations for this pet?"
            {...register("reasonForDonation", { required: "Reason is required" })}
            rows={3}
            className={`${textareaClass} mt-1`}
          />
          {errors.reasonForDonation && <p className="text-red-500 text-sm">{errors.reasonForDonation.message}</p>}
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Pet & Campaign Details</p>

        {/* Pet Image Upload */}
        <div>
          <Label className="dark:text-gray-300">Pet Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={inputClass}
          />
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="w-32 h-32 mt-2 object-cover rounded" />
          )}
          {!imageUrl && (
            <p className="text-red-500 text-sm mt-1">Image is required</p>
          )}
        </div>

        {/* Pet Name */}
        <div>
          <Label htmlFor="petName" className="dark:text-gray-300">Pet Name</Label>
          <Input
            id="petName"
            {...register("petName", { required: "Pet name is required" })}
            className={inputClass}
          />
          {errors.petName && <p className="text-red-500 text-sm">{errors.petName.message}</p>}
        </div>

        {/* Maximum Donation Amount */}
        <div>
          <Label htmlFor="maxDonationAmount" className="dark:text-gray-300">Maximum Donation Amount</Label>
          <Input
            id="maxDonationAmount"
            type="number"
            step="0.01"
            {...register("maxDonationAmount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be at least 1" },
            })}
            className={inputClass}
          />
          {errors.maxDonationAmount && <p className="text-red-500 text-sm">{errors.maxDonationAmount.message}</p>}
        </div>

        {/* Donation Deadline */}
        <div>
          <Label htmlFor="donationDeadline" className="dark:text-gray-300">Last Date of Donation</Label>
          <Input
            id="donationDeadline"
            type="date"
            {...register("donationDeadline", { required: "Donation deadline is required" })}
            className={inputClass}
          />
          {errors.donationDeadline && <p className="text-red-500 text-sm">{errors.donationDeadline.message}</p>}
        </div>

        {/* Short Description */}
        <div>
          <Label htmlFor="shortDescription" className="dark:text-gray-300">Short Description</Label>
          <Input
            id="shortDescription"
            {...register("shortDescription", { required: "Short description is required" })}
            className={inputClass}
          />
          {errors.shortDescription && <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>}
        </div>

        {/* Long Description */}
        <div>
          <Label htmlFor="longDescription" className="dark:text-gray-300">Long Description</Label>
          <Controller
            name="longDescription"
            control={control}
            rules={{ required: "Long description is required" }}
            render={({ field }) => (
              <TiptapEditor
                {...field}
                control={control}
                name="longDescription"
                className="dark:bg-gray-800 dark:text-gray-100"
              />
            )}
          />
          {errors.longDescription && <p className="text-red-500 text-sm">{errors.longDescription.message}</p>}
        </div>

        {/* Submit */}
        <Button type="submit" className="bg-[#34B7A7] w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Campaign"}
        </Button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateDonationCampaign;