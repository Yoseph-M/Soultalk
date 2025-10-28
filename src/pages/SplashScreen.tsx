import React from 'react';
import Logo from '../assets/images/stlogo.svg';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#25A8A0] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <img src={Logo} alt="SoulTalk Logo" className="h-100 w-100 slow-bounce" />
      </div>
    </div>
  );
};

export default SplashScreen;

