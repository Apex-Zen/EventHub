import React from 'react';
import VendorStatCards from '../../components/VendorStatCards';
import VendorPackageRequest from '../../components/VendorPackageRequest';
import VendorProfileCard from '../../components/VendorProfileCard';
import VendorServicesCard from '../../components/VendorServicesCard';
import VendorReviewsCard from '../../components/VendorReviewsCard';
import VendorPortfolioCard from '../../components/VendorPortfolioCard';
import VendorDiaryCard from '../../components/VendorDiaryCard';

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

      {/* Row 1: Package Request & Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <VendorPackageRequest />
        </div>
        <div className="lg:col-span-1">
          <VendorProfileCard />
        </div>
      </div>

      {/* Row 2: Services & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <VendorServicesCard />
        </div>
        <div className="lg:col-span-1">
          <VendorReviewsCard />
        </div>
      </div>

      {/* Row 3: Portfolio & Diary (Calendar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <VendorPortfolioCard />
        </div>
        <div className="lg:col-span-1">
          <VendorDiaryCard />
        </div>
      </div>
    </div>
  );
}