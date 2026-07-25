import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine, History, CloudSun, LineChart, Users, MessageSquare, Settings, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-forest text-sage-50'
      : 'text-forest/70 hover:bg-sage-100 dark:text-sage-100/70 dark:hover:bg-white/5'
  }`;

const FARMER_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/predict', label: 'Detect Disease', icon: ScanLine },
  { to: '/history', label: 'History & Reports', icon: History },
  { to: '/weather', label: 'Weather', icon: CloudSun },
  { to: '/market', label: 'Market Prices', icon: LineChart },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/expert-chat', label: 'Expert Chat', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const ADMIN_LINKS = [
  { to: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const links = user?.role === 'admin' ? [...FARMER_LINKS, ...ADMIN_LINKS] : FARMER_LINKS;

  return (
    <aside
      className={`${sidebarOpen ? 'block' : 'hidden'} w-64 shrink-0 border-r border-sage-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-transparent lg:block`}
    >
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
