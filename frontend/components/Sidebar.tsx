// components/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full fixed">
      <div className="p-6 text-2xl font-bold text-teal-800 tracking-tight flex items-center gap-2">
        <span>📍</span> EventHub
      </div>
      <div className="px-6 pb-4 text-xs font-semibold text-gray-400">VENDOR</div>
      <nav className="flex-1 px-4 space-y-1">
        <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Dashboard</Link>
        <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Profile</Link>
        <Link href="/services" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Services</Link>
        <Link href="/portfolio" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Portfolio</Link>
        <Link href="/diary" className="block px-4 py-2 bg-teal-50 text-teal-800 font-medium rounded-md border-l-4 border-teal-600">Diary</Link>
      </nav>
    </aside>
  );
}