import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const userId = searchParams.get('userId');

    if (token && username) {
      loginWithToken({ token, username, _id: userId });
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted text-sm">Signing you in...</p>
      </div>
    </div>
  );
}