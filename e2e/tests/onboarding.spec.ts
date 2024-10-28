import { test, expect } from '@playwright/test';

test('land in onboarding flow', async ({ page }) => {
  await page.goto('https://imprese.uat.notifichedigitali.it/auth/login');
  await page.getByRole('button', { name: 'Entra con SPID' }).click();
  await page.getByLabel('test').click();
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('MrLegaleRappresentante2');
  await page.getByLabel('Username').press('Tab');
  await page.getByLabel('Password').fill('test');
  await page.getByLabel('Password').press('Tab');
  await page.getByRole('button', { name: 'Invia' }).press('Enter');
  await page.getByRole('button', { name: 'Invia' }).click();
  await expect(page.getByRole('heading', { name: 'Seleziona la tua impresa' })).toBeVisible();
  await expect(page.getByText('Se leggi le notifiche di più')).toBeVisible();
  await page
    .locator('div')
    .filter({ hasText: /^Accedi$/ })
    .click();
  await page.getByText('Sei un Legale Rappresentante').click();
  await page.getByText('Registra una nuova impresa').click();
  await page.getByText('ErroreSi è verificato un').click();
});
