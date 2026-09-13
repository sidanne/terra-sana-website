const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const shot = async (name) => {
    await page.waitForTimeout(400);
    await page.screenshot({ path: `screenshots/${name}.png` });
    console.log('captured', name);
  };

  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
  await shot('about');

  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  await shot('contact');

  // Switch language to English via the navbar selector, then go to the FAQ page
  await page.goto('http://localhost:3000/aide', { waitUntil: 'networkidle' });
  await page.getByText('FR', { exact: true }).click().catch(() => {});
  await page.waitForTimeout(200);
  const en = page.getByText('English', { exact: true });
  if (await en.count()) { await en.click(); await page.waitForTimeout(400); }
  await shot('aide-en');

  await browser.close();
  console.log('DONE');
})().catch(e => { console.error('SCRIPT_ERROR', e); process.exit(1); });
