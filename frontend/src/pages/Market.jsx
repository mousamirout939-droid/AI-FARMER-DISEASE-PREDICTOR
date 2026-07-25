import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../api/endpoints.js';

export default function Market() {
  const [tab, setTab] = useState('prices');
  const { data: pricesData } = useQuery({ queryKey: ['market-prices'], queryFn: () => marketApi.prices() });
  const { data: schemesData } = useQuery({ queryKey: ['schemes'], queryFn: () => marketApi.schemes() });

  const prices = pricesData?.data?.data || [];
  const schemes = schemesData?.data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Market & Schemes</h1>

      <div className="mt-4 flex gap-2">
        <button onClick={() => setTab('prices')} className={tab === 'prices' ? 'btn-primary text-sm !px-4 !py-2' : 'btn-ghost text-sm'}>Market Prices</button>
        <button onClick={() => setTab('schemes')} className={tab === 'schemes' ? 'btn-primary text-sm !px-4 !py-2' : 'btn-ghost text-sm'}>Government Schemes</button>
      </div>

      {tab === 'prices' && (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-200 text-left text-forest/50 dark:border-white/10 dark:text-sage-100/50">
                <th className="pb-2">Crop</th>
                <th className="pb-2">Mandi</th>
                <th className="pb-2">State</th>
                <th className="pb-2">Modal Price</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={`${p.crop}-${p.mandi}`} className="border-b border-sage-100 last:border-0 dark:border-white/5">
                  <td className="py-2 font-medium text-forest dark:text-sage-50">{p.crop}</td>
                  <td className="py-2 text-forest/70 dark:text-sage-100/70">{p.mandi}</td>
                  <td className="py-2 text-forest/70 dark:text-sage-100/70">{p.state}</td>
                  <td className="py-2 font-mono text-forest dark:text-sage-50">₹{p.modalPrice} / {p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'schemes' && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((s) => (
            <div key={s.name} className="card">
              <h3 className="font-semibold text-forest dark:text-sage-50">{s.name}</h3>
              <p className="mt-2 text-sm text-forest/65 dark:text-sage-100/65">{s.description}</p>
              <p className="mt-2 text-xs text-forest/50 dark:text-sage-100/50">Eligibility: {s.eligibility}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
