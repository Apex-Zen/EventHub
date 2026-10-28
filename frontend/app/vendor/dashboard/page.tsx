import React from 'react';
import VendorStatCards from '../../components/VendorStatCards';
import VendorPackageRequest from '../../components/VendorPackageRequest';
import VendorProfileCard from '../../components/VendorProfileCard';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Good evening, Kasun</h1>
        <p className="text-sm text-gray-500 mt-1">Monday 19 October 2026</p>
      </div>

      {/* Top Stat Cards Row */}
      <VendorStatCards />

      {/* Middle Row: Request Card (2 cols) & Profile Card (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <VendorPackageRequest />
        </div>
        <div className="lg:col-span-1">
          <VendorProfileCard />
        </div>
      </div>
    </div>
  );
}