const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting BINGLE App mobile screenshot capture script...');
  
  // Start local server using npx serve on the dist directory
  console.log('📦 Starting local server for dist...');
  const server = spawn('npx', ['serve', '-s', 'dist', '-l', '3000'], {
    cwd: __dirname,
    stdio: 'pipe'
  });

  // Wait 3 seconds for server to boot
  await new Promise(r => setTimeout(r, 3000));
  console.log('✅ Local server running on http://localhost:3000');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to a standard iPhone 13 Pro Max ratio
  await page.setViewport({ 
    width: 428, 
    height: 926, 
    deviceScaleFactor: 2 
  });

  const baseUrl = 'http://localhost:3000';
  
  const screens = [
    { name: '1_onboarding', action: async () => {
        // Go to home. Since we use localStorage to track onboarding, clear it first
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await page.evaluate(() => localStorage.clear());
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
    }},
    { name: '2_home', action: async () => {
        // Force state to skip onboarding
        await page.evaluate(() => {
            localStorage.setItem('hasCompletedOnboarding', 'true');
        });
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1500));
    }},
    { name: '3_pantry', action: async () => {
        // Since it's a SPA without real routes for tabs, we might just click the UI or evaluate React state
        // Let's assume there's a way to click the pantry tab
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        await page.evaluate(() => {
            // Find a button containing "장보기" or "보관함" or use the nav bar
            const buttons = Array.from(document.querySelectorAll('button, div'));
            const pantryBtn = buttons.find(b => b.textContent && (b.textContent.includes('장보기') || b.textContent.includes('보관함')));
            if (pantryBtn) pantryBtn.click();
        });
        await new Promise(r => setTimeout(r, 1500));
    }},
    { name: '4_diary', action: async () => {
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, div'));
            const btn = buttons.find(b => b.textContent && b.textContent.includes('일기장'));
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1500));
    }},
    { name: '5_map', action: async () => {
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, div'));
            const btn = buttons.find(b => b.textContent && b.textContent.includes('산책'));
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1500));
    }},
    { name: '6_forest', action: async () => {
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, div'));
            const btn = buttons.find(b => b.textContent && b.textContent.includes('명상'));
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1500));
    }},
    { name: '7_social', action: async () => {
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, div'));
            const btn = buttons.find(b => b.textContent && b.textContent.includes('이웃'));
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1500));
    }}
  ];

  for (const screen of screens) {
    console.log(`\n📸 Capturing ${screen.name}...`);
    if (screen.action) {
        await screen.action();
    }
    
    // Save image
    const outputPath = path.join(__dirname, `app_screen_${screen.name}.png`);
    await page.screenshot({ path: outputPath });
    console.log(`  💾 Saved: ${outputPath}`);
  }

  await browser.close();
  server.kill();
  console.log('\n✨ App screenshots captured successfully!');
})();
