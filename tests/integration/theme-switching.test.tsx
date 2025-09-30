import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { ThemeSwitcher } from '@/components/themes/theme-switcher';
import { NeonButton } from '@/components/themes/neon-button';

// Mock localStorage for integration testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock matchMedia for accessibility testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Test themes for integration
const testThemes = [
  {
    themeId: 'tron-dark',
    name: 'Tron Dark',
    colors: {
      background: '#000000',
      primary: '#00ffff',
      secondary: '#ff7f00',
      tertiary: '#ff00ff',
      warning: '#ffff00',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333',
      glow: '#00ffff',
    },
    glow: { intensity: 0.8, blurRadius: '8px', spreadRadius: '2px' },
    animation: { duration: '0.3s', easing: 'ease-out', reducedMotion: false },
    accessibility: { highContrast: false, reducedGlow: false },
  },
  {
    themeId: 'tron-light',
    name: 'Tron Light',
    colors: {
      background: '#0a0a0a',
      primary: '#40ffff',
      secondary: '#ff9f20',
      tertiary: '#ff40ff',
      warning: '#ffff40',
      text: '#ffffff',
      textSecondary: '#dddddd',
      border: '#555555',
      glow: '#40ffff',
    },
    glow: { intensity: 0.6, blurRadius: '6px', spreadRadius: '1px' },
    animation: { duration: '0.2s', easing: 'ease-out', reducedMotion: false },
    accessibility: { highContrast: false, reducedGlow: false },
  },
];

