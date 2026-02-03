import { API_BASE_URL } from "../config";
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import WarningModal from "../components/WarningModal";
import {
    Calendar, Users, Award, Clock, Bell,
    Radio, ChevronRight, RefreshCw, Video, BookOpen, Briefcase, MessageCircle, Phone
} from 'lucide-react';
import ProfessionalHeader from './ProfessionalHeader';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const calculateTimeLeft = (targetDate: Date) => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference > -600000) {
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) return `${days}d ${hours}h ${minutes}m`;
            return `${hours}h ${minutes}m`;
        }
        return "Now";
    }
    return "Past";
};

const CountdownTimer: React.FC<{ targetTime: Date }> = ({ targetTime }) => {
    const [timeLeft, setTimeLeft] = React.useState(() => calculateTimeLeft(targetTime));

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetTime));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTime]);

    return <span className="text-xs font-black text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-xl border border-teal-100 dark:border-teal-800">{timeLeft}</span>;
};

const ProfessionalDashboard: React.FC = () => {
    const { theme } = useTheme();
    const { user, fetchWithAuth, isLoading } = useAuth();
    const [showWarning, setShowWarning] = useState(false);
    const [missingItems, setMissingItems] = useState<string[]>([]);
    const location = useLocation();

    const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
    const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
    const [recentClients, setRecentClients] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const playedNoticeIds = React.useRef<Set<number>>(new Set());
    const navigate = useNavigate();

    const fetchUpcomingSessions = useCallback(async () => {
        if (!user) return;
        setSessionsLoading(true);
        try {
            const appResponse = await fetchWithAuth(API_BASE_URL + '/api/auth/appointments/');
            if (appResponse.ok) {
                const data = await appResponse.json();
                setUpcomingSessions(data.filter((a: any) => a.status === 'upcoming'));
            }
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setSessionsLoading(false);
        }
    }, [fetchWithAuth, user]);

    const fetchConnectionRequests = useCallback(async () => {
        if (!user) return;
        setRequestsLoading(true);
        try {
            const connResponse = await fetchWithAuth(API_BASE_URL + '/api/auth/connections/');
            if (connResponse.ok) {
                const data = await connResponse.json();
                setConnectionRequests(data.filter((c: any) => c.status === 'pending'));

                const accepted = data.filter((c: any) => c.status === 'accepted');
                setRecentClients(accepted.slice(0, 5).map((c: any) => ({
                    id: c.client,
                    name: c.client_name,
                    lastActive: 'Active now',
                    status: 'Active'
                })));
            }
        } catch (error) {
            console.error("Error fetching connections:", error);
        } finally {
            setRequestsLoading(false);
        }
    }, [fetchWithAuth, user]);

    const fetchNotifications = useCallback(async (isAutoRefresh = false) => {
        if (!user) return;
        try {
            const notifResponse = await fetchWithAuth(API_BASE_URL + '/api/auth/notifications/');
            if (notifResponse.ok) {
                const data = await notifResponse.json();

                // Audio alert for brand new live requests
                if (isAutoRefresh) {
                    const newLiveRequests = data.filter((n: any) =>
                        n.type === 'live_request' &&
                        !n.is_read &&
                        !playedNoticeIds.current.has(n.id)
                    );

                    if (newLiveRequests.length > 0) {
                        // Mark as played immediately
                        newLiveRequests.forEach((n: any) => playedNoticeIds.current.add(n.id));

                        // Play a professional notification sound
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                        audio.play().catch(e => console.log('Audio play blocked:', e));

                        // Browser notification if permitted
                        if ("Notification" in window && Notification.permission === "granted") {
                            new Notification("New Live Request", {
                                body: `A client is requesting instant support: ${newLiveRequests[0].title}`,
                                icon: '/favicon.ico'
                            });
                        }
                    }
                }

                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [fetchWithAuth, user, notifications]);

    // Initial data fetch
    const fetchProfessionalData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            await Promise.all([
                (async () => {
                    const meResponse = await fetchWithAuth(API_BASE_URL + '/api/auth/me/');
                    if (meResponse.ok) {
                        const meData = await meResponse.json();
                        setIsOnline(meData.is_online);
                    }
                })(),
                fetchUpcomingSessions(),
                fetchConnectionRequests(),
                fetchNotifications()
            ]);
        } catch (error) {
            console.error("Error fetching initial professional data:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth, user, fetchUpcomingSessions, fetchConnectionRequests, fetchNotifications]);

    // Set up real-time polling for notifications
    useEffect(() => {
        if (user && user.type === 'professional') {
            const pollInterval = setInterval(() => {
                fetchNotifications(true);
            }, 5000); // Poll every 5 seconds for "Instant" feel

            // Update tab title if there are unread requests
            const unreadCount = notifications.filter(n => {
                const isRecent = (new Date().getTime() - new Date(n.created_at).getTime()) < 120000;
                return n.type === 'live_request' && !n.is_read && isRecent;
            }).length;
            if (unreadCount > 0) {
                document.title = `(${unreadCount}) New Request! | SoulTalk`;
            } else {
                document.title = 'Professional Dashboard | SoulTalk';
            }

            return () => {
                clearInterval(pollInterval);
                document.title = 'SoulTalk Mental Health';
            };
        }
    }, [user, fetchNotifications, notifications]);

    // Request notification permission on mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const hasFetched = React.useRef(false);
    const alertShown = React.useRef(false);
    useEffect(() => {
        if (!isLoading && user && !hasFetched.current) {
            // Skip checks if already on target page
            if (location.pathname === '/professional/profile') {
                return;
            }

            if (user.type === 'professional' && !user.verified) {
                navigate('/verification-pending');
                return;
            }

            // Obligation for Profile Photo and Bio
            if (user.type === 'professional' && (!user.avatar || !user.bio) && !alertShown.current) {
                const missing = [];
                if (!user.avatar) missing.push('Profile Photo');
                if (!user.bio) missing.push('Professional Bio');
                setMissingItems(missing);
                setShowWarning(true);
                alertShown.current = true;
                return;
            }
            fetchProfessionalData();
            hasFetched.current = true;
        }
    }, [isLoading, user, fetchProfessionalData, navigate, location.pathname]);


    const handleConnectionUpdate = async (id: number, status: 'accepted' | 'rejected') => {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/connections/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                await fetchConnectionRequests();
                alert(`Connection ${status === 'accepted' ? 'accepted' : 'rejected'} successfully.`);
            }
        } catch (error) {
            console.error("Error updating connection status:", error);
        }
    };

    const stats = [
        { label: 'Total Clients', value: recentClients.length.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Total Sessions', value: (user?.sessions_completed || 0).toString(), icon: Radio, color: 'text-[#25A8A0]', bg: 'bg-teal-50 dark:bg-teal-900/20' },
        { label: 'Your Rating', value: (user?.rating || 5.0).toFixed(1), icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    ];

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-12 h-12 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-[#0B1120] text-gray-100' : 'bg-[#F8FAFB] text-slate-900'}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <header className="mb-10 animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className={`p-6 md:p-8 rounded-[2rem] flex-1 ${theme === 'dark' ? 'bg-[#151C2C]' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}>
                            <h1 className={`text-3xl md:text-4xl font-black tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                Welcome Back, <span className="text-[#25A8A0]">{(user?.name?.split(' ')[0] || '').charAt(0).toUpperCase() + (user?.name?.split(' ')[0] || '').slice(1).toLowerCase()}</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">


                            <button
                                onClick={async () => {
                                    const newStatus = !isOnline;
                                    setIsOnline(newStatus); // Optimistic update
                                    try {
                                        const response = await fetchWithAuth(API_BASE_URL + '/api/auth/professional/status/', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ is_online: newStatus })
                                        });
                                        if (!response.ok) {
                                            setIsOnline(!newStatus); // Revert on failure
                                        }
                                    } catch (error) {
                                        console.error('Error updating status:', error);
                                        setIsOnline(!newStatus); // Revert on error
                                    }
                                }}
                                className={`px-6 py-4 rounded-2xl border shadow-sm flex items-center gap-4 transition-all hover:scale-105 active:scale-95 ${isOnline
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                                    : theme === 'dark'
                                        ? 'bg-slate-800 border-white/5 text-gray-400'
                                        : 'bg-white border-gray-200 text-gray-500'}`}
                            >
                                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-400'}`}></div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                                    <p className="text-sm font-black">{isOnline ? 'Available' : 'Unavailable'}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>



                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Link to="/professional/schedule" className={`group relative overflow-hidden p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#151C2C] hover:bg-[#1E2538]' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>
                        <div className={`absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${theme === 'dark' ? 'opacity-5' : ''}`}>
                            <Calendar className="w-32 h-32 text-[#25A8A0]" />
                        </div>
                        <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${theme === 'dark' ? 'bg-[#25A8A0]/10 text-[#25A8A0]' : 'bg-[#F0FDF9] text-[#25A8A0]'}`}>
                                <Calendar className="w-7 h-7" />
                            </div>
                            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Schedule</h3>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Manage appointments & availability</p>
                        </div>
                    </Link>

                    <Link to="/journal" className={`group relative overflow-hidden p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#151C2C] hover:bg-[#1E2538]' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>
                        <div className={`absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${theme === 'dark' ? 'opacity-5' : ''}`}>
                            <BookOpen className="w-32 h-32 text-orange-500" />
                        </div>
                        <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${theme === 'dark' ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-500'}`}>
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Private Journal</h3>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Personal reflections & notes</p>
                        </div>
                    </Link>

                    <Link to="/opportunities" className={`group relative overflow-hidden p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#151C2C] hover:bg-[#1E2538]' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>
                        <div className={`absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${theme === 'dark' ? 'opacity-5' : ''}`}>
                            <Briefcase className="w-32 h-32 text-indigo-500" />
                        </div>
                        <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                <Briefcase className="w-7 h-7" />
                            </div>
                            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Opportunities Board</h3>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Browse needs and grow your practice</p>
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, index) => {
                        const isNewAccount = upcomingSessions.length === 0 && connectionRequests.length === 0 && recentClients.length === 0;
                        const displayValue = isNewAccount ? (stat.label === 'Client Rating' ? '0.0' : '0') : stat.value;

                        return (
                            <div key={index} className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#151C2C]' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`} style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</h3>
                                </div>
                                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{displayValue}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Live Requests Section (Instagram-style Stories layout) */}
                        {notifications.filter(n => {
                            const isRecent = (new Date().getTime() - new Date(n.created_at).getTime()) < 120000; // 2 minutes
                            return n.type === 'live_request' && !n.is_read && isRecent;
                        }).length > 0 && (
                                <div className="mb-10 animate-fadeIn overflow-hidden">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-teal-400' : 'text-teal-700'}`}>
                                            Live Active Requests
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                                            <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                                                {notifications.filter(n => {
                                                    const isRecent = (new Date().getTime() - new Date(n.created_at).getTime()) < 120000;
                                                    return n.type === 'live_request' && !n.is_read && isRecent;
                                                }).length} ACTIVE
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-none snap-x">
                                        {notifications.filter(n => {
                                            const isRecent = (new Date().getTime() - new Date(n.created_at).getTime()) < 120000;
                                            return n.type === 'live_request' && !n.is_read && isRecent;
                                        }).map((notif) => (
                                            <div key={notif.id} className={`snap-start min-w-[280px] md:min-w-[320px] relative overflow-hidden rounded-[2rem] p-6 transition-all duration-300 hover:shadow-2xl ${theme === 'dark' ? 'bg-[#151C2C] border border-teal-500/10' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-teal-50/50'}`}>
                                                {/* Gradient glow behind icon */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl -mr-16 -mt-16"></div>

                                                <div className="flex items-center gap-4 mb-5">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#25A8A0] to-[#36D1C7] p-[2px] animate-shimmer">
                                                            <div className={`w-full h-full rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-[#151C2C]' : 'bg-white'}`}>
                                                                <div className="w-11 h-11 rounded-[14px] bg-[#25A8A0] flex items-center justify-center text-white shadow-lg">
                                                                    {notif.title.toLowerCase().includes('voice') ? (
                                                                        <Phone className="w-5 h-5 animate-wiggle" />
                                                                    ) : notif.title.toLowerCase().includes('chat') ? (
                                                                        <MessageCircle className="w-5 h-5 animate-bounce" />
                                                                    ) : (
                                                                        <Video className="w-5 h-5 animate-pulse" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 border-2 border-white dark:border-[#151C2C] rounded-full flex items-center justify-center">
                                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className={`text-[10px] font-black uppercase tracking-wider mb-0.5 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
                                                            {notif.title.replace('Incoming ', '')}
                                                        </div>
                                                        <h3 className={`font-black text-lg truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                                            {(notif.message.split(' wants')[0] || 'Client').split(' ').map((w: any) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="relative flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                            </span>
                                                            <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Waiting for you...</span>
                                                        </div>
                                                    </div>
                                                </div>



                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                // Optimistically remove from UI first for instant feedback
                                                                setNotifications(prev => prev.filter(n => n.id !== notif.id));

                                                                // Then mark as read in backend
                                                                await fetchWithAuth(`${API_BASE_URL}/api/auth/notifications/${notif.id}/mark-read/`, { method: 'POST' });

                                                                // Check for updates to be safe
                                                                const notifResponse = await fetchWithAuth(API_BASE_URL + '/api/auth/notifications/');
                                                                if (notifResponse.ok) {
                                                                    const data = await notifResponse.json();
                                                                    setNotifications(data);
                                                                }
                                                            } catch (error) {
                                                                console.error("Error cancelling request:", error);
                                                            }
                                                        }}
                                                        className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border ${theme === 'dark' ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200'}`}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <Link
                                                        to={notif.link}
                                                        onClick={async () => {
                                                            try {
                                                                // 1. Mark notification as read
                                                                await fetchWithAuth(`${API_BASE_URL}/api/auth/notifications/${notif.id}/mark-read/`, { method: 'POST' });

                                                                // 2. Automatically set status to "Busy" (Offline) so other clients can't call
                                                                if (isOnline) {
                                                                    setIsOnline(false); // Optimistic UI update
                                                                    await fetchWithAuth(API_BASE_URL + '/api/auth/professional/status/', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ is_online: false })
                                                                    });
                                                                }
                                                            } catch (error) {
                                                                console.error("Error joining session:", error);
                                                            }
                                                        }}
                                                        className="flex-1 px-4 py-2.5 bg-[#25A8A0] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 group"
                                                    >
                                                        Accept & Join
                                                        <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        <div className={`rounded-[2rem] p-8 transition-all duration-300 ${theme === 'dark' ? 'bg-[#151C2C]' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-[#25A8A0]/10 text-[#25A8A0]' : 'bg-teal-50 text-[#25A8A0]'}`}>
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Upcoming Sessions
                                    </h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => fetchUpcomingSessions()}
                                        className={`p-2 rounded-xl transition-all ${sessionsLoading ? 'animate-spin opacity-50' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                        title="Refresh sessions"
                                        disabled={sessionsLoading}
                                    >
                                        <RefreshCw className="w-5 h-5 text-gray-400" />
                                    </button>
                                    <Link to="/professional/schedule" className="text-sm font-bold text-[#25A8A0] hover:text-[#1e8a82] transition-colors">View All</Link>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="py-10 flex justify-center"><div className="w-10 h-10 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div></div>
                                ) : upcomingSessions.length === 0 ? (
                                    <div className={`text-center py-12 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
                                        <Clock className={`w-12 h-12 mx-auto mb-3 opacity-20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                        <p className="font-medium text-gray-400">No sessions scheduled</p>
                                    </div>
                                ) : (
                                    upcomingSessions.map(session => (
                                        <div key={session.id} className={`p-4 rounded-2xl border transition-all duration-300 ${theme === "dark" ? "bg-[#0B1120] border-gray-800" : "bg-gray-50/50 border-gray-100 hover:border-[#25A8A0]/30"}`}>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={session.client_image || `https://ui-avatars.com/api/?name=${session.client_name}&background=random`}
                                                        className="w-12 h-12 rounded-xl object-cover"
                                                        alt=""
                                                    />
                                                    <div>
                                                        <h4 className="font-black text-sm">{session.client_name || 'Anonymous Client'}</h4>
                                                        <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {session.time.substring(0, 5)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <CountdownTimer targetTime={new Date(`${session.date}T${session.time}`)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="space-y-8">
                        <div className={`rounded-[2rem] p-8 transition-all duration-300 ${theme === 'dark' ? 'bg-[#151C2C]' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-500'}`}>
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Requests
                                    </h2>
                                </div>
                                <button
                                    onClick={() => fetchConnectionRequests()}
                                    className={`p-2 rounded-xl transition-all ${requestsLoading ? 'animate-spin opacity-50' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                    title="Refresh requests"
                                    disabled={requestsLoading}
                                >
                                    <RefreshCw className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {connectionRequests.length === 0 ? (
                                    <div className={`text-center py-12 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
                                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-10" />
                                        <p className="text-sm font-medium opacity-40">No pending requests</p>
                                    </div>
                                ) : (
                                    connectionRequests.map(request => (
                                        <div key={request.id} className={`p-5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0B1120] border-white/5' : 'bg-white border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-md'}`}>
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="relative">
                                                    <img src={`https://ui-avatars.com/api/?name=${request.client_name}&background=random`} alt={request.client_name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-white/10 shadow-lg" />
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white dark:border-[#0B1120] rounded-full shadow-sm"></span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-bold text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{request.client_name || 'Anonymous Client'}</h3>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(request.created_at).toLocaleDateString()} • NEW</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleConnectionUpdate(request.id, 'accepted')}
                                                    className="flex-1 py-2.5 bg-[#25A8A0] hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-500/10 active:scale-95 uppercase tracking-wide"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleConnectionUpdate(request.id, 'rejected')}
                                                    className={`flex-1 py-2.5 border text-xs font-bold rounded-xl transition-all uppercase tracking-wide ${theme === 'dark' ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </main>
            <WarningModal
                isOpen={showWarning}
                onClose={() => setShowWarning(false)}
                title="Professional Profile Incomplete"
                message="To start connecting with clients, you need to complete your professional profile. This helps users trust and choose you."
                missingItems={missingItems}
                actionLabel="Complete My Profile"
                onAction={() => {
                    setShowWarning(false);
                    navigate('/professional/profile');
                }}
            />
        </div >
    );
};

export default ProfessionalDashboard;