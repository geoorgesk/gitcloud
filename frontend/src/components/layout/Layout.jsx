import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TokenOnboardingModal from './TokenOnboardingModal';
import api from '../../services/api';

export default function Layout() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if the user already skipped the modal to avoid annoying them
    const hasSkipped = localStorage.getItem('hasSkippedTokenOnboarding');
    
    if (!hasSkipped) {
      // Check if they actually need a token
      api.get('/auth/me').then(res => {
        if (!res.data.hasGithubToken) {
          setShowModal(true);
        }
      }).catch(err => {
        console.error('Failed to fetch user token status', err);
      });
    }
  }, []);

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 min-h-screen bg-bg relative">
        <Outlet />
        {showModal && <TokenOnboardingModal onClose={() => setShowModal(false)} />}
      </main>
    </div>
  );
}