"use client"
import { API_BASE_URL } from "../config";

import React, { useState, useEffect } from "react"
import { FaCommentDots, FaSearch, FaHistory, FaVideo, FaChevronRight } from "react-icons/fa"
import ProfessionalHeader from "./ProfessionalHeader"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import AICompanion from "../components/AICompanion"
import { Link } from "react-router-dom"

const ProfessionalHistory: React.FC = () => {
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
                    const pastAppointments = appointments.map((appt: any) => ({
                        id: appt.id,
                        clientName: appt.client_name || 'Anonymous Client',
                        date: `${appt.date}T${appt.time}`,
                        status: appt.status,
                        type: 'Video Call',
                        duration: '50 min',
                        notes: appt.notes || 'No notes provided'
                    }))
                    pastAppointments.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    setSessions(pastAppointments)
                }
            } catch (error) {
                console.error("Error fetching professional history:", error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchHistory()
        }
    }, [user, fetchWithAuth])

    const filteredSessions = sessions.filter(session =>
        session.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-[#0B1120] text-gray-100" : "bg-[#F8FAFC] text-slate-900"}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <Link to="/professionals" className="inline-block mb-8 text-sm font-black tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className={`text-4xl font-black mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Session History</h1>
                        <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                            Review your past sessions and clinical notes.
                        </p>
                    </div>

                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by client name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-12 pr-6 py-4 rounded-2xl border outline-none w-full sm:w-80 transition-all font-medium ${theme === "dark"
                                ? "bg-[#151C2C] border-white/5 text-white focus:border-[#25A8A0] focus:ring-4 focus:ring-[#25A8A0]/10"
                                : "bg-white border-slate-200 text-slate-900 focus:border-[#25A8A0] focus:ring-4 focus:ring-[#25A8A0]/5 shadow-sm"
                                }`}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredSessions.length > 0 ? (
                    <div className="grid gap-6">
                        {filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className={`group p-6 rounded-3xl border transition-all hover:shadow-2xl shadow-sm ${theme === "dark"
                                    ? "bg-[#151C2C] border-white/5 hover:border-[#25A8A0]/30 shadow-black/20"
                                    : "bg-white border-slate-100 hover:border-teal-200"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-8">
                                    <div className="flex items-center gap-5 flex-shrink-0">
                                        <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black shadow-inner border ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-[#25A8A0]" : "bg-slate-50 border-slate-100 text-[#25A8A0]"
                                            }`}>
                                            <span className="text-2xl leading-none">{new Date(session.date).getDate()}</span>
                                            <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div className="relative">
                                            <img src={`https://ui-avatars.com/api/?name=${session.clientName}&background=random`} className="w-14 h-14 rounded-2xl border-2 border-white dark:border-white/5 shadow-md" alt="" />
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25A8A0] border-2 border-white dark:border-[#151C2C] rounded-full flex items-center justify-center">
                                                <FaVideo className="text-[8px] text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                                            <h3 className={`font-black text-xl truncate ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{session.clientName}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${session.status === 'completed'
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                    : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                                                    }`}>
                                                    {session.status}
                                                </span>
                                                <span className="flex items-center gap-2 text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 uppercase">
                                                    {session.type}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={`text-sm font-bold uppercase tracking-tighter mb-3 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                                            {new Date(session.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration}
                                        </p>
                                        <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium italic ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-gray-400" : "bg-slate-50 border-slate-100 text-slate-600"}`}>
                                            <FaCommentDots className="w-4 h-4 mt-1 flex-shrink-0 text-[#25A8A0]" />
                                            <span className="line-clamp-2 md:line-clamp-none">"{session.notes}"</span>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <button className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === "dark"
                                            ? "bg-white text-[#0B1120] hover:bg-[#25A8A0] hover:text-white"
                                            : "bg-slate-900 text-white hover:bg-[#25A8A0] shadow-xl shadow-slate-900/10 hover:shadow-[#25A8A0]/20"
                                            }`}>
                                            Session Details
                                            <FaChevronRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-24 rounded-[3rem] border-4 border-dashed animate-fadeIn ${theme === "dark" ? "bg-[#151C2C]/50 border-white/5" : "bg-white border-slate-100"}`}>
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl ${theme === "dark" ? "bg-[#0B1120] text-gray-800" : "bg-slate-50 text-slate-200"}`}>
                            <FaHistory className="w-10 h-10" />
                        </div>
                        <h3 className={`text-2xl font-black mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>No history found</h3>
                        <p className={`text-sm font-medium max-w-sm mx-auto opacity-50 px-6`}>
                            Your completed sessions and therapeutic records will be securely archived here automatically.
                        </p>
                    </div>
                )}
            </main>
            <AICompanion />
        </div>
    )
}

export default ProfessionalHistory