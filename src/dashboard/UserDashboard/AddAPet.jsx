import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import useDarkMode from "@/hooks/useDarkMode";
import TiptapEditor from "@/pages/shared/TiptapEditor";

const categoryOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "others", label: "Others" },
];

const customSelectStyles = (isDark) => ({
  control: (base) => ({
    ...base,
    backgroundColor: isDark ? "#1f2937" : "white",
    borderColor: isDark ? "#374151" : "#d1d5db",
    color: isDark ? "white" : "black",
  }),
  singleValue: (base) => ({
    ...base,
    color: isDark ? "white" : "black",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: isDark ? "#1f2937" : "white",
    color: isDark ? "white" : "black",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? isDark
        ? "#374151"
        : "#e5e7eb"
      : isDark
      ? "#1f2937"
      : "white",
    color: isDark ? "white" : "black",
  }),
});

const AddAPet = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDark = useDarkMode();

  const [imageUrl, setImageUrl] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Upload_Key}`,
        formData,
        { timeout: 10000 }
      );
      setImageUrl(res.data.data.url);
    } catch (error) {
      console.error("Image upload failed", error);
      Swal.fire("Error", "Image upload failed. Please try again.", "error");
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      Swal.fire("Error", "Please upload a pet image", "error");
      return;
    }

    const petData = {
      ...data,
      petImage: imageUrl,
      petCategory: data.petCategory.value,
      adopted: false,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/pets", petData);
      if (res.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Pet Added Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/my-pets");
      }
    } catch (error) {
      console.error("Saving pet failed", error);
      Swal.fire("Error", "Failed to add pet. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow my-20 space-y-6">
      <h2 className="text-2xl font-semibold text-[#34B7A7] mb-8">Add a Pet</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Pet Image</Label>
          <Input
            type="file"
            accept="image/*"
            {...register("photo", { required: "Pet image is required" })}
            onChange={handleImageUpload}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
          {!imageUrl && (
            <p className="text-red-500 text-sm mt-1">Image is required</p>
          )}
        </div>

        {/* Pet Name */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Pet Name</Label>
          <Input
            {...register("petName", { required: "Pet name is required" })}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
          {errors.petName && (
            <p className="text-red-500 text-sm">{errors.petName.message}</p>
          )}
        </div>

        {/* Pet Age */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Pet Age</Label>
          <Input
            {...register("petAge", { required: "Pet age is required" })}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
          {errors.petAge && (
            <p className="text-red-500 text-sm">{errors.petAge.message}</p>
          )}
        </div>

        {/* Category (react-select) */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Pet Category</Label>
          <Controller
            name="petCategory"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={categoryOptions}
                styles={customSelectStyles(isDark)}
                placeholder="Select category"
                onChange={(val) => field.onChange(val)}
                value={field.value}
              />
            )}
          />
          {errors.petCategory && (
            <p className="text-red-500 text-sm">{errors.petCategory.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Location</Label>
          <Input
            {...register("petLocation", { required: "Location is required" })}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
          {errors.petLocation && (
            <p className="text-red-500 text-sm">{errors.petLocation.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Short Description</Label>
          <Input
            {...register("shortDescription", {
              required: "Short description is required",
            })}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Long Description</Label>
          <Controller
            name="longDescription"
            control={control}
            rules={{ required: "Long description is required" }}
            render={({ field }) => (
              <div className="rounded border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
                <TiptapEditor {...field} />
              </div>
            )}
          />
          {errors.longDescription && (
            <p className="text-red-500 text-sm">{errors.longDescription.message}</p>
          )}
        </div>

        <Button type="submit" className="bg-[#34B7A7]" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Pet"}
        </Button>
      </form>
    </div>
  );
};

export default AddAPet;
