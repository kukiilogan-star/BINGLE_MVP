const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const srcDir = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f';
const destDir = '/Users/logan/Desktop/np_development/public/images';

const imagesToProcess = [
  { src: 'media__1779404636112.png', dest: 'bingle_happy.png' },
  { src: 'bingle_sleeping_1779405178190.png', dest: 'bingle_sleeping.png' },
  { src: 'bingle_angry_1779405196687.png', dest: 'bingle_angry.png' },
  { src: 'bingle_hot_redesigned_1779406594414.png', dest: 'bingle_hot.png' },
  { src: 'bingle_crying_1779408436693.png', dest: 'bingle_crying.png' },
  { src: 'bingle_excited_1779408457680.png', dest: 'bingle_excited.png' },
  { src: 'bingle_tired_v2_1779414185497.png', dest: 'bingle_tired.png' },
  { src: 'bingle_shocked_v2_1779414207538.png', dest: 'bingle_shocked.png' },
  { src: 'bingle_frozen_v2_1779414226297.png', dest: 'bingle_frozen.png' }
];

async function main() {
  console.log('Starting SUPER CLEAN Bingle Background Removal (Nukki)...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const item of imagesToProcess) {
    const srcPath = path.join(srcDir, item.src);
    const destPath = path.join(destDir, item.dest);

    if (!fs.existsSync(srcPath)) {
      console.error(`Source image not found: ${srcPath}`);
      continue;
    }

    console.log(`Processing: ${item.src} -> ${item.dest}`);
    const imgBase64 = fs.readFileSync(srcPath, { encoding: 'base64' });
    const dataUrl = `data:image/png;base64,${imgBase64}`;

    // Run custom Canvas flood fill and border-shaving inside Headless Puppeteer
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

          const width = canvas.width;
          const height = canvas.height;
          const imgData = ctx.getImageData(0, 0, width, height);
          const data = imgData.data;

          const getIndex = (x, y) => (y * width + x) * 4;

          // 1. Boundary-Connected Flood Fill (BFS) to remove background
          const visited = new Uint8Array(width * height);
          const queue = [];

          // Initialize flood fill queue with all border coordinates
          for (let x = 0; x < width; x++) {
            queue.push([x, 0]);
            visited[0 * width + x] = 1;
            queue.push([x, height - 1]);
            visited[(height - 1) * width + x] = 1;
          }
          for (let y = 1; y < height - 1; y++) {
            queue.push([0, y]);
            visited[y * width + 0] = 1;
            queue.push([width - 1, y]);
            visited[y * width + (width - 1)] = 1;
          }

          let head = 0;
          while (head < queue.length) {
            const [cx, cy] = queue[head++];
            const idx = getIndex(cx, cy);
            
            // Set background pixel fully transparent
            data[idx + 3] = 0;

            const neighbors = [
              [cx + 1, cy],
              [cx - 1, cy],
              [cx, cy + 1],
              [cx, cy - 1]
            ];

            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const npos = ny * width + nx;
                if (!visited[npos]) {
                  const nidx = npos * 4;
                  const nr = data[nidx];
                  const ng = data[nidx + 1];
                  const nb = data[nidx + 2];

                  // Treat as background if it is light gray or white
                  const isLight = (nr > 200 && ng > 200 && nb > 200) || (nr + ng + nb > 600);
                  
                  if (isLight) {
                    visited[npos] = 1;
                    queue.push([nx, ny]);
                  }
                }
              }
            }
          }

          // 2. Clear outer borders (5px safety margin) and any residual white pixels
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = getIndex(x, y);
              
              // Shave off the outer 6 pixels completely to ensure NO borders remain!
              if (x < 6 || x >= width - 6 || y < 6 || y >= height - 6) {
                data[idx + 3] = 0;
              } else {
                // Secondary check: any pixel that is near-white (> 238) gets cleared
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                if (r > 238 && g > 238 && b > 238) {
                  data[idx + 3] = 0;
                }
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => reject(err);
        img.src = url;
      });
    }, dataUrl);

    // Write file back to target
    const base64Data = processedBase64.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(destPath, base64Data, 'base64');
    console.log(`Successfully completed and saved: ${item.dest}`);
  }

  await browser.close();
  console.log('SUPER CLEAN background removal completed successfully for all Bingle assets!');
}

main().catch(console.error);
