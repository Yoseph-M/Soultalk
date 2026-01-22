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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#25A8A0] shadow-2xl transform transition-transform duration-300 ease-out p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src={Logo} alt="Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold text-white">SoulTalk</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={
                    (isActive(item.path) ? 'bg-white text-[#25A8A0]' : 'text-white hover:bg-white/10') +
                    ' text-lg font-semibold py-3 px-4 rounded-xl transition-all flex items-center h-14'
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/20">
              {user && (user.type !== 'professional' || user.verified) ? (
                <div className="flex flex-col gap-4">
                  <Link
                    to={user.type === 'professional' || user.type === 'listener' ? '/professionals' : '/dashboard'}
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full bg-white text-[#25A8A0] font-bold py-4 rounded-xl shadow-lg">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 px-4 text-center text-white/80 hover:text-white transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth?mode=signup"
                  className="w-full bg-white text-[#25A8A0] font-bold py-4 rounded-xl shadow-lg flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;