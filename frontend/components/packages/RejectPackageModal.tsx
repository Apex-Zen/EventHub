
'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface RejectPackageModalProps {
  isOpen: boolean;
  rejectReason: string;
  rejectDetails: string;
  onReasonChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function RejectPackageModal({
  isOpen,
  rejectReason,
  rejectDetails,
  onReasonChange,
  onDetailsChange,
  onClose,
  onConfirm,
}: RejectPackageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-7 border border-gray-100 animate-scale-up relative">
        <h3 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
          Reject with a reason
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          The reason is sent to the vendor or client and saved in the audit log.
        </p>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason
            </label>
            <div className="relative">
              <select
                value={rejectReason}
                onChange={(e) => onReasonChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 rounded-md px-3.5 py-2.5 text-xs text-slate-800 pr-9 focus:outline-none focus:ring-1 focus:ring-[#266665] cursor-pointer"
              >
                <option value="Documents do not match the business name">
                  Documents do not match the business name
                </option>
                <option value="Unrealistic setup schedule / timeline clash">
                  Unrealistic setup schedule / timeline clash
                </option>
                <option value="Vendor insurance or safety compliance missing">
                  Vendor insurance or safety compliance missing
                </option>
                <option value="Client payment verification issue">
                  Client payment verification issue
                </option>
                <option value="Capacity or venue regulation violation">
                  Capacity or venue regulation violation
                </option>
                <option value="Other operational concern">
                  Other operational concern
                </option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Details (shown to them)
            </label>
            <textarea
              rows={3}
              value={rejectDetails}
              onChange={(e) => onDetailsChange(e.target.value)}
              placeholder="Enter details..."
              className="w-full border border-gray-300 rounded-md p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#266665] resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 rounded-md bg-[#266665] hover:bg-[#1e5251] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}