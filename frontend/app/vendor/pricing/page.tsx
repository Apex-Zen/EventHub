import React from 'react';

export default function VendorPricing() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Peak and seasonal pricing</h1>
        <p className="text-sm text-ink-600">Charge a different rate for busy dates.</p>
      </div>

      {/* Main Content Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Add a price rule form (5 columns) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-sm shadow-sm border border-line space-y-5">
          <h2 className="font-serif font-bold text-xl text-ink-900">Add a price rule</h2>

          {/* Rule Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">Rule name</label>
            <input 
              type="text" 
              defaultValue="December wedding season" 
              className="w-full p-3 border border-line rounded-sm text-sm text-ink-900 bg-white focus:outline-none focus:border-green-600" 
            />
          </div>

          {/* From & To Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">From</label>
              <input 
                type="text" 
                defaultValue="1 Dec 2026" 
                className="w-full p-3 border border-line rounded-sm text-sm text-ink-900 bg-white focus:outline-none focus:border-green-600" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">To</label>
              <input 
                type="text" 
                defaultValue="31 Jan 2027" 
                className="w-full p-3 border border-line rounded-sm text-sm text-ink-900 bg-white focus:outline-none focus:border-green-600" 
              />
            </div>
          </div>

          {/* Applies to */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">Applies to</label>
            <select className="w-full p-3 border border-line rounded-sm text-sm bg-white text-ink-900 focus:outline-none focus:border-green-600">
              <option>All services</option>
            </select>
          </div>

          {/* Change and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">Change</label>
              <select className="w-full p-3 border border-line rounded-sm text-sm bg-white text-ink-900 focus:outline-none focus:border-green-600">
                <option>Increase by %</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">Value</label>
              <input 
                type="text" 
                defaultValue="15" 
                className="w-full p-3 border border-line rounded-sm text-sm text-ink-900 bg-white focus:outline-none focus:border-green-600" 
              />
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-4 bg-green-50/70 border border-green-600/30 rounded-sm">
            <p className="text-xs text-green-900 leading-relaxed font-medium">
              Full-day coverage becomes LKR 207,000 on these dates.
            </p>
          </div>

          {/* Save Rule Button */}
          <button className="w-full py-3 bg-green-600 text-white font-medium hover:bg-[#14532d] transition-colors text-sm rounded-sm">
            Save rule
          </button>
        </div>

        {/* Right Column: Your rules table (7 columns) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-sm shadow-sm border border-line space-y-4">
          <h2 className="font-serif font-bold text-xl text-ink-900">Your rules</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-50/60 border-b border-line text-xs font-bold text-green-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Rule</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Applies to</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-xs">
                
                {/* Rule 1 */}
                <tr>
                  <td className="py-4 px-4 font-medium text-ink-900">
                    December wedding season
                    <span className="block text-[10px] text-ink-400 font-normal">Peak</span>
                  </td>
                  <td className="py-4 px-4 text-ink-600">1 Dec – 31 Jan</td>
                  <td className="py-4 px-4 text-ink-600">All services</td>
                  <td className="py-4 px-4 font-medium text-ink-900">+15%</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-medium">
                      Active
                    </span>
                  </td>
                </tr>

                {/* Rule 2 */}
                <tr>
                  <td className="py-4 px-4 font-medium text-ink-900">
                    Sinhala and Tamil New Year
                    <span className="block text-[10px] text-ink-400 font-normal">Peak</span>
                  </td>
                  <td className="py-4 px-4 text-ink-600">10 – 16 Apr 2027</td>
                  <td className="py-4 px-4 text-ink-600">All services</td>
                  <td className="py-4 px-4 font-medium text-ink-900">+20%</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full text-[10px] font-medium">
                      Scheduled
                    </span>
                  </td>
                </tr>

                {/* Rule 3 */}
                <tr>
                  <td className="py-4 px-4 font-medium text-ink-900">
                    Monsoon offer
                    <span className="block text-[10px] text-ink-400 font-normal">Off-peak</span>
                  </td>
                  <td className="py-4 px-4 text-ink-600">1 May – 31 Jul 2027</td>
                  <td className="py-4 px-4 text-ink-600">Pre-shoot session</td>
                  <td className="py-4 px-4 font-medium text-ink-900">-10%</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full text-[10px] font-medium">
                      Scheduled
                    </span>
                  </td>
                </tr>

                {/* Rule 4 */}
                <tr>
                  <td className="py-4 px-4 font-medium text-ink-900">
                    Poya day
                    <span className="block text-[10px] text-ink-400 font-normal">Fixed rate</span>
                  </td>
                  <td className="py-4 px-4 text-ink-600">Every Poya</td>
                  <td className="py-4 px-4 text-ink-600">Drone add-on</td>
                  <td className="py-4 px-4 font-medium text-ink-900">LKR 30,000</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                      Paused
                    </span>
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
