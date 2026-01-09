import React from 'react';
import { Target, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About SoulTalk</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We're on a mission to make mental health support accessible, affordable, and effective for everyone. 
          Your wellness journey matters, and we're here to support you every step of the way.
        </p>
      </div>

      {}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white border-0 shadow-lg rounded-lg p-6">
          <div className="w-12 h-12 bg-[#25A8A0] rounded-lg flex items-center justify-center mb-4">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To democratize mental health care by providing secure, accessible, and personalized support through 
            innovative technology and compassionate human connection. We believe everyone deserves quality mental 
            health care, regardless of their location, schedule, or circumstances.
          </p>
        </div>

        <div className="bg-white border-0 shadow-lg rounded-lg p-6">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            A world where mental health support is as accessible as physical health care, where stigma is eliminated, 
            and where every person has the tools and support they need to thrive emotionally and mentally. We envision 
            a future where seeking help is seen as a sign of strength.
          </p>
        </div>
      </div>

      {}
      <div className="mb-16">
        <div className="bg-white border-0 shadow-lg rounded-lg overflow-hidden">
          <div className="relative w-full h-64 bg-gradient-to-r from-blue-500 to-green-500">
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed px-4">
                  Founded in 2025, SoulTalk was born from a shared passion for mental wellness and a desire to leverage 
                  technology to make a positive impact. We saw the need for a more accessible, affordable, and personalized 
                  approach to mental health support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#25A8A0] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Accessibility</h3>
            <p className="text-gray-600">
              Mental health support should be available to everyone, regardless of location, time, or financial situation.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy</h3>
            <p className="text-gray-600">
              We maintain the highest standards of confidentiality and security to protect our users' personal information.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Quality</h3>
            <p className="text-gray-600">
              All our professionals are licensed, verified, and committed to providing the highest quality of care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;