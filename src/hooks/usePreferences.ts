import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface Preferences {
  theme: Theme;
  reducedMotion: boolean;
}

const STORAGE_KEY = 'user-preferences';

const getInitialPreferences = (): Preferences => {
  if (typeof window === 'undefined') {
    return { theme: 'dark', reducedMotion: false };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid JSON, use defaults
    }
  }
  
  // Check system preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return { theme: 'dark', reducedMotion: prefersReducedMotion };
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(getInitialPreferences);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Apply reduced motion
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [preferences.reducedMotion]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const setTheme = useCallback((theme: Theme) => {
    setPreferences(prev => ({ ...prev, theme }));
  }, []);

  const setReducedMotion = useCallback((reducedMotion: boolean) => {
    setPreferences(prev => ({ ...prev, reducedMotion }));
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferences(prev => ({ 
      ...prev, 
      theme: prev.theme === 'dark' ? 'light' : 'dark' 
    }));
  }, []);

  return {
    theme: preferences.theme,
    reducedMotion: preferences.reducedMotion,
    isDarkMode: preferences.theme === 'dark',
    setTheme,
    setReducedMotion,
    toggleTheme,
  };
}
