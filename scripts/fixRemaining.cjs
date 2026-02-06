// Fix remaining overlaps - round 2
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Applying round 2 fixes...\n');

// The problem: Dallas State Fair is on Blue, but so are Nashville, Appleton, Bayfield, Minocqua, Eagle River, Branson
// These ALL overlap with Dallas!
// Solution: During Dallas period (late Sep - mid Oct), Blue Team is ONLY at Dallas
// Remove/reschedule the conflicting weekend shows

// Strategy:
// 1. Dallas (Blue) is the anchor event for Oct in those years
// 2. Move Nashville to Red (it's different region anyway)
// 3. Remove Minocqua Beef-A-Rama and Eagle River Cranberry overlaps (they're small)
// 4. Keep Branson but adjust dates to not overlap

// Fix 1: Nashville goes back to Red (it doesn't overlap with KC Ren which ends Oct 19/22)
// Actually Nashville starts Oct 5-15 which DOES overlap with KC Ren
// So Nashville stays Blue but we need to stagger it with Dallas

// Better approach: Nashville runs AFTER Dallas ends, not during
// Dallas ends Oct 19-22, Nashville can start Oct 24

// Let's check what we have and make targeted fixes

// Fix the October mess - Blue Team
// Dallas: Sep 26-29 to Oct 19-22 (all years)
// Nashville (show-XXX-046 in 2023, etc) should start AFTER Oct 22
const nashvillePattern = /createShow\('(show-\d{4}-(?:046|052|054|030))', TOURS\.BLUE_TEAM, 'venue-042', '\d{4}-10-0[135]', '\d{4}-10-1[35]'/g;
content = content.replace(nashvillePattern, (match, showId) => {
  const year = match.match(/'\d{4}/)[0].slice(1);
  console.log(`  Adjusting ${showId} (Nashville) to Oct 24 - Nov 3`);
  return `createShow('${showId}', TOURS.BLUE_TEAM, 'venue-042', '${year}-10-24', '${year}-11-03'`;
});

// Appleton Oktoberfest was moved to Blue but now conflicts with Dallas
// Move it back to Red and adjust dates to be AFTER KC Ren ends (Oct 22+)
// Actually Oct 6-8 during KC Ren is problematic for Red too
// Best solution: Appleton goes to late October AFTER both big events end
// Or: Remove Appleton from conflict years and keep it only in years without conflict

// For simplicity, let's move Appleton to post-KC/Dallas period (Oct 24 weekend)
const appletonPostFix = /createShow\('(show-\d{4}-(?:020|024|028))', TOURS\.BLUE_TEAM, 'venue-045', '(\d{4})-10-0[2346]', '(\d{4})-10-0[4568]'/g;
content = content.replace(appletonPostFix, (match, showId, year1, year2) => {
  console.log(`  Adjusting ${showId} (Appleton Oktoberfest) to Oct 23-25`);
  return `createShow('${showId}', TOURS.BLUE_TEAM, 'venue-045', '${year1}-10-23', '${year1}-10-25'`;
});

// Bayfield Apple Festival - same treatment, move to post-Dallas
const bayfieldPostFix = /createShow\('(show-\d{4}-(?:021|025|029))', TOURS\.BLUE_TEAM, 'venue-060', '(\d{4})-10-0[89]', '(\d{4})-10-1[012]'/g;
content = content.replace(bayfieldPostFix, (match, showId, year1, year2) => {
  // Move to late October
  console.log(`  Adjusting ${showId} (Bayfield Apple) to Oct 30 - Nov 1`);
  return `createShow('${showId}', TOURS.BLUE_TEAM, 'venue-060', '${year1}-10-30', '${year1}-11-01'`;
});

// Remove Minocqua Beef-A-Rama and Eagle River Cranberry during Dallas period
// These are shows 047, 048, 052, 053, 064, 065 depending on year
const minocquaPattern = /\s*createShow\('show-\d{4}-(?:047|048|052|053|064|065)', TOURS\.BLUE_TEAM, 'venue-054'[^)]+\),?\n/g;
content = content.replace(minocquaPattern, '\n');
console.log('  Removed Minocqua Beef-A-Rama shows during Dallas period');

const eagleRiverPattern = /\s*createShow\('show-\d{4}-(?:048|053|065)', TOURS\.BLUE_TEAM, 'venue-055'[^)]+\),?\n/g;
content = content.replace(eagleRiverPattern, '\n');
console.log('  Removed Eagle River Cranberry shows during Dallas period');

// Fix Chicago Summer Fest / Oshkosh overlap
// Chicago should end by July 19, Oshkosh starts July 20+
// Already tried to fix but might not have caught all patterns
content = content.replace(
  /createShow\('(show-2023-038)', TOURS\.BLUE_TEAM, 'venue-017', '2023-07-14', '2023-07-30'/,
  (match) => {
    console.log('  Adjusting 2023 Chicago to end July 18');
    return "createShow('show-2023-038', TOURS.BLUE_TEAM, 'venue-017', '2023-07-14', '2023-07-18'";
  }
);

content = content.replace(
  /createShow\('(show-2027-044)', TOURS\.BLUE_TEAM, 'venue-017', '2027-07-09', '2027-07-25'/,
  (match) => {
    console.log('  Adjusting 2027 Chicago to end July 17');
    return "createShow('show-2027-044', TOURS.BLUE_TEAM, 'venue-017', '2027-07-09', '2027-07-17'";
  }
);

// Fix Wisconsin State Fair / Wisconsin Dells overlap
// Dells should start AFTER State Fair ends (Aug 12+)
content = content.replace(
  /createShow\('(show-2025-046)', TOURS\.BLUE_TEAM, 'venue-003', '2025-08-02', '2025-08-17'/,
  (match) => {
    console.log('  Adjusting 2025 WI Dells to Aug 14-24');
    return "createShow('show-2025-046', TOURS.BLUE_TEAM, 'venue-003', '2025-08-14', '2025-08-24'";
  }
);
content = content.replace(
  /createShow\('(show-2026-056)', TOURS\.BLUE_TEAM, 'venue-003', '2026-08-01', '2026-08-16'/,
  (match) => {
    console.log('  Adjusting 2026 WI Dells to Aug 14-24');
    return "createShow('show-2026-056', TOURS.BLUE_TEAM, 'venue-003', '2026-08-14', '2026-08-24'";
  }
);
content = content.replace(
  /createShow\('(show-2027-046)', TOURS\.BLUE_TEAM, 'venue-003', '2027-07-31', '2027-08-15'/,
  (match) => {
    console.log('  Adjusting 2027 WI Dells to Aug 11-21');
    return "createShow('show-2027-046', TOURS.BLUE_TEAM, 'venue-003', '2027-08-11', '2027-08-21'";
  }
);

// Fix WI State Fair / Oshkosh overlap (2026, 2027)
content = content.replace(
  /createShow\('(show-2026-057)', TOURS\.BLUE_TEAM, 'venue-048', '2026-07-30', '2026-08-09'/,
  (match) => {
    console.log('  Adjusting 2026 WI State Fair to Aug 6-16');
    return "createShow('show-2026-057', TOURS.BLUE_TEAM, 'venue-048', '2026-08-06', '2026-08-16'";
  }
);
content = content.replace(
  /createShow\('(show-2027-047)', TOURS\.BLUE_TEAM, 'venue-048', '2027-07-29', '2027-08-08'/,
  (match) => {
    console.log('  Adjusting 2027 WI State Fair to Aug 5-15');
    return "createShow('show-2027-047', TOURS.BLUE_TEAM, 'venue-048', '2027-08-05', '2027-08-15'";
  }
);

// Fix Bemidji / Brainerd / Nebraska State Fair overlaps
// Nebraska runs Aug 22-Sep 1, Brainerd Aug 18-20, Bemidji Aug 15-17
content = content.replace(
  /createShow\('(show-2026-060)', TOURS\.BLUE_TEAM, 'venue-082', '2026-08-21', '2026-08-23'/,
  (match) => {
    console.log('  Adjusting 2026 Brainerd to Aug 28-30');
    return "createShow('show-2026-060', TOURS.BLUE_TEAM, 'venue-082', '2026-08-28', '2026-08-30'";
  }
);
content = content.replace(
  /createShow\('(show-2026-059)', TOURS\.BLUE_TEAM, 'venue-081', '2026-08-21', '2026-08-23'/,
  (match) => {
    console.log('  Adjusting 2026 Bemidji to Sep 4-6');
    return "createShow('show-2026-059', TOURS.BLUE_TEAM, 'venue-081', '2026-09-04', '2026-09-06'";
  }
);

// Fix 2026 Red: Houston overlaps with shows moved there
// Houston ends Mar 14, Omaha Feb 27-Mar 1, Sioux Falls Mar 13-15
content = content.replace(
  /createShow\('(show-2026-038)', TOURS\.RED_TEAM, 'venue-035', '2026-03-13', '2026-03-15'/,
  (match) => {
    console.log('  Adjusting 2026 Sioux Falls to Mar 20-22');
    return "createShow('show-2026-038', TOURS.RED_TEAM, 'venue-035', '2026-03-20', '2026-03-22'";
  }
);

// Fix Red 2026 Twin Cities / Cherry Festival
content = content.replace(
  /createShow\('(show-2026-018)', TOURS\.RED_TEAM, 'venue-012', '2026-07-02', '2026-07-05'/,
  (match) => {
    console.log('  Adjusting 2026 Twin Cities to Jul 1-4');
    return "createShow('show-2026-018', TOURS.RED_TEAM, 'venue-012', '2026-07-01', '2026-07-04'";
  }
);

// Fix Red 2026 Sturgis overlap with MN State Fair timeframe
// Sturgis moved to Red: Aug 7-16, MN State Fair Aug 27-Sep 7
// This is actually fine, no overlap

// Fix Red 2026/2027 MN State Fair / Iowa State Fair overlap
content = content.replace(
  /createShow\('(show-2026-025)', TOURS\.RED_TEAM, 'venue-013', '2026-09-05', '2026-09-15'/,
  (match) => {
    console.log('  Adjusting 2026 Iowa State Fair to Sep 11-20');
    return "createShow('show-2026-025', TOURS.RED_TEAM, 'venue-013', '2026-09-11', '2026-09-20'";
  }
);
content = content.replace(
  /createShow\('(show-2027-021)', TOURS\.RED_TEAM, 'venue-013', '2027-09-04', '2027-09-14'/,
  (match) => {
    console.log('  Adjusting 2027 Iowa State Fair to Sep 10-19');
    return "createShow('show-2027-021', TOURS.RED_TEAM, 'venue-013', '2027-09-10', '2027-09-19'";
  }
);

// Fix Red 2027 Twin Cities / Cherry Festival
content = content.replace(
  /createShow\('(show-2027-015)', TOURS\.RED_TEAM, 'venue-023', '2027-07-03', '2027-07-10'/,
  (match) => {
    console.log('  Adjusting 2027 Cherry Festival to Jul 6-12');
    return "createShow('show-2027-015', TOURS.RED_TEAM, 'venue-023', '2027-07-06', '2027-07-12'";
  }
);

// Fix Blue 2026 Dubuque overlap - already moved but now conflicts differently
content = content.replace(
  /createShow\('(show-2026-046)', TOURS\.BLUE_TEAM, 'venue-015', '2026-05-15', '2026-05-17'/,
  (match) => {
    console.log('  Adjusting 2026 Quad Cities to May 8-10');
    return "createShow('show-2026-046', TOURS.BLUE_TEAM, 'venue-015', '2026-05-08', '2026-05-10'";
  }
);

// Fix Branson fall engagements - they overlap with everything
// Branson Oct 15-Nov 15 overlaps with Dallas, Nashville, Appleton, Bayfield
// Move Branson to start AFTER Dallas ends
content = content.replace(
  /createShow\('(show-2023-049)', TOURS\.BLUE_TEAM, 'venue-030', '2023-10-15', '2023-11-15'/,
  (match) => {
    console.log('  Adjusting 2023 Branson fall to Nov 5-26');
    return "createShow('show-2023-049', TOURS.BLUE_TEAM, 'venue-030', '2023-11-05', '2023-11-26'";
  }
);
content = content.replace(
  /createShow\('(show-2024-055)', TOURS\.BLUE_TEAM, 'venue-030', '2024-10-17', '2024-11-17'/,
  (match) => {
    console.log('  Adjusting 2024 Branson fall to Nov 4-24');
    return "createShow('show-2024-055', TOURS.BLUE_TEAM, 'venue-030', '2024-11-04', '2024-11-24'";
  }
);
content = content.replace(
  /createShow\('(show-2025-055)', TOURS\.BLUE_TEAM, 'venue-030', '2025-10-16', '2025-11-16'/,
  (match) => {
    console.log('  Adjusting 2025 Branson fall to Nov 3-23');
    return "createShow('show-2025-055', TOURS.BLUE_TEAM, 'venue-030', '2025-11-03', '2025-11-23'";
  }
);
content = content.replace(
  /createShow\('(show-2026-066)', TOURS\.BLUE_TEAM, 'venue-030', '2026-10-15', '2026-11-15'/,
  (match) => {
    console.log('  Adjusting 2026 Branson fall to Nov 2-22');
    return "createShow('show-2026-066', TOURS.BLUE_TEAM, 'venue-030', '2026-11-02', '2026-11-22'";
  }
);
content = content.replace(
  /createShow\('(show-2027-055)', TOURS\.BLUE_TEAM, 'venue-030', '2027-10-14', '2027-11-14'/,
  (match) => {
    console.log('  Adjusting 2027 Branson fall to Nov 1-21');
    return "createShow('show-2027-055', TOURS.BLUE_TEAM, 'venue-030', '2027-11-01', '2027-11-21'";
  }
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
