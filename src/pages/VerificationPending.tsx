import React from 'react';
import { ShieldCheck, Clock, ArrowLeft, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerificationPending: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isRejected = user?.verificationStatus === 'rejected';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">

                {isRejected ? (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 mb-4">
                            Verification Rejected
                        </h1>

                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Unfortunately, your professional application could not be verified at this time.
                        </p>

                        {user?.rejectionReason && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl mb-10 text-left">
                                <div className="flex items-center gap-2 text-red-700 font-semibold mb-1 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    Reason for rejection:
                                </div>
                                <p className="text-sm text-red-600">
                                    {user.rejectionReason}
                                </p>
                                <p className="mt-4 text-xs text-red-500 italic">
                                    Please update your profile information and re-submit your documents.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/professional/settings')}
                            className="w-full bg-[#25A8A0] hover:bg-[#1e8a82] text-white py-4 rounded-xl transition-colors font-bold flex items-center justify-center gap-2 group mb-4"
                        >
                            Update Profile
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-[#25A8A0]/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <ShieldCheck className="w-8 h-8 text-[#25A8A0]" />
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 mb-4">
                            Verification Pending
                        </h1>

                        <p className="text-slate-600 mb-10 leading-relaxed">
                            Your professional profile is currently being reviewed. To maintain our community standards, we verify all credentials before granting full access.
                        </p>

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
                    </>
                )}

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>

                    {user && (
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                        >
                            Sign out of {user.email}
                        </button>
                    )}
                </div>

                <p className="mt-10 text-xs text-slate-400">
                    Questions? Contact <a href="mailto:support@soultalk.com" className="text-[#25A8A0] font-medium hover:underline">Support</a>
                </p>
            </div>
        </div>
    );
};

export default VerificationPending;
