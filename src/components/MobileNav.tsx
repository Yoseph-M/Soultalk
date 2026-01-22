import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdMessage, MdPerson, MdSearch } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const MobileNav: React.FC = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const isDark = theme === 'dark';

    if (!user) return null;

    // Hide on immersive pages
    const immersiveRoutes = ['/ai-chat', '/live', '/chat'];
    if (immersiveRoutes.some(route => location.pathname.startsWith(route))) {
        return null;
    }

    const navItems = user.type === 'professional' || user.type === 'listener'
        ? [
            { label: 'Home', icon: MdDashboard, path: '/professionals' },
            { label: 'Clients', icon: MdSearch, path: '/clients' },
            { label: 'Schedule', icon: MdMessage, path: '/professional/schedule' },
            { label: 'Profile', icon: MdPerson, path: '/professional/profile' },
        ]
        : [
            { label: 'Home', icon: MdDashboard, path: '/dashboard' },
            { label: 'Support', icon: MdSearch, path: '/find-listener' },
            { label: 'AI Chat', icon: MdMessage, path: '/ai-chat' },
            { label: 'Profile', icon: MdPerson, path: '/profile' },
        ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={`fixed bottom-0 left-0 right-0 z-[100] md:hidden border-t safe-area-bottom ${isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-100'
            } backdrop-blur-lg`}>
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${isActive(item.path)
                            ? 'text-[#25A8A0]'
                            : isDark ? 'text-gray-500' : 'text-gray-400'
                            }`}
                    >
                        <item.icon className="text-2xl mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        {isActive(item.path) && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#25A8A0]"></div>
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default MobileNav;
