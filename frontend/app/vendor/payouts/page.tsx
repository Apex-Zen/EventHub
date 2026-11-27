import React from 'react';

export default function VendorPayouts() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Payouts</h1>
          <p className="text-sm text-ink-600">
            One row per released stage. Commission is 5–10% depending on your plan.
          </p>
        </div>
        <button className="px-4 py-2 bg-white border border-line rounded-sm text-xs font-medium text-ink-900 hover:border-green-600 transition-colors self-start sm:self-auto">
          Payout account
        </button>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs text-ink-500 mb-1">Paid this month</p>
          <p className="text-2xl font-bold font-serif text-ink-900 mb-1">LKR 63,000</p>
          <p className="text-xs text-ink-400">2 payouts</p>
        </div>

        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs text-ink-500 mb-1">Pending</p>
          <p className="text-2xl font-bold font-serif text-ink-900 mb-1">LKR 59,400</p>
          <p className="text-xs text-ink-400">Sent to your bank within 3 working days</p>
        </div>

        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs text-ink-500 mb-1">Still held in escrow</p>
          <p className="text-2xl font-bold font-serif text-ink-900 mb-1">LKR 129,600</p>
          <p className="text-xs text-ink-400">Released at arrival and event completion</p>
        </div>
      </div>
    </div>
  );
}