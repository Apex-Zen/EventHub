'use client';

import React, { Suspense, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  PackageVendorsTable,
  PackageSummaryCard,
  PackageVendor,
} from '@/components/events/package';

function BuildPackagePageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = (params?.eventId as string) || '1';

  const [vendors, setVendors] = useState<PackageVendor[]>([
    {
      id: '1',
      name: 'Lens & Light Studio',
      category: 'Photography',
      image: '/images/light-studio.jpg',
      service: 'Full-day coverage',
      serviceOptions: ['Full-day coverage', 'Half-day coverage', 'Engagement only'],
      quantityDisplay: '1',
      price: 180000,
    },
    {
      id: '2',
      name: 'Ceylon Spice Caterers',
      category: 'Catering',
      image: '/images/ceylone-spice.jpg',
      service: 'Buffet, 3,200 / guest',
      serviceOptions: ['Buffet, 3,200 / guest', 'Set menu, 4,000 / guest', 'Cocktail style, 2,800 / guest'],
      quantityDisplay: '250 guests',
      price: 800000,
    },
    {
      id: '3',
      name: 'Bloom Decor',
      category: 'Decoration',
      image: '/images/bloom-deco.jpg',
      service: 'Hall and poruwa',
      serviceOptions: ['Hall and poruwa', 'Poruwa only', 'Complete theme styling'],
      quantityDisplay: '1',
      price: 220000,
    },
  ]);

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

  const steps = [
    { number: 1, label: 'Event details', done: true, stepNumber: 1 },
    { number: 2, label: 'Choose vendors', done: true, stepNumber: 2 },
    { number: 3, label: 'Build package', active: true, stepNumber: 3 },
    { number: 4, label: 'Pay deposit', stepNumber: 4 },
  ];

  const searchString = searchParams.toString();
  const backToVendorsHref = `/client/events/${encodeURIComponent(eventId)}/vendors${searchString ? `?${searchString}` : ''}`;

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('eventId', eventId);
      router.push(`/client/events/create?${currentParams.toString()}`);
    } else if (stepNumber === 2) {
      router.push(backToVendorsHref);
    }
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
          Perera–Silva wedding &middot; Sat 12 Dec 2026 &middot; Night &middot; Colombo &middot; 250 guests
        </p>

        {/* Stepper Progress */}
        <nav aria-label="Progress" className="flex items-center gap-4 pt-4 flex-wrap">
          {steps.map((step) => {
            const isDone = step.done;
            const isActive = step.active;
            const isClickable = step.stepNumber === 1 || step.stepNumber === 2;

            const stepContent = (
              <>
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors ${
                    isDone || isActive
                      ? `bg-[#266665] text-white ${isClickable ? 'group-hover:bg-[#123B3A]' : ''}`
                      : 'border border-gray-300 text-gray-500 bg-white'
                  }`}
                >
                  {isDone ? '✓' : step.number}
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isActive || isDone
                      ? `text-[#1B2430] font-semibold ${isClickable ? 'group-hover:text-[#266665]' : ''}`
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </>
            );

            return (
              <div key={step.number} className="flex items-center gap-2">
                {isClickable ? (
                  <button
                    type="button"
                    onClick={() => handleStepClick(step.stepNumber)}
                    className="group flex cursor-pointer items-center gap-2 rounded-sm text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#266665] focus-visible:ring-offset-2"
                  >
                    {stepContent}
                  </button>
                ) : (
                  stepContent
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vendors in this package */}
        <div className="lg:col-span-8">
          <PackageVendorsTable
            vendors={vendors}
            onRemoveVendor={handleRemove}
            onServiceChange={handleServiceChange}
            onAddAnotherVendor={() => router.push(backToVendorsHref)}
            message={message}
            onMessageChange={setMessage}
          />
        </div>

        {/* Right Column: Summary Card */}
        <div className="lg:col-span-4">
          <PackageSummaryCard
            vendorCount={vendors.length}
            total={total}
            budget={1500000}
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

