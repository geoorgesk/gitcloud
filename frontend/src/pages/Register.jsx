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

  const fields = [
    { key: 'username', label: 'Username', type: 'text' },
    { key: 'email', label: 'Email address', type: 'email' },
    { key: 'password', label: 'Password', type: 'password' },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-xs">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#e6edf3" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        </div>

        <h1 className="text-primary text-2xl font-light text-center mb-4">Create your account</h1>

        {/* Form card */}
        <div className="bg-surface border border-border rounded-md p-4 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-primary text-sm mb-2">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-bg border border-border rounded-md px-3 py-1.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-btn-primary text-white text-sm font-medium rounded-md py-1.5 px-4 hover:bg-btn-primary-hover disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Link card */}
        <div className="bg-surface border border-border rounded-md p-4 text-center text-sm">
          <span className="text-primary">Already have an account?</span>{' '}
          <Link to="/login" className="text-accent hover:underline">Sign in</Link>.
        </div>
      </div>
    </div>
  );
}