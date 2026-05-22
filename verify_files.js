const fs = require('fs');

const path1 = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f/media__1779404636112.png';
const path2 = '/Users/logan/.gemini/antigravity/brain/e1eeb2d6-f6f0-44f1-a85b-0760f790bf3f/media__1779404636112.png_1.png';

const tempPath1 = '/Users/logan/.gemini/antigravity/brain/tempmediaStorage/media__1779404636112.png';
const tempPath2 = '/Users/logan/.gemini/antigravity/brain/tempmediaStorage/media__1779404636112.png_1.png';

console.log('Artifact Path 1 exists:', fs.existsSync(path1));
console.log('Artifact Path 2 exists:', fs.existsSync(path2));
console.log('Temp Path 1 exists:', fs.existsSync(tempPath1));
console.log('Temp Path 2 exists:', fs.existsSync(tempPath2));
