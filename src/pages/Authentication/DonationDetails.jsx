import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";

const DonationDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [donorInfo, setDonorInfo] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: campaign,
    isLoading,
    refetch: refetchCampaign,
  } = useQuery({
    queryKey: ["donationDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-details/${id}`);
      return res.data;
    },
  });

  const { data: recommended = [] } = useQuery({
    queryKey: ["recommendedCampaigns"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-campaigns?limit=3&exclude=${id}`
      );
      return res.data;
    },
  });

  const onAmountSubmit = (formData) => {
    const amount = parseFloat(formData.amount);
    const remaining =
      campaign.maxDonationAmount - (campaign.donatedAmount || 0);

    if (isNaN(amount) || amount <= 0) {
      Swal.fire("Error", "Please enter a valid donation amount", "error");
      return;
    }

    if (amount > remaining) {
      Swal.fire(
        "Error",
        `Amount exceeds the remaining goal (৳${remaining})`,
        "error"
      );
      return;
    }

    setDonorInfo({
      donorName: user?.displayName || "Anonymous",
      donorEmail: user?.email || "N/A",
      amount,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (isProcessing) return;
    setIsProcessing(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setIsProcessing(false);
      return;
    }

    try {
      const { paymentMethod, error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
          billing_details: {
            name: donorInfo.donorName,
            email: donorInfo.donorEmail,
          },
        });

      if (paymentMethodError) {
        setPaymentError(paymentMethodError.message);
        setIsProcessing(false);
        return;
      }

      const amountInCents = Math.round(donorInfo.amount * 100);
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
      });

      const clientSecret = data.clientSecret;
      if (!clientSecret) {
        throw new Error("Failed to get client secret from backend");
      }

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        setPaymentError(confirmError.message);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const campaignOwnerEmail = campaign?.createdBy || "";

        if (!campaignOwnerEmail) {
          await Swal.fire(
            "Error",
            "Campaign owner email is missing. Cannot process donation.",
            "error"
          );
          setIsProcessing(false);
          return;
        }

        const donationInfo = {
          campaignId: campaign._id,
          campaignOwnerEmail,
          donorName: donorInfo.donorName,
          donorEmail: donorInfo.donorEmail,
          amount: donorInfo.amount,
          paymentMethodId: paymentIntent.payment_method,
          donatedAt: new Date(),
        };

        try {
          const res = await axiosSecure.post("/donations", donationInfo);
          if (res.data.insertedId) {
            await refetchCampaign();
            await Swal.fire({
              icon: "success",
              title: "Thank you for your donation!",
              timer: 1500,
              showConfirmButton: false,
              position: "top-end",
            });

            setDonorInfo(null);
            reset();
            setCardDetails(null);
            setIsDialogOpen(false);
          }
        } catch (error) {
          if (error.response?.status === 403) {
            Swal.fire("Donation Blocked", error.response.data.error, "warning");
          } else {
            Swal.fire("Error", error.message || "Donation failed", "error");
          }
        }
      }
    } catch (err) {
      await Swal.fire("Error", err.message || "Unknown error", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (!campaign)
    return (
      <p className="text-center text-red-500 font-medium">
        Campaign not found or failed to load.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <img
        src={campaign.petImage}
        alt={campaign.petName}
        className="w-full max-h-[400px] object-cover rounded-lg shadow mb-6"
      />
      <h2 className="text-3xl font-bold text-[#34B7A7] mb-2">
        {campaign.petName}
      </h2>
      <p>
        <strong>Max Donation:</strong> ৳{campaign.maxDonationAmount}
      </p>
      <p>
        <strong>Donated:</strong> ৳{campaign.donatedAmount || 0}
      </p>
      <p>
        <strong>Deadline:</strong>{" "}
        {new Date(campaign.donationDeadline).toLocaleDateString()}
      </p>
      {campaign.paused && (
        <p className="text-red-600 font-semibold my-4">
          ⚠️ This campaign is currently paused. Donations are not accepted at
          this time.
        </p>
      )}
      <p className="text-gray-700 mt-4 whitespace-pre-line">
        {campaign.longDescription}
      </p>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mt-6 bg-[#34B7A7] text-white hover:bg-[#2fa99b]"
            onClick={() => setIsDialogOpen(true)}
            disabled={campaign.paused}
          >
            Donate Now
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Donate to {campaign.petName}</DialogTitle>
          </DialogHeader>

          {!donorInfo ? (
            <form onSubmit={handleSubmit(onAmountSubmit)} className="space-y-4">
              <div>
                <Label>Your Name</Label>
                <Input
                  defaultValue={user?.displayName}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  defaultValue={user?.email}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label>Donation Amount (৳)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("amount", {
                    required: "Donation amount is required",
                    min: { value: 1, message: "Must be at least ৳1" },
                    max: {
                      value:
                        campaign.maxDonationAmount -
                        (campaign.donatedAmount || 0),
                      message: "Amount exceeds remaining goal",
                    },
                  })}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <Button className="w-full bg-[#34B7A7] text-white">
                Continue to Payment
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              <p className="text-sm text-gray-600">
                Name: {donorInfo.donorName}
              </p>
              <p className="text-sm text-gray-600">
                Email: {donorInfo.donorEmail}
              </p>
              <p className="text-sm text-gray-600">
                Amount: ৳{donorInfo.amount}
              </p>

              <div>
                <Label>Card Details</Label>
                <div className="border rounded px-3 py-2 bg-white">
                  <CardElement />
                </div>
              </div>

              {paymentError && (
                <p className="text-red-500 text-sm">{paymentError}</p>
              )}

              {cardDetails && (
                <p className="text-green-600 text-sm mt-2">
                  Card: {cardDetails.brand.toUpperCase()} ending with{" "}
                  {cardDetails.last4}
                </p>
              )}

              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-[#34B7A7] text-white"
              >
                {isProcessing ? "Processing..." : "Confirm Donation"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6 text-[#34B7A7]">
          Recommended Campaigns
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((item) => (
            <div key={item._id} className="border rounded-lg shadow p-4">
              <img
                src={item.petImage}
                alt={item.petName}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h4 className="text-xl font-bold text-[#34B7A7]">
                {item.petName}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.shortDescription}
              </p>
              <p className="text-sm mt-2">
                <strong>Goal:</strong> ৳{item.maxDonationAmount}
              </p>
              <Button
                className="mt-2 bg-[#34B7A7] text-white hover:bg-[#2fa99b]"
                onClick={() =>
                  (window.location.href = `/donation-details/${item._id}`)
                }
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;
