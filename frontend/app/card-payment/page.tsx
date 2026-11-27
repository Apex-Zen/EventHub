import { Suspense } from "react";
import { PaymentPage } from "@/components/payments/payment-page";

export default function CardPaymentPage() {
  return (
    <Suspense>
      <PaymentPage />
    </Suspense>
  );
}
