export interface VendorItem {
  id: string;
  name: string;
  category: string;
  location: string;
  price: string;
  basePrice: number;
  priceMultiplier?: number;
  pricePerGuest?: boolean;
  rating: number;
  reviewCount: number;
  availability: string;
  imageSrc: string;
  imageAlt: string;
  isAdded?: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  subtext?: string;
  price: number;
}

export interface VendorFilterOptions {
  categories: { name: string; checked: boolean }[];
  rating: string;
  sort: string;
}

