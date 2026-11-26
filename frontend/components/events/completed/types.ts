export interface VendorToRate {
  id: string;
  name: string;
  category: string;
  service: string;
  avatarSrc: string;
  initialRating?: number;
  initialComment?: string;
}
