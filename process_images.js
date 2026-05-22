const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcDir = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f';
const destDir = '/Users/logan/Desktop/np_development/public/images';

// Files to copy directly (backdrops)
const copies = [
  { src: 'ice_igloo_bg_1779372416755.png', dest: 'ice_igloo_bg.png' },
  { src: 'fridge_shelves_bg_1779372434708.png', dest: 'fridge_shelves_bg.png' }
];

// Files to remove background (누끼)
const characters = [
  { src: 'bingle_sleeping_1779372382845.png', dest: 'bingle_sleeping.png' },
  { src: 'bingle_angry_1779372398938.png', dest: 'bingle_angry.png' }
];

async function main() {
  // 1. Copy the backdrops
  console.log('--- Copying backdrop scenes ---');
  for (const c of copies) {
    const srcPath = path.join(srcDir, c.src);
    const destPath = path.join(destDir, c.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${c.src} to ${c.dest}`);
    } else {
      console.error(`Source not found: ${srcPath}`);
    }
  }

  // 2. Process characters using Puppeteer Canvas
  console.log('\n--- Processing character backgrounds with Puppeteer Canvas ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const char of characters) {
    const srcPath = path.join(srcDir, char.src);
    const destPath = path.join(destDir, char.dest);

    if (!fs.existsSync(srcPath)) {
      console.error(`Source character not found: ${srcPath}`);
      continue;
    }

    console.log(`Processing ${char.src} -> ${char.dest}...`);
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
          // We look for pixels where R, G, B are all > 245
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
  console.log('\nProcessing completed successfully!');
}

main().catch(err => {
  console.error('Error during image processing:', err);
});
