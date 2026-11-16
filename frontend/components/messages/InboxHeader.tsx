import React from 'react';

interface InboxHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function InboxHeader({
  title = 'Messages',
  subtitle = 'Vendors in your packages and the EventHub team (staff and Event Manager).',
}: InboxHeaderProps) {
  return (
    <div className="mb-6 space-y-2">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1B2430]">
        {title}
      </h1>
      <p className="text-sm sm:text-base text-[#4B5563]">
        {subtitle}
      </p>
    </div>
  );
}

