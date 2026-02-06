// Round 8: Fix remaining 9 overlaps
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Round 8: Eliminating remaining 9 overlaps...\n');

// RED TEAM FIXES (2 overlaps)

// 1. show-2026-021 Hayward (Jul 23-26) overlaps show-2026-023 Alexandria (Jul 24-26)
// Can't move Hayward (home championships), move Alexandria to Jul 17-19
console.log('  Moving 2026 Alexandria to Jul 17-19');
content = content.replace(
  /createShow\('show-2026-023', TOURS\.RED_TEAM, 'venue-083', '2026-07-24', '2026-07-26'/,
  "createShow('show-2026-023', TOURS.RED_TEAM, 'venue-083', '2026-07-17', '2026-07-19'"
);

// 2. show-2027-017 Hayward (Jul 22-25) overlaps show-2027-019 Alexandria (Jul 23-25)
// Can't move Hayward, move Alexandria to Jul 16-18
console.log('  Moving 2027 Alexandria to Jul 16-18');
content = content.replace(
  /createShow\('show-2027-019', TOURS\.RED_TEAM, 'venue-083', '2027-07-23', '2027-07-25'/,
  "createShow('show-2027-019', TOURS.RED_TEAM, 'venue-083', '2027-07-16', '2027-07-18'"
);

// BLUE TEAM FIXES (7 overlaps)

// 1. show-2023-042 Bemidji (Aug 25-27) overlaps show-2023-043 Brainerd (Aug 26-28)
// Move Brainerd to Aug 19-21
console.log('  Moving 2023 Brainerd to Aug 19-21');
content = content.replace(
  /createShow\('show-2023-043', TOURS\.BLUE_TEAM, 'venue-082', '2023-08-26', '2023-08-28'/,
  "createShow('show-2023-043', TOURS.BLUE_TEAM, 'venue-082', '2023-08-19', '2023-08-21'"
);

// 2. show-2023-049 Branson (Nov 5-26) contains show-2023-021 Bayfield (Nov 8-10)
// Remove Bayfield - Branson is major engagement
console.log('  Removing 2023 Bayfield (conflict with Branson)');
content = content.replace(
  /\s*createShow\('show-2023-021'[^)]+\),?\n/,
  '\n'
);

// 3. show-2023-049 Branson (Nov 5-26) contains show-2023-020 Appleton (Nov 12-14)
// Remove Appleton - Branson is major engagement
console.log('  Removing 2023 Appleton (conflict with Branson)');
content = content.replace(
  /\s*createShow\('show-2023-020'[^)]+\),?\n/,
  '\n'
);

// 4. show-2024-049 Brainerd (Sep 13-15) same as show-2024-051 Stillwater (Sep 13-15)
// Move Stillwater to Sep 20-22
console.log('  Moving 2024 Stillwater to Sep 20-22');
content = content.replace(
  /createShow\('show-2024-051', TOURS\.BLUE_TEAM, 'venue-094', '2024-09-13', '2024-09-15'/,
  "createShow('show-2024-051', TOURS.BLUE_TEAM, 'venue-094', '2024-09-20', '2024-09-22'"
);

// 5. show-2025-048 Bemidji (Aug 15-17) same as show-2025-051 Stillwater (Aug 15-17)
// Move Stillwater to Aug 8-10
console.log('  Moving 2025 Stillwater to Aug 8-10');
content = content.replace(
  /createShow\('show-2025-051', TOURS\.BLUE_TEAM, 'venue-094', '2025-08-15', '2025-08-17'/,
  "createShow('show-2025-051', TOURS.BLUE_TEAM, 'venue-094', '2025-08-08', '2025-08-10'"
);

// 6. show-2026-047 Dubuque (May 22-24) overlaps show-2026-048 Madison (May 22-25)
// Move Dubuque to May 29-31
console.log('  Moving 2026 Dubuque to May 29-31');
content = content.replace(
  /createShow\('show-2026-047', TOURS\.BLUE_TEAM, 'venue-102', '2026-05-22', '2026-05-24'/,
  "createShow('show-2026-047', TOURS.BLUE_TEAM, 'venue-102', '2026-05-29', '2026-05-31'"
);

// 7. show-2027-047 WI State Fair (Aug 1-10) contains show-2027-048 Bemidji (Aug 6-8)
// Move Bemidji to Jul 23-25
console.log('  Moving 2027 Bemidji to Jul 23-25');
content = content.replace(
  /createShow\('show-2027-048', TOURS\.BLUE_TEAM, 'venue-081', '2027-08-06', '2027-08-08'/,
  "createShow('show-2027-048', TOURS.BLUE_TEAM, 'venue-081', '2027-07-23', '2027-07-25'"
);

// Write updated content
fs.writeFileSync(filePath, content);

// Run verification
console.log('\n=== Running verification... ===\n');

const updatedContent = fs.readFileSync(filePath, 'utf-8');
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;

const shows = [];
let match;
while ((match = showPattern.exec(updatedContent)) !== null) {
  shows.push({
    id: match[1],
    tour: match[2] === 'RED_TEAM' ? 'Red Team' : 'Blue Team',
    venueId: match[3],
    startDate: match[4],
    endDate: match[5]
  });
}

const redShows = shows.filter(s => s.tour === 'Red Team');
const blueShows = shows.filter(s => s.tour === 'Blue Team');

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

const redOverlaps = findOverlaps(redShows);
const blueOverlaps = findOverlaps(blueShows);

console.log(`Total shows: ${shows.length}`);
console.log(`Red Team: ${redShows.length} shows, ${redOverlaps.length} overlaps`);
console.log(`Blue Team: ${blueShows.length} shows, ${blueOverlaps.length} overlaps`);

if (redOverlaps.length > 0) {
  console.log('\nRemaining Red overlaps:');
  redOverlaps.forEach(({ show1, show2 }) => {
    console.log(`  ${show1.id} (${show1.startDate} to ${show1.endDate}) <-> ${show2.id} (${show2.startDate} to ${show2.endDate})`);
  });
}

if (blueOverlaps.length > 0) {
  console.log('\nRemaining Blue overlaps:');
  blueOverlaps.forEach(({ show1, show2 }) => {
    console.log(`  ${show1.id} (${show1.startDate} to ${show1.endDate}) <-> ${show2.id} (${show2.startDate} to ${show2.endDate})`);
  });
}

if (redOverlaps.length === 0 && blueOverlaps.length === 0) {
  console.log('\n✓ SUCCESS: No overlaps remaining!');
}

// Duration distribution
function getDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

const allDurations = shows.map(s => getDuration(s.startDate, s.endDate));
const weekendShows = allDurations.filter(d => d <= 3).length;
const mediumShows = allDurations.filter(d => d >= 4 && d <= 14).length;
const largeShows = allDurations.filter(d => d >= 15).length;

console.log('\n=== Duration Distribution ===');
console.log(`Weekend (1-3 days): ${weekendShows} (${(weekendShows/shows.length*100).toFixed(1)}%)`);
console.log(`Medium (4-14 days): ${mediumShows} (${(mediumShows/shows.length*100).toFixed(1)}%)`);
console.log(`Large (15+ days): ${largeShows} (${(largeShows/shows.length*100).toFixed(1)}%)`);
