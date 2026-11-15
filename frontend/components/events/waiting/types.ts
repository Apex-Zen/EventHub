export type VendorStatus = 'Waiting' | 'Accepted' | 'Rejected' | 'Expired';

export interface WaitingVendorItem {
  id: string;
  name: string;
  category: string;
  priceFormatted: string;
  priceValue: number;
  status: VendorStatus;
  image: string;
}

