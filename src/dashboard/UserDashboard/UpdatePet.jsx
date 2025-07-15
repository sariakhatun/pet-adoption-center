import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router";
import useAuth from "@/hooks/useAuth";
import TiptapEditor from "@/pages/shared/TiptapEditor";

// Category options for Select
const categoryOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "others", label: "Others" },
];

// react-select custom styles supporting dark mode
const customSelectStyles = (isDarkMode) => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? "#1f2937" : "white", // dark gray-800 / white
    borderColor: isDarkMode ? "#374151" : "#d1d5db", // dark gray-700 / gray-300
    color: isDarkMode ? "white" : "black",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: isDarkMode ? "white" : "black",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? "#1f2937" : "white",
    color: isDarkMode ? "white" : "black",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? isDarkMode
        ? "#374151"
        : "#e5e7eb" // dark gray-700 / gray-200
      : isDarkMode
      ? "#1f2937"
      : "white",
    color: isDarkMode ? "white" : "black",
  }),
});

// DarkModeSelect component to detect theme on each render
const DarkModeSelect = ({ control, name, ...props }) => {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Category is required" }}
      render={({ field }) => (
        <Select
          {...field}
          {...props}
          styles={customSelectStyles(isDark)}
          classNamePrefix="react-select"
          onChange={(val) => field.onChange(val)}
          value={field.value}
        />
      )}
    />
  );
};

const UpdatePet = () => {
  const { id: petId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      petName: "",
      petAge: "",
      petLocation: "",
      shortDescription: "",
      longDescription: "",
      petCategory: null,
    },
  });

  useEffect(() => {
    if (!petId) return;

    setLoading(true);
    axiosSecure
      .get(`/pets/${petId}`)
      .then((res) => {
        const pet = res.data;
        reset({
          petName: pet.petName,
          petAge: pet.petAge,
          petLocation: pet.petLocation,
          shortDescription: pet.shortDescription,
          longDescription: pet.longDescription,
          petCategory: categoryOptions.find(
            (cat) => cat.value === pet.petCategory
          ),
        });
        setImageUrl(pet.petImage || null);
      })
      .catch((err) => {
        console.error("Fetch pet error:", err);
        Swal.fire("Error", "Failed to load pet data", "error");
      })
      .finally(() => setLoading(false));
  }, [petId, axiosSecure, reset]);

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Upload_Key}`,
        formData,
        { timeout: 10000 }
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

    try {
      const existingPetRes = await axiosSecure.get(`/pets/${petId}`);
      const existingPet = existingPetRes.data;

      const petData = {
        petName: data.petName,
        petAge: data.petAge,
        petLocation: data.petLocation,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        petCategory: data.petCategory.value,
        petImage: imageUrl,
        userEmail: user.email,
        createdAt: existingPet.createdAt || new Date().toISOString(),
      };

      await axiosSecure.patch(`/pets/${petId}`, petData);

      Swal.fire({
        icon: "success",
        title: "Pet Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/dashboard/my-pets");
    } catch (error) {
      console.error("Update pet error:", error);
      Swal.fire("Error", "Failed to update pet", "error");
    }
  };

  if (loading) {
    return <p className="text-center mt-12 text-gray-700 dark:text-gray-300">Loading pet data...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow space-y-6 my-12">
      <h2 className="text-2xl font-semibold text-[#34B7A7] mb-8">Update Pet</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Pet Image Upload */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-1 block">Pet Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="pet preview"
              className="w-32 h-32 mt-2 object-cover rounded"
            />
          )}
        </div>

        {/* Pet Name */}
        <div>
          <Label
            htmlFor="petName"
            className="text-gray-700 dark:text-gray-300 font-semibold mb-1 block"
          >
            Pet Name
          </Label>
          <Input
            id="petName"
            {...register("petName", { required: "Pet name is required" })}
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
          />
          {errors.petName && (
            <p className="text-red-500 text-sm">{errors.petName.message}</p>
          )}
        </div>

        {/* Pet Age */}
        <div>
          <Label
            htmlFor="petAge"
            className="text-gray-700 dark:text-gray-300 font-semibold mb-1 block"
          >
            Pet Age
          </Label>
          <Input
            id="petAge"
            {...register("petAge", { required: "Pet age is required" })}
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
          />
          {errors.petAge && (
            <p className="text-red-500 text-sm">{errors.petAge.message}</p>
          )}
        </div>

        {/* Pet Category */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-1 block">
            Pet Category
          </Label>
          <DarkModeSelect
            control={control}
            name="petCategory"
            options={categoryOptions}
            placeholder="Select category"
          />
          {errors.petCategory && (
            <p className="text-red-500 text-sm">{errors.petCategory.message}</p>
          )}
        </div>

        {/* Pet Location */}
        <div>
          <Label
            htmlFor="petLocation"
            className="text-gray-700 dark:text-gray-300 font-semibold mb-1 block"
          >
            Location
          </Label>
          <Input
            id="petLocation"
            {...register("petLocation", { required: "Location is required" })}
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
          />
          {errors.petLocation && (
            <p className="text-red-500 text-sm">{errors.petLocation.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <Label
            htmlFor="shortDescription"
            className="text-gray-700 dark:text-gray-300 font-semibold mb-1 block"
          >
            Short Description
          </Label>
          <Input
            id="shortDescription"
            {...register("shortDescription", {
              required: "Short description is required",
            })}
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <Label
            htmlFor="longDesc"
            className="text-gray-700 dark:text-gray-300 font-semibold mb-1 block"
          >
            Long Description
          </Label>
          <Controller
            name="longDescription"
            control={control}
            rules={{ required: "Long description is required" }}
            render={({ field }) => (
              <div className="bg-gray-50 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 p-2 min-h-[150px] text-gray-900 dark:text-gray-100">
                <TiptapEditor control={control} name="longDescription" {...field} />
              </div>
            )}
          />
          {errors.longDescription && (
            <p className="text-red-500 text-sm">{errors.longDescription.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="bg-[#34B7A7]" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Pet"}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePet;
