import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';
import { LlamaIcon } from './Icons';
import { User, Menu, X, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResizableNavbarProps {
  onLogoClick?: () => void;
  onNavigate?: (page: string) => void;
  userProfile?: any;
  currentPage?: string;
}

const ResizableNavbar: React.FC<ResizableNavbarProps> = ({
  onLogoClick,
  onNavigate,
  userProfile,
  currentPage = 'home',
}) => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navbarWidth = useTransform(scrollY, [0, 100], ['100%', '90%']);
  const navbarPadding = useTransform(scrollY, [0, 100], ['1rem', '0.75rem']);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Theme is now managed by useTheme hook

  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'AI Coach', id: 'coach' },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      // Fallback to direct navigation if onNavigate not provided
      if (id === 'home') navigate('/');
      else if (id === 'about') navigate('/about');
      else if (id === 'pricing') navigate('/pricing');
      else if (id === 'coach') navigate('/dashboard');
      else if (id === 'profile') navigate('/profile');
      else if (id === 'login') navigate('/signin');
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      style={{
        width: navbarWidth,
        paddingLeft: navbarPadding,
        paddingRight: navbarPadding,
      }}
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/50 rounded-xl md:rounded-2xl shadow-xl shadow-slate-200/30 dark:shadow-black/50 mt-2 md:mt-4"
            : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md md:bg-transparent border-b border-slate-200/30 dark:border-slate-800/30 md:border-0"
        )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo and App Name */}
          <button
            onClick={onLogoClick || (() => navigate('/'))}
            className="flex items-center gap-3 hover:opacity-70 transition-opacity group"
          >
            <LlamaIcon className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105" />
            <h1 className="hidden md:block text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Fit Llama AI
            </h1>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  currentPage === item.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-slate-700 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Sign Out Button - Desktop only */}
            {isSignedIn ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="hidden md:flex px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden relative z-50 mt-2 rounded-xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80"
              style={{
                background: 'rgba(15, 23, 42, 0.98)', // dark mode
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="px-2 py-3">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "px-4 py-3.5 rounded-lg text-base font-medium text-left transition-all duration-200 touch-manipulation min-h-[48px] flex items-center",
                        currentPage === item.id
                          ? "bg-blue-500 dark:bg-blue-600 text-white shadow-md font-semibold"
                          : "text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 active:scale-[0.98]"
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                  {/* Sign In / User Profile in Mobile Menu */}
                  {(user || userProfile) ? (
                    <>
                      <button
                        onClick={handleSignOut}
                        className="px-4 py-3.5 rounded-lg text-base font-medium text-left text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 transition-all duration-200 flex items-center gap-3 active:scale-[0.98] touch-manipulation min-h-[48px]"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavClick('login')}
                      className="px-4 py-3.5 rounded-lg text-base font-medium text-left text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 active:scale-[0.98] font-semibold shadow-md touch-manipulation min-h-[48px]"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default ResizableNavbar;

