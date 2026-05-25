import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ExternalLink, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TokenOnboardingModal({ onClose }) {
  const [token, setToken] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!token.trim()) {
      toast.error('Please enter your GitHub token');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/auth/github-token', { githubToken: token });
      toast.success('GitHub token saved successfully!');
      onClose(); // Close the modal
    } catch {
      toast.error('Failed to save token');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    // Optionally save that they skipped it in localStorage so we don't bother them constantly
    localStorage.setItem('hasSkippedTokenOnboarding', 'true');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in"
      style={{ background: 'rgba(1,4,9,0.85)' }}
    >
      <div className="bg-surface border border-border rounded-lg shadow-2xl max-w-lg w-full overflow-hidden animate-modal-in relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted hover:text-primary transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6 border-b border-border">
          <h2 className="text-primary text-xl font-semibold mb-2">Welcome to GitCloud! 🎉</h2>
          <p className="text-muted text-sm leading-relaxed">
            Because GitCloud uses your personal GitHub account as a free, unlimited cloud storage drive, 
            you need to connect your GitHub account using a Personal Access Token.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-primary text-sm font-semibold">How to get your token:</h3>
            <ol className="text-muted text-sm space-y-2 list-decimal list-inside">
              <li>
                Click here to go to{' '}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline inline-flex items-center gap-1"
                >
                  GitHub Token Settings <ExternalLink size={12} />
                </a>
              </li>
              <li>Set a name (e.g., "GitCloud Storage").</li>
              <li>Set expiration to <strong>No expiration</strong> (optional).</li>
              <li>Check the box next to <strong><span className="text-accent">repo</span></strong> (this is required to upload images).</li>
              <li>Scroll down, click Generate, and paste it below!</li>
            </ol>
          </div>

          <div>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-bg border border-border rounded-md px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
        </div>

        <div className="p-4 bg-surface-hover border-t border-border flex items-center justify-end gap-3">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            I'll do it later
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-btn-primary hover:bg-btn-primary-hover text-white text-sm font-medium px-5 py-2 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Token'}
          </button>
        </div>
      </div>
    </div>
  );
}
