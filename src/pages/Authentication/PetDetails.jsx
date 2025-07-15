import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Swal from "sweetalert2";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AdoptionRequestSkeleton from "@/skeleton/AdoptionRequestSkeleton";
import SingleCardSkeleton from "@/skeleton/SingleCardSkeleton";

const PetDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  console.log("Pet ID from URL:", id);


  // Fetch pet data
  const {
    data: pet,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["petDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets/${id}`);
      return res.data;
    },

   
  });





  const { register, handleSubmit, reset } = useForm();

  if (!user) return (
    <div className="flex justify-center items-center h-screen">
      <SingleCardSkeleton />
    </div>
  );
  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <SingleCardSkeleton />
    </div>
  );
  if (isError || !pet)
    return <p className="text-red-500">Failed to load pet details.</p>;

  const onSubmit = async (formData) => {
    const adoptionData = {
      petId: pet._id,
      petName: pet.petName,
      petImage: pet.petImage,
      adopterName: user.displayName,
      adopterEmail: user.email,
      phone: formData.phone,
      address: formData.address,
      requestedAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/adoptions", adoptionData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Adoption Request Submitted!",
          text: "Thank you for your interest in adopting. We will contact you soon.",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
      }
    } catch (error) {
      console.error("Failed to submit adoption request:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit your adoption request. Please try again.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Pet info */}
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-md p-6 border border-gray-200 items-center">
        <div className="md:w-1/2 flex justify-center items-start">
          <img
            src={pet.petImage}
            alt={pet.petName}
            className="rounded-lg w-full lg:h-[650px] max-h-[450px] object-cover border"
          />
        </div>

        <div className="md:w-1/2 space-y-4">
          <h2 className="text-4xl font-bold text-[#34B7A7]">{pet.petName}</h2>
          <p className="text-gray-600 text-lg">
            <strong>Age:</strong> {pet.petAge}
          </p>
          <p className="text-gray-600 text-lg">
            <strong>Location:</strong> {pet.petLocation}
          </p>
          <p className="text-gray-600 text-lg">
            <strong>Category:</strong> {pet.petCategory}
          </p>
          <p className="text-gray-600 text-lg">
            <strong>Short Description:</strong> {pet.shortDescription}
          </p>
          <p className="text-gray-600 text-lg">
            <strong>Status:</strong>{" "}
            {pet.adopted ? (
              <span className="text-red-600 font-semibold">Adopted</span>
            ) : (
              <span className="text-green-500 font-semibold">Available</span>
            )}
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Uploaded by:</strong> {pet.userEmail}
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Created At:</strong>{" "}
            {new Date(pet.createdAt).toLocaleString("en-BD", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-wrap">
            <strong>Long Description:</strong>
            <br />
            {pet.longDescription}
          </p>

          {/* Adopt modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-6 bg-[#34B7A7] hover:bg-[#2fa99b] text-white w-full md:w-auto">
                Adopt {pet.petName}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adopt {pet.petName}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Pet ID (read-only) */}
                <div>
                  <Label>Pet ID</Label>
                  <Input value={pet._id} disabled />
                </div>

                {/* Pet Name (read-only) */}
                <div>
                  <Label>Pet Name</Label>
                  <Input value={pet.petName} disabled />
                </div>

                {/* Pet Image URL (read-only) */}
                <div>
                  <Label>Pet Image URL</Label>
                  <Input value={pet.petImage} disabled />
                </div>

                {/* Adopter Name (read-only) */}
                <div>
                  <Label>Your Name</Label>
                  <Input value={user.displayName} disabled />
                </div>

                {/* Adopter Email (read-only) */}
                <div>
                  <Label>Your Email</Label>
                  <Input value={user.email} disabled />
                </div>

                {/* Phone Number (editable) */}
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone", { required: true })}
                  />
                </div>

                {/* Address (editable) */}
                <div>
                  <Label>Address</Label>
                  <Input
                    placeholder="Enter your address"
                    {...register("address", { required: true })}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#34B7A7] hover:bg-[#2fa99b] text-white"
                >
                  Submit Adoption Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
