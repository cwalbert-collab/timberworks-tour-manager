// Round 3 fixes - target specific remaining overlaps
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Applying round 3 fixes...\n');

// RED TEAM FIXES

// 1. 2026 Houston (Feb 23 - Mar 14) overlaps with Omaha (Feb 27)
// Move Omaha after Houston ends
content = content.replace(
  /createShow\('show-2026-037', TOURS\.RED_TEAM, 'venue-033', '2026-02-27', '2026-03-01'/,
  (m) => { console.log('  Moving 2026 Omaha to Mar 20-22'); return "createShow('show-2026-037', TOURS.RED_TEAM, 'venue-033', '2026-03-20', '2026-03-22'"; }
);

// 2. 2026 Fargo/Sioux Falls/Rochester all now on same weekend!
// Spread them out
content = content.replace(
  /createShow\('show-2026-005', TOURS\.RED_TEAM, 'venue-036', '2026-03-20', '2026-03-21'/,
  (m) => { console.log('  Moving 2026 Fargo to Mar 27-28'); return "createShow('show-2026-005', TOURS.RED_TEAM, 'venue-036', '2026-03-27', '2026-03-28'"; }
);
content = content.replace(
  /createShow\('show-2026-038', TOURS\.RED_TEAM, 'venue-035', '2026-03-20', '2026-03-22'/,
  (m) => { console.log('  Moving 2026 Sioux Falls to Apr 3-5'); return "createShow('show-2026-038', TOURS.RED_TEAM, 'venue-035', '2026-04-03', '2026-04-05'"; }
);

// 3. 2026 Twin Cities ends Jul 4, Cherry Festival starts Jul 4
// Move Cherry Festival to Jul 5
content = content.replace(
  /createShow\('show-2026-019', TOURS\.RED_TEAM, 'venue-023', '2026-07-04', '2026-07-11'/,
  (m) => { console.log('  Adjusting 2026 Cherry Festival to Jul 6-12'); return "createShow('show-2026-019', TOURS.RED_TEAM, 'venue-023', '2026-07-06', '2026-07-12'"; }
);

// 4. 2026 Sturgis (Aug 7-16) overlaps with Red Sturgis?? Wait, Sturgis should only be on one team
// Actually the issue is Sturgis (022 orig) Aug 1-9 and the moved-to-Red Sturgis (058) Aug 7-16
// Remove one - keep the original
content = content.replace(
  /\s*createShow\('show-2026-058', TOURS\.RED_TEAM, 'venue-034'[^)]+\),?\n/g,
  '\n'
);
console.log('  Removed duplicate Sturgis 2026');

// 5. 2026 Iowa State Fair Sep 11-20 overlaps with KC Ren Sep 19+
// Move Iowa to end earlier
content = content.replace(
  /createShow\('show-2026-025', TOURS\.RED_TEAM, 'venue-013', '2026-09-11', '2026-09-20'/,
  (m) => { console.log('  Adjusting 2026 Iowa to Sep 4-14'); return "createShow('show-2026-025', TOURS.RED_TEAM, 'venue-013', '2026-09-04', '2026-09-14'"; }
);

// 6. 2027 Iowa Sep 10-19 overlaps with KC Ren Sep 18+
content = content.replace(
  /createShow\('show-2027-021', TOURS\.RED_TEAM, 'venue-013', '2027-09-10', '2027-09-19'/,
  (m) => { console.log('  Adjusting 2027 Iowa to Sep 3-13'); return "createShow('show-2027-021', TOURS.RED_TEAM, 'venue-013', '2027-09-03', '2027-09-13'"; }
);

// BLUE TEAM FIXES

// 1. 2023 WI Dells/Bemidji/Brainerd all on Aug 14-20
content = content.replace(
  /createShow\('show-2023-042', TOURS\.BLUE_TEAM, 'venue-081', '2023-08-18', '2023-08-20'/,
  (m) => { console.log('  Adjusting 2023 Bemidji to Aug 11-13'); return "createShow('show-2023-042', TOURS.BLUE_TEAM, 'venue-081', '2023-08-11', '2023-08-13'"; }
);
content = content.replace(
  /createShow\('show-2023-043', TOURS\.BLUE_TEAM, 'venue-082', '2023-08-18', '2023-08-20'/,
  (m) => { console.log('  Adjusting 2023 Brainerd to Aug 25-27'); return "createShow('show-2023-043', TOURS.BLUE_TEAM, 'venue-082', '2023-08-25', '2023-08-27'"; }
);

// 2. 2023 Dallas overlaps with Bayfield Oct 13-15
content = content.replace(
  /createShow\('show-2023-021', TOURS\.BLUE_TEAM, 'venue-060', '2023-10-13', '2023-10-15'/,
  (m) => { console.log('  Adjusting 2023 Bayfield to Oct 28-30'); return "createShow('show-2023-021', TOURS.BLUE_TEAM, 'venue-060', '2023-10-28', '2023-10-30'"; }
);

// 3. 2023 Appleton Oct 23-25 overlaps with Nashville Oct 24 - Nov 3
content = content.replace(
  /createShow\('show-2023-046', TOURS\.BLUE_TEAM, 'venue-042', '2023-10-24', '2023-11-03'/,
  (m) => { console.log('  Adjusting 2023 Nashville to Nov 7-17'); return "createShow('show-2023-046', TOURS.BLUE_TEAM, 'venue-042', '2023-11-07', '2023-11-17'"; }
);

// 4. 2023 Branson Nov 5-26 overlaps with Detroit Nov 17-19
content = content.replace(
  /createShow\('show-2023-050', TOURS\.BLUE_TEAM, 'venue-021', '2023-11-17', '2023-11-19'/,
  (m) => { console.log('  Move this show to Red team'); return "createShow('show-2023-050', TOURS.RED_TEAM, 'venue-021', '2023-11-17', '2023-11-19'"; }
);

// 5. 2024 WI Dells/Bemidji/Brainerd overlaps
content = content.replace(
  /createShow\('show-2024-048', TOURS\.BLUE_TEAM, 'venue-081', '2024-08-16', '2024-08-18'/,
  (m) => { console.log('  Adjusting 2024 Bemidji to Aug 8-10'); return "createShow('show-2024-048', TOURS.BLUE_TEAM, 'venue-081', '2024-08-08', '2024-08-10'"; }
);
content = content.replace(
  /createShow\('show-2024-049', TOURS\.BLUE_TEAM, 'venue-082', '2024-08-18', '2024-08-20'/,
  (m) => { console.log('  Adjusting 2024 Brainerd to Aug 22-24'); return "createShow('show-2024-049', TOURS.BLUE_TEAM, 'venue-082', '2024-08-22', '2024-08-24'"; }
);

// 6. 2024 Dallas overlaps with Bayfield Oct 11-13
content = content.replace(
  /createShow\('show-2024-025', TOURS\.BLUE_TEAM, 'venue-060', '2024-10-11', '2024-10-13'/,
  (m) => { console.log('  Adjusting 2024 Bayfield to Oct 25-27'); return "createShow('show-2024-025', TOURS.BLUE_TEAM, 'venue-060', '2024-10-25', '2024-10-27'"; }
);

// 7. 2024 Appleton/Nashville overlap
content = content.replace(
  /createShow\('show-2024-054', TOURS\.BLUE_TEAM, 'venue-042', '2024-10-24', '2024-11-03'/,
  (m) => { console.log('  Adjusting 2024 Nashville to Nov 8-18'); return "createShow('show-2024-054', TOURS.BLUE_TEAM, 'venue-042', '2024-11-08', '2024-11-18'"; }
);

// 8. 2024 Branson/St Louis overlap
content = content.replace(
  /createShow\('show-2024-056', TOURS\.BLUE_TEAM, 'venue-031', '2024-11-22', '2024-11-24'/,
  (m) => { console.log('  Move 2024 St Louis to Red'); return "createShow('show-2024-056', TOURS.RED_TEAM, 'venue-031', '2024-11-22', '2024-11-24'"; }
);

// 9. 2025 WI Dells overlaps with many shows
// Move WI Dells to start later
content = content.replace(
  /createShow\('show-2025-046', TOURS\.BLUE_TEAM, 'venue-003', '2025-08-14', '2025-08-24'/,
  (m) => { console.log('  Adjusting 2025 WI Dells to Sep 5-14'); return "createShow('show-2025-046', TOURS.BLUE_TEAM, 'venue-003', '2025-09-05', '2025-09-14'"; }
);

// 10. 2025 Dallas overlaps with Nashville and Bayfield
content = content.replace(
  /createShow\('show-2025-054', TOURS\.BLUE_TEAM, 'venue-042', '2025-10-02', '2025-10-12'/,
  (m) => { console.log('  Adjusting 2025 Nashville to Oct 24 - Nov 3'); return "createShow('show-2025-054', TOURS.BLUE_TEAM, 'venue-042', '2025-10-24', '2025-11-03'"; }
);
content = content.replace(
  /createShow\('show-2025-025', TOURS\.BLUE_TEAM, 'venue-060', '2025-10-10', '2025-10-12'/,
  (m) => { console.log('  Adjusting 2025 Bayfield to Oct 25-27'); return "createShow('show-2025-025', TOURS.BLUE_TEAM, 'venue-060', '2025-10-25', '2025-10-27'"; }
);

// 11. 2025 Branson/St Louis overlap
content = content.replace(
  /createShow\('show-2025-056', TOURS\.BLUE_TEAM, 'venue-031', '2025-11-21', '2025-11-23'/,
  (m) => { console.log('  Move 2025 St Louis to Red'); return "createShow('show-2025-056', TOURS.RED_TEAM, 'venue-031', '2025-11-21', '2025-11-23'"; }
);

// 12. 2026 St Cloud/Quad Cities same dates
content = content.replace(
  /createShow\('show-2026-045', TOURS\.BLUE_TEAM, 'venue-011', '2026-05-08', '2026-05-10'/,
  (m) => { console.log('  Adjusting 2026 St Cloud to May 1-3'); return "createShow('show-2026-045', TOURS.BLUE_TEAM, 'venue-011', '2026-05-01', '2026-05-03'"; }
);

// 13. 2026 WI State Fair/Dells overlap
content = content.replace(
  /createShow\('show-2026-057', TOURS\.BLUE_TEAM, 'venue-048', '2026-08-06', '2026-08-16'/,
  (m) => { console.log('  Adjusting 2026 WI State Fair to Aug 1-11'); return "createShow('show-2026-057', TOURS.BLUE_TEAM, 'venue-048', '2026-08-01', '2026-08-11'"; }
);

// 14. 2026 Dells/Nebraska/Brainerd overlaps
content = content.replace(
  /createShow\('show-2026-061', TOURS\.BLUE_TEAM, 'venue-032', '2026-08-21', '2026-08-31'/,
  (m) => { console.log('  Adjusting 2026 Nebraska to Sep 4-14'); return "createShow('show-2026-061', TOURS.BLUE_TEAM, 'venue-032', '2026-09-04', '2026-09-14'"; }
);

// 15. 2026 Bemidji/Stillwater same dates
content = content.replace(
  /createShow\('show-2026-063', TOURS\.BLUE_TEAM, 'venue-094', '2026-09-04', '2026-09-06'/,
  (m) => { console.log('  Adjusting 2026 Stillwater to Sep 11-13'); return "createShow('show-2026-063', TOURS.BLUE_TEAM, 'venue-094', '2026-09-11', '2026-09-13'"; }
);

// 16. 2026 Dallas overlaps with Nashville
content = content.replace(
  /createShow\('show-2026-030', TOURS\.BLUE_TEAM, 'venue-042', '2026-10-01', '2026-10-11'/,
  (m) => { console.log('  Adjusting 2026 Nashville to Oct 23 - Nov 2'); return "createShow('show-2026-030', TOURS.BLUE_TEAM, 'venue-042', '2026-10-23', '2026-11-02'"; }
);

// 17. 2026 Branson/St Louis overlap
content = content.replace(
  /createShow\('show-2026-067', TOURS\.BLUE_TEAM, 'venue-031', '2026-11-20', '2026-11-22'/,
  (m) => { console.log('  Move 2026 St Louis to Red'); return "createShow('show-2026-067', TOURS.RED_TEAM, 'venue-031', '2026-11-20', '2026-11-22'"; }
);

// 18. 2027 WI State Fair/Dells/Bemidji overlap mess
content = content.replace(
  /createShow\('show-2027-047', TOURS\.BLUE_TEAM, 'venue-048', '2027-08-05', '2027-08-15'/,
  (m) => { console.log('  Adjusting 2027 WI State Fair to Aug 1-10'); return "createShow('show-2027-047', TOURS.BLUE_TEAM, 'venue-048', '2027-08-01', '2027-08-10'"; }
);
content = content.replace(
  /createShow\('show-2027-048', TOURS\.BLUE_TEAM, 'venue-081', '2027-08-13', '2027-08-15'/,
  (m) => { console.log('  Adjusting 2027 Bemidji to Aug 6-8'); return "createShow('show-2027-048', TOURS.BLUE_TEAM, 'venue-081', '2027-08-06', '2027-08-08'"; }
);
content = content.replace(
  /createShow\('show-2027-049', TOURS\.BLUE_TEAM, 'venue-082', '2027-08-20', '2027-08-22'/,
  (m) => { console.log('  Adjusting 2027 Brainerd to Aug 13-15'); return "createShow('show-2027-049', TOURS.BLUE_TEAM, 'venue-082', '2027-08-13', '2027-08-15'"; }
);
content = content.replace(
  /createShow\('show-2027-050', TOURS\.BLUE_TEAM, 'venue-032', '2027-08-20', '2027-08-30'/,
  (m) => { console.log('  Adjusting 2027 Nebraska to Aug 27 - Sep 6'); return "createShow('show-2027-050', TOURS.BLUE_TEAM, 'venue-032', '2027-08-27', '2027-09-06'"; }
);

// 19. 2027 Dallas overlaps with Nashville, Appleton
content = content.replace(
  /createShow\('show-2027-054', TOURS\.BLUE_TEAM, 'venue-042', '2027-09-30', '2027-10-10'/,
  (m) => { console.log('  Adjusting 2027 Nashville to Oct 22 - Nov 1'); return "createShow('show-2027-054', TOURS.BLUE_TEAM, 'venue-042', '2027-10-22', '2027-11-01'"; }
);
content = content.replace(
  /createShow\('show-2027-024', TOURS\.BLUE_TEAM, 'venue-045', '2027-10-01', '2027-10-03'/,
  (m) => { console.log('  Adjusting 2027 Appleton to Oct 22-24'); return "createShow('show-2027-024', TOURS.BLUE_TEAM, 'venue-045', '2027-10-22', '2027-10-24'"; }
);

// 20. 2027 Bayfield/Branson overlap
content = content.replace(
  /createShow\('show-2027-025', TOURS\.BLUE_TEAM, 'venue-060', '2027-10-30', '2027-11-01'/,
  (m) => { console.log('  Adjusting 2027 Bayfield to Oct 23-25'); return "createShow('show-2027-025', TOURS.BLUE_TEAM, 'venue-060', '2027-10-23', '2027-10-25'"; }
);

// 21. 2027 Branson/St Louis overlap
content = content.replace(
  /createShow\('show-2027-056', TOURS\.BLUE_TEAM, 'venue-031', '2027-11-19', '2027-11-21'/,
  (m) => { console.log('  Move 2027 St Louis to Red'); return "createShow('show-2027-056', TOURS.RED_TEAM, 'venue-031', '2027-11-19', '2027-11-21'"; }
);

// Write output
fs.writeFileSync(filePath, content);

console.log('\n=== Running verification... ===\n');

// Verify
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;
const shows = [];
let match;
while ((match = showPattern.exec(content)) !== null) {
  shows.push({
    id: match[1],
    tour: match[2] === 'RED_TEAM' ? 'Red Team' : 'Blue Team',
    startDate: match[4],
    endDate: match[5]
  });
}

console.log(`Total shows: ${shows.length}`);

function datesOverlap(s1, e1, s2, e2) {
  return new Date(s1) <= new Date(e2) && new Date(s2) <= new Date(e1);
}

function findOverlaps(teamShows) {
  const overlaps = [];
  const sorted = [...teamShows].sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (datesOverlap(sorted[i].startDate, sorted[i].endDate, sorted[j].startDate, sorted[j].endDate)) {
        overlaps.push([sorted[i], sorted[j]]);
      }
    }
  }
  return overlaps;
}

const redShows = shows.filter(s => s.tour === 'Red Team');
const blueShows = shows.filter(s => s.tour === 'Blue Team');
const redOverlaps = findOverlaps(redShows);
const blueOverlaps = findOverlaps(blueShows);

console.log(`Red Team: ${redShows.length} shows, ${redOverlaps.length} overlaps`);
console.log(`Blue Team: ${blueShows.length} shows, ${blueOverlaps.length} overlaps`);

if (redOverlaps.length > 0) {
  console.log('\nRemaining Red overlaps:');
  redOverlaps.forEach(([a, b]) => console.log(`  ${a.id} (${a.startDate} to ${a.endDate}) <-> ${b.id} (${b.startDate} to ${b.endDate})`));
}
if (blueOverlaps.length > 0) {
  console.log('\nRemaining Blue overlaps:');
  blueOverlaps.forEach(([a, b]) => console.log(`  ${a.id} (${a.startDate} to ${a.endDate}) <-> ${b.id} (${b.startDate} to ${b.endDate})`));
}

if (redOverlaps.length + blueOverlaps.length === 0) {
  console.log('\n✓ SUCCESS! No overlaps remain!');
}
