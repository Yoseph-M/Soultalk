"use client"
import { API_BASE_URL } from "../config";

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FaRobot,
  FaCalendarAlt,
  FaStar,
  FaPhoneAlt,
  FaExclamationTriangle,
  FaWallet,
  FaQuoteLeft,
  FaVideo,
  FaCalendarPlus,
  FaClock,
  FaComments,
  FaFileMedical,
  FaChevronRight
} from "react-icons/fa"
import DashboardHeader from "./DashboardHeader"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import AICompanion from "../components/AICompanion"

const DailyQuote: React.FC = () => {
  const fallbackQuotes = [
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
    { text: "The greatest discovery of my generation is that a human being can alter his life by altering his attitudes.", author: "William James" },
    { text: "Healing takes time, and asking for help is a courageous step.", author: "Unknown" },
    { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
    { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" }
  ]

  const [quote, setQuote] = useState(() => {
    const cached = localStorage.getItem('daily_quote');
    const lastFetch = localStorage.getItem('daily_quote_timestamp');
    const now = Date.now();
    const sixHours = 6 * 60 * 60 * 1000;

    if (cached && lastFetch && (now - Number(lastFetch) < sixHours)) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" };
      }
    }
    return { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" };
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchQuote = async () => {
      const lastFetch = localStorage.getItem('daily_quote_timestamp');
      const now = Date.now();
      const sixHours = 6 * 60 * 60 * 1000;

      // Only fetch if cache is missing or expired
      if (lastFetch && (now - Number(lastFetch) < sixHours)) {
        return;
      }

      setLoading(true)
      try {
        const response = await fetch('https://api.quotable.io/random?tags=motivational,inspirational,mental-health')
        if (response.ok) {
          const data = await response.json()
          const newQuote = { text: data.content, author: data.author };
          setQuote(newQuote)
          localStorage.setItem('daily_quote', JSON.stringify(newQuote));
          localStorage.setItem('daily_quote_timestamp', now.toString());
        } else {
          const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
          setQuote(random)
          localStorage.setItem('daily_quote', JSON.stringify(random));
          localStorage.setItem('daily_quote_timestamp', now.toString());
        }
      } catch (error) {
        const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
        setQuote(random)
        localStorage.setItem('daily_quote', JSON.stringify(random));
        localStorage.setItem('daily_quote_timestamp', now.toString());
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
  }, [])

  return (
    <div className="flex flex-col items-center text-center px-6 py-4 relative overflow-hidden group">
      <div className="mb-4 text-white/30 group-hover:text-white/50 transition-colors">
        <FaQuoteLeft className="w-8 h-8" />
      </div>
      {loading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-1000">
          <p className="text-xl md:text-3xl font-light italic mb-4 leading-tight max-w-2xl">
            "{quote.text}"
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-6 bg-white/20"></div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50">
              {quote.author}
            </p>
            <div className="h-px w-6 bg-white/20"></div>
          </div>
        </div>
      )}
    </div>
  )
}

const CountdownTimer: React.FC<{ targetTime: Date }> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = targetTime.getTime()
      const difference = target - now

      if (difference > -600000) { // Available 10 min before (negative difference means future, but we want button to show up)
        // Actually, difference = target - now.
        // If target is 10:00, now is 9:50 -> diff = 10 min (600000ms).
        // If target is 10:00, now is 10:10 -> diff = -10 min.
        // The Timer is strictly for display "XXh YYm".
        // The BUTTON logic is handled separately below.

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h ${minutes}m`)
          } else {
            setTimeLeft(`${hours}h ${minutes}m`)
          }
        } else {
          setTimeLeft("Now")
        }
      } else {
        setTimeLeft("Past")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetTime])

  return <span className="text-xs font-black text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-xl border border-teal-100 dark:border-teal-800">{timeLeft}</span>
}

const MoodChart: React.FC<{ moodData: Array<{ date: string; mood: number }> }> = ({ moodData }) => {
  const maxMood = 5

  const getBarColor = (mood: number) => {
    if (mood === 1) return "bg-red-500 shadow-red-500/50"
    if (mood === 2) return "bg-orange-500 shadow-orange-500/50"
    if (mood === 3) return "bg-yellow-400 shadow-yellow-400/50"
    if (mood === 4) return "bg-green-500 shadow-green-500/50"
    return "bg-emerald-400 shadow-emerald-400/50"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-xl">Wellness Journey</h4>
        <Link to="/mood-history" className="text-teal-600 text-sm font-bold hover:underline transition-all group flex items-center gap-1">
          <span>Explore Patterns</span>
          <FaChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="relative h-56 w-full">
        <div className="flex items-end justify-between h-full w-full relative z-10">
          {moodData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-12 z-20 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                {data.mood}/5
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 border-4 border-transparent border-t-gray-900"></div>
              </div>

              <div className="w-full h-full flex items-end justify-center pb-8">
                <div
                  className={`w-3 md:w-4 rounded-full transition-all duration-500 ease-out group-hover:scale-110 origin-bottom shadow-lg ${getBarColor(data.mood)}`}
                  style={{ height: `${(data.mood / maxMood) * 100}%` }}
                ></div>
              </div>

              <div className="absolute bottom-0 text-xs font-bold text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {data.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const WalletWidget: React.FC = () => {
  const { theme } = useTheme()
  return (
    <div className={`rounded-3xl p-8 transition-all duration-300 border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}>
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl">
          <FaWallet className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h3 className="text-xl font-black">Account</h3>
          <p className="text-xs opacity-50">Current Plan & Subscription</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className={`p-6 rounded-2xl border-2 ${theme === "dark" ? "bg-teal-900/10 border-teal-800" : "bg-teal-50 border-teal-100"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-teal-600">Active Plan</p>
            <span className="px-2 py-0.5 bg-teal-500 text-white text-[8px] font-black rounded-full shadow-lg shadow-teal-500/20">LIVE</span>
          </div>
          <p className="text-xl font-black text-teal-600">Premium Explorer</p>
        </div>
        <Link to="/billing" className="block w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-center rounded-2xl font-black text-sm transition-all hover:shadow-lg hover:shadow-teal-500/20 active:scale-95">
          Manage Plan
        </Link>
      </div>
    </div>
  )
}

const CrisisCorner: React.FC = () => {
  const { theme } = useTheme()
  return (
    <div className={`rounded-3xl p-8 transition-all duration-300 border ${theme === "dark" ? "bg-red-900/10 border-red-950 text-white" : "bg-red-50/50 border-red-100"}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-2xl">
          <FaExclamationTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-black text-red-600">Crisis Help</h3>
      </div>
      <p className={`text-xs mb-6 leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        Need immediate support? Help is available 24/7.
      </p>
      <Link to="/crisis-support" className="uppercase tracking-[0.2em] block w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-red-500/10">
        <FaPhoneAlt className="w-3 h-3" />
        <span className="text-xs">Emergency Support</span>
      </Link>
    </div>
  )
}

const Dashboard: React.FC = () => {
  const { theme } = useTheme()
  const { user, fetchWithAuth, isLoading } = useAuth()

  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [listeners, setListeners] = useState<any[]>([])
  const [loadingListeners, setLoadingListeners] = useState(true)
  const [moodData, setMoodData] = useState<any[]>([])
  const [loadingMood, setLoadingMood] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth')
      return
    }
    if (user && (user.type === 'professional' || user.type === 'listener')) {
      navigate('/professionals')
    }
  }, [user, navigate, isLoading])



  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetchWithAuth(API_BASE_URL + '/api/auth/appointments/')
        if (response.ok) {
          const data = await response.json()
          // Filter for upcoming/pending and sort by date
          const upcoming = data.filter((app: any) => app.status === 'upcoming' || app.status === 'pending')
          upcoming.sort((a: any, b: any) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
          setUpcomingAppointments(upcoming)
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoadingAppointments(false)
      }
    }

    const fetchProfessionals = async () => {
      try {
        const response = await fetchWithAuth(API_BASE_URL + '/api/auth/professionals/')
        if (response.ok) {
          const data = await response.json()
          const formatted = data.map((user: any) => ({
            id: user.id,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
            role: 'Mental Wellness Expert',
            rating: user.rating || 5.0,
            image: user.profile_photo
              ? (user.profile_photo.startsWith('http') ? user.profile_photo : `${API_BASE_URL}${user.profile_photo}`)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`,
            tags: user.specialization ? [user.specialization] : ["Wellness Support"]
          }))
          setListeners(formatted)
        }
      } catch (error) {
        console.error("Error fetching professionals:", error)
      } finally {
        setLoadingListeners(false)
      }
    }

    const fetchMoodData = async () => {
      try {
        const response = await fetchWithAuth(API_BASE_URL + '/api/auth/mood-updates/')
        if (response.ok) {
          const data = await response.json()
          // Format for the last 7 days
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (6 - i))
            const dayName = days[d.getDay()]
            const record = data.find((r: any) => new Date(r.created_at).toDateString() === d.toDateString())
            return { date: dayName, mood: record ? record.mood_score : 0 }
          })
          setMoodData(last7Days)
        }
      } catch (error) {
        console.error("Error fetching mood data:", error)
      } finally {
        setLoadingMood(false)
      }
    }

    if (!isLoading && user && !hasFetched) {
      fetchAppointments()
      fetchProfessionals()
      fetchMoodData()
      setHasFetched(true)
    }
  }, [fetchWithAuth, user, isLoading, hasFetched])







  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section with Daily Quote */}
        <div className={`rounded-3xl p-8 mb-8 relative overflow-hidden transition-all duration-500 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-teal-600 text-white shadow-2xl shadow-teal-900/20"}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <DailyQuote />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>

        {/* Quick Action Grid - Unified Color */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { to: "/ai-chat", icon: FaRobot, title: "AI Companion", desc: "Supportive AI" },
            { to: "/diagnosis", icon: FaFileMedical, title: "Diagnosis", desc: "Assessments" },
            { to: "/schedule", icon: FaCalendarAlt, title: "Timeline", desc: "Manage sessions" },
            { to: "/booking", icon: FaCalendarPlus, title: "Book Session", desc: "Find professional" },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className={`group p-5 rounded-[2rem] border transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-teal-500' : 'bg-white border-gray-100 hover:border-teal-400'}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 mb-3 rounded-2xl transition-transform group-hover:scale-110 duration-500 bg-teal-50 dark:bg-teal-900/20`}>
                  <item.icon className={`w-6 h-6 text-teal-600`} />
                </div>
                <h3 className="text-sm font-black mb-0.5">{item.title}</h3>
                <p className={`text-[10px] opacity-50`}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Instant Support Banner - Simplified */}
        <div className={`relative p-8 rounded-[2.5rem] border mb-8 overflow-hidden transition-all ${theme === 'dark' ? 'bg-gray-800 shadow-2xl border-teal-900/50' : 'bg-teal-600 text-white shadow-xl shadow-teal-900/10'}`}>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-teal-900/30' : 'bg-white/20'}`}>
                  <FaVideo className={`w-8 h-8 ${theme === 'dark' ? 'text-teal-400' : 'text-white'}`} />
                </div>
              </div>
              <div>
                <h3 className={`text-2xl font-black`}>Get support right now</h3>
                <p className={`text-lg opacity-80`}>Verified listeners are online and ready to help.</p>
              </div>
            </div>
            <Link to="/instant-support" className={`px-10 py-5 font-black rounded-[2rem] shadow-xl transition-all hover:scale-105 active:scale-95 text-lg ${theme === 'dark' ? 'bg-teal-600 text-white shadow-teal-900/40' : 'bg-white text-teal-600'}`}>
              Connect Now
            </Link>
          </div>
        </div>



        {/* Discovery Section - Compact */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black">Top Support Specialists</h3>
            <Link to="/find-listener" className="text-teal-600 text-xs font-black uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {loadingListeners ? (
              <div className="flex items-center justify-center w-full py-10"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : listeners.map((listener) => (
              <div key={listener.id} className={`flex-shrink-0 w-64 p-5 rounded-[2rem] border transition-all duration-300 group ${theme === "dark" ? "bg-gray-800 border-gray-700 hover:border-teal-500" : "bg-white border-gray-100 hover:border-teal-400 shadow-sm"}`}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={listener.image} alt={listener.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/20" />
                  <div>
                    <h4 className="font-black text-sm">{listener.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] font-black text-yellow-600">
                      <FaStar className="w-2.5 h-2.5" /> <span>{listener.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <p className={`text-[11px] opacity-60 line-clamp-2 mb-4 h-8`}>{listener.role}</p>
                <Link to={`/booking`} className="block text-center w-full py-2.5 rounded-xl bg-teal-600/10 hover:bg-teal-600 text-teal-600 hover:text-white font-black text-xs transition-all">
                  Book Session
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className={`rounded-[2rem] p-8 transition-all duration-300 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <FaCalendarAlt className="text-teal-600" /> Upcoming Sessions
                </h3>
                <Link to="/schedule" className="text-teal-600 text-xs font-black uppercase tracking-widest hover:underline">Schedule</Link>
              </div>
              <div className="space-y-4">
                {loadingAppointments ? (
                  <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed rounded-2xl border-gray-100 dark:border-gray-700 text-gray-400">
                    <p className="text-sm font-bold">No sessions scheduled.</p>
                  </div>
                ) : (
                  upcomingAppointments.map((app) => (
                    <div key={app.id} className={`p-4 rounded-2xl border transition-all duration-300 ${theme === "dark" ? "bg-gray-700/20 border-gray-700 hover:border-teal-500/50" : "bg-gray-50/50 border-gray-100 hover:border-teal-400/30"}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={app.professional_image ? (app.professional_image.startsWith('http') ? app.professional_image : `${API_BASE_URL}${app.professional_image}`) : `https://ui-avatars.com/api/?name=${app.professional_name}&background=random`}
                            className="w-12 h-12 rounded-xl object-cover"
                            alt=""
                          />
                          <div>
                            <h4 className="font-black text-sm">{app.professional_name}</h4>
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {app.time.substring(0, 5)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <CountdownTimer targetTime={new Date(`${app.date}T${app.time}`)} />
                          <button
                            disabled={new Date(`${app.date}T${app.time}`).getTime() - new Date().getTime() > 600000}
                            onClick={() => navigate(`/live/${app.id}`)}
                            className="disabled:opacity-20 px-4 py-2 bg-teal-600 text-white text-[10px] font-black rounded-lg transition-all active:scale-95"
                          >
                            Enter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`rounded-[2rem] p-6 border transition-all duration-300 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"}`}>
              {loadingMood ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <MoodChart moodData={moodData} />
              )}
            </div>
            <CrisisCorner />
          </div>
        </div>
      </div>
      <AICompanion />
    </div >
  )
}

export default Dashboard