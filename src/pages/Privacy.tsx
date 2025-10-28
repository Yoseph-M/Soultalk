import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex items-center space-x-3 mb-8">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <p className="text-sm text-gray-500 mb-8">Last updated: December 30, 2024</p>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Our Privacy Commitment</h3>
          <p className="text-blue-800">
            Your privacy is fundamental to our mission. We use military-grade encryption and follow HIPAA compliance 
            standards to ensure your personal information and conversations remain completely confidential.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information (processed securely by third-party providers)</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Health Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mental health assessments and mood tracking data</li>
            <li>Session notes and treatment plans (with your consent)</li>
            <li>Communication with healthcare providers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve our mental health services</li>
            <li>Match you with appropriate healthcare providers</li>
            <li>Process payments and manage your account</li>
            <li>Send important service updates and notifications</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information 
            only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With healthcare providers you choose to work with</li>
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect the safety of users or the public</li>
            <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <p className="mb-4">We implement multiple layers of security to protect your information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>End-to-end encryption for all communications</li>
            <li>Secure data storage with regular backups</li>
            <li>Regular security audits and penetration testing</li>
            <li>Staff training on privacy and security protocols</li>
            <li>HIPAA-compliant infrastructure and procedures</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Export your data</li>
            <li>Opt out of non-essential communications</li>
            <li>File a complaint with regulatory authorities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <ul className="list-none mt-4">
            <li>Email: privacy@soultalk.com</li>
            <li>Phone: 1-800-SOUL-TALK</li>
            <li>Privacy Officer: 123 Wellness Street, Mental Health City, MH 12345</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Privacy;