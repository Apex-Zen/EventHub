'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/navigation/sidebar';
import { DashboardHeader } from '../../components/manager/DashboardHeader';
import { KpiSummaryGrid } from '../../components/manager/KpiSummaryGrid';
import { PackageApprovalQueue } from '../../components/manager/PackageApprovalQueue';
import { TodayEventsCard } from '../../components/manager/TodayEventsCard';
import { AlertsCard } from '../../components/manager/AlertsCard';
import { CommissionCard } from '../../components/manager/CommissionCard';
import {
  managerApi,
  KpiMetrics,
  PackageItem,
  TodayEventItem,
  AlertItem,
  CommissionStats,
} from '../../services/managerApi';

export default function EventManagerDashboardPage() {
  const [metrics, setMetrics] = useState<KpiMetrics>(managerApi.getKpiMetrics());
  const [packages, setPackages] = useState<PackageItem[]>(managerApi.getPackageQueue());
  const [todayEvents, setTodayEvents] = useState<TodayEventItem[]>(managerApi.getTodayEvents());
  const [alerts, setAlerts] = useState<AlertItem[]>(managerApi.getAlerts());
  const [commissionStats] = useState<CommissionStats>(managerApi.getCommissionStats());

  const refreshDashboardState = () => {
    setMetrics(managerApi.getKpiMetrics());
    setPackages(managerApi.getPackageQueue());
    setTodayEvents(managerApi.getTodayEvents());
    setAlerts(managerApi.getAlerts());
  };

  useEffect(() => {
    refreshDashboardState();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-sans antialiased">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar />

      {/* 2. Main Dashboard Content Area */}
      <main className="flex-1 p-5 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <DashboardHeader />

        {/* 4 KPI Summary Grid */}
        <KpiSummaryGrid
          metrics={metrics}
          onFilterClick={() => refreshDashboardState()}
        />

        {/* Main 2-Column Content Grid matching UI Wireframe Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Approx 60% Width / 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Package Approval Queue */}
            <PackageApprovalQueue
              packages={packages}
              onPackageUpdated={refreshDashboardState}
            />

            {/* Alerts Card */}
            <AlertsCard
              alerts={alerts}
              onAlertUpdated={refreshDashboardState}
            />
          </div>

          {/* Right Column (Approx 40% Width / 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Today's Events */}
            <TodayEventsCard events={todayEvents} />

            {/* Commission This Month */}
            <CommissionCard stats={commissionStats} />
          </div>
        </div>
      </main>
    </div>
  );
}