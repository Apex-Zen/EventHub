export type NotificationType = 'rejected' | 'accepted' | 'warning' | 'message' | 'payment';

export type NotificationCategory = 'package' | 'payment' | 'message';

export type NotificationFilter = 'all' | 'package' | 'payment' | 'message';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: NotificationType;
  category: NotificationCategory;
  link?: string;
}

export interface EventSummary {
  id?: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  date: string;
  acceptedVendorsText: string;
  depositDue: string;
  payDepositHref?: string;
}

