import React from 'react';
import { TierSalesRow } from './types';

interface SalesByTierCardProps {
  rows: TierSalesRow[];
}

export default function SalesByTierCard({ rows }: SalesByTierCardProps) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        By tier
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#DBECEC]/60 text-xs font-medium text-[#4B5563]">
              <th className="py-2.5 px-3.5 rounded-l-md">Tier</th>
              <th className="py-2.5 px-3.5 text-right">Price</th>
              <th className="py-2.5 px-3.5 text-right">Sold</th>
              <th className="py-2.5 px-3.5 text-right">Left</th>
              <th className="py-2.5 px-3.5 text-right">Revenue</th>
              <th className="py-2.5 px-3.5 rounded-r-md">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="py-3.5 px-3.5 font-medium text-[#1B2430]">
                  {row.tier}
                </td>
                <td className="py-3.5 px-3.5 text-right tabular-nums text-[#4B5563]">
                  {row.price.toLocaleString()}
                </td>
                <td className="py-3.5 px-3.5 text-right tabular-nums text-[#1B2430]">
                  {row.sold}
                </td>
                <td className="py-3.5 px-3.5 text-right tabular-nums text-[#4B5563]">
                  {row.left}
                </td>
                <td className="py-3.5 px-3.5 text-right tabular-nums font-medium text-[#1B2430]">
                  {row.revenue.toLocaleString()}
                </td>
                <td className="py-3.5 px-3.5">
                  <div className="flex items-center gap-2.5 min-w-[110px]">
                    <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#266665]"
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-[#4B5563] w-8 text-right">
                      {row.progress}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
