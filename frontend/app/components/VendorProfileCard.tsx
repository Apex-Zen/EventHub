import React from 'react';

export default function VendorProfileCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden my-6">
      {/* Studio Image Banner */}
      <div className="h-28 bg-gray-200 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
          alt="Lens & Light Studio"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Details */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-semibold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
            LL
          </div>
          <div>
            <h3 className="font-bold text-gray-900 font-serif text-base leading-tight">
              Lens & Light Studio
            </h3>
            <p className="text-xs text-gray-500">Photography · Colombo · Age 34</p>
          </div>
        </div>

        {/* Footer Score & Link */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-teal-700 font-bold text-sm">4.8</span>
            <span className="text-gray-500">public score</span>
          </div>
          <button className="text-teal-700 font-medium hover:underline">
            View profile
          </button>
        </div>
      </div>
    </div>
  );
}