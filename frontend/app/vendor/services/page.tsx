import React from 'react';
import Link from 'next/link';

export default function VendorServices() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F8FAFC]">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] font-serif mb-1">Services</h1>
          <p className="text-sm text-[#4B5563]">Prices here are what clients see in their package.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#166534] text-white font-medium hover:bg-[#14532d] transition-colors text-sm rounded-sm">
          + Add service
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Services Table / List */}
        <div className="lg:col-span-8 bg-white rounded-sm shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="grid grid-cols-12 bg-[#DCFCE7] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#166534] border-b border-[#E5E7EB]">
            <div className="col-span-6">Service</div>
            <div className="col-span-3">Duration</div>
            <div className="col-span-3 text-right">Price (LKR)</div>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {/* Row 1 */}
            <div className="grid grid-cols-12 px-6 py-4 items-center text-sm">
              <div className="col-span-6 font-medium text-[#111827]">Full-day wedding coverage</div>
              <div className="col-span-3 text-[#4B5563]">10 hours</div>
              <div className="col-span-3 text-right font-bold text-[#111827]">180,000</div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 px-6 py-4 items-center text-sm">
              <div className="col-span-6 font-medium text-[#111827]">Half-day coverage</div>
              <div className="col-span-3 text-[#4B5563]">5 hours</div>
              <div className="col-span-3 text-right font-bold text-[#111827]">95,000</div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-12 px-6 py-4 items-center text-sm">
              <div className="col-span-6 font-medium text-[#111827]">Pre-shoot session</div>
              <div className="col-span-3 text-[#4B5563]">3 hours</div>
              <div className="col-span-3 text-right font-bold text-[#111827]">45,000</div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-12 px-6 py-4 items-center text-sm">
              <div className="col-span-6 font-medium text-[#111827]">Drone add-on</div>
              <div className="col-span-3 text-[#4B5563]">2 hours</div>
              <div className="col-span-3 text-right font-bold text-[#111827]">25,000</div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-12 px-6 py-4 items-center text-sm">
              <div className="col-span-6 font-medium text-[#111827]">Printed album, 40 pages</div>
              <div className="col-span-3 text-[#4B5563]">—</div>
              <div className="col-span-3 text-right flex items-center justify-end gap-3">
                <span className="font-bold text-[#111827]">35,000</span>
                <button className="text-xs text-[#166534] hover:underline font-medium">Edit</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Add Service Form Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-sm shadow-sm border border-[#E5E7EB] space-y-5">
          <h3 className="font-serif font-bold text-xl text-[#111827]">Add service</h3>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-2">Service name</label>
            <input 
              type="text" 
              placeholder="e.g. Homecoming coverage" 
              className="w-full p-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#166534]" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-2">Duration</label>
            <input 
              type="text" 
              placeholder="4 hours" 
              className="w-full p-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#166534]" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-2">Price (LKR)</label>
            <input 
              type="text" 
              placeholder="60,000" 
              className="w-full p-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#166534]" 
            />
          </div>

          <button className="w-full py-3 bg-[#166534] text-white font-medium hover:bg-[#14532d] transition-colors text-sm rounded-sm">
            Add
          </button>

          <div className="p-4 bg-[#DCFCE7] border border-[#BBF7D0] rounded-sm text-xs text-[#166534] leading-relaxed">
            ℹ️ A changed price shows in new client packages. Packages already accepted keep the agreed price.
          </div>
        </div>

      </div>
    </div>
  );
}