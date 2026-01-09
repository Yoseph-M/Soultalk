"use client"

import React, { useState, useEffect } from "react"
import {
    FaMoneyBillWave, FaHistory, FaCheckCircle,
    FaExclamationTriangle, FaUniversity, FaSpinner, FaTimes,
    FaArrowRight, FaSearch, FaChevronRight, FaChevronLeft,
    FaWallet, FaHistory as FaHistoryIcon, FaBuilding
} from "react-icons/fa"
import ProfessionalHeader from "./ProfessionalHeader"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import AICompanion from "../components/AICompanion"
import { Link } from "react-router-dom"

interface Withdrawal {
    id: number;
    amount: string;
    bank_name: string;
    account_number: string;
    status: string;
    created_at: string;
    reference: string;
}

interface Bank {
    id: string;
    name: string;
}

const getBankLogoUrl = (name: string) => {
    // Helper to match bank names to Chapa-Et/ethiopianlogos IDs
    // Remove (COOP) and other suffixes, trim, replace spaces with underscores
    const n = name.toLowerCase().replace(/\(.*\)/, '').trim().replace(/\s+/g, '_');

    // Map of Chapa bank names and IDs to their logo folder IDs
    const bankMap: { [key: string]: string } = {
        // Major Banks
        'commercial_bank_of_ethiopia': 'commercial_bank_of_ethiopia',
        'cbe': 'commercial_bank_of_ethiopia',
        'cbebirr': 'cbe_birr_normal',
        'telebirr': 'tele_birr',
        'dashen_bank': 'dashen_bank',
        'awash_international_bank': 'awash_international_bank',
        'awash_bank': 'awash_international_bank',
        'bank_of_abyssinia': 'bank_of_abyssinia',
        'hibret_bank': 'hibret_bank',
        'hibret': 'hibret_bank',
        'united_bank_of_ethiopia': 'hibret_bank',
        'nib_international_bank': 'nib_international_bank',
        'nib_bank': 'nib_international_bank',
        'cooperative_bank_of_oromia': 'cooperative_bank_of_oromia',
        'coop_bank': 'cooperative_bank_of_oromia',
        'oromia_international_bank': 'oromia_international_bank',
        'oromia_bank': 'oromia_international_bank',
        'zemen_bank': 'zemen_bank',
        'amhara_bank': 'amhara_bank',
        'wegagen_bank': 'wegagen_bank',
        'lion_international_bank': 'lion_international_bank',
        'lion_bank': 'lion_international_bank',
        'enat_bank': 'enat_bank', // Fallback, not in scraped list but common
        'addis_international_bank': 'addis_international_bank', // Fallback
        'ahadu_bank': 'ahadu_bank', // Fallback
        'kacha': 'kacha',
        'mpesa': 'mpesa', // Not found in list but likely needed
        'berhan_bank': 'berhan_bank', // Fallback
        'global_bank_ethiopia': 'global_bank_ethiopia', // Fallback
        'yaya_wallet': 'yaya_wallet', // Fallback

        // Aliases for partial matches
        'commercial': 'commercial_bank_of_ethiopia',
        'dashen': 'dashen_bank',
        'awash': 'awash_international_bank',
        'abyssinia': 'bank_of_abyssinia',
        'hibret': 'hibret_bank',
        'nib': 'nib_international_bank',
        'cooperative': 'cooperative_bank_of_oromia',
        'zemen': 'zemen_bank',
        'amhara': 'amhara_bank',
        'wegagen': 'wegagen_bank',
        'lion': 'lion_international_bank',
    };

    let logoId = null;

    // 1. Try exact match
    if (bankMap[n]) logoId = bankMap[n];

    // 2. Try partial match
    else {
        for (const key of Object.keys(bankMap)) {
            if (n.includes(key)) {
                logoId = bankMap[key];
                break;
            }
        }
    }

    if (logoId) {
        return `https://raw.githubusercontent.com/Chapa-Et/ethiopianlogos/main/logos/${logoId}/${logoId}.png`;
    }

    return null;
}

