import { test, expect } from '@playwright/test';
import { samplePlugin, sampleRepoUrl, expectedResults } from './fixtures/testData';

test.describe('Security Scanner Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should display main navigation elements', async ({ page }) => {
    // Check if main UI elements are present
    await expect(page.getByText('SecurityScanner')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Scan' })).toBeVisible();
  });

  test('should handle file upload flow', async ({ page }) => {
    // Navigate to scan tab
    await page.getByRole('tab', { name: 'New Scan' }).click();
    
    // Setup file input handling
    const fileInput = await page.getByLabel('Upload Plugin (ZIP)');
    
    // Upload file
    await fileInput.setInputFiles({
      name: samplePlugin.name,
      mimeType: 'application/zip',
      buffer: Buffer.from(samplePlugin.content)
    });

    // Verify file upload
    await expect(page.getByText(samplePlugin.name)).toBeVisible();
  });

  test('should handle repository URL scan', async ({ page }) => {
    // Navigate to scan tab
    await page.getByRole('tab', { name: 'New Scan' }).click();
    
    // Enter repository URL
    await page.getByPlaceholder('https://github.com/user/repo').fill(sampleRepoUrl);
    
    // Start scan
    await page.getByRole('button', { name: 'Start Scan' }).click();
    
    // Verify scanning state
    await expect(page.getByText('Scanning...')).toBeVisible();
    
    // Wait for scan completion (assuming 2s mock delay)
    await page.waitForTimeout(2500);
    
    // Verify results appeared
    await expect(page.getByText('Security Issues Found')).toBeVisible();
  });

  test('should display analytics charts', async ({ page }) => {
    // Navigate to analytics
    await page.getByRole('link', { name: 'Analytics' }).click();
    
    // Verify charts are present
    await expect(page.getByText('30-Day Security Trend')).toBeVisible();
    await expect(page.getByText('Issue Distribution')).toBeVisible();
  });

  test('should handle profile navigation', async ({ page }) => {
    // Click profile menu
    await page.getByRole('button', { name: 'John Doe' }).click();
    
    // Navigate to profile
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    
    // Verify profile page
    await expect(page.getByText('Profile Settings')).toBeVisible();
    await expect(page.getByLabel('First Name')).toBeVisible();
  });

  test('should toggle sidebar', async ({ page }) => {
    // Get initial sidebar state
    const initialWidth = await page.locator('aside').evaluate((el) => el.clientWidth);
    
    // Click toggle button
    await page.getByRole('button', { name: /menu/i }).click();
    
    // Get collapsed width
    const collapsedWidth = await page.locator('aside').evaluate((el) => el.clientWidth);
    
    // Verify sidebar collapsed
    expect(collapsedWidth).toBeLessThan(initialWidth);
  });
});