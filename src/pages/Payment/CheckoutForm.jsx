import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Input } from "@/components/ui";
import Swal from "sweetalert2";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const CheckoutForm = ({ campaign, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (amount <= 0 || amount > (campaign.maxDonationAmount - campaign.donatedAmount)) {
      Swal.fire("Error", "Please enter a valid donation amount.", "error");
      return;
    }

    setLoading(true);

    // Here you create a payment intent on your backend with the amount
    try {
      const { data: clientSecret } = await axiosSecure.post("/create-payment-intent", { amount: Number(amount) * 100 }); // amount in cents

      const card = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            // Optionally, add more user info here
          },
        },
      });

      if (paymentResult.error) {
        Swal.fire("Error", paymentResult.error.message, "error");
        setLoading(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        // Save donation info to backend
        await axiosSecure.post("/donations", {
          campaignId: campaign._id,
          amount: Number(amount),
          transactionId: paymentResult.paymentIntent.id,
          donorEmail: "currentUserEmail@example.com", // Replace with logged-in user email
          donorName: "Current User Name", // Replace with logged-in user name
          donatedAt: new Date().toISOString(),
        });

        Swal.fire("Success", "Thank you for your donation!", "success");
        setAmount("");
        onSuccess();
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        min={1}
        max={campaign.maxDonationAmount - campaign.donatedAmount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Enter amount (max ${campaign.maxDonationAmount - campaign.donatedAmount})`}
        required
      />
      <CardElement className="p-3 border border-gray-300 rounded" />
      <Button type="submit" disabled={!stripe || loading} className="w-full bg-[#34B7A7]">
        {loading ? "Processing..." : "Donate"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
