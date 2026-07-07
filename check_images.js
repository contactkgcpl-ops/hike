const fs = require('fs');
const path = require('path');

const dir = __dirname;

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
        } else {
            if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });
    return arrayOfFiles;
}

const allFiles = getAllFiles(dir);

let brokenImages = [];

function checkPath(src, file) {
    if (src.startsWith('http') || src.startsWith('data:')) return; // ignore external and base64
    
    let relativeSrc = src;
    if (src.startsWith('/')) relativeSrc = src.substring(1);
    
    let decodedSrc = src;
    try {
        decodedSrc = decodeURIComponent(src);
    } catch(e) {}
    
    if (decodedSrc.startsWith('/')) decodedSrc = decodedSrc.substring(1);
    
    // Convert to OS path
    const osPath = decodedSrc.split('/').join(path.sep);
    
    // CSS URLs might be relative to the CSS file
    let fullPath;
    if (file.endsWith('.css') && !decodedSrc.startsWith('/')) {
        fullPath = path.resolve(path.dirname(file), osPath);
    } else {
        fullPath = path.resolve(dir, osPath);
    }
    
    if (!fs.existsSync(fullPath)) {
        brokenImages.push({ file: path.relative(dir, file), src, issue: "File does not exist" });
    }
}

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    const bgRegex = /background-image:\s*url\(['"]?([^)'"]+)['"]?\)/g;
    const cssBgRegex = /url\(['"]?([^)'"]+)['"]?\)/g;
    
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        checkPath(match[1], file);
    }
    
    if (file.endsWith('.html')) {
        while ((match = bgRegex.exec(content)) !== null) {
            checkPath(match[1], file);
        }
    }
    
    if (file.endsWith('.css')) {
        while ((match = cssBgRegex.exec(content)) !== null) {
            checkPath(match[1], file);
        }
    }
});

if (brokenImages.length > 0) {
    console.log(`Found ${brokenImages.length} broken image references:`);
    const grouped = brokenImages.reduce((acc, curr) => {
        const key = `${curr.src} (${curr.issue})`;
        if (!acc[key]) acc[key] = [];
        if (!acc[key].includes(curr.file)) acc[key].push(curr.file);
        return acc;
    }, {});
    
    for (const [key, files] of Object.entries(grouped)) {
        console.log(`\nBROKEN SRC: ${key}`);
        console.log(`Used in ${files.length} files. (e.g. ${files.slice(0, 5).join(', ')})`);
    }
} else {
    console.log("No broken images found in HTML/CSS/JS!");
}
