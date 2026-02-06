// Script to analyze just the main shows (001-058) for overlaps
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Parse shows
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;

const shows = [];
let match;
while ((match = showPattern.exec(fileContent)) !== null) {
  shows.push({
    id: match[1],
    tour: match[2] === 'RED_TEAM' ? 'Red Team' : 'Blue Team',
    venueId: match[3],
    startDate: match[4],
    endDate: match[5]
  });
}

// Filter to just main shows (001-058, not 100+, 200+)
const mainShows = shows.filter(s => {
  const parts = s.id.split('-');
  const num = parseInt(parts[2]);
  return num <= 58;
});

console.log(`Total shows: ${shows.length}`);
console.log(`Main shows (001-058): ${mainShows.length}`);

const redMain = mainShows.filter(s => s.tour === 'Red Team');
const blueMain = mainShows.filter(s => s.tour === 'Blue Team');
console.log(`Red main: ${redMain.length}, Blue main: ${blueMain.length}`);

function datesOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1 + 'T12:00:00');
  const e1 = new Date(end1 + 'T12:00:00');
  const s2 = new Date(start2 + 'T12:00:00');
  const e2 = new Date(end2 + 'T12:00:00');
  return s1 <= e2 && s2 <= e1;
}

function findOverlaps(teamShows) {
  const overlaps = [];
  const sorted = [...teamShows].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const show1 = sorted[i];
      const show2 = sorted[j];
      const e1 = new Date(show1.endDate + 'T12:00:00');
      const s2 = new Date(show2.startDate + 'T12:00:00');
      if (s2 > e1) break;

      if (datesOverlap(show1.startDate, show1.endDate, show2.startDate, show2.endDate)) {
        overlaps.push({ show1, show2 });
      }
    }
  }
  return overlaps;
}

console.log('\n=== RED TEAM MAIN SHOWS OVERLAPS ===');
const redOverlaps = findOverlaps(redMain);
if (redOverlaps.length === 0) {
  console.log('No overlaps!');
} else {
  console.log(`Found ${redOverlaps.length} overlaps:`);
  redOverlaps.forEach(({ show1, show2 }) => {
    console.log(`  ${show1.id} (${show1.startDate} to ${show1.endDate}) <-> ${show2.id} (${show2.startDate} to ${show2.endDate})`);
  });
}

console.log('\n=== BLUE TEAM MAIN SHOWS OVERLAPS ===');
const blueOverlaps = findOverlaps(blueMain);
if (blueOverlaps.length === 0) {
  console.log('No overlaps!');
} else {
  console.log(`Found ${blueOverlaps.length} overlaps:`);
  blueOverlaps.forEach(({ show1, show2 }) => {
    console.log(`  ${show1.id} (${show1.startDate} to ${show1.endDate}) <-> ${show2.id} (${show2.startDate} to ${show2.endDate})`);
  });
}

// Now analyze which shows need to be modified
console.log('\n=== SHOWS THAT NEED DATE CHANGES ===');

// For each overlap, identify which show to shift
const allOverlaps = [...redOverlaps, ...blueOverlaps];
const showsToFix = new Set();
allOverlaps.forEach(({ show1, show2 }) => {
  // Calculate durations
  const d1 = Math.ceil((new Date(show1.endDate) - new Date(show1.startDate)) / (1000*60*60*24)) + 1;
  const d2 = Math.ceil((new Date(show2.endDate) - new Date(show2.startDate)) / (1000*60*60*24)) + 1;
  // Keep the longer one, shift the shorter one
  if (d1 >= d2) {
    showsToFix.add(show2.id);
  } else {
    showsToFix.add(show1.id);
  }
});

console.log(`Shows that need date adjustment (${showsToFix.size}):`);
showsToFix.forEach(id => console.log(`  - ${id}`));
