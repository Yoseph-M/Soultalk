import React from 'react';
import { Check, Info, ArrowRight } from 'lucide-react';
import Header from './Header';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {

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
      color: 'blue'
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
      color: 'teal'
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
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sohne">
      <Header />

      <div className="container mx-auto px-4 pt-32 pb-24">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#25A8A0]/10 text-[#25A8A0] px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Info className="w-4 h-4" />
            Transparent & Inclusive Pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            Plans for <span className="text-[#25A8A0]">Every Background</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose the level of support that right for you. Flexible plans designed to make professional mental health care accessible to everyone.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col bg-white rounded-[2.5rem] p-10 transition-all duration-500 border-2
                ${plan.popular ? 'border-[#25A8A0] shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200'}
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#25A8A0] text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 mb-6 text-sm">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-400">ETB</span>
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">{plan.price.toLocaleString()}</span>
                  <span className="text-gray-400 font-medium">/mo</span>
                </div>
              </div>

              <div className="mb-10">
                <Link to="/auth" className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-lg transition-all
                  ${plan.popular ? 'bg-[#25A8A0] text-white shadow-xl shadow-[#25A8A0]/20 hover:bg-[#1e8a82]' : 'bg-gray-900 text-white hover:bg-black'}
                `}>
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="space-y-4 flex-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">What's Included</p>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-[#25A8A0]/10' : 'bg-gray-100'}`}>
                      <Check className={`w-3.5 h-3.5 ${plan.popular ? 'text-[#25A8A0]' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-gray-600 text-sm font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Disclaimer */}
        <div className="max-w-4xl mx-auto mt-20 p-8 bg-white rounded-[2rem] border border-gray-100 text-center">
          <p className="text-gray-500 text-sm leading-relaxed">
            * All plans include 256-bit SSL encryption. Sessions can be conducted via video, audio, or text.
            Unused sessions do not roll over to the next month but can be gifted to our community fund.
            Need a custom plan for your organization? <Link to="/contact" className="text-[#25A8A0] font-bold underline">Contact our sales team</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;