const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('🚀 Launching Puppeteer debug for bingle_presentation.html...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  // Capture page errors
  page.on('pageerror', err => {
    console.error(`[BROWSER PAGEERROR]: ${err.toString()}`);
  });

  const filePath = 'file://' + path.resolve(__dirname, '../bingle_presentation.html');
  console.log('📂 Loading file:', filePath);
  
  try {
    await page.goto(filePath, { waitUntil: 'load' });
    console.log('✅ Page loaded successfully!');
    
    // Evaluate slide heights and visibility
    const slidesInfo = await page.evaluate(() => {
      const slides = document.querySelectorAll('.slide-container');
      const info = [];
      slides.forEach(s => {
        const style = window.getComputedStyle(s);
        info.push({
          id: s.id,
          classes: s.className,
          display: style.display,
          opacity: style.opacity,
          height: s.offsetHeight,
          width: s.offsetWidth
        });
      });
      
      const container = document.getElementById('slide-content-container');
      const containerStyle = container ? window.getComputedStyle(container) : null;
      
      return {
        containerId: container ? container.id : 'not-found',
        containerDisplay: containerStyle ? containerStyle.display : 'none',
        containerHeight: container ? container.offsetHeight : 0,
        slidesCount: slides.length,
        slides: info
      };
    });
    
    console.log('\n📊 Elements and Slides Info:\n', JSON.stringify(slidesInfo, null, 2));
    
  } catch (err) {
    console.error('❌ Error during page load:', err);
  }
  
  await browser.close();
  console.log('🏁 Debug session finished.');
})();
