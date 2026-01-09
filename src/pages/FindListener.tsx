import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, ShieldCheck, ChevronRight, Filter, CheckCircle2 } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

type Listener = {
    id: string;
    name: string;
    initials: string;
    title: string;
    rating: number;
    reviewCount: number;
    specializations: string[];
    languages: string[];
    sessionsCompleted: number;
    isOnline: boolean;
    bio: string;
    image?: string;
    location: string;
    verified: boolean;
    topRated: boolean;
    badges: string[];
};

const allSpecializations = [
    'Anxiety', 'Depression', 'PTSD', 'Trauma', 'Stress Management',
    'Relationships', 'Career', 'Self-esteem', 'Grief', 'Mindfulness',
];

const FindListener: React.FC = () => {
    const { user, fetchWithAuth, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
            return;
        }
        if (user && (user.type === 'professional' || user.type === 'listener')) {
            navigate('/professionals');
        }
    }, [user, navigate, isLoading]);
    const { globalSearch } = useSearch();
    const [listeners, setListeners] = useState<Listener[]>([]);
    const [loading, setLoading] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('all');
    const [onlineFilter] = useState(false);
    const [sortBy, setSortBy] = useState<'rating'>('rating');
    const [selectedListener, setSelectedListener] = useState<Listener | null>(null);
    const [userConnections, setUserConnections] = useState<any[]>([]);

    const getImageUrl = (path: string | null, name: string) => {
        if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    };


    useEffect(() => {
        const fetchProfessionals = async () => {
            if (!user) return;
            try {
                const response = await fetchWithAuth(API_BASE_URL + '/api/auth/professionals/');
                if (response.ok) {
                    const data = await response.json();
                    const formatted: Listener[] = data.map((user: any) => ({
                        id: user.id.toString(),
                        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
                        initials: (user.first_name?.[0] || user.username[0]).toUpperCase(),
                        title: 'Mental Wellness Expert',
                        rating: user.rating || 5.0,
                        reviewCount: user.review_count || 0,
                        specializations: user.specialization ? [user.specialization] : ['Wellness Support'],
                        languages: user.languages || ['English'],
                        sessionsCompleted: user.sessions_completed || 0,
                        isOnline: user.is_online || false,
                        bio: user.bio || `Dedicated to helping individuals find balance and inner peace through compassionate listening and evidence-based support.`,
                        image: getImageUrl(user.profile_photo, `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username),
                        location: user.location || 'Global',
                        verified: user.verified || false,
                        topRated: (user.rating || 0) >= 4.8,
                        badges: user.verified ? ['Verified', 'Highly Responsive'] : ['New Listener']
                    }));
                    setListeners(formatted);
                }
            } catch (error) {
                console.error("Error fetching listeners:", error);
            } finally {
                setLoading(false);
            }
        };
        if (!isLoading) {
            fetchProfessionals();
            fetchConnections();
        }
    }, [fetchWithAuth, user, isLoading]);

    const fetchConnections = async () => {
        if (!user) return;
        try {
            const response = await fetchWithAuth(API_BASE_URL + '/api/auth/connections/');
            if (response.ok) {
                const data = await response.json();
                setUserConnections(data);
            }
        } catch (error) {
            console.error("Error fetching connections:", error);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(globalSearch.trim().toLowerCase()), 300);
        return () => clearTimeout(timer);
    }, [globalSearch]);

    const filteredListeners = listeners.filter(listener => {
        const matchesSearch = listener.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            listener.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            listener.specializations.some(s => s.toLowerCase().includes(debouncedSearch.toLowerCase()));

        const matchesSpecialization = specializationFilter === 'all' ||
            listener.specializations.some(s => s.toLowerCase() === specializationFilter.toLowerCase());

        const matchesOnline = !onlineFilter || listener.isOnline;

        return matchesSearch && matchesSpecialization && matchesOnline;
    });

    const sortedListeners = [...filteredListeners].sort((a, b) => {
        return b.rating - a.rating;
    });

    const { theme } = useTheme();

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <DashboardHeader />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Back Link */}
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                {/* Hero Section Card */}
                <div className="bg-[#25A8A0] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Find Your Perfect Support</h1>
                        <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto text-center leading-relaxed">
                            Connect with compassionate experts ready to support your mental wellness journey.
                            Select a professional below for quick comparison and action.
                        </p>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 border-t border-white/10 pt-8 mt-2 justify-end">
                            <div className="flex items-center gap-3">
                                <Filter className="w-5 h-5 text-white/80" />
                                <span className="text-sm font-semibold text-white/60">Refine by:</span>
                            </div>
                            <div className="flex flex-wrap gap-4 items-center">

                                <select
                                    value={specializationFilter}
                                    onChange={e => setSpecializationFilter(e.target.value)}
                                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-white/30 outline-none transition-all hover:bg-white/20 text-white cursor-pointer"
                                >
                                    <option value="all" className="bg-[#25A8A0]">All Expertises</option>
                                    {allSpecializations.map(s => (
                                        <option key={s} value={s.toLowerCase()} className="bg-[#25A8A0]">{s}</option>
                                    ))}
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value as any)}
                                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-white/30 outline-none transition-all hover:bg-white/20 text-white cursor-pointer"
                                >
                                    <option value="rating" className="bg-[#25A8A0]">Highly Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100 shadow-sm"></div>
                        ))
                    ) : sortedListeners.map((listener) => (
                        <article
                            key={listener.id}
                            className={`group flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:shadow-teal-500/10 hover:border-teal-500/50' : 'bg-white border-gray-100/50 hover:shadow-teal-200/40 hover:border-teal-100'}`}
                        >
                            <div className="p-4">
                                <div className="relative h-64 overflow-hidden rounded-[2rem]">
                                    <img src={listener.image} alt={listener.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-bold text-gray-800">{listener.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="flex items-center gap-3 text-white text-xs font-medium">
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Fast Response</span>
                                            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="mb-4">
                                    <p className="text-teal-500 text-xs font-black uppercase tracking-[0.2em] mb-1">{listener.title}</p>
                                    <h3 className={`text-2xl font-bold group-hover:text-teal-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {listener.name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                                    </h3>
                                </div>

                                <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {listener.bio}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {listener.specializations.slice(0, 3).map(s => (
                                        <span key={s} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border uppercase tracking-wider ${theme === 'dark' ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    {(() => {
                                        const conn = userConnections.find(c => c.professional.toString() === listener.id);
                                        if (conn) {
                                            if (conn.status === 'pending') {
                                                return (
                                                    <button disabled className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Request Sent</span>
                                                    </button>
                                                );
                                            } else if (conn.status === 'accepted') {
                                                return (
                                                    <Link
                                                        to="/booking"
                                                        className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-[#25A8A0] text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Book Session</span>
                                                    </Link>
                                                );
                                            } else {
                                                // Rejected or other status - Allow re-sending request
                                                return (
                                                    <div className="flex-1 flex flex-col gap-2">
                                                        <div className="text-center text-xs text-red-400 font-bold mb-1">Request Rejected</div>
                                                        <button
                                                            onClick={async () => {
                                                                if (user) {
                                                                    try {
                                                                        // Use PATCH to update existing connection status
                                                                        const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/connections/${conn.id}/`, {
                                                                            method: 'PATCH',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({
                                                                                status: 'pending'
                                                                            })
                                                                        });

                                                                        if (response.ok) {
                                                                            fetchConnections();
                                                                            alert(`Request sent to ${listener.name}.`);
                                                                        } else {
                                                                            // Fallback to checking payload if not 200, but PATCH usually returns 200
                                                                            const err = await response.json().catch(() => ({ detail: "Failed to update connection" }));
                                                                            alert(`Error: ${JSON.stringify(err)}`);
                                                                        }
                                                                    } catch (error) {
                                                                        console.error("Error sending request:", error);
                                                                        alert("Failed to send request. please try again.");
                                                                    }
                                                                } else {
                                                                    navigate('/auth');
                                                                }
                                                            }}
                                                            className="w-full py-4 bg-[#25A8A0] text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 flex items-center justify-center gap-2"
                                                        >
                                                            <span>Send Request Again</span>
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        }

                                        return (
                                            <button
                                                onClick={async () => {
                                                    if (user) {
                                                        try {
                                                            const response = await fetchWithAuth(API_BASE_URL + '/api/auth/connections/', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    professional: listener.id,
                                                                    status: 'pending'
                                                                })
                                                            });
                                                            if (response.ok) {
                                                                fetchConnections();
                                                                alert(`Request sent to ${listener.name}. You will be notified upon approval.`);
                                                            } else {
                                                                const err = await response.json();
                                                                alert(`Error: ${JSON.stringify(err)}`);
                                                            }
                                                        } catch (error) {
                                                            console.error("Error sending request:", error);
                                                            alert("Failed to send request. please try again.");
                                                        }
                                                    } else {
                                                        navigate('/auth');
                                                    }
                                                }}
                                                className="flex-1 py-4 bg-[#25A8A0] text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 flex items-center justify-center gap-2"
                                            >
                                                <span>Send Request</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>


                {sortedListeners.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">No listeners found matching your criteria</h3>
                        <p className="text-gray-500 mt-2">Try clearing filters or searching for something else.</p>
                    </div>
                )}
            </div>

            {/* Listener Detail Modal */}
            {
                selectedListener && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedListener(null)}>
                        <div className={`w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                            <div className="p-8">
                                <div className="flex items-center gap-6 mb-8">
                                    <img src={selectedListener.image} className="w-24 h-24 rounded-2xl shadow-xl object-cover" alt="" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedListener.name}</h2>
                                        <p className="text-[#25A8A0] font-bold uppercase tracking-widest text-sm">{selectedListener.title}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1 text-yellow-500"><Star className="fill-yellow-500 w-4 h-4" /> <span className="text-sm font-bold text-gray-800">{selectedListener.rating.toFixed(1)}</span></div>
                                            <div className="text-xs text-gray-400 font-medium font-bold">{selectedListener.reviewCount} reviews</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">About Me</h4>
                                        <p className="text-gray-600 leading-relaxed">{selectedListener.bio}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-2xl`}>
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</h4>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedListener.isOnline ? 'Active Now' : 'Offline'}</p>
                                        </div>
                                        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-2xl`}>
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Sessions</h4>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedListener.sessionsCompleted}+ Conversations</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Specializations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedListener.specializations.map(s => (
                                                <span key={s} className="px-3 py-1.5 bg-[#25A8A0]/5 text-[#25A8A0] rounded-lg text-sm font-bold">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button onClick={() => setSelectedListener(null)} className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50">Close</button>
                                        <Link to="/booking" className="flex-[2] text-center py-4 bg-[#25A8A0] text-white font-bold rounded-2xl shadow-lg hover:shadow-[#25A8A0]/30 transition-all">Book Initial Call</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default FindListener;
