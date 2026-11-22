'use client';

import React from 'react';
import { CommissionStats } from '../../services/managerApi';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface CommissionCardProps {
  stats: CommissionStats;
}

export const CommissionCard: React.FC<CommissionCardProps> = ({ stats }) => {
  const rows = [
    { label: 'Gross bookings', value: stats.grossBookings, highlight: false },
    { label: stats.commissionRateText, value: stats.commission, highlight: true },
    { label: 'Paid out to vendors', value: stats.paidOutVendors, highlight: false },
    { label: 'Held in escrow', value: stats.heldInEscrow, highlight: false },
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <h2 className="font-serif text-xl font-bold text-slate-900 tracking-tight">
          Commission this month
        </h2>
        <span className="text-xs font-medium text-[#266665] flex items-center gap-1">
          <TrendingUp size={14} />
          +14.2% MoM
        </span>
      </div>

      <div className="space-y-3.5">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-sm py-0.5"
          >
            <span className="text-slate-600 font-normal">
              {row.label}
            </span>
            <span
              className={`font-semibold tracking-tight ${
                row.highlight ? 'text-[#266665]' : 'text-slate-900'
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Escrow & Payout Health Indicator */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span>Escrow Security Ratio</span>
          <span className="font-medium text-slate-600">100% Protected</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
          <div className="bg-[#266665] h-full" style={{ width: '60.7%' }} title="Paid out (60.7%)" />
          <div className="bg-amber-400 h-full" style={{ width: '28.6%' }} title="Held in Escrow (28.6%)" />
          <div className="bg-emerald-500 h-full" style={{ width: '10.7%' }} title="Commission (10.7%)" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#266665]" /> Paid Out
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> In Escrow
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Platform Fee
          </span>
        </div>
      </div>
    </div>
  );
};
