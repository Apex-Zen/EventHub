import React from 'react';
import { PurchaseRow } from './types';

interface LatestPurchasesCardProps {
  purchases: PurchaseRow[];
}

export default function LatestPurchasesCard({ purchases }: LatestPurchasesCardProps) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
          Latest purchases
        </h2>
        <p className="text-xs text-[#4B5563]">
          Each row is one QR pass per ticket.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#DBECEC]/60 text-xs font-medium text-[#4B5563]">
              <th className="py-2.5 px-4 rounded-l-md">Time</th>
              <th className="py-2.5 px-4">Buyer</th>
              <th className="py-2.5 px-4">Tier</th>
              <th className="py-2.5 px-4">Qty</th>
              <th className="py-2.5 px-4 rounded-r-md">Pass</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {purchases.map((row) => (
              <tr key={row.id}>
                <td className="py-3.5 px-4 text-[#4B5563] whitespace-nowrap">
                  {row.time}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#1B2430]">
                  {row.buyer}
                </td>
                <td className="py-3.5 px-4 text-[#4B5563]">{row.tier}</td>
                <td className="py-3.5 px-4 tabular-nums text-[#1B2430]">
                  {row.qty}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs sm:text-sm text-[#1B2430]">
                  {row.passCode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
