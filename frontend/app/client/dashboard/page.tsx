import Link from 'next/link';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function ClientDashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Hero Banner Section */}
      <div className="relative h-72 bg-gray-900 rounded-xl overflow-hidden mb-10 shadow-sm">
        <div className="absolute inset-0 bg-cover bg-center opacity-60 bg-[url('/images/hero-bg.jpg')]"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
          <h1 className="text-5xl font-bold mb-4 tracking-tight drop-shadow-md">Welcome back, Nadeesha</h1>
          <p className="text-lg text-gray-100 drop-shadow">Plan a wedding, a birthday or a ticketed public event.</p>
        </div>
      </div>

      {/* Planning Options */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">What are you planning?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Private Event Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="h-56 bg-gray-200">
              <img src="/images/private-event.jpg" alt="Private Event" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col items-start">
              <span className="text-xs font-bold text-gray-500 tracking-wider mb-3 uppercase">Private Event</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Plan a private event</h3>
              <p className="text-gray-600 text-base mb-8 flex-1">
                Wedding, birthday, office party. Pick vendors that are free on your date and send them one package.
              </p>
              <Link href="/client/events/create">
                <PrimaryButton>Plan a private event</PrimaryButton>
              </Link>
            </div>
          </div>

          {/* Public Event Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="h-56 bg-gray-200">
              <img src="/images/public-event.jpg" alt="Public Event" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col items-start">
              <span className="text-xs font-bold text-gray-500 tracking-wider mb-3 uppercase">Public Event</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Plan a public event</h3>
              <p className="text-gray-600 text-base mb-8 flex-1">
                Concert, fair, workshop. Set ticket tiers and prices. Every buyer gets a QR pass.
              </p>
              <Link href="#">
                <PrimaryButton>Plan a public event</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Your Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your events</h2>
          <Link href="#" className="text-sm font-medium text-[#266665] hover:underline">See all</Link>
        </div>

        <div className="space-y-6">
          
          {/* Event Item 1 */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-6">
              <div className="w-24 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                <img src="/images/event-1.jpg" alt="Wedding" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900">Perera-Silva wedding</h4>
                <p className="text-sm text-gray-500 mt-1">Sat 12 Dec 2026 · Night · Colombo · 4 vendors</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="px-4 py-1.5 bg-[#DAEDED] text-[#266665] text-sm font-medium rounded-full">2 of 4 accepted</span>
              <Link href="#" className="text-sm font-medium text-[#266665] hover:underline">Open</Link>
            </div>
          </div>

          {/* Event Item 2 */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-6">
              <div className="w-24 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                <img src="/images/event-2.jpg" alt="Office Party" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900">Office year-end party</h4>
                <p className="text-sm text-gray-500 mt-1">Fri 18 Dec 2026 · Day · Gampaha</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">Draft</span>
              <Link href="#" className="text-sm font-medium text-[#266665] hover:underline">Open</Link>
            </div>
          </div>

          {/* Event Item 3 */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-6">
              <div className="w-24 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                <img src="/images/event-3.jpg" alt="Jazz Night" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900">Galle Face Jazz Night</h4>
                <p className="text-sm text-gray-500 mt-1">Sat 14 Nov 2026 · Public · 312 of 500 sold</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="px-4 py-1.5 bg-[#DAEDED] text-[#266665] text-sm font-medium rounded-full">On sale</span>
              <Link href="#" className="text-sm font-medium text-[#266665] hover:underline">Open</Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}