import React from 'react';
import { Star, MapPin, Clock, MessageCircle, Video, Calendar } from 'lucide-react';

const Professionals: React.FC = () => {
  const professionals = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Licensed Clinical Psychologist',
      rating: 4.9,
      location: 'California, USA',
      experience: '8+ years experience',
      specialties: ['Anxiety', 'Depression', 'PTSD'],
      description: 'Specializing in cognitive behavioral therapy and trauma-informed care. Passionate about helping clients build resilience.',
      avatar: 'SJ',
      color: 'bg-[#25A8A0]'
    },
    {
      id: 2,
      name: 'Dr. Michael Rodriguez',
      title: 'Licensed Marriage & Family Therapist',
      rating: 4.8,
      location: 'Texas, USA',
      experience: '12+ years experience',
      specialties: ['Relationships', 'Family Therapy', 'Communication'],
      description: 'Expert in couples counseling and family dynamics. Helps clients build stronger, healthier relationships.',
      avatar: 'MR',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      title: 'Licensed Clinical Social Worker',
      rating: 4.9,
      location: 'New York, USA',
      experience: '6+ years experience',
      specialties: ['Addiction', 'Grief', 'Life Transitions'],
      description: 'Compassionate approach to addiction recovery and grief counseling. Specializes in life transitions and coping strategies.',
      avatar: 'EC',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'Dr. David Wilson',
      title: 'Licensed Psychiatrist',
      rating: 4.7,
      location: 'Florida, USA',
      experience: '15+ years experience',
      specialties: ['Bipolar Disorder', 'Medication Management', 'Mood Disorders'],
      description: 'Board-certified psychiatrist specializing in mood disorders and medication management with a holistic approach.',
      avatar: 'DW',
      color: 'bg-green-500'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Licensed Professional Counselor',
      rating: 4.8,
      location: 'Colorado, USA',
      experience: '10+ years experience',
      specialties: ['Teen Counseling', 'Eating Disorders', 'Self-Esteem'],
      description: 'Specializes in adolescent therapy and eating disorder recovery. Creates a safe space for young adults to heal and grow.',
      avatar: 'LT',
      color: 'bg-pink-500'
    },
    {
      id: 6,
      name: 'Dr. Robert Kim',
      title: 'Licensed Psychologist',
      rating: 4.9,
      location: 'Washington, USA',
      experience: '9+ years experience',
      specialties: ['OCD', 'Phobias', 'Behavioral Therapy'],
      description: 'Expert in obsessive-compulsive disorder and anxiety-related conditions. Uses evidence-based behavioral interventions.',
      avatar: 'RK',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Meet Our Licensed Professionals
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with experienced, licensed therapists and certified mental health professionals 
          who are here to support your journey.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button className="bg-[#25A8A0] hover:bg-[#1e8a82] text-white px-6 py-2 rounded-lg transition-colors">
          All Professionals
        </button>
        <button className="border border-gray-300 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5 px-6 py-2 rounded-lg transition-colors">
          Therapists
        </button>
        <button className="border border-gray-300 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5 px-6 py-2 rounded-lg transition-colors">
          Counselors
        </button>
        <button className="border border-gray-300 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5 px-6 py-2 rounded-lg transition-colors">
          Psychiatrists
        </button>
        <button className="border border-gray-300 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5 px-6 py-2 rounded-lg transition-colors">
          Specialists
        </button>
      </div>

      {/* Professionals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {professionals.map((professional) => (
          <div key={professional.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white rounded-lg p-6">
            <div className="text-center mb-4">
              <div className={`w-24 h-24 ${professional.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl font-bold text-white">{professional.avatar}</span>
              </div>
              <h3 className="text-xl font-bold">{professional.name}</h3>
              <p className="text-gray-600">{professional.title}</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">({professional.rating})</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{professional.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{professional.experience}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {specialty}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">{professional.description}</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-[#25A8A0] hover:bg-[#1e8a82] text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </button>
                <button className="flex-1 border border-gray-300 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5 px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="bg-[#25A8A0] hover:bg-[#1e8a82] text-white px-8 py-3 rounded-lg transition-colors">
          Load More Professionals
        </button>
      </div>
    </div>
  );
};

export default Professionals;