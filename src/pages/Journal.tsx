import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Howl } from 'howler';
import {
    PenBox, Save, Video,
    Mic, Square, Play, User as UserIcon,
    Plus, Menu, ArrowLeft, Trash2, Pause,
    ChevronDown, ChevronUp, User, MoreHorizontal,
    Music, FileText as FileTextIcon, Camera, Headset,
    Volume2, VolumeX
} from 'lucide-react';

const Journal: React.FC = () => {
    const { theme } = useTheme();
    const { user, fetchWithAuth } = useAuth();
    const isDark = theme === 'dark';

    const [entry, setEntry] = useState('');
    const [title, setTitle] = useState('');
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [clients, setClients] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [mode, setMode] = useState<'text' | 'audio' | 'video'>('text');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [expandedClients, setExpandedClients] = useState<Record<string, boolean>>({});
    const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
    const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
    const [showOptionsId, setShowOptionsId] = useState<number | null>(null);
    const [isRenaming, setIsRenaming] = useState<number | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [audioHowl, setAudioHowl] = useState<Howl | null>(null);
    const [audioState, setAudioState] = useState({ playing: false, progress: 0, duration: 0 });
    const [isMuted, setIsMuted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const isProfessional = user?.type === 'professional' || user?.type === 'listener';

    const getHomePath = () => {
        if (!user) return "/auth";
        return isProfessional ? "/professionals" : "/dashboard";
    };

    const fetchClients = useCallback(async () => {
        if (!isProfessional) return;
        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/connections/');
            if (response.ok) {
                const data = await response.json();
                const accepted = data.filter((c: any) => c.status === 'accepted');
                setClients(accepted);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    }, [fetchWithAuth, isProfessional]);

    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            let url = 'http://127.0.0.1:8000/api/auth/journal-entries/';
            if (selectedClient) {
                url += `?client_id=${selectedClient}`;
            } else {
                url += `?personal=true`;
            }
            const response = await fetchWithAuth(url);
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoadingHistory(false);
        }
    }, [fetchWithAuth, selectedClient]);

    useEffect(() => {
        fetchClients();
        if (window.innerWidth < 1024) setSidebarOpen(false);
    }, [fetchClients]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleSave = async (blob?: Blob) => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const formData = new FormData();
            if (!title.trim()) {
                alert("Please provide a title for your journal entry.");
                setIsSaving(false);
                return;
            }
            formData.append('entry_type', mode);
            formData.append('title', title);
            if (selectedClient) formData.append('client', selectedClient);

            if (mode === 'text') {
                formData.append('content', entry);
            } else if (blob || recordedBlob) {
                const finalBlob = blob || recordedBlob;
                if (finalBlob) {
                    const ext = mode === 'video' ? 'webm' : 'webm';
                    formData.append('media_file', finalBlob, `journal_entry_${Date.now()}.${ext}`);
                }
            }

            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/journal-entries/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSaved(true);
                setEntry('');
                setTitle('');
                setRecordedBlob(null);
                setEditingEntryId(null);
                fetchHistory();
                setTimeout(() => setSaved(false), 3000);
            } else {
                const errData = await response.json();
                alert("Failed to save entry: " + JSON.stringify(errData));
            }
        } catch (error) {
            console.error("Error saving entry:", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this journal entry?")) return;
        try {
            const response = await fetchWithAuth(`http://127.0.0.1:8000/api/auth/journal-entries/${id}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchHistory();
                if (editingEntryId === id) startNewEntry();
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };

    const handleRename = async (id: number) => {
        if (!renameValue.trim()) return;
        try {
            const response = await fetchWithAuth(`http://127.0.0.1:8000/api/auth/journal-entries/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: renameValue }),
            });
            if (response.ok) {
                setIsRenaming(null);
                setRenameValue('');
                fetchHistory();
                if (editingEntryId === id) setTitle(renameValue);
            }
        } catch (error) {
            console.error("Error renaming entry:", error);
        }
    };

    const startRecording = async () => {
        try {
            const constraints = mode === 'video' ? { video: true, audio: true } : { audio: true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mode === 'video' ? 'video/webm' : 'audio/webm' });
                setRecordedBlob(blob);
                setSelectedMediaUrl(URL.createObjectURL(blob));
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } catch (err) {
            alert('Could not access camera/microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Howler.js Audio Logic
    useEffect(() => {
        if (selectedMediaUrl && mode === 'audio') {
            if (audioHowl) {
                audioHowl.unload();
            }

            const howl = new Howl({
                src: [selectedMediaUrl],
                html5: true,
                onplay: () => {
                    setAudioState(prev => ({ ...prev, playing: true }));
                    const d = howl.duration();
                    if (d > 0 && d !== Infinity) setAudioState(prev => ({ ...prev, duration: d }));
                },
                onpause: () => setAudioState(prev => ({ ...prev, playing: false })),
                onstop: () => setAudioState(prev => ({ ...prev, playing: false, progress: 0 })),
                onend: () => setAudioState(prev => ({ ...prev, playing: false, progress: 0 })),
                onload: () => {
                    const d = howl.duration();
                    if (d > 0 && d !== Infinity) setAudioState(prev => ({ ...prev, duration: d }));
                },
            });

            setAudioHowl(howl);
            setAudioState({ playing: false, progress: 0, duration: 0 });

            return () => {
                howl.unload();
            };
        }
    }, [selectedMediaUrl, mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (audioHowl && audioState.playing && !isDragging) {
            interval = setInterval(() => {
                const seek = audioHowl.seek();
                const duration = audioHowl.duration();

                if (typeof seek === 'number' && duration > 0 && duration !== Infinity) {
                    setAudioState(prev => ({
                        ...prev,
                        progress: (seek / duration) * 100,
                        duration: duration // Sync duration in case it changed
                    }));
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [audioHowl, audioState.playing, isDragging]);

    useEffect(() => {
        if (audioHowl) {
            audioHowl.mute(isMuted);
        }
    }, [isMuted, audioHowl]);

    const toggleMute = () => setIsMuted(!isMuted);

    const seekAudio = useCallback((pct: number) => {
        if (!audioHowl) return;
        const duration = audioHowl.duration();
        // Fallback to state duration if Howler instance is still loading but we have it in state
        const actualDuration = duration > 0 ? duration : audioState.duration;

        if (actualDuration > 0) {
            const time = pct * actualDuration;
            audioHowl.seek(time);
        }
        // Always update UI progress immediately for smoothness
        setAudioState(prev => ({ ...prev, progress: pct * 100 }));
    }, [audioHowl, audioState.duration]);

    const handleScrub = useCallback((clientX: number) => {
        if (!audioHowl || !progressRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        setAudioState(prev => ({ ...prev, progress: percentage * 100 }));
    }, [audioHowl, progressRef]);

    useEffect(() => {
        if (isDragging) {
            const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
                const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
                handleScrub(clientX);
            };
            const handleGlobalUp = (e: MouseEvent | TouchEvent) => {
                const clientX = 'touches' in e ? (e as TouchEvent).changedTouches[0].clientX : (e as MouseEvent).clientX;
                const rect = progressRef.current?.getBoundingClientRect();
                if (rect) {
                    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
                    const percentage = x / rect.width;
                    seekAudio(percentage);
                }
                setIsDragging(false);
            };

            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
            window.addEventListener('touchmove', handleGlobalMove);
            window.addEventListener('touchend', handleGlobalUp);
            return () => {
                window.removeEventListener('mousemove', handleGlobalMove);
                window.removeEventListener('mouseup', handleGlobalUp);
                window.removeEventListener('touchmove', handleGlobalMove);
                window.removeEventListener('touchend', handleGlobalUp);
            };
        }
    }, [isDragging, handleScrub, seekAudio]);

    const toggleAudio = () => {
        if (!audioHowl) return;
        if (audioHowl.playing()) {
            audioHowl.pause();
        } else {
            audioHowl.play();
        }
    };

    const handleSelectEntry = (item: any) => {
        setMode(item.entry_type as any);
        setTitle(item.title || '');
        if (item.entry_type === 'text') {
            setEntry(item.content || '');
            setSelectedMediaUrl(null);
        } else {
            setEntry('');
            if (item.media_file) {
                // Handle different URL formats from backend
                const url = item.media_file.startsWith('http')
                    ? item.media_file
                    : `http://127.0.0.1:8000${item.media_file}`;
                setSelectedMediaUrl(url);
            } else {
                setSelectedMediaUrl(null);
            }
        }
        setEditingEntryId(item.id);
        setRecordedBlob(null);
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    const startNewEntry = () => {
        setTitle('');
        setEntry('');
        setRecordedBlob(null);
        setSelectedMediaUrl(null);
        setEditingEntryId(null);
        setMode('text');
    };

    const groupHistoryByClient = () => {
        const groups: Record<string, any[]> = {};
        history.forEach(item => {
            const clientName = item.client_name || 'Personal';
            if (!groups[clientName]) groups[clientName] = [];
            groups[clientName].push(item);
        });
        return groups;
    };

    const toggleClientExpand = (clientName: string) => {
        setExpandedClients(prev => ({
            ...prev,
            [clientName]: !prev[clientName]
        }));
    };

    const groupedHistory = groupHistoryByClient();

    const primaryColor = 'bg-[#F97316]';

    return (
        <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-900 font-sans'}`}>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar - History / Sessions */}
            <aside className={`fixed lg:relative z-40 h-full flex flex-col border-r transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0 lg:border-r-0 overflow-hidden'
                } ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>

                <div className="p-4 border-b border-inherit flex justify-between items-center shrink-0">
                    <span className="font-bold text-sm tracking-wide opacity-70">Journal History</span>
                    <button onClick={() => setSidebarOpen(false)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-3 shrink-0">
                    <button
                        onClick={startNewEntry}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium shadow-sm text-white ${primaryColor} hover:opacity-90`}
                    >
                        <Plus className="w-4 h-4" />
                        New Entry
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {loadingHistory ? (
                        <div className="text-center py-10 opacity-40 text-xs italic">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-10 opacity-40 text-xs italic">No entries yet</div>
                    ) : (
                        Object.keys(groupedHistory).map((clientName) => (
                            <div key={clientName} className="space-y-1">
                                <button
                                    onClick={() => toggleClientExpand(clientName)}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-[#F97316]" />
                                        <span>{clientName}</span>
                                        <span className="opacity-50 font-medium">({groupedHistory[clientName].length})</span>
                                    </div>
                                    {expandedClients[clientName] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>

                                {expandedClients[clientName] && (
                                    <div className="pl-2 space-y-1 mt-1">
                                        {groupedHistory[clientName].map((item) => (
                                            <div key={item.id} className="relative group">
                                                <button
                                                    onClick={() => handleSelectEntry(item)}
                                                    className={`w-full group text-left p-2.5 rounded-xl text-sm flex items-center gap-3 transition-all duration-200 ${editingEntryId === item.id
                                                        ? (isDark ? 'bg-slate-800 text-white shadow-lg' : 'bg-orange-50 text-[#F97316] shadow-sm')
                                                        : (isDark ? 'text-slate-400 hover:bg-slate-800/80 hover:text-white' : 'text-slate-600 hover:bg-orange-50/50 hover:text-[#F97316]')
                                                        }`}
                                                >
                                                    <div className={`p-1.5 rounded-md ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-orange-600'}`}>
                                                        {item.entry_type === 'text' ? <FileTextIcon className="w-3.5 h-3.5" /> : item.entry_type === 'audio' ? <Headset className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        {isRenaming === item.id ? (
                                                            <input
                                                                autoFocus
                                                                className={`w-full rounded px-2 py-1 text-xs border focus:outline-none focus:ring-1 focus:ring-[#F97316] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-800'}`}
                                                                value={renameValue}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setRenameValue(val.charAt(0).toUpperCase() + val.slice(1));
                                                                }}
                                                                onBlur={() => handleRename(item.id)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleRename(item.id)}
                                                            />
                                                        ) : (
                                                            <>
                                                                <div className="truncate font-medium text-xs">{item.title || 'Untitled Session'}</div>
                                                                <div className="text-[9px] opacity-40">{new Date(item.created_at).toLocaleDateString()}</div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setShowOptionsId(showOptionsId === item.id ? null : item.id); }}
                                                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-orange-100'}`}
                                                        >
                                                            <MoreHorizontal className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                                        </button>
                                                    </div>
                                                </button>

                                                {showOptionsId === item.id && (
                                                    <div className={`absolute right-2 top-10 w-32 rounded-xl shadow-2xl z-50 p-1 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-xl'
                                                        }`}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setIsRenaming(item.id); setRenameValue(item.title); setShowOptionsId(null); }}
                                                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors ${isDark ? 'hover:bg-[#F97316]/10 hover:text-[#F97316] text-slate-300' : 'hover:bg-[#F97316]/10 text-slate-700'}`}
                                                        >
                                                            <PenBox className="w-3 h-3 text-[#F97316]" /> Rename
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); setShowOptionsId(null); }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className={`p-4 border-t border-inherit shrink-0 ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                    <Link to={getHomePath()} className="flex items-center gap-2 text-sm font-medium hover:text-inherit">
                        <ArrowLeft className="w-4 h-4" />
                        Return to dashboard
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative min-w-0">

                {/* Header */}
                <header className={`px-4 py-3 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-20 ${isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white/90 border-slate-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-white ${primaryColor}`}>
                                <PenBox className="w-5 h-5" />
                            </div>
                            <h1 className="font-bold text-sm md:text-base">Mindful Journal</h1>
                        </div>
                    </div>
                    {isProfessional && (
                        <div className="relative group">
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className={`pl-10 pr-4 py-2 rounded-xl text-xs font-bold borderappearance-none transition-all cursor-pointer ring-offset-2 focus:ring-2 focus:ring-[#F97316] ${isDark
                                    ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-[#F97316]'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#F97316]'
                                    } shadow-sm`}
                            >
                                <option value="">You: Personal Entry</option>
                                {clients.map((conn) => (
                                    <option key={conn.id} value={conn.client}>Client: {conn.client_name}</option>
                                ))}
                            </select>
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F97316]" />
                        </div>
                    )}
                </header>

                {/* Entry Workspace */}
                <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-12 custom-scrollbar">
                    <div className="max-w-4xl mx-auto w-full">

                        {/* Title Input */}
                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="Untitled Journal Entry"
                                value={title}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setTitle(val.charAt(0).toUpperCase() + val.slice(1));
                                }}
                                required
                                readOnly={!!editingEntryId}
                                className={`w-full bg-transparent text-3xl md:text-5xl font-bold tracking-tight focus:outline-none placeholder:opacity-20 ${isDark ? 'text-white' : 'text-slate-900'} ${!title && isSaving ? 'placeholder:text-red-400' : ''} ${editingEntryId ? 'cursor-default' : ''}`}
                            />
                            <div className={`w-20 h-1 mt-4 rounded-full ${primaryColor}`} />
                        </div>

                        {/* Mode Selectors - Only show when creating a new entry */}
                        {!editingEntryId && (
                            <div className={`inline-flex p-1 rounded-xl mb-8 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                                {[
                                    { id: 'text', label: 'Write', icon: FileTextIcon },
                                    { id: 'audio', label: 'Speak', icon: Mic },
                                    { id: 'video', label: 'Visual', icon: Camera }
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => { setMode(m.id as any); setRecordedBlob(null); }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${mode === m.id
                                            ? `bg-[#F97316] text-white shadow-sm`
                                            : `text-slate-500 hover:bg-[#F97316]/10 hover:text-[#F97316]`
                                            }`}
                                    >
                                        <m.icon className="w-3.5 h-3.5" />
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="min-h-[500px]">
                            {mode === 'text' ? (
                                <textarea
                                    value={entry}
                                    onChange={(e) => setEntry(e.target.value)}
                                    placeholder="Start reflecting..."
                                    readOnly={!!editingEntryId}
                                    className={`w-full min-h-[500px] bg-transparent resize-none text-lg md:text-xl leading-relaxed focus:outline-none placeholder:opacity-30 ${isDark ? 'text-slate-300' : 'text-slate-700'} ${editingEntryId ? 'cursor-default' : ''}`}
                                />
                            ) : (
                                <div className={`aspect-video rounded-3xl flex flex-col items-center justify-center border-2 border-dashed overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                    {selectedMediaUrl ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                            {mode === 'video' ? (
                                                <video
                                                    src={selectedMediaUrl}
                                                    controls
                                                    className="w-full h-full max-h-[400px] rounded-2xl bg-black"
                                                />
                                            ) : (
                                                <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl relative">
                                                    {/* Brand Orange Gradient Background */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#9A3412] z-0" />

                                                    <div className="relative z-10 p-10 flex flex-col items-center text-white">
                                                        {/* Top Metadata & Time */}
                                                        <div className="w-full flex justify-between items-center mb-10 text-[10px] uppercase tracking-[0.2em] font-light opacity-80">
                                                            <div className="w-16 tabular-nums">{formatTime(audioState.duration * (audioState.progress / 100))}</div>
                                                            <div className="flex-1 text-center font-bold">{title || 'Audio Reflection'}</div>
                                                            <div className="w-16 text-right tabular-nums">{formatTime(audioState.duration)}</div>
                                                        </div>

                                                        <div
                                                            ref={progressRef}
                                                            className="w-full h-16 flex items-center mb-10 cursor-pointer group progress-container relative"
                                                            onMouseDown={(e) => {
                                                                setIsDragging(true);
                                                                handleScrub(e.clientX);
                                                            }}
                                                            onTouchStart={(e) => {
                                                                setIsDragging(true);
                                                                handleScrub(e.touches[0].clientX);
                                                            }}
                                                        >
                                                            <div className="w-full h-[2px] bg-white/20 relative">
                                                                <div
                                                                    className="absolute h-[4px] -top-[1px] bg-white transition-all duration-75 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                                                    style={{ width: `${audioState.progress}%` }}
                                                                />
                                                                {/* Playhead point - Always visible and larger when active */}
                                                                <div
                                                                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-transform translate-x-[-50%] ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}
                                                                    style={{ left: `${audioState.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="w-full flex justify-between items-center gap-8">
                                                            {/* Placeholder to balance layout */}
                                                            <div className="w-10" />

                                                            {/* Center: Play/Pause */}
                                                            <button
                                                                onClick={toggleAudio}
                                                                className="w-24 h-24 flex items-center justify-center border-2 border-white/30 rounded-full hover:bg-white/20 transition-all active:scale-90 shadow-2xl bg-white/10"
                                                            >
                                                                {audioState.playing ? (
                                                                    <Pause className="w-12 h-12 fill-white" />
                                                                ) : (
                                                                    <Play className="w-12 h-12 fill-white ml-1.5" />
                                                                )}
                                                            </button>

                                                            {/* Right: Mute/Unmute */}
                                                            <button
                                                                onClick={toggleMute}
                                                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all opacity-80 hover:opacity-100"
                                                            >
                                                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {(recordedBlob && !editingEntryId) && (
                                                <button
                                                    onClick={() => { setRecordedBlob(null); setSelectedMediaUrl(null); }}
                                                    className="mt-6 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity text-white"
                                                >
                                                    Discard and Record New
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl text-white mb-6 relative ${isRecording ? 'bg-red-500 animate-pulse' : primaryColor}`}>
                                                {mode === 'audio' ? <Mic className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                                            </div>

                                            {isRecording ? (
                                                <div className="text-4xl font-mono font-bold text-red-500">
                                                    {formatTime(recordingTime)}
                                                </div>
                                            ) : (
                                                <div className="text-center px-6">
                                                    <h3 className="font-bold text-lg mb-2">
                                                        {recordedBlob ? 'Session Ready' : `Record ${mode === 'audio' ? 'Audio' : 'Video'}`}
                                                    </h3>
                                                    <p className="text-xs opacity-50 px-4">
                                                        {recordedBlob ? 'Review your session and save it to your history.' : 'Click start to begin capturing your reflections.'}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-8 flex gap-4">
                                                <button
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${isRecording ? 'bg-red-500 text-white' : 'bg-white text-slate-900'}`}
                                                >
                                                    {isRecording ? <><Square className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4 fill-current" /> Start</>}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer Action Bar */}
                < footer className={`p-4 md:p-6 border-t ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="invisible">
                            {/* Removed Cloud Sync Enabled */}
                        </div>

                        {!editingEntryId && (
                            <div className="flex items-center gap-3">
                                {(title || entry || recordedBlob) && (
                                    <button
                                        onClick={startNewEntry}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-30"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Discard
                                    </button>
                                )}
                                <button
                                    onClick={() => handleSave()}
                                    disabled={isSaving || (mode === 'text' ? !entry.trim() : !recordedBlob)}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg text-white ${saved ? 'bg-green-500' : (isSaving || (mode === 'text' ? !entry.trim() : !recordedBlob)) ? 'bg-slate-400 cursor-not-allowed opacity-50' : primaryColor
                                        }`}
                                >
                                    <Save className="w-4 h-4" />
                                    {isSaving ? 'Saving...' : saved ? 'Saved' : 'Save Entry'}
                                </button>
                            </div>
                        )}
                    </div>
                </footer >
            </div >

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #F97316;
                }
            `}} />
        </div >
    );
};

export default Journal;
