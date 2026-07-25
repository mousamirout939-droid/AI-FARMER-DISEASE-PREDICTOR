import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-sage-200/70 bg-white/60 py-10 dark:border-white/10 dark:bg-transparent">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-field-gradient text-sage-50">
              <Sprout className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-semibold text-forest dark:text-sage-50">AI Farmer</span>
          </div>
          <p className="text-sm text-forest/60 dark:text-sage-100/60">AI Powered Smart Farming Assistant.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-forest dark:text-sage-50">Product</h4>
          <ul className="space-y-2 text-sm text-forest/60 dark:text-sage-100/60">
            <li><Link to="/features" className="hover:text-forest dark:hover:text-sage-50">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-forest dark:hover:text-sage-50">Pricing</Link></li>
            <li><Link to="/predict" className="hover:text-forest dark:hover:text-sage-50">Detect Disease</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-forest dark:text-sage-50">Company</h4>
          <ul className="space-y-2 text-sm text-forest/60 dark:text-sage-100/60">
            <li><Link to="/about" className="hover:text-forest dark:hover:text-sage-50">About</Link></li>
            <li><Link to="/contact" className="hover:text-forest dark:hover:text-sage-50">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-forest dark:text-sage-50">Legal</h4>
          <ul className="space-y-2 text-sm text-forest/60 dark:text-sage-100/60">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-forest/40 dark:text-sage-100/40">
        © {new Date().getFullYear()} AI Farmer Disease Predictor. Built for demonstration purposes.
      </p>
    </footer>
  );
}
