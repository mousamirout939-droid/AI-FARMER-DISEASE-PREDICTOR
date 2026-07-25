import { Link, NavLink } from 'react-router-dom';
import { Sprout, Sun, Moon, Menu, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme.js';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice.js';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-forest dark:text-wheat' : 'text-forest/60 hover:text-forest dark:text-sage-100/60 dark:hover:text-sage-100'}`;

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/70 bg-sage-50/80 backdrop-blur dark:border-white/10 dark:bg-[#0B1A12]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              className="rounded-lg p-2 hover:bg-sage-100 dark:hover:bg-white/5 lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-field-gradient text-sage-50">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold text-forest dark:text-sage-50">AI Farmer</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/features" className={navLinkClass}>Features</NavLink>
          <NavLink to="/weather" className={navLinkClass}>Weather</NavLink>
          <NavLink to="/market" className={navLinkClass}>Market</NavLink>
          <NavLink to="/community" className={navLinkClass}>Community</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-full p-2 text-forest/70 hover:bg-sage-100 dark:text-sage-100/70 dark:hover:bg-white/5"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="rounded-full p-2 text-forest/70 hover:bg-sage-100 dark:text-sage-100/70 dark:hover:bg-white/5">
                <Bell className="h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="hidden items-center gap-2 sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wheat/30 text-sm font-semibold text-forest">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </Link>
              <button onClick={logout} className="btn-ghost text-sm">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Log in</Link>
              <Link to="/signup" className="btn-primary text-sm !px-4 !py-2">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
