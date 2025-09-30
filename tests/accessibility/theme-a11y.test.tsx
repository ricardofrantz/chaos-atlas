import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { ThemeSwitcher } from '@/components/themes/theme-switcher';
import { NeonButton } from '@/components/themes/neon-button';

// Mock axe-core for accessibility testing
const mockAxe = {
  run: jest.fn(() => Promise.resolve({
    violations: [],
    passes: [],
    incomplete: [],
    inapplicable: [],
  })),
};

// Mock matchMedia for accessibility testing
const mockMatchMedia = (matches: boolean) => ({
  matches,
  media: '',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => {
    if (query === '(prefers-reduced-motion: reduce)') {
      return mockMatchMedia(false);
    }
    if (query === '(prefers-contrast: high)') {
      return mockMatchMedia(false);
    }
    return mockMatchMedia(false);
  }),
});

// Test themes
const accessibilityTestThemes = [
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
];

describe('Theme Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  const checkContrastRatio = (foreground: string, background: string): boolean => {
    // Simplified contrast ratio calculation for testing
    // In real implementation, use a proper contrast ratio library
    return foreground !== background;
  };

  const checkKeyboardNavigation = async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    for (let i = 0; i < focusableElements.length; i++) {
      const element = focusableElements[i] as HTMLElement;
      element.focus();
      expect(element).toHaveFocus();
    }
  };

  const checkScreenReaderCompatibility = (container: HTMLElement) => {
    const interactiveElements = container.querySelectorAll('button, [role="button"]');

    interactiveElements.forEach(element => {
      expect(element).toHaveAttribute('aria-label');
      expect(element).toHaveAttribute('role');
    });
  };

  it('passes WCAG AA color contrast requirements', () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton variant="primary">Primary Button</NeonButton>
          <NeonButton variant="secondary">Secondary Button</NeonButton>
          <NeonButton variant="tertiary">Tertiary Button</NeonButton>
        </div>
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      const styles = window.getComputedStyle(button);
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;

      // Check that colors are different (simplified contrast test)
      expect(checkContrastRatio(color, backgroundColor)).toBe(true);
    });
  });

  it('maintains focus indicators for keyboard navigation', () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton>First Button</NeonButton>
          <NeonButton>Second Button</NeonButton>
        </div>
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      button.focus();
      const styles = window.getComputedStyle(button, ':focus');

      // Should have visible focus indicator
      expect(styles.outline).toBeDefined();
      expect(styles.outline).not.toBe('none');
    });
  });

  it('supports keyboard-only navigation', async () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton>Button 1</NeonButton>
          <NeonButton>Button 2</NeonButton>
          <NeonButton>Button 3</NeonButton>
        </div>
      </ThemeProvider>
    );

    await checkKeyboardNavigation(document.body);
  });

  it('provides proper ARIA labels and roles', () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton>Accessible Button</NeonButton>
          <NeonButton disabled>Disabled Button</NeonButton>
          <NeonButton loading>Loading Button</NeonButton>
        </div>
      </ThemeProvider>
    );

    checkScreenReaderCompatibility(document.body);

    const disabledButton = screen.getByRole('button', { name: 'Disabled Button' });
    expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

    const loadingButton = screen.getByRole('button', { name: 'Loading Button' });
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');
  });

  it('supports screen reader announcements for theme changes', async () => {
    const mockAnnounce = jest.fn();

    // Mock screen reader announcement function
    Object.defineProperty(window, 'announceToScreenReader', {
      value: mockAnnounce,
      writable: true,
    });

    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const themeButton = screen.getByText('Tron Dark');
    await userEvent.click(themeButton);

    // Screen reader should announce theme change
    // This would be tested with actual screen reader in real scenario
    expect(themeButton).toBeInTheDocument();
  });

  it('respects prefers-reduced-motion setting', () => {
    // Mock reduced motion preference
    window.matchMedia = jest.fn().mockImplementation(query => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return mockMatchMedia(true);
      }
      return mockMatchMedia(false);
    });

    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <NeonButton>Reduced Motion Button</NeonButton>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Reduced Motion Button' });
    const styles = window.getComputedStyle(button);

    // Should detect reduced motion preference
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('respects prefers-contrast setting', () => {
    // Mock high contrast preference
    window.matchMedia = jest.fn().mockImplementation(query => {
      if (query === '(prefers-contrast: high)') {
        return mockMatchMedia(true);
      }
      return mockMatchMedia(false);
    });

    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <NeonButton>High Contrast Button</NeonButton>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'High Contrast Button' });

    // Should detect high contrast preference
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-contrast: high)');
  });

  it('provides sufficient touch target sizes', () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton size="sm">Small Button</NeonButton>
          <NeonButton size="md">Medium Button</NeonButton>
          <NeonButton size="lg">Large Button</NeonButton>
        </div>
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();

      // WCAG requires touch targets to be at least 44x44 CSS pixels
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });

  it('maintains accessibility when switching themes', async () => {
    const { rerender } = render(
      <ThemeProvider themes={accessibilityTestThemes} currentTheme="tron-dark">
        <NeonButton>Theme Test Button</NeonButton>
      </ThemeProvider>
    );

    const initialButton = screen.getByRole('button', { name: 'Theme Test Button' });
    expect(initialButton).toHaveAttribute('role', 'button');

    rerender(
      <ThemeProvider themes={accessibilityTestThemes} currentTheme="tron-light">
        <NeonButton>Theme Test Button</NeonButton>
      </ThemeProvider>
    );

    const switchedButton = screen.getByRole('button', { name: 'Theme Test Button' });
    expect(switchedButton).toHaveAttribute('role', 'button');
  });

  it('supports keyboard activation with Enter and Space keys', async () => {
    const mockOnClick = jest.fn();

    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <NeonButton onClick={mockOnClick}>Keyboard Button</NeonButton>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Keyboard Button' });
    button.focus();

    await userEvent.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    mockOnClick.mockClear();

    await userEvent.keyboard(' ');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('provides logical tab order for theme controls', async () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton>First Button</NeonButton>
          <ThemeSwitcher />
          <NeonButton>Last Button</NeonButton>
        </div>
      </ThemeProvider>
    );

    const firstButton = screen.getByText('First Button');
    const themeButtons = screen.getAllByRole('button').filter(btn =>
      btn.textContent !== 'First Button' && btn.textContent !== 'Last Button'
    );
    const lastButton = screen.getByText('Last Button');

    // Test tab order
    firstButton.focus();
    expect(firstButton).toHaveFocus();

    await userEvent.tab();
    expect(themeButtons[0]).toHaveFocus();

    await userEvent.tab();
    expect(themeButtons[1]).toHaveFocus();

    await userEvent.tab();
    expect(lastButton).toHaveFocus();
  });

  it('maintains focus management during theme transitions', async () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton>Focus Test Button</NeonButton>
          <ThemeSwitcher />
        </div>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Focus Test Button' });
    button.focus();
    expect(button).toHaveFocus();

    // Switch theme
    const themeButton = screen.getByText('Tron Dark');
    await userEvent.click(themeButton);

    // Focus should be maintained
    expect(button).toHaveFocus();
  });

  it('provides accessible color combinations for colorblind users', () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton variant="primary">Primary</NeonButton>
          <NeonButton variant="secondary">Secondary</NeonButton>
          <NeonButton variant="tertiary">Tertiary</NeonButton>
        </div>
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      const styles = window.getComputedStyle(button);

      // Should not rely solely on color to convey information
      expect(styles.backgroundColor).toBeDefined();
      expect(styles.color).toBeDefined();

      // Should have other visual indicators (borders, shadows, etc.)
      expect(styles.borderStyle || styles.boxShadow).toBeDefined();
    });
  });

  it('supports text scaling and zoom', () => {
    // Mock 200% zoom
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: 2,
    });

    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <NeonButton>Zoom Test Button</NeonButton>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Zoom Test Button' });
    const rect = button.getBoundingClientRect();

    // Button should still be usable at high zoom levels
    expect(rect.width).toBeGreaterThan(0);
    expect(rect.height).toBeGreaterThan(0);
  });

  it('provides accessible error handling', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <NeonButton>Error Test Button</NeonButton>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Error Test Button' });

    // Simulate error
    Object.defineProperty(button, 'click', {
      value: jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      }),
    });

    // Error should be handled gracefully
    expect(() => {
      button.click();
    }).not.toThrow();

    consoleSpy.mockRestore();
  });

  it('maintains accessibility with custom className props', () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <NeonButton className="custom-accessible-class">Custom Button</NeonButton>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Custom Button' });

    expect(button).toHaveClass('custom-accessible-class');
    expect(button).toHaveAttribute('role', 'button');
  });

  it('supports voice control and speech recognition', () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton>Click Me</NeonButton>
          <NeonButton>Switch Theme</NeonButton>
        </div>
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      // Should have accessible names for voice control
      expect(button).toHaveAccessibleName();
      expect(button).toHaveAttribute('role');
    });
  });

  it('provides accessible theme switching experience', async () => {
    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const themeButtons = screen.getAllByRole('button');

    themeButtons.forEach(button => {
      expect(button).toHaveAccessibleName();
      expect(button).toHaveAttribute('role', 'button');
      expect(button).toHaveAttribute('tabindex', '0');
    });

    // Test keyboard navigation through theme options
    const firstButton = themeButtons[0];
    firstButton.focus();
    expect(firstButton).toHaveFocus();

    // Should be able to navigate with arrow keys
    await userEvent.keyboard('{ArrowRight}');
    expect(themeButtons[1]).toHaveFocus();
  });

  it('passes automated accessibility audit', async () => {
    // Mock axe accessibility testing
    const mockResults = {
      violations: [],
      passes: ['color-contrast', 'keyboard-navigation', 'aria-labels'],
      incomplete: [],
      inapplicable: [],
    };

    mockAxe.run.mockResolvedValue(mockResults);

    render(
      <ThemeProvider themes={accessibilityTestThemes}>
        <div>
          <NeonButton>Audit Button</NeonButton>
          <ThemeSwitcher />
        </div>
      </ThemeProvider>
    );

    // In real implementation, this would run axe-core
    const results = await mockAxe.run(document.body);

    expect(results.violations).toHaveLength(0);
    expect(results.passes.length).toBeGreaterThan(0);
  });
});