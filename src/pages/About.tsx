import React from 'react';
import { Target, Lightbulb, Shield, Users, Zap } from 'lucide-react';
import Header from './Header';

const About: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: 'Radical Privacy',
      description: 'Your data is encrypted and your identity protected. We never compromise on confidentiality.'
    },
    {
      icon: Users,
      title: 'Compassionate Care',
      description: 'We believe empathy is the foundation of healing. Our network is built on human connection.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging AI and modern technology to make therapy more accessible and effective than ever.'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sohne">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-black tracking-widest text-[#25A8A0] uppercase bg-[#25A8A0]/10 rounded-full">
            Our Mission
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tighter">
            Healing the World, <br /><span className="text-[#25A8A0]">One Talk at a Time.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            SoulTalk was founded on a simple belief: mental health care is a human right, not a luxury.
            We're building the infrastructure for a more resilient world.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">Our Story: From a Small Idea to a Global Movement</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              In 2024, a group of psychologists and tech innovators came together with a single goal: to solve the accessibility crisis in mental health. We saw millions of people struggling in silence because therapy was either too expensive or too far away.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We built SoulTalk to bridge that gap. Today, were a team of over 50 professionals working around the clock to ensure that anyone, anywhere, can find the support they need.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <Target className="w-5 h-5 text-[#25A8A0]" />
                <span className="font-bold text-gray-900 text-sm">Targeted Solutions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-gray-900 text-sm">Innovative Tech</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Team collaboration"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-[#25A8A0]/10 rounded-full -z-0 blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-100 rounded-full -z-0 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-[#F8FAFB] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Values that Drive Us</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto italic">"Integrity is the compass that guides our every decision"</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <div key={i} className="group p-10 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 bg-[#25A8A0]/10 rounded-2xl flex items-center justify-center text-[#25A8A0] mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed font-normal">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;