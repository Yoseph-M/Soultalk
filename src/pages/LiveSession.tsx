import { API_BASE_URL } from "../config";
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from '../contexts/AuthContext';

// Readings keys from .env file
const APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

const LiveSession: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const { user, fetchWithAuth, isLoading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);
    const [otherUser, setOtherUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const zegoInstance = useRef<any>(null);

    useEffect(() => {
        if (!user || !sessionId) return;
        const parts = sessionId.split('-');
        if (parts.length >= 3) {
            const partnerId = (user.id.toString() === parts[1]) ? parts[2] : parts[1];
            const fetchPartner = async () => {
                try {
                    const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/users/detail/${partnerId}/`);
                    if (res.ok) {
                        const data = await res.json();
                        setOtherUser(data);
                    }
                } catch (err) { console.error(err); }
            }
            fetchPartner();
        }
    }, [sessionId, user, fetchWithAuth]);

    useEffect(() => {
        if (isLoading || !user || !sessionId) return;

        // Verify keys are loaded
        if (!APP_ID || isNaN(APP_ID)) {
            console.error("VITE_ZEGO_APP_ID is missing or not a number in .env");
            setError("Configuration Error: VITE_ZEGO_APP_ID is missing from your .env file.");
            return;
        }

        if (!SERVER_SECRET) {
            console.error("VITE_ZEGO_SERVER_SECRET is missing in .env");
            setError("Configuration Error: VITE_ZEGO_SERVER_SECRET is missing from your .env file.");
            return;
        }

        const myRoomId = sessionId;

        try {
            // Generate a Kit Token
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                APP_ID,
                SERVER_SECRET,
                myRoomId,
                String(user.id),
                user.name || user.email.split('@')[0]
            );

            // Create instance object from Kit Token
            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zegoInstance.current = zp;

            // Parse query params to check for mode (video, voice, chat)
            const queryParams = new URLSearchParams(window.location.search);
            const mode = queryParams.get('mode') || 'video';

            // Start the call
            zp.joinRoom({
                container: containerRef.current,
                sharedLinks: [
                    {
                        name: 'Copy Link',
                        url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + myRoomId,
                    },
                ],
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
                turnOnCameraWhenJoining: mode === 'video',
                turnOnMicrophoneWhenJoining: mode === 'voice' || mode === 'video',
                showMyCameraToggleButton: mode === 'video',
                showAudioVideoSettingsButton: true,
                showScreenSharingButton: mode === 'video',
                showPreJoinView: false,
                onLeaveRoom: () => {
                    navigate(-1);
                },
            });
        } catch (err) {
            console.error("ZegoCloud Error:", err);
            setError("Failed to initialize calling service. Please check your API keys.");
        }

        return () => {
            if (zegoInstance.current) {
                try {
                    zegoInstance.current.destroy();
                } catch (e) {
                    console.error("Error destroying Zego instance:", e);
                }
            }
        };
    }, [sessionId, user, isLoading, navigate]);

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
                <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg ring-2 ring-white/20">
                            {otherUser?.name?.[0] || '...'}
                        </div>
                        <div>
                            <h2 className="text-white font-black text-sm md:text-lg tracking-tight">
                                {otherUser?.name || 'Joining Session...'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[8px] md:text-[10px] text-green-400 font-black uppercase tracking-[0.2em]">Encrypted Call</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="w-full h-full"
                ref={containerRef}
            />
        </div>
    );
};

export default LiveSession;
