import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EventHub — Event Manager Dashboard & Operations',
  description: 'Event day operations, package approvals, GPS geofencing, QR ticketing, and War Room command center.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f9fafb] text-slate-800 selection:bg-[#266665] selection:text-white">
        {children}
      </body>
    </html>
  );
}