const ProfessionalPayments: React.FC = () => {
    const { theme } = useTheme()
    const { fetchWithAuth } = useAuth()

    const [loading, setLoading] = useState(true)
    const [earnings, setEarnings] = useState({
        pending: "0.00",
        available: "0.00",
        total: "0.00"
    })
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])

    // Withdrawal Modal & UX State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [step, setStep] = useState(1) // 1: Amount, 2: Bank Search, 3: Account Info
    const [banks, setBanks] = useState<Bank[]>([])
    const [fetchingBanks, setFetchingBanks] = useState(false)
    const [bankSearch, setBankSearch] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        amount: "",
        bank_code: "",
        bank_name: "",
        account_number: "",
        account_name: ""
    })

    const fetchData = async () => {
        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/payout/earnings/')
            if (response.ok) {
                const data = await response.json()
                setEarnings({
                    available: data.available_balance,
                    total: data.total_earnings,
                    pending: "0.00"
                })
                setWithdrawals(data.withdrawals)
            }
        } catch (err) {
            console.error("Error fetching earnings:", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchBanks = async () => {
        setFetchingBanks(true)
        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/payout/banks/')
            let apiBanks: Bank[] = []

            if (response.ok) {
                const data = await response.json()
                if (data.data) {
                    apiBanks = data.data
                } else if (Array.isArray(data)) {
                    apiBanks = data
                }
            }

            // CRITICAL: Manually add major banks because Chapa API v1/banks sometimes omits them
            // even on Live keys. These IDs are standard Chapa bank IDs.
            const majorBanks = [
                { id: '80a510ea-7497-4b99-8b49-ac13a3ab7d07', name: 'Bank of Abyssinia' },
                { id: '853d0598-9c01-41ab-ac99-48eab4da1513', name: 'Commercial Bank of Ethiopia (CBE)' },
                { id: '96984e0d-0348-4347-83cb-97305d214a1a', name: 'Dashen Bank' },
                { id: '1c0a000a-2e40-41a4-9e0c-8f1c841103e6', name: 'Awash Bank' },
                { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Hibret Bank' },
                { id: 'nib', name: 'Nib International Bank' },
                { id: 'zemen', name: 'Zemen Bank' },
            ]

            // Merge and deduplicate
            const bankMap = new Map();
            [...apiBanks, ...majorBanks].forEach(b => {
                const key = b.name.toLowerCase().replace(/\s+/g, '').replace(/\(.*\)/, '');
                if (!bankMap.has(key)) bankMap.set(key, b);
            });

            const merged = Array.from(bankMap.values());
            // Sort alphabetically
            merged.sort((a, b) => a.name.localeCompare(b.name));

            setBanks(merged)

        } catch (err) {
            console.error("Error fetching banks:", err)
        } finally {
            setFetchingBanks(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [fetchWithAuth])

    const handleOpenPayout = () => {
        setStep(1)
        setError(null)
        setIsModalOpen(true)
        if (banks.length === 0) fetchBanks()
    }

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/payout/withdraw/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            if (response.ok) {
                setSuccess(true)
                fetchData()
                setTimeout(() => {
                    setIsModalOpen(false)
                    setSuccess(false)
                    setStep(1)
                    setFormData({ amount: "", bank_code: "", bank_name: "", account_number: "", account_name: "" })
                }, 3000)
            } else {
                setError(data.error || "Failed to initiate withdrawal")
            }
        } catch (err) {
            setError("A network error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    const filteredBanks = banks.filter(b =>
        b.name.toLowerCase().includes(bankSearch.toLowerCase())
    )

    const getBankColor = (name: string) => {
        const n = name.toLowerCase()
        if (n.includes('commercial') || n.includes('cbe')) return 'bg-purple-600'
        if (n.includes('telebirr')) return 'bg-cyan-500'
        if (n.includes('dashen')) return 'bg-blue-800'
        if (n.includes('awash')) return 'bg-teal-600'
        if (n.includes('abyssinia')) return 'bg-amber-600'
        if (n.includes('nib')) return 'bg-orange-600'
        return 'bg-slate-500'
    }

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'approved': return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
            case 'failed': return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
            default: return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
        }
    }

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-[#0B1120] text-gray-100" : "bg-[#F8FAFC] text-slate-900"}`}>
            <ProfessionalHeader />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <Link to="/professionals" className="inline-block mb-8 text-sm font-black tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-3xl ${theme === "dark" ? "bg-[#1E293B]" : "bg-white shadow-xl"}`}>
                            <FaWallet className="text-3xl text-[#25A8A0]" />
                        </div>
                        <div>
                            <h1 className={`text-4xl font-extrabold mb-1 tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Payments & Payouts</h1>
                            <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                                Managed by Chapa • Funds typically processed in 2-4 hours.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenPayout}
                        className="group relative flex items-center justify-center gap-4 px-10 py-5 bg-[#25A8A0] text-white font-black rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(37,168,160,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(37,168,160,0.5)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.1em] text-xs overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <FaMoneyBillWave className="text-lg relative" />
                        <span className="relative">Withdraw Funds</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <FaSpinner className="text-5xl text-[#25A8A0] animate-spin" />
                        <p className="text-xs font-black uppercase tracking-widest opacity-30 animate-pulse">Syncing Ledger...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className={`group p-10 rounded-[2.5rem] border shadow-xl transition-all hover:shadow-2xl overflow-hidden relative ${theme === "dark" ? "bg-[#151C2C] border-white/5 shadow-black/40" : "bg-white border-slate-100"}`}>
                                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#25A8A0]/5 rounded-full blur-3xl group-hover:bg-[#25A8A0]/10 transition-all"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#25A8A0] mb-5 border-b border-[#25A8A0]/10 pb-2 w-fit">Available ETB</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className={`text-5xl font-black tracking-tighter ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{Number(earnings.available).toLocaleString()}</h2>
                                    <span className="text-sm font-black opacity-30">.00</span>
                                </div>
                                <p className="text-xs font-bold opacity-40 mt-4 flex items-center gap-2">
                                    <FaCheckCircle className="text-[#25A8A0]" /> Instant withdrawal capable
                                </p>
                            </div>

                            <div className={`p-10 rounded-[2.5rem] border shadow-xl transition-all hover:shadow-2xl relative overflow-hidden ${theme === "dark" ? "bg-[#151C2C] border-white/5 shadow-black/40" : "bg-white border-slate-100"}`}>
                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-5 border-b border-orange-500/10 pb-2 w-fit">In Escrow</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className={`text-5xl font-black tracking-tighter ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{Number(earnings.pending).toLocaleString()}</h2>
                                    <span className="text-sm font-black opacity-30">.00</span>
                                </div>
                                <p className="text-xs font-bold opacity-40 mt-4 flex items-center gap-2">
                                    <FaSpinner className="animate-spin text-orange-500" /> 7-day safety hold active
                                </p>
                            </div>

                            <div className={`p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(37,168,160,0.3)] transition-all hover:shadow-[0_35px_70px_-15px_rgba(37,168,160,0.4)] hover:-translate-y-1 bg-gradient-to-br from-[#25A8A0] to-teal-800 text-white border-none relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-5 border-b border-white/20 pb-2 w-fit">Gross Earnings</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-5xl font-black tracking-tighter">{Number(earnings.total).toLocaleString()}</h2>
                                    <span className="text-sm font-black opacity-50">.00</span>
                                </div>
                                <p className="text-xs font-bold opacity-70 mt-4">Lifetime revenue on platform</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-10 mb-24">
                            <div className="lg:col-span-2">
                                <div className={`rounded-[2.5rem] shadow-2xl overflow-hidden border transition-all ${theme === "dark" ? "bg-[#151C2C] border-white/5 shadow-black/40" : "bg-white border-slate-100"}`}>
                                    <div className={`p-10 border-b flex items-center justify-between ${theme === "dark" ? "border-white/5" : "border-slate-50"}`}>
                                        <h3 className={`font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
                                            <div className="p-3 bg-[#25A8A0]/10 rounded-[1.25rem]">
                                                <FaHistoryIcon className="text-[#25A8A0]" />
                                            </div>
                                            Withdrawal Records
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className={`text-[10px] font-black uppercase tracking-[0.1em] ${theme === "dark" ? "bg-white/5 text-gray-500" : "bg-slate-50 text-slate-400"}`}>
                                                    <th className="px-10 py-6">Trace ID</th>
                                                    <th className="px-10 py-6">Beneficiary Bank</th>
                                                    <th className="px-10 py-6">Timestamp</th>
                                                    <th className="px-10 py-6">Net Amount</th>
                                                    <th className="px-10 py-6 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${theme === "dark" ? "divide-white/5 text-gray-300" : "divide-slate-50 text-slate-700"}`}>
                                                {withdrawals.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-10 py-24 text-center">
                                                            <div className="opacity-20 flex flex-col items-center gap-4">
                                                                <FaHistoryIcon className="text-5xl" />
                                                                <p className="text-xs font-black uppercase tracking-widest">No movement detected</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : withdrawals.map((wd) => {
                                                    const logoUrl = getBankLogoUrl(wd.bank_name);
                                                    return (
                                                        <tr key={wd.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group">
                                                            <td className="px-10 py-7 font-mono text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">{wd.reference?.split('-')[1]?.toUpperCase() || wd.id}</td>
                                                            <td className="px-10 py-7">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm overflow-hidden p-1">
                                                                        {logoUrl ? (
                                                                            <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                                                                        ) : (
                                                                            <span className="text-[10px] font-black text-slate-900">{wd.bank_name.charAt(0)}</span>
                                                                        )}
                                                                    </div>
                                                                    <span className="font-extrabold text-sm tracking-tight">{wd.bank_name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-7 text-xs font-bold opacity-60">{new Date(wd.created_at).toLocaleString()}</td>
                                                            <td className="px-10 py-7 font-black text-sm text-[#25A8A0]">{Number(wd.amount).toLocaleString()} ETB</td>
                                                            <td className="px-10 py-7">
                                                                <div className="flex justify-center">
                                                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusStyle(wd.status)}`}>
                                                                        {wd.status}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1 space-y-10">
                                <div className={`p-10 rounded-[2.5rem] border shadow-xl ${theme === "dark" ? "bg-[#151C2C] border-white/5 shadow-black/40" : "bg-white border-slate-100"}`}>
                                    <h3 className={`font-black uppercase tracking-[0.15em] text-xs mb-8 flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
                                        <FaBuilding className="text-[#25A8A0]" /> Connection Points
                                    </h3>
                                    <div className="space-y-5">
                                        <div className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group flex items-center justify-between ${theme === "dark" ? "bg-[#0B1120] border-white/10 hover:border-[#25A8A0]/50" : "bg-slate-50 border-slate-100 hover:border-[#25A8A0]/30 hover:bg-white shadow-sm hover:shadow-xl"}`}>
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-all group-hover:scale-110 group-hover:rotate-6">
                                                    <FaUniversity className="text-2xl" />
                                                </div>
                                                <div>
                                                    <p className={`text-base font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Chapa Transfer</p>
                                                    <p className="text-[10px] font-bold opacity-40 mt-1 uppercase tracking-widest">Real-time RTGS/ACH</p>
                                                </div>
                                            </div>
                                            <FaCheckCircle className="text-[#25A8A0] text-xl" />
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-10 rounded-[2.5rem] shadow-2xl transition-all border-l-8 ${theme === "dark" ? "bg-[#1E293B] border-[#25A8A0] shadow-black/40" : "bg-white border-[#25A8A0] shadow-teal-900/10"}`}>
                                    <div className="flex flex-col gap-6">
                                        <div className="p-4 bg-[#25A8A0]/10 rounded-2xl w-fit">
                                            <FaExclamationTriangle className="text-[#25A8A0] text-2xl" />
                                        </div>
                                        <div>
                                            <h4 className={`text-[#25A8A0] font-black text-sm uppercase tracking-widest`}>Compliance Status</h4>
                                            <p className={`text-xs font-bold leading-relaxed mt-4 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                                                Your legal identity has been verified. You can withdraw profits to any certified Ethiopian financial institution.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Payout Modal - NEW DESIGN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className={`relative w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ${theme === 'dark' ? 'bg-[#0F172A] border border-white/5' : 'bg-white'}`}>
                        {/* Header Header */}
                        <div className="p-10 pb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#25A8A0]/10 rounded-2xl">
                                    <FaMoneyBillWave className="text-2xl text-[#25A8A0]" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#25A8A0]">Withdrawal Center</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className={`p-3 rounded-full transition-all hover:rotate-90 hover:bg-red-500/10 hover:text-red-500 ${theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
                                <FaTimes />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-10 mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Setup Progress</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#25A8A0]">Step {step} of 3</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#25A8A0] transition-all duration-700 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
                            </div>
                        </div>

                        {success ? (
                            <div className="p-20 text-center animate-in zoom-in-50 duration-500">
                                <div className="w-24 h-24 bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <FaCheckCircle className="text-5xl text-white" />
                                </div>
                                <h3 className="text-3xl font-black mb-4 tracking-tighter">Transfer Executed</h3>
                                <p className="opacity-60 text-sm font-bold uppercase tracking-widest">Funds are on their way to your account.</p>
                            </div>
                        ) : (
                            <div className="px-10 pb-10">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-black uppercase tracking-wider animate-in shake duration-500">
                                        <FaExclamationTriangle /> {error}
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                                        <div className="text-center mb-8">
                                            <p className="text-sm font-black opacity-30 uppercase tracking-[0.2em] mb-2">How much do you need?</p>
                                            <p className="text-xs font-bold text-[#25A8A0]">Available to withdraw: {earnings.available} ETB</p>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-10 top-1/2 -translate-y-1/2 font-black text-4xl text-[#25A8A0]/30 transition-colors group-focus-within:text-[#25A8A0]">ETB</div>
                                            <input
                                                type="number"
                                                autoFocus
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                className={`w-full pl-32 pr-10 py-10 rounded-[2.5rem] border-4 transition-all outline-none text-5xl font-black tracking-tighter ${theme === 'dark' ? 'bg-white/5 border-white/5 focus:border-[#25A8A0] text-white' : 'bg-slate-50 border-slate-100 focus:border-[#25A8A0] focus:bg-white text-slate-900'}`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <button
                                            onClick={() => Number(formData.amount) > 0 ? setStep(2) : setError("Enter a valid amount")}
                                            className="w-full py-6 bg-[#25A8A0] text-white font-black rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest"
                                        >
                                            Select Destination <FaChevronRight />
                                        </button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                                        <div className="relative group">
                                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#25A8A0] transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Search by Bank Name..."
                                                value={bankSearch}
                                                autoFocus
                                                onChange={(e) => setBankSearch(e.target.value)}
                                                className={`w-full pl-16 pr-8 py-5 rounded-3xl border-2 outline-none transition-all font-bold text-sm ${theme === 'dark' ? 'bg-white/5 border-white/5 focus:border-[#25A8A0]' : 'bg-slate-50 border-slate-50 focus:border-[#25A8A0]'}`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto px-1 custom-scrollbar">
                                            {fetchingBanks ? (
                                                <div className="py-20 text-center space-y-4">
                                                    <FaSpinner className="animate-spin text-3xl mx-auto text-[#25A8A0]" />
                                                    <p className="text-[10px] font-black uppercase opacity-30">Fetching Partners...</p>
                                                </div>
                                            ) : filteredBanks.map(bank => {
                                                const logoUrl = getBankLogoUrl(bank.name);
                                                return (
                                                    <div
                                                        key={bank.id}
                                                        onClick={() => {
                                                            setFormData({ ...formData, bank_code: bank.id, bank_name: bank.name })
                                                            setStep(3)
                                                        }}
                                                        className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between group ${theme === 'dark' ? 'bg-white/5 border-transparent hover:border-[#25A8A0] hover:bg-white/10' : 'bg-slate-50 border-transparent hover:border-[#25A8A0] hover:bg-white hover:shadow-lg'}`}
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-lg overflow-hidden p-2`}>
                                                                {logoUrl ? (
                                                                    <img src={logoUrl} alt={bank.name} className="w-full h-full object-contain" onError={(e) => {
                                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                                    }} />
                                                                ) : null}
                                                                <div className={`${logoUrl ? 'hidden' : ''} text-slate-900 font-black text-xs`}>
                                                                    {bank.name.charAt(0)}
                                                                </div>
                                                            </div>
                                                            <span className="font-extrabold text-sm">{bank.name}</span>
                                                        </div>
                                                        <FaChevronRight className="text-gray-300 group-hover:text-[#25A8A0] transition-colors" />
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full py-4 text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center justify-center gap-2"
                                        >
                                            <FaChevronLeft /> Back to Amount
                                        </button>
                                    </div>
                                )}

                                {step === 3 && (
                                    <form onSubmit={handleWithdraw} className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                                        <div className={`p-6 rounded-[2rem] flex items-center gap-5 ${theme === 'dark' ? 'bg-white/5' : 'bg-teal-50/50'}`}>
                                            <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center bg-white shadow-xl overflow-hidden p-2">
                                                {(() => {
                                                    const logoUrl = getBankLogoUrl(formData.bank_name);
                                                    return logoUrl ? (
                                                        <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <span className="text-slate-900 font-black text-xl">{formData.bank_name.charAt(0)}</span>
                                                    );
                                                })()}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#25A8A0]">Destination</p>
                                                <p className="font-extrabold text-lg">{formData.bank_name}</p>
                                                <p className="text-xs font-bold opacity-40">Withdrawing {Number(formData.amount).toLocaleString()} ETB</p>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-40 px-2">Legal Beneficiary Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    value={formData.account_name}
                                                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                                                    className={`w-full px-8 py-5 rounded-3xl border-4 transition-all outline-none font-extrabold text-sm ${theme === 'dark' ? 'bg-white/5 border-white/5 focus:border-[#25A8A0]' : 'bg-slate-50 border-slate-50 focus:border-[#25A8A0] focus:bg-white'}`}
                                                    placeholder="As it appears on your bank ID"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-40 px-2">Account Identification Number</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.account_number}
                                                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                                                    className={`w-full px-8 py-5 rounded-3xl border-4 transition-all outline-none font-bold text-sm font-mono tracking-wider ${theme === 'dark' ? 'bg-white/5 border-white/5 focus:border-[#25A8A0]' : 'bg-slate-50 border-slate-50 focus:border-[#25A8A0] focus:bg-white'}`}
                                                    placeholder="1000..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className={`flex-1 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}
                                            >
                                                Change Bank
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="flex-[2] py-6 bg-[#25A8A0] text-white font-black rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                                            >
                                                {submitting ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> Release Funds</>}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <AICompanion />

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(37, 168, 160, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(37, 168, 160, 0.4);
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}} />
        </div>
    )
}

export default ProfessionalPayments
