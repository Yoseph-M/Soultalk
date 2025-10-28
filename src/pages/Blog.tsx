import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, User, ArrowRight, Clock, BookOpen, MessageCircle, Share2 } from 'lucide-react';
import Header from './Header';

const Blog: React.FC = () => {
  const featuredPost = {
    id: 1,
    title: 'Understanding Anxiety: A Comprehensive Guide to Managing Daily Stress',
    excerpt: 'Learn practical strategies and evidence-based techniques to manage anxiety and build resilience in your daily life.',
    author: 'Dr. Sarah Johnson',
    date: 'December 28, 2024',
    readTime: '8 min read',
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: 'The Science Behind Mindfulness: How Meditation Changes Your Brain',
      excerpt: 'Discover the neurological benefits of mindfulness practice and how it can transform your mental well-being.',
      author: 'Dr. Michael Rodriguez',
      date: 'December 25, 2024',
      readTime: '6 min read',
      category: 'Mindfulness',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      title: 'Building Healthy Relationships: Communication Strategies That Work',
      excerpt: 'Essential communication skills for stronger, more fulfilling relationships with family, friends, and partners.',
      author: 'Dr. Emily Chen',
      date: 'December 22, 2024',
      readTime: '7 min read',
      category: 'Relationships',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      title: 'Overcoming Depression: Small Steps to Big Changes',
      excerpt: 'Practical daily habits and therapeutic approaches that can help you navigate through depression.',
      author: 'Dr. David Wilson',
      date: 'December 20, 2024',
      readTime: '9 min read',
      category: 'Depression',
      image: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 5,
      title: 'Digital Detox: Protecting Your Mental Health in the Digital Age',
      excerpt: 'How to create healthy boundaries with technology and social media for better mental wellness.',
      author: 'Lisa Thompson',
      date: 'December 18, 2024',
      readTime: '5 min read',
      category: 'Digital Wellness',
      image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 6,
      title: 'Sleep and Mental Health: The Connection You Need to Know',
      excerpt: 'Understanding how sleep quality affects your mental health and practical tips for better rest.',
      author: 'Dr. Robert Kim',
      date: 'December 15, 2024',
      readTime: '6 min read',
      category: 'Sleep Health',
      image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 7,
      title: 'Workplace Stress: Strategies for Professional Mental Wellness',
      excerpt: 'Navigate workplace challenges and maintain your mental health in high-pressure environments.',
      author: 'Dr. Sarah Johnson',
      date: 'December 12, 2024',
      readTime: '8 min read',
      category: 'Workplace Wellness',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const categories = [
    'All Posts',
    'Mental Health',
    'Mindfulness',
    'Relationships',
    'Depression',
    'Anxiety',
    'Digital Wellness',
    'Sleep Health',
    'Workplace Wellness'
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('All Posts');

  const filteredPosts = selectedCategory === 'All Posts' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mental Health Insights & Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert advice, research-backed insights, and practical tips from our team of licensed mental health professionals
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-[#25A8A0] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <button className="bg-[#25A8A0] hover:bg-[#1e8a82] text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#25A8A0] text-white'
                    : 'bg-white border border-gray-300 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <button className="text-[#25A8A0] hover:text-[#1e8a82] font-medium text-sm flex items-center space-x-1">
                    <span>Read More</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-400 hover:text-[#25A8A0] transition-colors">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-[#25A8A0] transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-[#25A8A0] to-green-600 rounded-2xl p-8 text-center text-white">
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Mental Health Insights</h2>
          <p className="text-lg mb-6 opacity-90">
            Get the latest articles, tips, and resources delivered to your inbox weekly
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-[#25A8A0] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-4 opacity-80">
            Join 10,000+ readers. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;