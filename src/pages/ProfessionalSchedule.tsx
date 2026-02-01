import { API_BASE_URL } from "../config";
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

    const fetchSessions = async () => {
        if (!user) return;
        try {
            const response = await fetchWithAuth(API_BASE_URL + '/api/auth/appointments/');
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

    useEffect(() => {
        if (!isLoading) {
            fetchSessions();
        }
    }, [fetchWithAuth, user, isLoading]);

    const filteredSessions = sessions.filter(session => {
        if (activeTab === 'upcoming') return session.status === 'upcoming';
        return session.status === activeTab;
    });

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

    const handleCancel = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/appointments/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'cancelled' })
            });

            if (response.ok) {
                fetchSessions();
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Appointment Schedule</h1>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage your availability and track upcoming client engagements.
                        </p>
                    </div>
                </div>

                <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                    {(['upcoming', 'pending', 'completed', 'cancelled'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize whitespace-nowrap ${activeTab === tab
                                ? 'bg-[#25A8A0] text-white shadow-lg shadow-[#25A8A0]/20'
                                : theme === 'dark'
                                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                                }`}
                        >
                            {tab}
                            {tab === 'pending' && sessions.filter(s => s.status === 'pending').length > 0 && (
                                <span className={`ml-3 px-2 py-0.5 rounded-lg text-xs font-bold ${activeTab === tab ? 'bg-white text-[#25A8A0]' : 'bg-[#25A8A0] text-white'}`}>
                                    {sessions.filter(s => s.status === 'pending').length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className={`group relative p-6 rounded-2xl transition-all duration-300 border ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-700 hover:border-[#25A8A0]/50 hover:shadow-lg hover:shadow-[#25A8A0]/10'
                                    : 'bg-white border-gray-100 hover:border-[#25A8A0]/30 hover:shadow-xl hover:shadow-[#25A8A0]/5'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className={`flex-shrink-0 w-full md:w-24 h-24 rounded-xl flex flex-col items-center justify-center border ${theme === 'dark'
                                        ? 'bg-gray-900/50 border-gray-700'
                                        : 'bg-gray-50 border-gray-200'
                                        }`}>
                                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {new Date(session.date).getDate()}
                                        </span>
                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {new Date(`1970-01-01T${session.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>

                                    <div className="flex-1 flex items-center gap-4">
                                        <img
                                            src={session.client_image || `https://ui-avatars.com/api/?name=${session.client_name}&background=random`}
                                            alt={session.client_name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-[#25A8A0]/20 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">
                                                {session.client_name.split(' ').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                    {getTypeIcon(session.session_type || 'video')}
                                                    <span className="capitalize">
                                                        {session.session_type === 'audio' ? 'Voice Session' :
                                                            session.session_type === 'chat' ? 'Chat Session' :
                                                                'Video Session'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-4 w-full md:w-auto mt-4 md:mt-0">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(session.status)}`}>
                                            {session.status === 'upcoming' && <FaExclamationCircle className="w-4 h-4" />}
                                            {session.status === 'completed' && <FaCheckCircle className="w-4 h-4" />}
                                            {session.status === 'cancelled' && <FaTimesCircle className="w-4 h-4" />}
                                            {session.status === 'pending' && <FaClock className="w-4 h-4" />}
                                            <span className="capitalize">{session.status}</span>
                                        </span>

                                        {session.status === 'upcoming' && (() => {
                                            const appointmentDate = new Date(`${session.date}T${session.time}`);
                                            const now = new Date();
                                            const canJoin = now >= appointmentDate;

                                            return (
                                                <div className="flex gap-3 w-full md:w-auto">
                                                    <button
                                                        onClick={() => handleCancel(session.id)}
                                                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-medium transition-colors border ${theme === 'dark'
                                                            ? 'bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10'
                                                            : 'bg-transparent border-red-200 text-red-600 hover:bg-red-50'
                                                            }`}>
                                                        Cancel
                                                    </button>
                                                    {canJoin ? (
                                                        <button className="flex-1 md:flex-none px-6 py-2 bg-[#25A8A0] hover:bg-[#1e8a82] text-white rounded-xl font-medium shadow-lg shadow-[#25A8A0]/20 transition-all hover:scale-105 flex items-center gap-2">
                                                            <FaVideo /> Open Room
                                                        </button>
                                                    ) : (
                                                        <div className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                                            <FaClock /> Starts soon
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        {session.status === 'pending' && (
                                            <div className="flex gap-3 w-full md:w-auto">
                                                <button className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-medium transition-colors border ${theme === 'dark'
                                                    ? 'bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10'
                                                    : 'bg-transparent border-red-200 text-red-600 hover:bg-red-50'
                                                    }`}>
                                                    Deny
                                                </button>
                                                <button className="flex-1 md:flex-none px-6 py-2 bg-[#25A8A0] hover:bg-[#1e8a82] text-white rounded-xl font-medium shadow-lg shadow-[#25A8A0]/20 transition-all hover:scale-105 flex items-center gap-2">
                                                    <FaCheckCircle /> Accept
                                                </button>
                                            </div>
                                        )}

                                        {session.status === 'completed' && (
                                            <button className={`flex items-center gap-2 text-sm font-medium hover:underline ${theme === 'dark' ? 'text-[#25A8A0]' : 'text-[#25A8A0]'}`}>
                                                Professional Notes <FaChevronRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`text-center py-16 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <FaCalendarAlt className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No appointments found</h3>
                            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
