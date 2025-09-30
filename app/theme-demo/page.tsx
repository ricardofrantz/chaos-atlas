'use client';

import React, { useState } from 'react';
import {
  ThemeProvider,
  ThemeSwitcher,
  NeonButton,
  useTheme,
  defaultThemes
} from '@/components/themes';

function ThemeDemoContent() {
  const { theme, setTheme, themes, resolvedTheme } = useTheme();
  const [clickCount, setClickCount] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.8);

  const currentTheme = themes.find(t => t.themeId === resolvedTheme) || themes[0];

  return (
    <div className="min-h-screen transition-all duration-300" data-theme={resolvedTheme}>
      {/* Header */}
      <header className="p-6 border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 neon-text-cyan">
            Tron Theme System Demo
          </h1>
          <p className="text-center text-lg text-gray-300 mb-6">
            Experience the vintage Tron aesthetic with modern accessibility
          </p>

          {/* Theme Switcher */}
          <div className="flex justify-center mb-4">
            <ThemeSwitcher showCustomization />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Theme Info Section */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-cyan-500/20 bg-black/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 neon-text-cyan">Current Theme</h2>
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="text-cyan-400">Theme ID:</span> {currentTheme.themeId}
              </p>
              <p className="text-gray-300">
                <span className="text-cyan-400">Name:</span> {currentTheme.name}
              </p>
              <p className="text-gray-300">
                <span className="text-cyan-400">Glow Intensity:</span> {currentTheme.glow.intensity}
              </p>
              <p className="text-gray-300">
                <span className="text-cyan-400">Animation Duration:</span> {currentTheme.animation.duration}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-cyan-500/20 bg-black/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 neon-text-cyan">Theme Colors</h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(currentTheme.colors).map(([key, color]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-full h-12 rounded mb-1 border border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-xs text-cyan-400 font-mono">{color}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Button Showcase */}
        <section className="p-6 rounded-lg border border-cyan-500/20 bg-black/30 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 neon-text-cyan">Neon Button Showcase</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Variants */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">Variants</h3>
              <NeonButton variant="primary" className="w-full">
                Primary
              </NeonButton>
              <NeonButton variant="secondary" className="w-full">
                Secondary
              </NeonButton>
              <NeonButton variant="tertiary" className="w-full">
                Tertiary
              </NeonButton>
              <NeonButton variant="ghost" className="w-full">
                Ghost
              </NeonButton>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">Sizes</h3>
              <NeonButton size="sm" className="w-full">
                Small
              </NeonButton>
              <NeonButton size="md" className="w-full">
                Medium
              </NeonButton>
              <NeonButton size="lg" className="w-full">
                Large
              </NeonButton>
            </div>

            {/* States */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">States</h3>
              <NeonButton disabled className="w-full">
                Disabled
              </NeonButton>
              <NeonButton loading className="w-full">
                Loading
              </NeonButton>
              <NeonButton
                onClick={() => setClickCount(count => count + 1)}
                className="w-full"
              >
                Clicked: {clickCount}
              </NeonButton>
            </div>

            {/* Glow Intensity */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">Glow Intensity</h3>
              <NeonButton glowIntensity={0.2} className="w-full">
                Low (0.2)
              </NeonButton>
              <NeonButton glowIntensity={0.5} className="w-full">
                Medium (0.5)
              </NeonButton>
              <NeonButton glowIntensity={1.0} className="w-full">
                High (1.0)
              </NeonButton>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="border-t border-cyan-500/20 pt-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Interactive Glow Control</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-cyan-400 font-mono w-12">{glowIntensity.toFixed(1)}</span>
              <NeonButton glowIntensity={glowIntensity}>
                Dynamic Glow
              </NeonButton>
            </div>
          </div>
        </section>

        {/* Theme Switcher Variants */}
        <section className="p-6 rounded-lg border border-cyan-500/20 bg-black/30 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 neon-text-cyan">Theme Switcher Variants</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Header Position</h3>
              <ThemeSwitcher position="header" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Sidebar Position</h3>
              <ThemeSwitcher position="sidebar" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Compact Mode</h3>
              <ThemeSwitcher compact />
            </div>
          </div>
        </section>

        {/* Accessibility Demo */}
        <section className="p-6 rounded-lg border border-cyan-500/20 bg-black/30 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 neon-text-cyan">Accessibility Features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Keyboard Navigation</h3>
              <p className="text-gray-300 mb-4">
                Use Tab to navigate, Enter/Space to activate, Arrow keys to switch themes.
              </p>
              <div className="space-y-2">
                <NeonButton onClick={() => alert('Keyboard accessible!')}>
                  Focus me and press Enter
                </NeonButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Screen Reader Support</h3>
              <p className="text-gray-300 mb-4">
                All components have proper ARIA labels and semantic markup.
              </p>
              <div className="space-y-2">
                <NeonButton aria-label="This button is fully accessible">
                  Accessible Button
                </NeonButton>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Demo */}
        <section className="p-6 rounded-lg border border-cyan-500/20 bg-black/30 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 neon-text-cyan">Performance Test</h2>

          <div className="space-y-4">
            <p className="text-gray-300">
              Multiple themed components with optimized re-renders:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 24 }, (_, i) => (
                <NeonButton
                  key={i}
                  variant={['primary', 'secondary', 'tertiary'][i % 3] as any}
                  size="sm"
                  onClick={() => setClickCount(count => count + 1)}
                >
                  {i + 1}
                </NeonButton>
              ))}
            </div>
            <p className="text-center text-cyan-400">
              Total clicks: {clickCount} | All buttons share state efficiently
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-2">
            Tron Theme System • Built with TDD • WCAG AA Compliant
          </p>
          <p className="text-sm text-gray-500">
            Current theme: <span className="text-cyan-400">{currentTheme.name}</span> •
            Total themes: <span className="text-cyan-400">{themes.length}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function ThemeDemoPage() {
  return (
    <ThemeProvider themes={defaultThemes}>
      <ThemeDemoContent />
    </ThemeProvider>
  );
}