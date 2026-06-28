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

  const onSubmit = async (data) => {
    if (!imageUrl) {
      Swal.fire("Error", "Please upload a pet image", "error");
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
        setDonorType("individual");
        navigate("/dashboard/my-campaigns");
      }
    } catch (err) {
      console.error("Campaign creation error:", err);
      Swal.fire("Error", "Failed to create campaign", "error");
    }
  };

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
          <Input
            value={user?.displayName || ""}
            disabled
            className="dark:bg-gray-800 dark:text-gray-100 opacity-70"
          />
        </div>

        {/* Owner Email - auto fill */}
        <div>
          <Label className="dark:text-gray-300">Your Email</Label>
          <Input
            value={user?.email || ""}
            disabled
            className="dark:bg-gray-800 dark:text-gray-100 opacity-70"
          />
        </div>

        {/* Phone - always required */}
        <div>
          <Label className="dark:text-gray-300">Phone Number</Label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            {...register("ownerPhone", { required: "Phone number is required" })}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
          {errors.ownerPhone && (
            <p className="text-red-500 text-sm">{errors.ownerPhone.message}</p>
          )}
        </div>

        {/* Individual Fields */}
        {donorType === "individual" && (
          <div>
            <Label className="dark:text-gray-300">NID Number</Label>
            <Input
              placeholder="Enter your NID number"
              {...register("ownerNID", { required: "NID is required" })}
              className="dark:bg-gray-800 dark:text-gray-100"
            />
            {errors.ownerNID && (
              <p className="text-red-500 text-sm">{errors.ownerNID.message}</p>
            )}
          </div>
        )}

        {/* Rescue Center Fields */}
        {donorType === "rescue_center" && (
          <>
            <div>
              <Label className="dark:text-gray-300">Organization Name</Label>
              <Input
                placeholder="Enter organization name"
                {...register("organizationName", { required: "Organization name is required" })}
                className="dark:bg-gray-800 dark:text-gray-100"
              />
              {errors.organizationName && (
                <p className="text-red-500 text-sm">{errors.organizationName.message}</p>
              )}
            </div>

            <div>
              <Label className="dark:text-gray-300">Registration Number</Label>
              <Input
                placeholder="Enter registration number"
                {...register("registrationNumber", { required: "Registration number is required" })}
                className="dark:bg-gray-800 dark:text-gray-100"
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm">{errors.registrationNumber.message}</p>
              )}
            </div>

            <div>
              <Label className="dark:text-gray-300">Organization Address</Label>
              <Input
                placeholder="Enter organization address"
                {...register("organizationAddress", { required: "Address is required" })}
                className="dark:bg-gray-800 dark:text-gray-100"
              />
              {errors.organizationAddress && (
                <p className="text-red-500 text-sm">{errors.organizationAddress.message}</p>
              )}
            </div>

            <div>
              <Label className="dark:text-gray-300">Website (optional)</Label>
              <Input
                placeholder="https://your-organization.com"
                {...register("website")}
                className="dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </>
        )}

        {/* Reason for Donation - always required */}
        <div>
          <Label className="dark:text-gray-300">Reason for Donation</Label>
          <textarea
            placeholder="Why do you need donations for this pet?"
            {...register("reasonForDonation", { required: "Reason is required" })}
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white resize-none mt-1"
          />
          {errors.reasonForDonation && (
            <p className="text-red-500 text-sm">{errors.reasonForDonation.message}</p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-gray-200 dark:border-gray-700" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Pet & Campaign Details</p>

        {/* Pet Image Upload */}
        <div>
          <Label className="dark:text-gray-300">Pet Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="dark:bg-gray-800 dark:text-gray-100"
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
            className="dark:bg-gray-800 dark:text-gray-100"
          />
          {errors.petName && (
            <p className="text-red-500 text-sm">{errors.petName.message}</p>
          )}
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
            className="dark:bg-gray-800 dark:text-gray-100"
          />
          {errors.maxDonationAmount && (
            <p className="text-red-500 text-sm">{errors.maxDonationAmount.message}</p>
          )}
        </div>

        {/* Last Date of Donation */}
        <div>
          <Label htmlFor="donationDeadline" className="dark:text-gray-300">Last Date of Donation</Label>
          <Input
            id="donationDeadline"
            type="date"
            {...register("donationDeadline", { required: "Donation deadline is required" })}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
          {errors.donationDeadline && (
            <p className="text-red-500 text-sm">{errors.donationDeadline.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <Label htmlFor="shortDescription" className="dark:text-gray-300">Short Description</Label>
          <Input
            id="shortDescription"
            {...register("shortDescription", { required: "Short description is required" })}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>
          )}
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
          {errors.longDescription && (
            <p className="text-red-500 text-sm">{errors.longDescription.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="bg-[#34B7A7] w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Campaign"}
        </Button>
      </form>
    </div>
  );
};

export default CreateDonationCampaign;