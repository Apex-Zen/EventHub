// app/page.tsx
import StatCard from '../components/StatCard';
import PackageRequestCard from '../components/PackageRequestCard';
import ProfileSummaryCard from '../components/ProfileSummaryCard';
import ServicesAndReviews from '../components/ServicesAndReviews';

export default function Home() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-7">
      <div className="mb-8">
        <h1 className="mb-2 font-[family-name:var(--font-serif)] text-[54px] leading-[1.02] tracking-[-0.055em] text-[#1d2a2b] font-bold">
          Good evening, <span className="font-[family-name:var(--font-serif)] font-extrabold">Kasun</span>
        </h1>
        <p className="text-[17px] text-[#697c7a]">Monday 19 October 2026</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Paid this month" amount="LKR 63,000" subtitle="2 payouts" />
        <StatCard title="Pending payouts" amount="LKR 59,400" subtitle="Sent within 3 working days" />
        <StatCard title="Held in escrow" amount="LKR 129,600" subtitle="Released at arrival and completion" />
        <StatCard title="Requests waiting" amount="1" subtitle="Answer within 48 hours" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.72fr_0.92fr]">
        <div>
          <PackageRequestCard />
        </div>
        <div>
          <ProfileSummaryCard />
        </div>
      </div>

      <ServicesAndReviews />
    </div>
  );
}