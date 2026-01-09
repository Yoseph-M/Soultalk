"use client"

import React, { useState } from "react"
import { FaBell, FaLock, FaGlobe, FaMoon, FaSun, FaToggleOn, FaToggleOff, FaChevronRight } from "react-icons/fa"
import DashboardHeader from "./DashboardHeader"
import { useTheme } from "../contexts/ThemeContext"
import AICompanion from "../components/AICompanion"

import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next'

const ClientSettings: React.FC = () => {
    const { theme, toggleTheme } = useTheme()
    const { t, i18n } = useTranslation()

    // Mock settings state - in a real app, fetch from user preferences API
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        timezone: "UTC-5 (Eastern Time)",
        twoFactor: false,
        profileVisibility: "Private"
    })

    const toggleSetting = (key: keyof typeof settings) => {
        // If it's a boolean setting, toggle it
        if (typeof settings[key] === 'boolean') {
            setSettings(prev => ({ ...prev, [key]: !prev[key] }))
        }
    }

    const SettingSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className={`rounded-3xl p-6 shadow-xl mb-6 transition-all duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className={`p-2 rounded-xl ${theme === "dark" ? "bg-gray-700 text-[#25A8A0]" : "bg-teal-50 text-[#25A8A0]"}`}>
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
                className={`text-2xl transition-colors ${checked ? "text-[#25A8A0]" : "text-gray-300 dark:text-gray-600"}`}
            >
                {checked ? <FaToggleOn /> : <FaToggleOff />}
            </button>
        </div>
    )

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Link */}
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← {t('back_to_dashboard')}
                </Link>

                <h1 className="text-3xl font-bold mb-8">{t('settings')}</h1>

                <SettingSection title={t('appearance')} icon={theme === 'dark' ? FaMoon : FaSun}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>Theme</h3>
                            <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                Switch between light and dark mode
                            </p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            {theme === 'dark' ? (
                                <>
                                    <FaMoon className="w-4 h-4 text-[#25A8A0]" />
                                    <span>Dark Mode</span>
                                </>
                            ) : (
                                <>
                                    <FaSun className="w-4 h-4 text-orange-500" />
                                    <span>Light Mode</span>
                                </>
                            )}
                        </button>
                    </div>
                </SettingSection>

                <SettingSection title="Notifications" icon={FaBell}>
                    <ToggleItem
                        label="Email Notifications"
                        description="Receive updates about your sessions and account via email"
                        checked={settings.emailNotifications}
                        onChange={() => toggleSetting('emailNotifications')}
                    />
                    <ToggleItem
                        label="Push Notifications"
                        description="Get real-time alerts on your device"
                        checked={settings.pushNotifications}
                        onChange={() => toggleSetting('pushNotifications')}
                    />
                    <ToggleItem
                        label="Marketing Emails"
                        description="Receive news, updates, and special offers"
                        checked={settings.marketingEmails}
                        onChange={() => toggleSetting('marketingEmails')}
                    />
                </SettingSection>

                <SettingSection title="Privacy & Security" icon={FaLock}>
                    <ToggleItem
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                        checked={settings.twoFactor}
                        onChange={() => toggleSetting('twoFactor')}
                    />
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                        <div className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <h3 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>Change Password</h3>
                                <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Update your password securely</p>
                            </div>
                            <FaChevronRight className="text-gray-400 group-hover:text-[#25A8A0] transition-colors" />
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <h3 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>Active Sessions</h3>
                                <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>View and manage devices logged into your account</p>
                            </div>
                            <FaChevronRight className="text-gray-400 group-hover:text-[#25A8A0] transition-colors" />
                        </div>
                    </div>
                </SettingSection>

                <SettingSection title={t('localization')} icon={FaGlobe}>
                    <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{t('language')}</h3>
                        <select
                            value={i18n.language?.split('-')[0] || 'en'}
                            className={`px-4 py-2 rounded-xl text-sm border outline-none cursor-pointer ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-200 text-gray-900"
                                }`}
                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                        >
                            <option value="en">English (US)</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <h3 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>Timezone</h3>
                        <select
                            value={settings.timezone}
                            className={`px-4 py-2 rounded-xl text-sm border outline-none cursor-pointer ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-200 text-gray-900"
                                }`}
                            onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        >
                            <option>UTC-5 (Eastern Time)</option>
                            <option>UTC-8 (Pacific Time)</option>
                            <option>UTC+0 (GMT)</option>
                            <option>UTC+1 (CET)</option>
                        </select>
                    </div>
                </SettingSection>

                <div className="flex justify-end pt-4">
                    <button className="text-red-500 text-sm font-bold hover:text-red-600 hover:underline">
                        Delete Account
                    </button>
                </div>

            </main>
            <AICompanion />
        </div>
    )
}

export default ClientSettings
