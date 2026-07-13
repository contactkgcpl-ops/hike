const fs = require('fs');
let html = fs.readFileSync('milk-powder-processing-plant-consultancy.html', 'utf8');

// Replace potato-powder with milk-powder-processing
html = html.replace(/turnkey-projects\/potato-powder\//g, 'turnkey-projects/milk-powder-processing/');

// Fix Overview image to 1.jpg instead of 6.jpg (which comes from replacing potato-powder/6.jpg)
html = html.replace(
  /<div class="rcp-overview__image rcp-overview__image--photo">\s*<img src="public\/images\/turnkey-projects\/milk-powder-processing\/6\.jpg"/,
  '<div class="rcp-overview__image rcp-overview__image--photo">\n              <img src="public/images/turnkey-projects/milk-powder-processing/1.jpg"'
);

// Fix Plant Gallery
const galleryHTML = `
          <div class="rcp-gallery__showcase">
            <div class="rcp-gallery__main">
              <img src="public/images/turnkey-projects/milk-powder-processing/1.jpg" alt="Fully Automated Milk Powder Processing Plant - Facility View" class="rcp-gallery__main-img" id="mainGalleryImg" loading="lazy"/>
              <div class="rcp-gallery__caption" id="mainGalleryCaption">Fully Automated Milk Powder Processing Plant - Facility View</div>
            </div>
            <div class="rcp-gallery__thumbs">
              <button class="rcp-gallery__thumb rcp-gallery__thumb--active" data-src="public/images/turnkey-projects/milk-powder-processing/1.jpg" data-caption="Fully Automated Milk Powder Processing Plant - Facility View" aria-label="View Facility View">
                <img src="public/images/turnkey-projects/milk-powder-processing/1.jpg" alt="Facility View" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/milk-powder-processing/2.jpg" data-caption="Fully Automated Milk Powder Processing Plant - View 2" aria-label="View View 2">
                <img src="public/images/turnkey-projects/milk-powder-processing/2.jpg" alt="View 2" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/milk-powder-processing/3.jpg" data-caption="Fully Automated Milk Powder Processing Plant - View 3" aria-label="View View 3">
                <img src="public/images/turnkey-projects/milk-powder-processing/3.jpg" alt="View 3" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/milk-powder-processing/4.jpg" data-caption="Fully Automated Milk Powder Processing Plant - View 4" aria-label="View View 4">
                <img src="public/images/turnkey-projects/milk-powder-processing/4.jpg" alt="View 4" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/milk-powder-processing/5.jpg" data-caption="Fully Automated Milk Powder Processing Plant - View 5" aria-label="View View 5">
                <img src="public/images/turnkey-projects/milk-powder-processing/5.jpg" alt="View 5" loading="lazy"/>
              </button>
              <button class="rcp-gallery__thumb" data-src="public/images/turnkey-projects/milk-powder-processing/6.jpg" data-caption="Fully Automated Milk Powder Processing Plant - View 6" aria-label="View View 6">
                <img src="public/images/turnkey-projects/milk-powder-processing/6.jpg" alt="View 6" loading="lazy"/>
              </button>
            </div>
          </div>
`;

html = html.replace(/<div class="rcp-gallery__showcase">\s*<!-- Images will be added later -->\s*<\/div>/, galleryHTML.trim());

fs.writeFileSync('milk-powder-processing-plant-consultancy.html', html);
console.log('Done');
