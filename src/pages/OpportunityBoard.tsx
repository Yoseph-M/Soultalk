import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ProfessionalHeader from './ProfessionalHeader';
import { API_BASE_URL } from '../config';
import {
    FaSearch, FaClock, FaCheckCircle,
    FaPaperPlane, FaTimes, FaBriefcase, FaExclamationCircle
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

const OpportunityBoard: React.FC = () => {
    const { user, fetchWithAuth } = useAuth();
    const { theme } = useTheme();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [proposalMessage, setProposalMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [activeTab, setActiveTab] = useState<'browse' | 'applied'>('browse');

    const categories = ['All', 'Anxiety', 'Depression', 'Relationship', 'Stress', 'Trauma', 'Grief', 'Career', 'Personal Growth'];

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

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        setSubmitting(true);

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/service-proposals/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request: selectedRequest.id,
                    message: proposalMessage
                })
            });
            if (response.ok) {
                setSelectedRequest(null);
                setProposalMessage('');
                fetchRequests();
                alert("Proposal submitted successfully!");
            } else {
                const err = await response.json();
                alert(err.detail || "Error submitting proposal");
            }
        } catch (error) {
            console.error("Error submitting proposal:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || req.category === categoryFilter;

        const hasApplied = req.proposals.some(p => String(p.professional) === String(user?.id));
        if (activeTab === 'applied') return hasApplied && matchesSearch && matchesCategory;
        return !hasApplied && matchesSearch && matchesCategory;
    });

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-[#0B1120] text-gray-100' : 'bg-[#F8FAFB] text-slate-900'}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl animate-fadeIn">
                <header className="mb-10">
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 rounded-[2.5rem] shadow-xl text-white bg-gradient-to-r from-[#25A8A0] to-[#1e8a82]`}>
                        <div>
                            <h1 className="text-4xl font-black mb-3">Opportunities Board</h1>
                            <p className="text-lg opacity-90 max-w-xl">
                                Connect with seekers looking for your expertise and offer your support.
                            </p>
                        </div>
                        <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-md">
                            <button
                                onClick={() => setActiveTab('browse')}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'browse' ? 'bg-white text-[#25A8A0] shadow-md' : 'text-white hover:bg-white/10'}`}
                            >
                                browse
                            </button>
                            <button
                                onClick={() => setActiveTab('applied')}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'applied' ? 'bg-white text-[#25A8A0] shadow-md' : 'text-white hover:bg-white/10'}`}
                            >
                                My Bids
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col gap-8">
                    <div className={`flex flex-col md:flex-row items-center gap-4 p-6 rounded-3xl ${theme === 'dark' ? 'bg-[#151C2C]' : 'bg-white shadow-sm'}`}>
                        <div className="flex-1 w-full relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#25A8A0]" />
                            <input
                                type="text"
                                placeholder="Search by topic..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${theme === 'dark'
                                    ? 'bg-[#0B1120] border-gray-700 focus:border-[#25A8A0]'
                                    : 'bg-gray-50 border-gray-100 focus:border-[#25A8A0]'
                                    }`}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${categoryFilter === cat
                                        ? 'bg-[#25A8A0] text-white'
                                        : theme === 'dark' ? 'bg-[#0B1120] hover:bg-white/5' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex items-center justify-center p-20">
                                <div className={`w-12 h-12 border-4 rounded-full animate-spin border-t-transparent border-[#25A8A0]`}></div>
                            </div>
                        ) : filteredRequests.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {filteredRequests.map(req => (
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
                                                        {req.status === 'open' ? 'Open' : 'In Progress'}
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
                                                {req.status === 'open' && (
                                                    <button
                                                        onClick={() => setSelectedRequest(req)}
                                                        className={`w-full px-8 py-4 rounded-2xl font-black transition-all shadow-lg hover:scale-105 ${req.proposals.some(p => String(p.professional) === String(user?.id))
                                                            ? 'bg-gray-100 text-gray-500 cursor-default'
                                                            : 'bg-[#25A8A0] text-white hover:bg-[#1e8a82]'
                                                            }`}
                                                    >
                                                        {req.proposals.some(p => String(p.professional) === String(user?.id)) ? 'Proposal Sent' : 'Send Proposal'}
                                                    </button>
                                                )}
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
                                <h3 className="text-3xl font-black mb-3">No {activeTab === 'applied' ? 'sent proposals' : 'available requests'} yet</h3>
                                <p className="text-xl opacity-60 max-w-md mx-auto">
                                    Check back later for new opportunities to help seekers.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Proposal Modal */}
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

                                <div className={`p-10 rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#0B1120]' : 'bg-gray-50'}`}>
                                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                        <FaPaperPlane className="text-[#25A8A0]" /> Send Proposal
                                    </h3>
                                    {selectedRequest.proposals.some(p => String(p.professional) === String(user?.id)) ? (
                                        <div className="p-8 rounded-3xl bg-[#25A8A0]/10 border-2 border-[#25A8A0]/20 text-[#25A8A0] text-center">
                                            <FaCheckCircle className="mx-auto text-4xl mb-4" />
                                            <p className="text-xl font-black">You have already applied!</p>
                                            <p className="font-medium opacity-80 mt-2">The seeker will review your profile and reach out if they're interested.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmitProposal} className="space-y-8">
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest mb-3 opacity-50">Support Message</label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    value={proposalMessage}
                                                    onChange={(e) => setProposalMessage(e.target.value)}
                                                    placeholder="Share how you can support this journey..."
                                                    className={`w-full px-6 py-5 rounded-[2rem] border-2 transition-all font-medium text-lg ${theme === 'dark' ? 'bg-[#151C2C] border-gray-700 focus:border-[#25A8A0]' : 'bg-white border-gray-100 focus:border-[#25A8A0]'}`}
                                                ></textarea>
                                            </div>
                                            <button
                                                disabled={submitting}
                                                type="submit"
                                                className="w-full bg-[#25A8A0] text-white font-black py-6 rounded-[2rem] shadow-2xl hover:bg-[#1e8a82] transition-all disabled:opacity-50 text-xl"
                                            >
                                                {submitting ? 'Sending...' : 'Deliver Proposal'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OpportunityBoard;
