'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Store,
  ShieldBan,
  Users2,
  UserCheck,
  PackageCheck,
  Radio,
  QrCode,
  AlertTriangle,
  Scale,
  FileText,
  Wallet,
  ChevronDown,
  Menu,
  X,
  Compass,
  MessageCircle,
} from 'lucide-react';
import { EventHubLogoIcon } from '../icons/LocationIcons';

interface SidebarProps {
  onOpenGeofenceModal?: () => void;
  onOpenGuestRsvpModal?: () => void;
  onOpenQrScannerModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenGeofenceModal,
  onOpenGuestRsvpModal,
  onOpenQrScannerModal,
}) => {
  const pathname = usePathname();
  const [selectedEvent, setSelectedEvent] = useState('Perera–Silva wedding');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const availableEvents = [
    'Perera–Silva wedding',
    'Galle Fort Jazz Night',
    'Fonseka anniversary',
    'Jayasuriya homecoming',
    'Wickrama birthday',
  ];

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '#analytics', icon: BarChart3 },
    { label: 'Vendors', href: '#vendors', icon: Store, onClick: onOpenGeofenceModal },
    { label: 'Blacklist', href: '#blacklist', icon: ShieldBan },
    { label: 'Staff', href: '#staff', icon: Users2 },
    { label: 'Users', href: '#users', icon: UserCheck, onClick: onOpenGuestRsvpModal },
    { label: 'Packages', href: '#packages', icon: PackageCheck },
    { label: 'War Room', href: '/war-room', icon: Radio, highlight: true },
    { label: 'Check-in', href: '#checkin', icon: QrCode, onClick: onOpenQrScannerModal },
    { label: 'Incidents', href: '#incidents', icon: AlertTriangle },
    { label: 'Disputes', href: '#disputes', icon: Scale },
    { label: 'Audit logs', href: '#audit-logs', icon: FileText },
    { label: 'Finance', href: '#finance', icon: Wallet },
  ];

  return (
    <>
      {/* Mobile Top Header Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <EventHubLogoIcon size={24} color="#266665" />
          <span className="font-serif font-bold text-xl text-slate-900 tracking-tight">EventHub</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-600 hover:text-[#266665] rounded-lg"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 pt-7 pb-4">
          <div className="flex items-center gap-2.5">
            <EventHubLogoIcon size={26} color="#266665" />
            <h1 className="font-serif font-bold text-2xl text-slate-900 tracking-tight">
              EventHub
            </h1>
          </div>
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 mt-1 uppercase">
            EVENT MANAGER
          </p>
        </div>

        {/* Active Event Dropdown */}
        <div className="px-5 py-3 relative">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Event
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-md px-3 py-2 text-left text-[13px] text-slate-800 flex items-center justify-between shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#266665]"
            >
              <span className="truncate font-normal">{selectedEvent}</span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-150 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-30">
                {availableEvents.map((evt) => (
                  <button
                    key={evt}
                    type="button"
                    onClick={() => {
                      setSelectedEvent(evt);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-[#e6f0f0] ${
                      selectedEvent === evt
                        ? 'font-medium text-[#266665] bg-[#e6f0f0]/60'
                        : 'text-slate-600'
                    }`}
                  >
                    {evt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-0 py-2 space-y-0.5 text-[14px]">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard' || pathname === '/'
                : item.href === '/war-room'
                ? pathname === '/war-room'
                : false;

            const Icon = item.icon;

            return (
              <div key={item.label} className="relative">
                {item.href.startsWith('/') ? (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-6 py-2.5 transition-all text-slate-600 hover:text-[#266665] hover:bg-[#f8faf9] ${
                      isActive
                        ? 'bg-[#e6f0f0] text-[#266665] font-medium border-l-4 border-[#266665]'
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    <Icon size={17} className={isActive ? 'text-[#266665]' : 'text-slate-400'} />
                    <span>{item.label}</span>
                    {item.highlight && (
                      <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-600 animate-pulse">
                        LIVE
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-2.5 transition-all text-slate-600 hover:text-[#266665] hover:bg-[#f8faf9] border-l-4 border-transparent text-left"
                  >
                    <Icon size={17} className="text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Operations Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#fafcfb]">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
            Operations Shortcuts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenGeofenceModal}
              className="text-xs bg-white border border-gray-200 hover:border-[#266665] hover:text-[#266665] text-slate-700 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Compass size={13} className="text-[#266665]" />
              GPS Gate
            </button>
            <button
              onClick={onOpenGuestRsvpModal}
              className="text-xs bg-white border border-gray-200 hover:border-[#266665] hover:text-[#266665] text-slate-700 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <MessageCircle size={13} className="text-emerald-600" />
              WhatsApp
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
