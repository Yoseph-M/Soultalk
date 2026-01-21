import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DashboardHeader from './DashboardHeader';
import { API_BASE_URL } from '../config';
import {
    FaPlus, FaClock, FaCheckCircle,
    FaTimes, FaBriefcase, FaUserCircle, FaExclamationCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceRequest {
    id: number;
    client: number;
    client_name: string;
    category: string;
    title: string;
    description: string;
    preferred_session_type: string;
    budget: string;
    status: string;
    created_at: string;
    proposals_count: number;
    proposals: any[];
}

const ClientPost: React.FC = () => {
    const { fetchWithAuth } = useAuth();
    const { theme } = useTheme();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const categories = ['Anxiety', 'Depression', 'Relationship', 'Stress', 'Trauma', 'Grief', 'Career', 'Personal Growth'];

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/service-requests/`);
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description'),
            preferred_session_type: formData.get('type')
        };

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/service-requests/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                setShowCreateModal(false);
                fetchRequests();
            } else {
                let errorMsg = "";
                try {
                    const err = await response.json();
                    errorMsg = err.detail || "";
                    if (!errorMsg && typeof err === 'object') {
                        errorMsg = Object.entries(err)
                            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                            .join('\n');
                    }
                } catch (e) {
                    errorMsg = `Server error (${response.status}).`;
                }

                alert(errorMsg || "Error creating request.");
            }
        } catch (error) {
            console.error("Error creating request:", error);
            alert("Failed to connect to the server.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAcceptProposal = async (proposalId: number) => {
        if (!confirm("Are you sure you want to accept this professional?")) return;

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/service-proposals/${proposalId}/action/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'accept' })
            });
            if (response.ok) {
                fetchRequests();
                alert("Expert accepted! A connection has been created.");
            }
        } catch (error) {
            console.error("Error accepting proposal:", error);
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-[#0B1120] text-gray-100' : 'bg-[#F8FAFB] text-slate-900'}`}>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl animate-fadeIn">
                <header className="mb-10">
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 rounded-[2.5rem] shadow-xl text-white bg-gradient-to-r from-[#25A8A0] to-[#1e8a82]`}>
                        <div>
                            <h1 className="text-4xl font-black mb-3">My Care Requests</h1>
                            <p className="text-lg opacity-90 max-w-xl">
                                Track your requests and find the best care expert for your journey.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-3 bg-white text-[#25A8A0] px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
                        >
                            <FaPlus /> New Care Request
                        </button>
                    </div>
                </header>

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className={`w-12 h-12 border-4 rounded-full animate-spin border-t-transparent border-[#25A8A0]`}></div>
                        </div>
                    ) : requests.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {requests.map(req => (
                                <motion.div
                                    layout
                                    key={req.id}
                                    className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-xl group ${theme === 'dark' ? 'bg-[#151C2C] border-gray-800' : 'bg-white border-gray-100 hover:border-[#25A8A0]/20'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#25A8A0]/10 text-[#25A8A0]`}>
                                                    {req.category}
                                                </span>
                                                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'open' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                                    {req.status === 'open' ? 'Finding Experts' : 'In Progress'}
                                                </span>
                                            </div>
                                            <h3 className={`text-2xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{req.title}</h3>
                                            <p className={`line-clamp-2 text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                                                {req.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-8">
                                                <div className="flex items-center gap-2.5 text-sm font-bold opacity-60">
                                                    <FaClock className="text-[#25A8A0]" />
                                                    <span>{new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm font-black">
                                                    <FaBriefcase className="text-[#25A8A0]" />
                                                    <span className="text-[#25A8A0]">
                                                        {req.proposals_count} {req.proposals_count === 1 ? 'Proposal' : 'Proposals'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col justify-end gap-3 min-w-[200px]">
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="w-full px-8 py-4 rounded-2xl font-black bg-[#F0FDF4] text-[#25A8A0] border-2 border-[#25A8A0]/10 hover:bg-[#25A8A0] hover:text-white transition-all shadow-sm"
                                            >
                                                Review Experts
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-700/20">
                            <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 bg-[#25A8A0]/10`}>
                                <FaBriefcase className={`text-5xl opacity-20 text-[#25A8A0]`} />
                            </div>
                            <h3 className="text-3xl font-black mb-3">No care requests yet</h3>
                            <p className="text-xl opacity-60 max-w-md mx-auto">
                                Start your journey by posting what you're looking for support with.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Create Request Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={`relative w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#151C2C]' : 'bg-white'
                                }`}
                        >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-10 right-10 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <FaTimes />
                            </button>
                            <h2 className="text-4xl font-black mb-10">Post Care Request</h2>
                            <form onSubmit={handleCreateRequest} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest mb-3 opacity-50">Title</label>
                                        <input required name="title" type="text" placeholder="Help needed with..." className={`w-full px-6 py-4 rounded-2xl border-2 transition-all font-bold ${theme === 'dark' ? 'bg-[#0B1120] border-gray-700 focus:border-[#25A8A0]' : 'bg-gray-50 border-gray-100 focus:border-[#25A8A0]'}`} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest mb-3 opacity-50">Category</label>
                                        <select name="category" className={`w-full px-6 py-4 rounded-2xl border-2 transition-all font-bold ${theme === 'dark' ? 'bg-[#0B1120] border-gray-700 focus:border-[#25A8A0]' : 'bg-gray-50 border-gray-100 focus:border-[#25A8A0]'}`}>
                                            {categories.map(cat => <option key={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-3 opacity-50">Session Type</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['video', 'audio', 'chat'].map(t => (
                                            <label key={t} className="relative cursor-pointer">
                                                <input type="radio" name="type" value={t} defaultChecked={t === 'video'} className="peer sr-only" />
                                                <div className={`p-4 text-center rounded-2xl border-2 font-bold capitalize transition-all peer-checked:bg-[#25A8A0] peer-checked:text-white peer-checked:border-[#25A8A0] ${theme === 'dark' ? 'bg-[#0B1120] border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                                    {t}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-3 opacity-50">Details</label>
                                    <textarea required name="description" rows={6} placeholder="Describe your current situation..." className={`w-full px-6 py-4 rounded-2xl border-2 transition-all font-medium ${theme === 'dark' ? 'bg-[#0B1120] border-gray-700 focus:border-[#25A8A0]' : 'bg-gray-50 border-gray-100 focus:border-[#25A8A0]'}`}></textarea>
                                </div>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full bg-[#25A8A0] text-white font-black py-6 rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-xl"
                                >
                                    {submitting ? 'Posting...' : 'Launch Request'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={`relative w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#151C2C]' : 'bg-white'
                                }`}
                        >
                            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar p-12">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="absolute top-10 right-10 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <FaTimes />
                                </button>

                                <div className="mb-12">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block bg-[#25A8A0]/10 text-[#25A8A0]`}>
                                        {selectedRequest.category}
                                    </span>
                                    <h2 className="text-4xl font-black mb-6">{selectedRequest.title}</h2>
                                    <p className={`text-xl leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                                        {selectedRequest.description}
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-2xl font-black border-b pb-6 dark:border-gray-800">Interested Experts ({selectedRequest.proposals.length})</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        {selectedRequest.proposals.map(prop => (
                                            <div key={prop.id} className={`p-8 rounded-[2.5rem] border-2 ${theme === 'dark' ? 'bg-[#0B1120] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                                                <div className="flex items-center gap-5 mb-6">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 shadow-md">
                                                        {prop.professional_image ? (
                                                            <img src={prop.professional_image.startsWith('http') ? prop.professional_image : `${API_BASE_URL}${prop.professional_image}`} className="w-full h-full object-cover" />
                                                        ) : <FaUserCircle className="w-full h-full text-gray-400" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black">{prop.professional_name}</h4>
                                                        <p className="font-bold text-[#25A8A0] uppercase text-xs tracking-widest">{prop.professional_specialization}</p>
                                                    </div>
                                                </div>
                                                <p className={`text-lg mb-8 pb-8 border-b italic leading-relaxed ${theme === 'dark' ? 'text-gray-400 border-gray-800' : 'text-slate-600 border-gray-200'}`}>
                                                    "{prop.message}"
                                                </p>
                                                {prop.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleAcceptProposal(prop.id)}
                                                        className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-[1.5rem] bg-[#25A8A0] text-white font-black hover:bg-[#1e8a82] transition-all shadow-xl shadow-teal-500/10"
                                                    >
                                                        <FaCheckCircle className="text-xl" /> Accept Expert
                                                    </button>
                                                )}
                                                {prop.status === 'accepted' && (
                                                    <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-green-500/10 text-green-500 font-black">
                                                        <FaCheckCircle className="text-xl" /> Expert Accepted
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {selectedRequest.proposals.length === 0 && (
                                            <div className="text-center py-16 opacity-40">
                                                <FaExclamationCircle className="mx-auto mb-4 text-4xl" />
                                                <p className="text-xl font-bold">Waiting for experts to reach out...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientPost;
