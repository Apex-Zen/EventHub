'use client';

import React from 'react';
import {
  SalesHeroBanner,
  SalesKpiRow,
  SalesByTierCard,
  TicketsPerDayChart,
  LatestPurchasesCard,
  SalesKpiItem,
  TierSalesRow,
  DailyTicketSale,
  PurchaseRow,
} from '@/components/events/public/sales';

const KPI_ITEMS: SalesKpiItem[] = [
  {
    id: 'tickets-sold',
    label: 'Tickets sold',
    value: '312 / 500',
    subtext: '62% of capacity',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: 'LKR 1,003,000',
    subtext: 'Before gateway fees',
  },
  {
    id: 'sold-today',
    label: 'Sold today',
    value: '41',
    subtext: 'Since midnight',
  },
  {
    id: 'checked-in',
    label: 'Checked in at gate',
    value: '0',
    subtext: 'Gate opens 14 Nov, 6.00 pm',
  },
];

const TIER_ROWS: TierSalesRow[] = [
  {
    id: 'tier-general',
    tier: 'General',
    price: 2500,
    sold: 220,
    left: 130,
    revenue: 550000,
    progress: 63,
  },
  {
    id: 'tier-vip',
    tier: 'VIP',
    price: 6000,
    sold: 70,
    left: 50,
    revenue: 420000,
    progress: 58,
  },
  {
    id: 'tier-student',
    tier: 'Student',
    price: 1500,
    sold: 22,
    left: 8,
    revenue: 33000,
    progress: 73,
  },
];

const DAILY_SALES: DailyTicketSale[] = [
  { dateLabel: '12 Oct', count: 24 },
  { dateLabel: '13', count: 31 },
  { dateLabel: '14', count: 18 },
  { dateLabel: '15', count: 44 },
  { dateLabel: '16', count: 38 },
  { dateLabel: '17', count: 57 },
  { dateLabel: '18', count: 49 },
  { dateLabel: '19 Oct', count: 41, isLatest: true },
];

const LATEST_PURCHASES: PurchaseRow[] = [
  {
    id: 'p1',
    time: '10.21 pm',
    buyer: 'Dilan R.',
    tier: 'VIP',
    qty: 2,
    passCode: 'EH-T-7F3K-21',
  },
  {
    id: 'p2',
    time: '10.14 pm',
    buyer: 'Sachini M.',
    tier: 'General',
    qty: 4,
    passCode: 'EH-T-7F3J-88',
  },
  {
    id: 'p3',
    time: '9.58 pm',
    buyer: 'Amal K.',
    tier: 'General',
    qty: 1,
    passCode: 'EH-T-7F3H-05',
  },
  {
    id: 'p4',
    time: '9.40 pm',
    buyer: 'Tharushi D.',
    tier: 'Student',
    qty: 1,
    passCode: 'EH-T-7F3G-61',
  },
];

export default function PublicEventSalesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFA]">
      {/* Full-bleed Dark Event Hero Banner */}
      <SalesHeroBanner
        title="Galle Face Jazz Night"
        subtitle="Sat 14 Nov 2026, 7.00 pm · Galle Face Green"
        coverImageSrc="/images/event-3.jpg"
        editTiersHref="/client/events/public"
      />

      {/* Main Analytics Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 4-column KPI summary row */}
        <SalesKpiRow items={KPI_ITEMS} />

        {/* Middle Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            <SalesByTierCard rows={TIER_ROWS} />
          </div>
          <div className="lg:col-span-5">
            <TicketsPerDayChart data={DAILY_SALES} />
          </div>
        </div>

        {/* Bottom Section: Latest Purchases */}
        <LatestPurchasesCard purchases={LATEST_PURCHASES} />
      </div>
    </div>
  );
}
