import React from 'react';
import { FileText, Scale, Lock } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sohne">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#25A8A0] to-[#1e8a82] pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using the SoulTalk platform.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 -mt-10">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="prose prose-lg max-w-none text-gray-600">

              <div className="bg-teal-50 rounded-3xl p-8 mb-12 border border-teal-100">
                <h3 className="text-xl font-bold text-teal-900 mb-4 flex items-center">
                  Our Commitment to You
                </h3>
                <p className="text-teal-800 leading-relaxed font-medium">
                  SoulTalk is dedicated to providing a safe, ethical, and high-quality experience for all our users. These terms ensure that we maintain a community built on trust, respect, and professional standards.
                </p>
              </div>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Scale className="mr-3 h-6 w-6 text-[#25A8A0]" />
                  1. Acceptance of Terms
                </h2>
                <p className="leading-relaxed">
                  By accessing and using SoulTalk, you accept and agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-[#25A8A0]" />
                  2. Description of Service
                </h2>
                <p className="leading-relaxed">
                  SoulTalk is a mental health support platform that connects users with certified professionals and trained
                  peer listeners through secure chat, voice, and video communications. Our service is designed to provide
                  emotional support and mental health resources.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Responsibilities</h2>
                <ul className="grid gap-4 list-none p-0">
                  <li className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="h-6 w-6 rounded-full bg-[#25A8A0] text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">1</div>
                    <span className="font-medium">You must be at least 18 years old to use this service.</span>
                  </li>
                  <li className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="h-6 w-6 rounded-full bg-[#25A8A0] text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</div>
                    <span className="font-medium">You agree to provide accurate and complete information during registration.</span>
                  </li>
                  <li className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="h-6 w-6 rounded-full bg-[#25A8A0] text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</div>
                    <span className="font-medium">You are responsible for maintaining the confidentiality of your account credentials.</span>
                  </li>
                  <li className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">!</div>
                    <span className="font-bold text-red-600">SoulTalk is not an emergency service. In crisis situations, contact local emergency services immediately.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lock className="mr-3 h-6 w-6 text-[#25A8A0]" />
                  4. Privacy and Confidentiality
                </h2>
                <p className="leading-relaxed">
                  We are committed to protecting your privacy and maintaining the confidentiality of your personal
                  information. Please review our Privacy Policy for detailed information about how we collect, use, and
                  protect your data.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  SoulTalk and its affiliates shall not be liable for any direct, indirect, incidental, special, or
                  consequential damages resulting from the use or inability to use our service. We provide resources to support mental wellness but do not guarantee specific outcomes.
                </p>
              </section>

              <section className="text-center pt-8 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions about our terms?</h2>
                <p className="mb-8 text-gray-600">Our legal team is available to clarify any aspects of our service agreement.</p>
                <a href="mailto:legal@soultalk.org" className="inline-block bg-[#25A8A0] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-[#1e8a82] transition-colors">
                  Contact Legal Team
                </a>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;