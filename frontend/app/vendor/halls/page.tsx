import React from 'react';

export default function VendorHalls() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Halls and time slots</h1>
          <p className="text-sm text-ink-600">For venue vendors. Each hall has its own slots, price and diary.</p>
        </div>
        <button className="px-5 py-2.5 bg-green-600 text-white font-medium hover:bg-[#14532d] transition-colors text-sm rounded-sm">
          + Add hall
        </button>
      </div>

      {/* Halls List Container */}
      <div className="space-y-6">
        
        {/* Hall Card 1: Grand Ballroom */}
        <div className="bg-white rounded-sm border border-line shadow-sm overflow-hidden p-6">
          
          {/* Hall Header Details */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-line">
            <div className="flex items-center gap-4">
              <div className="w-36 h-24 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0">
                <img 
                  src="/vendor-images/portfolioimg1.jpg" 
                  alt="Grand Ballroom" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-ink-900 mb-1">Grand Ballroom</h2>
                <p className="text-xs text-ink-600">Indoor · up to 500 guests · air conditioned</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-line rounded-sm text-xs font-medium text-ink-900 hover:border-green-600 transition-colors">
                Edit hall
              </button>
              <button className="px-4 py-2 bg-green-600/10 text-green-700 rounded-sm text-xs font-medium hover:bg-green-600/20 transition-colors">
                + Add slot
              </button>
            </div>
          </div>

          {/* Slots Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-50/60 border-b border-line text-xs font-bold text-green-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-xs">
                
                {/* Slot 1: Day */}
                <tr>
                  <td className="py-4 px-4 font-medium text-ink-900">Day</td>
                  <td className="py-4 px-4 text-ink-600">8.00 am – 3.00 pm</td>
                  <td className="py-4 px-4 font-medium text-ink-900">LKR 450,000</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-medium">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-green-600 font-medium hover:underline">Edit</button>
                  </td>
                </tr>

                {/* Slot 2: Night */}
                <tr>
                  <td className="py-4 px-4 font-medium text-ink-900">Night</td>
                  <td className="py-4 px-4 text-ink-600">6.00 pm – 11.30 pm</td>
                  <td className="py-4 px-4 font-medium text-ink-900">LKR 650,000</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-medium">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-green-600 font-medium hover:underline">Edit</button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>

        {/* Hall Card 2: Outdoor Lawn */}
        <div className="bg-white rounded-sm border border-line shadow-sm overflow-hidden p-6">
          
          {/* Hall Header Details */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-line">
            <div className="flex items-center gap-4">
              <div className="w-36 h-24 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0">
                <img 
                  src="/vendor-images/portfolioimg2.jpg" 
                  alt="Outdoor Lawn" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-ink-900 mb-1">Outdoor Lawn</h2>
                <p className="text-xs text-ink-600">Garden by the lake · up to 300 guests</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-line rounded-sm text-xs font-medium text-ink-900 hover:border-green-600 transition-colors">
                Edit hall
              </button>
              <button className="px-4 py-2 bg-green-600/10 text-green-700 rounded-sm text-xs font-medium hover:bg-green-600/20 transition-colors">
                + Add slot
              </button>
            </div>
          </div>

          {/* Slots Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-50/60 border-b border-line text-xs font-bold text-green-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-xs">
                
                {/* Slot 1: Day */}
                <tr>
                  <td className="py-4 px-4 font-medium text-ink-900">Day</td>
                  <td className="py-4 px-4 text-ink-600">8.00 am – 3.00 pm</td>
                  <td className="py-4 px-4 font-medium text-ink-900">LKR 280,000</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-medium">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-green-600 font-medium hover:underline">Edit</button>
                  </td>
                </tr>

                {/* Slot 2: Night (Paused in monsoon) */}
                <tr>
                  <td className="py-4 px-4 font-medium text-ink-900">Night</td>
                  <td className="py-4 px-4 text-ink-600">6.00 pm – 11.30 pm</td>
                  <td className="py-4 px-4 font-medium text-ink-900">LKR 380,000</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                      Paused in monsoon
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-green-600 font-medium hover:underline">Edit</button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}