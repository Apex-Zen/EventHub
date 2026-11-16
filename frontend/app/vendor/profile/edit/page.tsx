import React from 'react';
import Link from 'next/link';

export default function EditVendorProfile() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F8FAFC]">
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
    </div>
  );
}