const fs = require("fs");

const files = [
    "green-tea-processing-consultancy.html",
    "mill-plant-consultancy.html",
    "peanut-oil-mill-plant-consultancy.html",
    "edible-oil-production-line-consultancy.html",
    "wheat-flour-production-consultancy.html",
    "coriander-powder-making-consultancy.html",
    "cashew-nut-processing-consultancy.html"
];

const potatoHtml = fs.readFileSync("potato-powder-making-consultancy.html", "utf8");
const potatoParts = potatoHtml.split("<!-- PLANT GALLERY -->");
if (potatoParts.length < 2) {
    console.error("Could not split potato file");
    process.exit(1);
}
const templateBottom = "<!-- PLANT GALLERY -->" + potatoParts[1];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const html = fs.readFileSync(file, "utf8");
    
    // Find where the gallery starts in the broken file
    // It usually starts around line 344: <!-- â• â• â•  Gallery</span></h2>
    // But let's just find the first instance of rcp-gallery__showcase or similar.
    // Actually, let's look for `<div class="rcp-gallery__showcase">` and take everything before it,
    // wait, the broken part is before it. Let's look for `</section>` of the FAQ section!
    // The previous section is FAQ.
    
    const faqEndRegex = /<\/section>\s*(?=<!-- (â•||\?)+ (Gallery|CTA).*)/;
    // Let's just find the FAQ section end explicitly.
    // In potato:
    //       </section>
    // 
    //       <!-- PLANT GALLERY -->
    const splitIndex = html.indexOf('<!-- â•');
    let topHalf = html;
    if (splitIndex !== -1) {
        topHalf = html.substring(0, splitIndex);
    } else {
        // Try another split
        const altSplit = html.indexOf('<div class="rcp-gallery__showcase">');
        if (altSplit !== -1) {
            topHalf = html.substring(0, altSplit);
            // go back to find the previous </section>
            const lastSection = topHalf.lastIndexOf("</section>");
            if (lastSection !== -1) topHalf = topHalf.substring(0, lastSection + 10) + "\n\n      ";
        }
    }
    
    // Extract gallery images and captions from the target file
    // Main image: <img src="..." alt="..." class="rcp-gallery__main-img" id="mainGalleryImg"
    let mainImgSrc = "";
    let mainImgAlt = "";
    let mainImgCaption = "";
    
    const mainImgMatch = html.match(/id="mainGalleryImg"[^>]*src="([^"]+)"[^>]*alt="([^"]+)"/i) || html.match(/src="([^"]+)"[^>]*alt="([^"]+)"[^>]*id="mainGalleryImg"/i);
    if (mainImgMatch) {
        mainImgSrc = mainImgMatch[1];
        mainImgAlt = mainImgMatch[2];
    }
    
    const mainCapMatch = html.match(/id="mainGalleryCaption">([^<]+)</i);
    if (mainCapMatch) mainImgCaption = mainCapMatch[1];
    
    // Thumbs
    const thumbs = [];
    const thumbRegex = /<button class="rcp-gallery__thumb[^>]*data-src="([^"]+)"\s*data-caption="([^"]+)"\s*aria-label="([^"]+)">\s*<img src="([^"]+)" alt="([^"]+)"/g;
    let match;
    while ((match = thumbRegex.exec(html)) !== null) {
        thumbs.push({
            dataSrc: match[1],
            dataCaption: match[2],
            ariaLabel: match[3],
            imgSrc: match[4],
            imgAlt: match[5]
        });
    }
    
    // Extract CTA text
    // <h2>Ready to Set Up Your Cashew Processing Plant?</h2>
    // <p>Connect with Hike...</p>
    let ctaH2 = "";
    let ctaP = "";
    
    const ctaMatch = html.match(/<div class="rcp-cta__box">\s*<h2>(.*?)<\/h2>\s*<p>(.*?)<\/p>/s);
    if (ctaMatch) {
        ctaH2 = ctaMatch[1];
        ctaP = ctaMatch[2];
    }
    
    // Now replace inside templateBottom
    let newBottom = templateBottom;
    
    if (mainImgSrc) {
        newBottom = newBottom.replace(/<img src="public\/images\/turnkey-projects\/potato-powder\/1\.jpg" alt="Potato Powder Plant" class="rcp-gallery__main-img" id="mainGalleryImg"/, `<img src="${mainImgSrc}" alt="${mainImgAlt}" class="rcp-gallery__main-img" id="mainGalleryImg"`);
    }
    if (mainImgCaption) {
        newBottom = newBottom.replace(/<div class="rcp-gallery__caption" id="mainGalleryCaption">Potato Powder Plant Setup<\/div>/, `<div class="rcp-gallery__caption" id="mainGalleryCaption">${mainImgCaption}</div>`);
    }
    
    for (let i = 0; i < thumbs.length; i++) {
        // The template has thumbs 1 to 6.
        // We can just replace them sequentially.
        // A safer way is to replace the exact template strings for thumb[i]
        const thumbNum = i + 1;
        const pSrc = `public/images/turnkey-projects/potato-powder/${thumbNum}.jpg`;
        // Replace data-src and imgSrc
        newBottom = newBottom.split(`data-src="${pSrc}"`).join(`data-src="${thumbs[i].dataSrc}"`);
        newBottom = newBottom.split(`img src="${pSrc}"`).join(`img src="${thumbs[i].imgSrc}"`);
        
        // Replace data-caption
        newBottom = newBottom.replace(new RegExp(`data-caption="[^"]+"( aria-label="[^"]+")?>(?:\\s*)<img src="${thumbs[i].imgSrc}" alt="Thumbnail ${thumbNum}"`, "s"), `data-caption="${thumbs[i].dataCaption}" aria-label="${thumbs[i].ariaLabel}">\n                <img src="${thumbs[i].imgSrc}" alt="${thumbs[i].imgAlt}"`);
    }
    
    if (ctaH2) {
        newBottom = newBottom.replace(/<h2>Ready to Build Your Potato Powder Processing Business\?<\/h2>/, `<h2>${ctaH2}</h2>`);
    }
    if (ctaP) {
        newBottom = newBottom.replace(/<p>Connect with Hike's consultancy experts and get professional guidance for planning, launching, and scaling your potato powder production venture\.<\/p>/, `<p>${ctaP}</p>`);
    }
    
    const finalHtml = topHalf + newBottom;
    fs.writeFileSync(file, finalHtml);
    console.log(`Updated structure for ${file}`);
});
