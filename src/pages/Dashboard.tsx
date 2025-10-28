"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaHeart, FaBrain, FaUsers, FaCalendarAlt, FaVideo, FaUserMd, 
  FaSmile, FaFrown, FaMeh, FaGrinBeam, FaSadTear,
   FaPlay, FaExclamationTriangle, FaCheckCircle,
  FaClock, FaStar, FaRobot,
  FaChartLine,
  FaBell,
  FaHistory,
  FaEdit,
  FaCalendarCheck,
  FaTimes,
  FaPlus,
  FaUserFriends,
  FaCreditCard,
  FaQuestionCircle,
  FaEye,
  FaRedoAlt,
} from "react-icons/fa"
import { BiMessageSquareDetail } from "react-icons/bi"
import { MdTrendingUp, MdTrendingDown } from "react-icons/md"
import { HiOutlineEmojiHappy } from "react-icons/hi"
import DashboardHeader from "./DashboardHeader"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"

// Mood tracking component with slider
const MoodTracker: React.FC<{ onMoodSelect: (mood: number) => void; currentMood: number }> = ({
  onMoodSelect,
  currentMood,
}) => {
  const { theme } = useTheme()
  const moods = [
    { icon: FaSadTear, label: "Very Low", value: 1, color: "text-red-500", emoji: "😢" },
    { icon: FaFrown, label: "Low", value: 2, color: "text-orange-500", emoji: "😔" },
    { icon: FaMeh, label: "Neutral", value: 3, color: "text-yellow-500", emoji: "😐" },
    { icon: FaSmile, label: "Good", value: 4, color: "text-green-500", emoji: "😊" },
    { icon: FaGrinBeam, label: "Excellent", value: 5, color: "text-emerald-500", emoji: "😄" },
  ]

  const selectedMood = moods.find((m) => m.value === currentMood) || moods[2]

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-[90px] md:text-[120px] mb-2 leading-none">{selectedMood.emoji}</div>
        <h3 className="text-lg font-semibold mb-2">How are you feeling today?</h3>
        <p className={`text-sm ${selectedMood.color} font-medium`}>{selectedMood.label}</p>
      </div>

      <div className="px-4">
        <input
          type="range"
          min="1"
          max="5"
          value={currentMood}
          onChange={(e) => onMoodSelect(Number.parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #22c55e 75%, #10b981 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span className="text-2xl md:text-3xl">😢</span>
          <span className="text-2xl md:text-3xl">😔</span>
          <span className="text-2xl md:text-3xl">😐</span>
          <span className="text-2xl md:text-3xl">😊</span>
          <span className="text-2xl md:text-3xl">😄</span>
        </div>
      </div>
    </div>
  )
}

// Countdown timer component
const CountdownTimer: React.FC<{ targetTime: Date }> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = targetTime.getTime()
      const difference = target - now

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft("Now")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetTime])

  return <span className="text-sm font-medium text-teal-600 bg-teal-100 px-2 py-1 rounded-full">{timeLeft}</span>
}

