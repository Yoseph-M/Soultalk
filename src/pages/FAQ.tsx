import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Shield, CreditCard, UserCheck, Zap } from 'lucide-react';

const FAQ: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const categories = [
        { id: 'general', name: 'General', icon: Zap },
        { id: 'privacy', name: 'Privacy & Security', icon: Shield },
        { id: 'sessions', name: 'Sessions & Care', icon: MessageCircle },
        { id: 'payment', name: 'Billing & Payments', icon: CreditCard },
        { id: 'professionals', name: 'For Professionals', icon: UserCheck }
    ];

    const faqs = [
        {
            category: 'general',
            question: 'What is SoulTalk?',
            answer: 'SoulTalk is a professional mental health platform that connects individuals with licensed therapists and counselors through secure, confidential video, voice, and text sessions.'
        },
        {
            category: 'privacy',
            question: 'Is my information secure and confidential?',
            answer: 'Absolutely. We use bank-level encryption and strict privacy protocols. All sessions are private and confidential, and your personal information is never shared without your explicit consent.'
        },
        {
            category: 'sessions',
            question: 'How do I get matched with a therapist?',
            answer: 'Our AI-powered system analyzes your preferences, needs, and goals to connect you with licensed professionals who specialize in your specific areas of concern. You can review multiple matches and choose the therapist that feels right for you.'
        },
        {
            category: 'sessions',
            question: 'What types of therapy sessions are available?',
            answer: 'We offer video sessions, voice-only calls, and text-based therapy. You can choose the format that makes you most comfortable and switch between them as needed.'
        },
        {
            category: 'payment',
            question: 'How much does SoulTalk cost?',
            answer: 'SoulTalk offers several subscription plans tailored to different needs. You can view our full pricing on the Pricing page. We aim to make professional care accessible and inclusive.'
        },
        {
            category: 'professionals',
            question: 'How do you verify your professionals?',
            answer: 'Every professional on SoulTalk undergoes a rigorous verification process, including license verification, background checks, and professional reference reviews to ensure the highest standards of care.'
        },
        {
            category: 'privacy',
            question: 'Can I remain anonymous?',
            answer: 'Yes, we value your privacy. While we need some information for account management and safety, you can choose how you present yourself in sessions and use our anonymity features.'
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#25A8A0] to-[#1e8a82] pt-32 pb-24 px-4 overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">How can we help?</h1>
                    <p className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                        Find answers to common questions about our platform and mental health journey.
                    </p>

                    <div className="max-w-2xl mx-auto relative group">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] text-white placeholder-white/60 focus:bg-white/20 focus:outline-none transition-all shadow-2xl"
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 w-6 h-6" />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto max-w-4xl px-4 py-20 -mt-10 relative z-20">
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#25A8A0]/30 transition-all font-bold text-gray-700"
                        >
                            <cat.icon className="w-5 h-5 text-[#25A8A0]" />
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 transition-all hover:border-[#25A8A0]/20"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                                >
                                    <span className="text-xl font-bold text-gray-900 group-hover:text-[#25A8A0] transition-colors leading-tight">
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-6 h-6 text-[#25A8A0] flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                {openIndex === index && (
                                    <div className="px-8 pb-8 animate-fade-in">
                                        <div className="h-px bg-gray-100 mb-6"></div>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-xl font-medium">No questions found matching your search.</p>
                        </div>
                    )}
                </div>

                <div className="mt-20 text-center bg-gray-900 rounded-[3rem] p-12 text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#25A8A0] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                            Our support team is available 24/7 to help you with any issues or queries.
                        </p>
                        <a href="mailto:support@soultalk.org" className="inline-block bg-[#25A8A0] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-[#1e8a82] transition-colors">
                            Contact Support
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FAQ;
