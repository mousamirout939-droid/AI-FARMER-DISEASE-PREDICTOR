import { useQuery } from '@tanstack/react-query';
import { Users, Stethoscope, ScanLine, LifeBuoy } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
import { adminApi } from '../api/endpoints.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export default function Admin() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.stats });
  const stats = data?.data?.data;

  if (isLoading || !stats) return <p className="text-sm text-forest/50">Loading dashboard…</p>;

  const trendData = {
    labels: stats.predictionsByDay.map((d) => d._id),
    datasets: [{ label: 'Predictions', data: stats.predictionsByDay.map((d) => d.count), borderColor: '#1B4332', backgroundColor: 'rgba(27,67,50,0.15)', tension: 0.3 }],
  };

  const diseaseData = {
    labels: stats.topDiseases.map((d) => d._id),
    datasets: [{ label: 'Occurrences', data: stats.topDiseases.map((d) => d.count), backgroundColor: '#D4A017' }],
  };

  const cards = [
    { label: 'Farmers', value: stats.totalFarmers, icon: Users },
    { label: 'Experts', value: stats.totalExperts, icon: Stethoscope },
    { label: 'Predictions', value: stats.totalPredictions, icon: ScanLine },
    { label: 'Open Tickets', value: stats.openTickets, icon: LifeBuoy },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Admin Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/10 text-forest dark:bg-wheat/10 dark:text-wheat">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-semibold text-forest dark:text-sage-50">{value}</div>
              <div className="text-xs text-forest/50 dark:text-sage-100/50">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-semibold text-forest dark:text-sage-50">Predictions over time</h2>
          <Line data={trendData} />
        </div>
        <div className="card">
          <h2 className="mb-3 font-semibold text-forest dark:text-sage-50">Top predicted classes</h2>
          <Bar data={diseaseData} />
        </div>
      </div>
    </div>
  );
}
