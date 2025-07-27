import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Book, Hotel, User, Menu, X, Compass } from 'lucide-react';
import WalletButton from '../components/WalletButton';
import { Button } from '../components/ui/Button';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/explore', label: 'Explore', icon: <Compass size={20} /> },
  { to: '/bookings', label: 'My Bookings', icon: <Book size={20} /> },
  { to: '/hotels', label: 'My Hotels', icon: <Hotel size={20} /> },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background-primary/80 backdrop-blur-lg border-b border-border-primary shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-2xl font-display">
              <span className='text-primary'>Sui</span>.te
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                      isActive 
                        ? 'bg-primary text-background-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="hidden md:flex items-center gap-4">
              <WalletButton />
              <NavLink to="/profile">
                <Button variant="outline" size="icon">
                  <User size={20} />
                </Button>
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-background-primary/95 backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-20 border-b border-border-primary">
            <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-2xl font-display">
              <span className='text-primary'>Sui</span>.te
            </NavLink>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </Button>
          </div>
          <nav className="flex flex-col items-center justify-center h-[calc(100%-10rem)] gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-2xl font-medium flex items-center gap-4 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
             <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `text-2xl font-medium flex items-center gap-4 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
                  }`
                }
              >
                <User size={20} />
                <span>Profile</span>
              </NavLink>
          </nav>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-4">
            <WalletButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;