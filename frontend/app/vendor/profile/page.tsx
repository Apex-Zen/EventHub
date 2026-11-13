import React from 'react';

import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'] 
});

export default function VendorProfile() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F8FAFC]">
      
      {/* Top Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] font-serif">Profile</h1>
          
        </div>
        <button className="px-5 py-2.5 border border-[#166534] text-[#166534] font-medium hover:bg-[#F0FDF4] transition-colors text-sm rounded-sm">
          Edit profile
        </button>
      </div>

      {/* Hero Banner Section */}
      <div className="relative w-full h-72 overflow-hidden mb-10 shadow-sm bg-[#111827] rounded-sm">
        
        <div className="absolute inset-0 bg-[url('/vendor-images/portfolioimg1.jpg')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 flex items-end">
          <div className="flex items-center gap-6">
            
            {/* Profile Image */}
        <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-[#E5E7EB] shadow-md flex-shrink-0">
          <img 
            src="/vendor-images/studioprofile.jpg" 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
            
            {/* Text Details */}
            <div className="text-white mb-2">
              <p className="text-xs font-bold tracking-wider uppercase mb-1 text-gray-300">Photography • Colombo</p>
              
            
              <h2 className={`text-5xl font-bold mb-2 tracking-wide ${playfair.className}`}>Lens & Light Studio</h2>
              
              <p className="text-sm text-gray-200">Kasun Fernando • Age 34 • ★ 4.8 • 62 reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: About & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-7 space-y-8">
          
          <section>
            <h3 className="text-xl font-bold font-serif text-[#111827] mb-4">About</h3>
            <p className="text-[#4B5563] leading-relaxed text-sm">
              Wedding and event photography since 2014. Two photographers, drone coverage on request, edited album in four weeks. Based in Nugegoda, travel anywhere in the Western Province.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold font-serif text-[#111827] mb-4">Recent work</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 overflow-hidden bg-[#E5E7EB] rounded-sm">
                 <img src="/vendor-images/portfolioimg2.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform" alt="Recent Work 1"/>
              </div>
              <div className="h-32 overflow-hidden bg-[#E5E7EB] rounded-sm">
                 <img src="/vendor-images/portfolioimg3.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform" alt="Recent Work 2"/>
              </div>
              <div className="h-32 overflow-hidden bg-[#E5E7EB] rounded-sm">
                 <img src="/vendor-images/portfolioimg4.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform" alt="Recent Work 3"/>
              </div>
            </div>
          </section>

        </div>

        <div className="lg:col-span-5">
          <h3 className="text-xl font-bold font-serif text-[#111827] mb-4">Services</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-4 border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#1F2937]">Full-day wedding coverage</span>
              <div className="flex items-center gap-6">
                <span className="text-xs text-[#6B7280]">10 hours</span>
                <span className="text-sm font-bold text-[#111827] w-24 text-right">LKR 180,000</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#1F2937]">Pre-shoot session</span>
              <div className="flex items-center gap-6">
                <span className="text-xs text-[#6B7280]">3 hours</span>
                <span className="text-sm font-bold text-[#111827] w-24 text-right">LKR 45,000</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#1F2937]">Drone add-on</span>
              <div className="flex items-center gap-6">
                <span className="text-xs text-[#6B7280]">2 hours</span>
                <span className="text-sm font-bold text-[#111827] w-24 text-right">LKR 25,000</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}