
"use client";

import React, { useState } from "react";
import Link from "next/link";
import LocationIcon from "@/components/icons/LocationIcons";

/**
 * Live War Room Operations Center Page
 * Matches Figma wireframe layout and interactive status badges.
 */
export default function WarRoomPage() {
  const [selectedEvent, setSelectedEvent] = useState("Perera-Silva wedding");

  // Navigation items for the sidebar
  const navItems = [
    { label: "Dashboard", href: "/dashboard", active: false },
    { label: "Analytics", href: "/analytics", active: false },
    { label: "Vendors", href: "/vendors", active: false },
    { label: "Blacklist", href: "/blacklist", active: false },
    { label: "Staff", href: "/staff", active: false },
    { label: "Users", href: "/users", active: false },
    { label: "Packages", href: "/packages", active: false },
    { label: "War Room", href: "/war-room", active: true },
    { label: "Check-in", href: "/check-in", active: false },
    { label: "Incidents", href: "/incidents", active: false },
    { label: "Disputes", href: "/disputes", active: false },
    { label: "Audit logs", href: "/audit-logs", active: false },
    { label: "Finance", href: "/finance", active: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800">
      {/* ----------------- SIDEBAR ----------------- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between py-6 px-4 shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-2.5 px-3 mb-6">
            <LocationIcon />
            <span className="text-xl font-bold text-slate-800 tracking-tight">EventHub</span>
          </div>

          {/* Event Context Selector */}
          <div className="px-3 mb-6">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
              Event Manager
            </label>
            <div className="text-xs text-slate-500 mb-1">Event</div>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-slate-700 outline-none focus:ring-1 focus:ring-sky-500 font-medium"
            >
              <option value="Perera-Silva wedding">Perera-Silva wedding</option>
              <option value="Fonseka anniversary">Fonseka anniversary</option>
              <option value="Jayasuriya homecoming">Jayasuriya homecoming</option>
            </select>
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  item.active
                    ? "bg-sky-50 text-sky-600 border-l-4 border-sky-500 rounded-l-none"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile Mini Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              N
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Shehan Gunawardena</p>
              <p className="text-[10px] text-slate-400">Event Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN WAR ROOM CONTENT ----------------- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-slate-900">Live War Room</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                LIVE 5.12 pm
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sat 12 Dec 2026 · Waters Edge, Battaramulla · Guests from 6.30 pm
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-sky-500 text-sky-600 text-xs font-medium rounded-lg hover:bg-sky-50 transition-colors">
              Show check-in code
            </button>
            <button className="px-4 py-2 bg-sky-600 text-white text-xs font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
              Mark event completed
            </button>
          </div>
        </div>

        {/* Status Metrics Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          {/* Arrived Metric */}
          <div className="flex items-baseline gap-4 border-l-4 border-emerald-500 pl-4">
            <span className="text-4xl font-bold text-slate-800">2</span>
            <span className="text-sm font-medium text-slate-600">Arrived</span>
          </div>

          {/* Pending Metric */}
          <div className="flex items-baseline gap-4 border-l-4 border-amber-400 pl-4">
            <span className="text-4xl font-bold text-slate-800">1</span>
            <span className="text-sm font-medium text-slate-600">Pending</span>
          </div>

          {/* Late / Alert Metric */}
          <div className="flex items-baseline gap-4 border-l-4 border-red-500 pl-4">
            <span className="text-4xl font-bold text-slate-800">1</span>
            <span className="text-sm font-medium text-slate-600">Late / alert</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 -mt-3 mb-6 flex items-center gap-1">
          <span>🔄</span> Refreshes automatically. No need to call each vendor.
        </p>

        {/* Vendor Grid & Right-Hand Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Columns: Vendor Cards (2 cols on large screen) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Lens & Light Studio */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                    PHOTOGRAPHY
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600">
                    Arrived
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                    📷
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Lens & Light Studio</h4>
                    <p className="text-[11px] text-slate-400">Call time 4.30 pm</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Checked in 4.52 pm by GPS, 140 m from venue.
                </p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button className="flex-1 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                  Call
                </button>
                <button className="flex-1 py-1.5 text-xs font-medium text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50">
                  Message
                </button>
              </div>
            </div>

            {/* Card 2: Ceylon Spice Caterers */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                    CATERING
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600">
                    Arrived
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                    🍲
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Ceylon Spice Caterers</h4>
                    <p className="text-[11px] text-slate-400">Call time 3.30 pm</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Checked in 3.18 pm with code 390 412 (location off).
                </p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button className="flex-1 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                  Call
                </button>
                <button className="flex-1 py-1.5 text-xs font-medium text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50">
                  Message
                </button>
              </div>
            </div>

            {/* Card 3: Petal & Frame Decor */}
            <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                    DECORATION
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-600">
                    Late
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                    🌸
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Petal & Frame Decor</h4>
                    <p className="text-[11px] text-slate-400">Call time 3.00 pm</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Not checked in, 2 h 12 m after call time. Last location 2.1 km away.
                </p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button className="flex-1 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                  Call
                </button>
                <button className="flex-1 py-1.5 text-xs font-medium text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50">
                  Message
                </button>
              </div>
            </div>

            {/* Card 4: SoundWave LK */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                    SOUND AND LIGHTING
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600">
                    Pending
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                    🎵
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">SoundWave LK</h4>
                    <p className="text-[11px] text-slate-400">Call time 6.00 pm</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Not due yet. Call time in 48 min.
                </p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button className="flex-1 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                  Call
                </button>
                <button className="flex-1 py-1.5 text-xs font-medium text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50">
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Code & Activity Stream */}
          <div className="space-y-6">
            {/* Check-in Code Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 mb-3">Check-in code for today</h3>
              <div className="bg-sky-600 text-white rounded-lg py-5 text-center shadow-inner">
                <span className="text-3xl font-extrabold tracking-widest font-mono">390 412</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                For vendors whose GPS fails. Or show the venue QR at the entrance.
              </p>
            </div>

            {/* Activity Feed */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 mb-4">Activity</h3>
              <ul className="space-y-4 text-xs">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="text-slate-400 text-[10px] block">5.10 pm</span>
                    <p className="text-slate-700">
                      Petal & Frame Decor marked <strong className="text-red-500">Late</strong> (2 h past call time)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="text-slate-400 text-[10px] block">4.52 pm</span>
                    <p className="text-slate-700">
                      Lens & Light Studio arrived. Stage 2 released.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}