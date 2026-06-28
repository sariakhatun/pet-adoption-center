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
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PetDetailsSkeleton from "@/skeleton/PetDetailsSkeleton";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

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

  // Check: user already request করেছে কিনা
  const { data: existingRequest } = useQuery({
    queryKey: ["adoptionCheck", id, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-adoptions`);
      const data = res.data;
      const list = Array.isArray(data) ? data : (data?.adoptions ?? []);
      return list.find((a) => a.petId === id) || null;
    },
    enabled: !!user?.email && !!id,
  });

  const alreadyRequested = !!existingRequest;

  const { register, handleSubmit, reset } = useForm();

  if (isLoading || !user)
    return (
      <div className="flex justify-center items-center h-screen">
        <PetDetailsSkeleton />
      </div>
    );

  if (isError || !pet)
    return <p className="text-red-500">Failed to load pet details.</p>;

  const onSubmit = async (formData) => {
    // const adoptionData = {
    //   petId: pet._id,
    //   petName: pet.petName,
    //   petImage: pet.petImage,
    //   adopterName: user.displayName,
    //   adopterEmail: user.email,
    //   phone: formData.phone,
    //   address: formData.address,
    //   requestedAt: new Date().toISOString(),
    // };
    const adoptionData = {
      petId: pet._id,
      petName: pet.petName,
      petImage: pet.petImage,
      adopterName: user.displayName,
      adopterEmail: user.email,
      phone: formData.phone,
      address: formData.address,
      nid: formData.nid,
      occupation: formData.occupation,
      houseType: formData.houseType,
      hasGarden: formData.hasGarden,
      hasOtherPets: formData.hasOtherPets,
      experience: formData.experience,
      reason: formData.reason,
      requestedAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/adoptions", adoptionData);
      if (res.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Adoption Request Submitted!",
          text: "Thank you for your interest in adopting. We will contact you soon.",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        navigate("/dashboard/my-adoption-requests");
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

  const isAdopted = pet?.adopted === true || pet?.status === "adopted";
  const isDisabled = isAdopted || alreadyRequested;

  return (
    <div className="max-w-full my-12 mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-8 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600 items-center">
        <div className="md:w-1/2 flex justify-center items-start">
          <img
            src={pet.petImage}
            alt={pet.petName}
            className="rounded-lg w-full lg:h-[650px] max-h-[450px] object-cover border"
          />
        </div>

        <div className="md:w-1/2 space-y-4">
          <h2 className="text-4xl font-bold text-[#34B7A7]">{pet.petName}</h2>
          <p className="text-gray-600 dark:text-white text-lg">
            <strong>Age:</strong> {pet.petAge}
          </p>
          <p className="text-gray-600 dark:text-white text-lg">
            <strong>Location:</strong> {pet.petLocation}
          </p>
          <p className="text-gray-600 dark:text-white text-lg">
            <strong>Category:</strong> {pet.petCategory}
          </p>
          <p className="text-gray-600 dark:text-white text-lg">
            <strong>Short Description:</strong> {pet.shortDescription}
          </p>
          <p className="text-gray-600 dark:text-white text-lg">
            <strong>Status:</strong>{" "}
            {pet.adopted ? (
              <span className="text-red-600 font-semibold">Adopted</span>
            ) : (
              <span className="text-green-500 font-semibold">Available</span>
            )}
          </p>
          <p className="text-gray-600 dark:text-white text-sm">
            <strong>Uploaded by:</strong> {pet.userEmail}
          </p>
          <p className="text-gray-600 dark:text-white text-sm">
            <strong>Created At:</strong>{" "}
            {new Date(pet.createdAt).toLocaleString("en-BD", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <div className="text-gray-700 dark:text-white mt-4 leading-relaxed prose dark:prose-invert max-w-none">
  <strong>Long Description:</strong>
  <div dangerouslySetInnerHTML={{ __html: pet.longDescription }} />
</div>

          {/* Adopt Button & Modal */}
          <Dialog >
            <DialogTrigger asChild>
              <Button
                disabled={isDisabled}
                className="mt-6 bg-[#34B7A7] hover:bg-[#2fa99b] text-white w-full md:w-auto disabled:opacity-50 "
              >
                {isAdopted
                  ? "Already Adopted"
                  : alreadyRequested
                    ? "You Already Requested"
                    : `Adopt ${pet.petName}`}
              </Button>
            </DialogTrigger>

           <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] mt-6 flex flex-col ">
  <DialogHeader className={`flex-shrink-0`}>
    <DialogTitle>Adopt {pet.petName}</DialogTitle>
  </DialogHeader>

 <div className="overflow-y-auto flex-1 pr-1">
   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    
    {/* Read-only fields - 2 column */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Pet ID</Label>
        <Input value={pet._id} disabled />
      </div>
      <div>
        <Label>Pet Name</Label>
        <Input value={pet.petName} disabled />
      </div>
      <div>
        <Label>Your Name</Label>
        <Input value={user.displayName} disabled />
      </div>
      <div>
        <Label>Your Email</Label>
        <Input value={user.email} disabled />
      </div>
    </div>

    {/* Pet Image - full width */}
    <div>
      <Label>Pet Image URL</Label>
      <Input value={pet.petImage} disabled />
    </div>

    {/* Editable fields - 2 column */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Phone Number</Label>
        <Input
          type="tel"
          placeholder="Enter your phone number"
          {...register("phone", { required: true })}
        />
      </div>
      <div>
        <Label>NID Number</Label>
        <Input
          placeholder="Enter your NID number"
          {...register("nid", { required: true })}
        />
      </div>
      <div>
        <Label>Occupation</Label>
        <Input
          placeholder="e.g. Engineer, Teacher"
          {...register("occupation", { required: true })}
        />
      </div>
      <div>
        <Label>House Type</Label>
        <select
          {...register("houseType", { required: true })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select house type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
        </select>
      </div>
      <div>
        <Label>Do you have a garden/yard?</Label>
        <select
          {...register("hasGarden", { required: true })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div>
        <Label>Do you have other pets?</Label>
        <select
          {...register("hasOtherPets", { required: true })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div className="col-span-2">
        <Label>Previous Pet Experience</Label>
        <select
          {...register("experience", { required: true })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select</option>
          <option value="none">No experience</option>
          <option value="some">Some experience</option>
          <option value="experienced">Very experienced</option>
        </select>
      </div>
    </div>

    {/* Address - full width */}
    <div>
      <Label>Address</Label>
      <Input
        placeholder="Enter your address"
        {...register("address", { required: true })}
      />
    </div>

    {/* Reason - full width */}
    <div>
      <Label>Reason for Adoption</Label>
      <textarea
        placeholder="Why do you want to adopt this pet?"
        {...register("reason", { required: true })}
        rows={3}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white resize-none"
      />
    </div>

    <Button
      type="submit"
      className="w-full bg-[#34B7A7] hover:bg-[#2fa99b] text-white"
    >
      Submit Adoption Request
    </Button>
  </form>
 </div>
</DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
