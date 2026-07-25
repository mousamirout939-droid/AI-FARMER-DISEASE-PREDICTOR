const COLORS = {
  low: 'bg-forest/10 text-forest',
  moderate: 'bg-wheat/20 text-wheat-dark',
  high: 'bg-clay/10 text-clay',
  neutral: 'bg-sage-100 text-forest/70',
};

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${COLORS[tone]}`}>
      {children}
    </span>
  );
}
