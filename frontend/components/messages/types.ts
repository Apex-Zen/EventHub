export interface MessageItem {
  id: string;
  sender: 'user' | 'vendor';
  text: string;
  timestamp: string;
}

export interface PackageDetails {
  title: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
  date: string;
  status: string;
  noticeText?: string;
}

export interface ConversationItem {
  id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  statusNote: string;
  avatarSrc: string;
  lastMessage: string;
  lastMessageTime: string;
  packageDetails: PackageDetails;
  messages: MessageItem[];
}

export type InboxFilter = 'all' | 'vendors' | 'team' | 'unread';

export interface InboxItem {
  id: string;
  name: string;
  roleOrCategory?: string;
  avatarSrc: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  category: 'vendor' | 'team';
  href: string;
}


