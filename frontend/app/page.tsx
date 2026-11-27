import { PayoutAccountControl } from "@/components/vendor/payout-account-control";
import { PayoutHistory } from "@/components/vendor/payout-history";
import { PayoutNotice } from "@/components/vendor/payout-notice";
import { PayoutReceipts } from "@/components/vendor/payout-receipts";
import { PayoutSummary } from "@/components/vendor/payout-summary";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";

export default function Home() {
  return (
    <div className="vendor-app">
      <VendorSidebar />

      <main className="payouts-main" id="payouts">
        <header className="page-heading">
          <div>
            <h1>Payouts</h1>
            <p>One row per released stage. Commission is 5–10% depending on your plan.</p>
          </div>
          <PayoutAccountControl />
        </header>

        <PayoutSummary />
        <PayoutHistory />
        <PayoutNotice variant="info">
          Wickrama birthday, agreed LKR 100,000 at 10%: you receive 18,000 + 45,000
          + 27,000 = LKR 90,000. EventHub keeps LKR 10,000.
        </PayoutNotice>
        <PayoutNotice variant="error" role="status">
          Failed: the bank rejected the transfer for Fonseka anniversary. Update the
          payout account and it is retried automatically.
        </PayoutNotice>
        <PayoutReceipts />
      </main>
    </div>
  );
}
