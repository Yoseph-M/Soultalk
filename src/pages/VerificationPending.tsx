import React from 'react';
import { ShieldCheck, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerificationPending: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
                {/* Simple Professional Icon */}
                <div className="w-16 h-16 bg-[#25A8A0]/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <ShieldCheck className="w-8 h-8 text-[#25A8A0]" />
                </div>

                {/* Clear Messaging */}
                <h1 className="text-2xl font-bold text-slate-900 mb-4">
                    Verification Pending
                </h1>

                <p className="text-slate-600 mb-10 leading-relaxed">
                    Your professional profile is currently being reviewed. To maintain our community standards, we verify all credentials before granting full access.
                </p>

                {/* Status Breakdown */}
                <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl">
                        <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Review Timeline</p>
                            <p className="text-xs text-slate-500">Usually takes 1 to 3 business days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl">
                        <ShieldCheck className="w-5 h-5 text-[#25A8A0] flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Credential Audit</p>
                            <p className="text-xs text-slate-500">Checking licenses and identification</p>
                        </div>
                    </div>
                </div>

                {/* Primary Action */}
                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-[#25A8A0] hover:bg-[#1e8a82] text-white py-4 rounded-xl transition-colors font-bold flex items-center justify-center gap-2 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                {/* Subtle Support Link */}
                <p className="mt-10 text-xs text-slate-400">
                    Questions? Contact <a href="mailto:support@soultalk.com" className="text-[#25A8A0] font-medium hover:underline">Support</a>
                </p>
            </div>
        </div>
    );
};

export default VerificationPending;
