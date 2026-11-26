import { BadgeVariant } from '@/components/dashboard/types';

export interface BeforeTheDayItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  actionLabel?: string;
  actionHref?: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  activity: string;
}
