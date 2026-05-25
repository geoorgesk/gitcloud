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

  const initial = user?.username?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="w-64 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-border shrink-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#e6edf3" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
        <span className="text-primary font-semibold text-base">GitCloud</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-surface-hover text-primary font-medium'
                  : 'text-muted hover:bg-surface-hover hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 w-1 h-6 bg-accent rounded-r-md" />}
                <Icon size={16} strokeWidth={1.5} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-border px-3 py-3 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-btn-primary rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="text-primary text-sm font-medium truncate">{user?.username}</p>
            <p className="text-muted text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted hover:text-primary hover:bg-surface-hover rounded-md text-sm transition-colors duration-150 cursor-pointer"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </div>
  );
}