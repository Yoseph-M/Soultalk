import React, { useState } from 'react';
import { Send, Phone, Video, MoreVertical, Smile, Paperclip, Mic } from 'lucide-react';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'therapist',
      content: 'Hello! I hope you\'re having a good day. How are you feeling today?',
      time: '2:25 PM',
      avatar: 'SJ'
    },
    {
      id: 2,
      sender: 'user',
      content: 'Hi Dr. Johnson! I\'m doing okay, but I\'ve been feeling a bit anxious about work lately.',
      time: '2:27 PM',
      avatar: 'You'
    },
    {
      id: 3,
      sender: 'therapist',
      content: 'I understand that work anxiety can be really challenging. Can you tell me more about what specifically is making you feel anxious?',
      time: '2:28 PM',
      avatar: 'SJ'
    },
    {
      id: 4,
      sender: 'user',
      content: 'It\'s mainly the upcoming presentation I have to give next week. I keep worrying about making mistakes or forgetting what to say.',
      time: '2:30 PM',
      avatar: 'You'
    }
  ]);

  const chatList = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      lastMessage: 'How are you feeling today?',
      time: '2:30 PM',
      status: 'Online',
      avatar: 'SJ',
      active: true
    },
    {
      id: 2,
      name: 'Dr. Michael Rodriguez',
      lastMessage: 'Great progress in our last session!',
      time: 'Yesterday',
      status: 'Offline',
      avatar: 'MR',
      active: false
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      lastMessage: 'Remember to practice the breathing exercises',
      time: 'Monday',
      status: 'Offline',
      avatar: 'EC',
      active: false
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'You'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatList.map((chat) => (
            <div 
              key={chat.id}
              className={`p-4 border-b cursor-pointer transition-colors ${
                chat.active ? 'bg-[#25A8A0]/10' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${chat.active ? 'bg-[#25A8A0]' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold">{chat.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  <div className={`mt-1 inline-block px-2 py-1 rounded text-xs ${
                    chat.status === 'Online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {chat.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#25A8A0] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">SJ</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Dr. Sarah Johnson</h3>
              <p className="text-sm text-gray-600">Licensed Clinical Psychologist</p>
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Online</div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Video className="h-4 w-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'therapist' && (
                <div className="w-8 h-8 bg-[#25A8A0] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">{msg.avatar}</span>
                </div>
              )}
              
              <div className={`max-w-xs rounded-lg p-3 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-[#25A8A0] text-white' 
                  : 'bg-white text-gray-900'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <span className={`text-xs mt-1 block ${
                  msg.sender === 'user' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">{msg.avatar}</span>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#25A8A0] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">SJ</span>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button type="button" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Paperclip className="h-4 w-4" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full pr-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button type="button" className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Smile className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              className="bg-[#25A8A0] hover:bg-[#1e8a82] text-white p-2 rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-2 text-xs text-gray-500 text-center">
            This conversation is encrypted and confidential
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;