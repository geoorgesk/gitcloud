import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-5 h-5 bg-white rounded-sm" />
          <span className="text-white font-semibold text-sm">GitCloud</span>
        </div>

        <h1 className="text-white text-xl font-semibold mb-1">Create account</h1>
        <p className="text-muted text-sm mb-8">Get started for free</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'username', label: 'Username', type: 'text', placeholder: 'yourname' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-muted block mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-white/30 transition-colors"
                placeholder={placeholder}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-md hover:bg-white/90 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          Have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}