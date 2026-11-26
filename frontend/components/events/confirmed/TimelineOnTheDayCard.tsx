import React from 'react';
import { TimelineItem } from './types';

interface TimelineOnTheDayCardProps {
  items: TimelineItem[];
}

export default function TimelineOnTheDayCard({ items }: TimelineOnTheDayCardProps) {
  return (
    <aside className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Timeline on the day
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="text-[#4B5563] tabular-nums">{item.time}</span>
            <span className="font-medium text-[#1B2430] text-right">
              {item.activity}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
