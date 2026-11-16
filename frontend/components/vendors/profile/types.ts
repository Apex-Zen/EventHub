export interface VendorPackageOption {
  id: string;
  name: string;
  price: string;
  pricePerGuest?: boolean;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface VendorServiceItem {
  id: string;
  name: string;
  duration: string;   // e.g. "10 hours"
  price: string;      // e.g. "LKR 180,000"
}

export interface VendorReviewItem {
  id: string;
  authorName: string;
  authorLocation?: string;
  rating: number;
  date: string;
  comment: string;
  eventTypeName?: string;
}

export interface VendorPortfolioImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface VendorProfileDetail {
  id: string;
  name: string;
  ownerName?: string;   // e.g. "Kasun Fernando"
  ownerAge?: number;    // e.g. 34
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  aboutText: string;
  heroImage: string;
  services?: VendorServiceItem[];
  portfolio: VendorPortfolioImage[];
  packages: VendorPackageOption[];
  reviews: VendorReviewItem[];
  availabilityNote?: string;
  ratingBreakdown?: Record<number, number>; // star → count, e.g. { 5: 48, 4: 10, … }
}
