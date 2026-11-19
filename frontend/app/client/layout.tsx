import { Suspense } from 'react';
import Navbar from '@/components/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}