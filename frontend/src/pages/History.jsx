import { useQuery } from '@tanstack/react-query';
import { predictionApi } from '../api/endpoints.js';
import Badge from '../components/ui/Badge.jsx';

export default function History() {
  const { data, isLoading } = useQuery({
    queryKey: ['predictions', 'all'],
    queryFn: () => predictionApi.history({ limit: 50 }),
  });
  const predictions = data?.data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">History & Reports</h1>
      {isLoading && <p className="mt-4 text-sm text-forest/50">Loading…</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {predictions.map((p) => (
          <div key={p._id} className="card">
            <img src={p.imageUrl} alt={p.predictedClass} className="h-36 w-full rounded-xl object-cover" />
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-forest dark:text-sage-50">{p.disease?.name || p.predictedClass}</span>
              <Badge tone={p.disease?.isHealthy ? 'low' : 'high'}>{p.disease?.isHealthy ? 'Healthy' : 'Diseased'}</Badge>
            </div>
            <p className="text-xs text-forest/50 dark:text-sage-100/50">{p.crop} · {new Date(p.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {!isLoading && predictions.length === 0 && (
        <p className="mt-6 text-sm text-forest/50 dark:text-sage-100/50">No predictions yet.</p>
      )}
    </div>
  );
}
