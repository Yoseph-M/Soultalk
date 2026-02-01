import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#25A8A0] to-[#1e8a82] pt-32 pb-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed">
            Have questions or need support? Our team is here to help you on your mental wellness journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 -mt-12 relative z-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 transform transition-transform hover:scale-[1.02]">
                <div className="flex items-center space-x-6">
                  <div className="h-14 w-14 bg-[#25A8A0]/10 rounded-2xl flex items-center justify-center text-[#25A8A0]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email Us</h3>
                    <p className="text-lg font-bold text-gray-900">support@soultalk.org</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 transform transition-transform hover:scale-[1.02]">
                <div className="flex items-center space-x-6">
                  <div className="h-14 w-14 bg-[#25A8A0]/10 rounded-2xl flex items-center justify-center text-[#25A8A0]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Call Us</h3>
                    <p className="text-lg font-bold text-gray-900">+251 XXX XXX XXX</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 transform transition-transform hover:scale-[1.02]">
                <div className="flex items-center space-x-6">
                  <div className="h-14 w-14 bg-[#25A8A0]/10 rounded-2xl flex items-center justify-center text-[#25A8A0]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Visit Us</h3>
                    <p className="text-lg font-bold text-gray-900">Addis Ababa, Ethiopia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
                {submitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center h-24 w-24 bg-green-100 text-green-600 rounded-full mb-6">
                      <CheckCircle className="h-12 w-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                    <p className="text-gray-600 text-lg mb-8">
                      Thank you for reaching out. A SoulTalk representative will respond to your inquiry within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-[#25A8A0] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#1e8a82] transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#25A8A0] transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#25A8A0] transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Your Message</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="How can we help you today?"
                        rows={6}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#25A8A0] transition-all resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#25A8A0] hover:bg-[#1e8a82] text-white font-black text-lg py-5 rounded-[2rem] shadow-xl hover:shadow-[#25A8A0]/30 transition-all flex items-center justify-center space-x-3 group active:scale-95"
                    >
                      <span>Send Message</span>
                      <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;