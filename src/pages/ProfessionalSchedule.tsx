import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaVideo,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaComments,
    FaChevronRight,
    FaFilter,
} from 'react-icons/fa';
import AICompanion from '../components/AICompanion';
import ProfessionalHeader from './ProfessionalHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const ProfessionalSchedule: React.FC = () => {
    const { theme } = useTheme();
    const { user, fetchWithAuth, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
            return;
        }
        if (user && user.type === 'client') {
            navigate('/schedule');
        }
    }, [user, navigate, isLoading]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'completed' | 'cancelled'>('upcoming');
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!user) return;
            try {
                const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/appointments/');
                if (response.ok) {
                    const data = await response.json();
                    setSessions(data);
                }
            } catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setLoading(false);
            }
        };
        if (!isLoading) {
            fetchSessions();
        }
    }, [fetchWithAuth, user, isLoading]);

    const filteredSessions = sessions.filter(session => session.status === activeTab);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'chat': return <FaComments className="w-4 h-4" />;
            case 'audio': return <FaClock className="w-4 h-4" />;
            default: return <FaVideo className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            case 'pending': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
            case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            case 'cancelled': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-[#0B1120] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className={`text-4xl font-black mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Appointment Schedule</h1>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                            Manage your availability and track upcoming client engagements.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className={`px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border flex items-center gap-3 transition-all shadow-sm ${theme === 'dark' ? 'bg-[#151C2C] border-white/5 text-white hover:bg-[#0B1120]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                            <FaFilter className="w-3 h-3" /> Filter Log
                        </button>
                    </div>
                </div>

                <div className="flex space-x-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    {(['upcoming', 'pending', 'completed', 'cancelled'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 capitalize whitespace-nowrap border ${activeTab === tab
                                ? 'bg-[#25A8A0] text-white border-[#25A8A0] shadow-xl shadow-[#25A8A0]/20 scale-105 z-10'
                                : theme === 'dark'
                                    ? 'bg-[#151C2C] text-gray-400 border-white/5 hover:border-white/10 hover:text-white'
                                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-900 shadow-sm'
                                }`}
                        >
                            {tab}
                            {tab === 'pending' && sessions.filter(s => s.status === 'pending').length > 0 && (
                                <span className={`ml-3 px-2 py-0.5 rounded-lg text-[8px] font-black ${activeTab === tab ? 'bg-white text-[#25A8A0]' : 'bg-[#25A8A0] text-white'}`}>
                                    {sessions.filter(s => s.status === 'pending').length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="space-y-6 mb-24">
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-14 h-14 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin shadow-lg"></div>
                        </div>
                    ) : filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className={`group relative p-8 rounded-[2.5rem] transition-all duration-500 border shadow-sm ${theme === 'dark'
                                    ? 'bg-[#151C2C] border-white/5 hover:border-[#25A8A0]/30 hover:shadow-2xl shadow-black/20'
                                    : 'bg-white border-slate-100 hover:border-teal-200 hover:shadow-2xl'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
                                    <div className={`flex-shrink-0 w-full md:w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-2 shadow-inner transition-transform group-hover:scale-105 ${theme === 'dark'
                                        ? 'bg-[#0B1120] border-white/5'
                                        : 'bg-slate-50 border-white shadow-slate-200/50'
                                        }`}>
                                        <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                                            {new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className={`text-4xl font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            {new Date(session.date).getDate()}
                                        </span>
                                        <span className={`text-[10px] font-black mt-2 bg-[#25A8A0]/10 px-3 py-1 rounded-full text-[#25A8A0]`}>
                                            {session.time.substring(0, 5)}
                                        </span>
                                    </div>

                                    <div className="flex-1 flex items-center gap-6">
                                        <div className="relative">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${session.client_name}&background=random`}
                                                alt={session.client_name}
                                                className="w-20 h-20 rounded-3xl object-cover border-4 border-white dark:border-white/5 shadow-xl"
                                            />
                                            <div className="absolute -top-2 -right-2 p-2 bg-emerald-500 rounded-2xl text-white shadow-lg">
                                                {getTypeIcon('video')}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                                {session.client_name.split(' ').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                                            </h3>
                                            <p className={`text-sm font-bold uppercase tracking-tighter mb-4 italic ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                                                Focus Area: Holistic Mental Wellness
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#0B1120] text-[#25A8A0]' : 'bg-slate-100 text-[#25A8A0]'}`}>
                                                    Secure Video
                                                </span>
                                                <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#0B1120] text-gray-400' : 'bg-slate-100 text-slate-500'}`}>
                                                    <FaClock className="w-3 h-3" />
                                                    50 Minutes
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-5 w-full md:w-auto mt-6 md:mt-0">
                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${getStatusColor(session.status)}`}>
                                            {session.status === 'upcoming' && <FaExclamationCircle className="w-3 h-3" />}
                                            {session.status === 'completed' && <FaCheckCircle className="w-3 h-3" />}
                                            {session.status === 'cancelled' && <FaTimesCircle className="w-3 h-3" />}
                                            {session.status === 'pending' && <FaClock className="w-3 h-3" />}
                                            {session.status}
                                        </span>

                                        {session.status === 'upcoming' && (
                                            <div className="flex gap-4 w-full md:w-auto">
                                                <button className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${theme === 'dark'
                                                    ? 'bg-[#0B1120] hover:bg-black text-white border border-white/5'
                                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-100'
                                                    }`}>
                                                    Change Time
                                                </button>
                                                <button className="flex-1 md:flex-none px-8 py-3 bg-[#25A8A0] hover:bg-[#1e8a82] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#25A8A0]/20 transition-all hover:scale-105 active:scale-95">
                                                    Open Room
                                                </button>
                                            </div>
                                        )}

                                        {session.status === 'pending' && (
                                            <div className="flex gap-4 w-full md:w-auto">
                                                <button className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all text-red-500 border border-red-500/10 ${theme === 'dark'
                                                    ? 'bg-red-500/5 hover:bg-red-500/10'
                                                    : 'bg-red-50 hover:bg-red-100'
                                                    }`}>
                                                    Deny
                                                </button>
                                                <button className="flex-1 md:flex-none px-8 py-3 bg-[#25A8A0] hover:bg-[#1e8a82] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#25A8A0]/20 transition-all hover:scale-105">
                                                    Accept
                                                </button>
                                            </div>
                                        )}

                                        {session.status === 'completed' && (
                                            <button className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest group px-6 py-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0B1120] hover:bg-black border-white/5 text-[#25A8A0]' : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-[#25A8A0]'}`}>
                                                Professional Notes <FaChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`text-center py-24 rounded-[3rem] border-4 border-dashed animate-fadeIn ${theme === 'dark' ? 'bg-[#151C2C]/50 border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl ${theme === 'dark' ? 'bg-[#0B1120] text-gray-800' : 'bg-slate-50 text-slate-200'}`}>
                                <FaCalendarAlt className="w-10 h-10" />
                            </div>
                            <h3 className={`text-2xl font-black mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>No appointments found</h3>
                            <p className={`text-sm font-medium max-w-sm mx-auto opacity-50 px-6`}>
                                Your {activeTab} schedule is currently empty. New requests will appear here in real-time.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <AICompanion />
        </div>
    );
};

export default ProfessionalSchedule;
