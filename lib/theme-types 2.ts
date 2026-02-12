// src/themes/theme-types.ts
export type ThemeColors = {
  name: string;
  id: string;
  background: {
    primary: string;
    secondary: string;
    card: string;
    header: string;
    footer: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  visualization: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    grid: string;
    point: string;
    line: string;
    area: string;
  };
  button: {
    primary: {
      background: string;
      hover: string;
      text: string;
    };
    secondary: {
      background: string;
      hover: string;
      text: string;
    };
    outline: {
      border: string;
      hover: string;
      text: string;
    };
  };
};

export type ThemeContext = {
  currentTheme: ThemeColors;
  setTheme: (themeId: string) => void;
  availableThemes: ThemeColors[];
};
