"use client"

import React, { useState } from "react"
import { FaBell, FaLock, FaMoon, FaSun, FaToggleOn, FaToggleOff, FaChevronRight, FaClock, FaMoneyBillWave } from "react-icons/fa"
import ProfessionalHeader from "./ProfessionalHeader"
import { useTheme } from "../contexts/ThemeContext"
import AICompanion from "../components/AICompanion"
import { Link } from "react-router-dom"

const ProfessionalSettings: React.FC = () => {
    const { theme, toggleTheme } = useTheme()

    const [settings, setSettings] = useState({
        sessionAlerts: true,
        newRequestNotifications: true,
        emailReports: true,
        language: "English (US)",
        timezone: "UTC+3 (Nairobi)",
        instantSupportAvailable: true,
        autoAcceptConnections: false,
        publicProfileVisible: true
    })

    const toggleSetting = (key: keyof typeof settings) => {
        if (typeof settings[key] === 'boolean') {
            setSettings(prev => ({ ...prev, [key]: !prev[key] }))
        }
    }

    const SettingSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className={`rounded-3xl p-6 shadow-xl mb-6 border transition-all duration-300 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className={`p-2 rounded-xl ${theme === "dark" ? "bg-[#25A8A0]/10 text-[#25A8A0]" : "bg-teal-50 text-[#25A8A0]"}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h2>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    )

    const ToggleItem = ({ label, description, checked, onChange }: { label: string, description?: string, checked: boolean, onChange: () => void }) => (
        <div className="flex items-center justify-between">
            <div>
                <h3 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{label}</h3>
                {description && <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{description}</p>}
            </div>
            <button
                onClick={onChange}
                className={`text-2xl transition-all hover:scale-110 ${checked ? "text-[#25A8A0]" : "text-gray-300 dark:text-gray-600"}`}
            >
                {checked ? <FaToggleOn /> : <FaToggleOff />}
            </button>
        </div>
    )

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-[#0B1120] text-gray-100" : "bg-[#F8FAFC] text-slate-900"}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Link to="/professionals" className="inline-block mb-8 text-sm font-black tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <h1 className={`text-4xl font-black mb-10 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Professional Settings</h1>

                <SettingSection title="Work Preferences" icon={FaClock}>
                    <ToggleItem
                        label="Instant Support Availability"
                        description="Allow clients to reach out to you for immediate sessions"
                        checked={settings.instantSupportAvailable}
                        onChange={() => toggleSetting('instantSupportAvailable')}
                    />
                    <ToggleItem
                        label="Auto-Accept Connection Requests"
                        description="Automatically accept new client connection requests"
                        checked={settings.autoAcceptConnections}
                        onChange={() => toggleSetting('autoAcceptConnections')}
                    />
                </SettingSection>

                <SettingSection title="Notifications" icon={FaBell}>
                    <ToggleItem
                        label="Upcoming Session Alerts"
                        description="Get notified 15 minutes before a session starts"
                        checked={settings.sessionAlerts}
                        onChange={() => toggleSetting('sessionAlerts')}
                    />
                    <ToggleItem
                        label="New Request Notifications"
                        description="Get real-time alerts for new client requests"
                        checked={settings.newRequestNotifications}
                        onChange={() => toggleSetting('newRequestNotifications')}
                    />
                </SettingSection>

                <SettingSection title="Payouts & Billing" icon={FaMoneyBillWave}>
                    <div className="flex items-center justify-between cursor-pointer group">
                        <div>
                            <h3 className={`font-black uppercase tracking-tighter ${theme === "dark" ? "text-gray-200" : "text-slate-700"}`}>Manage Payout Account</h3>
                            <p className={`text-xs font-medium mt-1 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`}>Configure where you receive your payments</p>
                        </div>
                        <FaChevronRight className="text-gray-400 group-hover:text-[#25A8A0] translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className={`border-t pt-6 ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
                        <div className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <h3 className={`font-black uppercase tracking-tighter ${theme === "dark" ? "text-gray-200" : "text-slate-700"}`}>View Earnings History</h3>
                                <p className={`text-xs font-medium mt-1 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`}>Track your monthly and annual earnings</p>
                            </div>
                            <FaChevronRight className="text-gray-400 group-hover:text-[#25A8A0] translate-x-0 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </SettingSection>

                <SettingSection title="Privacy & Security" icon={FaLock}>
                    <ToggleItem
                        label="Public Profile Visibility"
                        description="Control if your profile appears in public search results"
                        checked={settings.publicProfileVisible}
                        onChange={() => toggleSetting('publicProfileVisible')}
                    />
                    <div className={`border-t pt-6 mt-6 ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
                        <div className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <h3 className={`font-black uppercase tracking-tighter ${theme === "dark" ? "text-gray-200" : "text-slate-700"}`}>Account Security</h3>
                                <p className={`text-xs font-medium mt-1 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`}>Change password and manage 2FA settings</p>
                            </div>
                            <FaChevronRight className="text-gray-400 group-hover:text-[#25A8A0] translate-x-0 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </SettingSection>

                <SettingSection title="Appearance" icon={theme === 'dark' ? FaMoon : FaSun}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`font-black uppercase tracking-tighter ${theme === "dark" ? "text-gray-200" : "text-slate-700"}`}>Display Theme</h3>
                            <p className={`text-xs font-medium mt-1 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`}>Current: {theme === 'dark' ? 'Dark' : 'Light'} Mode</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`flex items-center gap-3 px-8 py-3 rounded-2xl border shadow-sm transition-all font-black uppercase tracking-widest text-[10px] ${theme === "dark"
                                ? "bg-[#0B1120] border-white/5 text-white hover:bg-[#25A8A0] shadow-black/20"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-[#25A8A0] hover:text-[#25A8A0]"
                                }`}
                        >
                            {theme === 'dark' ? <FaMoon /> : <FaSun className="text-orange-500" />}
                            Switch Theme
                        </button>
                    </div>
                </SettingSection>

                <div className="flex justify-end pt-8 pb-24">
                    <button className="px-10 py-4 bg-[#25A8A0] text-white font-black rounded-2xl shadow-xl hover:shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                        Save Preferences
                    </button>
                </div>
            </main>
            <AICompanion />
        </div>
    )
}

export default ProfessionalSettings
