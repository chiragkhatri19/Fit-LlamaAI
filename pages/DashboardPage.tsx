import React, { useState, useMemo } from 'react';
import type { UserProfile, Macros, Meal, MealSlot } from '../types';
import { FireIcon, PlusCircleIcon, LightbulbIcon } from '../components/ui/Icons';
import MacroChart from '../components/nutrition/MacroChart';
import LogMealModal from '../components/nutrition/LogMealModal';
import AICoachPage from './AICoachPage';


interface Props {
  userProfile: UserProfile;
  nutritionalGoals: Macros;
  meals: Meal[];
  onAddMeal: (meal: Meal) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  initialView?: 'dashboard' | 'coach';
}

type View = 'dashboard' | 'coach';

const MealPlanSetup: React.FC<{ onSetupComplete: (slots: MealSlot[]) => void }> = ({ onSetupComplete }) => {
    const [numMeals, setNumMeals] = useState(3);

    const handleSetup = () => {
        const slots: MealSlot[] = Array.from({ length: numMeals }, (_, i) => ({
            id: `meal-${i + 1}-${Date.now()}`,
            name: `Meal ${i + 1}`,
            time: "12:00"
        }));
        onSetupComplete(slots);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-8 text-center max-w-sm mx-auto">
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Let's Plan Your Day</h2>
                <p className="text-slate-700 dark:text-gray-400 mb-6">How many meals do you typically eat?</p>
                <div className="flex items-center justify-center gap-4 mb-8">
                    <button onClick={() => setNumMeals(p => Math.max(1, p - 1))} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-slate-100">-</button>
                    <span className="text-3xl font-bold w-16 text-center text-slate-900 dark:text-slate-100">{numMeals}</span>
                    <button onClick={() => setNumMeals(p => Math.min(10, p + 1))} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-slate-100">+</button>
                </div>
                <button onClick={handleSetup} className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    Set My Meal Plan
                </button>
            </div>
        </div>
    );
};


