const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('🚀 Launching Puppeteer to inspect presentation errors...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[PAGE LOG] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`🔴 [PAGE ERROR]: ${err.message}`);
    console.log(err.stack);
  });
  
  const targetUrl = 'file://' + path.join(__dirname, '../bingle_presentation.html');
  console.log('📂 Loading file:', targetUrl);
  
  try {
    await page.goto(targetUrl, { waitUntil: 'load' });
    console.log('⏳ Page loaded. Checking console logs...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (e) {
    console.error('❌ Failed to load page:', e.message);
  }
  
  await browser.close();
  console.log('🏁 Inspection complete.');
})();
