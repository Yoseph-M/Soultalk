import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, MessageCircle, Shield, Clock, CheckCircle, Award, Users, ArrowRight, ClipboardCheck, UserCheck, HeartHandshake } from 'lucide-react';
import Header from './Header';

const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seekers' | 'professionals'>('seekers');

  const seekerSteps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up and tell us about your mental health goals, preferences, and what kind of support you\'re looking for.',
      details: [
        'Quick 5-minute signup process',
        'Share your preferences and goals',
        'Complete confidential assessment',
        'Set your availability'
      ],
      color: 'bg-blue-500'
    },
    {
      number: '02',
      icon: Search,
      title: 'Get Matched',
      description: 'Our intelligent matching system connects you with licensed professionals who specialize in your specific needs.',
      details: [
        'AI-powered matching algorithm',
        'Based on your unique needs',
        'Licensed, verified professionals',
        'Multiple options to choose from'
      ],
      color: 'bg-[#25A8A0]'
    },
    {
      number: '03',
      icon: MessageCircle,
      title: 'Start Your Sessions',
      description: 'Begin your mental health journey with secure video, voice, or text sessions at times that work for you.',
      details: [
        'Flexible scheduling options',
        'Video, voice, or text sessions',
        'Secure, encrypted platform',
        'Ongoing support and care'
      ],
      color: 'bg-green-500'
    }
  ];

  const professionalSteps = [
    {
      number: '01',
      icon: ClipboardCheck,
      title: 'Apply and Verify',
      description: 'Submit your credentials and undergo our rigorous verification process to ensure the highest standards of care.',
      details: [
        'Submit license and certifications',
        'Background check verification',
        'Interview and onboarding',
        'Quality assurance review'
      ],
      color: 'bg-indigo-500'
    },
    {
      number: '02',
      icon: UserCheck,
      title: 'Set Your Practice',
      description: 'Customize your professional profile, set your availability, and define your areas of expertise.',
      details: [
        'Build your professional brand',
        'Set flexible working hours',
        'Define clinical specialties',
        'Integrate your calendar'
      ],
      color: 'bg-[#25A8A0]'
    },
    {
      number: '03',
      icon: HeartHandshake,
      title: 'Start Providing Care',
      description: 'Begin connecting with seekers who match your expertise and start making a difference in their lives.',
      details: [
        'Connect with matched seekers',
        'Manage sessions effortlessly',
        'Secure billing and payments',
        'Dedicated professional support'
      ],
      color: 'bg-orange-500'
    }
  ];

  const currentSteps = activeTab === 'seekers' ? seekerSteps : professionalSteps;

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'HIPAA-compliant platform with end-to-end encryption'
    },
    {
      icon: Clock,
      title: 'Available 24/7',
      description: 'Crisis support and emergency resources anytime'
    },
    {
      icon: Award,
      title: 'Licensed Professionals',
      description: 'All therapists are verified and background-checked'
    },
    {
      icon: Users,
      title: 'Personalized Care',
      description: 'Treatment plans tailored to your unique needs'
    }
  ];

  const faqs = [
    {
      question: 'How does the matching process work?',
      answer: 'Our AI-powered system analyzes your preferences, needs, and goals to connect you with licensed professionals who specialize in your specific areas of concern. You can review multiple matches and choose the therapist that feels right for you.'
    },
    {
      question: 'Is my information secure and confidential?',
      answer: 'Absolutely. We use bank-level encryption and are fully HIPAA compliant. All sessions are private and confidential, and your personal information is never shared without your explicit consent.'
    },
    {
      question: 'What types of therapy sessions are available?',
      answer: 'We offer video sessions, voice-only calls, and text-based therapy. You can choose the format that makes you most comfortable and switch between them as needed.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sohne">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-[#25A8A0] uppercase bg-[#25A8A0]/10 rounded-full">
            The Journey to Wellness
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            How SoulTalk <span className="text-[#25A8A0]">Works</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Whether you're seeking support or providing it, we've built a platform that simplifies every step of the way.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="container mx-auto px-4 mb-20 text-center">
        <div className="inline-flex p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('seekers')}
            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'seekers' ? 'bg-[#25A8A0] text-white shadow-lg shadow-[#25A8A0]/20' : 'text-gray-500 hover:text-gray-700'}`}
          >
            For Seekers
          </button>
          <button
            onClick={() => setActiveTab('professionals')}
            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'professionals' ? 'bg-[#25A8A0] text-white shadow-lg shadow-[#25A8A0]/20' : 'text-gray-500 hover:text-gray-700'}`}
          >
            For Professionals
          </button>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-24 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-20 bottom-20 w-px bg-gradient-to-b from-blue-200 via-[#25A8A0]/30 to-green-200 -translate-x-1/2 -z-10"></div>

          {currentSteps.map((step, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Image/Visual Part */}
              <div className="lg:w-1/2 w-full">
                <div className="relative futuristic-card group">
                  <div className={`absolute -inset-4 ${step.color}/10 rounded-3xl blur-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-500`}></div>
                  <div className="relative bg-white p-2 rounded-3xl shadow-2xl overflow-hidden">
                    <div className={`h-80 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-white relative overflow-hidden`}>
                      <step.icon className={`w-24 h-24 ${step.color.replace('bg-', 'text-')} relative z-10 transition-transform duration-500 group-hover:scale-110`} />
                      <div className="absolute bottom-6 right-8 text-8xl font-black text-gray-100/80 -z-0 select-none">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Part */}
              <div className="lg:w-1/2 w-full space-y-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${step.color} text-white shadow-lg mb-2`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  <span className="block text-sm font-bold text-[#25A8A0] uppercase tracking-wider mb-2">Step {step.number}</span>
                  {step.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-24 border-y border-gray-100 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Thousands Choose SoulTalk</h2>
            <p className="text-gray-600 max-w-xl mx-auto italic">"A platform built with empathy and the latest technology"</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-[#F8FAFB] hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#25A8A0]/20 group">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-[#25A8A0]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion Placeholder (Simple View) */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center text-balance">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center justify-between">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-24">
        <div className="relative bg-[#25A8A0] rounded-[2rem] p-12 md:p-20 overflow-hidden text-center text-white">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-10 text-white/90">
              Join SoulTalk today and connect with experts who can help you thrive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-white text-[#25A8A0] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Get Started Now
              </Link>
              <Link to="/services" className="w-full sm:w-auto px-8 py-4 bg-[#1e8a82] text-white font-bold rounded-xl hover:bg-[#186a64] transition-all flex items-center justify-center gap-2">
                Explore Services <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;