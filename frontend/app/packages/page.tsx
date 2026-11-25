
'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/navigation/sidebar';
import { CheckCircle2 } from 'lucide-react';
import { INITIAL_PACKAGES, PackageRecord } from '../../services/packagesApi';
import { PackageListTable } from '../../components/packages/PackageListTable';
import { PackageDetailPanel } from '../../components/packages/PackageDetailPanel';
import { RejectPackageModal } from '../../components/packages/RejectPackageModal';

export default function PackageApprovalsPage() {
  const [packages, setPackages] = useState<PackageRecord[]>(INITIAL_PACKAGES);
  const [activeTab, setActiveTab] = useState<'waiting' | 'approved' | 'rejected'>('waiting');
  const [selectedId, setSelectedId] = useState<string>('pkg-01');

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Documents do not match the business name');
  const [rejectDetails, setRejectDetails] = useState(
    'The BRN certificate is for "Lens and Light (Pvt) Ltd". Please upload the'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const highlightPackagesNav = () => {
      const navButtons = document.querySelectorAll('aside nav button, aside nav a');
      navButtons.forEach((el) => {
        if (el.textContent?.trim().includes('Packages')) {
          el.classList.add('bg-[#e6f0f0]', 'text-[#266665]', 'font-medium', 'border-l-4', 'border-[#266665]');
          el.classList.remove('border-transparent');
          const svg = el.querySelector('svg');
          if (svg) svg.classList.add('text-[#266665]');
        }
      });
    };
    highlightPackagesNav();
  }, []);

  const waitingPackages = packages.filter((p) => p.status === 'waiting');
  const approvedPackages = packages.filter((p) => p.status === 'approved');
  const rejectedPackages = packages.filter((p) => p.status === 'rejected');

  const currentTabPackages =
    activeTab === 'waiting'
      ? waitingPackages
      : activeTab === 'approved'
      ? approvedPackages
      : rejectedPackages;

  const selectedPackage =
    packages.find((p) => p.id === selectedId) ||
    currentTabPackages[0] ||
    null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (pkgId: string) => {
    const target = packages.find((p) => p.id === pkgId);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = packages.map((p) =>
      p.id === pkgId ? { ...p, status: 'approved' as const, approvedAt: `Today at ${now}` } : p
    );
    setPackages(updated);
    showToast(`Package for "${target?.name || 'Event'}" approved! Vendors notified.`);
    const remainingWaiting = updated.filter((p) => p.status === 'waiting');
    if (remainingWaiting.length > 0) {
      setSelectedId(remainingWaiting[0].id);
    }
  };

  const handleConfirmReject = () => {
    if (!selectedPackage) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = packages.map((p) =>
      p.id === selectedPackage.id
        ? {
            ...p,
            status: 'rejected' as const,
            rejectionReason: rejectReason,
            rejectionDetails: rejectDetails,
            rejectedAt: `Today at ${now}`,
          }
        : p
    );
    setPackages(updated);
    setIsRejectModalOpen(false);
    showToast(`Package for "${selectedPackage.name}" rejected. Logged to audit log.`);
    const remainingWaiting = updated.filter((p) => p.status === 'waiting');
    if (remainingWaiting.length > 0) {
      setSelectedId(remainingWaiting[0].id);
    }
  };

  const handleReopen = (pkgId: string, pkgName: string) => {
    const updated = packages.map((p) =>
      p.id === pkgId ? { ...p, status: 'waiting' as const } : p
    );
    setPackages(updated);
    setActiveTab('waiting');
    showToast(`Re-opened "${pkgName}" into Waiting queue.`);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex font-sans antialiased text-slate-800">
      <Sidebar />

      <style>{`
        aside nav > div:nth-child(7) button {
          background-color: #e6f0f0 !important;
          color: #266665 !important;
          font-weight: 500 !important;
          border-left-color: #266665 !important;
        }
        aside nav > div:nth-child(7) button svg {
          color: #266665 !important;
        }
      `}</style>

      <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
        {toastMessage && (
          <div className="fixed top-5 right-6 z-50 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg shadow-md flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        <div className="space-y-1">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Package approvals
          </h1>
          <p className="text-slate-500 text-sm">
            Stage 1: the client paid 20%. Approve before vendors are told the booking is confirmed.
          </p>
        </div>

        <div className="flex items-center gap-6 border-b border-gray-200 text-sm pt-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('waiting');
              if (waitingPackages.length > 0) setSelectedId(waitingPackages[0].id);
            }}
            className={`pb-3 font-medium transition-colors cursor-pointer relative ${
              activeTab === 'waiting'
                ? 'text-[#266665] border-b-2 border-[#266665] font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Waiting ({waitingPackages.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('approved');
              if (approvedPackages.length > 0) setSelectedId(approvedPackages[0].id);
            }}
            className={`pb-3 font-medium transition-colors cursor-pointer relative ${
              activeTab === 'approved'
                ? 'text-[#266665] border-b-2 border-[#266665] font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Approved {approvedPackages.length > 0 && `(${approvedPackages.length})`}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('rejected');
              if (rejectedPackages.length > 0) setSelectedId(rejectedPackages[0].id);
            }}
            className={`pb-3 font-medium transition-colors cursor-pointer relative ${
              activeTab === 'rejected'
                ? 'text-[#266665] border-b-2 border-[#266665] font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Rejected (log) {rejectedPackages.length > 0 && `(${rejectedPackages.length})`}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <PackageListTable
            packages={currentTabPackages}
            activeTab={activeTab}
            selectedId={selectedPackage?.id}
            onSelectPackage={setSelectedId}
          />

          <PackageDetailPanel
            selectedPackage={selectedPackage}
            onApprove={handleApprove}
            onOpenRejectModal={() => setIsRejectModalOpen(true)}
            onReopen={handleReopen}
          />
        </div>
      </main>

      <RejectPackageModal
        isOpen={isRejectModalOpen && Boolean(selectedPackage)}
        rejectReason={rejectReason}
        rejectDetails={rejectDetails}
        onReasonChange={setRejectReason}
        onDetailsChange={setRejectDetails}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}