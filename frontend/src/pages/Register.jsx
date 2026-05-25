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
    <div className="min-h-screen bg-bg flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-[308px] px-4">
        {/* Cloud Logo */}
        <div className="flex justify-center mb-6">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        </div>

        {/* Heading – outside the card */}
        <h1 className="text-primary text-2xl text-center font-light mb-4">
          Create your account
        </h1>

        {/* Card with form */}
        <div className="bg-surface border border-border rounded-[6px] p-4 mb-4">
          <form onSubmit={handleSubmit}>
            {[
              { key: 'username', label: 'Username', type: 'text' },
              { key: 'email', label: 'Email address', type: 'email' },
              { key: 'password', label: 'Password', type: 'password' },
            ].map(({ key, label, type }) => (
              <div key={key} className="mb-4 last:mb-4">
                <label className="text-primary text-sm font-medium block mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-bg border border-border rounded-[6px] px-3 py-[5px] h-[32px] text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-150 ease-in-out"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-btn-primary text-white text-sm font-medium rounded-[6px] py-[5px] px-4 hover:bg-btn-primary-hover transition-all duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Bottom link card */}
        <div className="border border-border rounded-[6px] p-4 text-center text-sm">
          <span className="text-primary">Already have an account? </span>
          <Link
            to="/login"
            className="text-accent hover:underline transition-all duration-150 ease-in-out"
          >
            Sign in
          </Link>
          .
        </div>
      </div>
    </div>
  );
}