const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const imagesDir = '/Users/logan/Desktop/np_development/public/images';

async function main() {
  const files = fs.readdirSync(imagesDir).filter(f => f.startsWith('bingle_') && f.endsWith('.png'));
  console.log('Found Bingle files:', files);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
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