// Mood chart component
const MoodChart: React.FC<{ moodData: Array<{ date: string; mood: number }> }> = ({ moodData }) => {
  const { theme } = useTheme()
  const maxMood = 5

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Last 7 Days</h4>
        <Link to="/mood-history" className="text-teal-600 text-sm hover:text-teal-700">
          View All
        </Link>
      </div>

      <div className="flex items-end justify-between h-32 space-x-2">
        {moodData.map((data, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div
              className="w-8 bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all duration-300"
              style={{ height: `${(data.mood / maxMood) * 100}%` }}
            ></div>
            <span className="text-xs text-gray-500">{data.date}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span>Neutral</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span>Good</span>
        </div>
      </div>
    </div>
  )
}

const Dashboard: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [currentMood, setCurrentMood] = useState(4)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock data - in real app, this would come from API
  const [moodData] = useState([
    { date: "Mon", mood: 3 },
    { date: "Tue", mood: 4 },
    { date: "Wed", mood: 2 },
    { date: "Thu", mood: 3 },
    { date: "Fri", mood: 4 },
    { date: "Sat", mood: 5 },
    { date: "Sun", mood: 4 },
  ])

  const [upcomingAppointments] = useState([
    {
      id: 1,
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      listenerName: "Dr. Sarah Johnson",
      listenerImage: "/placeholder.svg?height=40&width=40",
      type: "Video Session",
      specialty: "Anxiety & Depression",
      rating: 4.9,
    },
    {
      id: 2,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      listenerName: "Michael Chen",
      listenerImage: "/placeholder.svg?height=40&width=40",
      type: "Chat Session",
      specialty: "Stress Management",
      rating: 4.8,
    },
  ])

  const [sessionHistory] = useState([
    {
      id: 1,
      date: "2024-01-20",
      listenerName: "Dr. Emily Rodriguez",
      type: "Video Session",
      duration: "50 min",
      status: "completed",
      feedbackGiven: true,
      rating: 5,
      notes: "Great session on coping strategies",
    },
    {
      id: 2,
      date: "2024-01-18",
      listenerName: "James Wilson",
      type: "Chat Session",
      duration: "30 min",
      status: "completed",
      feedbackGiven: false,
      rating: 4,
      notes: "Discussed work-life balance",
    },
    {
      id: 3,
      date: "2024-01-15",
      listenerName: "Dr. Sarah Johnson",
      type: "Video Session",
      duration: "45 min",
      status: "completed",
      feedbackGiven: true,
      rating: 5,
      notes: "Breakthrough session on anxiety management",
    },
  ])

  const [notifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Session Reminder",
      message: "Your session with Dr. Sarah Johnson starts in 2 hours",
      time: "2 hours",
      unread: true,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Confirmed",
      message: "Your payment of $75 has been processed",
      time: "1 day",
      unread: false,
    },
    {
      id: 3,
      type: "forum",
      title: "New Forum Reply",
      message: "Someone replied to your post in Anxiety Support",
      time: "2 days",
      unread: true,
    },
    {
      id: 4,
      type: "listener",
      title: "Listener Available",
      message: "Dr. Sarah Johnson is now available for immediate chat",
      time: "3 hours",
      unread: true,
    },
  ])

  const [accountStats] = useState({
    totalSessions: 24,
    moodImprovement: 78,
    totalTimeSpent: "48 hours",
    satisfactionScore: 4.8,
  })

  const [aiRecommendations] = useState([
    {
      type: "professional",
      title: "Dr. Maria Santos",
      description: "Specializes in anxiety and depression. 95% match based on your profile.",
      rating: 4.9,
      availability: "Available now",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      type: "resource",
      title: "Breathing Exercises for Anxiety",
      description: "Based on your recent mood patterns, these exercises might help.",
      duration: "10 min",
      category: "Self-help",
    },
    {
      type: "forum",
      title: "Anxiety Support Group",
      description: "Active discussion: 'Managing work stress during busy periods'",
      members: 1247,
      activity: "12 new posts today",
    },
  ])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getMoodTrend = () => {
    const recent = moodData.slice(-3).map((d) => d.mood)
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length
    if (avg <= 2.5)
      return {
        trend: "concerning",
        icon: MdTrendingDown,
        color: "text-red-500",
        message: "You've been feeling low for 3 days. Want to talk now?",
      }
    if (avg >= 4)
      return {
        trend: "positive",
        icon: MdTrendingUp,
        color: "text-green-500",
        message: "Great job maintaining positive mood!",
      }
    return { trend: "stable", icon: FaHeart, color: "text-blue-500", message: "Your mood has been stable. Keep it up!" }
  }

  const moodTrend = getMoodTrend()

  const getAISuggestion = () => {
    if (currentMood <= 2)
      return "Based on your current mood, we recommend talking to Dr. Sarah Johnson who specializes in mood support."
    if (currentMood >= 4) return "You're feeling great! Consider sharing your positive energy in our community forums."
    return "Your mood seems neutral. A quick check-in with one of our AI assistants might help."
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
          : "bg-gradient-to-br from-teal-50 via-white to-blue-50"
      }`}
    >
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div
          className={`rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden transition-all duration-500 ${
            theme === "dark"
              ? "bg-gradient-to-r from-gray-800 to-slate-800 text-white"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 flex items-center space-x-3">
              <span>
                {getGreeting()}, {user?.name || "Zube"} 👋
              </span>
            </h1>

            {/* Current Mood Input */}
            <div className="grid md:grid-cols-1 gap-8 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <MoodTracker onMoodSelect={setCurrentMood} currentMood={currentMood} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/ai-chat" className="group">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-6 rounded-2xl text-white shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaRobot className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Start AI Chat Support</h3>
                    <p className="text-white/80">24/7 intelligent assistance</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Available now</span>
                  <FaPlay className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link to="/booking" className="group">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-6 rounded-2xl text-white shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaCalendarAlt className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Book a Session</h3>
                    <p className="text-white/80">Schedule with professionals</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Next available: 2pm</span>
                  <FaCalendarCheck className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link to="/find-listener" className="group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl text-white shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaUserMd className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Find a Listener</h3>
                    <p className="text-white/80">Connect with specialists</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">47 online now</span>
                  <FaUserFriends className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div
              className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                    <FaCalendarAlt className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Upcoming Appointments</h3>
                </div>
                <Link to="/appointments" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 hover:border-teal-400"
                        : "bg-teal-50 border-teal-200 hover:border-teal-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={appointment.listenerImage || "/placeholder.svg"}
                          alt={appointment.listenerName}
                          className="w-12 h-12 rounded-full border-2 border-teal-400"
                        />
                        <div>
                          <h4 className="font-semibold text-lg">{appointment.listenerName}</h4>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {appointment.specialty}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <FaStar className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-600">{appointment.rating}</span>
                          </div>
                        </div>
                      </div>
                      <CountdownTimer targetTime={appointment.date} />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <FaClock className="w-4 h-4 text-teal-500" />
                          <span>{appointment.date.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaVideo className="w-4 h-4 text-teal-500" />
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                        <FaVideo className="w-4 h-4" />
                        <span>Join</span>
                      </button>
                      <button
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-gray-600 hover:bg-gray-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        <FaRedoAlt className="w-4 h-4" />
                      </button>
                      <button
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-red-600 hover:bg-red-500 text-white"
                            : "bg-red-100 hover:bg-red-200 text-red-600"
                        }`}
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>



            {/* AI Suggestions / Recommendations */}
            <div
              className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <FaRobot className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold">AI Recommendations</h3>
              </div>

              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                      theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-purple-50 border-purple-200"
                    }`}
                  >
                    {rec.type === "professional" && (
                      <div className="flex items-center space-x-4">
                        <img
                          src={rec.image || "/placeholder.svg"}
                          alt={rec.title}
                          className="w-12 h-12 rounded-full border-2 border-purple-400"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{rec.title}</h4>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {rec.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <FaStar className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs">{rec.rating}</span>
                            </div>
                            <span className="text-xs text-green-600">{rec.availability}</span>
                          </div>
                        </div>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          Connect
                        </button>
                      </div>
                    )}

                    {rec.type === "resource" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FaBrain className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{rec.title}</h4>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                              {rec.description}
                            </p>
                            <span className="text-xs text-blue-600">
                              {rec.duration} • {rec.category}
                            </span>
                          </div>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          Start
                        </button>
                      </div>
                    )}

                    {rec.type === "forum" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <FaUsers className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{rec.title}</h4>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                              {rec.description}
                            </p>
                            <span className="text-xs text-green-600">
                              {rec.members} members • {rec.activity}
                            </span>
                          </div>
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          Join
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Mood Tracker */}
            <div
              className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                    <FaChartLine className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-bold">Mood Tracker</h3>
                </div>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                  <FaPlus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>

              <MoodChart moodData={moodData} />

              <div
                className={`mt-4 p-3 rounded-lg ${
                  moodTrend.trend === "concerning"
                    ? "bg-red-50 dark:bg-red-900/20"
                    : moodTrend.trend === "positive"
                      ? "bg-green-50 dark:bg-green-900/20"
                      : "bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <moodTrend.icon className={`w-4 h-4 ${moodTrend.color}`} />
                  <span className="text-sm font-medium">Mood Insight</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{moodTrend.message}</p>
                {moodTrend.trend === "concerning" && (
                  <button className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                    Talk Now
                  </button>
                )}
              </div>
            </div>



            {/* Account Snapshot / Stats */}
            <div
              className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <FaChartLine className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold">Your Progress</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BiMessageSquareDetail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Total Sessions</span>
                  </div>
                  <span className="font-bold text-blue-500">{accountStats.totalSessions}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HiOutlineEmojiHappy className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Mood Improvement</span>
                  </div>
                  <span className="font-bold text-green-500">{accountStats.moodImprovement}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaClock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Time Spent</span>
                  </div>
                  <span className="font-bold text-purple-500">{accountStats.totalTimeSpent}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Satisfaction</span>
                  </div>
                  <span className="font-bold text-yellow-500">{accountStats.satisfactionScore}/5</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-500">{accountStats.totalSessions}</div>
                    <div className="text-xs text-gray-500">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{accountStats.moodImprovement}%</div>
                    <div className="text-xs text-gray-500">Improvement</div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
