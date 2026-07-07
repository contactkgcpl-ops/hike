const fs = require('fs');
const path = require('path');
const http = require('http');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let imageSet = new Set();

htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    const bgRegex = /background-image:\s*url\(['"]?([^)'"]+)['"]?\)/g;
    
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        if (!match[1].startsWith('http') && !match[1].startsWith('data:')) {
            imageSet.add(match[1]);
        }
    }
    while ((match = bgRegex.exec(content)) !== null) {
        if (!match[1].startsWith('http') && !match[1].startsWith('data:')) {
            imageSet.add(match[1]);
        }
    }
});

const checkImage = (src) => {
    return new Promise((resolve) => {
        let reqPath = src.startsWith('/') ? src : '/' + src;
        // Escape characters correctly
        reqPath = encodeURI(reqPath);
        
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: reqPath,
            method: 'HEAD'
        }, (res) => {
            if (res.statusCode === 404) {
                resolve({ src, ok: false, status: 404 });
            } else {
                resolve({ src, ok: true, status: res.statusCode });
            }
        });
        req.on('error', (e) => {
            resolve({ src, ok: false, error: e.message });
        });
        req.end();
    });
};

async function checkAll() {
    console.log(`Checking ${imageSet.size} unique image URLs against localhost:3000...`);
    let broken = [];
    for (const src of Array.from(imageSet)) {
        // Skip template literals from js
        if (src.includes('${')) continue;
        
        const res = await checkImage(src);
        if (!res.ok) {
            broken.push(src);
            console.log(`BROKEN (404): ${src}`);
        }
    }
    if (broken.length === 0) {
        console.log("All images loaded successfully!");
    } else {
        console.log(`\nFound ${broken.length} broken images.`);
    }
}

checkAll();
