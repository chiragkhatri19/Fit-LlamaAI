import React from 'react';
import { LlamaIcon, SparklesIcon, FireIcon, LightbulbIcon, CheckCircleIcon } from '../components/ui/Icons';
import Footer from '../components/ui/Footer';
import { WobbleCard, Button, BackgroundBeams, ShootingStars } from '../components/ui/aceternity';

interface Props {
  onGetStarted: () => void;
}

const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Meal Analysis",
      description: "Snap a photo of your meal and get instant nutritional insights powered by AI."
    },
    {
      icon: <FireIcon className="w-8 h-8 text-red-500" />,
      title: "Track Your Macros",
      description: "Monitor calories, protein, carbs, and fats with beautiful visualizations."
    },
    {
      icon: <LightbulbIcon className="w-8 h-8 text-amber-500" />,
      title: "Personalized Coaching",
      description: "Get tailored nutrition advice from Lorenzo, your AI Llama coach."
    },
    {
      icon: <CheckCircleIcon className="w-8 h-8 text-green-500" />,
      title: "Smart Meal Planning",
      description: "Plan your meals and track your progress toward your fitness goals."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col relative transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundBeams className="opacity-30" />
        <ShootingStars className="opacity-60 dark:opacity-40" />
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 flex-grow relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <LlamaIcon className="w-24 h-24 sm:w-32 sm:h-32 relative z-10 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500">
              Fit Llama AI
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-800 dark:text-slate-200 mb-4 max-w-3xl mx-auto font-medium">
            Your Personal AI Nutrition Coach
          </p>
          
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Transform your nutrition journey with AI-powered meal tracking, personalized insights, and expert guidance—all in one beautiful app.
          </p>

          <Button
            onClick={onGetStarted}
            variant="moving-border"
            className="group"
          >
            <span className="flex items-center gap-2">
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Button>
        </div>

               {/* Features Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <WobbleCard
              key={index}
              containerClassName="h-full"
              className="p-6"
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-4 p-3 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-950/40 dark:to-sky-950/40 rounded-lg shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            </WobbleCard>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl border border-slate-200/60 dark:border-slate-800/50">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                1
              </div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Set Your Goals</h3>
                      <p className="text-slate-700 dark:text-slate-300">
                Tell us about yourself and your fitness goals. We'll create a personalized nutrition plan.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Log Your Meals</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Snap photos of your meals or manually log them. Our AI analyzes everything instantly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Get Insights</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Receive personalized advice, macro breakdowns, and actionable tips from Lorenzo.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                    Ready to Transform Your Nutrition?
                  </h2>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
            Join thousands of users who are achieving their fitness goals with Fit Llama AI.
          </p>
          <Button
            onClick={onGetStarted}
            variant="moving-border"
          >
            Start Your Journey Today
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;

