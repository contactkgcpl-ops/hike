const fs = require('fs');
const potato = fs.readFileSync('potato-powder-making-consultancy.html', 'utf8');
const turmeric = fs.readFileSync('turmeric-powder-consultancy.html', 'utf8');

const getGallery = (html) => {
    const start = html.indexOf('<div class="rcp-gallery__showcase">');
    const end = html.indexOf('</section>', start);
    return html.substring(start, end);
};

console.log('--- POTATO ---');
console.log(getGallery(potato));
console.log('\n--- TURMERIC ---');
console.log(getGallery(turmeric));
