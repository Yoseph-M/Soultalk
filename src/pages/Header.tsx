import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/images/stlogo.svg';


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {

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
        { }
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" style={{ gap: '0px' }}>
          <img src={Logo} alt="SoulTalk Logo" className="h-16 md:h-12 -mr-2" />
          <span className="text-2xl font-extrabold text-white">SoulTalk</span>
        </Link>

        { }
        <nav className={(isScrolled ? 'hidden md:flex items-center flex-1 justify-center gap-8 h-full' : 'hidden md:flex items-center flex-1 justify-center gap-8 h-full')}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                (isActive(item.path) ? 'active-nav-link' : 'nav-link') +
                ' text-base px-4 flex items-center justify-center'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        { }
        <div className="hidden md:flex items-center gap-4">
          {user && (user.type !== 'professional' || user.verified) ? (
            <>
              <Link to={user.type === 'professional' || user.type === 'listener' ? '/professionals' : '/dashboard'}>
                <button className="text-white font-semibold px-4 hover:underline transition-all">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={logout}
                className="bg-white text-[#25A8A0] hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-base h-12"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth?mode=signup">
              <button className="bg-white text-[#25A8A0] hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-base h-12">
                Get Started
              </button>
            </Link>
          )}
        </div>

        { }
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      { }
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
            {user && (user.type !== 'professional' || user.verified) ? (
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