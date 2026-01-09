import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Star, MessageCircle, Phone, Video, Activity, Clock, ShieldCheck } from 'lucide-react';

type Professional = {
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

const InstantSupport: React.FC = () => {
    const { user, fetchWithAuth, isLoading } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
            return;
        }
    }, [user, navigate, isLoading]);

    const { globalSearch } = useSearch();
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const fetchOnlineProfessionals = async () => {
            if (!user) return;
            try {
                const getImageUrl = (path: string | null, name: string) => {
                    if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
                    if (path.startsWith('http')) return path;
                    return `http://127.0.0.1:8000${path}`;
                };


                // Fetch all professionals (in a real app, optimize this to only fetch online)
                const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/professionals/');
                if (response.ok) {
                    const data = await response.json();
                    const formatted: Professional[] = data.map((user: any) => ({
                        id: user.id.toString(),
                        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
                        initials: (user.first_name?.[0] || user.username[0]).toUpperCase(),
                        title: 'Mental Wellness Expert',
                        rating: user.rating || 5.0,
                        reviewCount: user.review_count || 0,
                        specializations: user.specialization ? [user.specialization] : ['Wellness Support'],
                        languages: user.languages || ['English'],
                        sessionsCompleted: user.sessions_completed || 0,
                        isOnline: user.is_online || false, // Ensure this maps correctly
                        bio: user.bio || `Dedicated to helping individuals find balance.`,
                        image: getImageUrl(user.profile_photo, `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username),
                        location: user.location || 'Global',
                        verified: user.verified || false,
                        topRated: (user.rating || 0) >= 4.8,
                        badges: user.verified ? ['Verified'] : []
                    }));

                    // Filter mainly for online status (mock or real)
                    // For demo purposes if api active status isn't reliable, we might want to mock some as online, 
                    // but the instruction says "collect online professionals".
                    // I'll trust the checked `isOnline`.
                    setProfessionals(formatted.filter(p => p.isOnline));
                }
            } catch (error) {
                console.error("Error fetching professionals:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!isLoading) {
            fetchOnlineProfessionals();
        }
    }, [fetchWithAuth, user, isLoading]);

    const handleConnect = async (type: 'chat' | 'voice' | 'video', professionalId: string) => {
        if (!user) return;
        const sessionId = `conn-${professionalId}-${user.id}-${Date.now()}`; // Unique session

        try {
            await fetchWithAuth('http://127.0.0.1:8000/api/auth/live/initiate/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    professional_id: professionalId,
                    type: type,
                    session_id: sessionId
                })
            });
        } catch (err) {
            console.error("Failed to initiate live session:", err);
        }

        if (type === 'chat') {
            navigate(`/chat/${sessionId}`);
        } else {
            navigate(`/live/${sessionId}?mode=${type}`);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(globalSearch.trim().toLowerCase()), 300);
        return () => clearTimeout(timer);
    }, [globalSearch]);

    const filtered = professionals.filter(p =>
        p.name.toLowerCase().includes(debouncedSearch) ||
        p.title.toLowerCase().includes(debouncedSearch) ||
        p.specializations.some(s => s.toLowerCase().includes(debouncedSearch))
    );

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <DashboardHeader />
            <div className="container mx-auto px-4 py-8 max-w-7xl">

                {/* Back Link */}
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 text-center">
                        <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Instant Support</h1>
                        <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                            Connect immediately with our available wellness experts. No scheduling required—start a chat, voice, or video session right now.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Activity className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No professionals online</h3>
                        <p className="text-gray-500 max-w-md mx-auto">None of our professionals are currently marked as 'Online'. Please try booking a scheduled session instead.</p>
                        <button onClick={() => navigate('/booking')} className="mt-8 px-8 py-3 bg-[#25A8A0] text-white font-bold rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all">
                            Book a Session
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(p => (
                            <article key={p.id} className={`group flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:shadow-teal-500/10 hover:border-teal-500/50' : 'bg-white border-gray-100/50 hover:shadow-teal-200/40 hover:border-teal-100'}`}>
                                <div className="p-4">
                                    <div className="relative h-64 overflow-hidden rounded-[2rem]">
                                        <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1.5">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-bold text-gray-800">{p.rating.toFixed(1)}</span>
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
                                        <p className="text-teal-500 text-xs font-black uppercase tracking-[0.2em] mb-1">{p.title}</p>
                                        <h3 className={`text-2xl font-bold group-hover:text-teal-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {p.name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                                        </h3>
                                    </div>

                                    <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{p.bio}</p>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {p.specializations.slice(0, 3).map(s => (
                                            <span key={s} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border uppercase tracking-wider ${theme === 'dark' ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => handleConnect('chat', p.id)}
                                            className="py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            Chat
                                        </button>
                                        <button
                                            onClick={() => handleConnect('voice', p.id)}
                                            className="py-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
                                        >
                                            <Phone className="w-5 h-5" />
                                            Voice
                                        </button>
                                        <button
                                            onClick={() => handleConnect('video', p.id)}
                                            className="py-3 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
                                        >
                                            <Video className="w-5 h-5" />
                                            Video
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstantSupport;
