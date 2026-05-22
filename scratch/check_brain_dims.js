const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const brainDir = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f';

async function main() {
  const files = fs.readdirSync(brainDir).filter(f => f.startsWith('bingle_hot') && f.endsWith('.png'));
  console.log('Found hot files in brain:', files);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const file of files) {
    const filePath = path.join(brainDir, file);
    const imgBase64 = fs.readFileSync(filePath, { encoding: 'base64' });
    const dataUrl = `data:image/png;base64,${imgBase64}`;

    const info = await page.evaluate(async (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.src = url;
      });
    }, dataUrl);

    console.log(`${file}:`, info);
  }

  await browser.close();
}

main().catch(console.error);
