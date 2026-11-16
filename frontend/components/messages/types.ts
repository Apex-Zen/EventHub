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

