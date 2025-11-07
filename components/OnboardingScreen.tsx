import React, { useState } from 'react';
import type { UserProfile, Goal, ActivityLevel, Gender, DietaryPreference } from '../types';
import { TargetIcon, DumbbellIcon, ScaleIcon, UserIcon, LlamaCornerIllustration } from './Icons';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
      gender: 'male',
      activityLevel: 'light',
      goal: 'fat-loss',
      dietaryPreference: 'any'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: isNaN(Number(value)) || value === '' ? value : Number(value) }));
  };
  
  const handleRadioChange = (name: string, value: DietaryPreference | Goal) => {
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.age && profile.gender && profile.height && profile.weight && profile.activityLevel && profile.goal && profile.dietaryPreference) {
        onComplete(profile as UserProfile);
    } else {
        alert("Please fill in all fields.");
    }
  };

  const renderStep1 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Welcome to Llama Life Coach</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Let's get to know you to create your personalized nutrition plan.</p>
      <div className="space-y-6 text-left">
          <div>
              <label htmlFor="age" className="block text-sm font-medium mb-1">Age</label>
              <input type="number" name="age" id="age" value={profile.age || ''} onChange={handleChange} className="w-full p-4 rounded-md border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700 shadow-sm" placeholder="e.g., 28" required />
          </div>
          <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
              <select name="gender" id="gender" value={profile.gender} onChange={handleChange} className="w-full p-4 rounded-md border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700 shadow-sm">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
              </select>
          </div>
          <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input type="number" name="weight" id="weight" value={profile.weight || ''} onChange={handleChange} className="w-full p-4 rounded-md border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700 shadow-sm" placeholder="e.g., 75" required/>
          </div>
          <div>
              <label htmlFor="height" className="block text-sm font-medium mb-1">Height (cm)</label>
              <input type="number" name="height" id="height" value={profile.height || ''} onChange={handleChange} className="w-full p-4 rounded-md border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700 shadow-sm" placeholder="e.g., 180" required/>
          </div>
      </div>
      <button onClick={nextStep} className="w-full mt-8 px-6 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700">Next</button>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Your Lifestyle</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">A few more details to personalize your plan.</p>
      <div className="space-y-6 text-left">
        <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium mb-1 text-center">Activity Level</label>
            <select name="activityLevel" id="activityLevel" value={profile.activityLevel} onChange={handleChange} className="w-full p-4 rounded-md border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700 shadow-sm">
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                <option value="very">Very active (hard exercise/sports 6-7 days a week)</option>
                <option value="extra">Extra active (very hard exercise/physical job)</option>
            </select>
        </div>
        
        <div>
            <label className="block text-sm font-medium mb-2 text-center">Dietary Preference</label>
            <div className="flex flex-wrap gap-4 justify-center">
                 {renderRadioOption('dietaryPreference', 'any', 'Any')}
                 {renderRadioOption('dietaryPreference', 'vegetarian', 'Vegetarian')}
                 {renderRadioOption('dietaryPreference', 'non-vegetarian', 'Non-Vegetarian')}
            </div>
        </div>

        <div>
            <label htmlFor="workoutTime" className="block text-sm font-medium mb-1 text-center">Typical Workout Time (Optional)</label>
             <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">Helps your Llama Coach give better meal advice!</p>
            <input type="time" name="workoutTime" id="workoutTime" value={profile.workoutTime || ''} onChange={handleChange} className="w-full p-4 rounded-md border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700 shadow-sm" />
        </div>
      </div>
       <h2 className="text-2xl font-bold mb-2 mt-8">Your Primary Goal</h2>
       <p className="text-gray-500 dark:text-gray-400 mb-8">What are you working towards?</p>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderGoalOption('fat-loss', 'Fat Loss', 'Lose weight and reduce body fat.', <ScaleIcon className="w-8 h-8"/>)}
            {renderGoalOption('muscle-gain', 'Muscle Gain', 'Build muscle mass and strength.', <DumbbellIcon className="w-8 h-8"/>)}
            {renderGoalOption('recomp', 'Body Recomp', 'Build muscle and lose fat simultaneously.', <TargetIcon className="w-8 h-8"/>)}
       </div>
      <div className="flex gap-4 mt-8">
        <button onClick={prevStep} className="w-full px-6 py-4 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md">Back</button>
        <button onClick={handleSubmit} className="w-full px-6 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700">Finish Setup</button>
      </div>
    </div>
  );
  
  const renderRadioOption = (name: 'dietaryPreference', value: DietaryPreference, label: string) => (
      <label className={`px-4 py-2 rounded-full cursor-pointer text-sm font-semibold transition-colors ${profile[name] === value ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>
          <input 
              type="radio" 
              name={name}
              value={value}
              checked={profile[name] === value}
              onChange={() => handleRadioChange(name, value)}
              className="hidden"
          />
          {label}
      </label>
  )

  const renderGoalOption = (goal: Goal, title: string, description: string, icon: React.ReactNode) => (
      <div 
        onClick={() => handleRadioChange('goal', goal)}
        className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${profile.goal === goal ? 'border-violet-500 bg-violet-50 dark:bg-slate-700' : 'border-gray-300 dark:border-gray-600 hover:border-violet-400'}`}
      >
          <div className={`mx-auto w-fit mb-2 ${profile.goal === goal ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500'}`}>{icon}</div>
          <h3 className="font-semibold text-center">{title}</h3>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">{description}</p>
      </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
       <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 relative">
            <LlamaCornerIllustration className="absolute -top-12 -right-12 w-48 h-48 text-violet-200 dark:text-violet-900/50 opacity-30" />
            <header className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-violet-600 dark:text-violet-400">
                    <UserIcon className="w-8 h-8" />
                    <h1>Profile Setup</h1>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4 dark:bg-gray-700">
                  <div className="bg-violet-600 h-1.5 rounded-full" style={{width: `${step * 50}%`, transition: 'width 0.3s'}}></div>
                </div>
            </header>
            <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
            </form>
       </div>
    </div>
  );
};

export default OnboardingScreen;