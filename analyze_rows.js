const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcPath = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f/media__1779404636112.png';

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const imgBase64 = fs.readFileSync(srcPath, { encoding: 'base64' });
  const dataUrl = `data:image/png;base64,${imgBase64}`;

  const rowAnalysis = await page.evaluate(async (url) => {
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

        const rowCounts = [];
        for (let y = 0; y < canvas.height; y++) {
          let nonWhite = 0;
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            const a = data[idx+3];
            // If transparent or very white
            if (a > 10 && !(r > 250 && g > 250 && b > 250)) {
              nonWhite++;
            }
          }
          rowCounts.push(nonWhite);
        }
        resolve(rowCounts);
      };
      img.src = url;
    });
  }, dataUrl);

  console.log('Row analysis (non-white count per row):');
  rowAnalysis.forEach((cnt, idx) => {
    if (cnt > 0) {
      console.log(`Row ${idx}: ${cnt}`);
    } else {
      // Print first and last empty rows or just summary
    }
  });

  await browser.close();
}

main().catch(console.error);
