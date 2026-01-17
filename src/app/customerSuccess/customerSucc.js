'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CustomerSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const confirmPayment = async () => {
      const orderId = searchParams.get("order_id");

      if (!orderId) return;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_CUSTOMER_API_URL}/api/customer-order-confirm-payment`,
          { orderId },
        );

        const { status } = res.data;

        if (status === "SUCCESS") {
          await Swal.fire("Payment Successful", "Your order has been placed.", "success");
          router.push("/HomePage");
        } else {
          await Swal.fire("Payment Failed", "Please try again.", "error");
          router.push("/checkoutPage");
        }

      } catch (error) {
        console.error("Payment confirmation failed:", error);
        await Swal.fire("Error", "Payment confirmation failed", "error");
        router.push("/Checkout");
      }
    };

    confirmPayment();
  }, [searchParams, router]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-lg font-bold">Verifying your payment...</h1>
    </div>
  );
};

export default CustomerSuccessPage;
