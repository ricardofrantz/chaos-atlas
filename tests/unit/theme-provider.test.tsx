import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/components/themes/theme-provider';

// Mock localStorage
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

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('renders children without crashing', () => {
    render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('provides default theme context', () => {
    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return <div>Theme: {context.theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/Theme:/)).toBeInTheDocument();
  });

  it('provides setTheme function', () => {
    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return (
        <div>
          <button onClick={() => context.setTheme('test-theme')}>
            Set Theme
          </button>
          Current: {context.theme}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('Set Theme')).toBeInTheDocument();
  });

  it('saves theme preference to localStorage', async () => {
    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return (
        <div>
          <button onClick={() => context.setTheme('tron-dark')}>
            Set Tron Theme
          </button>
          Current: {context.theme}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Set Tron Theme');
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cml-theme', 'tron-dark');
    });
  });

  it('loads theme from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('tron-dark');

    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return <div>Theme: {context.theme}</div>;
    };

    render(
      <ThemeProvider storageKey="cml-theme">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/Theme:.*tron-dark/)).toBeInTheDocument();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('cml-theme');
  });

  it('respects system theme preference', () => {
    // Mock system theme as dark
    window.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return <div>System: {context.systemTheme}</div>;
    };

    render(
      <ThemeProvider enableSystem>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/System:.*dark/)).toBeInTheDocument();
  });

  it('applies theme class to document element', () => {
    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return (
        <div>
          <button onClick={() => context.setTheme('tron-theme')}>
            Apply Theme
          </button>
          Current: {context.theme}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Apply Theme');
    fireEvent.click(button);

    expect(document.documentElement).toHaveAttribute('data-theme', 'tron-theme');
  });

  it('handles transitions without blocking when disabled', async () => {
    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return (
        <div>
          <button onClick={() => context.setTheme('tron-theme')}>
            Apply Theme
          </button>
          Transitioning: {context.isTransitioning ? 'Yes' : 'No'}
        </div>
      );
    };

    render(
      <ThemeProvider disableTransitionOnChange>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Apply Theme');
    fireEvent.click(button);

    expect(screen.getByText('Transitioning: No')).toBeInTheDocument();
  });

  it('provides resolved theme', () => {
    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return <div>Resolved: {context.resolvedTheme}</div>;
    };

    render(
      <ThemeProvider defaultTheme="tron-dark">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/Resolved:.*tron-dark/)).toBeInTheDocument();
  });

  it('handles invalid theme gracefully', async () => {
    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return (
        <div>
          <button onClick={() => context.setTheme('invalid-theme')}>
            Set Invalid Theme
          </button>
          Current: {context.theme}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Set Invalid Theme');
    fireEvent.click(button);

    // Should not crash and should maintain or fallback to a valid theme
    expect(screen.getByText(/Current:/)).toBeInTheDocument();
  });

  it('removes theme class when switching away', async () => {
    // Start with a theme applied
    document.documentElement.setAttribute('data-theme', 'old-theme');

    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return (
        <div>
          <button onClick={() => context.setTheme('')}>
            Clear Theme
          </button>
          Current: {context.theme}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Clear Theme');
    fireEvent.click(button);

    await waitFor(() => {
      expect(document.documentElement).not.toHaveAttribute('data-theme');
    });
  });

  it('works with custom themes array', () => {
    const customThemes = [
      {
        themeId: 'custom-tron',
        name: 'Custom Tron',
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

    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return <div>Themes count: {context.themes.length}</div>;
    };

    render(
      <ThemeProvider themes={customThemes}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('Themes count: 1')).toBeInTheDocument();
  });

  it('respects reduced motion preference', () => {
    // Mock reduced motion preference
    window.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const TestComponent = () => {
      const context = require('@/components/themes/theme-provider').useTheme();
      return <div>Theme Ready</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('Theme Ready')).toBeInTheDocument();
    // The theme system should respect the reduced motion preference
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});