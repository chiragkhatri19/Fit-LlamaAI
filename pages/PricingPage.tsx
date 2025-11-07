import React from 'react';
import { LlamaIcon, CheckCircleIcon } from '../components/ui/Icons';
import { Button } from '../components/ui/aceternity';
import { WobbleCard } from '../components/ui/aceternity';
import { ShootingStars } from '../components/ui/aceternity/ShootingStars';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const PricingPage: React.FC = () => {
  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with your nutrition journey",
      features: [
        "AI meal analysis (10 per day)",
        "Basic macro tracking",
        "Personalized meal recommendations",
        "Chat with Lorenzo (limited)",
        "Progress tracking"
      ],
      cta: "Get Started Free"
    },
    {
      name: "Pro",
      price: "$9.99",
      description: "For serious fitness enthusiasts",
      popular: true,
      features: [
        "Unlimited AI meal analysis",
        "Advanced macro tracking",
        "Personalized meal plans",
        "Unlimited chat with Lorenzo",
        "Detailed progress analytics",
        "Custom meal slot planning",
        "Priority support",
        "Export your data"
      ],
      cta: "Start Pro Trial"
    },
    {
      name: "Premium",
      price: "$19.99",
      description: "Complete nutrition coaching experience",
      features: [
        "Everything in Pro",
        "1-on-1 AI coaching sessions",
        "Custom recipe generation",
        "Advanced goal tracking",
        "Meal prep planning",
        "Nutrition reports",
        "24/7 priority support",
        "Early access to new features"
      ],
      cta: "Go Premium"
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
              Simple, Transparent Pricing
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-800 dark:text-slate-200 mb-4 max-w-3xl mx-auto font-medium">
            Choose the plan that fits your goals
          </p>
          
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Start free and upgrade when you're ready to unlock advanced features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {pricingTiers.map((tier, index) => (
            <WobbleCard
              key={index}
              containerClassName={`h-full ${tier.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              className="p-8"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-sky-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {tier.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {tier.price}
                  </span>
                  {tier.price !== "$0" && (
                    <span className="text-slate-600 dark:text-slate-400">/month</span>
                  )}
                </div>
                <p className="text-slate-700 dark:text-slate-400 text-sm">
                  {tier.description}
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-800 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={tier.popular ? "default" : "moving-border"}
                className={`w-full ${tier.popular ? 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700' : ''}`}
              >
                {tier.cta}
              </Button>
            </WobbleCard>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200/60 dark:border-slate-800/50">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Can I change plans anytime?</h3>
              <p className="text-slate-800 dark:text-slate-300 text-sm">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Is there a free trial?</h3>
              <p className="text-slate-800 dark:text-slate-300 text-sm">The Free plan is always free! Pro and Premium plans come with a 7-day free trial.</p>
            </div>
            <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-800 dark:text-slate-300 text-sm">We accept all major credit cards, PayPal, and other secure payment methods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

