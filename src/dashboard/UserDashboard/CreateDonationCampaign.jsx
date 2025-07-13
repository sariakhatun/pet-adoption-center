import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";

const CreateDonationCampaign = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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

    const campaignData = {
      petName: data.petName,      
      petImage: imageUrl,
      maxDonationAmount: parseFloat(data.maxDonationAmount),
      donatedAmount:0,                         
      donators: [],                          
      paused: false,                         
      donationDeadline: data.donationDeadline,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      createdBy: user.email,
      createdAt: new Date().toISOString(),
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
        //reset();
       // setImageUrl(null);
       // navigate("/dashboard/my-campaigns");
      }
    } catch (err) {
      console.error("Campaign creation error:", err);
      Swal.fire("Error", "Failed to create campaign", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6 my-12">
      <h2 className="text-2xl font-semibold text-[#34B7A7] mb-6">
        Create Donation Campaign
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Pet Image Upload */}
        <div>
          <Label>Pet Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-32 h-32 mt-2 object-cover rounded"
            />
          )}
        </div>

        {/* Pet Name */}
        <div>
          <Label htmlFor="petName">Pet Name</Label>
          <Input
            id="petName"
            {...register("petName", { required: "Pet name is required" })}
          />
          {errors.petName && (
            <p className="text-red-500 text-sm">{errors.petName.message}</p>
          )}
        </div>

        {/* Maximum Donation Amount */}
        <div>
          <Label htmlFor="maxDonationAmount">Maximum Donation Amount</Label>
          <Input
            id="maxDonationAmount"
            type="number"
            step="0.01"
            {...register("maxDonationAmount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be at least 1" },
            })}
          />
          {errors.maxDonationAmount && (
            <p className="text-red-500 text-sm">{errors.maxDonationAmount.message}</p>
          )}
        </div>

        {/* Last Date of Donation */}
        <div>
          <Label htmlFor="donationDeadline">Last Date of Donation</Label>
          <Input
            id="donationDeadline"
            type="date"
            {...register("donationDeadline", {
              required: "Donation deadline is required",
            })}
          />
          {errors.donationDeadline && (
            <p className="text-red-500 text-sm">{errors.donationDeadline.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input
            id="shortDescription"
            {...register("shortDescription", {
              required: "Short description is required",
            })}
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <Label htmlFor="longDescription">Long Description</Label>
          <Textarea
            id="longDescription"
            rows={5}
            {...register("longDescription", {
              required: "Long description is required",
            })}
          />
          {errors.longDescription && (
            <p className="text-red-500 text-sm">{errors.longDescription.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="bg-[#34B7A7]" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Campaign"}
        </Button>
      </form>
    </div>
  );
};

export default CreateDonationCampaign;
