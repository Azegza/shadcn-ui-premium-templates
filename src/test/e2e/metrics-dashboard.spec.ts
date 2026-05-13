import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Nova Metrics Dashboard Block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/preview/metrics-dashboard');
  });

  test('should navigate between sub-views', async ({ page }) => {
    // Check initial Overview state
    await expect(page.getByText('Performance Overview')).toBeVisible();
    
    // Navigate to Analytics
    await page.getByRole('button', { name: /Analytics/i }).click();
    await expect(page.getByText('Traffic Sources')).toBeVisible({ timeout: 15000 });

    // Navigate to Revenue
    await page.getByRole('button', { name: /Revenue/i }).click();
    await expect(page.getByText('Recent Transactions')).toBeVisible({ timeout: 15000 });

    // Navigate to Customers
    await page.getByRole('button', { name: /Customers/i }).click();
    await expect(page.getByText('Customer List')).toBeVisible({ timeout: 15000 });
  });

  test('should have no accessibility violations', async ({ page }) => {
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
    });
  });
});
