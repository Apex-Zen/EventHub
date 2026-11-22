'use client';

import React from 'react';
import Link from 'next/link';
import { Radio } from 'lucide-react';

interface DashboardHeaderProps {
  managerName?: string;
  dateLabel?: string;
  eventsThisWeek?: number;
}

export function DashboardHeader({
  managerName = 'Shehan',
  dateLabel = 'Saturday 24 October 2026',
  eventsThisWeek = 6,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Good morning, {managerName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {dateLabel} · {eventsThisWeek} events this week
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/war-room"
          className="inline-flex items-center gap-2 rounded-lg bg-[#266665] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1e5251]"
        >
          <Radio className="h-4 w-4" />
          Open War Room
        </Link>
      </div>
    </div>
  );
}