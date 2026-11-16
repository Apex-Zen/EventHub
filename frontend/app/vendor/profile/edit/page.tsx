import React from 'react';
import Link from 'next/link';

export default function EditVendorProfile() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F8FAFC]">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#111827] font-serif">Edit profile</h1>
        <div className="flex items-center gap-4">
          <Link 
            href="/vendor/profile" 
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm rounded-sm text-center"
          >
            Cancel
          </Link>
          <button className="px-5 py-2.5 bg-[#115E59] text-white font-medium hover:bg-[#0f4c48] transition-colors text-sm rounded-sm">
            Save changes
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Section */}
        <div className="lg:col-span-8 bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img src="/vendor-images/studioprofile.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-sm hover:bg-gray-50 mb-1">
                Change photo
              </button>
              <p className="text-xs text-gray-400">Square JPG or PNG, at least 400 px</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Business name</label>
              <input 
                type="text" 
                defaultValue="Lens & Light Studio" 
                className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#115E59]" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Contact name</label>
              <input 
                type="text" 
                defaultValue="Kasun Fernando" 
                className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#115E59]" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Category</label>
              <select className="w-full p-3 border border-gray-200 rounded-sm text-sm bg-white focus:outline-none focus:border-[#115E59]">
                <option>Photography</option>
                <option>Videography</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">District</label>
              <select className="w-full p-3 border border-gray-200 rounded-sm text-sm bg-white focus:outline-none focus:border-[#115E59]">
                <option>Colombo</option>
                <option>Gampaha</option>
                <option>Kandy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Age</label>
            <input 
              type="text" 
              defaultValue="34" 
              className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#115E59]" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Description</label>
            <textarea 
              rows={4}
              defaultValue="Wedding and event photography since 2014. Two photographers, drone coverage on request, edited album in four weeks. Based in Nugegoda, travel anywhere in the Western Province." 
              className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#115E59]" 
            />
            <p className="text-right text-xs text-gray-400 mt-1">312 / 600 characters</p>
          </div>

        </div>

      </div>
    </div>
  );
}