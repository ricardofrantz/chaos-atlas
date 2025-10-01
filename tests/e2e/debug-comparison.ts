import { test, expect } from '@playwright/test';

test.describe('Debug Comparative Analysis', () => {
  test('simple page load test', async ({ page }) => {
    // Capture console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.error('Console error:', msg.text());
      }
    });

    page.on('pageerror', error => {
      console.error('Page error:', error.message);
      consoleErrors.push(error.message);
    });

    console.log('Navigating to /compare...');
    await page.goto('/compare');

    console.log('Waiting for load state...');
    await page.waitForLoadState('networkidle');

    console.log('Waiting for content...');
    await page.waitForTimeout(5000);

    // Take a screenshot
    await page.screenshot({ path: 'debug-comparison.png', fullPage: true });

    // Check URL
    const url = page.url();
    console.log('Current URL:', url);
    expect(url).toMatch(/\/compare\/?$/);

    // Check if basic content exists
    const heading = page.locator('h1');
    const headingVisible = await heading.isVisible();
    console.log('Heading visible:', headingVisible);

    if (headingVisible) {
      const headingText = await heading.textContent();
      console.log('Heading text:', headingText);
    }

    // Check for any select elements
    const selectCount = await page.locator('select').count();
    console.log('Select elements found:', selectCount);

    // Check for any checkboxes
    const checkboxCount = await page.locator('input[type="checkbox"]').count();
    console.log('Checkbox elements found:', checkboxCount);

    // Check for any SVG elements (graphs)
    const svgCount = await page.locator('svg').count();
    console.log('SVG elements found:', svgCount);

    // Report errors
    console.log('Console errors found:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

    // Assert no critical errors
    expect(consoleErrors.length).toBe(0);
  });
});