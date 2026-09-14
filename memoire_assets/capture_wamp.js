const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  // Page d'accueil WAMP
  await page.goto('http://localhost/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshots/wamp_home.png' });
  console.log('captured wamp_home');

  // Connexion phpMyAdmin
  await page.goto('http://localhost/phpmyadmin/', { waitUntil: 'networkidle' });
  await page.fill('#input_username', 'root');
  await page.click('#input_go');
  await page.waitForTimeout(1500);

  // Structure de la base terre_sana (8 tables)
  await page.goto('http://localhost/phpmyadmin/index.php?route=/database/structure&db=terre_sana', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/phpmyadmin_structure.png' });
  console.log('captured phpmyadmin_structure');

  await browser.close();
  console.log('DONE');
})().catch(e => { console.error('SCRIPT_ERROR', e); process.exit(1); });
