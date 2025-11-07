import React, { useState, useEffect, useMemo } from 'react';
import type { UserProfile, Meal } from './types';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ResizableNavbar from './components/ui/ResizableNavbar';
import Footer from './components/ui/Footer';
import { calculateNutritionalGoals } from './utils/nutritionCalculators';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true); // Start with landing page by default
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [dashboardView, setDashboardView] = useState<'dashboard' | 'coach'>('dashboard');

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
        setShowLanding(false); // If user has a profile, skip landing page and go to dashboard
      }
      const storedMeals = localStorage.getItem('dailyMeals');
      // FIX: Corrected typo from toLocaleDateTimeString to toLocaleDateString.
      const today = new Date().toLocaleDateString();
       if (storedMeals) {
         const parsedMeals = JSON.parse(storedMeals);
         if (parsedMeals.date === today) {
            setMeals(parsedMeals.meals);
         } else {
            // Clear meals for a new day
            localStorage.removeItem('dailyMeals');
         }
       }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
        // Clear corrupted data
        localStorage.removeItem('userProfile');
        localStorage.removeItem('dailyMeals');
    }
    setIsLoading(false);
  }, []);
  
  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleGoToLanding = () => {
    setShowLanding(true);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      setShowLanding(true);
    } else if (page === 'about' || page === 'pricing') {
      setShowLanding(false);
      // These pages will be rendered separately
    } else if (page === 'coach') {
      setShowLanding(false);
      setDashboardView('coach');
    } else if (page === 'profile') {
      setShowLanding(false);
      setDashboardView('dashboard');
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    const profileWithDefaults = { ...profile, mealSlots: [] };
    setUserProfile(profileWithDefaults);
    localStorage.setItem('userProfile', JSON.stringify(profileWithDefaults));
    setShowLanding(false);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };
  
  const handleAddMeal = (meal: Meal) => {
    const updatedMeals = [...meals, meal];
    setMeals(updatedMeals);
    localStorage.setItem('dailyMeals', JSON.stringify({ date: new Date().toLocaleDateString(), meals: updatedMeals }));
  };

  const handleResetApp = () => {
    const confirmReset = window.confirm("Are you sure you want to reset all your data? This action cannot be undone.");
    if (confirmReset) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('dailyMeals');
      setUserProfile(null);
      setMeals([]);
    }
  }

  const nutritionalGoals = useMemo(() => {
    if (!userProfile) return null;
    return calculateNutritionalGoals(userProfile);
  }, [userProfile]);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <ResizableNavbar
        onLogoClick={handleGoToLanding}
        onNavigate={handleNavigate}
        userProfile={userProfile}
        currentPage={currentPage}
      />
      <div className="pt-16 md:pt-20">
        {currentPage === 'about' ? (
          <>
            <AboutPage />
            <Footer />
          </>
        ) : currentPage === 'pricing' ? (
          <>
            <PricingPage />
            <Footer />
          </>
        ) : showLanding ? (
          <LandingPage onGetStarted={handleGetStarted} />
        ) : (
          <>
            <main className="flex-grow w-full">
              {!userProfile || !nutritionalGoals ? (
                <OnboardingPage onComplete={handleOnboardingComplete} />
              ) : (
                <DashboardPage 
                    userProfile={userProfile}
                    onUpdateProfile={handleUpdateProfile}
                    nutritionalGoals={nutritionalGoals}
                    meals={meals}
                    onAddMeal={handleAddMeal}
                    initialView={dashboardView}
                />
              )}
            </main>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
};

export default App;