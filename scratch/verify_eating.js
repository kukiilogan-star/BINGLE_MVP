const fs = require('fs');
const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const imgPath = '/Users/logan/Desktop/np_development/public/images/bingle_eating.png';
  if (!fs.existsSync(imgPath)) {
    console.error('File does not exist:', imgPath);
    await browser.close();
    return;
  }
  
  const imgBase64 = fs.readFileSync(imgPath, { encoding: 'base64' });
  const dataUrl = `data:image/png;base64,${imgBase64}`;
  
  const pixels = await page.evaluate(async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, 10, 10).data;
        const cornerPixels = [];
        for (let i = 0; i < 40; i += 4) {
          cornerPixels.push({
            r: data[i],
            g: data[i+1],
            b: data[i+2],
            a: data[i+3]
          });
        }
        resolve(cornerPixels);
      };
      img.src = url;
    });
  }, dataUrl);
  
  console.log('First 10 pixels at top row:', pixels);
  await browser.close();
}

main().catch(console.error);
