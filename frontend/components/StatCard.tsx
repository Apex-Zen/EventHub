// components/StatCard.tsx
interface StatCardProps {
  title: string;
  amount: string;
  subtitle: string;
}

export default function StatCard({ title, amount, subtitle }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{amount}</h2>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}