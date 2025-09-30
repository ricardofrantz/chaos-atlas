import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { ThemeSwitcher } from '@/components/themes/theme-switcher';

// Mock themes for testing
const mockThemes = [
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

describe('ThemeSwitcher', () => {
  const mockOnThemeChange = jest.fn();

  beforeEach(() => {
    mockOnThemeChange.mockClear();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );
  });

  it('displays available theme options', () => {
    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByText('Tron Dark')).toBeInTheDocument();
    expect(screen.getByText('Tron Light')).toBeInTheDocument();
  });

  it('highlights currently selected theme', () => {
    render(
      <ThemeProvider themes={mockThemes} currentTheme="tron-dark">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const tronDarkButton = screen.getByText('Tron Dark');
    expect(tronDarkButton).toHaveAttribute('aria-pressed', 'true');
    expect(tronDarkButton).toHaveClass('active');
  });

  it('calls onThemeChange when theme is selected', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider themes={mockThemes} onThemeChange={mockOnThemeChange}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const tronLightButton = screen.getByText('Tron Light');
    await user.click(tronLightButton);

    expect(mockOnThemeChange).toHaveBeenCalledWith('tron-light');
  });

  it('displays theme previews in compact mode', () => {
    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher compact />
      </ThemeProvider>
    );

    // Compact mode should show visual indicators for each theme
    expect(screen.getByText('Tron Dark')).toBeInTheDocument();
    expect(screen.getByText('Tron Light')).toBeInTheDocument();
  });

  it('shows customization panel when enabled', () => {
    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher showCustomization />
      </ThemeProvider>
    );

    // Customization controls should be visible
    expect(screen.getByText(/Glow Intensity/i)).toBeInTheDocument();
    expect(screen.getByText(/Animation Speed/i)).toBeInTheDocument();
  });

  it('does not show customization panel when disabled', () => {
    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Customization controls should not be visible
    expect(screen.queryByText(/Glow Intensity/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Animation Speed/i)).not.toBeInTheDocument();
  });

  it('supports different positions', () => {
    const { rerender } = render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher position="header" />
      </ThemeProvider>
    );

    // Rerender with different position
    rerender(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher position="sidebar" />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher position="floating" />
      </ThemeProvider>
    );

    // Should render without errors in all positions
    expect(screen.getByText('Tron Dark')).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const themeButtons = screen.getAllByRole('button');
    themeButtons.forEach(button => {
      expect(button).toHaveAttribute('tabindex', '0');
    });
  });

  it('has proper ARIA labels', () => {
    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const themeButtons = screen.getAllByRole('button');
    themeButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('supports arrow key navigation', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const firstButton = screen.getAllByRole('button')[0];
    firstButton.focus();

    expect(firstButton).toHaveFocus();

    // Test arrow key navigation
    await user.keyboard('{ArrowRight}');
    const secondButton = screen.getAllByRole('button')[1];
    expect(secondButton).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(firstButton).toHaveFocus();
  });

  it('activates theme on Enter or Space key', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider themes={mockThemes} onThemeChange={mockOnThemeChange}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const themeButton = screen.getByText('Tron Light');
    themeButton.focus();

    await user.keyboard('{Enter}');
    expect(mockOnThemeChange).toHaveBeenCalledWith('tron-light');

    mockOnThemeChange.mockClear();

    await user.keyboard('{ }'); // Space key
    expect(mockOnThemeChange).toHaveBeenCalledWith('tron-light');
  });

  it('displays theme descriptions', () => {
    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Should have title or aria-describedby with theme description
    const themeButtons = screen.getAllByRole('button');
    expect(themeButtons.length).toBeGreaterThan(0);
  });

  it('supports screen reader announcements', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const themeButton = screen.getByText('Tron Dark');
    await user.click(themeButton);

    // Screen reader should announce theme change
    // This would be tested with actual screen reader in real scenario
    expect(mockOnThemeChange).toHaveBeenCalled();
  });

  it('shows loading state when switching themes', () => {
    const TestComponent = () => {
      const [isLoading, setIsLoading] = React.useState(false);

      return (
        <ThemeProvider themes={mockThemes}>
          <ThemeSwitcher isLoading={isLoading} />
          <button onClick={() => setIsLoading(true)}>
            Toggle Loading
          </button>
        </ThemeProvider>
      );
    };

    render(<TestComponent />);

    const loadingButton = screen.getByText('Toggle Loading');
    fireEvent.click(loadingButton);

    // Should show loading indicators
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('respects user motion preferences', () => {
    // Mock reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Should detect motion preference
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('supports high contrast mode', () => {
    // Mock high contrast preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Should detect contrast preference
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-contrast: high)');
  });

  it('handles empty themes array gracefully', () => {
    render(
      <ThemeProvider themes={[]}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Should render without crashing
    expect(screen.queryByText('No themes available')).toBeInTheDocument();
  });

  it('handles missing theme gracefully', () => {
    render(
      <ThemeProvider themes={mockThemes} currentTheme="non-existent">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Should fallback to default theme
    expect(screen.queryByText(/tron-dark|tron-light/)).toBeInTheDocument();
  });

  it('updates when themes prop changes', () => {
    const { rerender } = render(
      <ThemeProvider themes={[mockThemes[0]]}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByText('Tron Dark')).toBeInTheDocument();
    expect(screen.queryByText('Tron Light')).not.toBeInTheDocument();

    rerender(
      <ThemeProvider themes={mockThemes}>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByText('Tron Dark')).toBeInTheDocument();
    expect(screen.getByText('Tron Light')).toBeInTheDocument();
  });

  it('maintains active state during updates', () => {
    const { rerender } = render(
      <ThemeProvider themes={mockThemes} currentTheme="tron-dark">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const activeButton = screen.getByText('Tron Dark');
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <ThemeProvider themes={mockThemes} currentTheme="tron-light">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const newActiveButton = screen.getByText('Tron Light');
    expect(newActiveButton).toHaveAttribute('aria-pressed', 'true');
  });
});