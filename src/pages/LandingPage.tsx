import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaAward, FaXTwitter } from 'react-icons/fa6';
import { FaRegClock, FaLock, FaCertificate } from 'react-icons/fa';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import Header from './Header';
import mhVideo from '../assets/video/V1.mp4';
import Logo from '../assets/images/stlogo.svg';
import featureTherapy from '../assets/images/feature_therapy.png';
import featureProgress from '../assets/images/feature_progress.png';
import featureCare from '../assets/images/feature_care.png';
import featureCrisis from '../assets/images/feature_crisis_new.png';
import { useAuth } from '../contexts/AuthContext';

const CountUp = ({ end, duration = 2000, suffix = '', decimals = 0 }: { end: number, duration?: number, suffix?: string, decimals?: number }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
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
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

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



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      { }
      <section className="relative overflow-hidden py-20 px-4 hero-bleed min-h-[105vh]">
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
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-12 md:mb-16 leading-tight md:leading-[1.15]">
            Your Safe Space for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25A8A0] to-teal-600 mental-animated">
              Mental Wellness
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white mb-12 leading-relaxed max-w-4xl mx-auto">
            Connect with licensed mental health professionals through secure, confidential conversations.
            Get the support you need, when you need it, from the comfort of your own space.
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
          <div className="grid md:grid-cols-4 gap-12 text-center text-gray-900">
            <div className="transform hover:scale-105 transition-transform duration-300 group">
              <div className="text-5xl font-black mb-3 text-gray-900 group-hover:text-[#25A8A0] transition-colors"><CountUp end={25} suffix="K+" /></div>
              <div className="text-sm uppercase tracking-widest font-bold text-gray-500">People Helped</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300 group">
              <div className="text-5xl font-black mb-3 text-gray-900 group-hover:text-[#25A8A0] transition-colors"><CountUp end={1} suffix="M+" /></div>
              <div className="text-sm uppercase tracking-widest font-bold text-gray-500">Support Sessions</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300 group">
              <div className="text-5xl font-black mb-3 text-gray-900 group-hover:text-[#25A8A0] transition-colors"><CountUp end={500} suffix="+" /></div>
              <div className="text-sm uppercase tracking-widest font-bold text-gray-500">Licensed Experts</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300 group">
              <div className="text-5xl font-black mb-3 text-gray-900 group-hover:text-[#25A8A0] transition-colors"><CountUp end={4.9} decimals={1} suffix="★" /></div>
              <div className="text-sm uppercase tracking-widest font-bold text-gray-500">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      { }
      { }
      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Why Choose SoulTalk?</h2>
            <p className="text-lg font-semibold text-[#25A8A0] mt-2">Your trusted platform for mental wellness</p>
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

      { }
      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto">
          { }
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">What Our Community Says</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 text-center">
            Real stories from both seekers and professionals in our community
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            { }
            <div className="bg-white shadow-xl rounded-[2rem] p-8 flex flex-col items-center relative animate-fade-in group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border border-gray-100">
              { }
              <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gray-100"></div>
              { }
              <svg className="absolute right-4 top-4 w-12 h-12 text-gray-200 opacity-20 z-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0-8V7a4 4 0 1 1 8 0v2" /></svg>
              { }
              <div className="flex items-center mb-4 z-10">
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStarHalfAlt className="h-5 w-5 text-yellow-400" />
              </div>
              { }
              <p className="text-gray-700 mb-6 leading-relaxed italic z-10">"SoulTalk changed my life. The therapists are incredibly professional and caring. I finally found the support I needed to overcome my anxiety."</p>
              { }
              <div className="flex items-center z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mr-4 shadow-lg ring-4 ring-white group-hover:ring-[#25A8A0]/20 transition-all">
                  <span className="text-gray-900 font-bold text-lg">SM</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Sarah M.</div>
                  <div className="text-xs bg-[#25A8A0]/10 text-[#25A8A0] px-3 py-1 rounded-full inline-block mt-1 font-black uppercase tracking-wider">Seeker</div>
                </div>
              </div>
            </div>
            { }
            <div className="bg-white shadow-xl rounded-[2rem] p-8 flex flex-col items-center relative animate-fade-in group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gray-100"></div>
              <svg className="absolute right-4 top-4 w-12 h-12 text-gray-200 opacity-20 z-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0-8V7a4 4 0 1 1 8 0v2" /></svg>
              <div className="flex items-center mb-4 z-10">
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStarHalfAlt className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic z-10">"The convenience of having therapy sessions from home made all the difference. My therapist helped me through a difficult time with compassion and expertise."</p>
              <div className="flex items-center z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mr-4 shadow-lg ring-4 ring-white group-hover:ring-[#25A8A0]/20 transition-all">
                  <span className="text-gray-900 font-bold text-lg">JD</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">James D.</div>
                  <div className="text-xs bg-[#25A8A0]/10 text-[#25A8A0] px-3 py-1 rounded-full inline-block mt-1 font-black uppercase tracking-wider">Seeker</div>
                </div>
              </div>
            </div>
            { }
            <div className="bg-white shadow-xl rounded-[2rem] p-8 flex flex-col items-center relative animate-fade-in group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gray-100"></div>
              <svg className="absolute right-4 top-4 w-12 h-12 text-gray-200 opacity-20 z-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0-8V7a4 4 0 1 1 8 0v2" /></svg>
              <div className="flex items-center mb-4 z-10">
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic z-10">"As a busy parent, finding time for therapy seemed impossible. SoulTalk's flexible scheduling and caring professionals made it work for my life."</p>
              <div className="flex items-center z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mr-4 shadow-lg ring-4 ring-white group-hover:ring-[#25A8A0]/20 transition-all">
                  <span className="text-gray-900 font-bold text-lg">ML</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Maria L.</div>
                  <div className="text-xs bg-[#25A8A0]/10 text-[#25A8A0] px-3 py-1 rounded-full inline-block mt-1 font-black uppercase tracking-wider">Seeker</div>
                </div>
              </div>
            </div>
            { }
            <div className="bg-white shadow-xl rounded-[2rem] p-8 flex flex-col items-center relative animate-fade-in group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gray-100"></div>
              <svg className="absolute right-4 top-4 w-12 h-12 text-gray-200 opacity-20 z-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0-8V7a4 4 0 1 1 8 0v2" /></svg>
              <div className="flex items-center mb-4 z-10">
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStarHalfAlt className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic z-10">"SoulTalk provides an excellent platform for connecting with clients. The technology is seamless, and I can focus on what I do best - helping people heal and grow."</p>
              <div className="flex items-center z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mr-4 shadow-lg ring-4 ring-white group-hover:ring-[#25A8A0]/20 transition-all">
                  <span className="text-gray-900 font-bold text-lg">DR</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Dr. Rachel K.</div>
                  <div className="text-xs bg-[#25A8A0]/10 text-[#25A8A0] px-3 py-1 rounded-full inline-block mt-1 font-black uppercase tracking-wider">Listener</div>
                </div>
              </div>
            </div>
            { }
            <div className="bg-white shadow-xl rounded-[2rem] p-8 flex flex-col items-center relative animate-fade-in group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gray-100"></div>
              <svg className="absolute right-4 top-4 w-12 h-12 text-gray-200 opacity-20 z-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0-8V7a4 4 0 1 1 8 0v2" /></svg>
              <div className="flex items-center mb-4 z-10">
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStarHalfAlt className="h-5 w-5 text-yellow-400" />
                <FaStarHalfAlt className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic z-10">"The flexibility to set my own schedule while maintaining a meaningful practice has been incredible. SoulTalk's support team is always there when I need them."</p>
              <div className="flex items-center z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mr-4 shadow-lg ring-4 ring-white group-hover:ring-[#25A8A0]/20 transition-all">
                  <span className="text-gray-900 font-bold text-lg">MT</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Dr. Michael T.</div>
                  <div className="text-xs bg-[#25A8A0]/10 text-[#25A8A0] px-3 py-1 rounded-full inline-block mt-1 font-black uppercase tracking-wider">Listener</div>
                </div>
              </div>
            </div>
            { }
            <div className="bg-white shadow-xl rounded-[2rem] p-8 flex flex-col items-center relative animate-fade-in group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gray-100"></div>
              <svg className="absolute right-4 top-4 w-12 h-12 text-gray-200 opacity-20 z-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0-8V7a4 4 0 1 1 8 0v2" /></svg>
              <div className="flex items-center mb-4 z-10">
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
                <FaStar className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic z-10">"Working with SoulTalk has allowed me to reach clients I never could before. The platform's security and professionalism give me complete confidence."</p>
              <div className="flex items-center z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mr-4 shadow-lg ring-4 ring-white group-hover:ring-[#25A8A0]/20 transition-all">
                  <span className="text-gray-900 font-bold text-lg">LC</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Lisa C.</div>
                  <div className="text-xs bg-[#25A8A0]/10 text-[#25A8A0] px-3 py-1 rounded-full inline-block mt-1 font-black uppercase tracking-wider">Listener</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      { }
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
                <FaCertificate className="h-8 w-8 text-gray-900" tabIndex={0} aria-label="HIPAA Compliance" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-[-2.5rem] bg-gray-900 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg">
                  HIPAA Compliance: Full compliance with healthcare privacy regulations
                </span>
              </div>
              <h3 className="font-bold mb-2">HIPAA Compliance</h3>
              <p className="text-gray-600 text-sm">Full compliance with healthcare privacy regulations</p>
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
              <p className="text-gray-600">Yes, we use bank-level encryption and are fully HIPAA compliant. Your privacy and security are our top priorities.</p>
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
            <Link to="/how-it-works">
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



      {/* Enhanced Footer */}
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
            { }
            <div className="w-full min-w-0">
              <h3 className="font-semibold mb-5 text-lg tracking-wide text-[#25A8A0]">Legal & Compliance</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy <span className="text-xs"></span></Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>

              </ul>
            </div>
            { }
            <div className="w-full min-w-0">
              <h3 className="font-semibold mb-5 text-lg tracking-wide text-[#25A8A0]">Contact & Support</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li><a href="mailto:support@soultalk.org" className="hover:text-white transition-colors">support@soultalk.org</a></li>
                <li><a href="tel:+251XXXXXXXXX" className="hover:text-white transition-colors">+251 XXX XXX XXX</a></li>
                <li className="text-gray-400">Addis Ababa, Ethiopia</li>
              </ul>
            </div>
            { }
            <div className="w-full min-w-0">
              <h3 className="font-semibold mb-5 text-lg tracking-wide text-[#25A8A0]">Social Media</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#25A8A0] rounded-full flex items-center justify-center transition-colors shadow-md" aria-label="Facebook" title="Facebook">
                  <FaFacebook className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#25A8A0] rounded-full flex items-center justify-center transition-colors shadow-md" aria-label="Instagram" title="Instagram">
                  <FaInstagram className="w-6 h-6 text-[#E4405F]" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#25A8A0] rounded-full flex items-center justify-center transition-colors shadow-md" aria-label="LinkedIn" title="LinkedIn">
                  <FaLinkedin className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#25A8A0] rounded-full flex items-center justify-center transition-colors shadow-md" aria-label="Twitter" title="Twitter">
                  <FaXTwitter className="w-6 h-6 text-white" />
                </a>
              </div>

            </div>
          </div>
          <div className="text-center text-gray-400 mt-12 pt-8 border-t border-gray-700 text-xs md:text-sm">
            <p>&copy; 2025 SoulTalk. All rights reserved. Professional mental health support for everyone.</p>
            <p className="mt-2 text-[10px] opacity-20">Deployment Version: 1.0.5</p>
            <p className="mt-2">Licensed professionals available 24/7 for your mental wellness journey.</p>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default LandingPage;