import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';
import fs from 'fs';

test('debug accessibility violations', async ({ page }) => {
  await page.goto('/preview/metrics-dashboard');
  await injectAxe(page);
  
  const violations = await getViolations(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });

  if (violations.length > 0) {
    fs.writeFileSync('a11y-violations.json', JSON.stringify(violations, null, 2));
    console.log('Violations found and saved to a11y-violations.json');
  } else {
    console.log('No violations found!');
  }
});
