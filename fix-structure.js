const fs = require("fs");
const cheerio = require("cheerio");

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
const potatoBottomMatch = potatoHtml.match(/(<!-- PLANT GALLERY -->[\s\S]*)/);
if (!potatoBottomMatch) {
    console.log("Could not find PLANT GALLERY in potato");
    process.exit(1);
}
const potatoBottom = potatoBottomMatch[1];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const targetHtml = fs.readFileSync(file, "utf8");
    
    // Extract target content using cheerio
    const $ = cheerio.load(targetHtml);
    
    const galleryMainSrc = $("#mainGalleryImg").attr("src") || "";
    const galleryMainAlt = $("#mainGalleryImg").attr("alt") || "";
    const galleryMainCaption = $("#mainGalleryCaption").text() || "";
    
    const thumbs = [];
    $(".rcp-gallery__thumb").each((i, el) => {
        thumbs.push({
            src: $(el).attr("data-src") || "",
            caption: $(el).attr("data-caption") || "",
            aria: $(el).attr("aria-label") || "",
            imgSrc: $(el).find("img").attr("src") || "",
            imgAlt: $(el).find("img").attr("alt") || ""
        });
    });
    
    const ctaH2 = $("#enquiry h2").html() || "";
    const ctaP = $("#enquiry p").html() || "";
    
    // Now create the new bottom part by injecting target content into potatoBottom
    let newBottom = potatoBottom;
    
    // Replace gallery main
    const $pb = cheerio.load(newBottom, null, false);
    
    $pb("#mainGalleryImg").attr("src", galleryMainSrc).attr("alt", galleryMainAlt);
    if (galleryMainCaption) $pb("#mainGalleryCaption").text(galleryMainCaption);
    
    $pb(".rcp-gallery__thumb").each((i, el) => {
        if (thumbs[i]) {
            $pb(el).attr("data-src", thumbs[i].src);
            $pb(el).attr("data-caption", thumbs[i].caption);
            $pb(el).attr("aria-label", thumbs[i].aria);
            $pb(el).find("img").attr("src", thumbs[i].imgSrc).attr("alt", thumbs[i].imgAlt);
        }
    });
    
    if (ctaH2) $pb("#enquiry h2").html(ctaH2);
    if (ctaP) $pb("#enquiry p").html(ctaP);
    
    // We want the modified HTML of the bottom. Since cheerio wraps things, we can just get the HTML of the loaded root.
    newBottom = $pb.html();
    
    // To preserve formatting, cheerio's output is generally clean enough for the bottom part since we used {decodeEntities: false} default.
    // Let's replace the bottom half of the target file.
    const targetTopMatch = targetHtml.match(/([\s\S]*?)(<!-- PLANT GALLERY -->)/);
    if (targetTopMatch) {
        const finalHtml = targetTopMatch[1] + newBottom;
        fs.writeFileSync(file, finalHtml);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find PLANT GALLERY in ${file}`);
    }
});
