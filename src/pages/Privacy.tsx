import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#25A8A0] to-[#1e8a82] pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Your privacy is fundamental to our mission. We implement rigorous security standards to ensure your personal information remains confidential.
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
                  <Lock className="mr-3 h-6 w-6 text-[#25A8A0]" />
                  Our Privacy Commitment
                </h3>
                <p className="text-teal-800 leading-relaxed">
                  Protecting your mental health journey is our top priority. We use advanced encryption and strict internal protocols to ensure your data, conversations, and personal details are accessible only to you and your chosen providers.
                </p>
              </div>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-[#25A8A0]" />
                  Information We Collect
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Account Details</h3>
                    <ul className="space-y-2 text-gray-600 list-disc pl-4">
                      <li>Full name and contact info</li>
                      <li>Encrypted credentials</li>
                      <li>Secure payment tokens</li>
                      <li>Profile preferences</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Wellness Data</h3>
                    <ul className="space-y-2 text-gray-600 list-disc pl-4">
                      <li>Mood tracking entries</li>
                      <li>Session scheduling history</li>
                      <li>Therapeutic goals</li>
                      <li>Support preferences</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Data</h2>
                <div className="space-y-4">
                  <p>We process your information to provide a seamless mental health experience:</p>
                  <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                    <li className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-[#25A8A0] mt-2 mr-3 flex-shrink-0" />
                      <span>Matching with verified experts</span>
                    </li>
                    <li className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-[#25A8A0] mt-2 mr-3 flex-shrink-0" />
                      <span>Improving platform accessibility</span>
                    </li>
                    <li className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-[#25A8A0] mt-2 mr-3 flex-shrink-0" />
                      <span>Processing secure transactions</span>
                    </li>
                    <li className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-[#25A8A0] mt-2 mr-3 flex-shrink-0" />
                      <span>Crisis support coordination</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Measures</h2>
                <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-2xl">
                  <p className="mb-6 opacity-80">We safeguard your data through multiple layers of world-class security:</p>
                  <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
                    <li className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <strong className="block text-[#25A8A0] mb-1">End-to-End Encryption</strong>
                      <span className="text-sm opacity-70">Your conversations are private and encrypted in transit.</span>
                    </li>
                    <li className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <strong className="block text-[#25A8A0] mb-1">Zero-Leak Policy</strong>
                      <span className="text-sm opacity-70">Strict internal controls prevent unauthorized data access.</span>
                    </li>
                    <li className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <strong className="block text-[#25A8A0] mb-1">Verified Providers</strong>
                      <span className="text-sm opacity-70">Every professional undergoes a rigorous background check.</span>
                    </li>
                    <li className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <strong className="block text-[#25A8A0] mb-1">Secure Infrastructure</strong>
                      <span className="text-sm opacity-70">Data is hosted on highly secure, audited servers.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
                <p className="mb-8">Our privacy team is available to address any concerns.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="mailto:privacy@soultalk.org" className="bg-[#25A8A0] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#1e8a82] transition-colors shadow-lg">
                    Email Support
                  </a>
                  <Link to="/contact" className="border-2 border-[#25A8A0] text-[#25A8A0] px-8 py-3 rounded-2xl font-bold hover:bg-teal-50 transition-colors">
                    Contact Form
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;