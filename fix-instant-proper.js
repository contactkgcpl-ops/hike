const fs = require('fs');

const file = 'instant-mix-frozen-food-plant-consultancy.html';
const templateFile = 'potato-powder-making-consultancy.html';

let content = fs.readFileSync(file, 'utf8');
let template = fs.readFileSync(templateFile, 'utf8');

const heroMatch = content.match(/<div class="rcp-hero__bg" style="background-image: url\('([^']+)'\)"><\/div>/);
const heroImg = heroMatch ? heroMatch[1] : 'public/images/heroes/hero_instant_mix_frozen_1783411957196.png';

const title = "Fully Automated Instant Mix & Frozen Food Plant Consultancy";
let newContent = template;
newContent = newContent.replace(/Potato Powder Making Machine Consultancy/g, title);
newContent = newContent.replace(/Complete Potato Powder Plant/g, `Complete ${title.replace(/ Consultancy/i, '')}`);
newContent = newContent.replace(/potato powder/gi, title.replace(/ Consultancy/i, '').toLowerCase());
newContent = newContent.replace(/Potato Powder/g, title.replace(/ Consultancy/i, ''));
newContent = newContent.replace(/POTATO POWDER/g, title.replace(/ Consultancy/i, '').toUpperCase());

// Restore hero image
newContent = newContent.replace(/<div class="rcp-hero__bg" style="background-image: url\('[^']+'\)"><\/div>/, `<div class="rcp-hero__bg" style="background-image: url('${heroImg}')"></div>`);

// Fix alt attributes
newContent = newContent.replace(/alt="fully automated instant mix & frozen food plant Processing Plant"/ig, 'alt="Fully Automated Instant Mix & Frozen Food Plant"');

// Overview Image -> use 1.jpg
newContent = newContent.replace(
  /<div class="rcp-overview__image rcp-overview__image--photo">\s*<img src="public\/images\/turnkey-projects\/potato-powder\/6\.jpg" alt="[^"]+" loading="lazy" \/>/i,
  `<div class="rcp-overview__image rcp-overview__image--photo">\n              <img src="public/images/turnkey-projects/instant-mix-frozen-food/1.jpg" alt="Fully Automated Instant Mix & Frozen Food Plant" loading="lazy" />`
);

// Expertise Cards -> 1.jpg to 6.jpg
newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/1\.jpg/g, 'public/images/turnkey-projects/instant-mix-frozen-food/1.jpg');
newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/2\.jpg/g, 'public/images/turnkey-projects/instant-mix-frozen-food/2.jpg');
newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/3\.jpg/g, 'public/images/turnkey-projects/instant-mix-frozen-food/3.jpg');
newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/4\.jpg/g, 'public/images/turnkey-projects/instant-mix-frozen-food/4.jpg');
newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/5\.jpg/g, 'public/images/turnkey-projects/instant-mix-frozen-food/5.jpg');
newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/6\.jpg/g, 'public/images/turnkey-projects/instant-mix-frozen-food/6.jpg');

// Plant Gallery
let galleryHTML = `<div class="rcp-gallery__showcase">
            <div class="rcp-gallery__main-image">
              <img id="mainGalleryImg" src="public/images/turnkey-projects/instant-mix-frozen-food/1.jpg" alt="Gallery Image" loading="lazy"/>
              <div class="rcp-gallery__caption" id="mainGalleryCaption">Fully Automated Instant Mix & Frozen Food Plant - Facility View</div>
            </div>
            <div class="rcp-gallery__thumbnails">`;

for (let i = 1; i <= 6; i++) {
  galleryHTML += `
              <div class="rcp-gallery__thumb ${i === 1 ? 'rcp-gallery__thumb--active' : ''}" data-src="public/images/turnkey-projects/instant-mix-frozen-food/${i}.jpg" data-caption="Fully Automated Instant Mix & Frozen Food Plant - View ${i}">
                <img src="public/images/turnkey-projects/instant-mix-frozen-food/${i}.jpg" alt="Thumb ${i}" loading="lazy"/>
              </div>`;
}

galleryHTML += `
            </div>
          </div>`;

newContent = newContent.replace(/<div class="rcp-gallery__showcase">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, galleryHTML + '\n        </div>\n      </section>');

fs.writeFileSync(file, newContent, 'utf8');
console.log('Fixed instant mix HTML layout and images');
