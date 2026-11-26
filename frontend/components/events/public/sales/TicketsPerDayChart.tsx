import React from 'react';
import { DailyTicketSale } from './types';

interface TicketsPerDayChartProps {
  data: DailyTicketSale[];
}

export default function TicketsPerDayChart({ data }: TicketsPerDayChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-6">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Tickets sold per day
      </h2>

      <div className="flex items-end justify-between gap-2 sm:gap-3 h-44 pt-6">
        {data.map((item) => {
          const heightPct = Math.max(12, Math.round((item.count / maxCount) * 100));

          return (
            <div
              key={item.dateLabel}
              className="flex flex-1 flex-col items-center justify-end h-full gap-1.5"
            >
              <span className="text-xs font-medium tabular-nums text-[#4B5563]">
                {item.count}
              </span>
              <div
                className={`w-full max-w-[36px] rounded-t-sm transition-all ${
                  item.isLatest ? 'bg-[#266665]' : 'bg-[#DBECEC]'
                }`}
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[11px] text-[#4B5563] whitespace-nowrap pt-1">
                {item.dateLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