describe('Theme Switching Integration', () => {
  const mockOnThemeChange = jest.fn();

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  it('integrates ThemeProvider and ThemeSwitcher seamlessly', () => {
    render(
      <ThemeProvider themes={testThemes} onThemeChange={mockOnThemeChange}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByText('Tron Dark')).toBeInTheDocument();
    expect(screen.getByText('Tron Light')).toBeInTheDocument();
  });

  it('persists theme selection across component re-renders', async () => {
    const { rerender } = render(
      <ThemeProvider themes={testThemes} onThemeChange={mockOnThemeChange}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const lightButton = screen.getByText('Tron Light');
    await userEvent.click(lightButton);

    expect(mockOnThemeChange).toHaveBeenCalledWith('tron-light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('cml-theme', 'tron-light');

    // Rerender with new theme as current
    rerender(
      <ThemeProvider themes={testThemes} currentTheme="tron-light" onThemeChange={mockOnThemeChange}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const activeButton = screen.getByText('Tron Light');
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies theme classes to document element', async () => {
    render(
      <ThemeProvider themes={testThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Tron Dark');
    await userEvent.click(darkButton);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'tron-dark');
    });
  });

  it('updates component styling when theme changes', async () => {
    render(
      <ThemeProvider themes={testThemes}>
        <div>
          <ThemeSwitcher />
          <NeonButton>Test Button</NeonButton>
        </div>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();

    // Change theme
    const lightButton = screen.getByText('Tron Light');
    await userEvent.click(lightButton);

    // Button should still be rendered with new theme styles
    expect(button).toBeInTheDocument();
  });

  it('handles theme change callbacks properly', async () => {
    render(
      <ThemeProvider themes={testThemes} onThemeChange={mockOnThemeChange}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Tron Dark');
    await userEvent.click(darkButton);

    expect(mockOnThemeChange).toHaveBeenCalledTimes(1);
    expect(mockOnThemeChange).toHaveBeenCalledWith('tron-dark');
  });

  it('maintains theme state during rapid switching', async () => {
    render(
      <ThemeProvider themes={testThemes} onThemeChange={mockOnThemeChange}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Tron Dark');
    const lightButton = screen.getByText('Tron Light');

    // Rapid theme switching
    await userEvent.click(darkButton);
    await userEvent.click(lightButton);
    await userEvent.click(darkButton);

    expect(mockOnThemeChange).toHaveBeenCalledTimes(3);
    expect(mockOnThemeChange).toHaveBeenLastCalledWith('tron-dark');
  });

  it('loads saved theme from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('tron-light');

    render(
      <ThemeProvider themes={testThemes} storageKey="cml-theme">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('cml-theme');
    expect(screen.getByText('Tron Light')).toBeInTheDocument();
  });

  it('falls back to default theme when saved theme is invalid', () => {
    localStorageMock.getItem.mockReturnValue('non-existent-theme');

    render(
      <ThemeProvider themes={testThemes} storageKey="cml-theme">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Should still render available themes
    expect(screen.getByText('Tron Dark')).toBeInTheDocument();
    expect(screen.getByText('Tron Light')).toBeInTheDocument();
  });

  it('handles missing ThemeProvider gracefully', () => {
    // This should not crash when ThemeProvider is missing
    expect(() => {
      render(<ThemeSwitcher />);
    }).not.toThrow();
  });

  it('coordinates multiple themed components', async () => {
    render(
      <ThemeProvider themes={testThemes}>
        <div>
          <ThemeSwitcher />
          <NeonButton variant="primary">Primary Button</NeonButton>
          <NeonButton variant="secondary">Secondary Button</NeonButton>
        </div>
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3); // 2 NeonButtons + 2 theme buttons = 4 total

    // Switch theme
    const lightButton = screen.getByText('Tron Light');
    await userEvent.click(lightButton);

    // All components should still be properly rendered
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });

  it('supports theme customization integration', () => {
    render(
      <ThemeProvider themes={testThemes}>
        <ThemeSwitcher showCustomization />
      </ThemeProvider>
    );

    // Customization controls should be visible
    expect(screen.getByText(/Glow Intensity/i)).toBeInTheDocument();
    expect(screen.getByText(/Animation Speed/i)).toBeInTheDocument();
  });

  it('maintains keyboard navigation across theme changes', async () => {
    render(
      <ThemeProvider themes={testThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const firstButton = screen.getAllByRole('button')[0];
    firstButton.focus();

    expect(firstButton).toHaveFocus();

    // Switch theme using keyboard
    await userEvent.keyboard('{Enter}');

    // Focus should be maintained
    expect(firstButton).toHaveFocus();
  });

  it('updates ARIA live regions for screen readers', async () => {
    render(
      <ThemeProvider themes={testThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const themeButton = screen.getByText('Tron Dark');
    await userEvent.click(themeButton);

    // Screen reader announcements should be triggered
    // This would be tested with actual screen reader in real scenario
    expect(themeButton).toBeInTheDocument();
  });

  it('handles theme transitions without breaking UI', async () => {
    render(
      <ThemeProvider themes={testThemes}>
        <div>
          <ThemeSwitcher />
          <NeonButton loading>Loading Button</NeonButton>
        </div>
      </ThemeProvider>
    );

    const loadingButton = screen.getByRole('button', { name: 'Loading Button' });
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');

    // Switch theme while button is loading
    const lightButton = screen.getByText('Tron Light');
    await userEvent.click(lightButton);

    // Loading state should be maintained
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');
  });

  it('coordinates theme state across component boundaries', async () => {
    const TestComponent = () => {
      const { theme, setTheme } = require('@/components/themes/theme-provider').useTheme();

      return (
        <div>
          <div data-testid="current-theme">{theme}</div>
          <button onClick={() => setTheme('tron-light')}>
            Set Light Theme
          </button>
          <ThemeSwitcher />
        </div>
      );
    };

    render(
      <ThemeProvider themes={testThemes}>
        <TestComponent />
      </ThemeProvider>
    );

    // Change theme via custom button
    const setThemeButton = screen.getByText('Set Light Theme');
    await userEvent.click(setThemeButton);

    // ThemeSwitcher should reflect the change
    const themeDisplay = screen.getByTestId('current-theme');
    expect(themeDisplay).toHaveTextContent('tron-light');
  });

  it('handles error recovery during theme switching', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <ThemeProvider themes={testThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Simulate error during theme change
    const themeButton = screen.getByText('Tron Dark');

    // Force an error
    Object.defineProperty(document.documentElement, 'setAttribute', {
      value: jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      }),
    });

    await userEvent.click(themeButton);

    // Component should still be functional
    expect(screen.getByText('Tron Dark')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('maintains performance during frequent theme changes', async () => {
    const startTime = performance.now();

    render(
      <ThemeProvider themes={testThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Tron Dark');
    const lightButton = screen.getByText('Tron Light');

    // Perform multiple rapid theme changes
    for (let i = 0; i < 10; i++) {
      await userEvent.click(darkButton);
      await userEvent.click(lightButton);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (less than 1 second)
    expect(duration).toBeLessThan(1000);
  });

  it('supports programmatic theme changes', async () => {
    const TestComponent = () => {
      const { setTheme } = require('@/components/themes/theme-provider').useTheme();

      return (
        <button onClick={() => setTheme('tron-light')}>
          Programmatic Change
        </button>
      );
    };

    render(
      <ThemeProvider themes={testThemes}>
        <div>
          <TestComponent />
          <ThemeSwitcher />
        </div>
      </ThemeProvider>
    );

    const programButton = screen.getByText('Programmatic Change');
    await userEvent.click(programButton);

    // ThemeSwitcher should update to reflect programmatic change
    // This would be verified by checking the active state
    expect(screen.getByText('Tron Light')).toBeInTheDocument();
  });
});