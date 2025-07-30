// Header.tsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Book, Hotel, User } from 'lucide-react';
import { ConnectWallet } from '../components/ConnectWallet';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);


  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/explore', label: 'Explore', icon: <Search size={20} /> },
    { to: '/bookings', label: 'Bookings', icon: <Book size={20} /> },
    { to: '/hotels', label: 'Hotels', icon: <Hotel size={20} /> },
    { to: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];


  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background-primary/95 backdrop-blur-lg border-b border-gray-700  py-2 shadow-lg' 
          : 'bg-background-primary/5 backdrop-blur-lg border-b border-gray-800 py-3'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center h-full">
  <NavLink to="/" className="flex items-center">
    <span className="text-3xl font-bold text-white leading-none">Sui.te</span>
  </NavLink>
</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    isActive 
                      ? 'text-[var(--primary)]' 
                      : 'text-[var(--text-primary)] dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-[var(--primary-light)]'
                  }`
                }
              >
                {link.icon}
                <span>{link.label} </span>
              </NavLink>
            ))}
          </nav>

          {/* Wallet Section */}
          <ConnectWallet />

        </div>
      </div>
    </header>
  );
};

export default Header;