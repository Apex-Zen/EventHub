import React from 'react';
import VendorSidebar from '../components/VendorSidebar';



export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
      
      <VendorSidebar />
      
      
      <main className="w-full min-w-0 flex-1 p-4 lg:ml-64 lg:w-auto lg:p-8">
        {children}
      </main>
    </div>
  );
}