import {
  WelcomeHero,
  PlanningSection,
  YourEventsSection,
} from '@/components/dashboard';

export default function ClientDashboard() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">
      {/* Hero Banner */}
      <WelcomeHero />

      {/* Planning Options */}
      <PlanningSection />

      {/* Your Events Section */}
      <YourEventsSection />
    </div>
  );
}
