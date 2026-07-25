import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANS = [
  { name: 'Free', price: '₹0', features: ['10 diagnoses / month', 'Community access', 'Weather & market data'] },
  { name: 'Pro', price: '₹299/mo', features: ['Unlimited diagnoses', 'Expert chat priority', 'PDF report exports', 'Spray & harvest reminders'], highlight: true },
  { name: 'Cooperative', price: 'Custom', features: ['Multi-farmer accounts', 'Bulk analytics dashboard', 'Dedicated onboarding'] },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <span className="eyebrow">Pricing</span>
      <h1 className="mt-3 text-3xl font-semibold text-forest dark:text-sage-50 sm:text-4xl">Simple, farmer-friendly plans</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`card ${plan.highlight ? 'ring-2 ring-forest dark:ring-wheat' : ''}`}>
            <h3 className="font-semibold text-forest dark:text-sage-50">{plan.name}</h3>
            <div className="mt-2 text-3xl font-semibold text-forest dark:text-sage-50">{plan.price}</div>
            <ul className="mt-4 space-y-2 text-sm text-forest/70 dark:text-sage-100/70">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-forest dark:text-wheat" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-primary mt-6 w-full text-sm">Get started</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
