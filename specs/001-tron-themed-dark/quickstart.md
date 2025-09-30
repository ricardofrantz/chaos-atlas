# Tron Theme Quick Start Guide

## Overview

This guide demonstrates how to implement and use the Tron-themed dark mode for the CML Visualizer. The theme provides a vintage Tron aesthetic with glowing neon colors while maintaining mathematical visualization clarity and accessibility compliance.

## Prerequisites

- Node.js 18+ installed
- Next.js 14 project setup
- Tailwind CSS configured
- Basic understanding of React components

## Installation

### 1. Add Theme Dependencies

```bash
npm install clsx tailwind-merge
```

### 2. Create Theme Structure

Create the following directory structure in your project:

```
components/
├── themes/
│   ├── theme-provider.tsx
│   ├── theme-switcher.tsx
│   └── neon-button.tsx
lib/
├── themes/
│   ├── tron-colors.ts
│   └── theme-types.ts
styles/
└── themes/
    ├── tron.css
    └── neon-effects.css
```

## Basic Usage

### 1. Set Up Theme Provider

Wrap your application with the ThemeProvider:

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/themes/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="tron-dark" storageKey="cml-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Add Theme Switcher

Include the ThemeSwitcher in your header:

```tsx
// components/header.tsx
import { ThemeSwitcher } from '@/components/themes/theme-switcher';

export function Header() {
  return (
    <header>
      <nav>
        {/* navigation items */}
        <ThemeSwitcher showCustomization compact />
      </nav>
    </header>
  );
}
```

### 3. Use Neon Components

Replace standard buttons with NeonButton:

```tsx
import { NeonButton } from '@/components/themes/neon-button';

export function ControlPanel() {
  return (
    <div>
      <NeonButton variant="primary" onClick={handleStart}>
        Start Visualization
      </NeonButton>
      <NeonButton variant="secondary" onClick={handleReset}>
        Reset Parameters
      </NeonButton>
    </div>
  );
}
```

## Configuration

### Theme Colors

The Tron theme uses these core colors:

```typescript
// lib/themes/tron-colors.ts
export const tronColors = {
  background: '#000000',
  primary: '#00FFFF',    // Cyan
  secondary: '#FF7F00',  // Orange
  tertiary: '#FF00FF',   // Magenta
  warning: '#FFFF00',    // Yellow
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
};
```

### Glow Effects

Customize glow intensity:

```tsx
<NeonButton glowIntensity={0.8}>
  High Intensity Glow
</NeonButton>

<NeonButton glowIntensity={0.3}>
  Subtle Glow
</NeonButton>
```

## Accessibility Features

### High Contrast Mode

The theme automatically detects and respects high contrast preferences:

```css
/* styles/themes/tron.css */
@media (prefers-contrast: high) {
  .tron-theme {
    --glow-intensity: 1.0;
    --border-width: 2px;
  }
}
```

### Reduced Motion

Animations respect user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .neon-glow {
    transition: none;
    animation: none;
  }
}
```

## Testing Your Implementation

### 1. Theme Switching Test

```typescript
// tests/integration/theme-switching.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, ThemeSwitcher } from '@/components/themes';

test('theme switching updates UI correctly', () => {
  render(
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  );

  const themeButton = screen.getByRole('button', { name: /tron/i });
  fireEvent.click(themeButton);

  expect(document.documentElement).toHaveClass('tron-theme');
});
```

### 2. Visual Regression Test

Use a tool like Chromatic or Percy to capture theme variations:

```bash
npm run test:visual
```

### 3. Performance Test

Monitor theme switching performance:

```typescript
// Performance monitoring
const startTime = performance.now();
// Switch theme
const endTime = performance.now();
console.log(`Theme switch took ${endTime - startTime}ms`);
```

## Troubleshooting

### Common Issues

**Theme not applying:**
- Ensure CSS classes are correctly applied to root element
- Check that CSS files are imported in correct order
- Verify Tailwind CSS includes custom theme classes

**Glow effects not working:**
- Check browser compatibility for CSS filters
- Ensure z-index is properly set for overlapping elements
- Verify color contrast meets accessibility requirements

**Performance issues:**
- Reduce glow intensity on mobile devices
- Limit number of animated elements
- Use CSS transforms instead of layout properties

**Accessibility concerns:**
- Test with screen readers for theme announcements
- Verify keyboard navigation works with theme switcher
- Check color contrast ratios with online tools

## Next Steps

1. Implement the theme following this guide
2. Test with your existing visualizations
3. Customize colors and effects as needed
4. Add user preference persistence
5. Monitor performance and optimize as needed

For detailed implementation guidance, see the component contracts in the `/contracts/` directory and the data model specification in `data-model.md`.