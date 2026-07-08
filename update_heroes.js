const fs = require('fs');

function updateHeroImage(file, newPath) {
    if (!fs.existsSync(file)) {
        console.log(`File not found: ${file}`);
        return;
    }
    let html = fs.readFileSync(file, 'utf8');
    
    // Using a regex that captures the rcp-hero__bg div and replaces only its background-image URL
    html = html.replace(
        /(<div class="rcp-hero__bg" style="background-image:\s*url\(')[^']*('\)"><\/div>)/g, 
        `$1${newPath}$2`
    );
    
    fs.writeFileSync(file, html);
    console.log(`Updated ${file}`);
}

updateHeroImage('protein-powder-production-plant-consultancy.html', 'public/images/turnkey-projects/protein-powder/hero-banner.png');
updateHeroImage('fry-onions-processing-packaging-plant-consultancy.html', 'public/images/turnkey-projects/fry-onions/hero-banner.png');
updateHeroImage('nutrition-powder-making-production-plant-consultancy.html', 'public/images/turnkey-projects/nutrition-powder/hero-banner.png');
updateHeroImage('economical-kurkure-making-plant-consultancy.html', 'public/images/turnkey-projects/kurkure/hero-banner.png');
