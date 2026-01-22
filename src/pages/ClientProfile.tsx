"use client"
import { API_BASE_URL } from "../config";

import React, { useState, useEffect, useRef } from "react"
import {
    FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaCamera, FaSave, FaSpinner,
    FaUserSecret, FaLock, FaChartLine
} from "react-icons/fa"
import DashboardHeader from "./DashboardHeader"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import AICompanion from "../components/AICompanion"

interface ProfileData {
    // Identity
    display_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar?: string;

    // Preferences
    language: string;
    communication_preference: ('chat' | 'voice' | 'video')[];
    support_type: ('professional' | 'listener' | 'ai')[];
    topics: string[];

    // Privacy
    is_anonymous: boolean;
    profile_visibility: 'public' | 'professional_only' | 'private';
}

const ClientProfile: React.FC = () => {
    const { theme } = useTheme()
    const { user, fetchWithAuth, refreshUser, updateUser, isLoading: authLoading } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [profile, setProfile] = useState<ProfileData>({
        display_name: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        avatar: "",
        language: "English",
        communication_preference: ['chat'],
        support_type: ['professional', 'ai'],
        topics: [],
        is_anonymous: false,
        profile_visibility: 'professional_only'
    })

    // Topics specific to mental health
    const availableTopics = [
        "Anxiety", "Depression", "Relationships", "Stress", "Career",
        "Trauma", "Self-esteem", "Grief", "Sleep", "Mindfulness"
    ]

    const getImageUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        if (path.startsWith('data:')) return path;
        return `${API_BASE_URL}${path}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return

            try {
                const response = await fetchWithAuth(API_BASE_URL + '/api/auth/me/')
                if (response.ok) {
                    const data = await response.json()
                    setProfile(prev => ({
                        ...prev,
                        display_name: data.username || "", // Assuming username is display name for now
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        avatar: data.profile_photo || null,
                        // Mocking these for now as backend might not have them yet
                        language: data.language || "English",
                        communication_preference: data.communication_preference || ['chat'],
                        topics: data.topics || [],
                        is_anonymous: data.is_anonymous || false
                    }))
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading) {
            fetchProfile()
        }
    }, [user, authLoading, fetchWithAuth])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProfilePhotoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('first_name', profile.first_name)
            formData.append('last_name', profile.last_name)
            formData.append('phone', profile.phone)
            formData.append('display_name', profile.display_name)
            formData.append('is_anonymous', String(profile.is_anonymous))

            if (profilePhotoFile) {
                formData.append('profile_photo', profilePhotoFile)
            }

            const response = await fetchWithAuth(API_BASE_URL + '/api/auth/me/', {
                method: 'PATCH',
                body: formData
            })

            if (response.ok) {
                await refreshUser();
                if (previewUrl) {
                    updateUser({ avatar: previewUrl });
                }
                setMessage({ type: 'success', text: 'Changes saved successfully.' })
            } else {
                const errorData = await response.json();
                setMessage({ type: 'error', text: `Failed to save changes: ${JSON.stringify(errorData)}` })
            }
        } catch (error) {
            console.error("Profile update error:", error)
            setMessage({ type: 'error', text: 'An error occurred while saving profile.' })
        } finally {
            setSaving(false)
        }
    }

    const toggleListSelection = (list: any[], item: any, field: keyof ProfileData) => {
        const newList = list.includes(item)
            ? list.filter(i => i !== item)
            : [...list, item]
        setProfile(prev => ({ ...prev, [field]: newList }))
    }

    if (authLoading || (loading && user)) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                <FaSpinner className="w-8 h-8 animate-spin text-[#25A8A0]" />
            </div>
        )
    }

    const SectionTitle = ({ icon: Icon, title, description }: { icon: any, title: string, description?: string }) => (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
                <div className={`p-2 rounded-xl ${theme === "dark" ? "bg-gray-700/50 text-[#25A8A0]" : "bg-teal-50 text-[#25A8A0]"}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h2>
            </div>
            {description && <p className={`text-sm ml-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{description}</p>}
        </div>
    )

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Link */}
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            Manage your identity, preferences, and privacy settings securely.
                        </p>
                    </div>
                    {message && (
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 ${message.type === 'success'
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSave}>

                    {/* Identity & Personal Info */}
                    <div className={`rounded-3xl p-8 shadow-xl mb-8 transition-all ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                        <SectionTitle
                            icon={FaUser}
                            title="Identity & Personal Information"
                            description="Manage how you appear to others and your private contact details."
                        />

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Avatar Column */}
                            <div className="md:col-span-1 flex flex-col items-center">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative group cursor-pointer mb-4"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <img
                                        src={previewUrl || getImageUrl(profile.avatar || null) || `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=random`}
                                        alt="Profile"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=random`;
                                        }}
                                        className={`w-36 h-36 rounded-3xl border-4 object-cover shadow-2xl transition-all duration-300 group-hover:scale-[1.02] ${theme === "dark" ? "border-white/10" : "border-gray-100"}`}
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <FaCamera className="text-white w-8 h-8 transform group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs font-black text-[#25A8A0] uppercase tracking-widest mb-2 hover:underline"
                                    >
                                        Change Photo
                                    </button>
                                    <p className="text-[10px] opacity-40 font-bold">Square images work best</p>
                                </div>
                            </div>

                            {/* Fields Column */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Public Info */}
                                <div className={`p-4 rounded-2xl border ${theme === "dark" ? "bg-gray-700/30 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaUserSecret className="text-[#25A8A0]" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Public Profile</span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 opacity-80">Display Name / Nickname</label>
                                        <input
                                            type="text"
                                            value={profile.display_name}
                                            onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                                            className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-[#25A8A0] transition-all ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
                                                }`}
                                            placeholder="How others see you..."
                                        />
                                    </div>
                                </div>

                                {/* Private Info */}
                                <div className={`p-4 rounded-2xl border ${theme === "dark" ? "bg-gray-700/30 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaLock className="text-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Private Information (Encrypted)</span>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 opacity-80">First Name</label>
                                            <input
                                                type="text"
                                                value={profile.first_name}
                                                onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                                                className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-[#25A8A0] transition-all ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 opacity-80">Last Name</label>
                                            <input
                                                type="text"
                                                value={profile.last_name}
                                                onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                                                className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-[#25A8A0] transition-all ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
                                                    }`}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium mb-1.5 opacity-80">Email Address</label>
                                            <div className="relative">
                                                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className={`w-full pl-10 pr-4 py-2 rounded-xl border outline-none cursor-not-allowed opacity-60 ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium mb-1.5 opacity-80">Phone Number</label>
                                            <div className="relative">
                                                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                                    className={`w-full pl-10 pr-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-[#25A8A0] transition-all ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Privacy & Safety */}
                    <div className={`rounded-3xl p-8 shadow-xl mb-8 transition-all ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                        <SectionTitle
                            icon={FaShieldAlt}
                            title="Privacy, Safety & Controls"
                            description="You are in control. adjust your safety settings anytime."
                        />

                        <div className="space-y-4">
                            <div className={`flex items-start justify-between p-4 rounded-2xl border ${theme === "dark" ? "bg-gray-700/30 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <FaUserSecret className={`w-6 h-6 ${profile.is_anonymous ? "text-[#25A8A0]" : "text-gray-400"}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base">Anonymous Mode</h3>
                                        <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                            Hide your real name from trained listeners. Professionals will still see your legal name for medical records.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer" onClick={() => setProfile(prev => ({ ...prev, is_anonymous: !prev.is_anonymous }))}>
                                    <input type="checkbox" className="sr-only peer" checked={profile.is_anonymous} readOnly />
                                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${profile.is_anonymous ? "bg-[#25A8A0]" : "bg-gray-200 dark:bg-gray-600"
                                        }`}></div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-2xl border ${theme === "dark" ? "bg-gray-700/30 border-gray-700" : "bg-white border-gray-100"}`}>
                                <span className="font-medium">Data Sharing for Research (Anonymized)</span>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25A8A0]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emotional Journey / Insights Widget */}
                    <div className={`rounded-3xl p-8 shadow-xl mb-20 transition-all ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                        <SectionTitle
                            icon={FaChartLine}
                            title="My Emotional Journey"
                            description="A private reflection of your progress."
                        />
                        <div className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center ${theme === "dark" ? "bg-gradient-to-r from-gray-700 to-gray-800" : "bg-gradient-to-r from-blue-50 to-teal-50"}`}>
                            <p className="text-xl font-medium italic mb-2">"You have checked in 5 days in a row!"</p>
                            <p className="text-sm opacity-70 mb-4">Consistency is key to understanding yourself.</p>
                            <button type="button" className="text-[#25A8A0] font-bold text-sm hover:underline">View Full Insights Report →</button>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className={`fixed bottom-0 left-0 right-0 p-4 border-t z-40 transition-all ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                        <div className="container mx-auto max-w-4xl flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-[#25A8A0] text-white font-bold rounded-xl shadow-lg hover:shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:scale-100"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                Save All Changes
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            <AICompanion />
        </div>
    )
}

export default ClientProfile