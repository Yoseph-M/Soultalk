import React from 'react';
import Logo from '../assets/images/stlogo.svg';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#25A8A0] via-[#1E8A82] to-[#156660]">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#4FD1C5]/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4">
        <div className="relative mb-8">

          <div className="absolute inset-0 bg-white/20 blur-[40px] rounded-full scale-150 animate-pulse" />

          <img
            src={Logo}
            alt="SoulTalk Logo"
            className="relative h-32 w-32 md:h-48 md:w-48 object-contain animate-[fadeInScale_1.5s_ease-out_forwards]"
          />
        </div>

        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight animate-[slideUp_1s_ease-out_0.5s_both]">
            SoulTalk
          </h1>
        </div>


        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-3">
            <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
