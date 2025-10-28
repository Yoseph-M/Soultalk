import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import Header from './pages/Header';
import SplashScreen from './pages/SplashScreen';
import './index.css';
import Dashboard from './pages/Dashboard';
import Professionals from './pages/Professionals';
import Booking from './pages/Booking';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem('hasVisited', 'true');
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/professionals" element={<><Header /><Professionals /></>} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/pricing" element={<><Header /><Pricing /></>} />
              <Route path="/about" element={<><Header /><About /></>} />     
              <Route path="/services" element={<Services />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/privacy" element={<><Header /><Privacy /></>} />
              <Route path="/terms" element={<><Header /><Terms /></>} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;