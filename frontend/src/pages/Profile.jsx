import { useAuth } from '../hooks/useAuth.js';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Profile</h1>
      <div className="card mt-6 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wheat/30 text-2xl font-semibold text-forest">
          {user?.name?.[0]?.toUpperCase()}
        </span>
        <div>
          <div className="text-lg font-semibold text-forest dark:text-sage-50">{user?.name}</div>
          <div className="text-sm text-forest/60 dark:text-sage-100/60">{user?.email}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-wheat-dark">{user?.role}</div>
        </div>
      </div>
      {user?.farmDetails && (
        <div className="card mt-4">
          <h2 className="font-semibold text-forest dark:text-sage-50">Farm details</h2>
          <p className="mt-2 text-sm text-forest/70 dark:text-sage-100/70">Farm size: {user.farmDetails.farmSize} acres</p>
          <p className="text-sm text-forest/70 dark:text-sage-100/70">Primary crops: {user.farmDetails.primaryCrops?.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
