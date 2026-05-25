import { useEffect, useState } from 'react';
import { getStats } from '../services/photoService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const items = stats ? [
    { label: 'Photos', value: stats.totalPhotos },
    { label: 'Albums', value: stats.totalAlbums },
    { label: 'Storage', value: `${(stats.totalSize / (1024 * 1024)).toFixed(1)} MB` },
    { label: 'Repositories', value: stats.totalRepos },
  ] : [];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-primary text-2xl font-semibold">
          Good morning, {user?.username}
        </h1>
        <p className="text-muted text-sm mt-1">Here's your storage overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ label, value }) => (
          <div key={label} className="bg-surface border border-border rounded-[6px] p-4 hover:border-border-hover transition duration-150">
            <p className="text-muted text-xs uppercase tracking-wide font-medium mb-2">{label}</p>
            <p className="text-primary text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Active Repo */}
      {stats && (
        <div className="bg-surface border border-border rounded-[6px] p-4 mt-6">
          <p className="text-muted text-xs uppercase tracking-wide font-medium mb-3">Active Repository</p>
          <div className="flex items-center justify-between">
            <p className="text-primary text-sm font-semibold">{stats.activeRepo}</p>
            <p className="text-muted text-xs">{stats.activeRepoSize?.toFixed(2)} MB used</p>
          </div>
          <div className="mt-3 h-2 bg-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stats.activeRepoSize / 800) * 100, 100)}%` }}
            />
          </div>
          <p className="text-muted text-xs mt-2">800 MB limit</p>
        </div>
      )}
    </div>
  );
}