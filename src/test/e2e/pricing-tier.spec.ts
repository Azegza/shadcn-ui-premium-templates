import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Pricing Tier Block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/preview/pricing-tier');
  });

  test('should render all three tiers', async ({ page }) => {
    const starter = page.getByText('Starter', { exact: true });
    const pro = page.getByText('Pro', { exact: true });
    const enterprise = page.getByText('Enterprise', { exact: true });

    await expect(starter).toBeVisible();
    await expect(pro).toBeVisible();
    await expect(enterprise).toBeVisible();
  });

  test('should toggle between monthly and annual pricing', async ({ page }) => {
    // Check Pro price (Monthly is $49, Annual is $39)
    // Using regex to handle potential extra spaces or formatting
    const proPrice = page.locator('span').filter({ hasText: /^49$/ });
    await expect(proPrice).toBeVisible({ timeout: 10000 });

    // Toggle to Annual
    await page.click('button[role="switch"]');

    const annualPrice = page.locator('span').filter({ hasText: /^39$/ });
    await expect(annualPrice).toBeVisible({ timeout: 10000 });
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
