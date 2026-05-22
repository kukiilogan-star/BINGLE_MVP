const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcDir = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f';
const destDir = '/Users/logan/Desktop/np_development/public/images';

const newImages = [
  { src: 'bingle_tired_v2_1779414185497.png', dest: 'bingle_tired.png' },
  { src: 'bingle_shocked_v2_1779414207538.png', dest: 'bingle_shocked.png' },
  { src: 'bingle_frozen_v2_1779414226297.png', dest: 'bingle_frozen.png' }
];

async function main() {
  console.log('Launching headless browser to process transparency...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const item of newImages) {
    const srcPath = path.join(srcDir, item.src);
    const destPath = path.join(destDir, item.dest);

    if (!fs.existsSync(srcPath)) {
      console.error(`Source image not found: ${srcPath}`);
      continue;
    }

    console.log(`Processing background for ${item.src} -> ${item.dest}...`);
    const imgBase64 = fs.readFileSync(srcPath, { encoding: 'base64' });
    const dataUrl = `data:image/png;base64,${imgBase64}`;

    // Perform canvas processing inside headless browser
    const processedBase64 = await page.evaluate(async (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Replace white background with transparency
          // We can check if all RGB values are very close to white (e.g., > 245)
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Soft thresholding to prevent white borders while keeping the ice clear
            if (r > 245 && g > 245 && b > 245) {
              data[i + 3] = 0; // alpha = 0
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => reject(err);
        img.src = url;
      });
    }, dataUrl);

    // Save processed image
    const base64Data = processedBase64.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(destPath, base64Data, 'base64');
    console.log(`Successfully saved transparent character to ${item.dest}`);
  }

  await browser.close();
  console.log('Background transparency processing completed successfully!');
}

main().catch(err => {
  console.error('Error during image processing:', err);
});
