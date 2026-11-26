import React from 'react';
import { SalesKpiItem } from './types';

interface SalesKpiRowProps {
  items: SalesKpiItem[];
}

export default function SalesKpiRow({ items }: SalesKpiRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-1.5"
        >
          <p className="text-xs font-medium text-[#4B5563]">{item.label}</p>
          <p className="font-serif text-2xl sm:text-[26px] font-bold text-[#1B2430] tabular-nums leading-tight">
            {item.value}
          </p>
          <p className="text-xs text-[#4B5563]">{item.subtext}</p>
        </div>
      ))}
    </div>
  );
}
