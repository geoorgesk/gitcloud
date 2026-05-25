import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Images, Upload, BookImage, LogOut } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/gallery', icon: Images, label: 'Gallery' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/albums', icon: BookImage, label: 'Albums' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 19C4.01 19 2 16.99 2 14.5S4.01 10 6.5 10c.28 0 .55.02.81.07A5.992 5.992 0 0 1 13 6c3.04 0 5.5 2.26 5.82 5.18C21.13 11.56 23 13.58 23 16c0 2.76-2.24 5-5 5H6.5z" fill="white"/>
          </svg>
          <span className="text-primary font-semibold text-sm">GitCloud</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-1.5 rounded-[6px] text-sm transition-colors duration-150 ease-in-out ${
                isActive
                  ? 'bg-surface-hover text-primary font-semibold border-l-2 border-accent'
                  : 'text-muted hover:bg-surface-hover hover:text-primary'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-3 px-2 py-1.5 mb-2">
          <div className="w-8 h-8 bg-btn-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white uppercase font-medium text-sm">
              {user?.username?.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-primary text-sm font-medium truncate">{user?.username}</p>
            <p className="text-muted text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-1.5 text-muted hover:text-primary rounded-[6px] text-sm transition-colors duration-150 ease-in-out"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </div>
  );
}