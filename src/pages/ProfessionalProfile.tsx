"use client"

import React, { useState, useEffect } from "react"
import {
    FaUser, FaEnvelope, FaShieldAlt, FaCamera, FaSave, FaSpinner,
    FaGraduationCap, FaBriefcase, FaCertificate
} from "react-icons/fa"
import ProfessionalHeader from "./ProfessionalHeader"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import AICompanion from "../components/AICompanion"

interface ProfessionalProfileData {
    // Identity
    display_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar?: string;

    // Professional Details
    specialization: string;
    years_of_experience: string;
    bio: string;
    qualifications: string[];
    languages: string[];
    license_number: string;
    id_image?: string | null;
    certificates?: string | null;
}

const ProfessionalProfile: React.FC = () => {
    const { theme } = useTheme()
    const { user, fetchWithAuth, isLoading: authLoading } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [profile, setProfile] = useState<ProfessionalProfileData>({
        display_name: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        avatar: "",
        specialization: "",
        years_of_experience: "",
        bio: "",
        qualifications: [],
        languages: ["English"],
        license_number: "",
        id_image: null,
        certificates: null
    })
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
    const [idImageFile, setIdImageFile] = useState<File | null>(null)
    const [certificateFile, setCertificateFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const getImageUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        if (path.startsWith('data:')) return path; // Handle base64 preview
        return `http://127.0.0.1:8000${path}`;
    };


    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return

            try {
                const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/me/')
                if (response.ok) {
                    const data = await response.json()
                    setProfile({
                        display_name: data.username || "",
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        avatar: data.profile_photo || null,
                        specialization: data.specialization || "Mental Health Specialist",
                        years_of_experience: data.years_of_experience || "5",
                        bio: data.bio || "I am dedicated to helping individuals find peace and clarity in their lives.",
                        languages: data.languages || ["English"],
                        license_number: data.license_number || "REG-99123-X",
                        qualifications: [],
                        id_image: data.id_image,
                        certificates: data.certificates
                    })
                }
            } catch (error) {
                console.error("Error fetching professional profile:", error)
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading) {
            fetchProfile()
        }
    }, [user, authLoading, fetchWithAuth])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('display_name', profile.display_name)
            formData.append('first_name', profile.first_name)
            formData.append('last_name', profile.last_name)
            formData.append('email', profile.email)
            formData.append('phone', profile.phone)
            formData.append('specialization', profile.specialization)
            formData.append('years_of_experience', profile.years_of_experience)
            formData.append('bio', profile.bio)
            formData.append('languages', JSON.stringify(profile.languages))
            formData.append('license_number', profile.license_number)

            if (profilePhotoFile) {
                formData.append('profile_photo', profilePhotoFile)
            }
            if (idImageFile) {
                formData.append('id_image', idImageFile)
            }
            if (certificateFile) {
                formData.append('certificates', certificateFile)
            }

            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/me/', {
                method: 'PATCH',
                body: formData
            })

            if (response.ok) {
                const updatedData = await response.json()
                setProfile(prev => ({
                    ...prev,
                    avatar: updatedData.profile_photo,
                    id_image: updatedData.id_image,
                    certificates: updatedData.certificates
                }))
                setProfilePhotoFile(null)
                setIdImageFile(null)
                setCertificateFile(null)
                setPreviewUrl(null)
                setMessage({ type: 'success', text: "Profile updated successfully!" })
            } else {
                setMessage({ type: 'error', text: "Failed to update profile." })
            }
        } catch (error) {
            setMessage({ type: 'error', text: "An error occurred while saving." })
        } finally {
            setSaving(false)
        }
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
                <div className={`p-2 rounded-xl ${theme === "dark" ? "bg-[#25A8A0]/10 text-[#25A8A0]" : "bg-teal-50 text-[#25A8A0]"}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h2>
            </div>
            {description && <p className={`text-sm ml-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{description}</p>}
        </div>
    )

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProfilePhotoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatar: reader.result as string }))
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIdImageFile(file)
        }
    }

    const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCertificateFile(file)
        }
    }

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-[#0B1120] text-gray-100" : "bg-[#F8FAFC] text-slate-900"}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Link to="/professionals" className="inline-block mb-8 text-sm font-black tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`text-4xl font-black mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Professional Profile</h1>
                        <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                            Manage your professional identity and expertise settings.
                        </p>
                    </div>
                    {message && (
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 shadow-sm ${message.type === 'success'
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSave}>
                    {/* Public Identity */}
                    <div className={`rounded-3xl p-8 shadow-xl mb-8 border transition-all ${theme === "dark" ? "bg-[#151C2C] border-white/5" : "bg-white border-slate-100"}`}>
                        <SectionTitle
                            icon={FaUser}
                            title="Public Identity"
                            description="How clients see you on the platform."
                        />

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 flex flex-col items-center">
                                <label className="relative group cursor-pointer mb-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    <img
                                        src={previewUrl || getImageUrl(profile.avatar || null) || `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=random`}
                                        alt="Profile"
                                        className={`w-40 h-40 rounded-3xl border-4 object-cover shadow-2xl transition-all ${theme === "dark" ? "border-white/10" : "border-slate-50"}`}
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaCamera className="text-white w-6 h-6" />
                                    </div>
                                </label>
                                <div className="text-center">
                                    <p className="text-xs font-black text-[#25A8A0] uppercase tracking-widest mb-1">Profile Photo</p>
                                    <p className="text-[10px] font-bold opacity-40">Visible to all potential clients</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-tighter mb-2 opacity-70">Full Display Name</label>
                                    <input
                                        type="text"
                                        value={profile.display_name}
                                        onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                                        className={`w-full px-5 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-[#25A8A0]/50 transition-all font-medium ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                        placeholder="e.g. Dr. Jane Smith"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-tighter mb-2 opacity-70">Specialization</label>
                                        <input
                                            type="text"
                                            value={profile.specialization}
                                            onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                                            className={`w-full px-5 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-[#25A8A0]/50 transition-all font-medium ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-tighter mb-2 opacity-70">Years of Experience</label>
                                        <input
                                            type="text"
                                            value={profile.years_of_experience}
                                            onChange={(e) => setProfile(prev => ({ ...prev, years_of_experience: e.target.value }))}
                                            className={`w-full px-5 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-[#25A8A0]/50 transition-all font-medium ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-tighter mb-2 opacity-70">Short Bio</label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                                        rows={4}
                                        className={`w-full px-5 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-[#25A8A0]/50 transition-all font-medium ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                        placeholder="Tell clients about your approach..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Credentials */}
                    <div className={`rounded-3xl p-8 shadow-xl mb-8 border transition-all ${theme === "dark" ? "bg-[#151C2C] border-white/5" : "bg-white border-slate-100"}`}>
                        <SectionTitle
                            icon={FaCertificate}
                            title="Credentials & Verification"
                            description="Maintain your professional standing and verification status."
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-3xl border ${theme === "dark" ? "bg-[#0B1120] border-white/5" : "bg-slate-50 border-slate-100 shadow-inner"}`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <FaBriefcase className="text-[#25A8A0]" />
                                    <span className="text-xs font-black uppercase tracking-widest text-[#25A8A0]">License Info</span>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 opacity-70">License / Registration Number</label>
                                    <input
                                        type="text"
                                        value={profile.license_number}
                                        onChange={(e) => setProfile(prev => ({ ...prev, license_number: e.target.value }))}
                                        className={`w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-[#25A8A0]/50 transition-all font-medium ${theme === "dark" ? "bg-gray-800 border-white/5 text-white" : "bg-white border-slate-200 text-slate-900"}`}
                                    />

                                    <div className="mt-4">
                                        <label className="block text-sm font-bold mb-2 opacity-70">ID Verify Image</label>
                                        <div className="flex flex-col gap-2">
                                            {profile.id_image && (
                                                <a href={getImageUrl(profile.id_image) || '#'} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#25A8A0] underline hover:text-teal-600 transition-colors">
                                                    View Current ID Document
                                                </a>
                                            )}
                                            <input
                                                type="file"
                                                onChange={handleIdImageChange}
                                                className={`text-xs p-2 rounded-lg border ${theme === "dark" ? "border-white/10 bg-white/5 text-gray-300" : "border-slate-200 bg-white"}`}
                                                accept="image/*"
                                            />
                                            {idImageFile && <span className="text-[10px] text-green-500 font-bold">New file selected: {idImageFile.name}</span>}
                                        </div>
                                    </div>

                                    <p className="text-[10px] font-bold uppercase tracking-tighter opacity-40 mt-3 italic">Verified licenses get a checkmark badge on profiles.</p>
                                </div>
                            </div>

                            <div className={`p-6 rounded-3xl border ${theme === "dark" ? "bg-[#0B1120] border-white/5" : "bg-slate-50 border-slate-100 shadow-inner"}`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <FaGraduationCap className="text-[#25A8A0]" />
                                    <span className="text-xs font-black uppercase tracking-widest text-[#25A8A0]">Education & Certificates</span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className={`px-4 py-3 rounded-xl border text-sm font-bold mb-2 ${theme === "dark" ? "bg-gray-800 border-white/5" : "bg-white border-slate-200 text-slate-700"}`}>
                                            Masters in Clinical Psychology
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 opacity-70">Professional Certificate</label>
                                        <div className="flex flex-col gap-2">
                                            {profile.certificates && (
                                                <a href={getImageUrl(profile.certificates) || '#'} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#25A8A0] underline hover:text-teal-600 transition-colors">
                                                    View Current Certificate
                                                </a>
                                            )}
                                            <input
                                                type="file"
                                                onChange={handleCertificateChange}
                                                className={`text-xs p-2 rounded-lg border ${theme === "dark" ? "border-white/10 bg-white/5 text-gray-300" : "border-slate-200 bg-white"}`}
                                                accept=".pdf,image/*"
                                            />
                                            {certificateFile && <span className="text-[10px] text-green-500 font-bold">New file selected: {certificateFile.name}</span>}
                                        </div>
                                    </div>

                                    <button type="button" className="text-xs font-black text-[#25A8A0] hover:underline uppercase tracking-widest">+ Add Degree</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Private Contact Info */}
                    <div className={`rounded-3xl p-8 shadow-xl mb-24 border transition-all ${theme === "dark" ? "bg-[#151C2C] border-white/5" : "bg-white border-slate-100"}`}>
                        <SectionTitle
                            icon={FaShieldAlt}
                            title="Private Details"
                            description="These details are never shared with clients."
                        />

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 opacity-70">Legal First Name</label>
                                <input
                                    type="text"
                                    value={profile.first_name}
                                    className={`w-full px-5 py-3 rounded-2xl border outline-none cursor-not-allowed opacity-50 font-medium ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-white" : "bg-slate-100 border-slate-200 text-slate-900"}`}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 opacity-70">Legal Last Name</label>
                                <input
                                    type="text"
                                    value={profile.last_name}
                                    className={`w-full px-5 py-3 rounded-2xl border outline-none cursor-not-allowed opacity-50 font-medium ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-white" : "bg-slate-100 border-slate-200 text-slate-900"}`}
                                    disabled
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-bold mb-2 opacity-70">Secure Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className={`w-full pl-12 pr-5 py-3 rounded-2xl border outline-none cursor-not-allowed opacity-50 font-medium ${theme === "dark" ? "bg-[#0B1120] border-white/5 text-white" : "bg-slate-100 border-slate-200 text-slate-900"}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className={`fixed bottom-0 left-0 right-0 p-5 border-t z-40 transition-all ${theme === "dark" ? "bg-[#0B1120]/80 backdrop-blur-md border-white/5" : "bg-white/80 backdrop-blur-md border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"}`}>
                        <div className="container mx-auto max-w-4xl flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-3 px-10 py-4 bg-[#25A8A0] text-white font-black rounded-2xl shadow-xl hover:shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 uppercase tracking-widest"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave className="text-xl" />}
                                Update Profile
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            <AICompanion />
        </div>
    )
}

export default ProfessionalProfile
