import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 text-center">
      <Sprout className="h-12 w-12 text-forest/30" />
      <h1 className="mt-4 font-display text-5xl font-semibold text-forest dark:text-sage-50">404</h1>
      <p className="mt-2 text-forest/60 dark:text-sage-100/60">This field hasn't been planted yet.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
