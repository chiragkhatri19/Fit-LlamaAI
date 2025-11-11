import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LlamaIcon } from '../components/ui/Icons';
import { Button, BackgroundBeams } from '../components/ui/aceternity';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signUpWithGoogle } = useAuth();
  const navigate = useNavigate();
  const hasGoogleOAuth = !!GOOGLE_CLIENT_ID;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.name);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (data: any) => {
    try {
      setIsLoading(true);
      // Create a credential-like object from Google user info
      const credential = JSON.stringify({
        sub: data.id || `google_${Date.now()}`,
        email: data.email,
        name: data.name,
        picture: data.picture,
      });
      await signUpWithGoogle(credential);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Failed to sign up with Google. Please try again.');
    setIsLoading(false);
  };

  const handleGoogleClick = () => {
    if (!hasGoogleOAuth) {
      setError('Google sign-in is not configured. Please use email sign-up instead.');
      return;
    }
    // Google OAuth will be handled by a separate component when properly configured
    setError('Google sign-in feature is coming soon. Please use email sign-up for now.');
  };

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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign Up Button - Hidden for now until OAuth is fully configured */}
          {false && hasGoogleOAuth && (
            <>
              <GoogleAuthButton onClick={handleGoogleClick} disabled={isLoading}>
                Continue with Google
              </GoogleAuthButton>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                    Or sign up with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="moving-border"
              className="w-full mt-6"
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </span>
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

