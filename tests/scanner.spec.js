import { test, expect } from '@playwright/test';

test.describe('Plugin Security Scanner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow file upload', async ({ page }) => {
    // Test file upload functionality
    await page.setInputFiles('input[type="file"]', 'test-files/sample-plugin.zip');
    await expect(page.getByText('sample-plugin.zip')).toBeVisible();
  });

  test('should allow URL input', async ({ page }) => {
    // Test repository URL input
    await page.fill('input[type="url"]', 'https://github.com/sample/repo');
    await page.click('button:has-text("Scan")');
    await expect(page.getByText('Scanning...')).toBeVisible();
  });

  test('should display scan results', async ({ page }) => {
    // Test results display
    await page.fill('input[type="url"]', 'https://github.com/sample/repo');
    await page.click('button:has-text("Scan")');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('Security Issues Found')).toBeVisible();
  });

  test('should filter results by severity', async ({ page }) => {
    // Test severity filtering
    await page.fill('input[type="url"]', 'https://github.com/sample/repo');
    await page.click('button:has-text("Scan")');
    await page.click('button:has-text("High")');
    await expect(page.getByText('High Severity Issues')).toBeVisible();
  });
});
