import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaSearch,
    FaBell,
    FaUser,
    FaCog,
    FaMoon,
    FaSun,
    FaTimes,
    FaSignOutAlt,
    FaUsers,
    FaCreditCard
} from 'react-icons/fa';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import Logo from '../assets/images/stlogo.svg';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const NotificationItem = ({ notification, theme, onClick }: { notification: any; theme: string; onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`group relative p-3 rounded-xl transition-all duration-200 cursor-pointer border mb-2 last:mb-0 mx-2 ${!notification.is_read
            ? theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            : theme === 'dark'
                ? 'bg-transparent border-transparent hover:bg-gray-800/30'
                : 'bg-transparent border-transparent hover:bg-gray-50'
            }`}
    >
        <div className="flex items-start gap-3">
            <div className="mt-1.5 shrink-0 w-2 h-2 flex items-center justify-center">
                {!notification.is_read && (
                    <div className="w-2 h-2 bg-[#25A8A0] rounded-full shadow-[0_0_8px_rgba(37,168,160,0.6)]" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-semibold text-sm leading-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{notification.title}</h4>
                    <span className={`text-[10px] whitespace-nowrap ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>{notification.message}</p>
            </div>
        </div>
    </div>
);

const ProfessionalHeader: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, fetchWithAuth } = useAuth();

    const [search, setSearch] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchNotifications = async () => {
        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/notifications/');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [fetchWithAuth]);

    const markAsRead = async (id: number) => {
        try {
            const response = await fetchWithAuth(`http://127.0.0.1:8000/api/auth/notifications/${id}/read/`, {
                method: 'POST'
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = () => notifications.filter(n => !n.is_read).forEach(n => markAsRead(n.id));
    const filteredNotifications = notifications.filter(n => (activeTab === 'unread' ? !n.is_read : true));
    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setNotificationsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.overflow = notificationsOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [notificationsOpen]);

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl border-b ${theme === 'dark'
                    ? 'bg-gray-900/95 border-gray-800 shadow-lg shadow-gray-900/20'
                    : 'bg-[#25A8A0] border-gray-200 shadow-lg shadow-gray-900/5'
                    }`}
            >
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center h-16 lg:h-20 px-4">
                        {/* Left section: Logo & Nav */}
                        <div className="flex items-center gap-8 z-10 flex-shrink-0">
                            <Link to="/professionals" className="flex items-center gap-2">
                                <img src={Logo} alt="SoulTalk" className="h-12 w-auto" />
                            </Link>
                            <nav className="hidden lg:flex">
                                <Link
                                    to="/clients"
                                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-full transition-all duration-300 ${location.pathname === '/clients'
                                        ? theme === 'dark'
                                            ? 'bg-[#25A8A0] text-white shadow-lg shadow-[#25A8A0]/20 scale-105 font-bold'
                                            : 'bg-white text-[#25A8A0] shadow-lg scale-105 font-bold'
                                        : theme === 'dark'
                                            ? 'text-gray-300 hover:text-[#25A8A0] hover:bg-[#25A8A0]/10 font-medium'
                                            : 'text-white/90 hover:text-white hover:bg-white/10 font-medium'
                                        }`}
                                >
                                    <FaUsers className="w-4 h-4" />
                                    <span>My Clients</span>
                                </Link>
                            </nav>
                        </div>

                        {/* Right Group: Search + Actions */}
                        <div className="flex-1 flex items-center justify-end gap-8 z-10">
                            {/* Search Bar */}
                            <div className="max-w-2xl w-full hidden xl:block">
                                <div className={`relative transition-all duration-300 ${searchFocused ? "scale-105" : ""}`}>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 z-10">
                                        <FaSearch className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        placeholder="Search clients..."
                                        className={`w-full pl-12 pr-12 py-2.5 rounded-2xl border-2 transition-all duration-300 ${searchFocused
                                            ? theme === "dark"
                                                ? "border-[#25A8A0] ring-4 ring-[#25A8A0]/10 shadow-lg border-gray-700 bg-gray-800/50 text-white placeholder-gray-400"
                                                : "border-white ring-4 ring-white/20 shadow-lg bg-white text-gray-900 placeholder-gray-400"
                                            : theme === "dark"
                                                ? "border-gray-700 bg-gray-800/50 text-white placeholder-gray-400"
                                                : "border-white/20 bg-white text-gray-900 placeholder-gray-500 hover:bg-white/90"
                                            } focus:outline-none`}
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Action Icons */}
                            <div className="flex items-center gap-8">

                                <button
                                    onClick={toggleTheme}
                                    className={`p-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "text-white hover:bg-white/10" : "text-white hover:bg-white/20"}`}
                                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                                >
                                    {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                                </button>

                                <div className="relative" ref={notificationsRef}>
                                    <button
                                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                                        className={`relative p-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "text-white hover:bg-white/10" : "text-white hover:bg-white/20"}`}
                                    >
                                        <FaBell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm border-2 border-[#25A8A0]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {notificationsOpen && (
                                        <div
                                            className={`absolute right-0 mt-4 w-[400px] rounded-2xl shadow-xl border backdrop-blur-xl z-50 transform transition-all duration-200 origin-top-right overflow-hidden ${theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}
                                        >
                                            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</span>
                                                    <button onClick={markAllAsRead} className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-[#25A8A0] hover:text-[#1e8a82]' : 'text-[#25A8A0] hover:text-[#1e8a82]'}`}>
                                                        Mark all read
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setActiveTab('all')}
                                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-[#25A8A0] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                    >
                                                        All
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveTab('unread')}
                                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'unread' ? 'bg-[#25A8A0] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                    >
                                                        Unread {unreadCount > 0 && `(${unreadCount})`}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto py-2">
                                                {filteredNotifications.map(n => (
                                                    <NotificationItem key={n.id} notification={n} theme={theme} onClick={() => markAsRead(n.id)} />
                                                ))}
                                                {filteredNotifications.length === 0 && (
                                                    <div className="py-8 text-center">
                                                        <FaBell className={`w-8 h-8 mx-auto mb-2 opacity-20 ${theme === 'dark' ? 'text-white' : 'text-[#25A8A0]'}`} />
                                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>No new notifications</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative" ref={profileRef}>
                                    <div
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-300 hover:scale-110 active:scale-95 shadow-md ${theme === 'dark' ? 'bg-[#25A8A0] text-white shadow-[#25A8A0]/20' : 'bg-white text-[#25A8A0] shadow-black/5'}`}
                                        style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                                        title="Profile"
                                    >
                                        {user?.avatar ? (
                                            <img src={user.avatar.startsWith('http') ? user.avatar : `http://127.0.0.1:8000${user.avatar}`} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0).toUpperCase() || 'P'
                                        )}

                                    </div>

                                    {profileOpen && (
                                        <div
                                            className={`absolute right-0 mt-4 w-72 rounded-[2rem] shadow-2xl border backdrop-blur-xl z-50 transform transition-all duration-300 p-2 ${theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white border-gray-100 shadow-teal-900/10'}`}
                                        >
                                            <div className="p-4">
                                                <div className="flex flex-col items-center mb-6 pt-2">
                                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-lg ring-4 overflow-hidden ${theme === 'dark' ? 'bg-[#25A8A0] ring-gray-700/50' : 'bg-teal-50 ring-teal-50'}`}>
                                                        {user?.avatar ? (
                                                            <img src={user.avatar.startsWith('http') ? user.avatar : `http://127.0.0.1:8000${user.avatar}`} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#25A8A0]'}`}>{user?.name?.charAt(0).toUpperCase() || 'P'}</span>
                                                        )}

                                                    </div>
                                                    <p className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                                        {user?.name?.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ') || 'Professional'}
                                                    </p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Link to="/professional/profile" className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-[#25A8A0]/10' : 'text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50'}`}>
                                                        <div className={`p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === 'dark' ? 'bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]' : 'bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]'}`}>
                                                            <FaUser className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-semibold text-sm">My Profile</span>
                                                    </Link>
                                                    <Link to="/professional/settings" className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-[#25A8A0]/10' : 'text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50'}`}>
                                                        <div className={`p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === 'dark' ? 'bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]' : 'bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]'}`}>
                                                            <FaCog className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-semibold text-sm">Settings</span>
                                                    </Link>
                                                    <Link to="/professional/history" className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-[#25A8A0]/10' : 'text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50'}`}>
                                                        <div className={`p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === 'dark' ? 'bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]' : 'bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]'}`}>
                                                            <FaUsers className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-semibold text-sm">Session History</span>
                                                    </Link>
                                                    <Link to="/professional/billing" className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-[#25A8A0]/10' : 'text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50'}`}>
                                                        <div className={`p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === 'dark' ? 'bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]' : 'bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]'}`}>
                                                            <FaCreditCard className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-semibold text-sm">Payment</span>
                                                    </Link>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            navigate('/');
                                                        }}
                                                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 bg-red-50 hover:bg-red-100 text-red-600 font-bold dark:bg-red-500/10 dark:hover:bg-red-500/20"
                                                    >
                                                        <FaSignOutAlt className="w-4 h-4" />
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className={`lg:hidden p-3 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-white hover:bg-white/20'}`}
                                >
                                    <HiOutlineMenuAlt3 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[60]">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className={`fixed top-0 right-0 h-full w-80 shadow-xl transform transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold">Menu</h2>
                                <button onClick={() => setMobileMenuOpen(false)} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="space-y-4">
                                <Link to="/professionals" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                                    <MdDashboard className="w-5 h-5" /> Dashboard
                                </Link>
                                <Link to="/clients" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                                    <FaUsers className="w-5 h-5" /> My Clients
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfessionalHeader;
