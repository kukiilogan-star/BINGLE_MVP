const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcPath = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f/media__1779404636112.png';

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const imgBase64 = fs.readFileSync(srcPath, { encoding: 'base64' });
  const dataUrl = `data:image/png;base64,${imgBase64}`;

  const result = await page.evaluate(async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Check columns
        const colOpacity = [];
        for (let x = 0; x < img.width; x++) {
          let nonBgPixels = 0;
          for (let y = 0; y < img.height; y++) {
            const idx = (y * img.width + x) * 4;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            if (!(r > 240 && g > 240 && b > 240)) {
              nonBgPixels++;
            }
          }
          colOpacity.push(nonBgPixels);
        }

        resolve({
          width: img.width,
          height: img.height,
          colOpacity: colOpacity
        });
      };
      img.src = url;
    });
  }, dataUrl);

  console.log(`Image size: ${result.width}x${result.height}`);
  console.log("Analyzing column content distribution:");
  let sections = [];
  let inSection = false;
  let start = 0;
  for (let x = 0; x < result.width; x++) {
    const isBlank = result.colOpacity[x] === 0;
    if (!isBlank && !inSection) {
      inSection = true;
      start = x;
    } else if (isBlank && inSection) {
      inSection = false;
      sections.push({ start, end: x - 1 });
    }
  }
  if (inSection) {
    sections.push({ start, end: result.width - 1 });
  }

  console.log("Detected non-empty horizontal sections:", sections);
  await browser.close();
}

main().catch(console.error);
