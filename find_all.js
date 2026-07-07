const fs = require('fs');
const path = require('path');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let missing = [];
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Using a simpler regex that doesn't need complex escaping in PowerShell, though we are in a file now
    const regex = /src=["']([^"']+\.(?:jpg|png|webp|jpeg))["']/gi;
    let match;
    while((match = regex.exec(content)) !== null) {
        let src = match[1];
        if (src.startsWith('http') || src.startsWith('data:')) continue;
        if (src.startsWith('/')) src = src.substring(1);
        src = decodeURIComponent(src);
        const resolved = path.resolve('.', src.replace(/\//g, path.sep));
        if (!fs.existsSync(resolved)) {
            missing.push(file + ' -> ' + src);
        }
    }
});
console.log('Missing count:', missing.length);
if(missing.length) console.log(missing.join('\n'));
