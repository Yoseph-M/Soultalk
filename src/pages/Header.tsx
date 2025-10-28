import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/images/stlogo.svg';
import { FaUserCircle, FaCalendarAlt, FaBell, FaListAlt } from 'react-icons/fa';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      // When scrolling down more than 50px, switch to compact header
      setIsScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/services', label: 'Services' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About Us' },
    { path: '/blog', label: 'Blog' },
  ];

  return (
    <header
      className={
        (isScrolled ? 'header-scrolled bg-gradient-to-r from-[#25A8A0] to-[#1e8a82]' : 'header-floating') +
        ' transition-all duration-300 flex items-center'
      }
      style={{ transformOrigin: 'top center', zIndex: 50 }}
    >
      <div className="container mx-auto px-4 py-0 flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" style={{ gap: '0px' }}>
          <img src={Logo} alt="SoulTalk Logo" className="h-16 md:h-12 -mr-2" />
          <span className="text-2xl font-extrabold text-white">SoulTalk</span>
        </Link>

  {/* Desktop Navigation */}
  <nav className={(isScrolled ? 'hidden md:flex items-center flex-1 justify-center h-full' : 'hidden md:flex items-center flex-1 justify-center h-full')}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                (isActive(item.path) ? 'active-nav-link' : 'nav-link') +
                ' text-base px-4 flex items-center justify-center h-full'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className={(isScrolled ? 'hidden md:flex items-center space-x-2' : 'hidden md:flex items-center space-x-3')}>
          {!user ? (
            <>
              <Link to="/auth?mode=signup">
                <button className="bg-white text-[#25A8A0] hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-base h-12">
                  Get Started
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* My Sessions */}
              <Link to="/sessions">
                <button className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors" title="My Sessions">
                  <FaListAlt className="w-5 h-5" />
                  <span className="hidden lg:inline">My Sessions</span>
                </button>
              </Link>
              {/* Schedule */}
              <Link to="/schedule">
                <button className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors" title="Schedule">
                  <FaCalendarAlt className="w-5 h-5" />
                  <span className="hidden lg:inline">Schedule</span>
                </button>
              </Link>
              {/* Notifications */}
              <Link to="/notifications">
                <button className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors" title="Notifications">
                  <FaBell className="w-5 h-5" />
                  <span className="hidden lg:inline">Notifications</span>
                </button>
              </Link>
              {/* My Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors" title="My Profile" aria-haspopup="true" aria-expanded="false">
                  <FaUserCircle className="w-6 h-6" />
                  <span className="hidden lg:inline">My Profile</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">View Profile</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-white/20">
          <nav className="flex flex-col space-y-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  (isActive(item.path) ? 'active-nav-link' : 'nav-link') +
                  ' text-base py-2 px-4 rounded flex items-center h-12'
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-4 text-left text-white/90 hover:bg-white/10 rounded transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="py-2 px-4 text-white/90 hover:bg-gradient-to-r hover:from-[#25A8A0] hover:to-green-600 hover:text-white rounded transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;