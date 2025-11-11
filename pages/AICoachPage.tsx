import React, { useState, useEffect } from 'react';
import type { AICoachInsight, Macros, Meal, UserProfile, MacroAnalysis, RecipeSuggestion } from '../types';
import { getAIAssistantInsight } from '../services/geminiService';
import { LightbulbIcon, SparklesIcon, CheckCircleIcon, FireIcon, ClockIcon, WaterDropIcon, CheckBadgeIcon, TrendingUpIcon, PlusCircleIcon, AnimatedLlamaLoader, LlamaIcon } from '../components/ui/Icons';
import ChatbotCard from '../components/nutrition/ChatbotCard';

interface Props {
  userProfile: UserProfile;
  nutritionalGoals: Macros;
  meals: Meal[];
}

const AICoachPage: React.FC<Props> = ({ userProfile, nutritionalGoals, meals }) => {
  const [insight, setInsight] = useState<AICoachInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      if (meals.length > 0) {
        setIsLoading(true);
        const newInsight = await getAIAssistantInsight(userProfile, nutritionalGoals, meals);
        setInsight(newInsight);
        setIsLoading(false);
      } else {
        setInsight(null); // Clear insight if no meals are logged
      }
    };
    fetchInsight();
  }, [meals, userProfile, nutritionalGoals]);

  if (meals.length === 0) {
    return (
        <div className="text-center bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-8 animate-fade-in">
            <LlamaIcon className="w-24 h-24 mx-auto mb-4"/>
            <h2 className="text-2xl font-bold mb-2">Your Llama Coach Awaits</h2>
            <p className="text-gray-600 dark:text-gray-400">Log your first meal of the day to get some llama-zing insights!</p>
        </div>
    )
  }
  
  const Card: React.FC<{children: React.ReactNode, icon: React.ReactNode, title: string, className?: string}> = ({ children, icon, title, className }) => (
      <div className={`bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg p-6 animate-fade-in ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        {children}
      </div>
  );

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400 py-20 bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg">
          <AnimatedLlamaLoader className="w-24 h-24 text-blue-500" />
          <span className="font-semibold">Your Llama is thinking...</span>
          <p className="text-sm text-gray-500">Whipping up some great advice!</p>
        </div>
      ) : insight ? (
        <>
            <Card icon={<LightbulbIcon className="w-6 h-6 text-blue-500"/>} title="Daily Summary">
                <p className="text-gray-700 dark:text-gray-300">{insight.dailySummary}</p>
            </Card>

            <Card icon={<FireIcon className="w-6 h-6 text-red-500"/>} title="Macro Deep Dive">
                <div className="space-y-4">
                    <MacroAnalysisCard title="Protein" analysis={insight.macroAnalysis.protein} />
                    <MacroAnalysisCard title="Carbs" analysis={insight.macroAnalysis.carbs} />
                    <MacroAnalysisCard title="Fat" analysis={insight.macroAnalysis.fat} />
                </div>
            </Card>
            
            {userProfile.workoutTime && (
                 <Card icon={<ClockIcon className="w-6 h-6 text-indigo-500"/>} title="Nutrient Timing">
                    <div className="space-y-3 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                            <p className="font-semibold">Pre-Workout:</p>
                            <p className="text-gray-600 dark:text-gray-300">{insight.nutrientTiming.preWorkout}</p>
                        </div>
                         <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                            <p className="font-semibold">Post-Workout:</p>
                            <p className="text-gray-600 dark:text-gray-300">{insight.nutrientTiming.postWorkout}</p>
                        </div>
                    </div>
                </Card>
            )}

            <Card icon={<SparklesIcon className="w-6 h-6 text-amber-500"/>} title="Wins & Opportunities">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                         <div className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                             <CheckBadgeIcon className="w-5 h-5"/>
                             <h4>Today's Wins</h4>
                         </div>
                        {insight.winsAndOpportunities.wins.map((win, i) => <p key={i} className="text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded-md">{win}</p>)}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                             <TrendingUpIcon className="w-5 h-5"/>
                             <h4>Opportunities</h4>
                         </div>
                        {insight.winsAndOpportunities.opportunities.map((opp, i) => <p key={i} className="text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">{opp}</p>)}
                    </div>
                </div>
            </Card>
            
             <Card icon={<WaterDropIcon className="w-6 h-6 text-sky-500"/>} title="Lorenzo's Corner">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Hydration Tip</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{insight.hydrationTip}</p>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Llama Fact of the Day!</p>
                        <p className="text-xs mt-1"><span className="font-semibold">{insight.microNutrientTip.name}:</span> {insight.microNutrientTip.tip}</p>
                    </div>
                </div>
            </Card>

            <Card icon={<PlusCircleIcon className="w-6 h-6 text-green-500"/>} title="Action Plan">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2 text-center">Quick Add Ideas</h4>
                        <ul className="space-y-2">
                           {insight.quickAddIdeas.map((idea, i) => (
                               <li key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md text-sm">
                                   <SparklesIcon className="w-4 h-4 text-blue-500 flex-shrink-0"/>
                                   <span>{idea}</span>
                                </li>
                           ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2 text-center">Recipe Suggestions</h4>
                        <div className="space-y-3">
                           {insight.recipeSuggestions.map((recipe, i) => (
                               <RecipeCard key={i} recipe={recipe} />
                           ))}
                        </div>
                    </div>
                </div>
            </Card>

            <ChatbotCard 
                userProfile={userProfile}
                nutritionalGoals={nutritionalGoals}
                meals={meals}
            />
        </>
      ) : null}
    </div>
  );
};

const statusStyles: Record<MacroAnalysis['status'], { icon: React.ReactNode, color: string, text: string }> = {
    'too-low': { icon: <FireIcon className="w-5 h-5"/>, color: 'border-amber-500', text: 'text-amber-500' },
    'on-track': { icon: <CheckCircleIcon className="w-5 h-5"/>, color: 'border-sky-500', text: 'text-sky-500' },
    'goal-met': { icon: <CheckCircleIcon className="w-5 h-5"/>, color: 'border-green-500', text: 'text-green-500' },
    'too-high': { icon: <FireIcon className="w-5 h-5"/>, color: 'border-red-500', text: 'text-red-500' },
};

const MacroAnalysisCard: React.FC<{title: string, analysis: MacroAnalysis}> = ({ title, analysis }) => {
    const style = statusStyles[analysis.status] || statusStyles['on-track'];
    return (
        <div className={`p-4 rounded-lg border-l-4 ${style.color} bg-gray-50 dark:bg-slate-700/50`}>
            <div className={`flex items-center gap-2 font-bold mb-2 ${style.text}`}>
                {style.icon}
                <span className="capitalize">{title}: {analysis.status.replace('-', ' ')}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{analysis.comment}</p>
        </div>
    )
}

const RecipeCard: React.FC<{recipe: RecipeSuggestion}> = ({ recipe }) => {
    return (
        <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-blue-400 transition-all">
            <p className="font-bold text-sm">{recipe.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{recipe.description}</p>
        </div>
    )
}


export default AICoachPage;

