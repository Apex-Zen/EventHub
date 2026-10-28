import React from 'react';
import VendorStatCards from '../../components/VendorStatCards';
import VendorPackageRequest from '../../components/VendorPackageRequest';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Good evening, Kasun</h1>
      <p className="text-sm text-gray-500 mt-1">Monday 19 October 2026</p>

      {/* Stat Cards Component */}
      <VendorStatCards />

      {/* New Package Request Component */}
      <VendorPackageRequest />
    </div>
  );
}