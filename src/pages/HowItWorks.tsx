import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, MessageCircle, TrendingUp, Shield, Clock, CheckCircle, Award, Users } from 'lucide-react';
import Header from './Header';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up and tell us about your mental health goals, preferences, and what kind of support you\'re looking for.',
      details: [
        'Quick 5-minute signup process',
        'Share your preferences and goals',
        'Complete confidential assessment',
        'Set your availability and preferences'
      ]
    },
    {
      number: 2,
      icon: Search,
      title: 'Get Matched',
      description: 'Our intelligent matching system connects you with licensed professionals who specialize in your specific needs.',
      details: [
        'AI-powered matching algorithm',
        'Based on your needs and preferences',
        'Licensed, verified professionals',
        'Multiple options to choose from'
      ]
    },
    {
      number: 3,
      icon: MessageCircle,
      title: 'Start Your Sessions',
      description: 'Begin your mental health journey with secure video, voice, or text sessions at times that work for you.',
      details: [
        'Flexible scheduling options',
        'Video, voice, or text sessions',
        'Secure, encrypted platform',
        'Session notes and progress tracking'
      ]
    },
    {
      number: 4,
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor your mental health journey with personalized insights, goal tracking, and continuous support.',
      details: [
        'Progress tracking dashboard',
        'Mood and wellness insights',
        'Goal setting and achievement',
        'Continuous care coordination'
      ]
    }
  ];

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
    },
    {
      question: 'How quickly can I start therapy?',
      answer: 'Most users are matched with a therapist within 24-48 hours of signing up. Emergency support is available immediately for crisis situations.'
    },
    {
      question: 'Can I change therapists if needed?',
      answer: 'Yes, you can request a new therapist at any time. We want to ensure you have the best possible therapeutic relationship, so switching is always an option.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How SoulTalk Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Getting started with professional mental health support is simple. Follow these four easy steps 
            to begin your journey toward better mental wellness.
          </p>
        </div>

        {}
        <div className="mb-20">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#25A8A0] to-green-600 rounded-2xl flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                    <step.icon className="h-8 w-8 text-[#25A8A0]" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-lg">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#25A8A0] to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <step.icon className="h-12 w-12 text-white" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Step {step.number}</h4>
                      <p className="text-gray-600">{step.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SoulTalk?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the highest quality mental health support with industry-leading security and care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about our platform and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border-0 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="text-center bg-gradient-to-r from-[#25A8A0] to-green-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who have found support and healing through SoulTalk
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services">
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#25A8A0] font-semibold px-8 py-3 rounded-lg transition-colors">
                Explore Our Services
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;