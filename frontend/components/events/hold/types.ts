import { BadgeVariant } from '@/components/dashboard/types';

export interface HoldVendorItem {
  id: string;
  name: string;
  subtitle: string;
  statusText: string;
  statusVariant: BadgeVariant;
}
