'use client';

import React from 'react';
import { KpiMetrics } from '../../services/managerApi';

interface KpiSummaryGridProps {
  metrics: KpiMetrics;
  onFilterClick?: (type: string) => void;
}

export const KpiSummaryGrid: React.FC<KpiSummaryGridProps> = ({
  metrics,
  onFilterClick,
}) => {
  const cards = [
    {
      id: 'live_events',
      title: 'Live events',
      count: metrics.liveEvents.count,
      subtext: metrics.liveEvents.subtext,
      badgeColor: 'bg-emerald-500',
    },
    {
      id: 'packages_to_approve',
      title: 'Packages to approve',
      count: metrics.packagesToApprove.count,
      subtext: metrics.packagesToApprove.subtext,
      badgeColor: 'bg-[#266665]',
    },
    {
      id: 'vendors_to_verify',
      title: 'Vendors to verify',
      count: metrics.vendorsToVerify.count,
      subtext: metrics.vendorsToVerify.subtext,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'open_disputes',
      title: 'Open disputes',
      count: metrics.openDisputes.count,
      subtext: metrics.openDisputes.subtext,
      badgeColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onFilterClick && onFilterClick(card.id)}
          className="bg-white rounded-lg p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer relative overflow-hidden group"
        >
          {/* Subtle top indicator bar */}
          <div className="text-slate-500 text-xs font-normal">
            {card.title}
          </div>
          <div className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight my-2">
            {card.count}
          </div>
          <div className="text-slate-400 text-xs">
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
};
