
'use client';

import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { PackageRecord } from '../../services/packagesApi';

interface PackageDetailPanelProps {
  selectedPackage: PackageRecord | null;
  onApprove: (pkgId: string) => void;
  onOpenRejectModal: () => void;
  onReopen: (pkgId: string, pkgName: string) => void;
}

export function PackageDetailPanel({
  selectedPackage,
  onApprove,
  onOpenRejectModal,
  onReopen,
}: PackageDetailPanelProps) {
  return (
    <div className="lg:col-span-5 bg-white rounded-lg p-6 border border-gray-100 shadow-2xs">
      {selectedPackage ? (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
              {selectedPackage.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {selectedPackage.fullDateVenueSubtitle}
            </p>
          </div>

          {selectedPackage.status === 'approved' && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>
                <strong>Approved by Shehan:</strong> Vendors have been officially notified of booking confirmation.
              </span>
            </div>
          )}

          {selectedPackage.status === 'rejected' && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-3 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-rose-700">
                <ShieldAlert size={15} />
                Rejected: {selectedPackage.rejectionReason}
              </div>
              <div className="text-[11px] text-rose-800/90 pl-5">
                &ldquo;{selectedPackage.rejectionDetails}&rdquo;
              </div>
            </div>
          )}

          <div className="space-y-2.5 text-xs">
            {selectedPackage.vendors.map((v, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-slate-600">{v.name}</span>
                <span className="text-slate-900 font-medium">{v.amount}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 font-semibold text-slate-900">
              <span>Stage 1 paid (20%)</span>
              <span>{selectedPackage.stage1Paid}</span>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-3">
              Checks
            </h3>
            <div className="space-y-3">
              {selectedPackage.checks.map((chk, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-medium text-slate-800">{chk.title}</div>
                    <div className="text-[11px] text-slate-400">{chk.subtitle}</div>
                  </div>
                  <div>
                    {chk.status === 'OK' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Watch
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPackage.status === 'waiting' ? (
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onApprove(selectedPackage.id)}
                className="px-6 py-2.5 bg-[#266665] hover:bg-[#1e5251] text-white rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Approve package
              </button>
              <button
                type="button"
                onClick={onOpenRejectModal}
                className="px-6 py-2.5 bg-white border border-slate-300 hover:border-rose-400 hover:text-rose-600 text-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onReopen(selectedPackage.id, selectedPackage.name)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium transition-colors cursor-pointer"
              >
                Re-open into Waiting Queue
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs">
          Select a package from the table to review.
        </div>
      )}
    </div>
  );
}