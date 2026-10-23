import Link from 'next/link';
import LocationIcon from '@/components/icons/LocationIcon';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-white shadow-sm">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-extrabold text-gray-900 flex items-center gap-2 tracking-tight">
          <LocationIcon />
          EventHub
        </Link>
      </div>
      
      <div className="flex items-center gap-8 text-sm font-medium">
        <Link href="/client/dashboard" className="text-[#266665] font-semibold">Home</Link>
        <Link href="#" className="text-gray-600 hover:text-[#266665]">My events</Link>
        <Link href="#" className="text-gray-600 hover:text-[#266665]">Payments</Link>
        <Link href="#" className="text-gray-600 hover:text-[#266665]">Messages</Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-gray-700">Nadeesha P.</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </nav>
  );
}