import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ThemeConfiguration, ThemeColors } from './theme-types';

// Utility function for combining CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default themes - Simple 3 theme system
export const defaultThemes: ThemeConfiguration[] = [
  {
    themeId: 'black-white',
    name: 'Black & White',
    colors: {
      background: '#000000',
      primary: '#ffffff',
      secondary: '#cccccc',
      tertiary: '#999999',
      warning: '#ff4444',
      text: '#ffffff',
      textSecondary: '#dddddd',
      border: '#333333',
      glow: '#ffffff',
    },
    glow: { intensity: 0, blurRadius: '0px', spreadRadius: '0px' },
    animation: { duration: '0.2s', easing: 'ease-out', reducedMotion: false },
    accessibility: { highContrast: true, reducedGlow: true },
  },
  {
    themeId: 'neon-vintage',
    name: 'Neon Vintage',
    colors: {
      background: '#0a0a0a',
      primary: '#ff00ff',
      secondary: '#00ff00',
      tertiary: '#ffff00',
      warning: '#ff0000',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333',
      glow: '#ff00ff',
    },
    glow: { intensity: 0.9, blurRadius: '12px', spreadRadius: '3px' },
    animation: { duration: '0.4s', easing: 'ease-in-out', reducedMotion: false },
    accessibility: { highContrast: false, reducedGlow: false },
  },
  {
    themeId: 'blue-tron',
    name: 'Blue Tron',
    colors: {
      background: '#000000',
      primary: '#00ffff',
      secondary: '#0080ff',
      tertiary: '#0040ff',
      warning: '#ffaa00',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#0066cc',
      glow: '#00ffff',
    },
    glow: { intensity: 0.8, blurRadius: '8px', spreadRadius: '2px' },
    animation: { duration: '0.3s', easing: 'ease-out', reducedMotion: false },
    accessibility: { highContrast: false, reducedGlow: false },
  },
];

// Color validation utilities
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

export function isValidThemeColors(colors: Partial<ThemeColors>): colors is ThemeColors {
  const requiredColors: (keyof ThemeColors)[] = [
    'background', 'primary', 'secondary', 'tertiary', 'warning',
    'text', 'textSecondary', 'border', 'glow'
  ];

  return requiredColors.every(colorKey => {
    const color = colors[colorKey];
    return color && isValidHexColor(color);
  });
}

export function sanitizeTheme(theme: Partial<ThemeConfiguration>): ThemeConfiguration | null {
  try {
    // Validate required fields
    if (!theme.themeId || !theme.name) {
      console.warn('Theme missing required fields: themeId or name');
      return null;
    }

    // Validate colors
    if (!isValidThemeColors(theme.colors || {})) {
      console.warn(`Theme "${theme.name}" has invalid colors`);
      return null;
    }

    // Merge with defaults
    const sanitizedTheme: ThemeConfiguration = {
      themeId: theme.themeId,
      name: theme.name,
      colors: theme.colors!,
      glow: {
        intensity: 0.8,
        blurRadius: '8px',
        spreadRadius: '2px',
        ...theme.glow,
      },
      animation: {
        duration: '0.3s',
        easing: 'ease-out',
        reducedMotion: false,
        ...theme.animation,
      },
      accessibility: {
        highContrast: false,
        reducedGlow: false,
        ...theme.accessibility,
      },
    };

    return sanitizedTheme;
  } catch (error) {
    console.error(`Error sanitizing theme "${theme.name}":`, error);
    return null;
  }
}

export function sanitizeThemes(themes: Partial<ThemeConfiguration>[]): ThemeConfiguration[] {
  if (!Array.isArray(themes)) {
    console.warn('Themes must be an array');
    return defaultThemes;
  }

  const sanitized = themes
    .map(sanitizeTheme)
    .filter((theme): theme is ThemeConfiguration => theme !== null);

  if (sanitized.length === 0) {
    console.warn('No valid themes provided, falling back to defaults');
    return defaultThemes;
  }

  return sanitized;
}

