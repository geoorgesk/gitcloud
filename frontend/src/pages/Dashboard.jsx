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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-primary text-2xl font-semibold">
          Welcome back, {user?.username}
        </h1>
        <p className="text-muted text-sm mt-1">Here's your storage overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {items.map(({ label, value }) => (
          <div
            key={label}
            className="bg-surface border border-border rounded-md p-5 hover:border-border-hover transition-colors duration-150"
          >
            <p className="text-muted text-xs uppercase tracking-wider font-medium mb-2">{label}</p>
            <p className="text-primary text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Active Repo */}
      {stats && (
        <div className="bg-surface border border-border rounded-md p-5">
          <p className="text-muted text-xs uppercase tracking-wider font-medium mb-4">Active Repository</p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-primary text-sm font-semibold">{stats.activeRepo}</p>
            <p className="text-muted text-xs">{stats.activeRepoSize?.toFixed(2)} MB used</p>
          </div>
          <div className="h-2 bg-border/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-500"
              style={{ width: `${Math.min((stats.activeRepoSize / 800) * 100, 100)}%` }}
            />
          </div>
          <p className="text-muted text-xs mt-2">800 MB limit per repository</p>
        </div>
      )}
    </div>
  );
}