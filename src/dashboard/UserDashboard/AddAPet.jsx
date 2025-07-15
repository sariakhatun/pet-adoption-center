import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import useUserRole from "@/hooks/useUserRole";
import FormSkeleton from "@/skeleton/FormSkeleton";

const categoryOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "others", label: "Others" },
];

const AddAPet = () => {
  let axiosSecure = useAxiosSecure();
  const [imageUrl, setImageUrl] = useState(null);
  let {roleLoading}=useUserRole();
  let {user}=useAuth()
  let navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    // console.log(image)
    let formData = new FormData();
    formData.append("image", image);

    let res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_Image_Upload_Key
      }`,
      formData,
       { timeout: 10000 }
    );
  //  console.log('import',import.meta.env.VITE_Image_Upload_Key);

    console.log(res.data.data.url);
    setImageUrl(res.data.data.url);
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
    console.log("pet added", petData);

    //save data to the server
    axiosSecure
      .post("/pets", petData)
      .then((res) => {
        console.log("in db", res.data);
        if (res.data.insertedId) {
            //todo:redirect to he my pet section
            //navigate('/dashboard/my-pets')
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Pet Added Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

  
  };

 


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4j my-12">
      <h2 className="text-2xl font-semibold text-[#34B7A7] mb-8">Add a Pet</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Pet Image Upload */}
        <div>
          <Label>Pet Image</Label>
          <Input
            type="file"
            {...register("photo", { required: "Pet Image is required" })}
            accept="image/*"
            onChange={handleImageUpload}
          />
          {/* {!imageUrl && <p className="text-red-500 text-sm">Image is required</p>} */}
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
          <Label htmlFor="shortDesc">Short Description</Label>
          <Input
            id="shortDesc"
            {...register("shortDescription", {
              required: "Short description is required",
            })}
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <Label htmlFor="longDesc">Long Description</Label>
          <Textarea
            id="longDesc"
            rows={5}
            {...register("longDescription", {
              required: "Long description is required",
            })}
          />
          {errors.longDescription && (
            <p className="text-red-500 text-sm">
              {errors.longDescription.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="bg-[#34B7A7]" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Pet"}
        </Button>
      </form>
    </div>
  );
};

export default AddAPet;
