"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import DashboardHeader from "./DashboardHeader"

const CrisisSupport: React.FC = () => {
    const { theme } = useTheme()
    const [breathingActive, setBreathingActive] = useState(false)

    const toggleBreathing = () => {
        setBreathingActive(!breathingActive)
    }

    return (
        <div className={`min-h-screen transition-all duration-500 font-sans ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <DashboardHeader />

            <main className="container mx-auto px-6 py-12 max-w-5xl">
                <header className="mb-16 text-center">
                    <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Here for <span className="text-teal-500">You.</span>
                    </h1>
                    <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto leading-relaxed">
                        You are in a safe space. Choose the support that feels right for you at this moment.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Instant Chat Support */}
                    <div className={`p-10 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-xl shadow-teal-900/5'}`}>
                        <h2 className="text-3xl font-bold mb-4">Chat Support</h2>
                        <p className="text-lg opacity-70 mb-8 leading-relaxed">
                            Connect immediately with our AI Crisis Companion or request a live professional.
                            We are here to listen without judgment.
                        </p>
                        <div className="space-y-4">
                            <Link to="/ai-chat?mode=crisis" className="block w-full py-5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white text-center font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-teal-500/20">
                                Start Confidential Chat
                            </Link>
                            <button className={`block w-full py-5 rounded-2xl border-2 text-center font-bold text-lg transition-all ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                                Request Human Connection
                            </button>
                        </div>
                    </div>

                    {/* SOS & Safety Plan */}
                    <div className={`p-10 rounded-[2.5rem] transition-all duration-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
                        <h2 className="text-3xl font-bold mb-4">Your Safety</h2>
                        <p className="text-lg opacity-70 mb-8 leading-relaxed">
                            Access your personal safety plan or view your emergency contacts directly.
                        </p>

                        <div className="grid gap-4">
                            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-blue-100'}`}>
                                <h3 className="font-bold text-xl mb-2 text-blue-600">My Safety Plan</h3>
                                <p className="opacity-60 text-sm mb-4">Steps to cope when things get tough.</p>
                                <div className="h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-blue-500"></div>
                                </div>
                            </div>

                            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-red-100'}`}>
                                <h3 className="font-bold text-xl mb-2 text-red-500">Emergency Contacts</h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-bold">Mom</span>
                                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-bold">Therapist</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Breathing Exercise */}
                <div className={`w-full p-10 md:p-16 rounded-[3rem] text-center relative overflow-hidden transition-all duration-500 ${breathingActive ? (theme === 'dark' ? 'bg-teal-900/30' : 'bg-teal-50') : (theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-xl')}`}>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">Regulate your Breathing</h2>
                        <p className="text-lg opacity-60 max-w-xl mx-auto mb-12">
                            Follow the circle. Inhale as it expands, exhale as it contracts.
                        </p>

                        <div className="relative h-64 flex items-center justify-center mb-12">
                            <div
                                className={`w-32 h-32 rounded-full border-4 border-teal-500 transition-all duration-[4000ms] ease-in-out ${breathingActive ? 'scale-[2.5] bg-teal-500/10' : 'scale-100 bg-transparent'}`}
                            ></div>
                            <div className="absolute text-teal-600 font-bold tracking-widest uppercase">
                                {breathingActive ? 'Breathe' : 'Ready'}
                            </div>
                        </div>

                        <button
                            onClick={toggleBreathing}
                            className={`px-10 py-4 rounded-full font-bold text-lg transition-all ${breathingActive ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20'}`}
                        >
                            {breathingActive ? 'Stop Exercise' : 'Start Assessment'}
                        </button>
                    </div>
                </div>

                <footer className="mt-16 text-center opacity-40 text-sm">
                    <p>If you are in immediate physical danger, please call 911 or your local emergency number.</p>
                </footer>

            </main>
        </div>
    )
}

export default CrisisSupport
