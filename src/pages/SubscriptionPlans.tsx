import { API_BASE_URL } from "../config";
import React from 'react';
import { Check } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const SubscriptionPlans: React.FC = () => {
    const { user, fetchWithAuth, isLoading } = useAuth();
    const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <FaSpinner className="animate-spin text-4xl text-[#25A8A0]" />
            </div>
        );
    }

    const handlePayment = async (planName: string, amount: number) => {
        if (isLoading) return; // Prevent action while checking auth status

        if (!user) {
            window.location.href = '/auth?mode=signup';
            return;
        }

        setIsProcessing(planName);
        try {
            const response = await fetchWithAuth(API_BASE_URL + '/api/auth/payment/initialize/', {
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
            setIsProcessing(null);
        }
    };
    const plans = [
        {
            name: 'Premium',
            price: 5000,
            description: 'Perfect for getting started on your wellness journey',
            features: [
                '20 therapy sessions per month',

                'Basic wellness resources',
                'Premium wellness resources',
                'Mood tracking tools',
                '24/7 crisis support',

            ],
            popular: false,
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            name: 'Pro',
            price: 9500,
            description: 'Comprehensive support for your mental health',
            features: [
                '100 therapy sessions per month',
                'Unlimited messaging support',
                'Pro wellness resources',
                'Advanced progress tracking',
                'Group therapy sessions',
                'Priority booking',
                '24/7 crisis support',
                'Personalized care plans'
            ],
            popular: true,
            gradient: 'from-[#25A8A0] to-green-600'
        },
        {
            name: 'Plus',
            price: 13500,
            description: 'For those needing comprehensive care',
            features: [
                'Unlimited therapy sessions per month',
                'Unlimited messaging support',
                'All wellness resources',
                'Personalized treatment plans',
                'Family therapy sessions',
                'Dedicated care coordinator',
                'Same-day booking',
                '24/7 crisis support',
                'Weekly check-ins'
            ],
            popular: false,
            gradient: 'from-purple-500 to-purple-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            { }
            <div className="container mx-auto px-4 py-16">
                { }
                <div className="text-center mb-16">
                    <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 px-6 py-3 rounded-full font-semibold mb-6">
                        Support your mental health and those who care for it
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Choose Your Wellness Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Clear, warm pricing plans designed to make mental health support accessible and affordable for everyone
                    </p>
                </div>

                { }
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col border rounded-2xl bg-white px-8 py-10 text-left transition-all duration-300 shadow-lg
                ${plan.popular ? 'border-[#25A8A0] ring-2 ring-[#25A8A0]/40 bg-[#f3fdfa]' : 'border-gray-200'}
              `}
                        >
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                                <p className="text-gray-600 mb-4">{plan.description}</p>
                                <div className="flex items-end mb-4">
                                    <span className="text-2xl font-bold text-gray-900 mr-2">ETB</span>
                                    <span className="text-5xl font-bold text-gray-900">{plan.price.toLocaleString()}</span>
                                    <span className="text-base text-gray-500 ml-1 mb-1">/month</span>
                                </div>
                                <div>
                                    {/* <Link to="/auth?mode=signup"> */}
                                    <button
                                        onClick={() => handlePayment(plan.name, plan.price)}
                                        disabled={isProcessing !== null}
                                        className={`w-full px-10 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 mt-8 flex items-center justify-center gap-2
                        ${plan.popular
                                                ? 'bg-[#25A8A0] hover:bg-[#1e8a82] text-white shadow-lg'
                                                : 'border-2 border-gray-300 text-gray-700 hover:border-[#25A8A0] hover:bg-[#25A8A0] hover:text-white'}
                        ${isProcessing !== null ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                                    >
                                        {isProcessing === plan.name ? <FaSpinner className="animate-spin" /> : (
                                            <>
                                                {plan.name === 'Premium' && 'Get Premium'}
                                                {plan.name === 'Pro' && 'Get Pro'}
                                                {plan.name === 'Plus' && 'Get Plus'}
                                            </>
                                        )}
                                    </button>
                                    {/* </Link> */}
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start space-x-2">
                                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;
