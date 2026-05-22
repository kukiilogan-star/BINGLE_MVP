const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcDir = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f';
const destDir = '/Users/logan/Desktop/np_development/public/images';

// We want to process:
// bingle_sleeping_1779405178190.png -> bingle_sleeping.png
// bingle_angry_1779405196687.png -> bingle_angry.png

const characters = [
  { src: 'bingle_sleeping_1779405178190.png', dest: 'bingle_sleeping.png' },
  { src: 'bingle_angry_1779405196687.png', dest: 'bingle_angry.png' }
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const char of characters) {
    const srcPath = path.join(srcDir, char.src);
    const destPath = path.join(destDir, char.dest);

    if (!fs.existsSync(srcPath)) {
      console.error(`Source character not found: ${srcPath}`);
      continue;
    }

    console.log(`Processing background for ${char.src} -> ${char.dest}...`);
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

          // Replace white/off-white background with absolute transparency
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (r > 240 && g > 240 && b > 240) {
              data[i + 3] = 0; // alpha = 0 (fully transparent)
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
    console.log(`Saved transparent character to ${char.dest}`);
  }

  await browser.close();
  console.log('Background removal finished successfully!');
}

main().catch(err => {
  console.error('Error during image processing:', err);
});
