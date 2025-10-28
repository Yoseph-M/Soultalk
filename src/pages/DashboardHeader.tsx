"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FaSearch,
  FaCalendarAlt,
  FaVideo,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaQuestionCircle,
  FaTimes,
  FaBell,
  FaComments,    
  FaChartLine,
  FaBookmark,
  FaHeart, FaShieldAlt,
  FaCrown,
  FaGlobe,
  FaMoon, FaSun, FaHistory, FaCreditCard
} from "react-icons/fa"
import { HiOutlineMenuAlt3 } from "react-icons/hi"
import { BiMessageSquareDetail } from "react-icons/bi"
import { MdDashboard } from "react-icons/md"
import Logo from "../assets/images/stlogo.svg"
import { useTheme } from "../contexts/ThemeContext"

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
]

const DashboardHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [language, setLanguage] = useState("en")
  const [search, setSearch] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const notifications = [
    {
      id: 1,
      title: "Session Reminder",
      message: "Your session with Dr. Smith starts in 15 minutes",
      time: "2 min ago",
      unread: true,
      type: "reminder",
      icon: FaCalendarAlt,
      color: "blue",
    },
    {
      id: 2,
      title: "New Message",
      message: "You have a new message from your therapist",
      time: "1 hour ago",
      unread: true,
      type: "message",
      icon: FaComments,
      color: "green",
    },
    {
      id: 3,
      title: "Wellness Check",
      message: "Time for your daily mood check-in",
      time: "3 hours ago",
      unread: false,
      type: "wellness",
      icon: FaHeart,
      color: "red",
    },
    {
      id: 4,
      title: "Progress Update",
      message: "Your weekly progress report is ready",
      time: "1 day ago",
      unread: false,
      type: "progress",
      icon: FaChartLine,
      color: "purple",
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  const quickActions = [
    { name: "Book Session", icon: FaCalendarAlt, href: "/booking", color: "blue" },
    { name: "Messages", icon: FaComments, href: "/messages", color: "green" },
    { name: "Progress", icon: FaChartLine, href: "/progress", color: "purple" },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl border-b ${
          theme === "dark"
            ? "bg-gray-900/95 border-gray-800 shadow-lg shadow-gray-900/20"
            : "bg-[#25A8A0] border-gray-200 shadow-lg shadow-gray-900/5"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center h-16 lg:h-20 w-full">
                        {/* Left Section - Logo & Navigation */}
            <div className="flex items-center gap-8 flex-1">
              <Link to="/dashboard" className="flex items-center">
                <img src={Logo || "/placeholder.svg"} alt="SoulTalk" className="h-16 md:h-12 w-auto rounded-full" />
              </Link>
              <nav className="hidden lg:flex">
                <div className="flex items-center gap-8">
                <Link
                  to="/schedule"
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    theme === "dark"
                        ? "text-[#25A8A0]"
                        : "text-white"
                  }`}
                >
                  <span className="font-medium">Schedule</span>
                </Link>

                <Link
                    to="/booking"
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    theme === "dark"
                        ? "text-[#25A8A0]"
                        : "text-white"
                  }`}
                >
                    <span className="font-medium">Book a Session</span>
                </Link>
                </div>
              </nav>
            </div>

            {/* Enhanced Right Section - Actions */}
            <div className="flex items-center gap-8">
              {/* Search bar */}
              <div className="w-[500px] max-w-xl hidden md:block">
                <div className={`relative transition-all duration-300 ${searchFocused ? "scale-105" : ""}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 z-10">
                    <FaSearch className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-[#25A8A0]'}`} />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search sessions, therapists, resources..."
                    className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 transition-all duration-300 ${
                      searchFocused
                        ? theme === "dark"
                          ? "border-[#25A8A0] ring-4 ring-[#25A8A0]/10 shadow-lg border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 hover:border-gray-600"
                          : "border-[#25A8A0] ring-4 ring-[#25A8A0]/10 shadow-lg"
                        : theme === "dark"
                          ? "border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 hover:border-gray-600"
                          : "border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                    } focus:outline-none ${theme === 'dark' ? 'backdrop-blur-sm' : ''}`}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${
                        theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  )}
                  {/* Enhanced Search Suggestions */}
                  {search && (
                    <div
                      className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border backdrop-blur-xl z-50 ${
                        theme === "dark" ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"
                      }`}
                    >
                      <div className="p-4">
                        <div className="space-y-2">
                          <div
                            className={`p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors group ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                                <FaUser className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-medium">Dr. Sarah Johnson</span>
                                <p className="text-xs text-gray-500">Anxiety Specialist</p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors group ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-green-500/20 text-green-500 group-hover:scale-110 transition-transform">
                                <FaBookmark className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-medium">Mindfulness Resources</span>
                                <p className="text-xs text-gray-500">Meditation guides and exercises</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Find a Listener */}
              <div className="relative">
                <button
                  className={`relative px-4 py-2 rounded-xl transition-all duration-200 ${
                    theme === "dark"
                      ? "text-[#25A8A0]"
                      : "text-white"
                  }`}
                  title="Find a Listener"
                >
                  <span className="font-medium">Find a Listener</span>
                </button>
              </div>

              {/* Enhanced Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-3 rounded-xl transition-all duration-200 ${
                    theme === "dark" ? "text-[#25A8A0]" : "text-white" 
                  }`}
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-96 rounded-2xl shadow-xl border backdrop-blur-xl z-50 ${
                      theme === "dark" ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Notifications
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gradient-to-r from-[#25A8A0] to-[#1e8a82] text-white px-2 py-1 rounded-full">
                            {unreadCount} new
                          </span>
                          <button
                            className={`text-xs ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"} transition-colors`}
                          >
                            Mark all read
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                              notification.unread
                                ? theme === "dark"
                                  ? "bg-gradient-to-r from-[#25A8A0]/10 to-[#1e8a82]/10 border border-[#25A8A0]/20 hover:border-[#25A8A0]/30"
                                  : "bg-gradient-to-r from-[#25A8A0]/5 to-[#1e8a82]/5 border border-[#25A8A0]/20 hover:border-[#25A8A0]/30"
                                : theme === "dark"
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  notification.color === "blue"
                                    ? "bg-blue-500/20 text-blue-500"
                                    : notification.color === "green"
                                      ? "bg-green-500/20 text-green-500"
                                      : notification.color === "red"
                                        ? "bg-red-500/20 text-red-500"
                                        : "bg-purple-500/20 text-purple-500"
                                }`}
                              >
                                <notification.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4
                                    className={`font-medium text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                                  >
                                    {notification.title}
                                  </h4>
                                  {notification.unread && <div className="w-2 h-2 bg-[#25A8A0] rounded-full"></div>}
                                </div>
                                <p
                                  className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"} line-clamp-2`}
                                >
                                  {notification.message}
                                </p>
                                <span
                                  className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                                >
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={`mt-4 pt-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <Link
                          to="/notifications"
                          className="block text-center text-sm text-[#25A8A0] hover:text-[#1e8a82] font-medium transition-colors"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Profile Menu */}
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer select-none ${theme === 'dark' ? 'bg-[#25A8A0]' : 'bg-white'}`}
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#25A8A0' }}
                  title="Profile"
                >
                  J
                </div>

                {profileOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-xl border backdrop-blur-xl z-50 ${
                      theme === "dark" ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-[#25A8A0] rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                          <span className="text-3xl font-bold text-white select-none">J</span>
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>John Daniel</p>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            johndaniel@email.com
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Link
                          to="/profile"
                          className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                            theme === "dark"
                              ? "text-gray-300 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/80 hover:to-gray-600/80"
                              : "text-gray-700 hover:text-gray-900 bg-gradient-to-r from-gray-50/50 to-gray-100/50 hover:from-gray-100/80 hover:to-gray-200/80"
                          } hover:shadow-lg hover:shadow-black/10 border border-transparent hover:border-gray-300/20`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            theme === "dark" ? "bg-[#25A8A0]/20 text-[#25A8A0]" : "bg-[#25A8A0]/10 text-[#25A8A0]"
                          }`}>
                            <FaUser className="w-4 h-4" />
                          </div>
                          <span className="font-medium">My Profile</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                          to="/settings"
                          className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                            theme === "dark"
                              ? "text-gray-300 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/80 hover:to-gray-600/80"
                              : "text-gray-700 hover:text-gray-900 bg-gradient-to-r from-gray-50/50 to-gray-100/50 hover:from-gray-100/80 hover:to-gray-200/80"
                          } hover:shadow-lg hover:shadow-black/10 border border-transparent hover:border-gray-300/20`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            theme === "dark" ? "bg-blue-500/20 text-blue-400" : "bg-blue-500/10 text-blue-600"
                          }`}>
                            <FaCog className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Settings</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                          to="/billing"
                          className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                            theme === "dark"
                              ? "text-gray-300 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/80 hover:to-gray-600/80"
                              : "text-gray-700 hover:text-gray-900 bg-gradient-to-r from-gray-50/50 to-gray-100/50 hover:from-gray-100/80 hover:to-gray-200/80"
                          } hover:shadow-lg hover:shadow-black/10 border border-transparent hover:border-gray-300/20`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            theme === "dark" ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-500/10 text-yellow-600"
                          }`}>
                            <FaCrown className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Billing & Plans</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                          to="/privacy"
                          className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                            theme === "dark"
                              ? "text-gray-300 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/80 hover:to-gray-600/80"
                              : "text-gray-700 hover:text-gray-900 bg-gradient-to-r from-gray-50/50 to-gray-100/50 hover:from-gray-100/80 hover:to-gray-200/80"
                          } hover:shadow-lg hover:shadow-black/10 border border-transparent hover:border-gray-300/20`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            theme === "dark" ? "bg-green-500/20 text-green-400" : "bg-green-500/10 text-green-600"
                          }`}>
                            <FaShieldAlt className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Privacy & Security</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                          to="/help"
                          className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                            theme === "dark"
                              ? "text-gray-300 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/80 hover:to-gray-600/80"
                              : "text-gray-700 hover:text-gray-900 bg-gradient-to-r from-gray-50/50 to-gray-100/50 hover:from-gray-100/80 hover:to-gray-200/80"
                          } hover:shadow-lg hover:shadow-black/10 border border-transparent hover:border-gray-300/20`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            theme === "dark" ? "bg-purple-500/20 text-purple-400" : "bg-purple-500/10 text-purple-600"
                          }`}>
                            <FaQuestionCircle className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Help & Support</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                          to="/session-history"
                          className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                            theme === "dark"
                              ? "text-gray-300 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/80 hover:to-gray-600/80"
                              : "text-gray-700 hover:text-gray-900 bg-gradient-to-r from-gray-50/50 to-gray-100/50 hover:from-gray-100/80 hover:to-gray-200/80"
                          } hover:shadow-lg hover:shadow-black/10 border border-transparent hover:border-gray-300/20`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            theme === "dark" ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-500/10 text-indigo-600"
                          }`}>
                            <FaHistory className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Session History</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                        
                        <Link
                          to="/payment-history"
                          className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                            theme === "dark"
                              ? "text-gray-300 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/80 hover:to-gray-600/80"
                              : "text-gray-700 hover:text-gray-900 bg-gradient-to-r from-gray-50/50 to-gray-100/50 hover:from-gray-100/80 hover:to-gray-200/80"
                          } hover:shadow-lg hover:shadow-black/10 border border-transparent hover:border-gray-300/20`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            theme === "dark" ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-500/10 text-emerald-600"
                          }`}>
                            <FaCreditCard className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Payment History</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        {/* Language Selector in Profile Dropdown */}
                        <div className="relative" ref={languageRef}>
                          <button
                            onClick={() => setLanguageOpen(!languageOpen)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                              theme === "dark"
                                ? "text-[#25A8A0]"
                                : "text-black"
                            }`}
                          >
                            <FaGlobe className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-black"}`} />
                            <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Select Language</span>
                          </button>

                          {languageOpen && (
                            <div
                              className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border backdrop-blur-xl z-50 ${
                                theme === "dark" ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"
                              }`}
                            >
                              <div className="p-2">
                                {languages.map((lang) => (
                                  <button
                                    key={lang.code}
                                    onClick={() => {
                                      setLanguage(lang.code)
                                      setLanguageOpen(false)
                                    }}
                                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                      language === lang.code
                                        ? "bg-gradient-to-r from-[#25A8A0] to-[#1e8a82] text-white shadow-lg"
                                        : theme === "dark"
                                          ? "text-[#25A8A0]"
                                          : "text-black"
                                    }`}
                                  >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="font-medium">{lang.label}</span>
                                    {language === lang.code && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Theme Toggle as Text Switch */}
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group">
                          <span className={`font-medium flex items-center gap-2 ${
                             theme === "dark" ? "text-white" : "text-black"
                          }`}>
                            {theme === "dark" ? (
                              <FaMoon className="w-4 h-4 text-white" />
                            ) : (
                              <FaSun className="w-4 h-4 text-black" />
                            )}
                            Theme
                          </span>
                          <div className="flex items-center border rounded-full overflow-hidden">
                            <button
                              onClick={() => theme !== 'light' && toggleTheme()}
                              className={`px-3 py-1 focus:outline-none transition-colors duration-200 ${
                                theme === 'light' ? 'bg-[#25A8A0] text-white' : 'bg-transparent text-gray-500'
                              }`}
                            >
                              Light
                            </button>
                            <button
                              onClick={() => theme !== 'dark' && toggleTheme()}
                              className={`px-3 py-1 focus:outline-none transition-colors duration-200 ${
                                theme === 'dark' ? 'bg-[#25A8A0] text-white' : 'bg-transparent text-gray-500'
                              }`}
                            >
                              Dark
                            </button>
                          </div>
                        </div>

                        <hr className={`my-2 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`} />

                        <button
                          onClick={() => navigate('/')}
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                            theme === "dark"
                              ? "text-red-400"
                              : "text-red-600"
                          }`}
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-3 rounded-xl transition-all duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <HiOutlineMenuAlt3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div
            className={`fixed top-0 right-0 h-full w-80 shadow-xl transform transition-transform duration-300 ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2 rounded-xl ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MdDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/sessions"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaVideo className="w-5 h-5" />
                  <span>Sessions</span>
                </Link>

                <Link
                  to="/booking"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCalendarAlt className="w-5 h-5" />
                  <span>Book a Session</span>
                </Link>

                <Link
                  to="/messages"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BiMessageSquareDetail className="w-5 h-5" />
                  <span>Messages</span>
                </Link>
              </nav>

              {/* Mobile Search */}
              <div className="mt-8">
                <div className="relative">
                  <FaSearch
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-800 text-white placeholder-gray-400"
                        : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:border-[#25A8A0]`}
                  />
                </div>
              </div>

              {/* Mobile Quick Actions */}
              <div className="mt-8">
                <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4`}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => action.name !== "Resources" && (
                    <Link
                      key={action.name}
                      to={action.href}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                          : "bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <action.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{action.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardHeader
