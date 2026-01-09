import React from 'react';
import { Link } from 'react-router-dom';
import {CheckCircle } from 'lucide-react';
import Header from './Header';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Individual Therapy',
      description: 'One-on-one sessions with licensed mental health professionals',
      features: [
        'Licensed therapists and counselors',
        'Video, voice, or text sessions',
        'Flexible scheduling',
        'Personalized treatment plans'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Group Support',
      description: 'Connect with others in moderated group therapy sessions',
      features: [
        'Peer support groups',
        'Topic-specific sessions',
        'Professional moderation',
        'Safe, supportive environment'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Specialized Care',
      description: 'Expert support for specific mental health conditions',
      features: [
        'Anxiety and depression',
        'Trauma and PTSD',
        'Relationship counseling',
        'Addiction support'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Crisis Support',
      description: '24/7 emergency mental health assistance',
      features: [
        'Immediate crisis intervention',
        'Safety planning',
        'Emergency resources',
        'Follow-up care'
      ],
      color: 'from-red-500 to-red-600'
    }
  ];

  const specializations = [
    'Anxiety Disorders',
    'Depression',
    'Trauma & PTSD',
    'Relationship Issues',
    'Addiction Recovery',
    'Grief & Loss',
    'Eating Disorders',
    'Bipolar Disorder',
    'OCD',
    'ADHD',
    'Life Transitions',
    'Stress Management'
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Mental Health Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional mental health support tailored to your unique needs. Connect with licensed therapists 
            and counselors through secure, convenient, and effective treatment options.
          </p>
        </div>

        {}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <div key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white rounded-lg p-8">
              {}
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Areas of Specialization</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our licensed professionals specialize in a wide range of mental health conditions and concerns
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specializations.map((specialization, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <span className="text-gray-700 font-medium">{specialization}</span>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="text-center bg-gradient-to-r from-[#25A8A0] to-green-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards better mental health today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#25A8A0] font-semibold px-8 py-3 rounded-lg transition-colors">
                Explore The Pricing
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;