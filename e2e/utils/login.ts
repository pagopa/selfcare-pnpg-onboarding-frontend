import { expect, Page } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
  await page.goto('https://imprese.uat.notifichedigitali.it/auth/login');
  await expect(page.getByRole('heading', { name: 'Come vuoi accedere?' })).toBeVisible();

  await page.getByText('Entra con SPIDEntra con CIE').click();
  await page.getByRole('button', { name: 'Entra con SPID' }).click();
  await page.getByLabel('test').click();
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Invia' }).click();
  await page.getByRole('button', { name: 'Invia' }).click();

  await page.waitForURL('https://imprese.uat.notifichedigitali.it/dashboard');
}
