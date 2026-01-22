"use client"
import { API_BASE_URL } from "../config";

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  FaSearch,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaTimes,
  FaBell,
  FaComments,
  FaChartLine,
  FaCrown,
  FaHistory, FaChevronRight, FaCheckDouble
} from "react-icons/fa"

import { MdDashboard } from "react-icons/md"
import STLogoLight from "../assets/images/ST_logo.svg"
import STLogoDark from "../assets/images/stlogo.svg"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { useSearch } from "../contexts/SearchContext"

const NotificationItem = ({ notification, theme, onClick }: { notification: any, theme: string, onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`group relative p-3 rounded-xl transition-all duration-200 cursor-pointer border mb-2 last:mb-0 mx-2 ${!notification.is_read
      ? theme === "dark"
        ? "bg-gray-800/50 border-gray-700"
        : "bg-gray-50 border-gray-200"
      : theme === "dark"
        ? "bg-transparent border-transparent hover:bg-gray-800/30"
        : "bg-transparent border-transparent hover:bg-gray-50"
      }`}
  >
    <div className="flex items-start gap-3">
      <div className="mt-1.5 shrink-0 w-2 h-2 flex items-center justify-center">
        {!notification.is_read && (
          <div className="w-2 h-2 bg-[#25A8A0] rounded-full shadow-[0_0_8px_rgba(37,168,160,0.6)]"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`font-semibold text-sm leading-tight ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
          >
            {notification.title}
          </h4>
          <span
            className={`text-[10px] whitespace-nowrap ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
          >
            {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p
          className={`text-xs mt-1 leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"} line-clamp-2`}
        >
          {notification.message}
        </p>
      </div>
    </div>
  </div>
)

const DashboardHeader: React.FC = () => {
  const { theme } = useTheme()
  const { user, logout, fetchWithAuth } = useAuth()
  const { globalSearch, setGlobalSearch } = useSearch()
  const [hasFetched, setHasFetched] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


  useEffect(() => {
    if (notificationsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [notificationsOpen])

  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)

  const fetchNotifications = async () => {
    try {
      const response = await fetchWithAuth(API_BASE_URL + '/api/auth/notifications/')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    if (user && !hasFetched) {
      fetchNotifications()
      setHasFetched(true)
    }
  }, [fetchWithAuth, user, hasFetched])

  const markAsRead = async (id: number) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/notifications/${id}/read/`, {
        method: 'POST'
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    notifications.filter(n => !n.is_read).forEach(n => markAsRead(n.id))
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.is_read
    return true
  })

  const groupedNotifications = {
    today: filteredNotifications.filter(n => {
      const today = new Date()
      const d = new Date(n.created_at)
      return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    }),
    yesterday: filteredNotifications.filter(n => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const d = new Date(n.created_at)
      return d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()
    }),
    earlier: filteredNotifications.filter(n => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const d = new Date(n.created_at)
      return d < yesterday
    }),
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const quickActions = [
    { name: "Book Session", icon: FaCalendarAlt, href: "/booking" },
    { name: "Messages", icon: FaComments, href: "/messages" },
    { name: "Progress", icon: FaChartLine, href: "/progress" },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-xl border-b ${theme === "dark"
          ? "bg-gray-900 border-gray-800 shadow-2xl shadow-black/20"
          : "bg-[#25A8A0] border-[#25A8A0] shadow-lg shadow-[#25A8A0]/20"
          }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center h-20 lg:h-24 px-4">
            {/* Left section: Logo & Nav */}
            <div className="flex items-center gap-12 z-10 flex-shrink-0">
              <Link to="/dashboard" className="flex items-center">
                <img src={theme === 'dark' ? STLogoLight : STLogoDark} alt="SoulTalk" className="h-10 lg:h-12 w-auto rounded-full" />
              </Link>
              <nav className="hidden lg:flex">
                <div className="flex items-center gap-8">
                  <Link
                    to="/find-listener"
                    className={
                      location.pathname === "/find-listener" ? 'active-nav-link' : 'nav-link'
                    }
                  >
                    Support
                  </Link>



                  {user?.type === 'admin' && (
                    <Link
                      to="/admin"
                      className={
                        location.pathname === "/admin" ? 'active-nav-link' : 'nav-link'
                      }
                    >
                      Admin
                    </Link>
                  )}
                </div>
              </nav>
            </div>

            {/* Center section: Search Bar */}
            <div className="flex-1 flex justify-center px-4 lg:px-8">
              <div className="max-w-2xl w-full">
                <div className={`relative group transition-all duration-500 ${searchFocused ? "scale-[1.02]" : ""}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 lg:pl-5 flex items-center pointer-events-none z-10">
                    <FaSearch className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-colors duration-300 ${searchFocused ? "text-[#25A8A0]" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search..."
                    className={`w-full pl-10 lg:pl-14 pr-10 lg:pr-12 py-2 lg:py-3.5 rounded-xl lg:rounded-[1.25rem] border-2 transition-all duration-500 font-medium text-sm lg:text-base ${searchFocused
                      ? theme === "dark"
                        ? "border-[#25A8A0] ring-4 lg:ring-8 ring-[#25A8A0]/5 bg-gray-800 text-white placeholder-gray-500 shadow-2xl"
                        : "border-[#25A8A0]/20 ring-4 lg:ring-8 ring-[#25A8A0]/5 bg-white text-gray-900 placeholder-gray-400 shadow-2xl"
                      : theme === "dark"
                        ? "border-transparent bg-gray-800/50 text-white placeholder-gray-500"
                        : "border-transparent bg-gray-900/10 text-gray-900 placeholder-gray-500 hover:bg-gray-900/20"
                      } focus:outline-none`}
                  />
                  {globalSearch && (
                    <button
                      onClick={() => setGlobalSearch("")}
                      className="absolute inset-y-0 right-0 pr-4 lg:pr-5 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTimes className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right section: Actions */}
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 z-10 flex-shrink-0">
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-3 rounded-2xl transition-all duration-300 ${theme === "dark" ? "text-teal-400 bg-gray-800 hover:bg-gray-700" : "text-white bg-white/10 hover:bg-white/20"} hover:scale-110`}
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm border-2 border-[#25A8A0]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div
                    className={`absolute right-0 mt-4 w-[480px] rounded-2xl shadow-2xl border backdrop-blur-xl z-50 transform transition-all duration-200 origin-top-right overflow-hidden ${theme === "dark" ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"}`}
                  >
                    <div className={`p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Notifications
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={markAllAsRead}
                            className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"}`}
                            title="Mark all as read"
                          >
                            <FaCheckDouble className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setNotificationsOpen(false)}
                            className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"}`}
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('all')}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'all'
                            ? "bg-[#25A8A0] text-white shadow-lg shadow-[#25A8A0]/20"
                            : theme === "dark"
                              ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setActiveTab('unread')}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'unread'
                            ? "bg-[#25A8A0] text-white shadow-lg shadow-[#25A8A0]/20"
                            : theme === "dark"
                              ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                          Unread
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[480px] overflow-y-auto custom-scrollbar" style={{ overscrollBehavior: 'contain' }}>
                      {loadingNotifications ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-8 h-8 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : filteredNotifications.length > 0 ? (
                        <div className="py-2">
                          {groupedNotifications.today.length > 0 && (
                            <div className="mb-2">
                              <h4 className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                Today
                              </h4>
                              {groupedNotifications.today.map(notification => (
                                <NotificationItem key={notification.id} notification={notification} theme={theme} onClick={() => markAsRead(notification.id)} />
                              ))}
                            </div>
                          )}
                          {groupedNotifications.yesterday.length > 0 && (
                            <div className="mb-2">
                              <h4 className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                Yesterday
                              </h4>
                              {groupedNotifications.yesterday.map(notification => (
                                <NotificationItem key={notification.id} notification={notification} theme={theme} onClick={() => markAsRead(notification.id)} />
                              ))}
                            </div>
                          )}
                          {groupedNotifications.earlier.length > 0 && (
                            <div className="mb-2">
                              <h4 className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                Earlier
                              </h4>
                              {groupedNotifications.earlier.map(notification => (
                                <NotificationItem key={notification.id} notification={notification} theme={theme} onClick={() => markAsRead(notification.id)} />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                          <div className={`p-4 rounded-full mb-4 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                            <FaBell className={`w-8 h-8 ${theme === "dark" ? "text-gray-600" : "text-gray-300"}`} />
                          </div>
                          <p className={`text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                            No notifications
                          </p>
                          <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                            {activeTab === 'unread' ? "You're all caught up!" : "We'll notify you when something arrives"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={`p-3 border-t ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50/50"}`}>
                      <Link
                        to="/notifications"
                        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${theme === "dark" ? "hover:bg-gray-700 text-gray-300 hover:text-white" : "hover:bg-white text-gray-600 hover:text-gray-900 hover:shadow-sm"}`}
                      >
                        <span>View all notifications</span>
                        <FaChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-300 hover:scale-110 active:scale-95 shadow-md ${theme === 'dark' ? 'bg-teal-500 text-white shadow-black/20' : 'bg-white text-teal-600 shadow-black/5'}`}
                  style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                  title="Profile"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
                      }}
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>

                {profileOpen && (
                  <div
                    className={`absolute right-0 mt-4 w-72 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 transform transition-all duration-300 p-2 ${theme === "dark" ? "bg-gray-800/95 border-gray-700 shadow-black/40" : "bg-white border-gray-100 shadow-teal-900/10"}`}
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-4 mb-6 pt-2 px-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-2 overflow-hidden ${theme === 'dark' ? 'bg-[#25A8A0] ring-gray-700/50' : 'bg-teal-50 ring-teal-50'}`}>
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
                              }}
                            />
                          ) : (
                            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#25A8A0]'}`}>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className={`font-bold text-base ${theme === "dark" ? "text-white" : "text-gray-900"} line-clamp-1`}>
                            {user?.name || 'User'}
                          </p>
                          <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"} line-clamp-1`}>
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Link
                          to="/dashboard"
                          className={`lg:hidden w-full group flex items-center justify-start space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#25A8A0]/10" : "text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50"}`}
                        >
                          <div className={`shrink-0 p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === "dark" ? "bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]" : "bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]"}`}>
                            <MdDashboard className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">Dashboard</span>
                        </Link>

                        <Link
                          to="/find-listener"
                          className={`lg:hidden w-full group flex items-center justify-start space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#25A8A0]/10" : "text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50"}`}
                        >
                          <div className={`shrink-0 p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === "dark" ? "bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]" : "bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]"}`}>
                            <FaSearch className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">Find Support</span>
                        </Link>

                        <Link
                          to="/profile"
                          className={`w-full group flex items-center justify-start space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#25A8A0]/10" : "text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50"}`}
                        >
                          <div className={`shrink-0 p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === "dark" ? "bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]" : "bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]"}`}>
                            <FaUser className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">My Profile</span>
                        </Link>

                        <Link
                          to="/settings"
                          className={`w-full group flex items-center justify-start space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#25A8A0]/10" : "text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50"}`}
                        >
                          <div className={`shrink-0 p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === "dark" ? "bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]" : "bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]"}`}>
                            <FaCog className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">Settings</span>
                        </Link>

                        <Link
                          to="/billing"
                          className={`w-full group flex items-center justify-start space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#25A8A0]/10" : "text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50"}`}
                        >
                          <div className={`shrink-0 p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === "dark" ? "bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]" : "bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]"}`}>
                            <FaCrown className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">Billing</span>
                        </Link>

                        <Link
                          to="/session-history"
                          className={`w-full group flex items-center justify-start space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#25A8A0]/10" : "text-gray-700 hover:text-[#25A8A0] hover:bg-teal-50/50"}`}
                        >
                          <div className={`shrink-0 p-2 rounded-xl transition-all duration-200 group-hover:scale-110 ${theme === "dark" ? "bg-gray-700 text-gray-400 group-hover:text-[#25A8A0]" : "bg-gray-50 text-gray-400 group-hover:text-[#25A8A0]"}`}>
                            <FaHistory className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">History</span>
                        </Link>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => {
                            logout()
                            navigate('/')
                          }}
                          className="w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 bg-red-50 hover:bg-red-100 text-red-600 font-bold dark:bg-red-500/10 dark:hover:bg-red-500/20 group"
                        >
                          <div className="shrink-0 p-2 rounded-xl bg-white/50 dark:bg-black/20 transition-transform group-hover:scale-110">
                            <FaSignOutAlt className="w-4 h-4" />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </header >
    </>
  )
}

export default DashboardHeader