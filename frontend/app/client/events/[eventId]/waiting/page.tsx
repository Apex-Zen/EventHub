'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  WaitingPageHeader,
  WaitingTimer,
  WaitingStepBanner,
  VendorStatusCard,
  WaitingDepositCard,
  WaitingStatusLegend,
  WaitingVendorItem,
} from '@/components/events/waiting';
import { defaultMockVendors } from '@/components/vendors';

function parsePositiveNumber(value: string | null, fallback: number): number {
  if (value === null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsed = parsePositiveNumber(value, fallback);
  return Number.isInteger(parsed) ? parsed : fallback;
}

function WaitingForVendorsPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = (params?.eventId as string) || '1';

  const guestCount = parsePositiveInteger(searchParams.get('guests'), 250);
  const eventType = searchParams.get('eventType') || 'wedding';

  // Back link URL with search params preserved
  const searchString = searchParams.toString();
  const backHref = `/client/events${searchString ? `?${searchString}` : ''}`;

  // Initial mock vendors mapped from selection or default mock status
  const initialVendors = useMemo<WaitingVendorItem[]>(() => {
    const vendorParam = searchParams.get('vendors');
    const selectedIds = vendorParam !== null
      ? new Set(vendorParam.split(',').map((id) => id.trim()))
      : new Set(['1', '3', '4']); // default mock selected vendors

    return defaultMockVendors
      .filter((v) => selectedIds.has(v.id))
      .map((v) => {
        const isPerGuest = v.pricePerGuest;
        const calculatedPrice = isPerGuest ? v.basePrice * guestCount : v.basePrice;
        const formattedPrice = `LKR ${calculatedPrice.toLocaleString()}`;

        // Default mock status matching wireframe:
        // ID 1 (Lens & Light Studio) -> Accepted
        // ID 3 (Ceylon Spice Caterers) -> Accepted
        // ID 4 (Bloom Decor) -> Rejected
        // Others -> Waiting
        let status: 'Accepted' | 'Rejected' | 'Waiting' | 'Expired' = 'Waiting';
        if (v.id === '1' || v.id === '3') {
          status = 'Accepted';
        } else if (v.id === '4') {
          status = 'Rejected';
        }

        return {
          id: v.id,
          name: v.name,
          category: v.category,
          priceFormatted: formattedPrice,
          priceValue: calculatedPrice,
          status,
          image: v.imageSrc,
        };
      });
  }, [searchParams, guestCount]);

  const [vendors, setVendors] = useState<WaitingVendorItem[]>(initialVendors);

  // Accepted total calculation
  const acceptedTotal = useMemo(() => {
    return vendors
      .filter((v) => v.status === 'Accepted')
      .reduce((sum, v) => sum + v.priceValue, 0);
  }, [vendors]);

  // Handle routing to find another vendor for a category
  const handleFindReplacement = (vendorId: string, category: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    // Filter out the rejected vendor and route back to vendor selector
    const remainingIds = vendors.filter((v) => v.id !== vendorId).map((v) => v.id);
    if (remainingIds.length > 0) {
      currentParams.set('vendors', remainingIds.join(','));
    }
    currentParams.set('category', category.toLowerCase());
    const query = currentParams.toString();
    router.push(`/client/events/${encodeURIComponent(eventId)}/vendors${query ? `?${query}` : ''}`);
  };

  // Handle message vendor
  const handleMessageVendor = (vendorId: string) => {
    router.push(`/client/messages?vendorId=${encodeURIComponent(vendorId)}&eventId=${encodeURIComponent(eventId)}`);
  };

  // Handle pay deposit action
  const handlePayDeposit = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const query = currentParams.toString();
    router.push(`/client/events/${encodeURIComponent(eventId)}/deposit${query ? `?${query}` : ''}`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Section: Header & Countdown Timer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <WaitingPageHeader
          eventTitle={`Perera–Silva ${eventType.toLowerCase()}`}
          backHref={backHref}
          sentInfo="Sent Mon 19 Oct, 9.40 pm. Responses close Wed 21 Oct, 9.40 pm."
        />
        <div className="flex-shrink-0">
          <WaitingTimer label="TIME LEFT" timeRemaining="31 h 12 m" />
        </div>
      </div>

      {/* Step Progress / Status Banner */}
      <WaitingStepBanner
        stepText="Step 2 of 3: waiting for EventHub approval"
        description="After vendors accept, EventHub (the Event Manager) approves the package, usually within 4 hours. Then you can pay the deposit."
      />

      {/* 2-Column Grid: Vendor List & Deposit Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vendor Status Cards */}
        <div className="lg:col-span-8 space-y-4">
          {vendors.map((vendor) => (
            <VendorStatusCard
              key={vendor.id}
              vendor={vendor}
              onMessage={handleMessageVendor}
              onFindReplacement={handleFindReplacement}
            />
          ))}

          {vendors.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200/80 p-8 text-center text-sm text-[#4B5563]">
              No vendors currently pending for this event.
            </div>
          )}

          {/* Info Status Legend */}
          <div className="pt-2">
            <WaitingStatusLegend text="Waiting means no answer yet. Accepted books the date in the vendor diary. Rejected or expired (no answer in 48 hours) leaves the date free." />
          </div>
        </div>

        {/* Right Column: Deposit Summary Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-6">
          <WaitingDepositCard
            acceptedTotal={acceptedTotal}
            depositPercentage={20}
            note="You only pay for vendors who accepted. You can add a new decorator later."
            onPayDeposit={handlePayDeposit}
            ctaText="Pay deposit for accepted vendors"
          />
        </div>
      </div>
    </div>
  );
}

export default function WaitingForVendorsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 md:p-8 max-w-7xl mx-auto text-sm text-[#4B5563]">
          Loading waiting status...
        </div>
      }
    >
      <WaitingForVendorsPageContent />
    </Suspense>
  );
}

