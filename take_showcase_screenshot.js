const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('🚀 Running showcase screenshot capture script...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set gorgeous widescreen desktop viewport
  await page.setViewport({
    width: 1440,
    height: 960,
    deviceScaleFactor: 2 // High resolution Retina-like output
  });
  
  const targetPath = 'file://' + path.join(__dirname, 'bingle_showcase.html');
  console.log('📂 Loading showcase deck:', targetPath);
  
  await page.goto(targetPath, { waitUntil: 'networkidle2' });
  
  // Let the animations run and settle for a moment
  console.log('⏳ Waiting for interactive assets to load...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const outputPath = '/Users/logan/Desktop/bingle_service_showcase.png';
  console.log('📸 Taking showcase screenshot...');
  await page.screenshot({ path: outputPath });
  
  console.log('💾 Showcase screenshot saved successfully to:', outputPath);
  
  await browser.close();
  console.log('✨ Success! Showcase generation complete.');
})();
