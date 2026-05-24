import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-5 h-5 bg-white rounded-sm" />
          <span className="text-white font-semibold text-sm">GitCloud</span>
        </div>

        <h1 className="text-white text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-muted text-sm mb-8">Welcome back</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-white/30 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-white/30 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-md hover:bg-white/90 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          No account?{' '}
          <Link to="/register" className="text-white hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}