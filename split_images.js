const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcPath = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f/media__1779404636112.png';
const destDir = '/Users/logan/Desktop/np_development/public/images';

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const imgBase64 = fs.readFileSync(srcPath, { encoding: 'base64' });
  const dataUrl = `data:image/png;base64,${imgBase64}`;

  const results = await page.evaluate(async (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvasHappy = document.createElement('canvas');
        const canvasHot = document.createElement('canvas');

        // Split height in half: top = 233, bottom = 234 (total 467)
        const splitY = 233;

        canvasHappy.width = img.width;
        canvasHappy.height = splitY;
        const ctxHappy = canvasHappy.getContext('2d');
        ctxHappy.drawImage(img, 0, 0, img.width, splitY, 0, 0, img.width, splitY);

        canvasHot.width = img.width;
        canvasHot.height = img.height - splitY;
        const ctxHot = canvasHot.getContext('2d');
        ctxHot.drawImage(img, 0, splitY, img.width, img.height - splitY, 0, 0, img.width, img.height - splitY);

        // Background removal function (R,G,B > 240)
        const makeTransparent = (canvas) => {
          const ctx = canvas.getContext('2d');
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            const a = data[i+3];
            // If white background or close to white, make transparent
            if (r > 240 && g > 240 && b > 240) {
              data[i+3] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          return canvas.toDataURL('image/png');
        };

        resolve({
          happy: makeTransparent(canvasHappy),
          hot: makeTransparent(canvasHot)
        });
      };
      img.onerror = reject;
      img.src = url;
    });
  }, dataUrl);

  fs.writeFileSync(path.join(destDir, 'bingle_happy.png'), results.happy.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync(path.join(destDir, 'bingle_hot.png'), results.hot.replace(/^data:image\/png;base64,/, ''), 'base64');

  console.log('Successfully cropped and saved bingle_happy.png and bingle_hot.png with transparent backgrounds!');
  await browser.close();
}

main().catch(console.error);
