import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setHasToken(res.data.hasGithubToken);
    });
  }, []);

  const handleSave = async () => {
    if (!token.trim()) {
      toast.error('Please enter your GitHub token');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/auth/github-token', { githubToken: token });
      setHasToken(true);
      setToken('');
      toast.success('GitHub token saved!');
    } catch {
      toast.error('Failed to save token');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-primary text-2xl font-semibold">Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your GitCloud configuration</p>
      </div>

      {/* Account Info */}
      <div className="bg-surface border border-border rounded-md p-5 mb-4">
        <p className="text-muted text-xs uppercase tracking-wider mb-4 font-medium">Account</p>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted text-sm">Username</span>
            <span className="text-primary text-sm font-medium">{user?.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted text-sm">Email</span>
            <span className="text-primary text-sm font-medium">{user?.email || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted text-sm">Login method</span>
            <span className="text-primary text-sm font-medium capitalize">{user?.authType || 'local'}</span>
          </div>
        </div>
      </div>

      {/* GitHub Token */}
      <div className="bg-surface border border-border rounded-md p-5">
        <p className="text-muted text-xs uppercase tracking-wider mb-1 font-medium">GitHub Token</p>
        <p className="text-muted text-xs mb-4">
          Required for photo storage. Generate a classic token with <span className="text-accent">repo</span> scope at{' '}
          {/* FIXED: Missing '<a' tag added here */}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            github.com/settings/tokens
          </a>
        </p>

        {hasToken && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-success/10 border border-success/20 rounded-md">
            <div className="w-2 h-2 bg-success rounded-full" />
            <p className="text-success text-xs font-medium">GitHub token is configured</p>
          </div>
        )}

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={hasToken ? 'Enter new token to replace...' : 'ghp_xxxxxxxxxxxx'}
              className="w-full bg-bg border border-border rounded-md px-3 py-2 pr-10 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
            <button
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
            >
              {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-btn-primary hover:bg-btn-primary-hover text-white text-sm font-medium px-4 py-2 rounded-md transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}