import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, X, SendHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const AICompanion: React.FC = () => {
    const { theme } = useTheme();
    const { fetchWithAuth } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { id: '1', role: 'assistant', content: "Hi! I'm your SoulTalk AI. How can I support you today?", timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsgContent = input.trim();
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: userMsgContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/ai-chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsgContent })
            });

            if (response.status === 401) {
                navigate('/auth');
                return;
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to get response');

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(prev => !prev);
                }}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-[100] group ${theme === "dark" ? 'bg-[#00407A]' : 'bg-[#2196F3]'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </button>

            {isOpen && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`fixed bottom-24 right-6 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col transition-all animate-slideUp border ${theme === "dark" ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {/* Header */}
                    <div className={`p-4 flex justify-between items-center border-b ${theme === "dark" ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "dark" ? 'bg-[#00407A]' : 'bg-[#2196F3]'}`}>
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className={`font-bold text-sm ${theme === "dark" ? 'text-white' : 'text-slate-900'}`}>SoulTalk AI</h3>
                            </div>
                        </div>
                        <Link to="/ai-chat" className={`text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${theme === "dark" ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                            Full Page
                        </Link>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`${m.role === 'assistant'
                                    ? (theme === "dark" ? 'text-slate-200' : 'text-slate-800')
                                    : 'chat-bubble-user !max-w-[85%] !text-sm !py-2 !px-3'
                                    }`}>
                                    <div className="prose prose-sm dark:prose-invert">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-1.5 px-1 py-2">
                                <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${theme === "dark" ? 'bg-[#00407A]' : 'bg-[#2196F3]'}`}></span>
                                <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${theme === "dark" ? 'bg-[#00407A]' : 'bg-[#2196F3]'}`}></span>
                                <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${theme === "dark" ? 'bg-[#00407A]' : 'bg-[#2196F3]'}`}></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className={`p-4 border-t ${theme === "dark" ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                        <div className={`flex items-end gap-2 p-2 rounded-2xl border transition-all ${theme === "dark"
                            ? 'bg-slate-800 border-slate-700 focus-within:border-[#00407A]'
                            : 'bg-slate-50 border-slate-200 focus-within:border-[#2196F3] focus-within:bg-white'
                            }`}>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
                                    }
                                }}
                                placeholder="Ask anything"
                                rows={1}
                                className="flex-1 bg-transparent border-none outline-none text-sm resize-none py-1 max-h-32"
                                style={{ height: 'auto' }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-sm ${theme === "dark"
                                    ? (input.trim() && !isTyping ? 'bg-[#00407A] text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed')
                                    : (input.trim() && !isTyping ? 'bg-[#2196F3] text-white' : 'bg-white text-[#2196F3]/40 border border-[#2196F3]/10 cursor-not-allowed')
                                    }`}
                            >
                                <SendHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default AICompanion;
