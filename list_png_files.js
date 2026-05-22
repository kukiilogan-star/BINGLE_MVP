const fs = require('fs');
const path = require('path');

const dirs = [
  '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f',
  '/Users/logan/.gemini/antigravity/brain/tempmediaStorage'
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`\nListing files in: ${dir}`);
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.png')) {
        const stats = fs.statSync(path.join(dir, file));
        console.log(`- ${file} (${stats.size} bytes)`);
      }
    });
  } else {
    console.log(`\nDirectory does not exist: ${dir}`);
  }
});
