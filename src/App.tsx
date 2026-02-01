import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import SplashScreen from './pages/SplashScreen';
import './index.css';
import Dashboard from './pages/Dashboard';
import Professionals from './pages/Professionals';
import Booking from './pages/Booking';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import FindListener from './pages/FindListener';
import Schedule from './pages/Schedule';
import ProfessionalSchedule from './pages/ProfessionalSchedule';
import Journal from './pages/Journal';
import Diagnosis from './pages/Diagnosis';
import Clients from './pages/Clients';
import AIChat from './pages/AIChat';
import LiveSession from './pages/LiveSession';
import TextChat from './pages/TextChat';
import ClientProfile from './pages/ClientProfile';
import ClientSettings from './pages/ClientSettings';
import ClientBilling from './pages/ClientBilling';
import ClientHistory from './pages/ClientHistory';
import PaymentSuccess from './pages/PaymentSuccess';
import SubscriptionPlans from './pages/SubscriptionPlans';
import MoodHistory from './pages/MoodHistory';
import CrisisSupport from './pages/CrisisSupport';
import InstantSupport from './pages/InstantSupport';
import ProfessionalProfile from './pages/ProfessionalProfile';
import ProfessionalSettings from './pages/ProfessionalSettings';
import ProfessionalPayments from './pages/ProfessionalPayments';
import ProfessionalHistory from './pages/ProfessionalHistory';
import VerificationPending from './pages/VerificationPending';
import OpportunityBoard from './pages/OpportunityBoard';
import ClientPost from './pages/ClientPost';



function App() {
  // Initialize state based on sessionStorage and current path
  // Only show splash if it's the first visit AND we are on the landing page
  const [showSplash, setShowSplash] = React.useState(() => {
    const isLandingPage = window.location.pathname === '/';
    const hasVisited = sessionStorage.getItem('hasVisited');
    return isLandingPage && !hasVisited;
  });

  React.useEffect(() => {
    if (showSplash) {
      // Mark as visited immediately so it doesn't show again on refresh
      sessionStorage.setItem('hasVisited', 'true');
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 4000); // Show splash for 4 seconds
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/professionals" element={<Professionals />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/find-listener" element={<FindListener />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/professional/schedule" element={<ProfessionalSchedule />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/diagnosis" element={<Diagnosis />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/live/:sessionId" element={<LiveSession />} />
                <Route path="/chat/:connId" element={<TextChat />} />
                <Route path="/profile" element={<ClientProfile />} />
                <Route path="/settings" element={<ClientSettings />} />
                <Route path="/billing" element={<ClientBilling />} />
                <Route path="/professional/profile" element={<ProfessionalProfile />} />
                <Route path="/professional/settings" element={<ProfessionalSettings />} />
                <Route path="/professional/billing" element={<ProfessionalPayments />} />
                <Route path="/professional/history" element={<ProfessionalHistory />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/subscription/plans" element={<SubscriptionPlans />} />
                <Route path="/session-history" element={<ClientHistory />} />
                <Route path="/mood-history" element={<MoodHistory />} />
                <Route path="/crisis-support" element={<CrisisSupport />} />
                <Route path="/instant-support" element={<InstantSupport />} />
                <Route path="/verification-pending" element={<VerificationPending />} />
                <Route path="/marketplace" element={<ClientPost />} />
                <Route path="/opportunities" element={<OpportunityBoard />} />
              </Routes>

            </div>
          </Router>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

