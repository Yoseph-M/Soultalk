import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaSearch,
    FaEllipsisH,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
    FaNotesMedical,
    FaFileAlt,
    FaHistory,
    FaChevronRight,
    FaUser,
} from 'react-icons/fa';
import AICompanion from '../components/AICompanion';
import { useTheme } from '../contexts/ThemeContext';
import ProfessionalHeader from './ProfessionalHeader';
import { useAuth } from '../contexts/AuthContext';

const Clients: React.FC = () => {
    const { theme } = useTheme();
    const { user, fetchWithAuth, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
            return;
        }
        if (user && user.type === 'client') {
            navigate('/dashboard');
        }
    }, [user, navigate, isLoading]);

    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        const fetchClients = async () => {
            if (!user) return;
            try {
                const response = await fetchWithAuth(API_BASE_URL + '/api/auth/clients/');
                if (response.ok) {
                    const data = await response.json();
                    const formattedClients = data.map((user: any) => ({
                        id: user.id,
                        name: `${user.first_name || ''} ${user.last_name || ''}`.trim().split(' ').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ') || user.username,
                        username: user.username,
                        avatar: `https://ui-avatars.com/api/?name=${user.username}&background=random`,
                        status: "Active",
                        nextSession: "Not scheduled",
                        lastSession: "N/A",
                        tags: [user.role.charAt(0).toUpperCase() + user.role.slice(1)],
                        progress: 0,
                        email: user.email,
                        phone: user.phone || "N/A",
                        notes: "No clinical notes yet.",
                        totalSessions: 0
                    }));
                    setClients(formattedClients);
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            } finally {
                setLoading(false);
            }
        };
        if (!isLoading) {
            fetchClients();
        }
    }, [fetchWithAuth, user, isLoading]);

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || client.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Paused': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Clients</h1>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage your client relationships and track progress
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-250px)]">
                    {/* Clients List Sidebar */}
                    <div className={`w-full lg:w-1/3 flex flex-col rounded-2xl border shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="relative">
                                <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${theme === 'dark'
                                        ? 'bg-gray-900 border-gray-700 focus:border-[#25A8A0] text-white placeholder-gray-500'
                                        : 'bg-gray-50 border-gray-200 focus:border-[#25A8A0] text-gray-900 placeholder-gray-400'
                                        }`}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {['All', 'Active', 'New', 'Paused'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === status
                                            ? 'bg-[#25A8A0] text-white'
                                            : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                                    <div className="w-8 h-8 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="font-medium">Loading clients...</p>
                                </div>
                            ) : filteredClients.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                                    <FaSearch className="w-8 h-8 mb-4 opacity-20" />
                                    <p className="font-medium">No clients found</p>
                                </div>
                            ) : (
                                filteredClients.map(client => (
                                    <div
                                        key={client.id}
                                        onClick={() => setSelectedClient(client)}
                                        className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedClient?.id === client.id
                                            ? theme === 'dark' ? 'bg-gray-700/50 border-l-4 border-l-[#25A8A0]' : 'bg-blue-50 border-l-4 border-l-[#25A8A0]'
                                            : 'border-transparent border-l-4 border-b-gray-100 dark:border-b-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{client.name}</h3>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(client.status)}`}>
                                                        {client.status}
                                                    </span>
                                                </div>
                                                <p className={`text-sm truncate mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{client.tags.join(', ')}</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    <span>Next: {client.nextSession}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Client Detail View */}
                    <div className={`flex-1 rounded-2xl border shadow-sm overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        {selectedClient ? (
                            <>
                                {/* Detail Header */}
                                <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <img src={selectedClient.avatar} alt={selectedClient.name} className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md" />
                                            <div>
                                                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedClient.name}</h2>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1"><FaEnvelope className="w-3 h-3" /> {selectedClient.email}</span>
                                                    <span className="flex items-center gap-1"><FaPhone className="w-3 h-3" /> {selectedClient.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className={`p-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                                                <FaEllipsisH />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Total Sessions</p>
                                            <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedClient.totalSessions}</p>
                                        </div>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Progress</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#25A8A0]" style={{ width: `${selectedClient.progress}%` }}></div>
                                                </div>
                                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedClient.progress}%</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Next Session</p>
                                            <p className="text-sm font-medium text-[#25A8A0] mt-1">{selectedClient.nextSession}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Tabs/Sections */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Notes Section */}
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                <FaNotesMedical className="text-[#25A8A0]" /> Clinical Notes
                                            </h3>
                                            <button className="text-sm text-[#25A8A0] font-medium hover:underline">+ Add Note</button>
                                        </div>
                                        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-700/30 border-gray-600' : 'bg-yellow-50 border-yellow-100'}`}>
                                            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {selectedClient.notes}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-3 text-right">Last updated: {selectedClient.lastSession}</p>
                                        </div>
                                    </section>

                                    {/* History Section */}
                                    <section>
                                        <h3 className={`text-lg font-bold flex items-center gap-2 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <FaHistory className="text-[#25A8A0]" /> Session History
                                        </h3>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((_, i) => (
                                                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                                                            <FaFileAlt className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Regular Check-in</p>
                                                            <p className="text-xs text-gray-500">Nov {28 - (i * 7)}, 2024 • 50 min</p>
                                                        </div>
                                                    </div>
                                                    <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                                                        <FaChevronRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Footer Actions */}
                                <div className={`p-4 border-t flex justify-end gap-3 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                                    <button className={`px-4 py-2 rounded-xl font-medium transition-colors ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                        Message
                                    </button>
                                    <button className="px-6 py-2 bg-[#25A8A0] text-white rounded-xl font-medium hover:bg-[#1e8a82] shadow-lg shadow-[#25A8A0]/20 transition-all">
                                        Book Session
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                    <FaUser className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                </div>
                                <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Select a Client</h2>
                                <p className={`max-w-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Choose a client from the list to view their profile, notes, and session history.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <AICompanion />
        </div>
    );
};

export default Clients;
