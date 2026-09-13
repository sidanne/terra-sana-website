const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const shot = async (name) => { await page.waitForTimeout(400); await page.screenshot({ path: `screenshots/${name}.png` }); console.log('captured', name); };
  await page.goto('http://localhost:3000/sponsors', { waitUntil: 'networkidle' });
  await shot('sponsors');
  await page.goto('http://localhost:3000/benevolat', { waitUntil: 'networkidle' });
  await shot('benevolat');
  await browser.close();
  console.log('DONE');
})().catch(e => { console.error('SCRIPT_ERROR', e); process.exit(1); });
