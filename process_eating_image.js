const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcPath = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f/bingle_eating_raw_1779429622012.png';
const destPath = '/Users/logan/Desktop/np_development/public/images/bingle_eating.png';

async function main() {
  if (!fs.existsSync(srcPath)) {
    console.error(`Source image not found: ${srcPath}`);
    process.exit(1);
  }

  console.log('Launching headless browser to process transparency...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Processing background transparency for ${srcPath} -> ${destPath}...`);
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
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Soft thresholding to prevent white borders while keeping the Bingle clear
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
  console.log(`Successfully saved transparent eating Bingle character to ${destPath}`);

  await browser.close();
}

main().catch(err => {
  console.error('Error during image processing:', err);
});
