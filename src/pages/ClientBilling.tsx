"use client"
import { API_BASE_URL } from "../config";

import React, { useState } from "react"
import { FaHistory, FaDownload } from "react-icons/fa"
import DashboardHeader from "./DashboardHeader"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import AICompanion from "../components/AICompanion"

const ClientBilling: React.FC = () => {
    const { theme } = useTheme()
    const { user, fetchWithAuth } = useAuth()
    const [activePlan, setActivePlan] = useState('Free')
    const [billingHistory, setBillingHistory] = useState<any[]>([])
    const [loadingHistory, setLoadingHistory] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)

    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetchWithAuth(' + API_BASE_URL + '/api/auth/payment/history/')
                if (response.ok) {
                    const data = await response.json()
                    setBillingHistory(data)
                    // Determine active plan based on latest successful payment
                    const latestSuccess = data.find((p: any) => p.status === 'success')
                    if (latestSuccess) {
                        // Logic to determine plan from amount -> for now simplistic
                        if (parseFloat(latestSuccess.amount) >= 299) setActivePlan('Plus')
                        else if (parseFloat(latestSuccess.amount) >= 199) setActivePlan('Pro')
                        else if (parseFloat(latestSuccess.amount) >= 99) setActivePlan('Premium')
                    }
                }
            } catch (error) {
                console.error("Error fetching payment history:", error)
            } finally {
                setLoadingHistory(false)
            }
        }

        if (user) {
            fetchHistory()
        }
    }, [user, fetchWithAuth])

    const handlePayment = async (amount: number) => {
        setIsProcessing(true);
        try {
            const response = await fetchWithAuth(' + API_BASE_URL + '/api/auth/payment/initialize/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    email: user?.email,
                    first_name: user?.name?.split(' ')[0] || user?.email?.split('@')[0],
                    last_name: user?.name?.split(' ')[1] || '',
                }),
            });

            if (response.status === 401) {
                alert("Session expired. Please login again.");
                window.location.href = '/auth?mode=login';
                return;
            }

            if (response.ok) {
                const data = await response.json();
                if (data.checkout_url) {
                    window.location.href = data.checkout_url;
                } else {
                    alert('Payment initialization failed: No checkout URL');
                }
            } else {
                const errorData = await response.json();
                console.error("Payment failed response:", errorData);
                alert(`Payment initialization failed: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('An error occurred during payment');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadReceipt = async (transaction: any) => {
        try {
            // Fetch fresh data from Chapa verification to ensure "real" receipt data
            const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/payment/verify/${transaction.tx_ref}/`);
            if (!response.ok) {
                alert("Could not verify transaction details for receipt.");
                return;
            }
            const data = await response.json();
            const realData = data.data || transaction; // Use Chapa data if available, else local

            // Check for Chapa Reference ID (e.g. 'reference' or 'uuid')
            // Chapa's verify response usually contains 'reference' which is the ID we need.
            const chapaReference = realData.reference || realData.charge_id || realData.id;

            if (chapaReference && realData.status === 'success') {
                // Open real Chapa receipt
                // Format: https://chapa.link/payment-receipt/{reference}
                // Note: We use window.open to show it in a new tab.
                const receiptUrl = `https://chapa.link/receipt/${chapaReference}`;
                window.open(receiptUrl, '_blank');
                return;
            }

            // Fallback to generated receipt if no Chapa reference (e.g. Mock Mode)
            alert("Official Chapa receipt unavailable (Mock Mode). Generating local receipt...");

            const receiptContent = `
                <html>
                    <head>
                        <title>Payment Receipt - SoulTalk</title>
                        <style>
                            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
                            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                            .logo { font-size: 24px; font-weight: bold; color: #25A8A0; }
                            .receipt-title { font-size: 32px; font-weight: bold; color: #111; }
                            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                            .label { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
                            .value { font-size: 16px; font-weight: 500; }
                            .amount-box { background: #f8fafc; padding: 30px; border-radius: 12px; text-align: right; margin-bottom: 40px; border: 1px solid #e2e8f0; }
                            .total-label { font-size: 14px; color: #666; margin-bottom: 5px; }
                            .total-value { font-size: 42px; font-weight: bold; color: #25A8A0; }
                            .footer { border-top: 1px solid #eee; padding-top: 30px; font-size: 12px; color: #999; text-align: center; line-height: 1.6; }
                            .verified-badge { color: #25A8A0; font-weight: bold; border: 1px solid #25A8A0; padding: 4px 8px; border-radius: 4px; font-size: 10px; display: inline-block; margin-top: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="logo">SoulTalk</div>
                            <div class="receipt-title">Receipt</div>
                        </div>
                        
                        <div class="info-grid">
                            <div>
                                <div class="label">Billed To</div>
                                <div class="value">${user?.name || 'Valued Client'}</div>
                                <div class="value">${user?.email}</div>
                                <div class="value">${realData.first_name || ''} ${realData.last_name || ''}</div>
                            </div>
                            <div style="text-align: right;">
                                <div class="label">Receipt Number</div>
                                <div class="value">#${(realData.tx_ref || transaction.tx_ref).substring(0, 8).toUpperCase()}</div>
                                <div class="label" style="margin-top: 15px;">Date Issued</div>
                                <div class="value">${new Date(realData.created_at || transaction.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                <div class="label" style="margin-top: 15px;">Payment Method</div>
                                <div class="value">${realData.method || 'Chapa Secure Payment'}</div> 
                            </div>
                        </div>

                        <div class="amount-box">
                            <div class="total-label">Amount Paid</div>
                            <div class="total-value">${realData.currency || transaction.currency} ${parseFloat(realData.amount || transaction.amount).toFixed(2)}</div>
                            <div class="label" style="color: #4CAF50; margin-top: 10px; font-weight: bold;">
                                ● Paid successfully
                            </div>
                            ${chapaReference ? '<div class="verified-badge">VERIFIED BY CHAPA</div>' : '<div class="verified-badge" style="color:orange; border-color:orange;">MOCK RECEIPT</div>'}
                        </div>

                        <div class="footer">
                            <p>Thank you for choosing SoulTalk for your mental wellness journey.</p>
                            <p>Transaction Reference: ${realData.tx_ref || transaction.tx_ref}</p>
                            <p>Chapa Reference: ${realData.reference || realData.chapa_reference || 'N/A'}</p>
                            <p>&copy; ${new Date().getFullYear()} SoulTalk Inc.</p>
                        </div>
                        <script>
                            window.print();
                        </script>
                    </body>
                </html>
            `;

            const printWindow = window.open('', '_blank', 'width=900,height=800');
            if (printWindow) {
                printWindow.document.write(receiptContent);
                printWindow.document.close();
                printWindow.focus();
            }
        } catch (error) {
            console.error("Receipt generation error:", error);
            alert("Failed to generate receipt.");
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Back Link */}
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Current Plan Card */}
                        <div className={`rounded-3xl p-8 shadow-xl relative overflow-hidden ${theme === "dark" ? "bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-800" : "bg-gradient-to-br from-teal-500 to-emerald-600"} text-white`}>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm uppercase tracking-wider">Current Plan</span>
                                        {activePlan !== 'Free' && <span className="bg-emerald-400 text-black px-3 py-1 rounded-full text-xs font-bold">ACTIVE</span>}
                                    </div>
                                    <h2 className="text-3xl font-bold mb-1">{activePlan === 'Free' ? 'No Active Plan' : `${activePlan} Plan`}</h2>
                                    <p className="opacity-90 text-sm">
                                        {activePlan === 'Free'
                                            ? 'Upgrade to unlock full features'
                                            : billingHistory.find((p: any) => p.status === 'success')
                                                ? `Next billing date: ${new Date(new Date(billingHistory.find((p: any) => p.status === 'success').created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                                                : 'Next billing date: N/A'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">
                                        {activePlan === 'Premium' ? '$99' : activePlan === 'Pro' ? '$199' : activePlan === 'Plus' ? '$299' : '$0'}
                                        <span className="text-sm font-normal opacity-80">/mo</span>
                                    </div>
                                    <div className="flex gap-3 mt-4 justify-end">
                                        {activePlan === 'Free' && (
                                            <button
                                                onClick={() => {
                                                    window.location.href = '/subscription/plans';
                                                }}
                                                disabled={isProcessing}
                                                className="px-4 py-2 bg-white text-teal-600 hover:bg-gray-100 rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50"
                                            >
                                                {isProcessing ? 'Processing...' : 'Subscribe Now'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                        </div>



                        {/* Billing History */}
                        <div className={`rounded-3xl p-6 shadow-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-current">
                                <FaHistory className="text-[#25A8A0]" /> Billing History
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className={`text-center text-xs uppercase tracking-wider ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                                            <th className="pb-4 w-1/4">Date</th>
                                            <th className="pb-4 w-1/4">Amount</th>
                                            <th className="pb-4 w-1/4">Status</th>
                                            <th className="pb-4 w-1/4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-100"}`}>
                                        {loadingHistory ? (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-gray-500">Loading history...</td>
                                            </tr>
                                        ) : billingHistory.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-gray-500">No payment history found</td>
                                            </tr>
                                        ) : (
                                            billingHistory.map((item: any) => (
                                                <tr key={item.id} className={`group text-sm transition-colors ${theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-gray-50 text-gray-700"}`}>
                                                    <td className="py-6 text-center font-medium text-base">{new Date(item.created_at).toLocaleDateString()}</td>
                                                    <td className="py-6 text-center font-bold text-base">{item.currency} {item.amount}</td>
                                                    <td className="py-6 text-center">
                                                        <span
                                                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border
                                                            ${item.status === 'success' ? "border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-transparent" :
                                                                    item.status === 'pending' ? "border-amber-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-transparent" :
                                                                        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-transparent"}`}
                                                            style={
                                                                theme !== 'dark'
                                                                    ? (item.status === 'pending' ? { backgroundColor: '#ffffff', color: '#d97706' }
                                                                        : item.status === 'success' ? { backgroundColor: '#ffffff', color: '#059669' }
                                                                            : {})
                                                                    : {}
                                                            }
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 text-center">
                                                        {item.status === 'pending' && (
                                                            <button
                                                                onClick={() => handlePayment(parseFloat(item.amount))}
                                                                className={`p-2 rounded-lg hover:!bg-[rgba(37,168,160,0.1)] dark:hover:!bg-gray-800 transition-colors text-xs font-bold text-[#25A8A0] hover:!text-[#25A8A0]`}
                                                            >
                                                                Retry
                                                            </button>
                                                        )}
                                                        {item.status === 'success' && (
                                                            <button
                                                                onClick={() => handleDownloadReceipt(item)}
                                                                className={`p-2 rounded-lg hover:!bg-[rgba(37,168,160,0.1)] dark:hover:!bg-gray-600 transition-colors text-[#25A8A0] hover:!text-[#25A8A0]`}
                                                                title="Download Receipt"
                                                            >
                                                                <FaDownload className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Summary */}
                    <div className="space-y-6">
                        <div className={`hidden`}> {/* Plan Features removed */} </div>

                        <div className={`rounded-3xl p-6 shadow-xl border-2 border-dashed ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-teal-50 border-teal-200"}`}>
                            <h3 className="font-bold text-[#25A8A0] mb-2">Need a custom plan?</h3>
                            <p className={`text-xs mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                Contact our sales team for enterprise solutions or family packages.
                            </p>
                            <button className="text-sm font-bold text-[#25A8A0] hover:underline">Contact Sales →</button>
                        </div>
                    </div>
                </div>
            </main>
            <AICompanion />
        </div>
    )
}

export default ClientBilling