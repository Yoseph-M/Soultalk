import React, { useState } from 'react';
import { Video, MessageCircle, Phone, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardHeader from './DashboardHeader';

const Booking: React.FC = () => {
  const [selectedSessionType, setSelectedSessionType] = useState('video');
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(4);

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const days = [
    { date: '15', day: 'Mon', available: true },
    { date: '16', day: 'Tue', available: true },
    { date: '17', day: 'Wed', available: false },
    { date: '18', day: 'Thu', available: true },
    { date: '19', day: 'Fri', available: true },
    { date: '20', day: 'Sat', available: true },
    { date: '21', day: 'Sun', available: false },
  ];

  const sessionTypes = [
    {
      id: 'video',
      name: 'Video Call',
      description: 'Face-to-face session',
      price: 120,
      icon: Video,
      color: 'border-[#25A8A0] bg-[#25A8A0]/5'
    },
    {
      id: 'phone',
      name: 'Phone Call',
      description: 'Voice-only session',
      price: 100,
      icon: Phone,
      color: 'border-gray-200 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5'
    },
    {
      id: 'chat',
      name: 'Chat Session',
      description: 'Text-based session',
      price: 80,
      icon: MessageCircle,
      color: 'border-gray-200 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5'
    }
  ];

  const getSelectedSessionType = () => sessionTypes.find(type => type.id === selectedSessionType);

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Professional Info */}
            <div className="lg:col-span-1">
              <div className="bg-white border-0 shadow-lg rounded-lg sticky top-24 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#25A8A0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">SJ</span>
                  </div>
                  <h2 className="text-xl font-bold">Dr. Sarah Johnson</h2>
                  <p className="text-gray-600">Licensed Clinical Psychologist</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Anxiety</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Depression</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">PTSD</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Session Types</h4>
                    <div className="space-y-2">
                      {sessionTypes.map((type) => (
                        <div key={type.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4 text-[#25A8A0]" />
                            <span className="text-sm">{type.name}</span>
                          </div>
                          <span className="text-sm font-medium">${type.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Session Type Selection */}
              <div className="bg-white border-0 shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">1. Choose Session Type</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedSessionType(type.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSessionType === type.id ? type.color : 'border-gray-200 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5'
                      }`}
                    >
                      <type.icon className="h-8 w-8 text-[#25A8A0] mb-2" />
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                      <p className="text-lg font-bold text-[#25A8A0] mt-2">${type.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="bg-white border-0 shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">2. Select Date</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium">January 2024</span>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day.available && setSelectedDate(index)}
                      disabled={!day.available}
                      className={`p-3 text-center rounded-lg cursor-pointer transition-colors ${
                        day.available
                          ? selectedDate === index
                            ? 'bg-[#25A8A0] text-white'
                            : 'bg-gray-100 hover:bg-[#25A8A0] hover:text-white'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-sm font-medium">{day.day}</div>
                      <div className="text-lg font-bold">{day.date}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="bg-white border-0 shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-2">3. Choose Time</h2>
                <p className="text-gray-600 mb-4">Available times for Tuesday, January 16th</p>
                
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(index)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedTime === index
                          ? 'bg-[#25A8A0] text-white border-[#25A8A0]'
                          : 'border-gray-300 hover:border-[#25A8A0] hover:bg-[#25A8A0]/5'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Details */}
              <div className="bg-white border-0 shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">4. Session Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What would you like to focus on in this session?
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent"
                      rows={4}
                      placeholder="Please share what you'd like to discuss or work on during this session..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="recurring" className="rounded" />
                    <label htmlFor="recurring" className="text-sm text-gray-700">
                      Make this a recurring weekly appointment
                    </label>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-white border-0 shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Session Type</span>
                    <span className="font-medium">{getSelectedSessionType()?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Date & Time</span>
                    <span className="font-medium">Tuesday, Jan 16 at {timeSlots[selectedTime]}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Duration</span>
                    <span className="font-medium">50 minutes</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Professional</span>
                    <span className="font-medium">Dr. Sarah Johnson</span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-lg font-bold">
                    <span>Total</span>
                    <span>${getSelectedSessionType()?.price}.00</span>
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-[#25A8A0] hover:bg-[#1e8a82] text-white text-lg py-3 rounded-lg transition-colors">
                      Confirm Booking
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      You can cancel or reschedule up to 24 hours before your session
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;