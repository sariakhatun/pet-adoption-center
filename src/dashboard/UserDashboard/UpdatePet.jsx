import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router";
import useAuth from "@/hooks/useAuth";

const categoryOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "others", label: "Others" },
];

const UpdatePet = () => {
  const {id: petId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
    console.log('pet id',petId)
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

  // Fetch pet data by petId and reset form
  useEffect(() => {
    if (!petId) return;

    setLoading(true);
    axiosSecure
      .get(`/pets/${petId}`)
      .then((res) => {
        const pet = res.data;
        console.log("Pet data loaded:", res.data);

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

  // Handle image upload to imgbb
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
      // Fetch existing pet data to preserve createdAt
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
    return <p className="text-center mt-12">Loading pet data...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6 my-12">
      <h2 className="text-2xl font-semibold text-[#34B7A7] mb-8">Update Pet</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Pet Image Upload */}
        <div>
          <Label>Pet Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
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
          <Label htmlFor="petName">Pet Name</Label>
          <Input
            id="petName"
            {...register("petName", { required: "Pet name is required" })}
          />
          {errors.petName && (
            <p className="text-red-500 text-sm">{errors.petName.message}</p>
          )}
        </div>

        {/* Pet Age */}
        <div>
          <Label htmlFor="petAge">Pet Age</Label>
          <Input
            id="petAge"
            {...register("petAge", { required: "Pet age is required" })}
          />
          {errors.petAge && (
            <p className="text-red-500 text-sm">{errors.petAge.message}</p>
          )}
        </div>

        {/* Pet Category */}
        <div>
          <Label>Pet Category</Label>
          <Controller
            name="petCategory"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={categoryOptions}
                placeholder="Select category"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.petCategory && (
            <p className="text-red-500 text-sm">{errors.petCategory.message}</p>
          )}
        </div>

        {/* Pet Location */}
        <div>
          <Label htmlFor="petLocation">Location</Label>
          <Input
            id="petLocation"
            {...register("petLocation", { required: "Location is required" })}
          />
          {errors.petLocation && (
            <p className="text-red-500 text-sm">{errors.petLocation.message}</p>
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
          {isSubmitting ? "Updating..." : "Update Pet"}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePet;
