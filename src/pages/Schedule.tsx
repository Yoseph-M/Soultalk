import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaVideo,
    FaClock,
    FaComments,
    FaChevronRight,
    FaExclamationCircle,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';
import DashboardHeader from './DashboardHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Schedule: React.FC = () => {
    const { theme } = useTheme();
    const { user, fetchWithAuth, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
            return;
        }
        if (user && (user.type === 'professional' || user.type === 'listener')) {
            navigate('/professional/schedule');
        }
    }, [user, navigate, isLoading]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        if (!user) return;
        try {
            const response = await fetchWithAuth(API_BASE_URL + '/api/auth/appointments/');
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            fetchAppointments();
        }
    }, [fetchWithAuth, user, isLoading]);

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
                fetchAppointments();
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
        }
    };

    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'upcoming') return app.status === 'upcoming' || app.status === 'pending';
        return app.status === activeTab;
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
            case 'upcoming':
            case 'pending': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            case 'cancelled': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Back Link */}
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage your sessions and upcoming appointments
                        </p>
                    </div>
                    <Link
                        to="/booking"
                        className="px-6 py-3 bg-gradient-to-r from-[#25A8A0] to-[#1e8a82] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <FaCalendarAlt />
                        Book New Session
                    </Link>
                </div>

                <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                    {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize whitespace-nowrap ${activeTab === tab
                                ? 'bg-[#25A8A0] text-white shadow-lg shadow-[#25A8A0]/20'
                                : theme === 'dark'
                                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
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
                                            {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {new Date(appointment.date).getDate()}
                                        </span>
                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {new Date(`1970-01-01T${appointment.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>

                                    <div className="flex-1 flex items-center gap-4">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${appointment.professional_name}&background=random`}
                                            alt={appointment.professional_name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-[#25A8A0]/20"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">
                                                {appointment.professional_name.split(' ').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                                            </h3>
                                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Mental Wellness Expert
                                            </p>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                    {getTypeIcon(appointment.session_type || 'video')}
                                                    <span className="capitalize">
                                                        {appointment.session_type === 'audio' ? 'Voice Session' :
                                                            appointment.session_type === 'chat' ? 'Chat Session' :
                                                                'Video Session'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-4 w-full md:w-auto mt-4 md:mt-0">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(appointment.status)}`}>
                                            {appointment.status === 'upcoming' && <FaExclamationCircle className="w-4 h-4" />}
                                            {appointment.status === 'completed' && <FaCheckCircle className="w-4 h-4" />}
                                            {appointment.status === 'cancelled' && <FaTimesCircle className="w-4 h-4" />}
                                            <span className="capitalize">{appointment.status}</span>
                                        </span>

                                        {appointment.status === 'upcoming' && (() => {
                                            const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
                                            const now = new Date();
                                            const canJoin = now >= appointmentDate;

                                            // Optional: Allow joining 5 minutes early
                                            // const fiveMinBefore = new Date(appointmentDate.getTime() - 5 * 60000);
                                            // const canJoin = now >= fiveMinBefore;

                                            return (
                                                <div className="flex gap-3 w-full md:w-auto">
                                                    <button
                                                        onClick={() => handleCancel(appointment.id)}
                                                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-medium transition-colors border ${theme === 'dark'
                                                            ? 'bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10'
                                                            : 'bg-transparent border-red-200 text-red-600 hover:bg-red-50'
                                                            }`}>
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={!canJoin}
                                                        className={`flex-1 md:flex-none px-6 py-2 rounded-xl font-medium shadow-lg transition-all hover:scale-105 flex items-center gap-2 ${canJoin
                                                            ? 'bg-[#25A8A0] hover:bg-[#1e8a82] text-white shadow-[#25A8A0]/20'
                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                                            }`}
                                                    >
                                                        {canJoin ? <><FaVideo /> Join Session</> : <><FaClock /> Starts soon</>}
                                                    </button>
                                                </div>
                                            )
                                        })()}

                                        {appointment.status === 'completed' && (
                                            <button className={`flex items-center gap-2 text-sm font-medium hover:underline ${theme === 'dark' ? 'text-[#25A8A0]' : 'text-[#25A8A0]'}`}>
                                                View Summary <FaChevronRight className="w-3 h-3" />
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
                                You don't have any {activeTab} appointments scheduled.
                            </p>
                            {activeTab === 'upcoming' && (
                                <Link
                                    to="/booking"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25A8A0] text-white rounded-xl font-semibold hover:bg-[#1e8a82] transition-colors"
                                >
                                    Book a Session
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Schedule;
