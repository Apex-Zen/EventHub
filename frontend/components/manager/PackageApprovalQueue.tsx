'use client';

import React from 'react';
import Link from 'next/link';
import { PackageItem } from '../../services/managerApi';
import { CheckCircle2 } from 'lucide-react';

interface PackageApprovalQueueProps {
  packages: PackageItem[];
  onPackageUpdated?: () => void;
}

export const PackageApprovalQueue: React.FC<PackageApprovalQueueProps> = ({
  packages,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-2xs">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
        <h2 className="font-serif text-xl font-bold text-slate-900 tracking-tight">
          Package approval queue
        </h2>
        <Link
          href="/packages"
          className="text-xs font-medium text-slate-700 hover:text-[#266665] transition-colors"
        >
          Open queue
        </Link>
      </div>

      {/* Queue List */}
      <div className="divide-y divide-gray-100">
        {packages.map((pkg, index) => {
          const isPrimary = index === 0;
          const isApproved = pkg.status === 'approved';

          return (
            <div
              key={pkg.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[15px] text-slate-900">
                    {pkg.name}
                  </h3>
                  {isApproved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 size={11} /> Approved
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {pkg.dateStr}
                </p>
              </div>

              <div>
                {isApproved ? (
                  <span className="text-xs font-medium text-slate-400 px-4 py-2 block text-center">
                    Completed
                  </span>
                ) : (
                  <Link
                    href="/packages"
                    className={`inline-block text-center w-full sm:w-auto px-5 py-2 rounded text-xs font-medium transition-all ${
                      isPrimary
                        ? 'bg-[#266665] text-white hover:bg-[#1e5251] shadow-2xs'
                        : 'border border-gray-300 text-slate-700 hover:border-[#266665] hover:text-[#266665] bg-white'
                    }`}
                  >
                    Review
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