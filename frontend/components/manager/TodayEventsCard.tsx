'use client';

import React from 'react';
import Link from 'next/link';
import { TodayEventItem } from '../../services/managerApi';

interface TodayEventsCardProps {
  events: TodayEventItem[];
}

export const TodayEventsCard: React.FC<TodayEventsCardProps> = ({ events }) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
        <h2 className="font-serif text-xl font-bold text-slate-900 tracking-tight">
          Today
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          Live Monitoring
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {events.map((evt) => {
          const isLive = evt.badge === 'Live';
          const isStage3 = evt.badge === 'Stage 3';

          return (
            <Link
              key={evt.id}
              href={isLive ? '/war-room' : '/packages'}
              className="py-4 flex items-center justify-between gap-3 group hover:bg-slate-50/60 -mx-2 px-2 rounded-md transition-colors"
            >
              <div>
                <h3 className="font-medium text-[15px] text-slate-900 group-hover:text-[#266665] transition-colors">
                  {evt.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {evt.statusNote}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isLive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Live
                  </span>
                )}
                {isStage3 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                    Stage 3
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};