// app/page.tsx
import StatCard from '../components/StatCard';
import PackageRequestCard from '../components/PackageRequestCard';
import ProfileSummaryCard from '../components/ProfileSummaryCard';
import ServicesAndReviews from '../components/ServicesAndReviews';

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-1">Good evening, Kasun</h1>
      <p className="text-gray-500 mb-8">Monday 19 October 2026</p>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard title="Paid this month" amount="LKR 63,000" subtitle="2 payouts" />
        <StatCard title="Pending payouts" amount="LKR 59,400" subtitle="Sent within 3 working days" />
        <StatCard title="Held in escrow" amount="LKR 129,600" subtitle="Released at arrival and completion" />
        <StatCard title="Requests waiting" amount="1" subtitle="Answer within 48 hours" />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <PackageRequestCard />
        </div>
        <div className="col-span-1">
          <ProfileSummaryCard />
        </div>
      </div>

      {/* Bottom Section */}
      <ServicesAndReviews />
    </div>
  )
}