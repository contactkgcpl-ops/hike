const fs = require('fs');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let withInline = [];
let withoutInline = [];
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('const mainImg = document.getElementById(') && content.includes('function showImage')) {
        withInline.push(file);
    } else if (content.includes('id="mainGalleryImg"') || content.includes("id='mainGalleryImg'")) {
        withoutInline.push(file);
    }
});
console.log('With Inline JS:', withInline.join(', '));
console.log('Missing JS:', withoutInline.join(', '));
