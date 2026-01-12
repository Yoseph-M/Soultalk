import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, BookOpen, MessageCircle, Share2, Search } from 'lucide-react';
import Header from './Header';

const Blog: React.FC = () => {
  const featuredPost = {
    id: 1,
    title: 'Understanding Anxiety: A Comprehensive Guide to Managing Daily Stress',
    excerpt: 'Learn practical strategies and evidence-based techniques to manage anxiety and build resilience in your daily life. Our experts break down the science of stress and provide actionable steps for long-term mental wellness.',
    author: 'Dr. Sarah Johnson',
    date: 'Dec 28, 2024',
    readTime: '8 min read',
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260',
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: 'The Science Behind Mindfulness: How Meditation Changes Your Brain',
      excerpt: 'Discover the neurological benefits of mindfulness practice and how it can transform your mental well-being.',
      author: 'Dr. Michael Rodriguez',
      date: 'Dec 25, 2024',
      readTime: '6 min read',
      category: 'Mindfulness',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      title: 'Building Healthy Relationships: Communication Strategies That Work',
      excerpt: 'Essential communication skills for stronger, more fulfilling relationships with family, friends, and partners.',
      author: 'Dr. Emily Chen',
      date: 'Dec 22, 2024',
      readTime: '7 min read',
      category: 'Relationships',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      title: 'Overcoming Depression: Small Steps to Big Changes',
      excerpt: 'Practical daily habits and therapeutic approaches that can help you navigate through depression.',
      author: 'Dr. David Wilson',
      date: 'Dec 20, 2024',
      readTime: '9 min read',
      category: 'Depression',
      image: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 5,
      title: 'Digital Detox: Protecting Your Mental Health in the Digital Age',
      excerpt: 'How to create healthy boundaries with technology and social media for better mental wellness.',
      author: 'Lisa Thompson',
      date: 'Dec 18, 2024',
      readTime: '5 min read',
      category: 'Digital Wellness',
      image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 6,
      title: 'Sleep and Mental Health: The Connection You Need to Know',
      excerpt: 'Understanding how sleep quality affects your mental health and practical tips for better rest.',
      author: 'Dr. Robert Kim',
      date: 'Dec 15, 2024',
      readTime: '6 min read',
      category: 'Sleep Health',
      image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const categories = [
    'All Posts', 'Mental Health', 'Mindfulness', 'Relationships', 'Depression', 'Anxiety', 'Digital Wellness'
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('All Posts');

  const filteredPosts = selectedCategory === 'All Posts'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sohne">
      <Header />

      <div className="container mx-auto px-4 pt-32 pb-24">
        {/* Blog Header */}
        <div className="text-center mb-16 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            SoulTalk <span className="text-[#25A8A0]">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Expert advice, science-backed resources, and stories of healing from our global mental health community.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative group">
            <input
              type="text"
              placeholder="Search for articles, topics, therapists..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#25A8A0] focus:outline-none transition-all group-hover:shadow-md"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Featured Post Card */}
        <div className="mb-20">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row hover:shadow-3xl transition-shadow duration-500 border border-gray-50">
            <div className="lg:w-3/5 relative overflow-hidden group">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-4 py-1.5 bg-[#25A8A0] text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">Featured</span>
                <span className="px-4 py-1.5 bg-white text-[#25A8A0] text-xs font-black rounded-full uppercase tracking-widest shadow-lg">{featuredPost.category}</span>
              </div>
            </div>
            <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mb-6">
                <div className="flex items-center gap-2"><User className="w-4 h-4" /> {featuredPost.author}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {featuredPost.readTime}</div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight hover:text-[#25A8A0] cursor-pointer transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed line-clamp-4">
                {featuredPost.excerpt}
              </p>
              <button className="flex items-center gap-3 text-[#25A8A0] font-black group">
                READ ARTICLE <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all
                  ${selectedCategory === cat ? 'bg-gray-900 text-white shadow-xl scale-105' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}
                `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post) => (
            <article key={post.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-[#25A8A0] uppercase tracking-widest">{post.category}</span>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#25A8A0] transition-colors line-clamp-2 cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#25A8A0]/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#25A8A0]" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{post.author}</span>
                  </div>
                  <div className="flex gap-4">
                    <button className="text-gray-300 hover:text-[#25A8A0] transition-colors"><MessageCircle className="w-5 h-5" /></button>
                    <button className="text-gray-300 hover:text-[#25A8A0] transition-colors"><Share2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-24 bg-gray-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#25A8A0] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <BookOpen className="w-16 h-16 text-[#25A8A0] mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Never Miss an Insight</h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Join 10,000+ readers and get a weekly dose of mental wellness, directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white/10 transition-all outline-none"
              />
              <button className="px-10 py-5 bg-[#25A8A0] rounded-2xl font-black text-lg hover:bg-[#1e8a82] shadow-xl shadow-[#25A8A0]/20 transition-all">
                SUBSCRIBE
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-500">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;