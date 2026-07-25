import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Settings() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Settings</h1>

      <div className="card mt-6">
        <h2 className="font-semibold text-forest dark:text-sage-50">Profile</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label className="label">Name</label>
            <input className="input" defaultValue={user?.name} readOnly />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" defaultValue={user?.email} readOnly />
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="font-semibold text-forest dark:text-sage-50">Appearance</h2>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-forest/70 dark:text-sage-100/70">Dark mode</span>
          <button onClick={toggle} className="btn-secondary text-sm">
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </button>
        </div>
      </div>
    </div>
  );
}
