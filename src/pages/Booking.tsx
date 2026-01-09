import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Video, MessageCircle, Phone, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Calendar, Check, Filter, Star, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import { useTheme } from '../contexts/ThemeContext';

type Professional = {
  id: string;
  initials: string;
  name: string;
  title: string;
  rating: number;
  specializations: string[];
  image?: string;
  description?: string;
};

const sessionTypes = [
  { id: 'Chat', name: 'Chat Session', description: 'Text-based session', price: 30, icon: MessageCircle, color: 'border-[#25A8A0] bg-[#25A8A0]/5' },
  { id: 'Phone', name: 'Voice Session', description: 'Voice-only session', price: 80, icon: Phone, color: 'border-gray-200 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5' },
  { id: 'Video', name: 'Video Session', description: 'Face-to-face session', price: 50, icon: Video, color: 'border-gray-200 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5' },
];

const Booking: React.FC = () => {
  const { theme } = useTheme();
  const { user, fetchWithAuth, isLoading } = useAuth();
  const { globalSearch } = useSearch();
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
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [view] = useState<'list' | 'booking'>('list');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [userConnections, setUserConnections] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');
  const [visibleCount] = useState(9);

  const [selectedSessionType, setSelectedSessionType] = useState('Video');
  // selectedDuration removed from UI, defaulting to 50 internally if needed for logic, or just unused.
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState(4); // Hours (0-23)
  const [selectedMinute, setSelectedMinute] = useState(0); // Minutes (0, 15, 30, 45) inPlaceBooking
  const [inPlaceBooking, setInPlaceBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const overlayWrapperRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inPlaceBooking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [inPlaceBooking]);

  const [hourInput, setHourInput] = useState<number>(12);
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('PM');
  const [liveMessage, setLiveMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const getImageUrl = (path: string | null, name: string) => {
      if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
      if (path.startsWith('http')) return path;
      return `http://127.0.0.1:8000${path}`;
    };


    const fetchProfessionals = async () => {
      if (!user) return;
      try {
        const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/professionals/');
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map((p: any) => ({
            id: p.id.toString(),
            initials: (p.first_name?.[0] || p.username[0]).toUpperCase(),
            name: `${p.first_name || ''} ${p.last_name || ''} `.trim() || p.username,
            title: 'Mental Wellness Expert',
            rating: p.rating || 5.0,
            specializations: p.specialization ? [p.specialization] : ['Wellness Support'],
            image: getImageUrl(p.profile_photo, p.username),
            description: p.bio || 'Professional wellness expert specializing in compassionate care and mental health support.'
          }));
          setProfessionals(formatted);
        }
      } catch (error) {
        console.error("Error fetching professionals:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchConnections = async () => {
      if (!user) return;
      try {
        const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/connections/');
        if (response.ok) {
          const data = await response.json();
          setUserConnections(data);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        // loading state handled elsewhere or not needed for background sync
      }
    };

    if (!isLoading) {
      fetchProfessionals();
      fetchConnections();
    }
  }, [fetchWithAuth, user, isLoading]);

  const hour12To24 = (h12: number, period: 'AM' | 'PM') => {
    let h = Number(h12) || 0;
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h;
  };

  useEffect(() => {
    if (selectedTime != null) {
      const hh = selectedTime % 12 === 0 ? 12 : selectedTime % 12;
      setHourInput(hh);
      setAmPm(selectedTime >= 12 ? 'PM' : 'AM');
    }
  }, [selectedTime]);

  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const formatSelectedDate = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const timeSlots = Array.from({ length: 24 }).map((_, h) => {
    const d = new Date(); d.setHours(h, 0, 0, 0); return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  });

  const tryApplyCandidate = (h12?: number, period?: 'AM' | 'PM') => {
    const hh = h12 ?? hourInput;
    const p = period ?? amPm;
    const candidate = hour12To24(hh, p);
    const nowLocal = new Date();
    const slot = new Date(selectedDate); slot.setHours(candidate, 0, 0, 0);
    if (isSameDay(slot, nowLocal) && candidate < nowLocal.getHours()) {
      return false;
    }
    setHourInput(hh);
    setAmPm(p);
    setSelectedTime(candidate);
    setLiveMessage(`Selected ${hh} ${p} on ${formatSelectedDate(selectedDate)}`);
    return true;
  };

  const incrementHour = () => setHourInput(h => {
    const nv = (h >= 12 ? 1 : h + 1);
    tryApplyCandidate(nv);
    return nv;
  });

  const decrementHour = () => setHourInput(h => {
    const nv = (h <= 1 ? 12 : h - 1);
    tryApplyCandidate(nv);
    return nv;
  });

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Element | null;
      const insideDropdown = target && target.closest && target.closest('[data-dropdown]');
      if ((yearDropdownOpen || monthDropdownOpen) && !insideDropdown) {
        setYearDropdownOpen(false);
        setMonthDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setYearDropdownOpen(false);
        setMonthDropdownOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [yearDropdownOpen, monthDropdownOpen]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(globalSearch.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [globalSearch]);

  const filtered = professionals.filter((p) => {
    // Only show professionals that have an 'accepted' connection status
    const conn = userConnections.find(c => c.professional.toString() === p.id);
    if (!conn || conn.status !== 'accepted') return false;

    if (specializationFilter !== 'all' && !p.specializations.map(s => s.toLowerCase()).includes(specializationFilter)) return false;
    if (!debouncedSearch) return true;
    const q = debouncedSearch;
    return p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.specializations.join(' ').toLowerCase().includes(q);
  });

  const sorted = filtered.sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : a.name.localeCompare(b.name)));
  const visible = sorted.slice(0, visibleCount);

  const getSelectedSessionType = () => sessionTypes.find(t => t.id === selectedSessionType);

  return (
    <>
      {!inPlaceBooking && <DashboardHeader />}
      <div aria-live="polite" className="sr-only">{liveMessage}</div>

      {showToast && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300 transform">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4 min-w-[320px] max-w-md">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#25A8A0] to-[#2bbab2] flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800 mb-1">Booking Confirmed!</div>
              <div className="text-sm text-gray-600">Your session has been successfully booked.</div>
            </div>
            <button onClick={() => setShowToast(false)} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronRight className="w-5 h-5 rotate-90" />
            </button>
          </div>
        </div>
      )}

      <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Back Link */}
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                  ← Back to Dashboard
                </Link>

                {view === 'list' ? (
                  <section className="space-y-8">
                    <div className="bg-[#25A8A0] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Book Your Session</h1>
                        <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto text-center leading-relaxed">
                          Select a curated professional below. This page is designed for quick comparison and immediate action,
                          helping you connect with the right support without delay.
                        </p>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 border-t border-white/10 pt-8 mt-2 justify-end">
                          <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-white/80" />
                            <span className="text-sm font-semibold text-white/60">Refine by:</span>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <select
                              value={specializationFilter}
                              onChange={e => setSpecializationFilter(e.target.value)}
                              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-white/30 outline-none transition-all hover:bg-white/20 text-white"
                            >
                              <option value="all" className="bg-[#25A8A0]">All Expertises</option>
                              <option value="anxiety" className="bg-[#25A8A0]">Anxiety</option>
                              <option value="depression" className="bg-[#25A8A0]">Depression</option>
                              <option value="ptsd" className="bg-[#25A8A0]">PTSD</option>
                              <option value="stress" className="bg-[#25A8A0]">Stress Management</option>
                              <option value="relationships" className="bg-[#25A8A0]">Relationships</option>
                              <option value="career" className="bg-[#25A8A0]">Career Growth</option>
                            </select>
                            <select
                              value={sortBy}
                              onChange={e => setSortBy(e.target.value as any)}
                              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-white/30 outline-none transition-all hover:bg-white/20 text-white"
                            >
                              <option value="rating" className="bg-[#25A8A0]">Highly Rated</option>
                              <option value="name" className="bg-[#25A8A0]">Alphabetical</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>


                    {visible.length === 0 && !loading && (
                      <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm animate-fadeIn">
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <AlertCircle className="w-10 h-10 text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Active Connections</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">You need an approved connection with a professional before you can book a session.</p>
                        <button
                          onClick={() => navigate('/find-listener')}
                          className="px-8 py-3 bg-[#25A8A0] text-white rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/10"
                        >
                          Find Support
                        </button>
                      </div>
                    )}

                    {visible.length > 0 && (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {visible.map(p => {
                          return (
                            <article
                              key={p.id}
                              className={`group flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:shadow-teal-500/10 hover:border-teal-500/50' : 'bg-white border-gray-100/50 hover:shadow-teal-200/40 hover:border-teal-100'}`}
                            >
                              <div className="p-4">
                                <div className="relative h-64 overflow-hidden rounded-[2rem]">
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                  {p.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                  {p.specializations.slice(0, 3).map(s => (
                                    <span key={s} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border uppercase tracking-wider ${theme === 'dark' ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                      {s}
                                    </span>
                                  ))}
                                  {p.specializations.length > 3 && (
                                    <span className="bg-teal-50 text-teal-600 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-teal-100 uppercase tracking-wider">
                                      +{p.specializations.length - 3} More
                                    </span>
                                  )}
                                </div>

                                <button
                                  onClick={() => {
                                    setSelectedProfessional(p);
                                    setInPlaceBooking(true);
                                    setBookingStep(1);
                                  }}
                                  className="mt-auto w-full py-4 bg-[#25A8A0] text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                                >
                                  <span>Book Session</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}

                    {inPlaceBooking && (
                      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10 transition-all duration-500">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-xl transition-opacity duration-300" onClick={() => { setInPlaceBooking(false); setSelectedProfessional(null); setBookingStep(1); }} />
                        <div className={`relative z-[70] w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`} ref={overlayWrapperRef}>
                          <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {bookingStep === 1 ? 'Select Session Type' : bookingStep === 2 ? 'Choose Date' : bookingStep === 3 ? 'Pick Time' : 'Confirm Details'}
                              </h2>
                              <button onClick={() => setInPlaceBooking(false)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><ChevronUp className="w-6 h-6 rotate-180" /></button>
                            </div>

                            {bookingStep === 1 && (
                              <div className="grid gap-4">
                                {sessionTypes.map(t => (
                                  <button
                                    key={t.id}
                                    onClick={() => setSelectedSessionType(t.id)}
                                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all outline-none ${selectedSessionType === t.id
                                      ? `border-[#25A8A0] ring-2 ring-[#25A8A0] ring-offset-2 ${theme === 'dark' ? 'bg-transparent ring-offset-gray-900' : 'bg-teal-50 ring-offset-white'}`
                                      : theme === 'dark'
                                        ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                        : 'border-gray-100 hover:border-teal-200 bg-gray-50/30'
                                      }`}
                                  >
                                    <div className={`p-3 rounded-xl ${selectedSessionType === t.id ? 'bg-[#25A8A0] text-white' : 'bg-white text-[#25A8A0] shadow-sm'}`}><t.icon /></div>
                                    <div className="text-left flex-1">
                                      <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{t.name}</h4>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t.description}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Step 2 (Duration) Removed */}

                            {bookingStep === 2 && (
                              <div className="flex flex-col items-center">
                                <div className={`w-full rounded-2xl p-6 mb-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                  <div className="flex items-center justify-between mb-4">
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className={`p-2 rounded-lg shadow-sm hover:text-[#25A8A0] ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}><ChevronLeft /></button>
                                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className={`p-2 rounded-lg shadow-sm hover:text-[#25A8A0] ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}><ChevronRight /></button>
                                  </div>
                                  <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}</div>
                                  <div className="grid grid-cols-7 gap-2">
                                    {(() => {
                                      const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
                                      const days = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                                      const cells = [];
                                      for (let i = 0; i < start; i++) cells.push(<div key={`b-${i}`} />);
                                      for (let d = 1; d <= days; d++) {
                                        const dt = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                                        const selected = isSameDay(dt, selectedDate);
                                        const disabled = dt < new Date(new Date().setHours(0, 0, 0, 0));
                                        cells.push(
                                          <button
                                            key={d}
                                            disabled={disabled}
                                            onClick={() => setSelectedDate(dt)}
                                            className={`p-3 rounded-xl text-sm font-bold transition-all ${selected
                                              ? 'bg-[#25A8A0] text-white shadow-lg shadow-teal-200'
                                              : disabled
                                                ? 'text-gray-700 dark:text-gray-700 cursor-not-allowed opacity-50'
                                                : theme === 'dark'
                                                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                                  : 'bg-white text-gray-700 hover:bg-teal-50'
                                              }`}
                                          >
                                            {d}
                                          </button>
                                        );
                                      }
                                      return cells;
                                    })()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#25A8A0] bg-teal-50 px-4 py-2 rounded-full font-bold">
                                  <Calendar className="w-4 h-4" /> {formatSelectedDate(selectedDate)}
                                </div>
                              </div>
                            )}

                            {bookingStep === 3 && (
                              <div className="flex flex-col items-center gap-8 py-4">
                                <div className="flex items-center gap-4">
                                  {/* Hour */}
                                  <div className="flex flex-col items-center">
                                    <button onClick={incrementHour} className="p-2 hover:bg-teal-50 rounded-full transition-colors text-teal-600"><ChevronUp className="w-8 h-8" /></button>
                                    <div className={`w-20 h-20 border-2 rounded-3xl flex items-center justify-center shadow-inner ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-teal-100 text-teal-700'}`}>
                                      <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-teal-700'}`}>{hourInput}</span>
                                    </div>
                                    <button onClick={decrementHour} className="p-2 hover:bg-teal-50 rounded-full transition-colors text-teal-600"><ChevronDown className="w-8 h-8" /></button>
                                  </div>

                                  <div className="text-4xl font-bold text-teal-500 pt-1">:</div>

                                  {/* Minute */}
                                  <div className="flex flex-col items-center">
                                    <button onClick={() => setSelectedMinute(m => (m + 1) % 60)} className="p-2 hover:bg-teal-50 rounded-full transition-colors text-teal-600"><ChevronUp className="w-8 h-8" /></button>
                                    <div className={`w-20 h-20 border-2 rounded-3xl flex items-center justify-center shadow-inner ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-teal-100 text-teal-700'}`}>
                                      <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-teal-700'}`}>{selectedMinute.toString().padStart(2, '0')}</span>
                                    </div>
                                    <button onClick={() => setSelectedMinute(m => (m - 1 + 60) % 60)} className="p-2 hover:bg-teal-50 rounded-full transition-colors text-teal-600"><ChevronDown className="w-8 h-8" /></button>
                                  </div>

                                  <div className="text-4xl font-bold text-teal-500 pt-1">:</div>

                                  {/* AM/PM */}
                                  <div className="flex flex-col items-center">
                                    <button onClick={() => { setAmPm(amPm === 'AM' ? 'PM' : 'AM'); tryApplyCandidate(undefined, amPm === 'AM' ? 'PM' : 'AM'); }} className="p-2 hover:bg-teal-50 rounded-full transition-colors text-teal-600"><ChevronUp className="w-8 h-8" /></button>
                                    <div className={`w-20 h-20 border-2 rounded-3xl flex items-center justify-center shadow-inner ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-teal-100 text-teal-700'}`}>
                                      <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-teal-700'}`}>{amPm}</span>
                                    </div>
                                    <button onClick={() => { setAmPm(amPm === 'AM' ? 'PM' : 'AM'); tryApplyCandidate(undefined, amPm === 'AM' ? 'PM' : 'AM'); }} className="p-2 hover:bg-teal-50 rounded-full transition-colors text-teal-600"><ChevronDown className="w-8 h-8" /></button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {bookingStep === 4 && selectedProfessional && (
                              <div className="space-y-4">
                                <div className={`rounded-2xl p-6 space-y-4 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                                  {/* Professional Card (Instant Support Style) */}
                                  <div className={`rounded-[2rem] overflow-hidden border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'}`}>
                                    <div className="p-6 flex items-center gap-6">
                                      <div className="relative">
                                        <img src={selectedProfessional.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg" alt={selectedProfessional.name} />
                                      </div>
                                      <div>
                                        <h3 className={`text-xl font-bold leading-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedProfessional.name}</h3>
                                        <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-2">{selectedProfessional.title}</p>
                                        <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg w-fit">
                                          <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                          <span className="text-xs font-bold text-yellow-700">{selectedProfessional.rating.toFixed(1)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Session</p>
                                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{getSelectedSessionType()?.name}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Schedule</p>
                                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{formatSelectedDate(selectedDate)} at {timeSlots[selectedTime].replace(':00', `:${selectedMinute.toString().padStart(2, '0')}`)}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 p-4 bg-orange-50 rounded-xl text-orange-700 text-xs">
                                  <Check className="w-4 h-4 flex-shrink-0" />
                                  <p>By confirming, you agree to our 24-hour cancellation policy.</p>
                                </div>
                              </div>
                            )}

                            <div className="mt-10 flex items-center justify-between">
                              <button
                                onClick={() => {
                                  if (bookingStep === 1) setInPlaceBooking(false);
                                  else setBookingStep(s => s - 1);
                                }}
                                className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {bookingStep === 1 ? 'Cancel' : 'Go Back'}
                              </button>
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${bookingStep === i ? 'w-6 bg-teal-500' : 'bg-gray-200'}`} />)}
                              </div>
                              <button
                                onClick={async () => {
                                  if (bookingStep < 4) setBookingStep(s => s + 1);
                                  else {
                                    if (selectedProfessional) {
                                      setIsProcessing(true);
                                      try {
                                        const dateStr = selectedDate.toISOString().split('T')[0];
                                        const timeStr = `${selectedTime.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}:00`;

                                        // Map session types to backend values
                                        const typeMapping: { [key: string]: string } = {
                                          'Phone': 'audio',
                                          'Video': 'video',
                                          'Chat': 'chat'
                                        };

                                        // 1. Create Appointment
                                        const apptResponse = await fetchWithAuth('http://127.0.0.1:8000/api/auth/appointments/', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            professional: selectedProfessional.id,
                                            client: user?.id,
                                            date: dateStr,
                                            time: timeStr,
                                            status: 'upcoming',
                                            session_type: typeMapping[selectedSessionType] || 'video',
                                            notes: `Booking for ${selectedSessionType} session.`
                                          })
                                        });

                                        if (apptResponse.ok) {
                                          setInPlaceBooking(false);
                                          setShowToast(true);
                                          setTimeout(() => setShowToast(false), 5000);
                                          setIsProcessing(false);
                                        } else {
                                          const err = await apptResponse.json();
                                          alert(`Error: ${JSON.stringify(err)}`);
                                          setIsProcessing(false);
                                        }
                                      } catch (error) {
                                        console.error("Error confirming booking:", error);
                                        alert("Failed to confirm booking.");
                                        setIsProcessing(false);
                                      }
                                    }
                                  }
                                }}
                                className="px-8 py-3 bg-[#25A8A0] hover:bg-[#1e8a82] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-teal-200"
                              >
                                {bookingStep === 4 ? (isProcessing ? <FaSpinner className="animate-spin" /> : 'Confirm Booking') : 'Next Step'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;