const { test, expect } = require('@playwright/test');

test('Input validation', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/index.html');
  await page.fill('#Value', 'valid');
  await page.fill('#Value', 'invalid');
});

test('Required fields check', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/index.html');
  await page.click('#Button');
});

test('Button clicks', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/index.html');
  await page.click('#Button');
  await page.click('#Button');
});


test('UI element visibility', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/index.html');
  await expect(page.locator('#Value')).toBeVisible();
  await expect(page.locator('#Value')).toBeVisible();
  await expect(page.locator('#Button')).toBeVisible();
  await expect(page.locator('#Button')).toBeVisible();
});