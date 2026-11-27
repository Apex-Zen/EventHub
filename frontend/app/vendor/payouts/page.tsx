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

      {/* Payouts Table */}
      <div className="bg-white rounded-sm shadow-sm border border-line overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line text-[11px] font-medium text-ink-500">
                <th className="py-3.5 px-5">Event</th>
                <th className="py-3.5 px-5">Stage</th>
                <th className="py-3.5 px-5">Gross</th>
                <th className="py-3.5 px-5">Commission</th>
                <th className="py-3.5 px-5">Net</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs">
              <tr>
                <td className="py-4 px-5 font-medium text-ink-900">Perera–Silva wedding</td>
                <td className="py-4 px-5 text-ink-600">1 · 20%</td>
                <td className="py-4 px-5 text-ink-600">36,000</td>
                <td className="py-4 px-5 text-ink-600">3,600 (10%)</td>
                <td className="py-4 px-5 font-medium text-ink-900">32,400</td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-0.5 border border-amber-400 bg-amber-50 text-amber-800 rounded-sm text-[11px] font-medium">
                    Pending
                  </span>
                </td>
                <td className="py-4 px-5 text-ink-500">19 Oct</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-ink-900">Wickrama birthday</td>
                <td className="py-4 px-5 text-ink-600">3 · 30%</td>
                <td className="py-4 px-5 text-ink-600">30,000</td>
                <td className="py-4 px-5 text-ink-600">3,000 (10%)</td>
                <td className="py-4 px-5 font-medium text-ink-900">27,000</td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-0.5 border border-amber-400 bg-amber-50 text-amber-800 rounded-sm text-[11px] font-medium">
                    Pending
                  </span>
                </td>
                <td className="py-4 px-5 text-ink-500">8 Nov</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-ink-900">Wickrama birthday</td>
                <td className="py-4 px-5 text-ink-600">2 · 50%</td>
                <td className="py-4 px-5 text-ink-600">50,000</td>
                <td className="py-4 px-5 text-ink-600">5,000 (10%)</td>
                <td className="py-4 px-5 font-medium text-ink-900">45,000</td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-0.5 border border-green-500 bg-green-50 text-green-800 rounded-sm text-[11px] font-medium">
                    Paid
                  </span>
                </td>
                <td className="py-4 px-5 text-ink-500">7 Nov</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-ink-900">Wickrama birthday</td>
                <td className="py-4 px-5 text-ink-600">1 · 20%</td>
                <td className="py-4 px-5 text-ink-600">20,000</td>
                <td className="py-4 px-5 text-ink-600">2,000 (10%)</td>
                <td className="py-4 px-5 font-medium text-ink-900">18,000</td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-0.5 border border-green-500 bg-green-50 text-green-800 rounded-sm text-[11px] font-medium">
                    Paid
                  </span>
                </td>
                <td className="py-4 px-5 text-ink-500">21 Oct</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-ink-900">Fonseka anniversary</td>
                <td className="py-4 px-5 text-ink-600">1 · 20%</td>
                <td className="py-4 px-5 text-ink-600">15,000</td>
                <td className="py-4 px-5 text-ink-600">1,500 (10%)</td>
                <td className="py-4 px-5 font-medium text-ink-900">13,500</td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-0.5 border border-red-400 bg-red-50 text-red-700 rounded-sm text-[11px] font-medium">
                    Failed
                  </span>
                </td>
                <td className="py-4 px-5 text-ink-500">14 Oct</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Note Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-100/80 border border-line rounded-sm text-xs font-mono text-ink-600 leading-relaxed">
          Wickrama birthday, agreed LKR 100,000 at 10%: vendor receives 18,000 + 45,000 + 27,000 = LKR 90,000. EventHub keeps LKR 10,000.
        </div>
        <div className="p-4 bg-gray-100/80 border border-line rounded-sm text-xs font-mono text-ink-600 leading-relaxed">
          Failed: the bank rejected the transfer for Fonseka anniversary. Update the payout account and it is retried automatically.
        </div>
      </div>
    </div>
  );
}