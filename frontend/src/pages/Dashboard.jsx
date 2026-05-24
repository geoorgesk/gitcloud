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
    <div>
      <div className="mb-10">
        <h1 className="text-white text-2xl font-semibold">
          Good morning, {user?.username}
        </h1>
        <p className="text-muted text-sm mt-1">Here's your storage overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {items.map(({ label, value }) => (
          <div key={label} className="bg-surface border border-border rounded-lg p-4">
            <p className="text-muted text-xs mb-1">{label}</p>
            <p className="text-white text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Active Repo */}
      {stats && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className="text-muted text-xs mb-3 uppercase tracking-wider">Active Repository</p>
          <div className="flex items-center justify-between">
            <p className="text-white text-sm font-medium">{stats.activeRepo}</p>
            <p className="text-muted text-xs">{stats.activeRepoSize?.toFixed(2)} MB used</p>
          </div>
          <div className="mt-3 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min((stats.activeRepoSize / 800) * 100, 100)}%` }}
            />
          </div>
          <p className="text-muted text-xs mt-2">800 MB limit</p>
        </div>
      )}
    </div>
  );
}