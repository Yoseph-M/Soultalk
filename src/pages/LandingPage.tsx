import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAward } from 'react-icons/fa6';
import { FaRegClock, FaLock, FaCertificate, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { User } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import mhVideo from '../assets/video/V1.mp4';
import featureTherapy from '../assets/images/feature_therapy.png';
import featureProgress from '../assets/images/feature_progress.png';
import featureCare from '../assets/images/feature_care.png';
import featureCrisis from '../assets/images/feature_crisis_new.png';
import { useAuth } from '../contexts/AuthContext';

const CountUp = ({ end, duration = 2000, suffix = '', decimals = 0 }: { end: number, duration?: number, suffix?: string, decimals?: number }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isIntersecting) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isIntersecting, end, duration]);

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>;
};

const LandingPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && user) {
      if (user.type === 'professional' || user.type === 'listener') {
        if (user.verified) {
          navigate('/professionals');
        }
        // If unverified, stay on landing page
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate]);


  const [stats, setStats] = React.useState({ people_helped: 0, support_sessions: 0, licensed_experts: 0 });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${apiUrl}/api/auth/stats/`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const testimonials = [
    {
      author: "A SoulTalk Seeker",
      role: "Seeker",
      content: "SoulTalk has completely transformed how I approach mental wellness. The platform is secure, the professionals are expert, and the support is truly life-changing.",
      rating: 4.5
    },
    {
      author: "A SoulTalk Seeker",
      role: "Seeker",
      content: "I finally found a place where I feel safe sharing my thoughts. The matching process was so smooth and my therapist is amazing.",
      rating: 5
    },
    {
      author: "A SoulTalk Expert",
      role: "Listener",
      content: "As a professional, SoulTalk provides me with the perfect tools to reach those in need of support. It's a rewarding experience every day.",
      rating: 4
    },
    {
      author: "A SoulTalk Seeker",
      role: "Seeker",
      content: "The 24/7 support is a lifesaver. Knowing there's always someone to talk to gives me so much peace of mind.",
      rating: 5
    },
    {
      author: "A SoulTalk Expert",
      role: "Listener",
      content: "The platform's focus on privacy and security allows me to conduct sessions with complete confidence.",
      rating: 4.5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-20 px-4 hero-bleed min-h-[90vh] md:min-h-[105vh] flex items-center">
        { }
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={mhVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        { }
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <div className="container mx-auto text-center max-w-5xl relative z-20 mt-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8 md:mb-16 leading-tight md:leading-[1.15]">
            Your Safe Space for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25A8A0] to-teal-600 mental-animated">
              Mental Wellness
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white mb-10 md:mb-12 leading-relaxed max-w-4xl mx-auto opacity-90">
            Connect with licensed mental health professionals through secure, confidential conversations.
            Get the support you need, when you need it.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/auth?mode=signup">
              <button className="bg-[#25A8A0] hover:bg-[#1e8a82] text-white text-lg font-bold px-12 py-4 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-8 text-white/90">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <FaLock className="h-4 w-4 text-[#25A8A0]" />
              </div>
              <span className="font-medium">100% Confidential</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <FaAward className="h-4 w-4 text-[#25A8A0]" />
              </div>
              <span className="font-medium">Licensed Experts</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <FaRegClock className="h-4 w-4 text-[#25A8A0]" />
              </div>
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white border-y border-gray-100 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center text-gray-900">
            <div className="transform hover:scale-105 transition-transform duration-300 group">
              <div className="text-5xl font-black mb-3 text-gray-900 group-hover:text-[#25A8A0] transition-colors">
                <CountUp
                  end={stats.people_helped >= 1000 ? stats.people_helped / 1000 : stats.people_helped}
                  suffix={stats.people_helped >= 1000 ? "K+" : "+"}
                  decimals={stats.people_helped >= 1000 && stats.people_helped % 1000 !== 0 ? 1 : 0}
                />
              </div>
              <div className="text-sm uppercase tracking-widest font-bold text-gray-500">People Helped</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300 group">
              <div className="text-5xl font-black mb-3 text-gray-900 group-hover:text-[#25A8A0] transition-colors">
                <CountUp
                  end={stats.support_sessions >= 1000000 ? stats.support_sessions / 1000000 : (stats.support_sessions >= 1000 ? stats.support_sessions / 1000 : stats.support_sessions)}
                  suffix={stats.support_sessions >= 1000000 ? "M+" : (stats.support_sessions >= 1000 ? "K+" : "+")}
                  decimals={stats.support_sessions >= 1000000 ? 1 : (stats.support_sessions >= 1000 && stats.support_sessions % 1000 !== 0 ? 1 : 0)}
                />
              </div>
              <div className="text-sm uppercase tracking-widest font-bold text-gray-500">Support Sessions</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300 group">
              <div className="text-5xl font-black mb-3 text-gray-900 group-hover:text-[#25A8A0] transition-colors">
                <CountUp
                  end={stats.licensed_experts >= 1000 ? stats.licensed_experts / 1000 : stats.licensed_experts}
                  suffix={stats.licensed_experts >= 1000 ? "K+" : "+"}
                  decimals={stats.licensed_experts >= 1000 && stats.licensed_experts % 1000 !== 0 ? 1 : 0}
                />
              </div>
              <div className="text-sm uppercase tracking-widest font-bold text-gray-500">Licensed Experts</div>
            </div>
          </div>
        </div>
      </section>

      { }
      { }
      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Why Choose SoulTalk?</h2>
            <div className="w-20 h-1.5 bg-[#25A8A0] rounded-full mb-4"></div>
            <p className="text-lg font-semibold text-[#25A8A0] text-center">Your trusted platform for mental wellness</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            { }
            <div className="relative rounded-[2rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl bg-white border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="h-40 md:h-48 w-full overflow-hidden bg-gray-100 rounded-t-2xl relative">
                  <img
                    src={featureTherapy}
                    alt="Individual Therapy"
                    className="w-full h-full object-cover transform transition-all duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>
                <div className="relative p-6 md:p-8">
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#25A8A0] transition-colors">Individual Therapy</h3>
                    <p className="text-base leading-relaxed text-gray-600 mx-auto">One-on-one sessions with licensed therapists through secure video, voice, or text chat</p>
                  </div>
                </div>
              </div>
            </div>
            { }
            { }
            { }
            <div className="relative rounded-[2rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl bg-white border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="h-40 md:h-48 w-full overflow-hidden bg-gray-100 rounded-t-2xl relative">
                  <img
                    src={featureProgress}
                    alt="Progress Tracking"
                    className="w-full h-full object-cover transform transition-all duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>
                <div className="relative p-6 md:p-8">
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#25A8A0] transition-colors">Progress Tracking</h3>
                    <p className="text-base leading-relaxed text-gray-600 mx-auto">Monitor your mental health journey with personalized insights and analytics</p>
                  </div>
                </div>
              </div>
            </div>
            { }
            <div className="relative rounded-[2rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl bg-white border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="h-40 md:h-48 w-full overflow-hidden bg-gray-100 rounded-t-2xl relative">
                  <img
                    src={featureCare}
                    alt="Specialized Care"
                    className="w-full h-full object-cover transform transition-all duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>
                <div className="relative p-6 md:p-8">
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#25A8A0] transition-colors">Specialized Care</h3>
                    <p className="text-base leading-relaxed text-gray-600 mx-auto">Expert support for anxiety, depression, trauma, relationships, and more</p>
                  </div>
                </div>
              </div>
            </div>
            { }
            <div className="relative rounded-[2rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl bg-white border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="h-40 md:h-48 w-full overflow-hidden bg-gray-100 rounded-t-2xl relative">
                  <img
                    src={featureCrisis}
                    alt="Crisis Intervention"
                    className="w-full h-full object-cover transform transition-all duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>
                <div className="relative p-6 md:p-8">
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#25A8A0] transition-colors">Crisis Intervention</h3>
                    <p className="text-base leading-relaxed text-gray-600 mx-auto">24/7 emergency support and immediate assistance when you need it most</p>
                  </div>
                </div>
              </div>
            </div>
            { }
            { }
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">What Our Community Says</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 text-center">
            Real stories from both seekers and professionals in our community
          </p>
          <div className="marquee-container">
            <div className="marquee-content">
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div key={idx} className="testimonial-card bg-white shadow-xl rounded-[2rem] p-8 flex flex-col items-center relative group hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gray-100"></div>
                  <svg className="absolute right-4 top-4 w-12 h-12 text-gray-200 opacity-20 z-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0-8V7a4 4 0 1 1 8 0v2" /></svg>
                  <div className="flex items-center mb-4 z-10">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(testimonial.rating) ? (
                        <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <FaStarHalfAlt key={i} className="h-5 w-5 text-yellow-400" />
                      )
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic z-10">"{testimonial.content}"</p>
                  <div className="flex items-center z-10 mt-auto w-full">
                    <div className="w-14 h-14 bg-[#25A8A0]/10 rounded-full flex items-center justify-center mr-4 shadow-lg ring-4 ring-white group-hover:ring-[#25A8A0]/20 transition-all">
                      <User className="text-[#25A8A0] w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-base">{testimonial.author}</div>
                      <div className={`text-[10px] ${testimonial.role === 'Seeker' ? 'bg-[#25A8A0]/10 text-[#25A8A0]' : 'bg-orange-50 text-orange-600'} px-3 py-1 rounded-full inline-block mt-1 font-black uppercase tracking-wider`}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Getting Started is Simple</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Begin your mental health journey in just a few easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 group-hover:bg-[#25A8A0] group-hover:text-white transition-all duration-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-gray-900 group-hover:text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sign Up</h3>
              <p className="text-gray-600">Create your account and complete a brief assessment</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 group-hover:bg-[#25A8A0] group-hover:text-white transition-all duration-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-gray-900 group-hover:text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Get Matched</h3>
              <p className="text-gray-600">We connect you with the perfect mental health professional</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 group-hover:bg-[#25A8A0] group-hover:text-white transition-all duration-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-gray-900 group-hover:text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Start Sessions</h3>
              <p className="text-gray-600">Begin therapy through video, voice, or text chat</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 group-hover:bg-[#25A8A0] group-hover:text-white transition-all duration-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-gray-900 group-hover:text-white">4</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-gray-600">Monitor your journey with personalized insights</p>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <Link to="/services">
              <button className="bg-[#25A8A0] hover:bg-[#1e8a82] text-white px-10 py-4 rounded-[2rem] transition-all text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95">
                Explore Our Services
              </button>
            </Link>
          </div>
        </div>
      </section>
      { }
      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your Privacy & Security</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We maintain the highest standards of security and confidentiality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border-0 shadow-xl rounded-[2rem] p-8 text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
                <FaCertificate className="h-8 w-8 text-gray-900" tabIndex={0} aria-label="Privacy Guaranteed" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-[-2.5rem] bg-gray-900 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg">
                  Privacy Guaranteed: Your data is protected by the highest privacy standards
                </span>
              </div>
              <h3 className="font-bold mb-2">Privacy Guaranteed</h3>
              <p className="text-gray-600 text-sm">Your data is protected by the highest privacy standards</p>
            </div>

            <div className="bg-white border-0 shadow-xl rounded-[2rem] p-8 text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
                <FaLock className="h-8 w-8 text-gray-900" tabIndex={0} aria-label="End-to-End Encryption" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-[-2.5rem] bg-gray-900 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg">
                  End-to-End Encryption: All communications are fully encrypted and secure
                </span>
              </div>
              <h3 className="font-bold mb-2">End-to-End Encryption</h3>
              <p className="text-gray-600 text-sm">All communications are fully encrypted and secure</p>
            </div>

            <div className="bg-white border-0 shadow-xl rounded-[2rem] p-8 text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
                <FaAward className="h-8 w-8 text-gray-900" tabIndex={0} aria-label="Licensed Professionals" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-[-2.5rem] bg-gray-900 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg">
                  Licensed Professionals: All therapists are verified and background-checked
                </span>
              </div>
              <h3 className="font-bold mb-2">Licensed Professionals</h3>
              <p className="text-gray-600 text-sm">All therapists are verified and background-checked</p>
            </div>

            <div className="bg-white border-0 shadow-xl rounded-[2rem] p-8 text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
                <FaRegClock className="h-8 w-8 text-gray-900" tabIndex={0} aria-label="24/7 Support" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-[-2.5rem] bg-gray-900 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg">
                  24/7 Support: Crisis support and emergency resources anytime
                </span>
              </div>
              <h3 className="font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Crisis support and emergency resources anytime</p>
            </div>
          </div>
        </div>
      </section>

      { }
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our mental health platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white border-0 shadow-xl rounded-[2rem] p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold mb-3">How do I get started?</h3>
              <p className="text-gray-600">Simply sign up, complete a brief assessment, and we'll match you with a licensed professional within 24-48 hours.</p>
            </div>

            <div className="bg-white border-0 shadow-xl rounded-[2rem] p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold mb-3">Is my information secure?</h3>
              <p className="text-gray-600">Yes, we use bank-level encryption and strict privacy protocols. Your privacy and security are our top priorities.</p>
            </div>

            <div className="bg-white border-0 shadow-xl rounded-[2rem] p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold mb-3">What types of therapy do you offer?</h3>
              <p className="text-gray-600">We offer video, voice, and text-based therapy sessions with licensed professionals specializing in various areas.</p>
            </div>

            <div className="bg-white border-0 shadow-xl rounded-[2rem] p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold mb-3">Can I switch therapists?</h3>
              <p className="text-gray-600">Absolutely. You can request a new therapist at any time to ensure you find the best fit for your needs.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/faq">
              <button className="border-2 border-[#25A8A0] text-[#25A8A0] hover:bg-[#25A8A0] hover:text-white px-10 py-4 rounded-[2rem] transition-all font-bold text-lg active:scale-95">
                View All FAQs
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Start Your Journey?</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Take the first step towards better mental health with professional support tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/auth?mode=signup">
              <button className="bg-[#25A8A0] text-white hover:bg-[#208f88] text-lg font-bold px-12 py-4 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </section>



      <Footer />
    </div >
  );
};

export default LandingPage;