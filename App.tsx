import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { UserProfile, Meal } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import SignupPage from './pages/SignupPage';
import SignInPage from './pages/SignInPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ResizableNavbar from './components/ui/ResizableNavbar';
import Footer from './components/ui/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { calculateNutritionalGoals } from './utils/nutritionCalculators';

// Get Google OAuth client ID from environment variable or use a default
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AppContent: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  
  // Ensure dark mode is always enabled
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);
  const [dashboardView, setDashboardView] = useState<'dashboard' | 'coach'>('dashboard');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Load meals from localStorage
    try {
      const storedMeals = localStorage.getItem('dailyMeals');
      const today = new Date().toLocaleDateString();
      if (storedMeals) {
        const parsedMeals = JSON.parse(storedMeals);
        if (parsedMeals.date === today) {
          setMeals(parsedMeals.meals);
        } else {
          localStorage.removeItem('dailyMeals');
        }
      }
    } catch (error) {
      console.error("Failed to load meals from localStorage", error);
      localStorage.removeItem('dailyMeals');
    }
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'about') {
      navigate('/about');
    } else if (page === 'pricing') {
      navigate('/pricing');
    } else if (page === 'coach') {
      navigate('/dashboard');
      setDashboardView('coach');
    } else if (page === 'profile') {
      navigate('/profile');
    } else if (page === 'login') {
      navigate('/signin');
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    const profileWithDefaults = { ...profile, mealSlots: [] };
    updateUserProfile(profileWithDefaults);
    navigate('/dashboard');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    updateUserProfile(updatedProfile);
  };
  
  const handleAddMeal = (meal: Meal) => {
    const updatedMeals = [...meals, meal];
    setMeals(updatedMeals);
    localStorage.setItem('dailyMeals', JSON.stringify({ date: new Date().toLocaleDateString(), meals: updatedMeals }));
  };

  const nutritionalGoals = useMemo(() => {
    if (!userProfile) return null;
    return calculateNutritionalGoals(userProfile);
  }, [userProfile]);

  const currentPage = location.pathname === '/' ? 'home' : 
                     location.pathname === '/about' ? 'about' :
                     location.pathname === '/pricing' ? 'pricing' :
                     location.pathname.startsWith('/dashboard') ? 'dashboard' :
                     location.pathname === '/profile' ? 'profile' :
                     location.pathname === '/settings' ? 'settings' : 'home';

  // Don't show navbar on auth pages
  const showNavbar = !['/signup', '/signin'].includes(location.pathname);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {showNavbar && (
        <ResizableNavbar
          onLogoClick={() => navigate('/')}
          onNavigate={handleNavigate}
          userProfile={userProfile}
          currentPage={currentPage}
        />
      )}
      <div className={showNavbar ? "pt-16 md:pt-20" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={() => navigate('/signup')} />} />
          <Route path="/about" element={<><AboutPage /><Footer /></>} />
          <Route path="/pricing" element={<><PricingPage /><Footer /></>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage onComplete={handleOnboardingComplete} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <main className="flex-grow w-full">
                  {!userProfile || !nutritionalGoals ? (
                    <OnboardingPage onComplete={handleOnboardingComplete} />
                  ) : (
                    <>
                      <DashboardPage 
                        userProfile={userProfile}
                        onUpdateProfile={handleUpdateProfile}
                        nutritionalGoals={nutritionalGoals}
                        meals={meals}
                        onAddMeal={handleAddMeal}
                        initialView={dashboardView}
                      />
                      <Footer />
                    </>
                  )}
                </main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <ProfilePage />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <>
                  <SettingsPage />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // For now, we'll skip GoogleOAuthProvider to avoid errors
  // Google OAuth can be added later when properly configured
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;