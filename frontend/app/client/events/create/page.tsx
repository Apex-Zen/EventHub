'use client';

import Link from 'next/link';
import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ProgressSteps from '@/components/ui/ProgressSteps';

export default function CreatePrivateEvent() {
  const [eventType, setEventType] = useState('Wedding');
  const [selectedDate, setSelectedDate] = useState<number | null>(12);
  const [timeSlot, setTimeSlot] = useState('Night'); // Default to Night
  
  // December 2026 Calendar
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 2; // Dec 1, 2026 is Tuesday

  // Time slot data
  const timeOptions = [
    { id: 'Day', label: 'Day', time: '8.00 AM - 4.00 PM' },
    { id: 'Night', label: 'Night', time: '7.00 PM - 12.00 AM' },
    { id: 'Both', label: 'Both', time: '8.00 AM - 12.00 AM' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/client/dashboard" className="text-sm text-gray-500 hover:text-[#266665] flex items-center gap-1">
          <span>&larr;</span> Back to Home
        </Link>
      </div>

      {/* Header and Progress Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4 md:mb-0">Plan a private event</h1>
        <ProgressSteps currentStep={1} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-serif text-gray-800 mb-6">Event details</h2>

          <form className="space-y-8">
            
            {/* Event Type - Fixed text color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event type</label>
              <select 
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#266665] bg-white text-gray-900 font-medium"
              >
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Corporate">Corporate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Target Date (Calendar) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target date</label>
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <button type="button" className="text-gray-400 hover:text-gray-600">&lt;</button>
                    <span className="font-medium text-gray-900">December 2026</span>
                    <button type="button" className="text-gray-400 hover:text-gray-600">&gt;</button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500">
                    <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {Array.from({ length: startDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2"></div>
                    ))}
                    {daysInMonth.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        className={`p-2 rounded-full w-8 h-8 mx-auto flex items-center justify-center transition
                          ${selectedDate === day ? 'bg-[#266665] text-white font-bold' : 'text-gray-900 hover:bg-gray-100'}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slot and Location */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time slot</label>
                  <div className="flex bg-gray-100 p-1 rounded-md mb-2">
                    {timeOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setTimeSlot(option.id)}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                          timeSlot === option.id 
                            ? 'text-white bg-[#266665] shadow-sm' 
                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {/* Time period display */}
                  <p className="text-xs text-[#266665] font-medium text-right mt-1">
                    {timeOptions.find((opt) => opt.id === timeSlot)?.time}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location / district</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#266665] bg-white text-gray-900 font-medium">
                    <option>Colombo</option>
                    <option>Gampaha</option>
                    <option>Kandy</option>
                    <option>Galle</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Only vendors who serve this district are shown.</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Expected Attendance */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Expected attendance</label>
                <span className="text-sm font-bold text-[#266665]">250 guests</span>
              </div>
              <input type="range" min="20" max="1000" defaultValue="250" className="w-full accent-[#266665]" />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>20</span>
                <span>1,000</span>
              </div>
            </div>

            {/* Total Budget */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Total budget</label>
                <span className="text-sm font-bold text-[#266665]">LKR 1,500,000</span>
              </div>
              <input type="range" min="100000" max="5000000" step="50000" defaultValue="1500000" className="w-full accent-[#266665]" />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>LKR 100,000</span>
                <span>LKR 5,000,000</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#DAEDED] p-4 rounded-md flex items-start gap-3">
              <span className="text-[#266665] text-lg mt-0.5">ℹ️</span>
              <p className="text-sm text-[#266665]">Matching uses district, budget and the vendor diary. Booked or blocked dates are hidden.</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <PrimaryButton type="button">Find vendors</PrimaryButton>
            </div>
          </form>
        </div>

        {/* Right Column: How matching works */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <img 
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
              alt="Beach wedding" 
              className="w-full h-40 object-cover rounded-md mb-6" 
            />
            <h3 className="text-xl font-serif text-gray-800 mb-4">How matching works</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-[#266665] font-bold">✓</span>
                We only show vendors whose diary is free on your date and time slot.
              </li>
              <li className="flex gap-2">
                <span className="text-[#266665] font-bold">✓</span>
                Prices are checked against your total budget.
              </li>
              <li className="flex gap-2">
                <span className="text-[#266665] font-bold">✓</span>
                You send one package. Each vendor has 48 hours to accept or reject.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}