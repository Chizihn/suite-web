import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Book, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  // Hide navigation on certain routes (exact or contains)
  const hideNavOnRoutes = ['/login', '/signup', '/onboarding'];
  const shouldHideNav =
    hideNavOnRoutes.includes(location.pathname) ||
    location.pathname.includes('/hotels/') ||
    location.pathname.includes('/bookings/');

  if (shouldHideNav) {
    return null;
  }

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={24} /> },
    { to: '/explore', label: 'Explore', icon: <Search size={24} /> },
    { to: '/bookings', label: 'Bookings', icon: <Book size={24} /> },
    { to: '/profile', label: 'Profile', icon: <User size={24} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-white' : 'text-gray-400'
              } hover:text-white transition-colors`
            }
          >
            {link.icon}
            <span className="text-xs mt-1">{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Add safe area inset for devices with home indicator */}
      <div className="h-4" />
    </nav>
  );
};

export default Navigation;
