import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Logo from '../assets/images/stlogo.svg';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-36 pb-24 px-8 shadow-2xl border-t border-gray-700">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-20 mb-12">
                    {/* Logo & Description */}
                    <div className="flex flex-col items-start w-full min-w-0 mb-10 md:mb-0">
                        <Link to="/" className="flex items-center space-x-4 mb-6 hover:opacity-90 transition-opacity">
                            <img src={Logo} alt="SoulTalk Logo" className="h-14 w-14 bg-white/10 rounded-2xl p-2 shadow-lg" />
                            <span className="text-2xl font-bold text-white tracking-wide">SoulTalk</span>
                        </Link>
                        <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                            Professional mental health support when you need it most. Connect with licensed therapists and counselors through secure, confidential conversations.
                        </p>
                    </div>
                    {/* Resources */}
                    <div className="w-full flex flex-col text-center min-w-0 mb-8" style={{ marginBottom: '32px' }}>
                        <h3 className="font-semibold mb-5 text-lg tracking-wide text-[#25A8A0] text-center">Resources</h3>
                        <ul className="flex flex-col gap-3 text-gray-300 text-sm mx-auto text-left" style={{ width: 'max-content' }}>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    {/* Legal */}
                    <div className="w-full min-w-0">
                        <h3 className="font-semibold mb-5 text-lg tracking-wide text-[#25A8A0]">Legal & Compliance</h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                    {/* Contact */}
                    <div className="w-full min-w-0">
                        <h3 className="font-semibold mb-5 text-lg tracking-wide text-[#25A8A0]">Contact & Support</h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li><a href="mailto:support@soultalk.org" className="hover:text-white transition-colors">support@soultalk.org</a></li>
                            <li><a href="tel:+251XXXXXXXXX" className="hover:text-white transition-colors">+251 XXX XXX XXX</a></li>
                            <li className="text-gray-400">Addis Ababa, Ethiopia</li>
                        </ul>
                    </div>
                    {/* Social */}
                    <div className="w-full min-w-0">
                        <h3 className="font-semibold mb-5 text-lg tracking-wide text-[#25A8A0]">Social Media</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#25A8A0] rounded-full flex items-center justify-center transition-colors shadow-md" aria-label="Facebook">
                                <FaFacebook className="w-6 h-6 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#25A8A0] rounded-full flex items-center justify-center transition-colors shadow-md" aria-label="Instagram">
                                <FaInstagram className="w-6 h-6 text-[#E4405F]" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#25A8A0] rounded-full flex items-center justify-center transition-colors shadow-md" aria-label="LinkedIn">
                                <FaLinkedin className="w-6 h-6 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#25A8A0] rounded-full flex items-center justify-center transition-colors shadow-md" aria-label="Twitter">
                                <FaXTwitter className="w-6 h-6 text-white" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-400 mt-12 pt-8 border-t border-gray-700 text-xs md:text-sm">
                    <p>&copy; 2026 SoulTalk. All rights reserved. Professional mental health support for everyone.</p>
                    <p className="mt-2"></p>
                    <p className="mt-2">Licensed professionals available 24/7 for your mental wellness journey.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
