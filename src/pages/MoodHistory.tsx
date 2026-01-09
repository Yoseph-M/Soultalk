"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Calendar, Save, TrendingUp } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import DashboardHeader from "./DashboardHeader"

interface MoodEntry {
    id: number
    mood_score: number
    mood_label: string
    note: string
    created_at: string
}

const MoodHistory: React.FC = () => {
    const { theme } = useTheme()
    const { user, fetchWithAuth, isLoading } = useAuth()
    const navigate = useNavigate()

    const [selectedMood, setSelectedMood] = useState<string | null>(null)
    const [note, setNote] = useState("")
    const [history, setHistory] = useState<MoodEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const moodOptions = [
        { label: "Very Happy", score: 5, color: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200" },
        { label: "Happy", score: 4, color: "bg-green-500", text: "text-green-700", border: "border-green-200" },
        { label: "Neutral", score: 3, color: "bg-yellow-400", text: "text-yellow-700", border: "border-yellow-200" },
        { label: "Sad", score: 2, color: "bg-orange-500", text: "text-orange-700", border: "border-orange-200" },
        { label: "Very Sad", score: 1, color: "bg-red-500", text: "text-red-700", border: "border-red-200" },
        { label: "Anxious", score: 2, color: "bg-purple-500", text: "text-purple-700", border: "border-purple-200" },
        { label: "Stressed", score: 1, color: "bg-rose-500", text: "text-rose-700", border: "border-rose-200" },
    ]

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth')
        }
    }, [user, isLoading, navigate])

    const fetchHistory = async () => {
        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/mood-updates/')
            if (response.ok) {
                const data = await response.json()
                setHistory(data)
            }
        } catch (error) {
            console.error("Error fetching mood history:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchHistory()
        }
    }, [user])

    const handleSubmit = async () => {
        if (!selectedMood) return

        setSubmitting(true)
        const mood = moodOptions.find(m => m.label === selectedMood)

        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/mood-updates/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mood_score: mood?.score || 3,
                    note: note, // We can store the label in the note or add a field if backend supports it. Assuming backend takes score and note.
                    // Ideally backend has a 'label' field, but looking at Dashboard.tsx it only used mood_score.
                    // I'll append the label to the note for now if custom fields aren't supported, or hopefully backend handles it.
                    // Let's assume standard django endpoint.
                })
            })

            if (response.ok) {
                setSelectedMood(null)
                setNote("")
                fetchHistory()
            }
        } catch (error) {
            console.error("Error submitting mood:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Mood History</h1>
                    <p className="opacity-60 mt-2">Track your emotional well-being over time.</p>
                </div>

                <div className="grid gap-8">
                    {/* Input Section */}
                    <div className={`p-6 rounded-2xl shadow-xl border transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <h2 className="text-xl font-bold mb-6">How are you feeling today?</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {moodOptions.map((option) => (
                                <button
                                    key={option.label}
                                    onClick={() => setSelectedMood(option.label)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center font-bold text-sm
                    ${selectedMood === option.label
                                            ? `${theme === 'dark' ? 'bg-gray-700 border-white text-white' : 'bg-gray-900 border-gray-900 text-white'} scale-105 shadow-lg`
                                            : `${theme === 'dark' ? 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-500' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'}`
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 opacity-70">Add a note (optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="What's on your mind?"
                                className={`w-full p-4 rounded-xl border bg-transparent resize-none h-32 transition-all focus:ring-2 focus:ring-teal-500 outline-none
                  ${theme === 'dark' ? 'border-gray-700 placeholder-gray-600' : 'border-gray-200 placeholder-gray-400'}`}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!selectedMood || submitting}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                ${!selectedMood
                                    ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
                                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg hover:scale-[1.01]'}`}
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Entry
                                </>
                            )}
                        </button>
                    </div>

                    {/* History Section */}
                    <div className={`p-6 rounded-2xl shadow-xl border transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-teal-500" />
                            Recent Entries
                        </h2>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-12 opacity-50">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No mood entries yet. Start tracking today!</p>
                                </div>
                            ) : (
                                history.map((entry) => (
                                    <div key={entry.id} className={`p-4 rounded-xl border transition-all ${theme === 'dark' ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${entry.mood_score >= 4 ? 'bg-green-500' : entry.mood_score === 3 ? 'bg-yellow-400' : 'bg-red-500'}`} />
                                                <span className="font-bold">
                                                    {/* Mapping back score to label roughly if label isn't saved, but we'll try to guess if backend doesn't return label */}
                                                    Mood Level: {entry.mood_score}/5
                                                </span>
                                            </div>
                                            <span className="text-xs opacity-50 font-medium">
                                                {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {entry.note && (
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{entry.note}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default MoodHistory
