/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import PetDetailsSkeleton from "@/skeleton/PetDetailsSkeleton";
import axios from "axios";

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const [donorInfo, setDonorInfo] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [expenseReceiptUrl, setExpenseReceiptUrl] = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: registerExpense, handleSubmit: handleExpenseSubmit, reset: resetExpense } = useForm();

  const { data: campaign, isLoading, refetch: refetchCampaign } = useQuery({
    queryKey: ["donationDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-details/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: expenses = [], refetch: refetchExpenses } = useQuery({
    queryKey: ["campaignExpenses", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-campaigns/${id}/expenses`);
     return res.data.expenses || [];
    },
    enabled: !!id,
  });

  const { data: recommended = [] } = useQuery({
    queryKey: ["recommendedCampaigns", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-campaigns?limit=3&exclude=${id}`);
      const campaigns = res.data?.campaigns;
      return Array.isArray(campaigns) ? campaigns : [];
    },
    enabled: !!id,
  });

  const isOwner = user?.email === campaign?.createdBy;

  // Receipt image upload
  const handleReceiptUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setUploadingReceipt(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Upload_Key}`,
        formData
      );
      setExpenseReceiptUrl(res.data.data.url);
    } catch (err) {
      Swal.fire("Error", "Receipt upload failed", "error");
    } finally {
      setUploadingReceipt(false);
    }
  };



  // Add expense
  const handleAddExpense = async (data) => {
    if (!expenseReceiptUrl) {
      Swal.fire("Error", "Please upload a receipt image", "error");
      return;
    }

    try {
      await axiosSecure.post(`/donation-campaigns/${id}/expenses`, {
        title: data.expenseTitle,
        amount: parseFloat(data.expenseAmount),
        receiptImage: expenseReceiptUrl,
      });

      await Swal.fire({
        icon: "success",
        title: "Expense Added!",
        showConfirmButton: false,
        timer: 1500,
      });

      resetExpense();
      setExpenseReceiptUrl(null);
      setIsExpenseDialogOpen(false);
      refetchExpenses();
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.error || "Failed to add expense", "error");
    }
  };

 
const handleDeleteExpense = async (expenseId) => {
  const confirm = await Swal.fire({
    title: "Delete this expense?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#34B7A7",
    confirmButtonText: "Yes, delete",
  });

  if (!confirm.isConfirmed) return;

  try {
    await axiosSecure.delete(`/donation-campaigns/${id}/expenses/${expenseId}`);
    refetchExpenses();
  } catch (err) {
    Swal.fire("Error", err?.response?.data?.error || "Failed to delete", "error");
  }
};

  const onAmountSubmit = (formData) => {
    if (!campaign) return;
    const amount = parseFloat(formData.amount);
    const remaining = campaign.maxDonationAmount - (campaign.donatedAmount || 0);

    if (isNaN(amount) || amount <= 0) {
      Swal.fire("Error", "Please enter a valid donation amount", "error");
      return;
    }
    if (amount > remaining) {
      Swal.fire("Error", `Amount exceeds the remaining goal (৳${remaining.toFixed(2)})`, "error");
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

    if (!stripe || !elements) { setIsProcessing(false); return; }
    const card = elements.getElement(CardElement);
    if (!card) { setIsProcessing(false); return; }

    try {
      const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: { name: donorInfo.donorName, email: donorInfo.donorEmail },
      });

      if (paymentMethodError) {
        setPaymentError(paymentMethodError.message);
        setIsProcessing(false);
        return;
      }

      setCardDetails({ brand: paymentMethod.card.brand, last4: paymentMethod.card.last4 });

      const amountInCents = Math.round(donorInfo.amount * 100);
      const { data } = await axiosSecure.post("/create-payment-intent", { amountInCents });
      const clientSecret = data.clientSecret;
      if (!clientSecret) throw new Error("Failed to get client secret from backend");

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
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
          await Swal.fire("Error", "Campaign owner email is missing.", "error");
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
              text: "Redirecting to My Donations...",
              timer: 1500,
              showConfirmButton: false,
              position: "top-end",
            });
            setDonorInfo(null);
            reset();
            setCardDetails(null);
            setIsDialogOpen(false);
            navigate("/dashboard/my-donations");
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

  if (isLoading) return <div className="flex justify-center items-center"><PetDetailsSkeleton /></div>;
  if (!campaign) return <p className="text-center text-red-500 font-medium">Campaign not found.</p>;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="max-w-4xl mt-12 mx-auto py-10 px-4">

      {/* Campaign Image */}
      <img src={campaign.petImage} alt={campaign.petName} className="w-full max-h-[400px] object-cover rounded-lg shadow mb-6" />

      {/* Campaign Basic Info */}
      <h2 className="text-3xl font-bold text-[#34B7A7] mb-4">{campaign.petName}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm">
        <p><strong>Max Donation:</strong> ৳{campaign.maxDonationAmount.toFixed(2)}</p>
        <p><strong>Donated:</strong> ৳{(campaign.donatedAmount || 0).toFixed(2)}</p>
        <p><strong>Remaining:</strong> ৳{(campaign.maxDonationAmount - (campaign.donatedAmount || 0)).toFixed(2)}</p>
        <p><strong>Deadline:</strong> {new Date(campaign.donationDeadline).toLocaleDateString()}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="bg-[#34B7A7] h-3 rounded-full transition-all"
          style={{ width: `${Math.min(((campaign.donatedAmount || 0) / campaign.maxDonationAmount) * 100, 100)}%` }}
        />
      </div>

      {/* Campaign Owner Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-[#34B7A7] mb-3">Campaign Owner Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p><strong>Name:</strong> {campaign.ownerName || "N/A"}</p>
          <p><strong>Email:</strong> {campaign.ownerEmail || campaign.createdBy}</p>
          <p><strong>Phone:</strong> {campaign.ownerPhone || "N/A"}</p>
          <p><strong>Type:</strong> <span className="capitalize">{campaign.donorType === "rescue_center" ? "Rescue Center" : "Individual"}</span></p>

          {/* Individual specific */}
          {campaign.donorType === "individual" && (
            <p><strong>NID:</strong> {campaign.ownerNID || "N/A"}</p>
          )}

          {/* Rescue Center specific */}
          {campaign.donorType === "rescue_center" && (
            <>
              <p><strong>Organization:</strong> {campaign.organizationName || "N/A"}</p>
              <p><strong>Reg. No:</strong> {campaign.registrationNumber || "N/A"}</p>
              <p><strong>Address:</strong> {campaign.organizationAddress || "N/A"}</p>
              {campaign.website && <p><strong>Website:</strong> <a href={campaign.website} target="_blank" rel="noreferrer" className="text-[#34B7A7] underline">{campaign.website}</a></p>}
            </>
          )}

          <p className="sm:col-span-2"><strong>Reason for Donation:</strong> {campaign.reasonForDonation || "N/A"}</p>
        </div>
      </div>

      {/* Long Description */}
     <div 
  className="text-gray-700 dark:text-white whitespace-pre-line mb-6"
  dangerouslySetInnerHTML={{ __html: campaign.longDescription }} 
/>

      {campaign.paused && (
        <p className="text-red-600 font-semibold my-4">⚠️ This campaign is currently paused. Donations are not accepted.</p>
      )}

      {/* Donate Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#34B7A7] text-white hover:bg-[#2fa99b]" disabled={campaign.paused}>
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
                <Input defaultValue={user?.displayName} readOnly className="bg-gray-100" />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue={user?.email} readOnly className="bg-gray-100" />
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
                      value: campaign.maxDonationAmount - (campaign.donatedAmount || 0),
                      message: "Amount exceeds remaining goal",
                    },
                  })}
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
              </div>
              <Button className="w-full bg-[#34B7A7] text-white">Continue to Payment</Button>
            </form>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              <p className="text-sm text-gray-600">Name: {donorInfo.donorName}</p>
              <p className="text-sm text-gray-600">Email: {donorInfo.donorEmail}</p>
              <p className="text-sm text-gray-600">Amount: ৳{donorInfo.amount.toFixed(2)}</p>
              <div>
                <Label>Card Details</Label>
                <div className="border rounded px-3 py-2 bg-white">
                  <CardElement onChange={(e) => {
                    if (e.complete) { setCardDetails({ brand: e.brand, last4: e.card?.last4 || "" }); setPaymentError(null); }
                    else if (e.error) { setPaymentError(e.error.message); }
                    else { setPaymentError(null); }
                  }} />
                </div>
              </div>
              {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
              {cardDetails && <p className="text-green-600 text-sm">Card: {cardDetails.brand?.toUpperCase()} ending with {cardDetails.last4}</p>}
              <Button type="submit" disabled={!stripe || isProcessing} className="w-full bg-[#34B7A7] text-white">
                {isProcessing ? "Processing..." : "Confirm Donation"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== EXPENSE LOG ===== */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-xl font-semibold text-[#34B7A7]">Expense Log</h3>
          {isOwner && (
            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#34B7A7] text-white hover:bg-[#2fa99b]" size="sm">
                  + Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleExpenseSubmit(handleAddExpense)} className="space-y-4">
                  <div>
                    <Label>Expense Title</Label>
                    <Input
                      placeholder="e.g. Vet bill, Medicine, Food"
                      {...registerExpense("expenseTitle", { required: true })}
                    />
                  </div>
                  <div>
                    <Label>Amount (৳)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      {...registerExpense("expenseAmount", { required: true, min: 1 })}
                    />
                  </div>
                  <div>
                    <Label>Receipt Image</Label>
                    <Input type="file" accept="image/*" onChange={handleReceiptUpload} />
                    {uploadingReceipt && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                    {expenseReceiptUrl && (
                      <img src={expenseReceiptUrl} alt="Receipt" className="w-24 h-24 mt-2 object-cover rounded border" />
                    )}
                  </div>
                  <Button type="submit" className="w-full bg-[#34B7A7] text-white" disabled={uploadingReceipt}>
                    Add Expense
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-sm">No expenses recorded yet.</p>
        ) : (
          <>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                  <img src={expense.receiptImage} alt="Receipt" className="w-16 h-16 object-cover rounded border cursor-pointer"
                    onClick={() => window.open(expense.receiptImage, "_blank")} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{expense.title}</p>
                    <p className="text-sm text-gray-500">{new Date(expense.addedAt).toLocaleDateString("en-BD")}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
  <p className="font-semibold text-[#34B7A7]">৳{expense.amount.toFixed(2)}</p>
  {isOwner && (
    <button
      onClick={() => handleDeleteExpense(expense.id)}
      className="text-red-400 hover:text-red-600 transition-colors"
      title="Delete expense"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )}
</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Donated: <span className="text-[#34B7A7]">৳{(campaign.donatedAmount || 0).toFixed(2)}</span>
              </p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Expenses: <span className="text-red-500">৳{totalExpenses.toFixed(2)}</span>
              </p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Remaining Balance: <span className="text-green-600">৳{((campaign.donatedAmount || 0) - totalExpenses).toFixed(2)}</span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Recommended Campaigns */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold mb-6 text-[#34B7A7]">Recommended Campaigns</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((item) => (
            <div key={item._id} className="border rounded-lg shadow p-4">
              <img src={item.petImage} alt={item.petName} className="w-full h-40 object-cover rounded mb-3" />
              <h4 className="text-xl font-bold text-[#34B7A7]">{item.petName}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 dark:text-white">{item.shortDescription}</p>
              <p className="text-sm mt-2"><strong>Goal:</strong> ৳{item.maxDonationAmount.toFixed(2)}</p>
              <Button className="mt-2 bg-[#34B7A7] text-white hover:bg-[#2fa99b]" onClick={() => navigate(`/donation-details/${item._id}`)}>
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