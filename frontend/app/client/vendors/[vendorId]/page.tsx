'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  VendorProfileHero,
  VendorPortfolioGrid,
  VendorReviewList,
  VendorAboutSection,
  VendorServicesSection,
  VendorProfileDetail,
} from '@/components/vendors/profile';
import { defaultMockVendors } from '@/components/vendors';

/* ─────────────────────────────────────────────────────────────
   Mock data repository
───────────────────────────────────────────────────────────── */
const VENDOR_PROFILE_DATA: Record<string, VendorProfileDetail> = {
  '1': {
    id: '1',
    name: 'Lens & Light Studio',
    ownerName: 'Kasun Fernando',
    ownerAge: 34,
    category: 'Photography',
    location: 'Colombo',
    rating: 4.8,
    reviewCount: 62,
    availabilityNote: 'Free on 12 Dec, night',
    aboutText:
      'Wedding and event photography since 2014. Two photographers, drone coverage on request, edited album in four weeks.',
    heroImage: '/images/light-studio.jpg',
    ratingBreakdown: { 5: 48, 4: 10, 3: 3, 2: 1, 1: 0 },
    services: [
      { id: 's1', name: 'Full-day wedding coverage', duration: '10 hours', price: 'LKR 180,000' },
      { id: 's2', name: 'Pre-shoot session',         duration: '3 hours',  price: 'LKR 45,000'  },
      { id: 's3', name: 'Drone add-on',              duration: '2 hours',  price: 'LKR 25,000'  },
    ],
    portfolio: [
      { id: 'p1', src: '/images/light-studio.jpg',   alt: 'Mount Lavinia wedding',  caption: 'Mount Lavinia wedding'  },
      { id: 'p2', src: '/images/kandyan-frames.jpg', alt: 'Kandy homecoming',       caption: 'Kandy homecoming'       },
      { id: 'p3', src: '/images/event-1.jpg',        alt: 'Office awards night',    caption: 'Office awards night'    },
      { id: 'p4', src: '/images/event-2.jpg',        alt: 'Beach engagement',       caption: 'Beach engagement'       },
      { id: 'p5', src: '/images/event-3.jpg',        alt: 'Temple ceremony',        caption: 'Temple ceremony'        },
      { id: 'p6', src: '/images/select-page.jpg',    alt: 'Birthday, Nugegoda',     caption: 'Birthday, Nugegoda'     },
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Full-Day Coverage',
        price: 'LKR 180,000',
        description: 'Morning-to-night coverage with two senior photographers.',
        isPopular: true,
        features: [
          'Full-day coverage (up to 12 hours)',
          'Two lead photographers',
          '450+ retouched photos',
          'Private online gallery',
          'Delivery in 21 days',
        ],
      },
      {
        id: 'pkg-2',
        name: 'Half-Day Essential',
        price: 'LKR 120,000',
        description: 'Ideal for intimate ceremonies or evening receptions.',
        features: [
          'Up to 6 hours coverage',
          'One lead photographer + assistant',
          '250+ edited photos',
          'Online gallery within 30 days',
        ],
      },
      {
        id: 'pkg-3',
        name: 'Pre-Shoot & Ceremony Bundle',
        price: 'LKR 240,000',
        description: 'Complete package including pre-wedding location shoot.',
        features: [
          '3-hour pre-wedding shoot',
          'Full-day ceremony & reception',
          'Custom linen album (40 pages)',
          'All digitals on USB',
        ],
      },
    ],
    reviews: [
      {
        id: 'r1',
        authorName: 'Ishara W.',
        authorLocation: 'Colombo',
        eventTypeName: 'Wedding',
        rating: 5,
        date: 'October 2026',
        comment: 'On time, album came early. Would book again.',
      },
      {
        id: 'r2',
        authorName: 'Ruwan J.',
        authorLocation: 'Kandy',
        eventTypeName: 'Engagement',
        rating: 4,
        date: 'September 2026',
        comment: 'Great photos. Edits took five weeks instead of four.',
      },
      {
        id: 'r3',
        authorName: 'Malini S.',
        authorLocation: 'Mount Lavinia',
        eventTypeName: 'Wedding',
        rating: 5,
        date: 'August 2026',
        comment: 'Handled the rain well and still got the outdoor shots.',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Kandyan Frames',
    ownerName: 'Ruwan Perera',
    ownerAge: 29,
    category: 'Photography',
    location: 'Kandy',
    rating: 4.5,
    reviewCount: 31,
    availabilityNote: 'Free on 12 Dec, night',
    aboutText:
      'Kandyan Frames specialises in vibrant outdoor and destination wedding storytelling across Sri Lanka.',
    heroImage: '/images/kandyan-frames.jpg',
    ratingBreakdown: { 5: 20, 4: 8, 3: 2, 2: 1, 1: 0 },
    services: [
      { id: 's1', name: 'Standard ceremony coverage', duration: '8 hours', price: 'LKR 145,000' },
      { id: 's2', name: 'Minimal ceremony',           duration: '4 hours', price: 'LKR 95,000'  },
    ],
    portfolio: [
      { id: 'p1', src: '/images/kandyan-frames.jpg', alt: 'Coastal sunset session',  caption: 'Coastal sunset session'  },
      { id: 'p2', src: '/images/light-studio.jpg',   alt: 'Reception moments',       caption: 'Reception moments'       },
      { id: 'p3', src: '/images/event-1.jpg',        alt: 'Garden celebrations',     caption: 'Garden celebrations'     },
      { id: 'p4', src: '/images/event-3.jpg',        alt: 'Artisan styling',         caption: 'Artisan styling'         },
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Standard Photography',
        price: 'LKR 145,000',
        description: 'Full ceremony with digital rights.',
        isPopular: true,
        features: ['8 hours', 'Lead + second shooter', '350+ retouched photos', 'Online delivery'],
      },
      {
        id: 'pkg-2',
        name: 'Minimal Ceremony',
        price: 'LKR 95,000',
        description: 'For small registrar ceremonies.',
        features: ['4 hours', '150+ photos', 'Download within 14 days'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        authorName: 'Rohan & Anusha',
        authorLocation: 'Negombo',
        eventTypeName: 'Beach Wedding',
        rating: 5,
        date: 'September 2026',
        comment: 'Magical beach sunset portraits. Highly recommend!',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Ceylon Spice Caterers',
    ownerName: 'Chamara Silva',
    ownerAge: 42,
    category: 'Catering',
    location: 'Colombo',
    rating: 4.7,
    reviewCount: 88,
    availabilityNote: 'Free on 12 Dec, night',
    aboutText:
      'Ceylon Spice Caterers brings authentic Sri Lankan culinary heritage together with world-class international buffet offerings for weddings and corporate galas.',
    heroImage: '/images/ceylone-spice.jpg',
    ratingBreakdown: { 5: 65, 4: 18, 3: 4, 2: 1, 1: 0 },
    services: [
      { id: 's1', name: 'Grand wedding buffet (per guest)', duration: 'Full day', price: 'LKR 3,200'  },
      { id: 's2', name: 'Royal plated banquet (per guest)', duration: 'Full day', price: 'LKR 4,500'  },
      { id: 's3', name: 'Welcome canapes setup',            duration: '2 hours',  price: 'LKR 25,000' },
    ],
    portfolio: [
      { id: 'p1', src: '/images/ceylone-spice.jpg', alt: 'Grand wedding buffet',       caption: 'Grand wedding buffet'       },
      { id: 'p2', src: '/images/event-1.jpg',       alt: 'Banquet hall dining setup',  caption: 'Banquet hall dining setup'  },
      { id: 'p3', src: '/images/event-2.jpg',       alt: 'Welcome canapes',            caption: 'Welcome canapes'            },
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Grand Wedding Buffet',
        price: 'LKR 3,200',
        pricePerGuest: true,
        description: 'Sri Lankan & Eastern fusion buffet with live action stations.',
        isPopular: true,
        features: ['4 rice/noodle + 5 curries', '2 live stations', 'Full service staff', 'Linens & silverware'],
      },
      {
        id: 'pkg-2',
        name: 'Royal Plated Banquet',
        price: 'LKR 4,500',
        pricePerGuest: true,
        description: 'Five-course plated service for black-tie receptions.',
        features: ['5-course bespoke menu', 'Silver service', 'Custom tasting', 'Cocktail canapes'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        authorName: 'Chaminda & Tharushi',
        authorLocation: 'Colombo 07',
        eventTypeName: 'Wedding',
        rating: 5,
        date: 'November 2026',
        comment: 'Guests could not stop complimenting the food!',
      },
      {
        id: 'r2',
        authorName: 'Lakmali Jayasinghe',
        authorLocation: 'Battaramulla',
        eventTypeName: 'Corporate Gala',
        rating: 4.5,
        date: 'August 2026',
        comment: 'Flawless coordination for 400 attendees.',
      },
    ],
  },
  '4': {
    id: '4',
    name: 'Bloom Decor',
    ownerName: 'Sanduni Ranaweera',
    ownerAge: 31,
    category: 'Decoration',
    location: 'Colombo',
    rating: 4.6,
    reviewCount: 40,
    availabilityNote: 'Free on 12 Dec, night',
    aboutText:
      'Bloom Decor creates breathtaking bespoke floral installations, modern poruwa backdrops, and enchanting ambient lighting for weddings and milestone celebrations.',
    heroImage: '/images/bloom-deco.jpg',
    ratingBreakdown: { 5: 28, 4: 9, 3: 2, 2: 1, 1: 0 },
    services: [
      { id: 's1', name: 'Hall & Poruwa complete decor', duration: 'Full day', price: 'LKR 220,000' },
      { id: 's2', name: 'Intimate ceremony styling',    duration: 'Half day', price: 'LKR 140,000' },
      { id: 's3', name: 'Guest table centerpieces',     duration: '—',        price: 'LKR 3,500 ea' },
    ],
    portfolio: [
      { id: 'p1', src: '/images/bloom-deco.jpg', alt: 'Custom floral poruwa', caption: 'Custom floral poruwa'      },
      { id: 'p2', src: '/images/event-3.jpg',    alt: 'Reception centerpieces', caption: 'Reception centerpieces' },
      { id: 'p3', src: '/images/event-1.jpg',    alt: 'Entrance arch & aisle', caption: 'Entrance arch & aisle'  },
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Hall & Poruwa Complete',
        price: 'LKR 220,000',
        description: 'Full theme styling: stage, poruwa, entrance, head table.',
        isPopular: true,
        features: ['Floral poruwa', 'Illuminated archway', 'Head table backdrop', 'Up to 20 centerpieces', 'Setup & teardown'],
      },
      {
        id: 'pkg-2',
        name: 'Intimate Ceremony',
        price: 'LKR 140,000',
        description: 'For small-scale celebrations and home/hotel ceremonies.',
        features: ['Poruwa floral setup', 'Settee backdrop + fairy lights', 'Oil lamp garland'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        authorName: 'Suresh & Amanda',
        authorLocation: 'Nugegoda',
        eventTypeName: 'Wedding',
        rating: 5,
        date: 'October 2026',
        comment: 'The poruwa was like something out of a fairy tale!',
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────
   Public Score sidebar widget
───────────────────────────────────────────────────────────── */
function PublicScoreCard({
  rating,
  reviewCount,
  breakdown,
}: {
  rating: number;
  reviewCount: number;
  breakdown?: Record<number, number>;
}) {
  const total = breakdown
    ? Object.values(breakdown).reduce((a, b) => a + b, 0)
    : reviewCount;

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-4">
      <h3 className="font-serif text-xl font-bold text-[#1B2430]">Public score</h3>

      {/* Big number + stars */}
      <div className="flex items-center gap-3">
        <span className="font-serif text-5xl font-bold text-[#1B2430]">
          {rating.toFixed(1)}
        </span>
        <div className="space-y-0.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-base ${i < Math.round(rating) ? 'text-[#266665]' : 'text-gray-200'}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xs text-[#4B5563]">{reviewCount} reviews</p>
        </div>
      </div>

      {/* Star breakdown bars */}
      {breakdown && (
        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-[#4B5563]">
                <span className="w-4 text-right tabular-nums">{star}</span>
                <span className="text-[#266665] text-[11px]">★</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#266665] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-5 text-right tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page content
───────────────────────────────────────────────────────────── */
function VendorProfilePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const vendorId = (params?.vendorId as string) || '1';
  const eventId = searchParams.get('eventId') || '1';

  const vendorDetail = useMemo<VendorProfileDetail>(() => {
    if (VENDOR_PROFILE_DATA[vendorId]) return VENDOR_PROFILE_DATA[vendorId];

    const matchedMock = defaultMockVendors.find((v) => v.id === vendorId);
    if (matchedMock) {
      return {
        id: matchedMock.id,
        name: matchedMock.name,
        category: matchedMock.category,
        location: matchedMock.location,
        rating: matchedMock.rating,
        reviewCount: matchedMock.reviewCount,
        availabilityNote: matchedMock.availability,
        aboutText: `${matchedMock.name} is a dedicated ${matchedMock.category.toLowerCase()} specialist based in ${matchedMock.location}.`,
        heroImage: matchedMock.imageSrc,
        services: [],
        portfolio: [
          { id: '1', src: matchedMock.imageSrc, alt: matchedMock.imageAlt, caption: 'Featured work' },
          { id: '2', src: '/images/event-1.jpg', alt: 'Event setup', caption: 'Live event setup' },
          { id: '3', src: '/images/event-2.jpg', alt: 'Event details', caption: 'Detail highlights' },
        ],
        packages: [
          {
            id: 'pkg-std',
            name: 'Standard Package',
            price: matchedMock.price,
            pricePerGuest: matchedMock.pricePerGuest,
            description: 'Comprehensive service package for your event.',
            isPopular: true,
            features: ['Professional on-site delivery', 'Coordination with timeline', 'Dedicated team'],
          },
        ],
        reviews: [
          {
            id: 'rev-1',
            authorName: 'Satisfied Client',
            authorLocation: matchedMock.location,
            rating: matchedMock.rating,
            date: 'Recent',
            comment: 'Excellent service and great attention to detail.',
          },
        ],
      };
    }
    return VENDOR_PROFILE_DATA['1'];
  }, [vendorId]);

  const [addedVendorIds, setAddedVendorIds] = useState<Set<string>>(() => {
    const param = searchParams.get('vendors');
    if (param !== null) {
      return new Set(param.split(',').map((id) => id.trim()).filter(Boolean));
    }
    return new Set(defaultMockVendors.filter((v) => v.isAdded).map((v) => v.id));
  });

  const isAdded = addedVendorIds.has(vendorDetail.id);

  const handleToggleAdd = () => {
    setAddedVendorIds((prev) => {
      const next = new Set(prev);
      if (next.has(vendorDetail.id)) next.delete(vendorDetail.id);
      else next.add(vendorDetail.id);
      return next;
    });
  };

  const backHref = useMemo(() => {
    const p = new URLSearchParams(searchParams.toString());
    const ids = Array.from(addedVendorIds);
    if (ids.length > 0) p.set('vendors', ids.join(','));
    else p.delete('vendors');
    const q = p.toString();
    return `/client/events/${encodeURIComponent(eventId)}/vendors${q ? `?${q}` : ''}`;
  }, [searchParams, addedVendorIds, eventId]);

  return (
    /*
     * Full-bleed page — the hero sits edge-to-edge at the top,
     * then a constrained container holds the back link + columns.
     */
    <div className="min-h-screen bg-[#F0F4F4]">

      {/* ── Full-bleed hero — no padding, no max-width ─────────── */}
      <VendorProfileHero
        name={vendorDetail.name}
        vendorId={vendorDetail.id}
        ownerName={vendorDetail.ownerName}
        ownerAge={vendorDetail.ownerAge}
        category={vendorDetail.category}
        location={vendorDetail.location}
        rating={vendorDetail.rating}
        reviewCount={vendorDetail.reviewCount}
        heroImage={vendorDetail.heroImage}
        isAdded={isAdded}
        onToggleAdd={handleToggleAdd}
      />

      {/* ── Constrained content below hero ─────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* ── Two-column layout ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* Main column: About → Services → Portfolio */}
          <div className="lg:col-span-8 space-y-4">

            {/* About */}
            <div className="rounded-xl border border-gray-200/70 bg-white px-7 py-6 shadow-sm">
              <VendorAboutSection aboutText={vendorDetail.aboutText} />
            </div>

            {/* Services */}
            {vendorDetail.services && vendorDetail.services.length > 0 && (
              <div className="rounded-xl border border-gray-200/70 bg-white px-7 py-6 shadow-sm">
                <VendorServicesSection services={vendorDetail.services} />
              </div>
            )}

            {/* Portfolio */}
            <div className="rounded-xl border border-gray-200/70 bg-white px-7 py-6 shadow-sm">
              <VendorPortfolioGrid images={vendorDetail.portfolio} title="Portfolio" />
            </div>
          </div>

          {/* Sidebar: Public Score → Reviews → Quick action */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">

            {/* Public Score */}
            <PublicScoreCard
              rating={vendorDetail.rating}
              reviewCount={vendorDetail.reviewCount}
              breakdown={vendorDetail.ratingBreakdown}
            />

            {/* Reviews */}
            <div className="rounded-xl border border-gray-200/70 bg-white px-6 py-6 shadow-sm">
              <VendorReviewList
                reviews={vendorDetail.reviews}
                averageRating={vendorDetail.rating}
                reviewCount={vendorDetail.reviewCount}
              />
            </div>

            {/* Quick action card */}
            <div className="rounded-xl border border-gray-200/70 bg-white px-5 py-5 shadow-sm space-y-3">
              <button
                type="button"
                onClick={handleToggleAdd}
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isAdded
                    ? 'bg-[#266665] text-white hover:bg-[#123B3A]'
                    : 'border-2 border-[#266665] text-[#266665] hover:bg-[#DBECEC]/40 bg-white'
                }`}
              >
                {isAdded ? 'Remove from package' : 'Add vendor to package'}
              </button>

              <Link
                href={backHref}
                className="w-full inline-flex items-center justify-center py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#1B2430] text-sm font-medium transition-colors"
              >
                Return to vendor list
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Export
───────────────────────────────────────────────────────────── */
export default function VendorProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F7F7] py-12 px-4 text-center text-sm text-[#4B5563]">
          Loading vendor profile…
        </div>
      }
    >
      <VendorProfilePageContent />
    </Suspense>
  );
}
