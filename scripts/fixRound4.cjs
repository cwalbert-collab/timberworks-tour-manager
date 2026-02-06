// Round 4 - final cleanup
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Applying round 4 (final) fixes...\n');

// RED TEAM

// 1. Detroit and St Louis on same weekend (Nov 17-24 range) in 2024, 2025, 2026, 2027
// Keep Detroit, move St Louis to Red's earlier slot
content = content.replace(
  /createShow\('show-2024-056', TOURS\.RED_TEAM, 'venue-031', '2024-11-22', '2024-11-24'/,
  (m) => { console.log('  Moving 2024 St Louis to Nov 29 - Dec 1'); return "createShow('show-2024-056', TOURS.RED_TEAM, 'venue-031', '2024-11-29', '2024-12-01'"; }
);
content = content.replace(
  /createShow\('show-2025-056', TOURS\.RED_TEAM, 'venue-031', '2025-11-21', '2025-11-23'/,
  (m) => { console.log('  Moving 2025 St Louis to Nov 28-30'); return "createShow('show-2025-056', TOURS.RED_TEAM, 'venue-031', '2025-11-28', '2025-11-30'"; }
);
content = content.replace(
  /createShow\('show-2026-067', TOURS\.RED_TEAM, 'venue-031', '2026-11-20', '2026-11-22'/,
  (m) => { console.log('  Moving 2026 St Louis to Nov 27-29'); return "createShow('show-2026-067', TOURS.RED_TEAM, 'venue-031', '2026-11-27', '2026-11-29'"; }
);
content = content.replace(
  /createShow\('show-2027-056', TOURS\.RED_TEAM, 'venue-031', '2027-11-19', '2027-11-21'/,
  (m) => { console.log('  Moving 2027 St Louis to Nov 26-28'); return "createShow('show-2027-056', TOURS.RED_TEAM, 'venue-031', '2027-11-26', '2027-11-28'"; }
);

// 2. 2026 Omaha Mar 20-22 overlaps with Rochester Mar 21-22
content = content.replace(
  /createShow\('show-2026-006', TOURS\.RED_TEAM, 'venue-010', '2026-03-21', '2026-03-22'/,
  (m) => { console.log('  Moving 2026 Rochester to Apr 10-11'); return "createShow('show-2026-006', TOURS.RED_TEAM, 'venue-010', '2026-04-10', '2026-04-11'"; }
);

// 3. 2026 Fargo Mar 27-28 overlaps with Eau Claire Mar 27-29
content = content.replace(
  /createShow\('show-2026-039', TOURS\.RED_TEAM, 'venue-007', '2026-03-27', '2026-03-29'/,
  (m) => { console.log('  Moving 2026 Eau Claire spring to Apr 17-19'); return "createShow('show-2026-039', TOURS.RED_TEAM, 'venue-007', '2026-04-17', '2026-04-19'"; }
);

// 4. 2026 Cincinnati Apr 3-5 overlaps with Sioux Falls Apr 3-5
content = content.replace(
  /createShow\('show-2026-038', TOURS\.RED_TEAM, 'venue-035', '2026-04-03', '2026-04-05'/,
  (m) => { console.log('  Moving 2026 Sioux Falls to Mar 14-16'); return "createShow('show-2026-038', TOURS.RED_TEAM, 'venue-035', '2026-03-14', '2026-03-16'"; }
);

// 5. 2026 MN State Fair Sep 27 - Sep 7 overlaps with Iowa Sep 4-14
content = content.replace(
  /createShow\('show-2026-025', TOURS\.RED_TEAM, 'venue-013', '2026-09-04', '2026-09-14'/,
  (m) => { console.log('  Moving 2026 Iowa to Aug 20-29'); return "createShow('show-2026-025', TOURS.RED_TEAM, 'venue-013', '2026-08-20', '2026-08-29'"; }
);

// 6. 2027 MN State Fair Aug 26 - Sep 6 overlaps with Iowa Sep 3-13
content = content.replace(
  /createShow\('show-2027-021', TOURS\.RED_TEAM, 'venue-013', '2027-09-03', '2027-09-13'/,
  (m) => { console.log('  Moving 2027 Iowa to Aug 18-28'); return "createShow('show-2027-021', TOURS.RED_TEAM, 'venue-013', '2027-08-18', '2027-08-28'"; }
);

// BLUE TEAM

// 1. 2023 WI State Fair Aug 3-13 overlaps with Bemidji Aug 11-13
content = content.replace(
  /createShow\('show-2023-042', TOURS\.BLUE_TEAM, 'venue-081', '2023-08-11', '2023-08-13'/,
  (m) => { console.log('  Moving 2023 Bemidji to Aug 18-20'); return "createShow('show-2023-042', TOURS.BLUE_TEAM, 'venue-081', '2023-08-18', '2023-08-20'"; }
);

// 2. 2023 Brainerd Aug 25-27 overlaps with Nebraska Aug 25 - Sep 4
content = content.replace(
  /createShow\('show-2023-044', TOURS\.BLUE_TEAM, 'venue-032', '2023-08-25', '2023-09-04'/,
  (m) => { console.log('  Moving 2023 Nebraska to Sep 1-11'); return "createShow('show-2023-044', TOURS.BLUE_TEAM, 'venue-032', '2023-09-01', '2023-09-11'"; }
);

// 3. 2023 Branson Nov 5-26 overlaps with Nashville Nov 7-17 and Detroit Nov 17-19
// Keep Branson, move Nashville earlier, move Detroit back to Blue later
content = content.replace(
  /createShow\('show-2023-046', TOURS\.BLUE_TEAM, 'venue-042', '2023-11-07', '2023-11-17'/,
  (m) => { console.log('  Moving 2023 Nashville to Oct 25 - Nov 4'); return "createShow('show-2023-046', TOURS.BLUE_TEAM, 'venue-042', '2023-10-25', '2023-11-04'"; }
);
// Detroit was moved to Red - keep it there to avoid conflict

// 4. 2024 WI State Fair Aug 1-11 overlaps with Bemidji Aug 8-10
content = content.replace(
  /createShow\('show-2024-048', TOURS\.BLUE_TEAM, 'venue-081', '2024-08-08', '2024-08-10'/,
  (m) => { console.log('  Moving 2024 Bemidji to Aug 15-17'); return "createShow('show-2024-048', TOURS.BLUE_TEAM, 'venue-081', '2024-08-15', '2024-08-17'"; }
);

// 5. 2024 Brainerd Aug 22-24 overlaps with Nebraska Aug 23 - Sep 2
content = content.replace(
  /createShow\('show-2024-050', TOURS\.BLUE_TEAM, 'venue-032', '2024-08-23', '2024-09-02'/,
  (m) => { console.log('  Moving 2024 Nebraska to Aug 30 - Sep 9'); return "createShow('show-2024-050', TOURS.BLUE_TEAM, 'venue-032', '2024-08-30', '2024-09-09'"; }
);

// 6. 2024 Appleton Oct 23-25 overlaps with Bayfield Oct 25-27
content = content.replace(
  /createShow\('show-2024-025', TOURS\.BLUE_TEAM, 'venue-060', '2024-10-25', '2024-10-27'/,
  (m) => { console.log('  Moving 2024 Bayfield to Oct 31 - Nov 2'); return "createShow('show-2024-025', TOURS.BLUE_TEAM, 'venue-060', '2024-10-31', '2024-11-02'"; }
);

// 7. 2024 Branson Nov 4-24 overlaps with Nashville Nov 8-18
content = content.replace(
  /createShow\('show-2024-054', TOURS\.BLUE_TEAM, 'venue-042', '2024-11-08', '2024-11-18'/,
  (m) => { console.log('  Moving 2024 Nashville to Oct 27 - Nov 6'); return "createShow('show-2024-054', TOURS.BLUE_TEAM, 'venue-042', '2024-10-27', '2024-11-06'"; }
);

// 8. 2025 WI Dells Sep 5-14 overlaps with Stillwater Sep 5-7
content = content.replace(
  /createShow\('show-2025-051', TOURS\.BLUE_TEAM, 'venue-094', '2025-09-05', '2025-09-07'/,
  (m) => { console.log('  Moving 2025 Stillwater to Aug 29-31'); return "createShow('show-2025-051', TOURS.BLUE_TEAM, 'venue-094', '2025-08-29', '2025-08-31'"; }
);

// 9. 2025 Appleton Oct 23-25 overlaps with Nashville Oct 24 - Nov 3 and Bayfield Oct 25-27
content = content.replace(
  /createShow\('show-2025-024', TOURS\.BLUE_TEAM, 'venue-045', '2025-10-23', '2025-10-25'/,
  (m) => { console.log('  Moving 2025 Appleton to Oct 17-19'); return "createShow('show-2025-024', TOURS.BLUE_TEAM, 'venue-045', '2025-10-17', '2025-10-19'"; }
);
content = content.replace(
  /createShow\('show-2025-025', TOURS\.BLUE_TEAM, 'venue-060', '2025-10-25', '2025-10-27'/,
  (m) => { console.log('  Moving 2025 Bayfield to Nov 7-9'); return "createShow('show-2025-025', TOURS.BLUE_TEAM, 'venue-060', '2025-11-07', '2025-11-09'"; }
);
content = content.replace(
  /createShow\('show-2025-054', TOURS\.BLUE_TEAM, 'venue-042', '2025-10-24', '2025-11-03'/,
  (m) => { console.log('  Moving 2025 Nashville to Oct 21-31'); return "createShow('show-2025-054', TOURS.BLUE_TEAM, 'venue-042', '2025-10-21', '2025-10-31'"; }
);

// 10. 2026 Cedar Rapids May 1-3 overlaps with St Cloud May 1-3
content = content.replace(
  /createShow\('show-2026-044', TOURS\.BLUE_TEAM, 'venue-014', '2026-05-01', '2026-05-03'/,
  (m) => { console.log('  Moving 2026 Cedar Rapids to Apr 24-26'); return "createShow('show-2026-044', TOURS.BLUE_TEAM, 'venue-014', '2026-04-24', '2026-04-26'"; }
);

// 11. 2026 Bemidji Sep 4-6 overlaps with Nebraska Sep 4-14
content = content.replace(
  /createShow\('show-2026-059', TOURS\.BLUE_TEAM, 'venue-081', '2026-09-04', '2026-09-06'/,
  (m) => { console.log('  Moving 2026 Bemidji to Aug 28-30'); return "createShow('show-2026-059', TOURS.BLUE_TEAM, 'venue-081', '2026-08-28', '2026-08-30'"; }
);

// 12. 2026 Nebraska Sep 4-14 overlaps with Iowa State Fair Sep 10-20 and Stillwater Sep 11-13
content = content.replace(
  /createShow\('show-2026-061', TOURS\.BLUE_TEAM, 'venue-032', '2026-09-04', '2026-09-14'/,
  (m) => { console.log('  Moving 2026 Nebraska to Aug 21-31'); return "createShow('show-2026-061', TOURS.BLUE_TEAM, 'venue-032', '2026-08-21', '2026-08-31'"; }
);

// 13. 2026 Iowa State Fair Sep 10-20 overlaps with Stillwater Sep 11-13
content = content.replace(
  /createShow\('show-2026-063', TOURS\.BLUE_TEAM, 'venue-094', '2026-09-11', '2026-09-13'/,
  (m) => { console.log('  Moving 2026 Stillwater to Sep 25-27'); return "createShow('show-2026-063', TOURS.BLUE_TEAM, 'venue-094', '2026-09-25', '2026-09-27'"; }
);

// 14. 2026 Appleton Oct 23-25 overlaps with Nashville Oct 23 - Nov 2
content = content.replace(
  /createShow\('show-2026-028', TOURS\.BLUE_TEAM, 'venue-045', '2026-10-23', '2026-10-25'/,
  (m) => { console.log('  Moving 2026 Appleton to Oct 16-18'); return "createShow('show-2026-028', TOURS.BLUE_TEAM, 'venue-045', '2026-10-16', '2026-10-18'"; }
);

// 15. 2026 Nashville overlaps with Bayfield Oct 30 - Nov 1 and Branson Nov 2
content = content.replace(
  /createShow\('show-2026-029', TOURS\.BLUE_TEAM, 'venue-060', '2026-10-30', '2026-11-01'/,
  (m) => { console.log('  Moving 2026 Bayfield to Nov 6-8'); return "createShow('show-2026-029', TOURS.BLUE_TEAM, 'venue-060', '2026-11-06', '2026-11-08'"; }
);

// 16. 2027 WI State Fair Aug 1-10 overlaps with Bemidji Aug 6-8
content = content.replace(
  /createShow\('show-2027-048', TOURS\.BLUE_TEAM, 'venue-081', '2027-08-06', '2027-08-08'/,
  (m) => { console.log('  Moving 2027 Bemidji to Aug 13-15'); return "createShow('show-2027-048', TOURS.BLUE_TEAM, 'venue-081', '2027-08-13', '2027-08-15'"; }
);

// 17. 2027 WI Dells Aug 11-21 overlaps with Brainerd Aug 13-15
content = content.replace(
  /createShow\('show-2027-049', TOURS\.BLUE_TEAM, 'venue-082', '2027-08-13', '2027-08-15'/,
  (m) => { console.log('  Moving 2027 Brainerd to Aug 20-22'); return "createShow('show-2027-049', TOURS.BLUE_TEAM, 'venue-082', '2027-08-20', '2027-08-22'"; }
);

// 18. 2027 Nebraska Aug 27 - Sep 6 overlaps with Stillwater Sep 3-5
content = content.replace(
  /createShow\('show-2027-051', TOURS\.BLUE_TEAM, 'venue-094', '2027-09-03', '2027-09-05'/,
  (m) => { console.log('  Moving 2027 Stillwater to Sep 10-12'); return "createShow('show-2027-051', TOURS.BLUE_TEAM, 'venue-094', '2027-09-10', '2027-09-12'"; }
);

// 19. 2027 Appleton Oct 22-24 overlaps with Nashville Oct 22 - Nov 1 and Bayfield Oct 23-25
content = content.replace(
  /createShow\('show-2027-024', TOURS\.BLUE_TEAM, 'venue-045', '2027-10-22', '2027-10-24'/,
  (m) => { console.log('  Moving 2027 Appleton to Oct 15-17'); return "createShow('show-2027-024', TOURS.BLUE_TEAM, 'venue-045', '2027-10-15', '2027-10-17'"; }
);
content = content.replace(
  /createShow\('show-2027-025', TOURS\.BLUE_TEAM, 'venue-060', '2027-10-23', '2027-10-25'/,
  (m) => { console.log('  Moving 2027 Bayfield to Nov 5-7'); return "createShow('show-2027-025', TOURS.BLUE_TEAM, 'venue-060', '2027-11-05', '2027-11-07'"; }
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
} else {
  console.log(`\n${redOverlaps.length + blueOverlaps.length} overlaps remaining - may need more fixes`);
}
