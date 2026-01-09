import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface MoodTrackerProps {
    currentMood: number;
    onMoodSelect: (mood: number) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ currentMood, onMoodSelect }) => {
    const { theme } = useTheme();

    const moods = [
        { value: 1, label: 'Very Low', icon: '😔', color: 'bg-red-500' },
        { value: 2, label: 'Low', icon: '😕', color: 'bg-orange-500' },
        { value: 3, label: 'Neutral', icon: '😐', color: 'bg-yellow-500' },
        { value: 4, label: 'Good', icon: '🙂', color: 'bg-green-500' },
        { value: 5, label: 'Excellent', icon: '😁', color: 'bg-emerald-500' },
    ];

    return (
        <div className="flex flex-col items-center">
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-white'}`}>How are you feeling today?</h3>
            <div className="flex gap-4 justify-center flex-wrap">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        onClick={() => onMoodSelect(mood.value)}
                        className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${currentMood === mood.value
                            ? `${mood.color} text-white shadow-lg shadow-white/20 ring-2 ring-white/50`
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                    >
                        <span className="text-3xl mb-1">{mood.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{mood.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodTracker;
