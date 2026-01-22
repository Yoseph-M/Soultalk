import { API_BASE_URL } from "../config";
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreHorizontal, Plus, Menu, X, Trash2, Edit2, Share2, Pin, Check, Bot } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: Date;
}

interface ChatSession {
    id: number;
    title: string;
    updated_at: string;
    is_pinned: boolean;
}

const AIChat: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { user, isLoading: authLoading, fetchWithAuth } = useAuth();
    const isDark = theme === 'dark';
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Rename state
    const [renamingId, setRenamingId] = useState<number | null>(null);
    const [renameTitle, setRenameTitle] = useState('');

    // Menu state
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuCoords, setMenuCoords] = useState<{ top: number, left: number } | null>(null);

    const activeSessionRef = useRef<number | null>(null);

    const getHomePath = () => {
        if (!user) return "/auth";
        if (user.type === 'professional' || user.type === 'listener') {
            return "/professionals";
        }
        return "/dashboard";
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        } else if (user) {
            fetchSessions();
        }

        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, [user, authLoading, navigate]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuId(null);
            setMenuCoords(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await fetchWithAuth(API_BASE_URL + '/api/auth/chat-sessions/');
            if (response.status === 401) {
                navigate('/auth');
                return;
            }
            if (response.ok) {
                const data = await response.json();
                const sorted = data.sort((a: ChatSession, b: ChatSession) => {
                    const aPinned = a.is_pinned || false;
                    const bPinned = b.is_pinned || false;

                    if (aPinned === bPinned) {
                        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                    }
                    return aPinned ? -1 : 1;
                });
                setSessions(sorted);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        }
    };

    const loadSession = async (sessionId: number) => {
        setIsTyping(false);
        setCurrentSessionId(sessionId);
        activeSessionRef.current = sessionId;
        if (window.innerWidth < 768) setSidebarOpen(false);

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/chat-sessions/${sessionId}/`);
            if (response.ok) {
                const data = await response.json();
                if (activeSessionRef.current === sessionId) {
                    const loadedMessages = data.messages.map((m: any) => ({
                        id: m.id.toString(),
                        role: m.role,
                        content: m.content,
                        timestamp: new Date(m.timestamp)
                    }));
                    setMessages(loadedMessages);
                }
            }
        } catch (error) {
            console.error("Failed to load session", error);
        }
    };

    const startNewChat = () => {
        setIsTyping(false);
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I'm SoulTalk AI. How can I support you today?",
            timestamp: new Date()
        }]);
        setCurrentSessionId(null);
        activeSessionRef.current = null;
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsgContent = input;
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userMsgContent,
            timestamp: new Date()
        };

        const sessionWhenSent = activeSessionRef.current;

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
        }
        setIsTyping(true);

        try {
            const response = await fetchWithAuth(API_BASE_URL + '/api/auth/ai-chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMsgContent,
                    session_id: sessionWhenSent
                })
            });

            if (response.status === 401) {
                navigate('/auth');
                return;
            }

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to get response');

            if (activeSessionRef.current === sessionWhenSent || (!sessionWhenSent && activeSessionRef.current === data.session_id)) {

                if (!sessionWhenSent && data.session_id) {
                    setCurrentSessionId(data.session_id);
                    activeSessionRef.current = data.session_id;
                    fetchSessions();
                }

                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.reply,
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            if (activeSessionRef.current === sessionWhenSent) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "I apologize, but I'm having trouble connecting right now.",
                    timestamp: new Date()
                }]);
            }
        } finally {
            setIsTyping(false);
        }
    };

    // --- Actions ---

    const handleRename = async (sessionId: number) => {
        if (!renameTitle.trim()) return;
        try {
            await fetchWithAuth(`${API_BASE_URL}/api/auth/chat-sessions/${sessionId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: renameTitle })
            });
            fetchSessions();
            setRenamingId(null);
        } catch (e) {
            console.error("Rename failed", e);
        }
    };

    const handlePin = async (session: ChatSession) => {
        try {
            const currentPinned = session.is_pinned || false;
            await fetchWithAuth(`${API_BASE_URL}/api/auth/chat-sessions/${session.id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_pinned: !currentPinned })
            });
            fetchSessions();
            setOpenMenuId(null);
        } catch (e) {
            console.error("Pin failed", e);
        }
    };

    const handleDelete = async (sessionId: number) => {
        if (!confirm("Are you sure you want to delete this chat?")) return;
        try {
            await fetchWithAuth(`${API_BASE_URL}/api/auth/chat-sessions/${sessionId}/`, {
                method: 'DELETE',
            });
            if (currentSessionId === sessionId) {
                startNewChat();
            }
            fetchSessions();
            setOpenMenuId(null);
        } catch (e) {
            console.error("Delete failed", e);
        }
    };

    const handleShare = (session: ChatSession) => {
        const textToCopy = `SoulTalk Chat: ${session.title}`;
        navigator.clipboard.writeText(textToCopy);
        alert("Chat info copied to clipboard!");
        setOpenMenuId(null);
    };

    const handleMenuClick = (e: React.MouseEvent, sessionId: number) => {
        e.stopPropagation();

        const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const screenHeight = window.innerHeight;
        const spaceBelow = screenHeight - buttonRect.bottom;

        // Positioning logic
        let top = buttonRect.top;
        if (spaceBelow < 200) {
            top = buttonRect.bottom - 180; // Estimated height of menu
        }

        setMenuCoords({ top: top, left: buttonRect.right + 10 });
        setOpenMenuId(openMenuId === sessionId ? null : sessionId);
    };

    return (
        <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative z-40 h-full flex flex-col border-r transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 md:border-r-0 overflow-hidden'
                } ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>

                {/* Sidebar Header */}
                <div className="p-4 border-b border-inherit flex justify-between items-center shrink-0">
                    <span className="font-bold text-sm tracking-wide opacity-70">Your chats</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className={`p-2 rounded-lg transition-colors md:hidden ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-3 shrink-0">
                    <button
                        onClick={startNewChat}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium shadow-sm ${isDark ? 'bg-[#00407A] hover:bg-[#00407A]/90 text-white' : 'bg-[#2196F3] hover:bg-[#2196F3]/90 text-white'
                            }`}
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {sessions.length === 0 && (
                        <div className="text-center p-8 opacity-40 text-xs italic">No previous chats</div>
                    )}
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            className={`group relative w-full text-left p-3 rounded-lg text-sm flex items-center justify-between transition-colors ${currentSessionId === session.id
                                ? (isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900')
                                : (isDark ? 'text-slate-400 hover:bg-slate-800/50' : 'text-slate-600 hover:bg-slate-50')
                                } ${renamingId === session.id ? (isDark ? 'ring-1 ring-[#00407A]' : 'ring-1 ring-[#2196F3]') : ''}`}
                            onClick={() => { if (renamingId !== session.id) loadSession(session.id); }}
                            role="button"
                        >
                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                                {session.is_pinned && <Pin className={`w-3 h-3 flex-shrink-0 ${isDark ? 'text-[#00407A]' : 'text-[#2196F3]'}`} fill="currentColor" />}

                                {renamingId === session.id ? (
                                    <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                                        <input
                                            autoFocus
                                            className="w-full bg-transparent border-none outline-none p-0 text-sm"
                                            value={renameTitle}
                                            onChange={e => setRenameTitle(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') handleRename(session.id);
                                                if (e.key === 'Escape') setRenamingId(null);
                                            }}
                                        />
                                        <button onClick={() => handleRename(session.id)} className="text-green-500 p-1"><Check className="w-3 h-3" /></button>
                                        <button onClick={() => setRenamingId(null)} className="text-red-500 p-1"><X className="w-3 h-3" /></button>
                                    </div>
                                ) : (
                                    <span className="truncate">{session.title}</span>
                                )}
                            </div>

                            {renamingId !== session.id && (
                                <div className="relative">
                                    <button
                                        className={`p-1.5 rounded-md transition-all ${openMenuId === session.id ? 'opacity-100 bg-black/10 dark:bg-white/10' : 'opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'}`}
                                        onClick={(e) => handleMenuClick(e, session.id)}
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={`p-4 border-t border-inherit shrink-0 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                    <Link
                        to={getHomePath()}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </aside >

            {/* Main Content */}
            < div className="flex-1 flex flex-col h-full relative min-w-0" >

                {/* Header */}
                < header className={`px-4 py-2.5 md:py-3 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-20 ${isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white/90 border-slate-200'
                    }`}>
                    <div className="flex items-center gap-2 md:gap-3">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className={`p-1.5 md:p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg ${isDark ? 'bg-[#00407A] shadow-[#00407A]/20' : 'bg-[#2196F3] shadow-[#2196F3]/20'}`}>
                                <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <h1 className="font-bold text-xs md:text-base leading-tight">SoulTalk AI</h1>
                        </div>
                    </div>
                </header >

                {/* Messages Area - Constrained width container */}
                < main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 custom-scrollbar scroll-smooth flex flex-col" >
                    <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">

                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center min-h-full pb-20">
                                <div className={`p-8 rounded-3xl border text-center space-y-4 shadow-sm max-w-md w-full animate-in fade-in zoom-in-95 duration-500 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <h2 className={`text-xl font-bold bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-[#00407A] to-blue-400' : 'bg-gradient-to-r from-[#2196F3] to-blue-300'}`}>
                                        Your Safe Space
                                    </h2>
                                    <p className="text-sm opacity-70 leading-relaxed">
                                        I'm an AI companion here to listen and support you. All conversations are private and secure.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 pb-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex flex-col gap-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.role === 'user' ? 'items-end' : 'items-start'
                                            }`}
                                    >
                                        <div className={`${message.role === 'assistant'
                                            ? (isDark
                                                ? 'bg-transparent text-slate-200 ai-chat-text pl-0 py-6 font-sohne w-full'
                                                : 'bg-transparent text-slate-800 ai-chat-text pl-0 py-6 font-sohne w-full')
                                            : 'chat-bubble-user'
                                            }`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="items-start">
                                        <div className={`px-0 py-3 rounded-2xl`}>
                                            <div className="flex gap-1.5 items-center h-full">
                                                <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] ${isDark ? 'bg-[#00407A]' : 'bg-[#2196F3]'}`}></span>
                                                <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] ${isDark ? 'bg-[#00407A]' : 'bg-[#2196F3]'}`}></span>
                                                <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-[#00407A]' : 'bg-[#2196F3]'}`}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </main >

                {/* Input Area - Constrained width container matching chat */}
                {/* Note: Using flex layout which mimics fixed bottom behavior within the content area */}
                <footer className={`p-4 md:p-6 border-t ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="max-w-3xl mx-auto">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="chat-input-container"
                        >
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    e.target.style.height = 'auto'; // Reset height
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask SoulTalk AI..."
                                className="chat-textbox"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="chat-send-button"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="text-[10px] text-center mt-3 opacity-40 font-medium">
                            AI conversation for support purposes only.
                        </p>
                    </div>
                </footer>
            </div >

            {/* Floating Menu Outside Sidebar */}
            {
                openMenuId && menuCoords && (
                    <div
                        className={`fixed w-40 py-1 rounded-xl shadow-xl border z-[100] animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200/50'
                            }`}
                        style={{
                            top: menuCoords.top,
                            left: menuCoords.left
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {sessions.find(s => s.id === openMenuId) && (
                            <>
                                <button
                                    onClick={() => {
                                        const session = sessions.find(s => s.id === openMenuId);
                                        if (session) {
                                            setRenamingId(session.id);
                                            setRenameTitle(session.title);
                                        }
                                        setOpenMenuId(null);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Rename
                                </button>
                                <button
                                    onClick={() => {
                                        const session = sessions.find(s => s.id === openMenuId);
                                        if (session) handlePin(session);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    <Pin className="w-3.5 h-3.5" /> {sessions.find(s => s.id === openMenuId)?.is_pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button
                                    onClick={() => {
                                        const session = sessions.find(s => s.id === openMenuId);
                                        if (session) handleShare(session);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    <Share2 className="w-3.5 h-3.5" /> Share
                                </button>
                                <div className={`h-px my-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                                <button
                                    onClick={() => {
                                        if (openMenuId) handleDelete(openMenuId);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 transition-colors text-red-500 ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </>
                        )}
                    </div>
                )
            }
        </div >
    );
};

export default AIChat;
