// Script to detect overlapping shows within each team
// Run with: node scripts/checkOverlaps.js

const fs = require('fs');
const path = require('path');

// Read the sampleData.js file and extract show data
const filePath = path.join(__dirname, '../src/data/sampleData.js');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Parse the shows using regex to extract createShow calls
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

console.log(`Total shows found: ${shows.length}`);

// Separate by team
const redShows = shows.filter(s => s.tour === 'Red Team');
const blueShows = shows.filter(s => s.tour === 'Blue Team');

console.log(`Red Team shows: ${redShows.length}`);
console.log(`Blue Team shows: ${blueShows.length}`);

// Function to check if two date ranges overlap
function datesOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1 + 'T12:00:00');
  const e1 = new Date(end1 + 'T12:00:00');
  const s2 = new Date(start2 + 'T12:00:00');
  const e2 = new Date(end2 + 'T12:00:00');

  return s1 <= e2 && s2 <= e1;
}

// Find overlaps within a team
function findOverlaps(teamShows, teamName) {
  const overlaps = [];

  // Sort by start date
  const sorted = [...teamShows].sort((a, b) =>
    new Date(a.startDate) - new Date(b.startDate)
  );

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const show1 = sorted[i];
      const show2 = sorted[j];

      // If show2 starts after show1 ends + 1 day, no more overlaps possible with show1
      const e1 = new Date(show1.endDate + 'T12:00:00');
      const s2 = new Date(show2.startDate + 'T12:00:00');
      if (s2 > e1) break;

      if (datesOverlap(show1.startDate, show1.endDate, show2.startDate, show2.endDate)) {
        overlaps.push({
          show1: show1,
          show2: show2
        });
      }
    }
  }

  return overlaps;
}

// Check Red Team
console.log('\n=== RED TEAM OVERLAPS ===');
const redOverlaps = findOverlaps(redShows, 'Red Team');
if (redOverlaps.length === 0) {
  console.log('No overlaps found!');
} else {
  console.log(`Found ${redOverlaps.length} overlapping pairs:\n`);
  redOverlaps.forEach(({ show1, show2 }) => {
    console.log(`OVERLAP:`);
    console.log(`  ${show1.id}: ${show1.startDate} to ${show1.endDate}`);
    console.log(`  ${show2.id}: ${show2.startDate} to ${show2.endDate}`);
    console.log('');
  });
}

// Check Blue Team
console.log('\n=== BLUE TEAM OVERLAPS ===');
const blueOverlaps = findOverlaps(blueShows, 'Blue Team');
if (blueOverlaps.length === 0) {
  console.log('No overlaps found!');
} else {
  console.log(`Found ${blueOverlaps.length} overlapping pairs:\n`);
  blueOverlaps.forEach(({ show1, show2 }) => {
    console.log(`OVERLAP:`);
    console.log(`  ${show1.id}: ${show1.startDate} to ${show1.endDate}`);
    console.log(`  ${show2.id}: ${show2.startDate} to ${show2.endDate}`);
    console.log('');
  });
}

// Summary
console.log('\n=== SUMMARY ===');
console.log(`Red Team: ${redOverlaps.length} overlapping pairs`);
console.log(`Blue Team: ${blueOverlaps.length} overlapping pairs`);
console.log(`Total overlaps to fix: ${redOverlaps.length + blueOverlaps.length}`);

// Calculate duration distribution
function getDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

const allDurations = shows.map(s => getDuration(s.startDate, s.endDate));
const weekendShows = allDurations.filter(d => d <= 3).length;
const mediumShows = allDurations.filter(d => d >= 4 && d <= 14).length;
const largeShows = allDurations.filter(d => d >= 15).length;

console.log('\n=== DURATION DISTRIBUTION ===');
console.log(`Weekend (1-3 days): ${weekendShows} (${(weekendShows/shows.length*100).toFixed(1)}%) - target: 65%`);
console.log(`Medium (4-14 days): ${mediumShows} (${(mediumShows/shows.length*100).toFixed(1)}%) - target: 25%`);
console.log(`Large (15-28 days): ${largeShows} (${(largeShows/shows.length*100).toFixed(1)}%) - target: 10%`);
