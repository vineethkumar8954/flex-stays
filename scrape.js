const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://benign-aura-stay-dwell.base44.app', { waitUntil: 'networkidle0' });
  
  // Save HTML
  const html = await page.content();
  fs.writeFileSync('page.html', html);
  
  // Save screenshot
  await page.screenshot({ path: 'page.png', fullPage: true });

  await browser.close();
})();
