// Theme system types for Tron-themed dark mode

export interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  tertiary: string;
  warning: string;
  text: string;
  textSecondary: string;
  border: string;
  glow: string;
}

export interface GlowSettings {
  intensity: number;
  blurRadius: string;
  spreadRadius: string;
}

export interface AnimationSettings {
  duration: string;
  easing: string;
  reducedMotion: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedGlow: boolean;
}

export interface ThemeConfiguration {
  themeId: string;
  name: string;
  colors: ThemeColors;
  glow: GlowSettings;
  animation: AnimationSettings;
  accessibility: AccessibilitySettings;
}

export interface UserPreferences {
  userId: string;
  selectedTheme: string;
  customSettings: {
    glowIntensity?: number;
    animationSpeed?: number;
    colorScheme?: string;
  };
  accessibilityPreferences: {
    prefersReducedMotion: boolean;
    prefersHighContrast: boolean;
    lightSensitivity: boolean;
  };
  lastUpdated: number;
}

export interface VisualizationColorMapping {
  visualizationType: 'logistic' | 'henon' | 'standard' | 'cml';
  dataMappings: Array<{
    dataType: string;
    colorScale: string[];
    valueRange: {
      min: number;
      max: number;
    };
  }>;
  neonEffects: {
    glowEnabled: boolean;
    trailEnabled: boolean;
    pulseEnabled: boolean;
  };
  performanceSettings: {
    maxDataPoints: number;
    reducedEffectsThreshold: number;
  };
}

export interface InteractiveElementStates {
  elementType: string;
  states: {
    default: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      glowIntensity: number;
    };
    hover: {
      backgroundColor: string;
      textColor: string;
      glowIntensity: number;
      transitionDuration: string;
    };
    focus: {
      backgroundColor: string;
      textColor: string;
      glowIntensity: number;
      outlineStyle: string;
    };
    active: {
      backgroundColor: string;
      textColor: string;
      transform: string;
      glowIntensity: number;
    };
  };
  animations: {
    entrance?: string;
    exit?: string;
    interaction?: string;
  };
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  systemTheme?: string;
  themes: ThemeConfiguration[];
  resolvedTheme: string;
  isTransitioning: boolean;
}

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

export type ThemeSwitcherProps = {
  themes?: ThemeConfiguration[];
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  showCustomization?: boolean;
  compact?: boolean;
  position?: 'header' | 'sidebar' | 'floating';
};

export type NeonButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  glowIntensity?: number;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
};