const { test, expect } = require('@playwright/test');

test.describe('B2B Marketplace Basic Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    
    // Basic check that page loads (using the actual title)
    await expect(page).toHaveTitle(/Create Next App/);
  });

  test('should navigate to search page', async ({ page }) => {
    // Go to search page
    await page.goto('/search');
    
    // Check if page loads without error
    await page.waitForLoadState('networkidle');
    
    // Basic assertion that we're on the right page
    expect(page.url()).toContain('/search');
  });
}); 