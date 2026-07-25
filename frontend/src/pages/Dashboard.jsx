import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ScanLine, History, TrendingUp, Leaf } from 'lucide-react';
import { predictionApi } from '../api/endpoints.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['predictions', 'recent'],
    queryFn: () => predictionApi.history({ limit: 5 }),
  });

  const predictions = data?.data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Welcome, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-forest/60 dark:text-sage-100/60">Here's what's happening on your farm.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link to="/predict" className="card flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/10 text-forest dark:bg-wheat/10 dark:text-wheat">
            <ScanLine className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold text-forest dark:text-sage-50">New diagnosis</div>
            <div className="text-xs text-forest/60 dark:text-sage-100/60">Upload a leaf photo</div>
          </div>
        </Link>
        <Link to="/history" className="card flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/10 text-forest dark:bg-wheat/10 dark:text-wheat">
            <History className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold text-forest dark:text-sage-50">{predictions.length} recent scans</div>
            <div className="text-xs text-forest/60 dark:text-sage-100/60">View full history</div>
          </div>
        </Link>
        <Link to="/market" className="card flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/10 text-forest dark:bg-wheat/10 dark:text-wheat">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold text-forest dark:text-sage-50">Market prices</div>
            <div className="text-xs text-forest/60 dark:text-sage-100/60">Check today's mandi rates</div>
          </div>
        </Link>
      </div>

      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-forest dark:text-sage-50">Recent scans</h2>
        {isLoading && <p className="mt-3 text-sm text-forest/50">Loading…</p>}
        {!isLoading && predictions.length === 0 && (
          <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
            <Leaf className="h-8 w-8 text-forest/30" />
            <p className="text-sm text-forest/50 dark:text-sage-100/50">No scans yet. Run your first diagnosis to see it here.</p>
            <Link to="/predict" className="btn-primary mt-2 text-sm">Detect a disease</Link>
          </div>
        )}
        <div className="mt-4 divide-y divide-sage-200 dark:divide-white/10">
          {predictions.map((p) => (
            <div key={p._id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img src={p.imageUrl} alt={p.predictedClass} className="h-10 w-10 rounded-lg object-cover" />
                <div>
                  <div className="text-sm font-medium text-forest dark:text-sage-50">{p.disease?.name || p.predictedClass}</div>
                  <div className="text-xs text-forest/50 dark:text-sage-100/50">{p.crop} · {new Date(p.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <span className="font-mono text-xs text-forest/60 dark:text-sage-100/60">{(p.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
