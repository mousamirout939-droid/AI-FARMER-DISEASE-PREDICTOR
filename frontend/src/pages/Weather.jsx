import { useQuery } from '@tanstack/react-query';
import { CloudSun, Droplets, Wind, Sun } from 'lucide-react';
import { weatherApi } from '../api/endpoints.js';
import Badge from '../components/ui/Badge.jsx';

export default function Weather() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather'],
    queryFn: () => weatherApi.get({ location: 'Bengaluru' }),
  });
  const weather = data?.data?.data;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Weather & Disease Risk</h1>
      <p className="mt-1 text-sm text-forest/60 dark:text-sage-100/60">
        Live conditions and AI-estimated disease-risk for your location.
      </p>

      {isLoading && <p className="mt-6 text-sm text-forest/50">Loading weather…</p>}
      {error && <p className="mt-6 text-sm text-clay">Could not load weather. Is the backend running?</p>}

      {weather && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card flex items-center gap-4">
            <CloudSun className="h-8 w-8 text-forest dark:text-wheat" />
            <div>
              <div className="text-2xl font-semibold text-forest dark:text-sage-50">{weather.temperature}°C</div>
              <div className="text-xs text-forest/50 dark:text-sage-100/50">{weather.condition}</div>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <Droplets className="h-8 w-8 text-forest dark:text-wheat" />
            <div>
              <div className="text-2xl font-semibold text-forest dark:text-sage-50">{weather.humidity}%</div>
              <div className="text-xs text-forest/50 dark:text-sage-100/50">Humidity</div>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <Wind className="h-8 w-8 text-forest dark:text-wheat" />
            <div>
              <div className="text-2xl font-semibold text-forest dark:text-sage-50">{weather.windSpeed} km/h</div>
              <div className="text-xs text-forest/50 dark:text-sage-100/50">Wind speed</div>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <Sun className="h-8 w-8 text-forest dark:text-wheat" />
            <div>
              <div className="text-2xl font-semibold text-forest dark:text-sage-50">{weather.rainProbability}%</div>
              <div className="text-xs text-forest/50 dark:text-sage-100/50">Rain probability</div>
            </div>
          </div>

          <div className="card sm:col-span-2 lg:col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-forest dark:text-sage-50">Disease risk</h2>
              <Badge tone={weather.diseaseRisk?.level}>{weather.diseaseRisk?.level?.toUpperCase()}</Badge>
            </div>
            <p className="mt-2 text-sm text-forest/65 dark:text-sage-100/65">{weather.diseaseRisk?.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}
