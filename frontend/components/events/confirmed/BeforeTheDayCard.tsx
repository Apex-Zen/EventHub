'use client';

import React from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { BeforeTheDayItem } from './types';

interface BeforeTheDayCardProps {
  items: BeforeTheDayItem[];
}

export default function BeforeTheDayCard({ items }: BeforeTheDayCardProps) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Before the day
      </h2>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-1"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1B2430]">
                {item.title}
              </p>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
                {item.subtitle}
              </p>
            </div>

            <div className="flex-shrink-0">
              {item.badgeText ? (
                <StatusBadge
                  text={item.badgeText}
                  variant={item.badgeVariant || 'gray'}
                />
              ) : item.actionLabel && item.actionHref ? (
                <Link
                  href={item.actionHref}
                  className="text-sm font-medium text-[#266665] hover:text-[#123B3A] transition-colors no-underline"
                >
                  {item.actionLabel}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
