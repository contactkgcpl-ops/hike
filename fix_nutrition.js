const fs = require('fs');
let html = fs.readFileSync('nutrition-powder-making-production-plant-consultancy.html', 'utf8');

// Replace detail page images potato-powder/1.jpg to 6.jpg with nutrition-powder-production/1.jpg to 6.jpg
html = html.replace(/turnkey-projects\/potato-powder\/(\d\.jpg)/g, 'turnkey-projects/nutrition-powder-production/$1');

// Fix Overview image to 1.jpg instead of 6.jpg 
html = html.replace(
  /<div class="rcp-overview__image rcp-overview__image--photo">\s*<img src="public\/images\/turnkey-projects\/nutrition-powder-production\/6\.jpg"/,
  '<div class="rcp-overview__image rcp-overview__image--photo">\n              <img src="public/images/turnkey-projects/nutrition-powder-production/1.jpg"'
);

// Fix Plant Gallery
const galleryHTML = `
          <div class="rcp-gallery__showcase">
            <div class="rcp-gallery__main">
              <img src="public/images/turnkey-projects/nutrition-powder-production/1.jpg" alt="Nutrition Powder Making Production Plant - Facility View" class="rcp-gallery__main-img" id="mainGalleryImg" loading="lazy"/>
              <div class="rcp-gallery__caption" id="mainGalleryCaption">Nutrition Powder Making Production Plant - Facility View</div>
            </div>
            <div class="rcp-gallery__thumbs">
              <button class="rcp-gallery__thumb rcp-gallery__thumb--active" data-src="public/images/turnkey-projects/nutrition-powder-production/1.jpg" data-caption="Nutrition Powder Making Production Plant - Facility View" aria-label="View Facility View">
                <img src="public/images/turnkey-projects/nutrition-powder-production/1.jpg" alt="Facility View" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/nutrition-powder-production/2.jpg" data-caption="Nutrition Powder Making Production Plant - View 2" aria-label="View View 2">
                <img src="public/images/turnkey-projects/nutrition-powder-production/2.jpg" alt="View 2" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/nutrition-powder-production/3.jpg" data-caption="Nutrition Powder Making Production Plant - View 3" aria-label="View View 3">
                <img src="public/images/turnkey-projects/nutrition-powder-production/3.jpg" alt="View 3" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/nutrition-powder-production/4.jpg" data-caption="Nutrition Powder Making Production Plant - View 4" aria-label="View View 4">
                <img src="public/images/turnkey-projects/nutrition-powder-production/4.jpg" alt="View 4" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/nutrition-powder-production/5.jpg" data-caption="Nutrition Powder Making Production Plant - View 5" aria-label="View View 5">
                <img src="public/images/turnkey-projects/nutrition-powder-production/5.jpg" alt="View 5" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/nutrition-powder-production/6.jpg" data-caption="Nutrition Powder Making Production Plant - View 6" aria-label="View View 6">
                <img src="public/images/turnkey-projects/nutrition-powder-production/6.jpg" alt="View 6" loading="lazy"/>
              </button>
            </div>
          </div>
`;

html = html.replace(/<div class="rcp-gallery__showcase">\s*<!-- Images will be added later -->\s*<\/div>/, galleryHTML.trim());

fs.writeFileSync('nutrition-powder-making-production-plant-consultancy.html', html);
console.log('Done');
