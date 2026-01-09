import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Calendar, Users, Star, Clock, Bell,
    Video, ChevronRight, RefreshCw, Eye, BookOpen
} from 'lucide-react';
import ProfessionalHeader from './ProfessionalHeader';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const ProfessionalDashboard: React.FC = () => {
    const { theme } = useTheme();
    const { user, fetchWithAuth, isLoading } = useAuth();

    const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
    const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
    const [recentClients, setRecentClients] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const navigate = useNavigate();

    const fetchProfessionalData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            console.log("Fetching professional data for user:", user.id);
            // Fetch Status (via User Details)
            const meResponse = await fetchWithAuth('http://127.0.0.1:8000/api/auth/me/');
            if (meResponse.ok) {
                const meData = await meResponse.json();
                setIsOnline(meData.is_online);
            }

            // Fetch Appointments
            const appResponse = await fetchWithAuth('http://127.0.0.1:8000/api/auth/appointments/');
            if (appResponse.ok) {
                const data = await appResponse.json();
                setUpcomingSessions(data.filter((a: any) => a.status === 'upcoming'));
            }

            // Fetch Connection Requests
            const connResponse = await fetchWithAuth('http://127.0.0.1:8000/api/auth/connections/');
            if (connResponse.ok) {
                const data = await connResponse.json();
                console.log("Received connections data:", data);
                setConnectionRequests(data.filter((c: any) => c.status === 'pending'));

                // Mock recent clients based on accepted connections
                const accepted = data.filter((c: any) => c.status === 'accepted');
                setRecentClients(accepted.slice(0, 5).map((c: any) => ({
                    id: c.client,
                    name: c.client_name,
                    lastActive: 'Active now',
                    status: 'Active'
                })));
            }

            // Fetch Notifications
            const notifResponse = await fetchWithAuth('http://127.0.0.1:8000/api/auth/notifications/');
            if (notifResponse.ok) {
                const data = await notifResponse.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching professional data:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth, user]);

    useEffect(() => {
        fetchProfessionalData();
        // Removed continuous refresh timer as per user request
    }, [fetchProfessionalData]);

    useEffect(() => {
        if (!isLoading && user) {
            if (user.type === 'professional' && !user.verified) {
                navigate('/verification-pending');
                return;
            }
            fetchProfessionalData();
        }
    }, [isLoading, user, fetchProfessionalData, navigate]);

    const handleConnectionUpdate = async (id: number, status: 'accepted' | 'rejected') => {
        try {
            const response = await fetchWithAuth(`http://127.0.0.1:8000/api/auth/connections/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                await fetchProfessionalData();
                alert(`Connection ${status === 'accepted' ? 'accepted' : 'rejected'} successfully.`);
            }
        } catch (error) {
            console.error("Error updating connection status:", error);
        }
    };

    const stats = [
        { label: 'Total Clients', value: recentClients.length.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Live Sessions', value: upcomingSessions.length.toString(), icon: Video, color: 'text-[#25A8A0]', bg: 'bg-teal-50 dark:bg-teal-900/20' },
        { label: 'Client Rating', value: '0.0', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { label: 'Profile Views', value: '0', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-12 h-12 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-[#0B1120] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <header className="mb-10 animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className={`text-4xl font-black tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Professional Dashboard</h1>
                            <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                You have <span className="text-[#25A8A0] font-bold">{upcomingSessions.length} sessions</span> scheduled for today.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">


                            <button
                                onClick={async () => {
                                    try {
                                        const newStatus = !isOnline;
                                        const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/professional/status/', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ is_online: newStatus })
                                        });
                                        if (response.ok) {
                                            setIsOnline(newStatus);
                                        }
                                    } catch (error) {
                                        console.error('Error updating status:', error);
                                    }
                                }}
                                className={`px-4 py-3 rounded-2xl border shadow-sm flex items-center gap-3 transition-all hover:scale-105 ${isOnline
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                                    : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-white/5 dark:text-gray-400'}`}
                            >
                                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`}></div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                                    <p className="text-sm font-black">{isOnline ? 'Online Now' : 'Offline'}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>



                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link to="/professional/schedule" className={`group p-6 rounded-3xl shadow-xl border transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-[#151C2C] border-white/5 hover:border-[#25A8A0]' : 'bg-white border-slate-100 hover:border-[#25A8A0]'}`}>
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-teal-100 dark:bg-teal-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                                <Calendar className="w-8 h-8 text-[#25A8A0]" />
                            </div>
                            <div>
                                <h3 className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>My Schedule</h3>
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Manage appointments & availability</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/journal" className={`group p-6 rounded-3xl shadow-xl border transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-[#151C2C] border-white/5 hover:border-orange-500' : 'bg-white border-slate-100 hover:border-orange-500'}`}>
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8 text-orange-500" />
                            </div>
                            <div>
                                <h3 className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Private Journal</h3>
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Personal reflections & notes</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const isNewAccount = upcomingSessions.length === 0 && connectionRequests.length === 0 && recentClients.length === 0;
                        const displayValue = isNewAccount ? (stat.label === 'Client Rating' ? '0.0' : '0') : stat.value;

                        return (
                            <div key={index} className={`p-6 rounded-3xl shadow-xl border transition-all duration-300 hover:-translate-y-1 animate-slideUp ${theme === 'dark' ? 'bg-[#151C2C] border-white/5 hover:border-[#25A8A0]' : 'bg-white border-slate-100 hover:border-[#25A8A0]'}`} style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-4 rounded-2xl ${stat.bg} shadow-inner`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <h3 className={`text-4xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{displayValue}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Live Requests Section */}
                        {notifications.filter(n => n.type === 'live_request' && !n.is_read).length > 0 && (
                            <div className="space-y-4 animate-fadeIn">
                                {notifications.filter(n => n.type === 'live_request' && !n.is_read).map((notif) => (
                                    <div key={notif.id} className={`border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl transition-all ${theme === 'dark' ? 'bg-teal-500/10 border-teal-500/20 shadow-teal-500/5' : 'bg-teal-50 border-teal-100 shadow-teal-500/5'}`}>
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-[#25A8A0] rounded-2xl flex items-center justify-center text-white animate-pulse shadow-lg shadow-teal-500/20">
                                                <Bell className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className={`font-black text-xl ${theme === 'dark' ? 'text-teal-400' : 'text-teal-900'}`}>{notif.title}</h3>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-teal-300/80' : 'text-teal-700'}`}>{notif.message}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            <button
                                                onClick={async () => {
                                                    await fetchWithAuth(`http://127.0.0.1:8000/api/auth/notifications/${notif.id}/mark-read/`, { method: 'POST' });
                                                    fetchProfessionalData();
                                                }}
                                                className={`flex-1 md:flex-none px-6 py-3 font-bold rounded-2xl transition-all border ${theme === 'dark' ? 'bg-transparent border-teal-500/30 text-teal-400 hover:bg-teal-500/10' : 'bg-white border-teal-200 text-teal-600 hover:bg-teal-50'}`}
                                            >
                                                Dismiss
                                            </button>
                                            <Link
                                                to={notif.link}
                                                onClick={async () => {
                                                    await fetchWithAuth(`http://127.0.0.1:8000/api/auth/notifications/${notif.id}/mark-read/`, { method: 'POST' });
                                                }}
                                                className="flex-1 md:flex-none px-8 py-3 bg-[#25A8A0] text-white font-black rounded-2xl hover:bg-teal-600 shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                Join Session
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={`rounded-3xl p-8 shadow-xl border transition-all duration-300 ${theme === 'dark' ? 'bg-[#151C2C] border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className={`text-2xl font-black flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    <div className="p-2 bg-teal-500/10 rounded-xl">
                                        <Calendar className="w-6 h-6 text-[#25A8A0]" />
                                    </div>
                                    Upcoming Sessions
                                </h2>
                                <Link to="/professional/schedule" className="text-sm font-black text-[#25A8A0] hover:underline uppercase tracking-widest">View Calendar</Link>
                            </div>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="py-10 flex justify-center"><div className="w-10 h-10 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div></div>
                                ) : upcomingSessions.length === 0 ? (
                                    <div className={`text-center py-16 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
                                        <Clock className={`w-14 h-14 mx-auto mb-4 opacity-20 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
                                        <p className="font-bold opacity-40">No sessions scheduled for today</p>
                                    </div>
                                ) : (
                                    upcomingSessions.map(session => (
                                        <div key={session.id} className={`flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl border transition-all hover:shadow-lg ${theme === 'dark' ? 'bg-[#0B1120] border-white/5 hover:border-teal-500/30' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-teal-200'}`}>
                                            <div className="flex items-center gap-5 w-full md:w-auto">
                                                <div className="relative">
                                                    <img src={`https://ui-avatars.com/api/?name=${session.client_name}&background=random`} alt={session.client_name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-white/10 shadow-lg" />
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 border-2 border-white dark:border-[#0B1120] rounded-full flex items-center justify-center">
                                                        <Video className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{session.client_name || 'Anonymous Client'}</h3>
                                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{session.notes || 'No notes provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8 w-full md:w-auto md:ml-auto justify-between md:justify-end">
                                                <div className="text-right">
                                                    <div className={`text-xl font-black tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{session.time}</div>
                                                    <div className={`text-xs font-bold uppercase tracking-tighter ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{session.date}</div>
                                                </div>
                                                <button
                                                    disabled={(() => {
                                                        const now = new Date().getTime();
                                                        const target = new Date(`${session.date}T${session.time}`).getTime();
                                                        const diff = target - now;
                                                        return diff > 600000;
                                                    })()}
                                                    onClick={() => navigate(`/live/${session.id}`)}
                                                    className="px-8 py-3 bg-gradient-to-r from-[#25A8A0] to-teal-600 text-white font-black rounded-2xl shadow-xl hover:shadow-[#25A8A0]/30 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                                >
                                                    JOIN SESSION
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className={`rounded-3xl p-8 shadow-xl border transition-all duration-300 ${theme === 'dark' ? 'bg-[#151C2C] border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className={`text-2xl font-black flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    <div className="p-2 bg-blue-500/10 rounded-xl">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                    Recent Clients
                                </h2>
                                <Link to="/clients" className="text-sm font-black text-blue-500 hover:underline uppercase tracking-widest">View All</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {recentClients.length === 0 ? (
                                    <div className={`col-span-2 text-center py-10 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                        <p className="font-bold opacity-30 italic">No connections established yet</p>
                                    </div>
                                ) : (
                                    recentClients.map(client => (
                                        <div key={client.id} className={`p-5 rounded-2xl border transition-all hover:border-blue-400 cursor-pointer ${theme === 'dark' ? 'bg-[#0B1120] border-white/5 hover:shadow-lg' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-lg'}`} onClick={() => navigate('/clients')}>
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-4">
                                                    <img src={`https://ui-avatars.com/api/?name=${client.name}&background=random`} className="w-12 h-12 rounded-2xl shadow-md border-2 border-white dark:border-white/10" alt="" />
                                                    <div>
                                                        <h4 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{client.name || 'Anonymous Client'}</h4>
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{client.lastActive}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full font-black uppercase tracking-tighter">Active</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-3">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className={`w-8 h-8 rounded-full border-2 ${theme === 'dark' ? 'border-[#151C2C] bg-slate-800' : 'border-white bg-slate-200'} flex items-center justify-center text-[10px] font-black`}>
                                                            {i}
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className="text-xs font-black text-blue-500 flex items-center gap-1.5 hover:underline uppercase tracking-widest">
                                                    Client File <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className={`rounded-3xl p-8 shadow-xl border transition-all duration-300 ${theme === 'dark' ? 'bg-[#151C2C] border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className={`text-2xl font-black flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    <div className="p-2 bg-orange-500/10 rounded-xl">
                                        <Bell className="w-6 h-6 text-orange-500" />
                                    </div>
                                    Requests
                                </h2>
                                <button
                                    onClick={() => fetchProfessionalData()}
                                    className={`p-2 rounded-xl transition-all ${loading ? 'animate-spin opacity-50' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                    title="Refresh requests"
                                    disabled={loading}
                                >
                                    <RefreshCw className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="space-y-5">
                                {connectionRequests.length === 0 ? (
                                    <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
                                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-10" />
                                        <p className="text-sm font-bold opacity-30">No pending requests</p>
                                    </div>
                                ) : (
                                    connectionRequests.map(request => (
                                        <div key={request.id} className={`p-5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0B1120] border-white/5 hover:border-orange-500/30 shadow-lg shadow-black/20' : 'bg-slate-50/50 border-slate-100 hover:border-orange-200'}`}>
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="relative">
                                                    <img src={`https://ui-avatars.com/api/?name=${request.client_name}&background=random`} alt={request.client_name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-white/10 shadow-lg" />
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white dark:border-[#0B1120] rounded-full shadow-sm"></span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-black text-base truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{request.client_name || 'Anonymous Client'}</h3>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{new Date(request.created_at).toLocaleDateString()} • NEW</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleConnectionUpdate(request.id, 'accepted')}
                                                    className="flex-1 py-3 bg-[#25A8A0] hover:bg-teal-600 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-teal-500/10 active:scale-95 uppercase tracking-widest"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleConnectionUpdate(request.id, 'rejected')}
                                                    className={`flex-1 py-3 border text-xs font-black rounded-xl transition-all uppercase tracking-widest ${theme === 'dark' ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
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
        </div >
    );
};

export default ProfessionalDashboard;
