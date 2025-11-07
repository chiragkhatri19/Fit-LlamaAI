import React, { useState, useEffect, useMemo } from 'react';
import type { UserProfile, Meal } from './types';
import OnboardingScreen from './components/OnboardingScreen';
import DashboardScreen from './components/DashboardScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import { calculateNutritionalGoals } from './utils/nutritionCalculators';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
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
  
  const handleOnboardingComplete = (profile: UserProfile) => {
    const profileWithDefaults = { ...profile, mealSlots: [] };
    setUserProfile(profileWithDefaults);
    localStorage.setItem('userProfile', JSON.stringify(profileWithDefaults));
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 flex flex-col">
      <Header onResetApp={userProfile ? handleResetApp : undefined} />
      <main className="flex-grow w-full">
        {!userProfile || !nutritionalGoals ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <DashboardScreen 
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              nutritionalGoals={nutritionalGoals}
              meals={meals}
              onAddMeal={handleAddMeal}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;