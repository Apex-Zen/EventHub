'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  VendorsHeader,
  VendorFilterSidebar,
  VendorList,
  PackageSummaryCard,
  defaultMockVendors,
  VendorItem,
  PackageItem,
} from '@/components/vendors';

// Category id → display name mapping
const CATEGORY_MAP: Record<string, string> = {
  photography: 'Photography',
  catering: 'Catering',
  decoration: 'Decoration',
  'sound-lighting': 'Sound and lighting',
  cake: 'Cake',
  transport: 'Transport',
};

interface FilterState {
  categories: string[]; // active category ids
  fourStarsOnly: boolean;
  sort: string;
}

const ALL_CATEGORY_IDS = ['photography', 'catering', 'decoration', 'sound-lighting', 'cake', 'transport'];

const initialFilterState: FilterState = {
  categories: ['photography', 'catering', 'decoration'],
  fourStarsOnly: true,
  sort: 'best-match',
};

// Seed vendors with basePrice values
const seedVendors: VendorItem[] = defaultMockVendors;

function parsePositiveNumber(value: string | null, fallback: number): number {
  if (value === null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsed = parsePositiveNumber(value, fallback);
  return Number.isInteger(parsed) ? parsed : fallback;
}

function ChooseVendorsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vendors, setVendors] = useState<VendorItem[]>(seedVendors);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const guestCount = parsePositiveInteger(searchParams.get('guests'), 250);
  const budget = parsePositiveNumber(searchParams.get('budget'), 1500000);
  const eventType = searchParams.get('eventType') || 'Wedding';
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

  // ----- Toggle add/remove -----
  const handleToggleAdd = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isAdded: !v.isAdded } : v))
    );
  };

  // ----- Filter + Sort -----
  const filteredSortedVendors = useMemo(() => {
    let result = vendors.filter((v) => {
      // Category filter — match vendor category to active category ids
      const activeCategoryNames = filterState.categories.map(
        (id) => CATEGORY_MAP[id] ?? id
      );
      const categoryMatch =
        filterState.categories.length === 0 ||
        activeCategoryNames.some(
          (name) => name.toLowerCase() === v.category.toLowerCase()
        );
      if (!categoryMatch) return false;

      // Rating filter
      if (filterState.fourStarsOnly && v.rating < 4.0) return false;

      return true;
    });

    // Sort
    switch (filterState.sort) {
      case 'price-low':
        result = [...result].sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      // best-match: original order
      default:
        break;
    }

    return result;
  }, [vendors, filterState]);

  // ----- Package derivation -----
  const packageItems: PackageItem[] = vendors
    .filter((v) => v.isAdded)
    .map((v) => ({
      id: v.id,
      name: v.pricePerGuest ? `${v.name} × ${guestCount}` : v.name,
      price: v.pricePerGuest ? v.basePrice * guestCount : v.basePrice,
    }));

  // ----- Category sidebar options -----
  const categoryOptions = ALL_CATEGORY_IDS.map((id) => ({
    id,
    label: CATEGORY_MAP[id],
    checked: filterState.categories.includes(id),
  }));

  const handleToggleCategory = (id: string) => {
    setFilterState((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  const handleToggleFourStars = () => {
    setFilterState((prev) => ({ ...prev, fourStarsOnly: !prev.fourStarsOnly }));
  };

  const handleSortChange = (value: string) => {
    setFilterState((prev) => ({ ...prev, sort: value }));
  };

  const filterSidebarProps = {
    categories: categoryOptions,
    onToggleCategory: handleToggleCategory,
    fourStarsOnly: filterState.fourStarsOnly,
    onToggleFourStars: handleToggleFourStars,
    sortValue: filterState.sort,
    onSortChange: handleSortChange,
  };

  const handleEventDetailsClick = () => {
    const eventId = window.location.pathname.match(/\/events\/([^/]+)\/vendors\/?$/)?.[1];
    const params = new URLSearchParams(window.location.search);
    if (eventId) params.set('eventId', eventId);
    router.push(`/client/events/create?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
      <VendorsHeader
        eventName={eventType}
        eventDetailsText={`${formattedDate} · ${timeSlot} · ${district} · ${guestCount.toLocaleString()} guests · Budget LKR ${budget.toLocaleString()}`}
        onEventDetailsClick={handleEventDetailsClick}
      />

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-5">
        <button
          type="button"
          onClick={() => setShowFilterDrawer(true)}
          className="inline-flex h-10 items-center gap-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#1B2430] shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M7 8h10M11 12h4" />
          </svg>
          Filter vendors
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,2fr)_minmax(250px,1fr)] xl:gap-8">
        {/* Filter sidebar */}
        <aside className="min-w-0">
          {/* Mobile drawer */}
          {showFilterDrawer && (
            <div
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setShowFilterDrawer(false)}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div
                className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-6 overflow-y-auto z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-lg font-bold text-[#1B2430]">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setShowFilterDrawer(false)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close filters"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <VendorFilterSidebar {...filterSidebarProps} />
              </div>
            </div>
          )}

          {/* Desktop always visible */}
          <div className="hidden lg:block">
            <VendorFilterSidebar {...filterSidebarProps} />
          </div>
        </aside>

        {/* Vendor list */}
        <main className="min-w-0">
          {filteredSortedVendors.length === 0 ? (
            <div className="text-center py-16 text-[#4B5563]">
              <p className="text-lg font-medium">No vendors match your filters.</p>
              <p className="text-sm mt-1">Try adjusting the category or rating filters.</p>
            </div>
          ) : (
            <VendorList
              vendors={filteredSortedVendors}
              onToggleAdd={handleToggleAdd}
            />
          )}
        </main>

        {/* Package summary — sticky on desktop */}
        <aside className="min-w-0 lg:sticky lg:top-6">
          <PackageSummaryCard
            items={packageItems}
            totalBudget={budget}
            onReviewPackage={() => router.push('/client/events/1/build-package')}
          />
        </aside>
      </div>

    </div>
  );
}

export default function ChooseVendorsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
          Loading vendors…
        </div>
      }
    >
      <ChooseVendorsPageContent />
    </Suspense>
  );
}
