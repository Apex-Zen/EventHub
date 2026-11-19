import {
  WelcomeHero,
  PlanningSection,
  YourEventsSection,
} from '@/components/dashboard';

export default function ClientDashboard() {
  return (
    <div className="space-y-10">
      {/* Hero Banner (edge-to-edge full width) */}
      <WelcomeHero />

      {/* Main Content Area */}
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">
        {/* Planning Options */}
        <PlanningSection />

        {/* Your Events Section */}
        <YourEventsSection />
      </div>
    </div>
  );
}
