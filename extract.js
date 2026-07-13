const fs = require('fs');

const projectsFile = 'c:/Users/digesh prajapati/Desktop/hike/hike/projects.html';
const content = fs.readFileSync(projectsFile, 'utf8');

const regex = /<div class="relative bg-white rounded-2xl shadow-\[0_4px_20px_rgb\(0,0,0,0\.05\)\] hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.08\)\] border border-gray-100 p-6 flex justify-center items-center h-\[350px\] transition-all duration-300 overflow-hidden group">\s*<img src="([^"]+)" alt="([^"]+)" class="[^"]+" \/>\s*<div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black\/[^ ]+ to-transparent px-6 pb-4 pt-16 flex items-end">\s*<h3 class="text-white font-heading font-bold text-lg md:text-xl leading-snug drop-shadow-sm">\s*([^<]+)\s*<\/h3>\s*<\/div>\s*<\/div>/g;

let match;
const foundProjects = [];
while ((match = regex.exec(content)) !== null) {
  foundProjects.push({
    match: match[0],
    imgSrc: match[1],
    imgAlt: match[2],
    title: match[3].trim()
  });
}

console.log(JSON.stringify(foundProjects, null, 2));
