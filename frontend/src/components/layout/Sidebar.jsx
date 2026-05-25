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
        <div className="w-5 h-5 bg-white rounded-sm" />
        <span className="text-white font-semibold text-sm">GitCloud</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-surface-hover text-white font-medium'
                  : 'text-muted hover:bg-surface-hover hover:text-white'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.5} />
            <span>{label}</span>
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
            <p className="text-white text-sm font-medium truncate">{user?.username}</p>
            <p className="text-muted text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted hover:text-white hover:bg-surface-hover rounded-md text-sm transition-colors duration-150"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </div>
  );
}