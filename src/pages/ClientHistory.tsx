"use client"
import { API_BASE_URL } from "../config";

import React, { useState, useEffect } from "react"
import { FaUserMd, FaClock, FaCommentDots, FaSearch, FaHistory, FaVideo, FaMicrophone } from "react-icons/fa"
import DashboardHeader from "./DashboardHeader"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import AICompanion from "../components/AICompanion"
import { Link } from "react-router-dom"

const ClientHistory: React.FC = () => {
    const { theme } = useTheme()
    const { user, fetchWithAuth } = useAuth()
    const [sessions, setSessions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            try {
                const response = await fetchWithAuth(' + API_BASE_URL + '/api/auth/appointments/')

                if (response.ok) {
                    const appointments = await response.json()
                    const pastAppointments = appointments.map((appt: any) => {
                        // Mocking session type as Voice or Video since backend might not send it yet
                        // In a real scenario, this would come from the appointment object
                        const isVideo = Math.random() > 0.5;
                        return {
                            id: `ppt-${appt.id}`,
                            type: 'professional',
                            sessionType: isVideo ? 'Video Call' : 'Voice Call',
                            title: `Session with ${appt.professional_name}`,
                            provider: appt.professional_name,
                            date: `${appt.date}T${appt.time}`,
                            duration: '60 min',
                            status: 'completed',
                            notes: 'Regular check-in'
                        }
                    })

                    // Sort by date descending
                    pastAppointments.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    setSessions(pastAppointments)
                }
            } catch (error) {
                console.error("Error fetching history:", error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchHistory()
        }
    }, [user, fetchWithAuth])

    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.provider.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <h1 className="text-3xl font-bold">Session History</h1>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search history..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-10 pr-4 py-2.5 rounded-xl border outline-none w-full sm:w-64 transition-all ${theme === "dark"
                                    ? "bg-gray-800 border-gray-700 text-white focus:border-[#25A8A0]"
                                    : "bg-white border-gray-200 text-gray-900 focus:border-[#25A8A0]"
                                    }`}
                            />
                        </div>


                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredSessions.length > 0 ? (
                    <div className="space-y-4">
                        {filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className={`group p-6 rounded-2xl border transition-all hover:shadow-lg ${theme === "dark"
                                    ? "bg-gray-800 border-gray-700 hover:border-[#25A8A0]/50"
                                    : "bg-white border-gray-100 hover:border-[#25A8A0]/50"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Icon/Date */}
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold shadow-inner ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                                            }`}>
                                            <span className="text-xl text-[#25A8A0]">{new Date(session.date).getDate()}</span>
                                            <span className="text-[10px] uppercase opacity-60">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div className={`p-3 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600`}>
                                            <FaUserMd />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-lg truncate pr-4">{session.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${session.status === 'completed'
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {session.status}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ml-2">
                                                {session.sessionType === 'Video Call' ? <FaVideo /> : <FaMicrophone />}
                                                {session.sessionType}
                                            </span>
                                        </div>
                                        <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                            with {session.provider} • {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs font-medium opacity-70">
                                            <span className="flex items-center gap-1"><FaClock className="w-3 h-3" /> {session.duration}</span>
                                            <span className="flex items-center gap-1"><FaCommentDots className="w-3 h-3" /> {session.notes}</span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 flex-shrink-0">
                                        <Link
                                            to={`/booking`}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold text-center transition-all ${theme === "dark"
                                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                                }`}
                                        >
                                            View Details
                                        </Link>
                                        <button className="px-4 py-2 rounded-xl text-xs font-bold text-center bg-[#25A8A0] hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20 transition-all">
                                            Book Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                            <FaHistory className={`w-8 h-8 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
                        </div>
                        <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>No history found</h3>
                        <p className={`text-sm max-w-xs mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            Your completed sessions and chat history will appear here.
                        </p>
                    </div>
                )}
            </main>
            <AICompanion />
        </div>
    )
}

export default ClientHistory