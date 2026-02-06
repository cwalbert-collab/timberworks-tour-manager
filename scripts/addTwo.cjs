// Add 2 more Red Team shows to reach exactly 400
const fs = require('fs');
const filePath = '/Users/cooperalbert/lumberjack-tours/src/data/sampleData.js';
let content = fs.readFileSync(filePath, 'utf-8');

const newShows = [
  "  createShow('show-2027-500', TOURS.RED_TEAM, 'venue-071', '2027-04-02', '2027-04-04', 4200, 300, 294, 336, 'Tomahawk Spring Fest', 'confirmed')",
  "  createShow('show-2027-501', TOURS.RED_TEAM, 'venue-072', '2027-05-14', '2027-05-16', 4500, 300, 315, 360, 'Eagle River Musky Days', 'confirmed')"
];

// Find the last show entry and add after it
const lastShowIndex = content.lastIndexOf("createShow(");
const endOfLastShow = content.indexOf(")", lastShowIndex) + 1;
const restOfFile = content.slice(endOfLastShow);

// Check if there's a comma after the last show
if (!restOfFile.trim().startsWith(',') && !restOfFile.trim().startsWith('\n]')) {
  content = content.slice(0, endOfLastShow) + ',\n' + newShows.join(',\n') + restOfFile;
} else if (restOfFile.trim().startsWith('\n]')) {
  content = content.slice(0, endOfLastShow) + ',\n' + newShows.join(',\n') + '\n];';
} else {
  content = content.slice(0, endOfLastShow) + '\n' + newShows.join(',\n') + restOfFile;
}

fs.writeFileSync(filePath, content);
console.log('Added 2 more Red Team weekend shows in 2027');

// Verify count
const showPattern = /createShow\(/g;
const matches = content.match(showPattern);
console.log(`Total shows now: ${matches.length}`);
