const fs = require("fs");

const file = "industry-4-0-automation-consultancy.html";

const potatoHtml = fs.readFileSync("potato-powder-making-consultancy.html", "utf8");
const potatoParts = potatoHtml.split("<!-- PLANT GALLERY -->");
if (potatoParts.length < 2) {
    console.error("Could not split potato file");
    process.exit(1);
}
const templateBottom = "<!-- PLANT GALLERY -->" + potatoParts[1];

if (!fs.existsSync(file)) process.exit(1);
const html = fs.readFileSync(file, "utf8");

const splitIndex = html.indexOf('<!-- â•');
let topHalf = html;
if (splitIndex !== -1) {
    topHalf = html.substring(0, splitIndex);
} else {
    const altSplit = html.indexOf('<div class="rcp-gallery__showcase">');
    if (altSplit !== -1) {
        topHalf = html.substring(0, altSplit);
        const lastSection = topHalf.lastIndexOf("</section>");
        if (lastSection !== -1) topHalf = topHalf.substring(0, lastSection + 10) + "\n\n      ";
    }
}

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

let ctaH2 = "";
let ctaP = "";

const ctaMatch = html.match(/<div class="rcp-cta__box">\s*<h2>(.*?)<\/h2>\s*<p>(.*?)<\/p>/s);
if (ctaMatch) {
    ctaH2 = ctaMatch[1];
    ctaP = ctaMatch[2];
}

let newBottom = templateBottom;

if (mainImgSrc) {
    newBottom = newBottom.replace(/<img src="public\/images\/turnkey-projects\/potato-powder\/1\.jpg" alt="Potato Powder Plant" class="rcp-gallery__main-img" id="mainGalleryImg"/, `<img src="${mainImgSrc}" alt="${mainImgAlt}" class="rcp-gallery__main-img" id="mainGalleryImg"`);
}
if (mainImgCaption) {
    newBottom = newBottom.replace(/<div class="rcp-gallery__caption" id="mainGalleryCaption">Potato Powder Plant Setup<\/div>/, `<div class="rcp-gallery__caption" id="mainGalleryCaption">${mainImgCaption}</div>`);
}

for (let i = 0; i < thumbs.length; i++) {
    const thumbNum = i + 1;
    const pSrc = `public/images/turnkey-projects/potato-powder/${thumbNum}.jpg`;
    newBottom = newBottom.split(`data-src="${pSrc}"`).join(`data-src="${thumbs[i].dataSrc}"`);
    newBottom = newBottom.split(`img src="${pSrc}"`).join(`img src="${thumbs[i].imgSrc}"`);
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
