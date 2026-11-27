"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  isPaymentEventId,
  isPaymentType,
  type PaymentEntry,
  type PaymentEventId,
} from "@/lib/payment-data";
import { PaymentProgress } from "./payment-progress";

export function PaymentProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventParam = searchParams.get("event");
  const paidTypeParam = searchParams.get("paidType");
  const urlEvent = isPaymentEventId(eventParam) ? eventParam : "wedding";
  const paidType = isPaymentType(paidTypeParam) ? paidTypeParam : undefined;
  const paymentTime = searchParams.get("paidAt") ?? undefined;
  const [selectedEvent, setSelectedEvent] = useState<PaymentEventId | null>(
    null,
  );
  const activeEvent = selectedEvent ?? urlEvent;

  function handlePayNow(entry: PaymentEntry) {
    const type = entry.payment.toLowerCase().includes("deposit")
      ? "deposit"
      : "balance";
    const params = new URLSearchParams({
      event: activeEvent,
      type,
    });
    router.push(`/card-payment?${params.toString()}`);
  }

  return (
    <DashboardLayout>
      <PaymentProgress
        activeEvent={activeEvent}
        onEventChange={setSelectedEvent}
        onPayNow={handlePayNow}
        paidEvent={urlEvent}
        paidType={paidType}
        paymentTime={paymentTime}
      />
    </DashboardLayout>
  );
}
