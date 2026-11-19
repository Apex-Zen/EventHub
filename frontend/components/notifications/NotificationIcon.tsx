import React from 'react';
import { NotificationType } from './types';

interface NotificationIconProps {
  type: NotificationType;
  className?: string;
}

export default function NotificationIcon({ type, className = '' }: NotificationIconProps) {
  switch (type) {
    case 'rejected':
      return (
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#E02424] ${className}`}
          aria-hidden="true"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );

    case 'accepted':
      return (
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center text-[#266665] ${className}`}
          aria-hidden="true"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );

    case 'warning':
      return (
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF8E7] text-[#D97706] border border-amber-200/50 ${className}`}
          aria-hidden="true"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 7v5l3 2"
            />
          </svg>
        </div>
      );

    case 'message':
      return (
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#DBECEC] text-[#266665] ${className}`}
          aria-hidden="true"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      );

    case 'payment':
      return (
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#DBECEC] text-[#266665] ${className}`}
          aria-hidden="true"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M2 10h20M7 15h2" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}

