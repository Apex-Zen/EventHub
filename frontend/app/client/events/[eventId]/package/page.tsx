'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  PackageVendorsTable,
  PackageSummaryCard,
  PackageVendor,
} from '@/components/events/package';
import BookingStepper from '@/components/events/BookingStepper';
import { defaultMockVendors } from '@/components/vendors';

// Default service options & initial services by category
const CATEGORY_SERVICES: Record<string, { defaultService: string; options: string[] }> = {
  photography: {
    defaultService: 'Full-day coverage',
    options: ['Full-day coverage', 'Half-day coverage', 'Engagement only'],
  },
  catering: {
    defaultService: 'Buffet, 3,200 / guest',
    options: ['Buffet, 3,200 / guest', 'Set menu, 4,000 / guest', 'Cocktail style, 2,800 / guest'],
  },
  decoration: {
    defaultService: 'Hall and poruwa',
    options: ['Hall and poruwa', 'Poruwa only', 'Complete theme styling'],
  },
};

function getServiceConfig(category: string) {
  const key = category.toLowerCase();
  return (
    CATEGORY_SERVICES[key] || {
      defaultService: 'Standard package',
      options: ['Standard package', 'Premium package', 'Custom package'],
    }
  );
}

function parsePositiveNumber(value: string | null, fallback: number): number {
  if (value === null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsed = parsePositiveNumber(value, fallback);
  return Number.isInteger(parsed) ? parsed : fallback;
}

function BuildPackagePageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = (params?.eventId as string) || '1';

  const guestCount = parsePositiveInteger(searchParams.get('guests'), 250);
  const budget = parsePositiveNumber(searchParams.get('budget'), 1500000);
  const eventType = searchParams.get('eventType') || 'wedding';
  const date = searchParams.get('date') || '2026-12-12';
  const timeSlot = searchParams.get('timeSlot') || 'Night';
  const district = searchParams.get('district') || 'Colombo';
  const eventDate = new Date(`${date}T00:00:00`);
  const formattedDate = Number.isNaN(eventDate.getTime())
    ? date
    : eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  // Resolve which vendors were selected:
  // 1. From searchParams `vendors` (comma-separated IDs) if present
  // 2. Otherwise default to vendors where isAdded is true
  const initialPackageVendors = useMemo<PackageVendor[]>(() => {
    const vendorParam = searchParams.get('vendors');
    const selectedVendors = vendorParam !== null
      ? defaultMockVendors.filter((v) =>
          vendorParam
            .split(',')
            .map((id) => id.trim())
            .includes(v.id)
        )
      : defaultMockVendors.filter((v) => v.isAdded);

    return selectedVendors.map((v) => {
      const serviceConfig = getServiceConfig(v.category);
      const isPerGuest = v.pricePerGuest;
      const calculatedPrice = isPerGuest ? v.basePrice * guestCount : v.basePrice;
      const quantityDisplay = isPerGuest ? `${guestCount} guests` : '1';

      return {
        id: v.id,
        name: v.name,
        category: v.category,
        image: v.imageSrc,
        service: serviceConfig.defaultService,
        serviceOptions: serviceConfig.options,
        quantityDisplay,
        price: calculatedPrice,
      };
    });
  }, [searchParams, guestCount]);

  const [vendors, setVendors] = useState<PackageVendor[]>(initialPackageVendors);

  // Sync state if searchParams change
  useEffect(() => {
    setVendors(initialPackageVendors);
  }, [initialPackageVendors]);

  const [message, setMessage] = useState('Venue is Waters Edge, Battaramulla. Ceremony at 7.00 pm.');

  const handleRemove = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const handleServiceChange = (id: string, newService: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, service: newService } : v))
    );
  };

  const total = vendors.reduce((sum, v) => sum + v.price, 0);

  // When returning to vendors, pass the currently remaining vendor IDs
  const getBackToVendorsHref = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const remainingIds = vendors.map((v) => v.id);
    if (remainingIds.length > 0) {
      currentParams.set('vendors', remainingIds.join(','));
    } else {
      currentParams.set('vendors', '');
    }
    const query = currentParams.toString();
    return `/client/events/${encodeURIComponent(eventId)}/vendors${query ? `?${query}` : ''}`;
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('eventId', eventId);
      router.push(`/client/events/create?${currentParams.toString()}`);
    } else if (stepNumber === 2) {
      router.push(getBackToVendorsHref());
    }
  };

  const handleSendPackageRequest = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const remainingIds = vendors.map((v) => v.id);
    if (remainingIds.length > 0) {
      currentParams.set('vendors', remainingIds.join(','));
    }
    const query = currentParams.toString();
    router.push(`/client/events/${encodeURIComponent(eventId)}/waiting${query ? `?${query}` : ''}`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2430] leading-tight">
          Build your package
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-normal">
          Dates on hold: 31 h 12 m left
        </p>
        <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5 font-normal">
          Perera–Silva {eventType.toLowerCase()} &middot; {formattedDate} &middot; {timeSlot} &middot; {district} &middot; {guestCount} guests
        </p>

        {/* Stepper Progress */}
        <BookingStepper
          currentStep={3}
          onStepClick={handleStepClick}
          className="pt-4"
        />
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vendors in this package */}
        <div className="lg:col-span-8">
          <PackageVendorsTable
            vendors={vendors}
            onRemoveVendor={handleRemove}
            onServiceChange={handleServiceChange}
            onAddAnotherVendor={() => router.push(getBackToVendorsHref())}
            message={message}
            onMessageChange={setMessage}
          />
        </div>

        {/* Right Column: Summary Card */}
        <div className="lg:col-span-4">
          <PackageSummaryCard
            vendorCount={vendors.length}
            total={total}
            budget={budget}
            onSendPackageRequest={handleSendPackageRequest}
          />
        </div>
      </div>
    </div>
  );
}

export default function BuildPackagePage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 md:p-8 max-w-7xl mx-auto text-sm text-[#4B5563]">
          Loading package...
        </div>
      }
    >
      <BuildPackagePageContent />
    </Suspense>
  );
}
