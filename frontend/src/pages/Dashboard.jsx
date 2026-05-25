import { useEffect, useState } from 'react';
import { getStats } from '../services/photoService';
import { useAuth } from '../context/AuthContext';
import { Images, HardDrive, GitBranch, FolderOpen } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const cards = stats ? [
    { label: 'Total Photos', value: stats.totalPhotos, icon: Images },
    { label: 'Total Albums', value: stats.totalAlbums, icon: FolderOpen },
    { label: 'Storage Used', value: `${(stats.totalSize / (1024 * 1024)).toFixed(2)} MB`, icon: HardDrive },
    { label: 'Repositories', value: stats.totalRepos, icon: GitBranch },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">
          Welcome back, {user?.username}
        </h1>
        <p className="text-muted text-sm mt-1">Your GitCloud storage overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-surface border border-border rounded-lg p-4 hover:border-accent/30 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} strokeWidth={1.5} className="text-muted" />
              <p className="text-muted text-xs">{label}</p>
            </div>
            <p className="text-white text-xl font-semibold">{value ?? '—'}</p>
          </div>
        ))}
      </div>

      {stats && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className="text-muted text-xs mb-4 uppercase tracking-wider">Active Repository</p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white text-sm font-medium">{stats.activeRepo}</p>
            <p className="text-muted text-xs">{stats.activeRepoSize?.toFixed(2)} MB / 800 MB</p>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${Math.min((stats.activeRepoSize / 800) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}