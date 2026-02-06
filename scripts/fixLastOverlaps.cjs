// Fix the last 2 Red Team overlaps
const fs = require('fs');
const filePath = '/Users/cooperalbert/lumberjack-tours/src/data/sampleData.js';
let content = fs.readFileSync(filePath, 'utf-8');

const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;

const redShows = [];
let match;
while ((match = showPattern.exec(content)) !== null) {
  if (match[2] === 'RED_TEAM') {
    redShows.push({
      id: match[1],
      startDate: match[4],
      endDate: match[5]
    });
  }
}

// Find overlaps
function datesOverlap(s1, e1, s2, e2) {
  const a1 = new Date(s1 + 'T12:00:00'), b1 = new Date(e1 + 'T12:00:00');
  const a2 = new Date(s2 + 'T12:00:00'), b2 = new Date(e2 + 'T12:00:00');
  return a1 <= b2 && a2 <= b1;
}

const sorted = redShows.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
const overlaps = [];

for (let i = 0; i < sorted.length; i++) {
  for (let j = i + 1; j < sorted.length; j++) {
    if (new Date(sorted[j].startDate) > new Date(sorted[i].endDate)) break;
    if (datesOverlap(sorted[i].startDate, sorted[i].endDate, sorted[j].startDate, sorted[j].endDate)) {
      overlaps.push({ show1: sorted[i], show2: sorted[j] });
      console.log(`Overlap: ${sorted[i].id} (${sorted[i].startDate} to ${sorted[i].endDate}) <-> ${sorted[j].id} (${sorted[j].startDate} to ${sorted[j].endDate})`);
    }
  }
}

// Remove the overlapping shows (the second one in each pair)
overlaps.forEach(({ show2 }) => {
  const pattern = new RegExp(`\\s*createShow\\('${show2.id}'[^)]+\\),?\\n?`, 'g');
  content = content.replace(pattern, '\n');
  console.log(`Removed: ${show2.id}`);
});

fs.writeFileSync(filePath, content);
console.log('\nOverlaps fixed by removal');

// Verify final count
const finalPattern = /createShow\(/g;
const matches = content.match(finalPattern);
console.log(`Final show count: ${matches.length}`);
