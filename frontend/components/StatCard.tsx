// components/StatCard.tsx
interface StatCardProps {
  title: string;
  amount: string;
  subtitle: string;
}

export default function StatCard({ title, amount, subtitle }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{amount}</h2>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}