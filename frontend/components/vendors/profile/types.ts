export interface VendorPackageOption {
  id: string;
  name: string;
  price: string;
  pricePerGuest?: boolean;
  description: string;
  features: string[];
  isPopular?: boolean;
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
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  aboutText: string;
  heroImage: string;
  portfolio: VendorPortfolioImage[];
  packages: VendorPackageOption[];
  reviews: VendorReviewItem[];
  availabilityNote?: string;
}

