
'use client';

import React from 'react';
import { PackageRecord } from '../../services/packagesApi';

interface PackageListTableProps {
  packages: PackageRecord[];
  activeTab: 'waiting' | 'approved' | 'rejected';
  selectedId?: string;
  onSelectPackage: (id: string) => void;
}

export function PackageListTable({
  packages,
  activeTab,
  selectedId,
  onSelectPackage,
}: PackageListTableProps) {
  return (
    <div className="lg:col-span-7 bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden">
      {packages.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          No packages in the {activeTab} queue.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#e2edec] text-slate-500 font-semibold tracking-wider uppercase text-[11px] border-b border-gray-100">
                <th className="py-3 px-4 sm:px-5 font-semibold">EVENT</th>
                <th className="py-3 px-3 font-semibold">DATE</th>
                <th className="py-3 px-3 font-semibold">TOTAL</th>
                <th className="py-3 px-3 font-semibold">
                  {activeTab === 'waiting'
                    ? 'WAITING'
                    : activeTab === 'approved'
                    ? 'STATUS'
                    : 'REASON'}
                </th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map((pkg) => {
                const isSelected = selectedId === pkg.id;
                return (
                  <tr
                    key={pkg.id}
                    onClick={() => onSelectPackage(pkg.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-5 max-w-[200px]">
                      <div className="font-semibold text-slate-900 text-[13px] truncate">
                        {pkg.name}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5 truncate">
                        {pkg.clientSubtitle}
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-700 whitespace-nowrap">
                      {pkg.date}
                    </td>
                    <td className="py-4 px-3 font-normal text-slate-800 whitespace-nowrap">
                      {pkg.total}
                    </td>
                    <td className="py-4 px-3 text-slate-500 whitespace-nowrap">
                      {activeTab === 'waiting' && pkg.waitingTime}
                      {activeTab === 'approved' && (
                        <span className="text-emerald-700 font-medium">Approved</span>
                      )}
                      {activeTab === 'rejected' && (
                        <span
                          className="text-rose-600 font-medium truncate max-w-[110px] block"
                          title={pkg.rejectionReason}
                        >
                          {pkg.rejectionReason || 'Rejected'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPackage(pkg.id);
                        }}
                        className={`px-5 py-1.5 rounded text-xs font-medium transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'bg-[#266665] text-white hover:bg-[#1e5251]'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-[#266665] hover:text-white hover:border-[#266665]'
                        }`}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}