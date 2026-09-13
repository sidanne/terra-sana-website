const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const shot = async (name, fullPage = false) => {
    await page.waitForTimeout(400);
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage });
    console.log('captured', name);
  };

  await page.goto('http://localhost:3000/volunteer/login', { waitUntil: 'networkidle' });
  await shot('volunteer-login');

  await page.goto('http://localhost:3000/volunteer/register', { waitUntil: 'networkidle' });
  await shot('volunteer-register', true);

  const email = `demo.memoire.${Date.now()}@terrasana.be`;
  await page.getByPlaceholder('Prénom', { exact: true }).fill('Camille');
  await page.getByPlaceholder('Nom', { exact: true }).fill('Dupont');
  await page.getByPlaceholder('votre@email.com').fill(email);
  await page.getByPlaceholder('Choisissez un mot de passe').fill('MotDePasse123');
  await page.getByPlaceholder('+32 xxx xx xx xx').fill('+32 470 12 34 56');
  await page.getByPlaceholder('Bruxelles').fill('Bruxelles');
  await page.getByPlaceholder('1000').fill('1200');
  await page.getByPlaceholder(/cuisine, communication/).fill('Communication, logistique');
  await page.getByPlaceholder(/week-ends, mercredis/).fill('Week-ends');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await page.waitForURL('**/volunteer/dashboard', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);
  await shot('volunteer-dashboard');

  await page.goto('http://localhost:3000/evenements', { waitUntil: 'networkidle' });
  await shot('events-list', false);

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await shot('home', false);

  await browser.close();
  console.log('DONE', email);
})().catch(e => { console.error('SCRIPT_ERROR', e); process.exit(1); });
