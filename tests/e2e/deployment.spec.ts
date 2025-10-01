import { test, expect } from '@playwright/test';

test.describe('Deployment Verification - E2E Tests', () => {
  const deployedUrl = 'https://ricardofrantz.github.io/cml-visualizer/';

  test.beforeEach(async ({ page }) => {
    // Test the deployed GitHub Pages site
    await page.goto(deployedUrl);

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Clear localStorage for fresh state
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Reload to ensure clean state
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('deployed site loads correctly', async ({ page }) => {
    // Check we're on the correct domain
    expect(page.url()).toContain('ricardofrantz.github.io/cml-visualizer');

    // Check main heading loads
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toContainText('CML Visualizer');
    await expect(mainHeading).toBeVisible();

    // Check page title
    await expect(page).toHaveTitle(/CML Visualizer/);
  });

  test('all main navigation elements are present', async ({ page }) => {
    // Check theme switcher
    const themeSwitcher = page.locator('.theme-switcher');
    await expect(themeSwitcher).toBeVisible();

    // Check main navigation buttons
    const diffusiveButton = page.locator('button:has-text("CML Diffusive")');
    await expect(diffusiveButton).toBeVisible();

    const globalButton = page.locator('button:has-text("CML Global")');
    await expect(globalButton).toBeVisible();

    const aboutButton = page.locator('button:has-text("About")');
    await expect(aboutButton).toBeVisible();
  });

  test('theme switching works on deployed site', async ({ page }) => {
    // Wait a moment for theme to initialize
    await page.waitForTimeout(1000);

    // Check initial theme
    const htmlElement = page.locator('html');
    const initialTheme = await htmlElement.getAttribute('data-theme');
    console.log('Initial theme on deployed site:', initialTheme);

    // Switch to Blue Tron theme
    const blueTronButton = page.locator('button:has-text("Blue Tron")');
    await blueTronButton.click();
    await page.waitForTimeout(500);

    // Verify theme switched
    await expect(htmlElement).toHaveAttribute('data-theme', 'blue-tron');
  });

  test('navigation to CML pages works on deployed site', async ({ page }) => {
    // Test CML Diffusive navigation
    const diffusiveButton = page.locator('button:has-text("CML Diffusive")');
    await diffusiveButton.click();

    // Should navigate to CML Diffusive page
    await expect(page).toHaveURL(/\/cml\/diffusive/);

    // Check page content
    const diffusiveHeading = page.locator('h1');
    await expect(diffusiveHeading).toContainText('Coupled Map Lattice');

    // Go back to home
    await page.goto(deployedUrl);
    await page.waitForLoadState('networkidle');

    // Test CML Global navigation
    const globalButton = page.locator('button:has-text("CML Global")');
    await globalButton.click();

    // Should navigate to CML Global page
    await expect(page).toHaveURL(/\/cml\/global/);

    // Check page content
    const globalHeading = page.locator('h1');
    await expect(globalHeading).toContainText('Global Coupled Map Lattice');
  });

  test('about page works on deployed site', async ({ page }) => {
    // Navigate to about page
    const aboutButton = page.locator('button:has-text("About")');
    await aboutButton.click();

    // Should navigate to about page
    await expect(page).toHaveURL(/\/about/);

    // Check about page content
    const aboutTitle = page.locator('h1');
    await expect(aboutTitle).toContainText('About CML Visualizer');

    // Check back to home link
    const backButton = page.locator('a:has-text("← Back to Home")');
    await expect(backButton).toBeVisible();
  });

  test('no console errors on deployed site', async ({ page }) => {
    // Monitor console for errors
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate around the site
    await page.goto(deployedUrl);
    await page.waitForLoadState('networkidle');

    // Click through main navigation
    await page.click('button:has-text("CML Diffusive")');
    await page.waitForLoadState('networkidle');

    await page.goto(deployedUrl);
    await page.click('button:has-text("About")');
    await page.waitForLoadState('networkidle');

    // Check for console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('static assets load correctly', async ({ page }) => {
    // Check if CSS loads
    const cssLink = page.locator('link[rel="stylesheet"]');
    await expect(cssLink.first()).toBeVisible();

    // Check if fonts load (no network errors for font files)
    const networkErrors: string[] = [];

    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.url()} - ${response.status()}`);
      }
    });

    await page.waitForLoadState('networkidle');

    // Should have no network errors for static assets
    const staticAssetErrors = networkErrors.filter(error =>
      error.includes('.css') || error.includes('.js') || error.includes('.woff')
    );
    expect(staticAssetErrors).toHaveLength(0);
  });

  test('responsive design works on deployed site', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check main elements are still visible
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();

    const themeSwitcher = page.locator('.theme-switcher');
    await expect(themeSwitcher).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check elements are still properly laid out
    await expect(mainHeading).toBeVisible();
    await expect(themeSwitcher).toBeVisible();
  });
});