// Theme color utilities
export function getThemeColor(theme: ThemeConfiguration, colorKey: keyof ThemeColors): string {
  return theme.colors[colorKey] || defaultThemes[0].colors[colorKey];
}

export function createGlowEffect(color: string, intensity: number, blurRadius: string, spreadRadius: string): string {
  return `0 0 ${blurRadius} ${spreadRadius} ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`;
}

export function getThemeGlow(theme: ThemeConfiguration, colorKey: keyof ThemeColors = 'primary'): string {
  const color = getThemeColor(theme, colorKey);
  return createGlowEffect(
    color,
    theme.glow.intensity,
    theme.glow.blurRadius,
    theme.glow.spreadRadius
  );
}

// Contrast ratio calculation for accessibility
export function getLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  const rgb = {
    r: parseInt(hex.substr(0, 2), 16) / 255,
    g: parseInt(hex.substr(2, 2), 16) / 255,
    b: parseInt(hex.substr(4, 2), 16) / 255,
  };

  const { r, g, b } = rgb;
  const luminance = 0.2126 * (r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)) +
                     0.7152 * (g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)) +
                     0.0722 * (b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4));

  return luminance;
}

export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function meetsWCAGAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

export function meetsWCAGAAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 7;
}

// System theme detection
export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function watchSystemTheme(callback: (theme: 'dark' | 'light') => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}

// Accessibility utilities
export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getHighContrastPreference(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-contrast: high)').matches;
}

// CSS custom property utilities
export function applyThemeCSSProperties(theme: ThemeConfiguration, element: HTMLElement = document.documentElement): void {
  if (!element || !theme) return;

  try {
    element.setAttribute('data-theme', theme.themeId);

    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      element.style.setProperty(`--tron-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });

    // Apply glow variables
    element.style.setProperty('--tron-glow-intensity', theme.glow.intensity.toString());
    element.style.setProperty('--tron-glow-blur-radius', theme.glow.blurRadius);
    element.style.setProperty('--tron-glow-spread-radius', theme.glow.spreadRadius);

    // Apply animation variables
    element.style.setProperty('--tron-animation-duration', theme.animation.duration);
    element.style.setProperty('--tron-animation-easing', theme.animation.easing);
    element.style.setProperty('--tron-reduced-motion', theme.animation.reducedMotion ? 'reduce' : 'no-preference');

    // Apply accessibility variables
    element.style.setProperty('--tron-high-contrast', theme.accessibility.highContrast ? 'high' : 'normal');
    element.style.setProperty('--tron-reduced-glow', theme.accessibility.reducedGlow ? 'true' : 'false');
  } catch (error) {
    console.error('Error applying theme CSS properties:', error);
  }
}

export function removeThemeCSSProperties(element: HTMLElement = document.documentElement): void {
  if (!element) return;

  try {
    element.removeAttribute('data-theme');

    // Remove only our custom properties
    const computedStyle = window.getComputedStyle(element);
    Array.from(computedStyle).forEach(property => {
      if (property.startsWith('--tron-')) {
        element.style.removeProperty(property);
      }
    });
  } catch (error) {
    console.error('Error removing theme CSS properties:', error);
  }
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Error boundary utilities
export function createSafeThemeWrapper<T extends (...args: any[]) => any>(
  fn: T,
  fallback: ReturnType<T>
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      const result = fn(...args);
      return result ?? fallback;
    } catch (error) {
      console.error('Theme utility error:', error);
      return fallback;
    }
  };
}

// LocalStorage utilities with error handling
export function safeStorageGet(key: string, fallback: string = ''): string {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }

    const value = window.localStorage.getItem(key);
    return value ?? fallback;
  } catch (error) {
    console.warn('Error reading from localStorage:', error);
    return fallback;
  }
}

export function safeStorageSet(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('Error writing to localStorage:', error);
    return false;
  }
}

export function safeStorageRemove(key: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Error removing from localStorage:', error);
    return false;
  }
}