const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let issues = [];

htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const regex = /src=["']([^"']+)["']/g;
    const bgRegex = /background-image:\s*url\(['"]?([^)'"]+)['"]?\)/g;
    
    let match;
    const checkPath = (src) => {
        if(src.startsWith('http') || src.startsWith('data:')) return;
        
        let relativeSrc = src;
        if (src.startsWith('/')) relativeSrc = src.substring(1);
        
        // Decode URI component because HTML src might be encoded (e.g., %20 for space)
        let decodedSrc = src;
        try {
            decodedSrc = decodeURIComponent(src);
        } catch(e) {}
        
        if (decodedSrc.startsWith('/')) decodedSrc = decodedSrc.substring(1);
        
        // Convert to OS path
        const osPath = decodedSrc.split('/').join(path.sep);
        const fullPath = path.resolve(dir, osPath);
        
        if (!fs.existsSync(fullPath)) {
            issues.push(`File does not exist: ${src} in ${file}`);
        } else if (src.includes(' ') || src.includes('%20')) {
            issues.push(`Space in filename/path: ${src} in ${file}`);
        } else if (/[^a-zA-Z0-9\-\.\/\_\%]/.test(src)) {
            issues.push(`Special characters in filename/path: ${src} in ${file}`);
        }
    };

    while ((match = regex.exec(content)) !== null) {
        checkPath(match[1]);
    }
    
    while ((match = bgRegex.exec(content)) !== null) {
        checkPath(match[1]);
    }
});

if (issues.length > 0) {
    console.log(issues.join('\n'));
} else {
    console.log("No issues found with spaces, special characters, or missing files.");
}
