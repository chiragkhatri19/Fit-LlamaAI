import React, { useState, useEffect, useMemo } from 'react';
import type { UserProfile, Meal } from './types';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import { calculateNutritionalGoals } from './utils/nutritionCalculators';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true); // Start with landing page by default

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {showLanding ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <>
          <Header 
            onResetApp={userProfile ? handleResetApp : undefined}
            onLogoClick={handleGoToLanding}
          />
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
              />
            )}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;