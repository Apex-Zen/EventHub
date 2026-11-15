import React from 'react';
import Link from 'next/link';

interface WaitingPageHeaderProps {
  eventTitle?: string;
  backHref?: string;
  sentInfo?: string;
}

export default function WaitingPageHeader({
  eventTitle = 'Perera–Silva wedding',
  backHref,
  sentInfo = 'Sent Mon 19 Oct, 9.40 pm. Responses close Wed 21 Oct, 9.40 pm.',
}: WaitingPageHeaderProps) {
  return (
    <div className="space-y-1">
      {/* Back link */}
      <div>
        <Link
          href={backHref || '#'}
          className="text-xs sm:text-sm font-medium text-[#266665] hover:text-[#123B3A] inline-flex items-center gap-1.5 transition-colors no-underline hover:no-underline"
        >
          <span aria-hidden="true">&larr;</span> {eventTitle}
        </Link>
      </div>

      {/* Main Title */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2430] leading-tight">
        Waiting for vendors
      </h1>

      {/* Sent / Expiry Info */}
      {sentInfo && (
        <p className="text-xs sm:text-sm text-[#4B5563]">
          {sentInfo}
        </p>
      )}
    </div>
  );
}

