import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from '../contexts/AuthContext';

// Readings keys from .env file
const APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

const LiveCall: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            navigate('/auth');
            return;
        }

        const myRoomId = roomId || 'default-room';

        // Generate a Kit Token
        // NOTE: In a production app, you should generate the token on your backend server
        // to avoid exposing your Server Secret on the client side.
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            APP_ID,
            SERVER_SECRET,
            myRoomId,
            user.id.toString(),
            user.name || user.email.split('@')[0]
        );

        // Create instance object from Kit Token
        const zp = ZegoUIKitPrebuilt.create(kitToken);

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
                mode: ZegoUIKitPrebuilt.OneONOneCall, // Or GroupCall, VideoConference, etc. based on needs
            },
            showScreenSharingButton: true,
            onLeaveRoom: () => {
                navigate(-1); // Go back when leaving
            },
        });

        // Cleanup function not strictly necessary for the prebuilt as it manages its own lifecycle mostly,
        // but good practice if there were listeners to remove.
        return () => {
            zp.destroy();
        };

    }, [roomId, user, isLoading, navigate]);

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div
            className="w-full h-screen bg-gray-900"
            ref={containerRef}
            style={{ width: '100vw', height: '100vh' }}
        >
        </div>
    );
};

export default LiveCall;
