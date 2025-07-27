import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Book, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const hideNavOnRoutes = ['/login', '/signup', '/onboarding'];
  const shouldHideNav =
    hideNavOnRoutes.includes(location.pathname) ||
    location.pathname.includes('/hotels/') ||
    location.pathname.includes('/bookings/');

  if (shouldHideNav) {
    return null;
  }

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={26} /> },
    { to: '/explore', label: 'Explore', icon: <Search size={26} /> },
    { to: '/bookings', label: 'Bookings', icon: <Book size={26} /> },
    { to: '/profile', label: 'Profile', icon: <User size={26} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-gray-700  shadow-xl z-50">
      <div className="flex justify-around items-center h-16">
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-grow py-2 cursor-pointer relative ${
                isActive ? 'text-white' : 'text-gray-400'
              } hover:text-white transition-colors duration-200 ease-in-out`
            }
          >
            {icon}
            <span className="text-[11px] mt-1 font-medium">{label}</span>

            {/* Active indicator */}
            <ActiveIndicator />
          </NavLink>
        ))}
      </div>

      {/* Safe area for home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

const ActiveIndicator: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
  if (!isActive) return null;
  return (
    <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-white" />
  );
};

export default Navigation;
