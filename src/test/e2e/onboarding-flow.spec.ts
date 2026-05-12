import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Onboarding Flow Block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/preview/onboarding-flow');
  });

  test('should complete the full onboarding journey', async ({ page }) => {
    // Capture console logs for debugging
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

    // --- Step 1: Profile ---
    await page.fill('input[placeholder="John Doe"]', 'Antigravity AI');
    await page.click('button:has-text("Developer")');
    await page.click('button:has-text("Continue")');

    // --- Step 2: Workspace ---
    await expect(page.getByText('Create Workspace')).toBeVisible();
    await page.fill('input[placeholder="Acme Corp"]', 'Nova HQ');
    // Explicitly fill slug to avoid race conditions with auto-fill
    await page.fill('input[placeholder="acme-corp"]', 'nova-hq');
    
    await page.click('button:has-text("Continue")');

    // --- Step 3: Team ---
    await expect(page.getByText('Invite your team')).toBeVisible();
    await page.fill('textarea[placeholder*="alice@example.com"]', 'sarah@nova.io');
    
    await page.click('button:has-text("Complete Setup")');

    // --- Success State ---
    await expect(page.getByRole('heading', { name: /set!/i })).toBeVisible({ timeout: 15000 });
  });

  test('should have no accessibility violations', async ({ page }) => {
    await injectAxe(page);
    const results = await page.evaluate(() => (window as any).axe.run());
    if (results.violations.length > 0) {
      console.log('A11y Violations:', JSON.stringify(results.violations, null, 2));
    }
    expect(results.violations.length).toBe(0);
  });
});
