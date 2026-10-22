import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
          <nav className="space-y-1">
            <Link href="/client/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100">
              <span className="text-lg">🏠</span> Dashboard
            </Link>
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Events
            </div>
            <Link href="/client/events/create" className="flex items-center gap-3 px-3 py-2 text-[#266665] bg-[#DAEDED] rounded-lg font-medium">
              <span className="text-lg">✨</span> Plan a private event
            </Link>
            <Link href="/client/events/public/create" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100">
              <span className="text-lg">🎫</span> Create a public event
            </Link>
            <Link href="/client/events" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100">
              <span className="text-lg">📅</span> View all my events
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
