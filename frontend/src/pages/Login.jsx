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
          Sign in to GitCloud
        </h1>

        {/* Card with form */}
        <div className="bg-surface border border-border rounded-[6px] p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-primary text-sm font-medium block mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-border rounded-[6px] px-3 py-[5px] h-[32px] text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-150 ease-in-out"
                required
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-primary text-sm font-medium">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg border border-border rounded-[6px] px-3 py-[5px] h-[32px] text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-150 ease-in-out"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-btn-primary text-white text-sm font-medium rounded-[6px] py-[5px] px-4 hover:bg-btn-primary-hover transition-all duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Bottom link card */}
        <div className="border border-border rounded-[6px] p-4 text-center text-sm">
          <span className="text-primary">New to GitCloud? </span>
          <Link
            to="/register"
            className="text-accent hover:underline transition-all duration-150 ease-in-out"
          >
            Create an account
          </Link>
          .
        </div>
      </div>
    </div>
  );
}