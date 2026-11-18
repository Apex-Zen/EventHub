import React from 'react';

export default function VendorDiary() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Diary</h1>
        <p className="text-sm font-medium text-green-600 mb-1 cursor-pointer hover:underline">
          Manage blocked dates
        </p>
        <p className="text-sm text-ink-600">
          Booked, free and blocked slots. Dates become Booked only when you accept a client request.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Calendar Component (Takes 8 columns) */}
        <div className="lg:col-span-8 bg-white rounded-sm shadow-sm border border-line p-6">
          
          {/* Calendar Month & Legend Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            
            {/* Month Navigation */}
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-sm border border-line hover:bg-page text-ink-600">
                &larr;
              </button>
              <h2 className="font-serif font-bold text-lg text-ink-900">December 2026</h2>
              <button className="p-1 rounded-sm border border-line hover:bg-page text-ink-600">
                &rarr;
              </button>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-600 inline-block"></span>
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm border border-amber-400 bg-amber-50 inline-block"></span>
                <span>Held by a request</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block"></span>
                <span>Blocked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm border border-line bg-white inline-block"></span>
                <span>Free</span>
              </div>
            </div>

          </div>

          {/* Calendar Days Header */}
          <div className="grid grid-cols-7 border-b border-line text-xs font-bold text-green-600 uppercase tracking-wider pb-2 mb-2 text-center">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Calendar Grid (Days) */}
          <div className="grid grid-cols-7 auto-rows-fr gap-px bg-line border border-line">
            
            {/* Week 1 */}
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-400"></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium">
              <span className="block mb-1">1</span>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium">
              <span className="block mb-1">2</span>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium">
              <span className="block mb-1">3</span>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium">
              <span className="block mb-1">4</span>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium">
              <span className="block mb-1">5</span>
              <div className="bg-green-600 text-white rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Day</div>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium">
              <span className="block mb-1">6</span>
            </div>

            {/* Week 2 */}
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">7</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">8</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">9</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">10</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">11</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium">
              <span className="block mb-1">12</span>
              <div className="bg-amber-100 text-amber-800 border border-amber-300 rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Night</div>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">13</span></div>

            {/* Week 3 */}
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">14</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">15</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">16</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">17</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">18</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium space-y-1">
              <span className="block mb-1">19</span>
              <div className="bg-green-600 text-white rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Day</div>
              <div className="bg-green-600 text-white rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Night</div>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">20</span></div>

            {/* Week 4 */}
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">21</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">22</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">23</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium space-y-1">
              <span className="block mb-1">24</span>
              <div className="bg-gray-200 text-ink-700 rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Day</div>
              <div className="bg-gray-200 text-ink-700 rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Night</div>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium space-y-1">
              <span className="block mb-1">25</span>
              <div className="bg-gray-200 text-ink-700 rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Day</div>
              <div className="bg-gray-200 text-ink-700 rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Night</div>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium">
              <span className="block mb-1">26</span>
              <div className="bg-green-600 text-white rounded-sm px-1.5 py-0.5 text-[10px] text-center font-medium">Night</div>
            </div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">27</span></div>

            {/* Week 5 */}
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">28</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">29</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">30</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-900 font-medium"><span className="block mb-1">31</span></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-400"></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-400"></div>
            <div className="bg-white min-h-[90px] p-2 text-xs text-ink-400"></div>

          </div>

        </div>

        {/* Right Section: Block a date & Blocked dates (Takes 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Block a date Form Card */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-line space-y-4">
            <h3 className="font-serif font-bold text-xl text-ink-900">Block a date</h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">Date</label>
              <select className="w-full p-3 border border-line rounded-sm text-sm bg-white text-ink-600 focus:outline-none focus:border-green-600">
                <option>Choose a date</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">Slot</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="py-2.5 text-xs font-medium border border-line rounded-sm text-ink-900 hover:border-green-600">Day</button>
                <button type="button" className="py-2.5 text-xs font-medium border border-line rounded-sm text-ink-900 hover:border-green-600">Night</button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">Reason</label>
              <input 
                type="text" 
                placeholder="e.g. Family function" 
                className="w-full p-3 border border-line rounded-sm text-sm text-ink-900 focus:outline-none focus:border-green-600" 
              />
            </div>

            <button className="w-full py-3 bg-green-600 text-white font-medium hover:bg-[#14532d] transition-colors text-sm rounded-sm">
              Block date
            </button>

            <p className="text-xs text-ink-400 leading-relaxed">
              Blocked slots are hidden from clients.
            </p>
          </div>

          {/* Blocked Dates List Card */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-line space-y-4">
            <h3 className="font-serif font-bold text-lg text-ink-900">Blocked dates</h3>

            <div className="divide-y divide-line">
              
              {/* Item 1 */}
              <div className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ink-900">Thu 24 Dec, day and night</p>
                  <p className="text-xs text-ink-400">Family function</p>
                </div>
                <button className="text-xs font-medium text-green-600 hover:underline">Unblock</button>
              </div>

              {/* Item 2 */}
              <div className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ink-900">Fri 25 Dec, day and night</p>
                  <p className="text-xs text-ink-400">Christmas</p>
                </div>
                <button className="text-xs font-medium text-green-600 hover:underline">Unblock</button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}