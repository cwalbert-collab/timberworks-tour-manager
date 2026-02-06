// Round 7: Fix remaining 13 overlaps
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Round 7: Eliminating remaining 13 overlaps...\n');

// RED TEAM FIXES (2 overlaps)

// 1. show-2026-022 Sturgis (Jul 31-Aug 9) overlaps show-2026-023 Alexandria (Aug 7-9)
// Fix: Move Alexandria to Jul 24-26 (before Sturgis)
console.log('  Moving 2026 Alexandria to Jul 24-26');
content = content.replace(
  /createShow\('show-2026-023', TOURS\.RED_TEAM, 'venue-083', '2026-08-07', '2026-08-09'/,
  "createShow('show-2026-023', TOURS.RED_TEAM, 'venue-083', '2026-07-24', '2026-07-26'"
);

// 2. show-2027-018 Sturgis (Jul 30-Aug 8) overlaps show-2027-019 Alexandria (Aug 6-8)
// Fix: Move Alexandria to Jul 23-25 (before Sturgis)
console.log('  Moving 2027 Alexandria to Jul 23-25');
content = content.replace(
  /createShow\('show-2027-019', TOURS\.RED_TEAM, 'venue-083', '2027-08-06', '2027-08-08'/,
  "createShow('show-2027-019', TOURS.RED_TEAM, 'venue-083', '2027-07-23', '2027-07-25'"
);

// BLUE TEAM FIXES (11 overlaps)

// 1. show-2023-043 Brainerd (Sep 1-3) overlaps show-2023-044 Nebraska (Sep 1-11)
// Fix: Move Brainerd to Aug 26-28
console.log('  Moving 2023 Brainerd to Aug 26-28');
content = content.replace(
  /createShow\('show-2023-043', TOURS\.BLUE_TEAM, 'venue-082', '2023-09-01', '2023-09-03'/,
  "createShow('show-2023-043', TOURS.BLUE_TEAM, 'venue-082', '2023-08-26', '2023-08-28'"
);

// 2. show-2023-046 Nashville (Oct 25-Nov 4) contains show-2023-020 Appleton (Oct 29-31)
// Fix: Move Appleton to Nov 12-14
console.log('  Moving 2023 Appleton to Nov 12-14');
content = content.replace(
  /createShow\('show-2023-020', TOURS\.BLUE_TEAM, 'venue-045', '2023-10-29', '2023-10-31'/,
  "createShow('show-2023-020', TOURS.BLUE_TEAM, 'venue-045', '2023-11-12', '2023-11-14'"
);

// 3. show-2023-046 Nashville (Oct 25-Nov 4) contains show-2023-021 Bayfield (Nov 1-3)
// Fix: Move Bayfield to Nov 8-10
console.log('  Moving 2023 Bayfield to Nov 8-10');
content = content.replace(
  /createShow\('show-2023-021', TOURS\.BLUE_TEAM, 'venue-060', '2023-11-01', '2023-11-03'/,
  "createShow('show-2023-021', TOURS.BLUE_TEAM, 'venue-060', '2023-11-08', '2023-11-10'"
);

// 4. show-2024-049 Brainerd (Aug 29-31) overlaps show-2024-050 Nebraska (Aug 30-Sep 9)
// Fix: Move Brainerd to Sep 13-15
console.log('  Moving 2024 Brainerd to Sep 13-15');
content = content.replace(
  /createShow\('show-2024-049', TOURS\.BLUE_TEAM, 'venue-082', '2024-08-29', '2024-08-31'/,
  "createShow('show-2024-049', TOURS.BLUE_TEAM, 'venue-082', '2024-09-13', '2024-09-15'"
);

// 5. show-2024-054 Nashville (Nov 1-11) overlaps show-2024-055 Branson (Nov 4-24)
// Fix: Remove Nashville (Branson is the bigger engagement)
console.log('  Removing 2024 Nashville (conflict with Branson)');
content = content.replace(
  /\s*createShow\('show-2024-054'[^)]+\),?\n/,
  '\n'
);

// 6. show-2025-050 Nebraska (Aug 22-Sep 1) contains show-2025-051 Stillwater (Aug 29-31)
// Fix: Move Stillwater to Aug 15-17
console.log('  Moving 2025 Stillwater to Aug 15-17');
content = content.replace(
  /createShow\('show-2025-051', TOURS\.BLUE_TEAM, 'venue-094', '2025-08-29', '2025-08-31'/,
  "createShow('show-2025-051', TOURS.BLUE_TEAM, 'venue-094', '2025-08-15', '2025-08-17'"
);

// 7. show-2026-046 Quad Cities (May 15-17) same as show-2026-047 Dubuque (May 15-17)
// Fix: Move Dubuque to May 22-24
console.log('  Moving 2026 Dubuque to May 22-24');
content = content.replace(
  /createShow\('show-2026-047', TOURS\.BLUE_TEAM, 'venue-102', '2026-05-15', '2026-05-17'/,
  "createShow('show-2026-047', TOURS.BLUE_TEAM, 'venue-102', '2026-05-22', '2026-05-24'"
);

// 8. show-2026-030 Nashville (Oct 23-Nov 2) overlaps show-2026-066 Branson (Nov 2-22)
// Fix: Move Nashville to Oct 20-30 (Dallas ends Oct 18)
console.log('  Moving 2026 Nashville to Oct 20-30');
content = content.replace(
  /createShow\('show-2026-030', TOURS\.BLUE_TEAM, 'venue-042', '2026-10-23', '2026-11-02'/,
  "createShow('show-2026-030', TOURS.BLUE_TEAM, 'venue-042', '2026-10-20', '2026-10-30'"
);

// 9. show-2027-046 WI Dells (Aug 11-21) contains show-2027-048 Bemidji (Aug 13-15)
// Fix: Move Bemidji to Aug 6-8
console.log('  Moving 2027 Bemidji to Aug 6-8');
content = content.replace(
  /createShow\('show-2027-048', TOURS\.BLUE_TEAM, 'venue-081', '2027-08-13', '2027-08-15'/,
  "createShow('show-2027-048', TOURS.BLUE_TEAM, 'venue-081', '2027-08-06', '2027-08-08'"
);

// 10. show-2027-049 Brainerd (Sep 10-12) same as show-2027-051 Stillwater (Sep 10-12)
// Fix: Move Stillwater to Sep 17-19
console.log('  Moving 2027 Stillwater to Sep 17-19');
content = content.replace(
  /createShow\('show-2027-051', TOURS\.BLUE_TEAM, 'venue-094', '2027-09-10', '2027-09-12'/,
  "createShow('show-2027-051', TOURS.BLUE_TEAM, 'venue-094', '2027-09-17', '2027-09-19'"
);

// 11. show-2027-054 Nashville (Oct 22-Nov 1) overlaps show-2027-055 Branson (Nov 1-21)
// Fix: Move Nashville to Oct 18-28 (Dallas ends Oct 17)
console.log('  Moving 2027 Nashville to Oct 18-28');
content = content.replace(
  /createShow\('show-2027-054', TOURS\.BLUE_TEAM, 'venue-042', '2027-10-22', '2027-11-01'/,
  "createShow('show-2027-054', TOURS.BLUE_TEAM, 'venue-042', '2027-10-18', '2027-10-28'"
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
