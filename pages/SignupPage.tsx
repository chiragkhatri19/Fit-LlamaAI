import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { LlamaIcon } from '../components/ui/Icons';
import { BackgroundBeams } from '../components/ui/aceternity';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center relative px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundBeams className="opacity-30" />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800/50 p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LlamaIcon className="w-16 h-16 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600 mb-2">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Start your nutrition journey today
            </p>
          </div>

          {/* Clerk Sign Up Component */}
          <SignUp 
            routing="path"
            path="/signup"
            signInUrl="/signin"
            afterSignUpUrl="/onboarding"
            forceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700',
                formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700',
                footerActionLink: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

