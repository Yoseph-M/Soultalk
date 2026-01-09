"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import DashboardHeader from "./DashboardHeader"

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { fetchWithAuth } = useAuth()
    const { theme } = useTheme()

    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const verifyPayment = async () => {
            const txRef = searchParams.get('tx_ref')
            if (!txRef) {
                setStatus('failed')
                setMessage('No transaction reference found')
                return
            }

            try {
                const response = await fetchWithAuth(`http://127.0.0.1:8000/api/auth/payment/verify/${txRef}/`)
                const data = await response.json()

                if (response.ok && data.status === 'success') {
                    setStatus('success')
                } else {
                    setStatus('failed')
                    setMessage(data.message || 'Payment verification failed')
                }
            } catch (error) {
                console.error(error)
                setStatus('failed')
                setMessage('Error verifying payment')
            }
        }

        verifyPayment()
    }, [searchParams, fetchWithAuth])

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <DashboardHeader />
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                {status === 'verifying' && (
                    <>
                        <FaSpinner className="w-16 h-16 animate-spin text-[#25A8A0] mb-6" />
                        <h2 className="text-2xl font-bold">Verifying Payment...</h2>
                        <p className="mt-2 opacity-70">Please wait while we confirm your transaction.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <FaCheckCircle className="w-20 h-20 text-emerald-500 mb-6 animate-in zoom-in" />
                        <h2 className="text-3xl font-bold text-emerald-500 mb-2">Payment Successful!</h2>
                        <p className="text-lg opacity-80 mb-8">Thank you for your purchase. Your account has been updated.</p>
                        <button
                            onClick={() => navigate('/billing')}
                            className="px-8 py-3 bg-[#25A8A0] text-white font-bold rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all"
                        >
                            Return to Billing
                        </button>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <FaTimesCircle className="w-20 h-20 text-red-500 mb-6 animate-in zoom-in" />
                        <h2 className="text-3xl font-bold text-red-500 mb-2">Payment Failed</h2>
                        <p className="text-lg opacity-80 mb-8">{message}</p>
                        <button
                            onClick={() => navigate('/billing')}
                            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 font-bold rounded-xl transition-all"
                        >
                            Return to Billing
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default PaymentSuccess
