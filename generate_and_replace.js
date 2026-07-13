const fs = require('fs');
const path = require('path');

const projectsFile = 'c:/Users/digesh prajapati/Desktop/hike/hike/projects.html';
const templateFile = 'c:/Users/digesh prajapati/Desktop/hike/hike/potato-powder-making-consultancy.html';
const targetDir = 'c:/Users/digesh prajapati/Desktop/hike/hike';

let projectsContent = fs.readFileSync(projectsFile, 'utf8');
const templateContent = fs.readFileSync(templateFile, 'utf8');

const regex = /<div class="relative bg-white rounded-2xl shadow-\[0_4px_20px_rgb\(0,0,0,0\.05\)\] hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.08\)\] border border-gray-100 p-6 flex justify-center items-center h-\[350px\] transition-all duration-300 overflow-hidden group">\s*<img src="([^"]+)" alt="([^"]+)" class="[^"]+" \/>\s*<div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black\/[^ ]+ to-transparent px-6 pb-4 pt-16 flex items-end">\s*<h3 class="text-white font-heading font-bold text-lg md:text-xl leading-snug drop-shadow-sm">\s*([^<]+)\s*<\/h3>\s*<\/div>\s*<\/div>/g;

let match;
while ((match = regex.exec(projectsContent)) !== null) {
  const originalHtml = match[0];
  const imgSrc = match[1];
  const imgAlt = match[2];
  let title = match[3].trim();

  // Create slug
  let slugTitle = title.toLowerCase().replace(/consultancy/g, '').replace(/fully automated/g, '').replace(/turnkey project for /g, '').trim();
  slugTitle = slugTitle.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let slug = `${slugTitle}-consultancy.html`;

  // Provide a short description
  let desc = `Complete consultancy for setting up a ${title.replace(/Consultancy/i, '').trim().toLowerCase()}.`;

  // New HTML block for projects.html
  const newHtml = `                        <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col transition-all duration-300 overflow-hidden group">
                            <div class="h-[250px] p-2 flex justify-center items-center bg-white border-b border-gray-50">
                                <img src="${imgSrc}" alt="${imgAlt}" class="w-[95%] h-full object-contain mx-auto" />
                            </div>
                            <div class="p-6 flex flex-col flex-grow bg-white">
                                <h3 style="font-size: 20px; font-weight: 800; color: #0c2340; line-height: 1.3; margin-bottom: 12px;" class="line-clamp-2">
                                    ${title}
                                </h3>
                                <p style="font-size: 16px; line-height: 1.7;" class="text-gray-600 mb-6 flex-grow">
                                    ${desc}
                                </p>
                                <a href="${slug}" class="more-details-btn mt-auto">
                                    <span class="btn-icon">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </span>
                                    <span class="btn-text">MORE DETAILS</span>
                                    <span style="width: 70px; flex-shrink: 0;"></span>
                                </a>
                            </div>
                        </div>`;

  projectsContent = projectsContent.replace(originalHtml, newHtml);

  // Generate new page content based on potato powder template
  let newPageContent = templateContent;
  
  // Replace title and text in the template
  newPageContent = newPageContent.replace(/Potato Powder Making Machine Consultancy/g, title);
  newPageContent = newPageContent.replace(/Complete Potato Powder Plant/g, `Complete ${title.replace(/ Consultancy/i, '')}`);
  newPageContent = newPageContent.replace(/potato powder/gi, title.replace(/ Consultancy/i, '').toLowerCase());
  newPageContent = newPageContent.replace(/Potato Powder/g, title.replace(/ Consultancy/i, ''));
  newPageContent = newPageContent.replace(/POTATO POWDER/g, title.replace(/ Consultancy/i, '').toUpperCase());

  // Empty the gallery section
  // Replace <div class="rcp-gallery__showcase">...</div> with empty
  const galleryRegex = /<div class="rcp-gallery__showcase">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
  newPageContent = newPageContent.replace(galleryRegex, '<div class="rcp-gallery__showcase">\n            <!-- Images will be added later -->\n          </div>\n        </div>\n      </section>');

  fs.writeFileSync(path.join(targetDir, slug), newPageContent, 'utf8');
  console.log(`Created ${slug}`);
}

fs.writeFileSync(projectsFile, projectsContent, 'utf8');
console.log('Updated projects.html');
