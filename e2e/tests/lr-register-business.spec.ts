import { test, expect } from '@playwright/test';
import { login } from '../utils/login';

test('Test: LR register a new business', async ({ page }) => {
  await login(page, 'MarcoPorcioCatoneSpqr', 'test');
  await page.getByRole('heading', { name: 'Come vuoi accedere?' }).click();
  await page.getByRole('button', { name: 'Entra con SPID' }).click();
  await page.getByLabel('test').click();
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('M');
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('Marco');
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('MarcoP');
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('MarcoPorcio');
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('MarcoPorcioC');
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('MarcoPorcioCatone');
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('MarcoPorcioCatoneS');
  await page.getByLabel('Username').press('CapsLock');
  await page.getByLabel('Username').fill('MarcoPorcioCatoneSpqr');
  await page.getByLabel('Username').press('Tab');
  await page.getByLabel('Password').fill('test');
  await page.getByLabel('Password').press('Tab');
  await page.getByRole('button', { name: 'Invia' }).press('Enter');
  await page.getByRole('button', { name: 'Invia' }).click();
  await page.getByRole('button', { name: 'Invia' }).click();
  await page.locator('#onetrust-banner-sdk').press('Tab');
  await page.getByLabel('Maggiori informazioni sulla tua privacy', { exact: true }).press('Enter');
  await page.locator('#onetrust-group-container').click();
  await page.locator('#onetrust-banner-sdk').press('Tab');
  await page.getByLabel('Maggiori informazioni sulla tua privacy', { exact: true }).press('Tab');
  await page.getByRole('button', { name: 'Scopri di più' }).press('Enter');
  await page.getByRole('button', { name: 'Scopri di più' }).press('Tab');
  await page.getByRole('button', { name: 'Rifiuta tutti' }).press('Enter');
  await page.getByRole('button', { name: 'Rifiuta tutti' }).press('Escape');
  await page.getByRole('button', { name: 'Rifiuta tutti' }).press('Escape');
  await page.getByRole('button', { name: 'Rifiuta tutti' }).press('Escape');
  await page.getByRole('button', { name: 'Rifiuta tutti' }).press('Tab');
  await page.getByRole('button', { name: 'Accetta tutti' }).press('Tab');
  await page.getByRole('button', { name: 'Chiudi' }).press('Enter');
  await page.getByRole('button', { name: 'Chiudi' }).press('Enter');
  await page.getByRole('button', { name: 'Chiudi' }).press('Enter');
  await page.getByRole('button', { name: 'Chiudi' }).click();
  await page.getByText('Cercala tramite Codice Fiscale').click();
  await page.getByRole('heading', { name: 'Che impresa vuoi registrare?' }).click();
});

test('Access into SEND product back office', async ({ page }) => {
  await login(page, 'MrLegaleRappresentante2', 'test');

  await expect(page.getByRole('heading', { name: 'Seleziona la tua impresa' })).toBeVisible();
  await expect(page.getByText('Se leggi le notifiche di più')).toBeVisible();
  await page
    .locator('div')
    .filter({ hasText: /^Accedi$/ })
    .click();
  await page.getByRole('button', { name: 'DEVA FINANCE S.R.L.' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  await expect(page.getByRole('heading', { name: 'Panoramica' })).toBeVisible();
  await expect(page.getByText('Visualizza il riepilogo dei')).toBeVisible();

  await page.getByRole('heading', { name: 'Notifiche digitali' }).click();
  await page.locator('.MuiBox-root > .MuiPaper-root > div').click();
  await page.getByLabel('Vai alle notifiche').click();
  await page
    .locator('div')
    .filter({ hasText: /^Notifiche digitaliVai alle notifiche$/ })
    .getByRole('button')
    .click();
  await page.waitForURL('https://imprese.uat.notifichedigitali.it/notifiche');

  await page.locator('.onetrust-pc-dark-filter').click();
  await page.locator('.onetrust-pc-dark-filter').click();
  await page.locator('body').press('Tab');
  await page
    .getByLabel('informativa sul trattamento dei dati personali', { exact: true })
    .press('Tab');
  await page.getByRole('button', { name: 'Scopri di più' }).press('Tab');
  await page.getByRole('button', { name: 'Rifiuta tutti' }).click();
  await page.locator('body').press('Tab');
  await page.getByTestId('titleBox').click();
  await expect(page.getByText('Leggi le notifiche di DEVA')).toBeVisible();
  await page.getByTestId("sideMenuItem-Notifiche dell'impresa").click();
  await page.getByTestId('sideMenuItem-Notifiche delegate').click();
  await page.getByTestId('titleBox').click();
  await expect(page.getByText('Leggi le notifiche delegate a')).toBeVisible();
  await page.getByTestId('sideMenuItem-Deleghe').click();
  await page.getByTestId('titleBox').click();
  await expect(page.getByText('Qui si possono gestire i')).toBeVisible();
  await expect(page.getByRole('heading', { name: "Deleghe a carico dell'impresa" })).toBeVisible();
  await page.getByTestId('sideMenuItem-Recapiti').click();
  await page.getByTestId('titleBox').click();
  await expect(page.getByText('Inserisci o modifica i')).toBeVisible();
  await page.getByTestId('sideMenuItem-Integrazione API').click();
  await page.getByTestId('titleBox').click();
  await expect(page.getByText('Genera e gestisci le chiavi')).toBeVisible();
  await page.getByTestId('sideMenuItem-Stato della piattaforma').click();
  await page.locator('#item').click();
  await expect(page.getByText('Verifica il funzionamento di')).toBeVisible();

  await page.getByRole('button', { name: 'SEND - Servizio Notifiche' }).click();
  await page.getByRole('menuitem', { name: 'La tua impresa' }).click();
  await page.getByRole('heading', { name: 'Panoramica' }).click();
});
