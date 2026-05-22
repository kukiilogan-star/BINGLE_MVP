const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcPath = '/Users/logan/.gemini/antigravity/brain/tempmediaStorage/media__1779404636112.png';
const srcPathAlt = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f/media__1779404636112.png';

async function main() {
  const finalPath = fs.existsSync(srcPath) ? srcPath : (fs.existsSync(srcPathAlt) ? srcPathAlt : null);
  if (!finalPath) {
    console.error('Source image not found!');
    process.exit(1);
  }
  console.log('Found source image at:', finalPath);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const imgBase64 = fs.readFileSync(finalPath, { encoding: 'base64' });
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

  console.log('Image dimensions:', info);
  await browser.close();
}

main().catch(console.error);
