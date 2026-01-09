import { API_BASE_URL } from "../config";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Phone, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const TextChat: React.FC = () => {
    // Expect query params or route params like /chat/conn-{otherUserId}
    // We'll parse it from useParams for simplicity if routed as /chat/:connId
    const { connId } = useParams<{ connId: string }>(); // connId format: conn-{otherUserId} or similar
    const navigate = useNavigate();
    const { user, fetchWithAuth, isLoading } = useAuth();
    const { theme } = useTheme();

    // Parse otherUserId from connId (format: conn-proId-clientId, figure out the other party)
    // Actually simplicity: usage in FindListener was /live/conn-proId-userId
    // Let's assume the route format will be /chat/:sessionId 
    // where session Id is "conn-{proId}-{clientId}"

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chatPartnerId, setChatPartnerId] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !connId) return;

        // Parse the ID
        // Format: conn-{proId}-{clientId}
        const parts = connId.split('-');
        if (parts.length >= 3) {
            const proId = parts[1];
            const clientId = parts[2];

            // If I am pro, partner is client. If I am client, partner is pro.
            const partnerId = (user.id.toString() === proId) ? clientId : proId;
            setChatPartnerId(partnerId);

            // Fetch partner info (minimal)
            // Ideally we have an endpoint for user info, but let's use a simple get if possible
            // or just use ID for now.
        }
    }, [connId, user]);

    useEffect(() => {
        if (!chatPartnerId) return;
        const fetchPartnerInfo = async () => {
            try {
                const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/users/detail/${chatPartnerId}/`);
                if (res.ok) {
                    const data = await res.json();
                    setOtherUser(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPartnerInfo();
    }, [chatPartnerId, fetchWithAuth]);

    // Polling for messages (simple implementation)
    useEffect(() => {
        if (!chatPartnerId) return;

        const loadMessages = async () => {
            try {
                const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/messages/?user_id=${chatPartnerId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadMessages();
        const interval = setInterval(loadMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [chatPartnerId, fetchWithAuth]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatPartnerId) return;

        try {
            const res = await fetchWithAuth(API_BASE_URL + '/api/auth/messages/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiver: chatPartnerId,
                    content: newMessage
                })
            });

            if (res.ok) {
                const sentMsg = await res.json();
                setMessages([...messages, sentMsg]);
                setNewMessage('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className={`px-4 py-3 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {otherUser?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <h2 className="font-bold text-sm">{otherUser?.name || 'Loading...'}</h2>
                        <span className="text-xs text-green-500 font-bold">Online</span>
                    </div>
                </div>
                {/* Actions to switch to Voice/Video */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/live/${connId}?mode=voice`)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                        <Phone className="w-5 h-5 text-gray-500" />
                    </button>
                    <button
                        onClick={() => navigate(`/live/${connId}?mode=video`)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                        <Video className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.sender === user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe
                                ? 'bg-teal-500 text-white rounded-tr-none'
                                : (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border') + ' rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-2 rounded-full ${newMessage.trim() ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TextChat;
