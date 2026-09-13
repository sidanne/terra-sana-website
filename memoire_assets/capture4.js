const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const shot = async (name) => { await page.waitForTimeout(400); await page.screenshot({ path: `screenshots/${name}.png` }); console.log('captured', name); };

  await page.goto('http://localhost:3000/volunteer/register', { waitUntil: 'networkidle' });
  const email = `demo.memoire2.${Date.now()}@terrasana.be`;
  await page.getByPlaceholder('Prénom', { exact: true }).fill('Julie');
  await page.getByPlaceholder('Nom', { exact: true }).fill('Martin');
  await page.getByPlaceholder('votre@email.com').fill(email);
  await page.getByPlaceholder('Choisissez un mot de passe').fill('MotDePasse123');
  await page.getByPlaceholder('Ex : cuisine, communication, logistique...').fill('Logistique, communication');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await page.waitForURL('**/volunteer/dashboard', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);

  // S'inscrire au premier événement visible depuis l'onglet Événements du dashboard
  const evTab = page.getByText('Événements', { exact: true });
  if (await evTab.count()) { await evTab.first().click(); await page.waitForTimeout(600); }
  await shot('dashboard-events-tab');

  const subscribeBtn = page.getByRole('button', { name: /S'inscrire/i }).first();
  if (await subscribeBtn.count()) { await subscribeBtn.click(); await page.waitForTimeout(800); }

  const regTab = page.getByText('Mes inscriptions', { exact: true });
  if (await regTab.count()) { await regTab.first().click(); await page.waitForTimeout(600); }
  await shot('dashboard-registrations-tab');

  await page.goto('http://localhost:3000/volunteer/forgot-password', { waitUntil: 'networkidle' });
  await shot('forgot-password');

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const en = page.locator('text=FR').first();
  await browser.close();
  console.log('DONE', email);
})().catch(e => { console.error('SCRIPT_ERROR', e); process.exit(1); });
