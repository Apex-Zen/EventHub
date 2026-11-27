"use client";

import { useState } from "react";
import { receipts, receiptYears } from "@/lib/receipt-data";
import { PrintButton } from "@/components/ui/print-button";
import { ReceiptFilters } from "./receipt-filters";
import { ReceiptTable } from "./receipt-table";

const receiptEvents = [...new Set(receipts.map((receipt) => receipt.event))];

export function ReceiptsContent() {
  const [eventFilter, setEventFilter] = useState("All events");
  const [year, setYear] = useState("2026");

  const visibleReceipts = receipts.filter((receipt) => {
    const matchesEvent =
      eventFilter === "All events" || receipt.event === eventFilter;
    const matchesYear = receipt.number.includes(`-${year}-`);
    return matchesEvent && matchesYear;
  });

  return (
    <div className="receipts-page">
      <div className="receipts-heading">
        <div>
          <h1>Payment receipts</h1>
          <p>Every card payment you made on EventHub. Each receipt is a PDF.</p>
        </div>
        <PrintButton className="download-all-button">
          Download all (ZIP)
        </PrintButton>
      </div>

      <ReceiptFilters
        events={receiptEvents}
        years={receiptYears}
        eventFilter={eventFilter}
        year={year}
        onEventChange={(event) => setEventFilter(event.target.value)}
        onYearChange={(event) => setYear(event.target.value)}
      />
      <ReceiptTable receipts={visibleReceipts} />
      <p className="failed-payments-note">
        Failed payments are not listed here. They show in Payments with the
        reason.
      </p>
    </div>
  );
}
