'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ThemeProviderProps, ThemeContextType, ThemeConfiguration } from '@/lib/themes/theme-types';
import {
  defaultThemes,
  sanitizeThemes,
  getSystemTheme,
  watchSystemTheme,
  getReducedMotionPreference,
  getHighContrastPreference,
  applyThemeCSSProperties,
  removeThemeCSSProperties,
  safeStorageGet,
  safeStorageSet,
  debounce,
  createSafeThemeWrapper
} from '@/lib/themes/theme-utils';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({
  children,
  themes: providedThemes,
  defaultTheme = 'tron-dark',
  storageKey = 'cml-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
  currentTheme: controlledTheme,
  onThemeChange,
  isLoading = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>(() => {
    // Initialize with default or controlled theme
    if (controlledTheme) {
      return controlledTheme;
    }

    // Try to load from localStorage
    const savedTheme = safeStorageGet(storageKey);
    if (savedTheme) {
      return savedTheme;
    }

    // Fallback to system preference if enabled
    if (enableSystem) {
      return getSystemTheme();
    }

    return defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<'dark' | 'light' | undefined>(
    enableSystem ? getSystemTheme() : undefined
  );

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sanitize and validate themes
  const themes = useMemo(() => {
    return sanitizeThemes(providedThemes || defaultThemes);
  }, [providedThemes]);

  // Find current theme configuration
  const currentThemeConfig = useMemo(() => {
    return themes.find(t => t.themeId === theme) || themes[0];
  }, [themes, theme]);

  // Resolved theme (actual theme that gets applied)
  const resolvedTheme = useMemo(() => {
    if (controlledTheme) {
      return controlledTheme;
    }
    return theme;
  }, [theme, controlledTheme]);

  // Safe theme application with error handling
  const applyTheme = createSafeThemeWrapper((newTheme: string, themeConfig: ThemeConfiguration) => {
    if (!disableTransitionOnChange) {
      setIsTransitioning(true);

      // Add transition style temporarily
      const style = document.createElement('style');
      style.innerHTML = `
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
      `;
      document.head.appendChild(style);

      // Remove transition styles after animation
      setTimeout(() => {
        style.remove();
        setIsTransitioning(false);
      }, 300);
    }

    // Apply theme CSS properties
    applyThemeCSSProperties(themeConfig);

    // Update accessibility preferences
    if (themeConfig.accessibility.highContrast || getHighContrastPreference()) {
      document.documentElement.style.setProperty('--tron-high-contrast', 'high');
    }

    if (themeConfig.accessibility.reducedGlow || getReducedMotionPreference()) {
      document.documentElement.style.setProperty('--tron-reduced-glow', 'true');
      document.documentElement.style.setProperty('--tron-reduced-motion', 'reduce');
    }
  }, undefined);

  // Theme change handler
  const setTheme = useCallback((newTheme: string) => {
    if (newTheme === theme) return;

    const themeConfig = themes.find(t => t.themeId === newTheme) || themes[0];

    // Apply theme
    applyTheme(newTheme, themeConfig);

    // Update state
    setThemeState(newTheme);

    // Save to localStorage
    safeStorageSet(storageKey, newTheme);

    // Call external callback
    if (onThemeChange) {
      try {
        onThemeChange(newTheme);
      } catch (error) {
        console.error('Error in onThemeChange callback:', error);
      }
    }
  }, [theme, themes, storageKey, onThemeChange, applyTheme]);

  // Debounced theme sync
  const syncTheme = useCallback(
    debounce((newTheme: string) => {
      setTheme(newTheme);
    }, 100),
    [setTheme]
  );

  // Handle controlled theme changes
  useEffect(() => {
    if (controlledTheme && controlledTheme !== theme) {
      syncTheme(controlledTheme);
    }
  }, [controlledTheme, theme, syncTheme]);

  // System theme detection
  useEffect(() => {
    if (!enableSystem) return;

    const updateSystemTheme = () => {
      const newSystemTheme = getSystemTheme();
      setSystemTheme(newSystemTheme);

      // Only auto-switch if user hasn't manually selected a theme
      const hasUserPreference = safeStorageGet(storageKey);
      if (!hasUserPreference && !controlledTheme) {
        setTheme(newSystemTheme);
      }
    };

    // Watch for system theme changes
    const unwatch = watchSystemTheme(updateSystemTheme);

    // Initial setup
    updateSystemTheme();

    return unwatch;
  }, [enableSystem, storageKey, controlledTheme, setTheme]);

  // Apply initial theme
  useEffect(() => {
    const themeConfig = themes.find(t => t.themeId === resolvedTheme) || themes[0];
    applyTheme(resolvedTheme, themeConfig);

    return () => {
      // Cleanup on unmount
      if (!disableTransitionOnChange) {
        removeThemeCSSProperties();
      }
    };
  }, [resolvedTheme, themes, applyTheme, disableTransitionOnChange]);

  // Handle accessibility preference changes
  useEffect(() => {
    const handleAccessibilityChange = () => {
      if (currentThemeConfig) {
        applyTheme(resolvedTheme, currentThemeConfig);
      }
    };

    // Listen for accessibility preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastMediaQuery = window.matchMedia('(prefers-contrast: high)');

    motionMediaQuery.addEventListener('change', handleAccessibilityChange);
    contrastMediaQuery.addEventListener('change', handleAccessibilityChange);

    return () => {
      motionMediaQuery.removeEventListener('change', handleAccessibilityChange);
      contrastMediaQuery.removeEventListener('change', handleAccessibilityChange);
    };
  }, [currentThemeConfig, resolvedTheme, applyTheme]);

  // Context value with memoization
  const contextValue = useMemo((): ThemeContextType => ({
    theme: resolvedTheme,
    setTheme,
    systemTheme,
    themes,
    resolvedTheme,
    isTransitioning: isTransitioning || isLoading,
  }), [
    resolvedTheme,
    setTheme,
    systemTheme,
    themes,
    resolvedTheme,
    isTransitioning,
    isLoading,
  ]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Export a default provider for convenience
export const DefaultThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};