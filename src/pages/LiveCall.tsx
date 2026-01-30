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
    const zegoInstance = useRef<any>(null);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            navigate('/auth');
            return;
        }

        if (!APP_ID || isNaN(APP_ID)) {
            console.error("VITE_ZEGO_APP_ID is missing or not a number in .env");
            return;
        }
        if (!SERVER_SECRET) {
            console.error("VITE_ZEGO_SERVER_SECRET is missing in .env");
            return;
        }

        const myRoomId = roomId || 'default-room';

        if (!containerRef.current) {
            console.error("Zego container ref is null");
            return;
        }

        if (APP_ID && SERVER_SECRET) {
            try {
                // Generate a Kit Token
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    APP_ID,
                    SERVER_SECRET,
                    myRoomId,
                    user.id.toString(),
                    user.name || user.email.split('@')[0]
                );

                // Create instance object from Kit Token
                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zegoInstance.current = zp;

                if (!zp) {
                    console.error("Failed to create Zego instance");
                    return;
                }

                // Start the call
                setTimeout(() => {
                    if (!containerRef.current) return;
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
                        showScreenSharingButton: true,
                        onLeaveRoom: () => {
                            zegoInstance.current = null;
                            navigate(-1);
                        },
                    });
                }, 100);

            } catch (err) {
                console.error("ZegoCloud Error:", err);
            }
        }

        return () => {
            if (zegoInstance.current) {
                try {
                    zegoInstance.current.destroy();
                    zegoInstance.current = null;
                } catch (e) {
                    console.log("Zego cleanup info:", e);
                }
            }
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
