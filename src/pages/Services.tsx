import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Heart, Users, Shield, Zap, ArrowRight, Star } from 'lucide-react';
import Header from './Header';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Individual Therapy',
      description: 'One-on-one sessions with licensed mental health professionals tailored to your personal journey.',
      icon: Heart,
      features: [
        'Licensed therapists and counselors',
        'Video, voice, or text sessions',
        'Flexible scheduling',
        'Personalized treatment plans'
      ],
      color: 'blue'
    },
    {
      title: 'Group Support',
      description: 'Connect with others in moderated group therapy sessions. Healing happens together.',
      icon: Users,
      features: [
        'Peer support groups',
        'Topic-specific sessions',
        'Professional moderation',
        'Safe, supportive environment'
      ],
      color: 'teal'
    },
    {
      title: 'Specialized Care',
      description: 'Expert support for specific conditions using evidence-based therapeutic approaches.',
      icon: Star,
      features: [
        'Anxiety and depression',
        'Trauma and PTSD',
        'Relationship counseling',
        'Addiction support'
      ],
      color: 'purple'
    },
    {
      title: 'Crisis Support',
      description: 'Immediate, 24/7 assistance for those in urgent need of mental health intervention.',
      icon: Zap,
      features: [
        'Immediate crisis intervention',
        'Safety planning',
        'Emergency resources',
        'Follow-up care'
      ],
      color: 'red'
    }
  ];

  const specializations = [
    'Anxiety Disorders', 'Depression', 'Trauma & PTSD', 'Relationship Issues',
    'Addiction Recovery', 'Grief & Loss', 'Eating Disorders', 'Bipolar Disorder',
    'OCD', 'ADHD', 'Life Transitions', 'Stress Management'
  ];

  return (
    <div className="min-h-screen bg-white font-sohne">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-32 pb-24 bg-[#F8FAFB] overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Comprehensive <span className="text-[#25A8A0]">Mental Health</span> Services
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Professional support tailored to your unique needs. Connect with licensed therapists
              through secure, convenient, and effective treatment options.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth" className="px-8 py-4 bg-[#25A8A0] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Start Your Journey
              </Link>
              <a href="#specializations" className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                View Specializations
              </a>
            </div>
          </div>
        </div>
        {/* Background visual element */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-l from-[#F8FAFB] via-transparent to-transparent z-10"></div>
          <div className="w-full h-full bg-[#25A8A0]/5 flex items-center justify-center">
            <div className="w-96 h-96 bg-white rounded-[3rem] shadow-2xl rotate-12 flex items-center justify-center overflow-hidden border-8 border-white">
              <div className="text-9xl font-black text-[#25A8A0]/10 select-none">Soul</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group futuristic-card bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{service.description}</p>
              <ul className="space-y-4 mb-10">
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="inline-flex items-center gap-2 font-bold text-[#25A8A0] hover:gap-3 transition-all group/link">
                Learn more about this service <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Specializations Section */}
      <div id="specializations" className="bg-[#101828] py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Expertise Across All Areas</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our network of professionals brings deep expertise to every corner of mental health.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specializations.map((spec, index) => (
              <div key={index} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#25A8A0]/20 hover:border-[#25A8A0]/50 transition-all duration-300 text-center">
                <span className="text-lg font-semibold">{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-br from-[#F8FAFB] to-white rounded-[3rem] p-12 md:p-20 border border-gray-100 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Your Safety & Confidentiality is Our Priority</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Every interaction on SoulTalk is protected by military-grade encryption. We are 100% HIPAA compliant and committed to the highest ethical standards of care.
            </p>
            <div className="space-y-4">
              {[
                'Bank-level 256-bit encryption',
                'Anonymity options available',
                'Strict data protection policies',
                'Verified & licensed professionals'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-[#25A8A0]" />
                  <span className="text-gray-900 font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-full aspect-square bg-white rounded-3xl shadow-2xl flex items-center justify-center p-12 border border-gray-100 rotate-3">
              <Shield className="w-48 h-48 text-[#25A8A0]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl font-black text-[#25A8A0]">SoulTalk Safe</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#25A8A0] py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Take the First Step?</h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            Choose the plan that fits your life and start speaking with a professional today.
          </p>
          <Link to="/pricing" className="inline-block px-10 py-5 bg-white text-[#25A8A0] font-black text-lg rounded-2xl shadow-2xl hover:scale-105 transition-transform">
            Explore Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;