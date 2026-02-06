// Show the Red Team overlaps
const fs = require('fs');
const content = fs.readFileSync('/Users/cooperalbert/lumberjack-tours/src/data/sampleData.js', 'utf-8');

const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']*)'/g;

const redShows = [];
let match;
while ((match = showPattern.exec(content)) !== null) {
  if (match[2] === 'RED_TEAM') {
    redShows.push({
      id: match[1],
      venue: match[3],
      startDate: match[4],
      endDate: match[5],
      fee: match[6],
      name: match[10]
    });
  }
}

function datesOverlap(s1, e1, s2, e2) {
  const a1 = new Date(s1 + 'T12:00:00'), b1 = new Date(e1 + 'T12:00:00');
  const a2 = new Date(s2 + 'T12:00:00'), b2 = new Date(e2 + 'T12:00:00');
  return a1 <= b2 && a2 <= b1;
}

const sorted = redShows.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

console.log('=== RED TEAM OVERLAPPING SHOWS ===\n');

for (let i = 0; i < sorted.length; i++) {
  for (let j = i + 1; j < sorted.length; j++) {
    if (new Date(sorted[j].startDate) > new Date(sorted[i].endDate)) break;
    if (datesOverlap(sorted[i].startDate, sorted[i].endDate, sorted[j].startDate, sorted[j].endDate)) {
      console.log('OVERLAP PAIR:');
      console.log(`  1) ${sorted[i].id}`);
      console.log(`     "${sorted[i].name}"`);
      console.log(`     ${sorted[i].startDate} to ${sorted[i].endDate}`);
      console.log(`     Fee: $${sorted[i].fee}`);
      console.log('');
      console.log(`  2) ${sorted[j].id}`);
      console.log(`     "${sorted[j].name}"`);
      console.log(`     ${sorted[j].startDate} to ${sorted[j].endDate}`);
      console.log(`     Fee: $${sorted[j].fee}`);
      console.log('\n---\n');
    }
  }
}
