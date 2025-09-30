import { test, expect } from '@playwright/test';

test.describe('Tron Theme System - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('main page loads with Tron theme elements', async ({ page }) => {
    // Check main heading with neon text effect
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toContainText('CML Visualizer');
    await expect(mainHeading).toHaveClass(/neon-text-cyan/);

    // Check theme switcher is present
    const themeSwitcher = page.locator('.theme-switcher');
    await expect(themeSwitcher).toBeVisible();

    // Check theme demo button
    const demoButton = page.locator('button:has-text("Theme Demo")');
    await expect(demoButton).toBeVisible();
    await expect(demoButton).toHaveClass(/neon-button/);
  });

  test('theme switcher functionality', async ({ page }) => {
    const themeSwitcher = page.locator('.theme-switcher');

    // Check default theme is active
    const tronDarkButton = page.locator('button:has-text("Tron Dark")');
    await expect(tronDarkButton).toHaveAttribute('aria-pressed', 'true');

    // Switch to Tron Light theme
    const tronLightButton = page.locator('button:has-text("Tron Light")');
    await tronLightButton.click();

    // Verify theme switched
    await expect(tronLightButton).toHaveAttribute('aria-pressed', 'true');
    await expect(tronDarkButton).toHaveAttribute('aria-pressed', 'false');

    // Check document theme attribute
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'tron-light');
  });

  test('navigation to theme demo page', async ({ page }) => {
    const demoButton = page.locator('button:has-text("Theme Demo")');
    await demoButton.click();

    // Verify navigation to demo page
    await expect(page).toHaveURL(/\/theme-demo/);

    // Check demo page title
    const demoTitle = page.locator('h1');
    await expect(demoTitle).toContainText('Tron Theme System Demo');
  });

  test('theme demo page - button showcase', async ({ page }) => {
    await page.goto('/theme-demo');

    // Check all button variants are present
    const primaryButton = page.locator('button:has-text("Primary")');
    const secondaryButton = page.locator('button:has-text("Secondary")');
    const tertiaryButton = page.locator('button:has-text("Tertiary")');
    const ghostButton = page.locator('button:has-text("Ghost")');

    await expect(primaryButton).toBeVisible();
    await expect(secondaryButton).toBeVisible();
    await expect(tertiaryButton).toBeVisible();
    await expect(ghostButton).toBeVisible();

    // Check neon glow effects
    await expect(primaryButton).toHaveClass(/neon-button/);
  });

  test('theme demo page - interactive glow control', async ({ page }) => {
    await page.goto('/theme-demo');

    // Find the glow intensity slider
    const glowSlider = page.locator('input[type="range"]');
    await expect(glowSlider).toBeVisible();

    // Find the dynamic glow button
    const dynamicButton = page.locator('button:has-text("Dynamic Glow")');
    await expect(dynamicButton).toBeVisible();

    // Get initial glow value
    const initialValue = await glowSlider.inputValue();

    // Change glow intensity
    await glowSlider.fill('1.0');

    // Verify value changed
    const newValue = await glowSlider.inputValue();
    expect(newValue).toBe('1.0');
    expect(newValue).not.toBe(initialValue);
  });

  test('theme demo page - theme switcher variants', async ({ page }) => {
    await page.goto('/theme-demo');

    // Check different theme switcher positions
    const headerSwitcher = page.locator('text=Header Position');
    await expect(headerSwitcher).toBeVisible();

    const sidebarSwitcher = page.locator('text=Sidebar Position');
    await expect(sidebarSwitcher).toBeVisible();

    const compactSwitcher = page.locator('text=Compact Mode');
    await expect(compactSwitcher).toBeVisible();
  });

  test('theme demo page - performance test section', async ({ page }) => {
    await page.goto('/theme-demo');

    // Check performance test section
    const performanceSection = page.locator('text=Performance Test');
    await expect(performanceSection).toBeVisible();

    // Count the number of buttons in performance test
    const perfButtons = page.locator('.space-y-4 button');
    const buttonCount = await perfButtons.count();
    expect(buttonCount).toBeGreaterThan(20); // Should have 24+ buttons

    // Check click counter functionality
    const clickCounter = page.locator('text=Total clicks:');
    await expect(clickCounter).toBeVisible();

    // Click a button and verify counter updates
    const firstButton = perfButtons.first();
    const initialText = await clickCounter.textContent();

    await firstButton.click();

    const newText = await clickCounter.textContent();
    expect(newText).not.toBe(initialText);
  });

  test('keyboard navigation accessibility', async ({ page }) => {
    await page.goto('/theme-demo');

    // Test Tab navigation through theme switcher
    await page.keyboard.press('Tab');

    // Focus should be on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test Arrow key navigation in theme switcher
    const themeSwitcher = page.locator('.theme-switcher button').first();
    await themeSwitcher.focus();

    // Use arrow keys to navigate themes
    await page.keyboard.press('ArrowRight');

    // Verify focus moved
    const newFocusedElement = page.locator(':focus');
    await expect(newFocusedElement).toBeVisible();
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/theme-demo');

    // Check mobile layout
    const mainTitle = page.locator('h1');
    await expect(mainTitle).toBeVisible();

    // Check theme switcher adapts to mobile
    const themeSwitcher = page.locator('.theme-switcher');
    await expect(themeSwitcher).toBeVisible();

    // Check buttons are touch-friendly
    const buttons = page.locator('button');
    const firstButton = buttons.first();
    const boundingBox = await firstButton.boundingBox();

    // Buttons should be at least 44x44 for touch accessibility
    expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('theme persistence across navigation', async ({ page }) => {
    await page.goto('/');

    // Switch to Tron Light theme
    const tronLightButton = page.locator('button:has-text("Tron Light")');
    await tronLightButton.click();

    // Navigate to demo page
    const demoButton = page.locator('button:has-text("Theme Demo")');
    await demoButton.click();

    // Verify theme persists on demo page
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'tron-light');

    // Check theme switcher reflects current theme
    const activeThemeButton = page.locator('button[aria-pressed="true"]');
    await expect(activeThemeButton).toContainText('Tron Light');
  });

  test('loading and disabled states', async ({ page }) => {
    await page.goto('/theme-demo');

    // Check disabled button
    const disabledButton = page.locator('button:has-text("Disabled")');
    await expect(disabledButton).toBeVisible();
    await expect(disabledButton).toBeDisabled();
    await expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

    // Check loading button
    const loadingButton = page.locator('button:has-text("Loading")');
    await expect(loadingButton).toBeVisible();
    await expect(loadingButton).toHaveAttribute('aria-busy', 'true');
  });

  test('neon glow effects visual verification', async ({ page }) => {
    await page.goto('/theme-demo');

    // Check elements have neon glow classes
    const neonElements = page.locator('.neon-text-cyan, .neon-button');
    const neonCount = await neonElements.count();
    expect(neonCount).toBeGreaterThan(0);

    // Hover over a button to check glow effects
    const primaryButton = page.locator('button:has-text("Primary")');
    await primaryButton.hover();

    // Verify hover state is applied
    await expect(primaryButton).toHaveClass(/hover:/);
  });

  test('theme information display', async ({ page }) => {
    await page.goto('/theme-demo');

    // Check current theme information section
    const themeInfo = page.locator('text=Current Theme');
    await expect(themeInfo).toBeVisible();

    // Check theme details are displayed
    const themeId = page.locator('text=Theme ID:');
    const themeName = page.locator('text=Name:');
    const glowIntensity = page.locator('text=Glow Intensity:');

    await expect(themeId).toBeVisible();
    await expect(themeName).toBeVisible();
    await expect(glowIntensity).toBeVisible();
  });
});