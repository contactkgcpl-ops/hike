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

newContent = newContent.replace(/<div class="rcp-hero__bg" style="background-image: url\('[^']+'\)"><\/div>/, `<div class="rcp-hero__bg" style="background-image: url('${heroImg}')"></div>`);

newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/6\.jpg/i, 'public/images/turnkey-projects/instant-mix-frozen-food/1.jpg');
newContent = newContent.replace(/alt="fully automated instant mix & frozen food plant Processing Plant"/i, 'alt="Fully Automated Instant Mix & Frozen Food Plant"');

newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/1\.jpg/i, 'public/images/turnkey-projects/instant-mix-frozen-food/2.jpg');
newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/2\.jpg/i, 'public/images/turnkey-projects/instant-mix-frozen-food/3.jpg');
newContent = newContent.replace(/public\/images\/turnkey-projects\/potato-powder\/3\.jpg/i, 'public/images/turnkey-projects/instant-mix-frozen-food/4.jpg');

// Correct regex to remove the wrapper correctly:
newContent = newContent.replace(/<div class="rcp-machine-card__image-wrapper">\s*<img src="public\/images\/turnkey-projects\/potato-powder\/[456]\.jpg"[\s\S]*?<\/div>\s*<\/div>/gi, '');

const galleryHTML = `          <div class="rcp-gallery__showcase">
            <div class="rcp-gallery__main-image">
              <img id="mainGalleryImg" src="public/images/turnkey-projects/instant-mix-frozen-food/5.jpg" alt="Fully Automated Instant Mix & Frozen Food Plant Gallery 1" loading="lazy"/>
              <div class="rcp-gallery__caption" id="mainGalleryCaption">Fully Automated Instant Mix & Frozen Food Plant Gallery 1</div>
            </div>
            <div class="rcp-gallery__thumbnails">
              <div class="rcp-gallery__thumb rcp-gallery__thumb--active" data-src="public/images/turnkey-projects/instant-mix-frozen-food/5.jpg" data-caption="Fully Automated Instant Mix & Frozen Food Plant Gallery 1">
                <img src="public/images/turnkey-projects/instant-mix-frozen-food/5.jpg" alt="Thumb 1" loading="lazy"/>
              </div>
              <div class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/instant-mix-frozen-food/6.jpg" data-caption="Fully Automated Instant Mix & Frozen Food Plant Gallery 2">
                <img src="public/images/turnkey-projects/instant-mix-frozen-food/6.jpg" alt="Thumb 2" loading="lazy"/>
              </div>
            </div>
          </div>`;

newContent = newContent.replace(/<div class="rcp-gallery__showcase">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, galleryHTML + '\n        </div>\n      </section>');

fs.writeFileSync(file, newContent, 'utf8');
