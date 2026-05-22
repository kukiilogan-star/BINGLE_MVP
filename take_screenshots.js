const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('🚀 Starting BINGLE Presentation screenshot capture script...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to a standard high-definition landscape slide ratio
  await page.setViewport({ 
    width: 1440, 
    height: 900, 
    deviceScaleFactor: 2 // Retain sharp, crisp high-res borders and typography
  });

  const filePath = 'file://' + path.resolve(__dirname, 'bingle_presentation.html');
  console.log('📂 Loading slide deck:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Iterate over each slide, execute its interactions to show live states, and capture
  for (let slideNum = 1; slideNum <= 11; slideNum++) {
    console.log(`\n📸 [Slide ${slideNum}/11] Navigating to slide...`);
    
    // Programmatically trigger navigation
    await page.evaluate((num) => {
      goToSlide(num);
    }, slideNum);
    
    // Wait for the slide transition animation
    await new Promise(r => setTimeout(r, 1000));
    
    // Trigger slide-specific animations and simulations for a "live" feel in screenshots
    if (slideNum === 1) {
      console.log('  👉 Triggering slide 1 refrigerator door opening swing...');
      await page.evaluate(() => {
        triggerSlide1Opening();
      });
      // Wait for 3D rotation and speech bubble transitions
      await new Promise(r => setTimeout(r, 1200));
    } else if (slideNum === 2) {
      console.log('  👉 Injecting stress value of 85% into Slide 2 Melting Simulator...');
      await page.evaluate(() => {
        updateMeltingSimulator(85);
      });
      await new Promise(r => setTimeout(r, 800));
    } else if (slideNum === 3) {
      console.log('  👉 Feeding Slide 3 Bingle a cacao treat (shows cooling impact)...');
      await page.evaluate(() => {
        feedBingleSnack('cacao', -63);
      });
      await new Promise(r => setTimeout(r, 1000));
    } else if (slideNum === 4) {
      console.log('  👉 Highlighting Module 5 (Walk Map) to trigger real-time GPS path tracer...');
      await page.evaluate(() => {
        zoomFeature(5);
      });
      // Wait for the mini HTML5 Canvas path tracer to draw walking checkpoints
      await new Promise(r => setTimeout(r, 1500));
    } else if (slideNum === 6) {
      console.log('  👉 Submitting sample diary entry to Slide 6 AI Emotion Analyzer...');
      await page.evaluate(() => {
        document.getElementById('ai-diary-input').value = '오늘 업무 미팅에서 기획안이 기각되어 너무 답답하고 숨막히는 하루였다. 밤늦게까지 작업하느라 피로가 극에 달해 쓰러질 것 같다.';
        simulateAIDiaryAnalysis();
      });
      await new Promise(r => setTimeout(r, 1000));
    } else if (slideNum === 7) {
      console.log('  👉 Updating Slide 7 financial projections range sliders...');
      await page.evaluate(() => {
        document.getElementById('calc-b2c-range').value = 16500;
        document.getElementById('calc-b2b-range').value = 48000;
        calculateProjectedRevenue();
      });
      await new Promise(r => setTimeout(r, 800));
    } else if (slideNum === 8) {
      console.log('  👉 Feeding Slide 8 Bingle a sweet melon gel treat...');
      await page.evaluate(() => {
        feedManualBingle('melon');
      });
      await new Promise(r => setTimeout(r, 1000));
    } else if (slideNum === 9) {
      console.log('  👉 Toggling refrigerator door open in Slide 9 Triggers...');
      await page.evaluate(() => {
        switchTriggerTab('door');
        toggleSimulatedFridge();
      });
      await new Promise(r => setTimeout(r, 1200));
    } else if (slideNum === 10) {
      console.log('  👉 Activating diaryState JSON schema in Slide 10 schema log...');
      await page.evaluate(() => {
        showConsoleSchema('diaryState');
      });
      await new Promise(r => setTimeout(r, 800));
    } else if (slideNum === 11) {
      console.log('  👉 Triggering Slide 11 Framer Motion spring physics demonstration...');
      await page.evaluate(() => {
        playTechDemo('motion');
      });
      await new Promise(r => setTimeout(r, 1000));
    }
    
    // Save image directly to the user's Desktop
    const outputPath = path.join('/Users/logan/Desktop', `bingle_slide_${slideNum}.png`);
    console.log(`  💾 Saving slide image to: ${outputPath}`);
    await page.screenshot({ path: outputPath });
  }

  await browser.close();
  console.log('\n✨ Success! All 11 slides have been captured with their dynamic UI states and saved to your Desktop.');
})();
