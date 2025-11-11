import React from 'react';
import { LlamaIcon, SparklesIcon, TargetIcon, LightbulbIcon } from '../components/ui/Icons';
import { WobbleCard } from '../components/ui/aceternity';
import { ShootingStars } from '../components/ui/aceternity/ShootingStars';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <TargetIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Our Mission",
      description: "To make personalized nutrition accessible to everyone through the power of AI."
    },
    {
      icon: <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Innovation",
      description: "We leverage cutting-edge AI technology to provide accurate meal analysis and personalized coaching."
    },
    {
      icon: <LightbulbIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Empowerment",
      description: "We believe everyone deserves access to expert nutrition guidance to achieve their health goals."
    }
  ];

  const team = [
    {
      name: "Lorenzo",
      role: "AI Nutrition Coach",
      description: "Your personal AI assistant powered by advanced machine learning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col relative overflow-hidden">
      <ShootingStars className="opacity-60 dark:opacity-40" />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24 flex-grow relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <LlamaIcon className="w-24 h-24 sm:w-32 sm:h-32 relative z-10" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500">
              About Fit Llama AI
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-800 dark:text-slate-200 mb-4 max-w-3xl mx-auto font-medium">
            Revolutionizing Nutrition Through AI
          </p>
          
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            We're on a mission to make personalized nutrition guidance accessible to everyone, powered by cutting-edge artificial intelligence.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200/60 dark:border-slate-800/50 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">
            Our Story
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-300">
            <p className="text-lg leading-relaxed">
              Fit Llama AI was born from a simple idea: what if everyone had access to a personal nutrition coach? 
              We combined the power of artificial intelligence with deep nutrition science to create Lorenzo, 
              your AI-powered nutrition assistant.
            </p>
            <p className="text-lg leading-relaxed">
              Our platform uses advanced image recognition and machine learning to analyze your meals, 
              track your macros, and provide personalized recommendations tailored to your unique goals 
              and lifestyle.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you're looking to lose weight, build muscle, or simply maintain a healthy lifestyle, 
              Fit Llama AI is here to guide you every step of the way.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          {values.map((value, index) => (
            <WobbleCard
              key={index}
              containerClassName="h-full"
              className="p-6"
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-4 p-3 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-950/40 dark:to-sky-950/40 rounded-lg shadow-sm">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {value.description}
                </p>
              </div>
            </WobbleCard>
          ))}
        </div>

        {/* Technology Section */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200/60 dark:border-slate-800/50">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">
            Powered by Advanced AI
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-slate-800 dark:text-slate-300">
            <p className="text-lg">
              Our AI technology leverages Google's Gemini model to provide accurate meal analysis, 
              nutritional insights, and personalized coaching. Every interaction is designed to help 
              you make better nutrition choices and achieve your fitness goals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Image Recognition</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Advanced computer vision to identify and analyze your meals</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Personalized Coaching</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">AI-powered recommendations tailored to your unique profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

