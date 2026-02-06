// Round 6: Final cleanup - eliminate remaining 17 overlaps
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Round 6: Eliminating final 17 overlaps...\n');

// RED TEAM FIXES (3 overlaps)

// 1. show-2026-038 Sioux Falls (Mar 18-20) overlaps show-2026-037 Omaha (Mar 20-22)
// Fix: Move Sioux Falls to Mar 16-18
console.log('  Moving 2026 Sioux Falls to Mar 16-18');
content = content.replace(
  /createShow\('show-2026-038', TOURS\.RED_TEAM, 'venue-035', '2026-03-18', '2026-03-20'/,
  "createShow('show-2026-038', TOURS.RED_TEAM, 'venue-035', '2026-03-16', '2026-03-18'"
);

// 2. show-2026-025 Iowa State Fair (Aug 13-22) contains show-2026-023 Alexandria (Aug 14-16)
// Fix: Move Alexandria to Aug 7-9
console.log('  Moving 2026 Alexandria to Aug 7-9');
content = content.replace(
  /createShow\('show-2026-023', TOURS\.RED_TEAM, 'venue-083', '2026-08-14', '2026-08-16'/,
  "createShow('show-2026-023', TOURS.RED_TEAM, 'venue-083', '2026-08-07', '2026-08-09'"
);

// 3. show-2027-021 Iowa State Fair (Aug 12-21) contains show-2027-019 Alexandria (Aug 13-15)
// Fix: Move Alexandria to Aug 6-8
console.log('  Moving 2027 Alexandria to Aug 6-8');
content = content.replace(
  /createShow\('show-2027-019', TOURS\.RED_TEAM, 'venue-083', '2027-08-13', '2027-08-15'/,
  "createShow('show-2027-019', TOURS.RED_TEAM, 'venue-083', '2027-08-06', '2027-08-08'"
);

// BLUE TEAM FIXES (14 overlaps)

// 2023 fixes:
// 1. show-2023-042 Bemidji (Aug 25-27) same dates as show-2023-043 Brainerd (Aug 25-27)
// Fix: Move Brainerd to Sep 1-3
console.log('  Moving 2023 Brainerd to Sep 1-3');
content = content.replace(
  /createShow\('show-2023-043', TOURS\.BLUE_TEAM, 'venue-082', '2023-08-25', '2023-08-27'/,
  "createShow('show-2023-043', TOURS.BLUE_TEAM, 'venue-082', '2023-09-01', '2023-09-03'"
);

// 2. show-2023-019 Dallas (Sep 29-Oct 22) contains show-2023-020 Appleton (Oct 14-16)
// Fix: Move Appleton to Oct 29-31
console.log('  Moving 2023 Appleton to Oct 29-31');
content = content.replace(
  /createShow\('show-2023-020', TOURS\.BLUE_TEAM, 'venue-045', '2023-10-14', '2023-10-16'/,
  "createShow('show-2023-020', TOURS.BLUE_TEAM, 'venue-045', '2023-10-29', '2023-10-31'"
);

// 3. show-2023-019 Dallas (Sep 29-Oct 22) contains show-2023-021 Bayfield (Oct 21-23)
// Fix: Move Bayfield to Nov 1-3
console.log('  Moving 2023 Bayfield to Nov 1-3');
content = content.replace(
  /createShow\('show-2023-021', TOURS\.BLUE_TEAM, 'venue-060', '2023-10-21', '2023-10-23'/,
  "createShow('show-2023-021', TOURS.BLUE_TEAM, 'venue-060', '2023-11-01', '2023-11-03'"
);

// 4. show-2023-049 Branson (Nov 5-26) contains show-2023-050 St Louis (Nov 17-19)
// Fix: Remove St Louis (Branson is the major engagement)
console.log('  Removing 2023 St Louis (conflict with Branson)');
content = content.replace(
  /\s*createShow\('show-2023-050'[^)]+\),?\n/,
  '\n'
);

// 2024 fixes:
// 5. show-2024-048 Bemidji (Aug 22-24) same dates as show-2024-049 Brainerd (Aug 22-24)
// Fix: Move Brainerd to Aug 29-31
console.log('  Moving 2024 Brainerd to Aug 29-31');
content = content.replace(
  /createShow\('show-2024-049', TOURS\.BLUE_TEAM, 'venue-082', '2024-08-22', '2024-08-24'/,
  "createShow('show-2024-049', TOURS.BLUE_TEAM, 'venue-082', '2024-08-29', '2024-08-31'"
);

// 6 & 7. show-2024-023 Dallas (Sep 27-Oct 20) overlaps show-2024-054 Nashville (Oct 17-27)
// and Nashville overlaps show-2024-024 Appleton (Oct 23-25)
// Fix: Move Nashville to Nov 1-11, move Appleton to Oct 24-26
console.log('  Moving 2024 Nashville to Nov 1-11');
content = content.replace(
  /createShow\('show-2024-054', TOURS\.BLUE_TEAM, 'venue-042', '2024-10-17', '2024-10-27'/,
  "createShow('show-2024-054', TOURS.BLUE_TEAM, 'venue-042', '2024-11-01', '2024-11-11'"
);

// 2025 fixes:
// 8. show-2025-046 WI Dells (Sep 5-14) starts same as show-2025-051 Stillwater (Sep 5-7)
// Fix: Move Stillwater to Aug 29-31
console.log('  Moving 2025 Stillwater to Aug 29-31');
content = content.replace(
  /createShow\('show-2025-051', TOURS\.BLUE_TEAM, 'venue-094', '2025-09-05', '2025-09-07'/,
  "createShow('show-2025-051', TOURS.BLUE_TEAM, 'venue-094', '2025-08-29', '2025-08-31'"
);

// 2026 fixes:
// 9. show-2026-044 Cedar Rapids (May 8-10) same as show-2026-046 Quad Cities (May 8-10)
// Fix: Move Quad Cities to May 15-17
console.log('  Moving 2026 Quad Cities to May 15-17');
content = content.replace(
  /createShow\('show-2026-046', TOURS\.BLUE_TEAM, 'venue-015', '2026-05-08', '2026-05-10'/,
  "createShow('show-2026-046', TOURS.BLUE_TEAM, 'venue-015', '2026-05-15', '2026-05-17'"
);

// 10. show-2026-061 Nebraska (Sep 4-14) overlaps show-2026-062 Iowa (Sep 10-20)
// Fix: Remove Iowa State Fair from Blue Team (Red Team handles it)
console.log('  Removing 2026 Blue Iowa State Fair (Red Team has it)');
content = content.replace(
  /\s*createShow\('show-2026-062'[^)]+\),?\n/,
  '\n'
);

// 11. show-2026-027 Dallas (Sep 25-Oct 18) overlaps show-2026-030 Nashville (Oct 11-21)
// Fix: Move Nashville to Oct 23-Nov 2
console.log('  Moving 2026 Nashville to Oct 23-Nov 2');
content = content.replace(
  /createShow\('show-2026-030', TOURS\.BLUE_TEAM, 'venue-042', '2026-10-11', '2026-10-21'/,
  "createShow('show-2026-030', TOURS.BLUE_TEAM, 'venue-042', '2026-10-23', '2026-11-02'"
);

// 2027 fixes:
// 12. show-2027-047 WI State Fair (Aug 1-10) contains show-2027-048 Bemidji (Aug 6-8)
// Fix: Move Bemidji to Aug 13-15
console.log('  Moving 2027 Bemidji to Aug 13-15');
content = content.replace(
  /createShow\('show-2027-048', TOURS\.BLUE_TEAM, 'venue-081', '2027-08-06', '2027-08-08'/,
  "createShow('show-2027-048', TOURS.BLUE_TEAM, 'venue-081', '2027-08-13', '2027-08-15'"
);

// 13. show-2027-049 Brainerd (Aug 27-29) starts same as show-2027-050 Nebraska (Aug 27-Sep 6)
// Fix: Move Brainerd to Sep 10-12
console.log('  Moving 2027 Brainerd to Sep 10-12');
content = content.replace(
  /createShow\('show-2027-049', TOURS\.BLUE_TEAM, 'venue-082', '2027-08-27', '2027-08-29'/,
  "createShow('show-2027-049', TOURS.BLUE_TEAM, 'venue-082', '2027-09-10', '2027-09-12'"
);

// 14. show-2027-023 Dallas (Sep 24-Oct 17) overlaps show-2027-054 Nashville (Oct 10-20)
// Fix: Move Nashville to Oct 22-Nov 1
console.log('  Moving 2027 Nashville to Oct 22-Nov 1');
content = content.replace(
  /createShow\('show-2027-054', TOURS\.BLUE_TEAM, 'venue-042', '2027-10-10', '2027-10-20'/,
  "createShow('show-2027-054', TOURS.BLUE_TEAM, 'venue-042', '2027-10-22', '2027-11-01'"
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
