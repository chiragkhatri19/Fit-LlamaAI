import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored === 'dark';
    }
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    
    // Directly manipulate the class without intermediate steps
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Set attributes
    html.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    html.style.colorScheme = isDarkMode ? 'dark' : 'light';
    
    // Store in localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Debug log
    console.log('🎨 Theme:', isDarkMode ? 'dark' : 'light', '| Class present:', html.classList.contains('dark'));
  }, [isDarkMode]);

  // Listen for system theme changes (only if no manual preference is set)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't manually set a preference
      const stored = localStorage.getItem('theme');
      if (!stored) {
        setIsDarkMode(e.matches);
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (dark: boolean) => {
    setIsDarkMode(dark);
  };

  return { isDarkMode, toggleTheme, setTheme };
};

