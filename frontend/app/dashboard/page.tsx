
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users2,
  Ban,
  UserCheck,
  Users,
  Package,
  ShieldAlert,
  CheckSquare,
  AlertTriangle,
  Scale,
  FileText,
  DollarSign,
  FileBarChart,
  ScanLine,
  MessageSquare,
  Bell,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Vendors", href: "/vendors", icon: Users2 },
  { name: "Blacklist", href: "/blacklist", icon: Ban },
  { name: "Staff", href: "/staff", icon: UserCheck },
  { name: "Users", href: "/users", icon: Users },
  { name: "Packages", href: "/packages", icon: Package },
  { name: "War Room", href: "/war-room", icon: ShieldAlert },
  { name: "Check-in", href: "/check-in", icon: CheckSquare },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Disputes", href: "/disputes", icon: Scale },
  { name: "Audit logs", href: "/audit-logs", icon: FileText },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Gate scans", href: "/gate-scans", icon: ScanLine },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen sticky top-0 select-none shrink-0">
      <div className="overflow-y-auto px-4 py-6 scrollbar-thin">
        <div className="flex items-center gap-2 px-3 mb-6">
          <div className="w-6 h-6 rounded-full border-2 border-sky-500 flex items-center justify-center">
            <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">EventHub</span>
        </div>

        <div className="mb-6 px-1">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase block mb-1">
            EVENT MANAGER
          </span>
          <div className="relative">
            <select className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2.5 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer">
              <option>Perera-Silva wedding</option>
              <option>Galle Fort Jazz Night</option>
              <option>Wickrama birthday</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-sky-50 text-sky-600 font-semibold border-l-4 border-sky-500 rounded-l-none"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
            SG
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 leading-tight">Shehan Gunawardena</p>
            <p className="text-[11px] text-slate-400">Event Manager</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const stats = [
    { label: "Live events", count: "2", subtext: "today" },
    { label: "Packages to approve", count: "5", subtext: "oldest waiting 6 h" },
    { label: "Vendors to verify", count: "3", subtext: "documents submitted" },
    { label: "Open disputes", count: "2", subtext: "1 past 48 h" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Good morning, Shehan
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Saturday 24 October 2026 · 6 events this week
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-sky-600 border border-sky-400 rounded-lg bg-white hover:bg-sky-50 shadow-sm transition">
            Open War Room
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
              <div className="text-3xl font-bold text-slate-900 mt-2">{stat.count}</div>
              <span className="text-xs text-slate-400 mt-1 block">{stat.subtext}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-serif font-bold text-slate-900">
                Package approval queue
              </h2>
              <Link href="/packages" className="text-xs font-medium text-sky-600 hover:underline">
                Open queue
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-4 flex justify-between items-center first:pt-0">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Perera-Silva wedding</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sat 12 Dec · 4 vendors · LKR 612,000 · stage 1 paid
                  </p>
                </div>
                <button className="px-4 py-1.5 text-xs font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 transition">
                  Review
                </button>
              </div>

              <div className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Fonseka anniversary</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sat 19 Dec · 3 vendors · LKR 248,000
                  </p>
                </div>
                <button className="px-4 py-1.5 text-xs font-medium text-sky-600 border border-sky-300 rounded-md hover:bg-sky-50 transition">
                  Review
                </button>
              </div>

              <div className="py-4 flex justify-between items-center last:pb-0">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Jayasuriya homecoming</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sun 3 Jan · 5 vendors · LKR 690,000
                  </p>
                </div>
                <button className="px-4 py-1.5 text-xs font-medium text-sky-600 border border-sky-300 rounded-md hover:bg-sky-50 transition">
                  Review
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-6">Today</h2>

            <div className="divide-y divide-slate-100">
              <div className="py-4 flex justify-between items-start first:pt-0">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Perera-Silva wedding</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Waters Edge · 2 of 4 vendors checked in
                  </p>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">
                  Live
                </span>
              </div>

              <div className="py-4 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Galle Fort Jazz Night</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Public · 1,034 scanned in
                  </p>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">
                  Live
                </span>
              </div>

              <div className="py-4 flex justify-between items-start last:pb-0">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Wickrama birthday</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Done · waiting for stage 3 release
                  </p>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-200 rounded-md">
                  Stage 3
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-6">Alerts</h2>

            <div className="divide-y divide-slate-100">
              <div className="py-4 flex justify-between items-center first:pt-0">
                <div>
                  <h3 className="text-sm font-medium text-slate-800">
                    Petal & Frame Decor is 2.5 h late
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Perera-Silva wedding · raised by Dilini R.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-rose-500 bg-rose-50 rounded-md">
                  Incident
                </span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-slate-800">
                    Ceylon Spice Caterers sent documents
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Vendor approval · BR certificate and NIC
                  </p>
                </div>
                <Link href="/vendors" className="text-xs font-semibold text-sky-600 hover:underline">
                  Check
                </Link>
              </div>

              <div className="py-4 flex justify-between items-center last:pb-0">
                <div>
                  <h3 className="text-sm font-medium text-slate-800">
                    Dispute: refund request
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fonseka anniversary · client vs SoundWave LK
                  </p>
                </div>
                <Link href="/disputes" className="text-xs font-semibold text-sky-600 hover:underline">
                  Open
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-6">
              Commission this month
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Gross bookings</span>
                <span className="font-semibold text-slate-800">LKR 8.4 M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Commission (avg 10.5%)</span>
                <span className="font-semibold text-slate-800">LKR 882,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Paid out to vendors</span>
                <span className="font-semibold text-slate-800">LKR 5.1 M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Held in escrow</span>
                <span className="font-semibold text-slate-800">LKR 2.4 M</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}