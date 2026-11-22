'use client';

import React from 'react';
import Link from 'next/link';
import { AlertItem } from '../../services/managerApi';

interface AlertsCardProps {
  alerts: AlertItem[];
  onAlertUpdated?: () => void;
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ alerts }) => {
  const getHref = (badgeType: AlertItem['badgeType']) => {
    if (badgeType === 'incident') return '/war-room';
    if (badgeType === 'check') return '/vendors';
    return '/disputes';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-2xs">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
        <h2 className="font-serif text-xl font-bold text-slate-900 tracking-tight">
          Alerts
        </h2>
        <span className="text-xs text-slate-400">
          Real-time stream
        </span>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-100">
        {alerts.map((alt) => {
          if (alt.resolved) return null;

          return (
            <div
              key={alt.id}
              className="py-4 flex items-center justify-between gap-3"
            >
              <div>
                <h3 className="font-medium text-[15px] text-slate-900">
                  {alt.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {alt.subtitle}
                </p>
              </div>

              <div>
                {alt.badgeType === 'incident' ? (
                  <Link
                    href={getHref(alt.badgeType)}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                  >
                    {alt.badgeText}
                  </Link>
                ) : (
                  <Link
                    href={getHref(alt.badgeType)}
                    className="text-xs font-medium text-slate-700 hover:text-[#266665] transition-colors px-2 py-1"
                  >
                    {alt.badgeText}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};