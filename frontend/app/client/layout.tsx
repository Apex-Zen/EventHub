import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
          <nav className="space-y-2">
            <Link href="/client/dashboard" className="block px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">Dashboard</Link>
            <Link href="/client/events/create" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">Plan a private event</Link>
            <Link href="#" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">Create a public event</Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}