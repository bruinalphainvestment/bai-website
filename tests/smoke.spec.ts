import { test, expect } from '@playwright/test';

test('home page renders BAI hero heading', async ({ page }) => {
  await page.goto('/');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toContainText(/Bruin\s*Alpha\s*Investment/i);
});
