import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { UserProfile, Meal } from './types';
import { getUserProfile, upsertUserProfile, getUserMeals, addMeal as addMealToDb, subscribeToMeals } from './services/supabaseService';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
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

const AppContent: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Ensure dark mode is always enabled
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);
  const [dashboardView, setDashboardView] = useState<'dashboard' | 'coach'>('dashboard');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Load user profile and meals from Supabase
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setIsLoadingProfile(false);
        return;
      }

      setIsLoadingProfile(true);
      
      // Load profile
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);

      // Load meals - use YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      console.log('Loading meals for date:', today); // Debug log
      const meals = await getUserMeals(user.id, today);
      setMeals(meals);

      setIsLoadingProfile(false);

      // Subscribe to real-time meal updates
      const unsubscribe = subscribeToMeals(user.id, setMeals);
      return unsubscribe;
    };

    loadUserData();
  }, [user?.id]);

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
    } else if (page === 'dashboard') {
      navigate('/dashboard');
      setDashboardView('dashboard');
    } else if (page === 'contact') {
      navigate('/contact');
    } else if (page === 'profile') {
      navigate('/profile');
    } else if (page === 'login') {
      navigate('/signin');
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    if (!user?.id) return;
    const profileWithDefaults = { ...profile, mealSlots: [] };
    await upsertUserProfile(user.id, profileWithDefaults);
    setUserProfile(profileWithDefaults);
    navigate('/dashboard');
  };

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    if (!user?.id) return;
    await upsertUserProfile(user.id, updatedProfile);
    setUserProfile(updatedProfile);
  };
  
  const handleAddMeal = async (meal: Meal) => {
    if (!user?.id) return;
    console.log('Adding meal for user:', user.id, meal); // Debug log
    const success = await addMealToDb(user.id, meal);
    if (success) {
      // Refresh meals from database to ensure we have the latest - use YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching meals for date:', today); // Debug log
      const updatedMeals = await getUserMeals(user.id, today);
      console.log('Refreshed meals after add:', updatedMeals); // Debug log
      setMeals(updatedMeals);
    } else {
      console.error('Failed to add meal to database');
    }
  };

  const nutritionalGoals = useMemo(() => {
    if (!userProfile) return null;
    return calculateNutritionalGoals(userProfile);
  }, [userProfile]);

  const currentPage = location.pathname === '/' ? 'home' : 
                     location.pathname === '/about' ? 'about' :
                     location.pathname === '/pricing' ? 'pricing' :
                     location.pathname === '/contact' ? 'contact' :
                     location.pathname.startsWith('/dashboard') ? 'dashboard' :
                     location.pathname === '/profile' ? 'profile' :
                     location.pathname === '/settings' ? 'settings' : 'home';

  // Don't show navbar on auth pages
  const showNavbar = !['/signup', '/signin'].includes(location.pathname);

  if (isLoading || isLoadingProfile) {
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
          <Route path="/contact" element={<><ContactPage /><Footer /></>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/auth/callback" element={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-lg text-gray-400">Completing sign in...</p></div>} />
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
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;