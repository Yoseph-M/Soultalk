import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, DollarSign, Clock, Users, Heart, Shield, Award, 
  Headphones, TrendingUp, GraduationCap 
} from 'lucide-react';

const JoinAsListener: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Earnings',
      description: 'Earn $50-150 per session based on your experience and specialization. Set your own rates.',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Work when you want, where you want. Set your availability and manage your own calendar.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Meaningful Connections',
      description: 'Build lasting relationships with seekers and witness their growth and healing journey.',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'HIPAA-compliant platform with end-to-end encryption ensures privacy and security.',
      color: 'text-indigo-600'
    },
    {
      icon: TrendingUp,
      title: 'Professional Growth',
      description: 'Access to continuing education, peer support, and professional development resources.',
      color: 'text-emerald-600'
    },
    {
      icon: Award,
      title: 'Recognition & Support',
      description: 'Join a community of respected professionals with ongoing support and recognition.',
      color: 'text-amber-600'
    }
  ];

  const professionalRequirements = [
    'Licensed mental health professional (LCSW, LPC, LMFT, etc.)',
    'Minimum 2 years of clinical experience',
    'Current malpractice insurance',
    'Clean background check',
    'Continuing education compliance'
  ];

  const technicalRequirements = [
    'Reliable internet connection',
    'Computer or tablet with camera/microphone',
    'Quiet, private space for sessions',
    'Availability for at least 10 hours per week',
    'Commitment to platform training'
  ];

  const applicationSteps = [
    {
      step: 1,
      title: 'Apply Online',
      description: 'Submit your application with credentials and experience'
    },
    {
      step: 2,
      title: 'Verification',
      description: 'We verify your credentials and conduct background checks'
    },
    {
      step: 3,
      title: 'Interview',
      description: 'Video interview to assess fit and discuss expectations'
    },
    {
      step: 4,
      title: 'Onboarding',
      description: 'Complete training and set up your profile to start helping'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-[#25A8A0] to-[#1e8a82] backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Heart className="h-12 w-12 text-white" />
            <span className="text-2xl font-bold text-white">SoulTalk</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white/90 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link to="/professionals" className="text-white/90 hover:text-white transition-colors font-medium">
              Find Listeners
            </Link>
            <Link to="/pricing" className="text-white/90 hover:text-white transition-colors font-medium">
              Pricing
            </Link>
            <Link to="/join-as-listener" className="text-white font-semibold">
              Become a Listener
            </Link>
            <Link to="/auth">
              <button className="bg-white text-[#25A8A0] hover:bg-gray-100 font-semibold px-6 py-2 rounded-lg shadow-sm">
                Apply Now
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#25A8A0]/20 to-green-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-[#25A8A0]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="mb-6 inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-4 py-2 text-sm font-medium border-0 shadow-md rounded-full">
            <Headphones className="w-4 h-4 mr-2" />
            Professional Mental Health Listeners
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Make a Difference as a
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25A8A0] to-green-600">
              Professional Listener
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Join our community of licensed mental health professionals and certified listeners. Help seekers on their 
            wellness journey while building a flexible, rewarding career.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/auth">
              <button className="bg-gradient-to-r from-[#25A8A0] to-green-600 hover:from-[#1e8a82] hover:to-green-700 text-white text-lg px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Heart className="w-5 h-5 mr-2 inline" />
                Apply to Join
              </button>
            </Link>
            <a href="#requirements">
              <button className="text-lg px-10 py-4 rounded-xl border-2 border-gray-300 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5 transition-all duration-300 transform hover:scale-105 bg-transparent">
                <CheckCircle className="w-5 h-5 mr-2 inline" />
                View Requirements
              </button>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-medium">Competitive Earnings</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Flexible Schedule</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Meaningful Impact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join SoulTalk as a Listener?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Build a rewarding career while making a real difference in people's lives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white rounded-lg p-6">
                <benefit.icon className={`h-12 w-12 ${benefit.color} mb-4`} />
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section id="requirements" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Requirements to Join</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We maintain high standards to ensure quality support for our seekers
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border-0 shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Professional Requirements</h3>
                <ul className="space-y-3">
                  {professionalRequirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border-0 shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Technical Requirements</h3>
                <ul className="space-y-3">
                  {technicalRequirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Application Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to join our community of professional listeners
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {applicationSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#25A8A0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#25A8A0] to-green-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of professional listeners who are already making an impact on SoulTalk
          </p>
          <Link to="/auth">
            <button className="bg-white text-[#25A8A0] hover:bg-gray-100 text-lg px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Headphones className="w-5 h-5 mr-2 inline" />
              Apply Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default JoinAsListener;