"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  formatPaymentTime,
  getCheckoutAmount,
  isPaymentEventId,
  isPaymentType,
} from "@/lib/payment-data";
import { PaymentCheckout } from "./payment-checkout";
import { PaymentDeclined } from "./payment-declined";
import type { PaymentSubmission } from "./payment-form";

type PaymentScreen = "checkout" | "declined";

export function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventParam = searchParams.get("event");
  const typeParam = searchParams.get("type");
  const eventId = isPaymentEventId(eventParam) ? eventParam : "wedding";
  const paymentType = isPaymentType(typeParam) ? typeParam : "deposit";
  const amount = getCheckoutAmount(eventId, paymentType);

  const [screen, setScreen] = useState<PaymentScreen>("checkout");
  const [cardBrand, setCardBrand] = useState("");
  const [cardEnding, setCardEnding] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const paymentTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (paymentTimer.current !== null) {
        window.clearTimeout(paymentTimer.current);
      }
    },
    [],
  );

  function submitPayment(payment: PaymentSubmission) {
    if (paymentTimer.current !== null) {
      window.clearTimeout(paymentTimer.current);
    }
    setIsCancelled(false);
    setIsProcessing(true);
    setCardBrand(payment.cardBrand);
    setCardEnding(payment.cardEnding);

    paymentTimer.current = window.setTimeout(() => {
      paymentTimer.current = null;
      setIsProcessing(false);
      const completedAt = formatPaymentTime(new Date());
      if (payment.simulateDecline) {
        setPaidAt(completedAt);
        setScreen("declined");
        return;
      }

      const params = new URLSearchParams({
        event: eventId,
        paidType: paymentType,
        paidAt: completedAt,
      });
      router.push(`/payment-progress?${params.toString()}`);
    }, 1100);
  }

  function cancelPayment() {
    if (paymentTimer.current !== null) {
      window.clearTimeout(paymentTimer.current);
      paymentTimer.current = null;
    }
    setIsCancelled(true);
    setIsProcessing(false);
    setCardBrand("");
    setCardEnding("");
    setPaidAt(formatPaymentTime(new Date()));
    setScreen("declined");
  }

  function returnToCheckout() {
    if (paymentTimer.current !== null) {
      window.clearTimeout(paymentTimer.current);
      paymentTimer.current = null;
    }
    setIsCancelled(false);
    setCardBrand("");
    setCardEnding("");
    setPaidAt("");
    setIsProcessing(false);
    setFormKey((key) => key + 1);
    setScreen("checkout");
  }

  if (screen === "declined") {
    return (
      <DashboardLayout>
        <PaymentDeclined
          amount={amount}
          cardBrand={cardBrand}
          cardEnding={cardEnding}
          paidAt={paidAt}
          isCancelled={isCancelled}
          onRetry={returnToCheckout}
        />
      </DashboardLayout>
    );
  }

  return (
    <PaymentCheckout
      key={formKey}
      amount={amount}
      isProcessing={isProcessing}
      onCancel={cancelPayment}
      onSubmit={submitPayment}
    />
  );
}
