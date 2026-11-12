import React from 'react';
import VendorCard from './VendorCard';
import { VendorItem } from './types';

interface VendorListProps {
  vendors?: VendorItem[];
  onToggleAdd?: (id: string) => void;
  onViewProfile?: (id: string) => void;
}

export const defaultMockVendors: VendorItem[] = [
  {
    id: '1',
    name: 'Lens & Light Studio',
    category: 'Photography',
    location: 'Colombo',
    price: 'LKR 180,000',
    rating: 4.8,
    reviewCount: 62,
    availability: 'Free on 12 Dec, night',
    imageSrc: '/images/light-studio.jpg',
    imageAlt: 'Lens & Light Studio wedding photographer taking event photos',
    isAdded: true,
  },
  {
    id: '2',
    name: 'Kandyan Frames',
    category: 'Photography',
    location: 'Colombo',
    price: 'LKR 145,000',
    rating: 4.5,
    reviewCount: 31,
    availability: 'Free on 12 Dec, night',
    imageSrc: '/images/kandyan-frames.jpg',
    imageAlt: 'Kandyan Frames outdoor wedding photoshoot on beach',
    isAdded: false,
  },
  {
    id: '3',
    name: 'Ceylon Spice Caterers',
    category: 'Catering',
    location: 'Colombo',
    price: 'LKR 3,200',
    pricePerGuest: true,
    rating: 4.7,
    reviewCount: 88,
    availability: 'Free on 12 Dec, night',
    imageSrc: '/images/ceylon-spice.jpg',
    imageAlt: 'Ceylon Spice Caterers buffet service staff preparing dishes',
    isAdded: true,
  },
  {
    id: '4',
    name: 'Bloom Decor',
    category: 'Decoration',
    location: 'Colombo',
    price: 'LKR 220,000',
    rating: 4.6,
    reviewCount: 40,
    availability: 'Free on 12 Dec, night',
    imageSrc: '/images/bloom-deco.jpg',
    imageAlt: 'Bloom Decor floral poruwa and wedding backdrop arrangement',
    isAdded: true,
  },
];

export default function VendorList({
  vendors = defaultMockVendors,
  onToggleAdd,
  onViewProfile,
}: VendorListProps) {
  // Group vendors by category
  const categories = Array.from(new Set(vendors.map((v) => v.category)));

  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const catVendors = vendors.filter((v) => v.category === cat);
        return (
          <section key={cat} aria-label={`${cat} section`}>
            {/* Category Subheader */}
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#4B5563] mb-3">
              {cat.toUpperCase()} ({catVendors.length})
            </h4>

            {/* List of Vendor Cards in this Category */}
            <div className="space-y-4">
              {catVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onToggleAdd={onToggleAdd}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