const DashboardPage: React.FC<Props> = ({ userProfile, nutritionalGoals, meals, onAddMeal, onUpdateProfile, initialView = 'dashboard' }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMealSlotId, setActiveMealSlotId] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<View>(initialView);
    

    const handleMealPlanSetup = (slots: MealSlot[]) => {
        onUpdateProfile({ ...userProfile, mealSlots: slots });
    };
    
    const handleUpdateMealSlot = (slotId: string, field: 'name' | 'time', value: string) => {
        const updatedSlots = userProfile.mealSlots?.map(slot => 
            slot.id === slotId ? { ...slot, [field]: value } : slot
        );
        onUpdateProfile({ ...userProfile, mealSlots: updatedSlots });
    }

    const openLogMealModal = (mealSlotId: string) => {
        setActiveMealSlotId(mealSlotId);
        setIsModalOpen(true);
    };

    const dailyTotals = useMemo(() => {
        return meals.reduce((acc, meal) => {
            acc.calories += meal.totals.calories;
            acc.protein += meal.totals.protein;
            acc.carbs += meal.totals.carbs;
            acc.fat += meal.totals.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [meals]);

    const loggedMealsBySlot = (slotId: string) => meals.filter(meal => meal.mealSlotId === slotId);

    if (!userProfile.mealSlots || userProfile.mealSlots.length === 0) {
        return <MealPlanSetup onSetupComplete={handleMealPlanSetup} />
    }

  return (
    <>
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <header className="text-center mb-8">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500">
                {activeView === 'dashboard' ? "Today's Dashboard" : "Your Llama Coach"}
            </h1>
            <p className="text-slate-700 dark:text-gray-400">Welcome back! Here's your daily nutrition summary.</p>
        </div>
      </header>
        
      {/* View Toggle */}
       <div className="mb-8 flex justify-center">
            <div className="bg-slate-200/60 dark:bg-slate-900 rounded-full p-1 flex items-center space-x-1">
                <button onClick={() => setActiveView('dashboard')} className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${activeView === 'dashboard' ? 'bg-white dark:bg-slate-950 text-blue-600 shadow-md' : 'text-slate-700 dark:text-gray-300'}`}>Dashboard</button>
                <button onClick={() => setActiveView('coach')} className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${activeView === 'coach' ? 'bg-white dark:bg-slate-950 text-blue-600 shadow-md' : 'text-slate-700 dark:text-gray-300'}`}>Fit Llama AI</button>
            </div>
        </div>

      <main>
        {activeView === 'dashboard' && (
            <div className="animate-fade-in">
                {/* Daily Goals Summary */}
                <div className="bg-white/95 dark:bg-slate-900/50 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-8">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Your Daily Goals</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
                        <ProgressCircle label="Calories" current={dailyTotals.calories} goal={nutritionalGoals.calories} color="text-red-500" unit="kcal" />
                        <ProgressCircle label="Protein" current={dailyTotals.protein} goal={nutritionalGoals.protein} color="text-sky-500" unit="g" />
                        <ProgressCircle label="Carbs" current={dailyTotals.carbs} goal={nutritionalGoals.carbs} color="text-amber-500" unit="g" />
                        <ProgressCircle label="Fat" current={dailyTotals.fat} goal={nutritionalGoals.fat} color="text-lime-500" unit="g" />
                    </div>
                </div>

                {/* Meal Logging Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {userProfile.mealSlots.map(slot => (
                        <div key={slot.id} className="bg-white/95 dark:bg-slate-900/50 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <input
                                        type="text"
                                        value={slot.name}
                                        onChange={(e) => handleUpdateMealSlot(slot.id, 'name', e.target.value)}
                                        className="text-xl font-bold bg-transparent focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700 rounded-md -ml-2 px-2"
                                    />
                                    <input
                                        type="time"
                                        value={slot.time}
                                        onChange={(e) => handleUpdateMealSlot(slot.id, 'time', e.target.value)}
                                        className="text-sm text-slate-600 bg-transparent focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700 rounded-md -ml-2 px-2"
                                    />
                                </div>
                                <button onClick={() => openLogMealModal(slot.id)} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 min-h-[44px]">
                                    <PlusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="font-semibold text-sm sm:text-base">Log</span>
                                </button>
                            </div>
                            <div className="space-y-4 flex-grow">
                                {loggedMealsBySlot(slot.id).length > 0 ? (
                                    loggedMealsBySlot(slot.id).map(meal => <MealCard key={meal.id} meal={meal} />)
                                ) : (
                                    <div className="flex-grow flex items-center justify-center">
                                        <p className="text-center text-slate-600 dark:text-gray-400 py-4">No food logged.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {activeView === 'coach' && (
            <AICoachPage
                userProfile={userProfile}
                nutritionalGoals={nutritionalGoals}
                meals={meals}
            />
        )}
      </main>
    </div>
    {isModalOpen && activeMealSlotId && userProfile.mealSlots && (
        <LogMealModal 
            onClose={() => setIsModalOpen(false)} 
            onAddMeal={onAddMeal} 
            mealSlots={userProfile.mealSlots}
            activeMealSlotId={activeMealSlotId}
        />
    )}
    </>
  );
};


interface ProgressCircleProps {
    label: string;
    current: number;
    goal: number;
    color: string;
    unit: string;
}
const ProgressCircle: React.FC<ProgressCircleProps> = ({ label, current, goal, color, unit }) => {
    const progress = getProgress(current, goal);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    const getProgressColor = () => {
        if (progress > 95 && progress < 105) return 'text-green-500';
        if (progress > 105) return 'text-red-500';
        return color;
    }
    
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200 dark:text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
                    <circle
                        className={getProgressColor()}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${color}`}>
                    <span className="text-xl font-bold">{Math.round(current)}</span>
                    <span className="text-xs -mt-1 text-slate-600">/ {goal}{unit}</span>
                </div>
            </div>
            <p className="font-semibold mt-2">{label}</p>
        </div>
    );
};

const getProgress = (current: number, goal: number) => {
    if (goal === 0) return 0;
    // Allow progress to go over 100% for visual feedback
    return (current / goal) * 100;
}


const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div>
                    <p className="font-semibold capitalize">{meal.name}</p>
                    <p className="text-sm text-slate-700 dark:text-gray-400">
                        {meal.totals.calories} kcal &bull; {meal.totals.protein}g P
                    </p>
                </div>
                <div className="w-12 h-12">
                   <MacroChart protein={meal.totals.protein} carbs={meal.totals.carbs} fat={meal.totals.fat} />
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 animate-fade-in space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Items:</h4>
                        <ul className="space-y-1 text-sm text-slate-800 dark:text-gray-300">
                            {meal.items.map(item => (
                                <li key={item.id} className="flex justify-between">
                                    <span>{item.name} ({item.servingSizeValue}{item.servingSizeUnit})</span>
                                    <span>{item.calories} kcal</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                            <LightbulbIcon className="w-5 h-5 text-blue-500 dark:text-blue-400"/>
                            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">AI Insights</h4>
                        </div>
                        <ul className="space-y-1 list-disc list-inside text-xs text-slate-800 dark:text-gray-300">
                            {meal.insights.map((insight, index) => <li key={index}>{insight}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}


export default DashboardPage;

