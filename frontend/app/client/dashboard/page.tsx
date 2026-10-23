import Link from 'next/link';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function ClientDashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Hero Banner Section */}
      <div className="relative h-64 bg-gray-900 rounded-xl overflow-hidden mb-8 shadow-sm">
        <div className="absolute inset-0 bg-cover bg-center opacity-50 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')]"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
          <h1 className="text-5xl font-bold mb-3 tracking-tight drop-shadow-md">Welcome back, Nadeesha</h1>
          <p className="text-lg text-gray-100 drop-shadow">Plan a wedding, a birthday or a ticketed public event.</p>
        </div>
      </div>

      {/* Planning Options */}
      <div className="mb-12">
        <h2 className="text-[32px] font-bold text-[#266665] mb-6 leading-tight">What are you planning?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Private Event Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-200">
              <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" alt="Private Event" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col items-start">
              <span className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">Private Event</span>
              <h3 className="text-2xl font-serif text-[#266665] mb-2">Plan a private event</h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">
                Wedding, birthday, office party. Pick vendors that are free on your date and send them one package.
              </p>
              <Link href="/client/events/create">
                <PrimaryButton>Plan a private event</PrimaryButton>
              </Link>
            </div>
          </div>

          {/* Public Event Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-200">
              <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop" alt="Public Event" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col items-start">
              <span className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">Public Event</span>
              <h3 className="text-2xl font-serif text-[#266665] mb-2">Plan a public event</h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">
                Concert, fair, workshop. Set ticket tiers and prices. Every buyer gets a QR pass.
              </p>
              <Link href="/client/events/public/create">
                <PrimaryButton>Plan a public event</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Your Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your events</h2>
          <Link href="#" className="text-sm font-medium text-[#266665] hover:underline">See all</Link>
        </div>

        <div className="space-y-4">
          
          {/* Event Item 1 */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" alt="Wedding" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Perera-Silva wedding</h4>
                <p className="text-xs text-gray-500 mt-1">Sat 12 Dec 2026 · Night · Colombo · 4 vendors</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-[#DAEDED] text-[#266665] text-xs font-medium rounded-full">2 of 4 accepted</span>
              <Link href="#" className="text-sm font-medium text-gray-600 hover:text-[#266665]">Open</Link>
            </div>
          </div>

          {/* Event Item 2 */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" alt="Office Party" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Office year-end party</h4>
                <p className="text-xs text-gray-500 mt-1">Fri 18 Dec 2026 · Day · Gampaha</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Draft</span>
              <Link href="#" className="text-sm font-medium text-gray-600 hover:text-[#266665]">Open</Link>
            </div>
          </div>

          {/* Event Item 3 */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop" alt="Jazz Night" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Galle Face Jazz Night</h4>
                <p className="text-xs text-gray-500 mt-1">Sat 14 Nov 2026 · Public · 312 of 500 sold</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-[#DAEDED] text-[#266665] text-xs font-medium rounded-full">On sale</span>
              <Link href="#" className="text-sm font-medium text-gray-600 hover:text-[#266665]">Open</Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}