// Final cleanup - remove remaining conflicting shows
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Applying final fixes - removing remaining conflicts...\n');

// RED TEAM FINAL FIXES

// 1. 2026 Houston ends Mar 14, Sioux Falls starts Mar 14 - boundary fix
content = content.replace(
  /createShow\('show-2026-038', TOURS\.RED_TEAM, 'venue-035', '2026-03-14', '2026-03-16'/,
  (m) => { console.log('  Moving 2026 Sioux Falls to Mar 18-20'); return "createShow('show-2026-038', TOURS.RED_TEAM, 'venue-035', '2026-03-18', '2026-03-20'"; }
);

// 2. 2026 Rochester Apr 10-11 overlaps with Columbus Apr 10-12
content = content.replace(
  /createShow\('show-2026-006', TOURS\.RED_TEAM, 'venue-010', '2026-04-10', '2026-04-11'/,
  (m) => { console.log('  Moving 2026 Rochester to Feb 14-15'); return "createShow('show-2026-006', TOURS.RED_TEAM, 'venue-010', '2026-02-14', '2026-02-15'"; }
);

// 3. 2026 Grand Rapids Apr 17-19 overlaps with Eau Claire Apr 17-19
content = content.replace(
  /createShow\('show-2026-039', TOURS\.RED_TEAM, 'venue-007', '2026-04-17', '2026-04-19'/,
  (m) => { console.log('  Removing 2026 Eau Claire spring (duplicate weekend)'); return "// Removed: show-2026-039 Eau Claire spring"; }
);

// 4. 2026 Iowa Aug 20-29 overlaps with MN State Fair Aug 27-Sep 7
content = content.replace(
  /createShow\('show-2026-025', TOURS\.RED_TEAM, 'venue-013', '2026-08-20', '2026-08-29'/,
  (m) => { console.log('  Moving 2026 Iowa to Aug 13-22'); return "createShow('show-2026-025', TOURS.RED_TEAM, 'venue-013', '2026-08-13', '2026-08-22'"; }
);

// 5. 2027 Iowa Aug 18-28 overlaps with MN State Fair Aug 26 - Sep 6
content = content.replace(
  /createShow\('show-2027-021', TOURS\.RED_TEAM, 'venue-013', '2027-08-18', '2027-08-28'/,
  (m) => { console.log('  Moving 2027 Iowa to Aug 12-21'); return "createShow('show-2027-021', TOURS.RED_TEAM, 'venue-013', '2027-08-12', '2027-08-21'"; }
);

// BLUE TEAM FINAL FIXES

// 1. 2023 WI Dells Aug 14-20 overlaps with Bemidji Aug 18-20
content = content.replace(
  /createShow\('show-2023-042', TOURS\.BLUE_TEAM, 'venue-081', '2023-08-18', '2023-08-20'/,
  (m) => { console.log('  Moving 2023 Bemidji to Aug 25-27'); return "createShow('show-2023-042', TOURS.BLUE_TEAM, 'venue-081', '2023-08-25', '2023-08-27'"; }
);

// 2. 2023 Nebraska Sep 1-11 overlaps with Stillwater Sep 8-10
content = content.replace(
  /createShow\('show-2023-045', TOURS\.BLUE_TEAM, 'venue-094', '2023-09-08', '2023-09-10'/,
  (m) => { console.log('  Moving 2023 Stillwater to Sep 15-17'); return "createShow('show-2023-045', TOURS.BLUE_TEAM, 'venue-094', '2023-09-15', '2023-09-17'"; }
);

// 3. 2023 Appleton Oct 23-25 overlaps with Nashville Oct 25 - Nov 4
content = content.replace(
  /createShow\('show-2023-020', TOURS\.BLUE_TEAM, 'venue-045', '2023-10-23', '2023-10-25'/,
  (m) => { console.log('  Moving 2023 Appleton to Oct 14-16'); return "createShow('show-2023-020', TOURS.BLUE_TEAM, 'venue-045', '2023-10-14', '2023-10-16'"; }
);

// 4. 2023 Nashville Oct 25 - Nov 4 overlaps with Bayfield Oct 28-30
content = content.replace(
  /createShow\('show-2023-021', TOURS\.BLUE_TEAM, 'venue-060', '2023-10-28', '2023-10-30'/,
  (m) => { console.log('  Moving 2023 Bayfield to Oct 21-23'); return "createShow('show-2023-021', TOURS.BLUE_TEAM, 'venue-060', '2023-10-21', '2023-10-23'"; }
);

// 5. 2023 Branson Nov 5-26 overlaps with Detroit Nov 17-19
// Detroit is on Red now, but the reference says it's still Blue - check & fix
content = content.replace(
  /createShow\('show-2023-050', TOURS\.(RED_TEAM|BLUE_TEAM), 'venue-021', '2023-11-17', '2023-11-19'/,
  (m, team) => { console.log('  Removing 2023 Detroit (conflict with Branson)'); return "// Removed: show-2023-050 Detroit conflict"; }
);

// 6. 2024 WI Dells Aug 14-18 overlaps with Bemidji Aug 15-17
content = content.replace(
  /createShow\('show-2024-048', TOURS\.BLUE_TEAM, 'venue-081', '2024-08-15', '2024-08-17'/,
  (m) => { console.log('  Moving 2024 Bemidji to Aug 22-24'); return "createShow('show-2024-048', TOURS.BLUE_TEAM, 'venue-081', '2024-08-22', '2024-08-24'"; }
);

// 7. 2024 Nebraska Aug 30 - Sep 9 overlaps with Stillwater Sep 6-8
content = content.replace(
  /createShow\('show-2024-051', TOURS\.BLUE_TEAM, 'venue-094', '2024-09-06', '2024-09-08'/,
  (m) => { console.log('  Moving 2024 Stillwater to Sep 13-15'); return "createShow('show-2024-051', TOURS.BLUE_TEAM, 'venue-094', '2024-09-13', '2024-09-15'"; }
);

// 8. 2024 Nashville Oct 27 - Nov 6 overlaps with Bayfield Oct 31 - Nov 2 and Branson Nov 4-24
content = content.replace(
  /createShow\('show-2024-025', TOURS\.BLUE_TEAM, 'venue-060', '2024-10-31', '2024-11-02'/,
  (m) => { console.log('  Removing 2024 Bayfield (conflict with Nashville)'); return "// Removed: show-2024-025 Bayfield"; }
);
content = content.replace(
  /createShow\('show-2024-054', TOURS\.BLUE_TEAM, 'venue-042', '2024-10-27', '2024-11-06'/,
  (m) => { console.log('  Moving 2024 Nashville to Oct 17-27'); return "createShow('show-2024-054', TOURS.BLUE_TEAM, 'venue-042', '2024-10-17', '2024-10-27'"; }
);

// 9. 2025 Nebraska Aug 22 - Sep 1 overlaps with Stillwater Aug 29-31
content = content.replace(
  /createShow\('show-2025-051', TOURS\.BLUE_TEAM, 'venue-094', '2025-08-29', '2025-08-31'/,
  (m) => { console.log('  Moving 2025 Stillwater to Sep 5-7'); return "createShow('show-2025-051', TOURS.BLUE_TEAM, 'venue-094', '2025-09-05', '2025-09-07'"; }
);

// 10. 2025 Dallas Sep 26 - Oct 19 overlaps with Appleton Oct 17-19
content = content.replace(
  /createShow\('show-2025-024', TOURS\.BLUE_TEAM, 'venue-045', '2025-10-17', '2025-10-19'/,
  (m) => { console.log('  Removing 2025 Appleton (conflict with Dallas)'); return "// Removed: show-2025-024 Appleton"; }
);

// 11. 2025 Branson Nov 3-23 overlaps with Bayfield Nov 7-9
content = content.replace(
  /createShow\('show-2025-025', TOURS\.BLUE_TEAM, 'venue-060', '2025-11-07', '2025-11-09'/,
  (m) => { console.log('  Removing 2025 Bayfield (conflict with Branson)'); return "// Removed: show-2025-025 Bayfield"; }
);

// 12. 2026 Fort Wayne Apr 24-26 overlaps with Cedar Rapids Apr 24-26
content = content.replace(
  /createShow\('show-2026-044', TOURS\.BLUE_TEAM, 'venue-014', '2026-04-24', '2026-04-26'/,
  (m) => { console.log('  Moving 2026 Cedar Rapids to May 8-10'); return "createShow('show-2026-044', TOURS.BLUE_TEAM, 'venue-014', '2026-05-08', '2026-05-10'"; }
);

// 13. 2026 WI Dells Aug 14-24 overlaps with Nebraska Aug 21-31
content = content.replace(
  /createShow\('show-2026-061', TOURS\.BLUE_TEAM, 'venue-032', '2026-08-21', '2026-08-31'/,
  (m) => { console.log('  Moving 2026 Nebraska to Sep 4-14'); return "createShow('show-2026-061', TOURS.BLUE_TEAM, 'venue-032', '2026-09-04', '2026-09-14'"; }
);

// 14. 2026 Bemidji and Brainerd both Aug 28-30 - remove one
content = content.replace(
  /createShow\('show-2026-060', TOURS\.BLUE_TEAM, 'venue-082', '2026-08-28', '2026-08-30'/,
  (m) => { console.log('  Removing 2026 Brainerd (duplicate with Bemidji)'); return "// Removed: show-2026-060 Brainerd"; }
);

// 15. 2026 Dallas Sep 25 - Oct 18 overlaps with Stillwater Sep 25-27 and Appleton Oct 16-18
content = content.replace(
  /createShow\('show-2026-063', TOURS\.BLUE_TEAM, 'venue-094', '2026-09-25', '2026-09-27'/,
  (m) => { console.log('  Removing 2026 Stillwater (conflict with Dallas)'); return "// Removed: show-2026-063 Stillwater"; }
);
content = content.replace(
  /createShow\('show-2026-028', TOURS\.BLUE_TEAM, 'venue-045', '2026-10-16', '2026-10-18'/,
  (m) => { console.log('  Removing 2026 Appleton (conflict with Dallas)'); return "// Removed: show-2026-028 Appleton"; }
);

// 16. 2026 Nashville Oct 23 - Nov 2 overlaps with Branson Nov 2-22
content = content.replace(
  /createShow\('show-2026-030', TOURS\.BLUE_TEAM, 'venue-042', '2026-10-23', '2026-11-02'/,
  (m) => { console.log('  Moving 2026 Nashville to Oct 11-21'); return "createShow('show-2026-030', TOURS.BLUE_TEAM, 'venue-042', '2026-10-11', '2026-10-21'"; }
);

// 17. 2026 Branson Nov 2-22 overlaps with Bayfield Nov 6-8
content = content.replace(
  /createShow\('show-2026-029', TOURS\.BLUE_TEAM, 'venue-060', '2026-11-06', '2026-11-08'/,
  (m) => { console.log('  Removing 2026 Bayfield (conflict with Branson)'); return "// Removed: show-2026-029 Bayfield"; }
);

// 18. 2027 WI Dells Aug 11-21 overlaps with Bemidji Aug 13-15 and Brainerd Aug 20-22
content = content.replace(
  /createShow\('show-2027-048', TOURS\.BLUE_TEAM, 'venue-081', '2027-08-13', '2027-08-15'/,
  (m) => { console.log('  Moving 2027 Bemidji to Aug 6-8'); return "createShow('show-2027-048', TOURS.BLUE_TEAM, 'venue-081', '2027-08-06', '2027-08-08'"; }
);
content = content.replace(
  /createShow\('show-2027-049', TOURS\.BLUE_TEAM, 'venue-082', '2027-08-20', '2027-08-22'/,
  (m) => { console.log('  Moving 2027 Brainerd to Aug 27-29'); return "createShow('show-2027-049', TOURS.BLUE_TEAM, 'venue-082', '2027-08-27', '2027-08-29'"; }
);

// 19. 2027 Dallas Sep 24 - Oct 17 overlaps with Appleton Oct 15-17
content = content.replace(
  /createShow\('show-2027-024', TOURS\.BLUE_TEAM, 'venue-045', '2027-10-15', '2027-10-17'/,
  (m) => { console.log('  Removing 2027 Appleton (conflict with Dallas)'); return "// Removed: show-2027-024 Appleton"; }
);

// 20. 2027 Nashville Oct 22 - Nov 1 overlaps with Branson Nov 1-21
content = content.replace(
  /createShow\('show-2027-054', TOURS\.BLUE_TEAM, 'venue-042', '2027-10-22', '2027-11-01'/,
  (m) => { console.log('  Moving 2027 Nashville to Oct 10-20'); return "createShow('show-2027-054', TOURS.BLUE_TEAM, 'venue-042', '2027-10-10', '2027-10-20'"; }
);

// 21. 2027 Branson Nov 1-21 overlaps with Bayfield Nov 5-7
content = content.replace(
  /createShow\('show-2027-025', TOURS\.BLUE_TEAM, 'venue-060', '2027-11-05', '2027-11-07'/,
  (m) => { console.log('  Removing 2027 Bayfield (conflict with Branson)'); return "// Removed: show-2027-025 Bayfield"; }
);

// Write output
fs.writeFileSync(filePath, content);

console.log('\n=== Running final verification... ===\n');

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

// Show duration distribution
const getDuration = (s, e) => Math.ceil((new Date(e) - new Date(s)) / (1000*60*60*24)) + 1;
const durations = shows.map(s => getDuration(s.startDate, s.endDate));
const weekend = durations.filter(d => d <= 3).length;
const medium = durations.filter(d => d >= 4 && d <= 14).length;
const large = durations.filter(d => d >= 15).length;

console.log('\n=== Duration Distribution ===');
console.log(`Weekend (1-3 days): ${weekend} (${(weekend/shows.length*100).toFixed(1)}%)`);
console.log(`Medium (4-14 days): ${medium} (${(medium/shows.length*100).toFixed(1)}%)`);
console.log(`Large (15+ days): ${large} (${(large/shows.length*100).toFixed(1)}%)`);
