import React from 'react';
import VendorSidebar from '../components/VendorSidebar';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <VendorSidebar />
      
      
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}