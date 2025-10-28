import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none text-gray-600">
        <p className="text-sm text-gray-500 mb-8">Last updated: December 30, 2024</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using SoulTalk, you accept and agree to be bound by the terms and provision of this 
            agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
          <p>
            SoulTalk is a mental health support platform that connects users with certified professionals and trained 
            peer listeners through secure chat, voice, and video communications. Our service is designed to provide 
            emotional support and mental health resources.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 18 years old to use this service</li>
            <li>You agree to provide accurate and complete information</li>
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You agree not to use the service for any unlawful purposes</li>
            <li>You understand this service is not a substitute for emergency medical care</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Privacy and Confidentiality</h2>
          <p>
            We are committed to protecting your privacy and maintaining the confidentiality of your personal 
            information. Please review our Privacy Policy for detailed information about how we collect, use, and 
            protect your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Crisis Situations</h2>
          <p>
            If you are experiencing a mental health crisis or having thoughts of self-harm, please contact emergency 
            services immediately. SoulTalk is not an emergency service and should not be used in crisis situations 
            requiring immediate intervention.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
          <p>
            SoulTalk and its affiliates shall not be liable for any direct, indirect, incidental, special, or 
            consequential damages resulting from the use or inability to use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
          <ul className="list-none mt-4">
            <li>Email: legal@soultalk.com</li>
            <li>Phone: 1-800-SOUL-TALK</li>
            <li>Address: 123 Wellness Street, Mental Health City, MH 12345</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Terms;