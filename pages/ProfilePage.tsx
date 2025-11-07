import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Edit, Settings, Calendar, Target, Activity, Utensils, Clock, Ruler, Weight, Cake, Users } from 'lucide-react';
import { Button } from '../components/ui/aceternity';
import type { UserProfile, Goal, ActivityLevel, Gender, DietaryPreference } from '../types';

const ProfilePage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const formatActivityLevel = (level: ActivityLevel): string => {
    const levels: Record<ActivityLevel, string> = {
      sedentary: 'Sedentary (little or no exercise)',
      light: 'Lightly active (light exercise 1-3 days/week)',
      moderate: 'Moderately active (moderate exercise 3-5 days/week)',
      very: 'Very active (hard exercise 6-7 days/week)',
      extra: 'Extremely active (very hard exercise, physical job)',
    };
    return levels[level] || level;
  };

  const formatGoal = (goal: Goal): string => {
    const goals: Record<Goal, string> = {
      'fat-loss': 'Fat Loss',
      'muscle-gain': 'Muscle Gain',
      'recomp': 'Body Recomposition',
    };
    return goals[goal] || goal;
  };

  const formatDietaryPreference = (preference: DietaryPreference): string => {
    const preferences: Record<DietaryPreference, string> = {
      vegetarian: 'Vegetarian',
      'non-vegetarian': 'Non-Vegetarian',
      any: 'Any',
    };
    return preferences[preference] || preference;
  };

  const formatGender = (gender: Gender): string => {
    return gender === 'male' ? 'Male' : 'Female';
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">No profile data found</p>
          <Button onClick={() => navigate('/onboarding')} variant="moving-border">
            Complete Your Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600 mb-2">
            Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">View and manage your profile information</p>
        </div>

        {/* Account Information Card */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </h2>
            <Button
              onClick={() => navigate('/settings')}
              variant="moving-border"
              className="text-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                  {user?.name || 'User'}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{user?.email || 'No email'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Signed in with {user?.authMethod === 'google' ? 'Google' : 'Email'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
            <Users className="w-5 h-5" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Cake className="w-4 h-4" />
                <span className="text-sm font-medium">Age</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {userProfile.age} years
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Gender</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatGender(userProfile.gender)}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Ruler className="w-4 h-4" />
                <span className="text-sm font-medium">Height</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {userProfile.height} cm ({Math.round(userProfile.height / 2.54)} in)
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Weight className="w-4 h-4" />
                <span className="text-sm font-medium">Weight</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {userProfile.weight} kg ({Math.round(userProfile.weight * 2.20462)} lbs)
              </p>
            </div>
          </div>
        </div>

        {/* Fitness Goals Card */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
            <Target className="w-5 h-5" />
            Fitness Goals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Primary Goal</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatGoal(userProfile.goal)}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Activity Level</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatActivityLevel(userProfile.activityLevel)}
              </p>
            </div>

            {userProfile.workoutTime && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Preferred Workout Time</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {userProfile.workoutTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dietary Preferences Card */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
            <Utensils className="w-5 h-5" />
            Dietary Preferences
          </h2>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
              <Utensils className="w-4 h-4" />
              <span className="text-sm font-medium">Diet Type</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatDietaryPreference(userProfile.dietaryPreference)}
            </p>
          </div>
        </div>

        {/* Meal Schedule Card */}
        {userProfile.mealSlots && userProfile.mealSlots.length > 0 && (
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5" />
              Meal Schedule
            </h2>

            <div className="space-y-3">
              {userProfile.mealSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{slot.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{slot.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/onboarding')}
            variant="moving-border"
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="moving-border"
            className="flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

