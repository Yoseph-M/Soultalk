import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would handle sending the form data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#25A8A0] mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 text-center mb-10">We'd love to hear from you! Fill out the form below or reach us directly using the contact information.</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 mb-10">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent"
              rows={5}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#25A8A0] hover:bg-[#1e8a82] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Send Message
          </button>
          {submitted && <p className="text-green-600 text-center mt-4">Thank you for reaching out! We'll get back to you soon.</p>}
        </form>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-[#25A8A0] mb-2">Contact Information</h2>
          <p className="text-gray-700">Email: <a href="mailto:support@soultalk.org" className="text-[#25A8A0] hover:underline">support@soultalk.org</a></p>
          <p className="text-gray-700">Phone: <a href="tel:+251XXXXXXXXX" className="text-[#25A8A0] hover:underline">+251 XXX XXX XXX</a></p>
          <p className="text-gray-700">Address: Addis Ababa, Ethiopia</p>
        </div>
      </div>
    </div>
  );
};

export default Contact; 