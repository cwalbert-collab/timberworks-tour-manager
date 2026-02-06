// Apply fixes to sampleData.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Applying fixes to sampleData.js...\n');

// Fix 1: Remove all additional shows (IDs 100+, 200+)
// These are the shows added at the end that duplicate dates
const additionalShowPattern = /\s*createShow\('show-\d{4}-(1\d{2}|2\d{2})',[\s\S]*?\),?\n/g;
const beforeCount = (content.match(/createShow\(/g) || []).length;
content = content.replace(additionalShowPattern, '\n');
const afterRemoval = (content.match(/createShow\(/g) || []).length;
console.log(`Removed ${beforeCount - afterRemoval} additional shows (IDs 100+, 200+)`);

// Clean up the section headers for additional shows
content = content.replace(/\s*\/\/ =+\n\s*\/\/ ADDITIONAL REGIONAL SHOWS[\s\S]*?(?=\n\];)/g, '\n');
content = content.replace(/\s*\/\/ =+\n\s*\/\/ ADDITIONAL FILL SHOWS[\s\S]*?(?=\n\];)/g, '\n');

// Fix 2: Move Dallas State Fair from Red Team to Blue Team (all years)
// Dallas conflicts with KC Renaissance Faire which is also on Red Team
const dallasPattern = /createShow\('(show-\d{4}-(?:019|023|027))', TOURS\.RED_TEAM, 'venue-039'/g;
content = content.replace(dallasPattern, (match, showId) => {
  console.log(`  Moving ${showId} (Dallas State Fair) from Red to Blue`);
  return match.replace('TOURS.RED_TEAM', 'TOURS.BLUE_TEAM');
});

// Fix 3: Move Appleton Oktoberfest from Red to Blue during KC Ren period
// Show IDs: 2023-020, 2024-024, 2025-024, 2026-028, 2027-024
const appletonPattern = /createShow\('(show-\d{4}-0(?:20|24|28))', TOURS\.RED_TEAM, 'venue-045'/g;
content = content.replace(appletonPattern, (match, showId) => {
  console.log(`  Moving ${showId} (Appleton Oktoberfest) from Red to Blue`);
  return match.replace('TOURS.RED_TEAM', 'TOURS.BLUE_TEAM');
});

// Fix 4: Move Bayfield Apple Festival from Red to Blue during KC Ren period
// Show IDs: 2023-021, 2024-025, 2025-025, 2026-029, 2027-025
const bayfieldPattern = /createShow\('(show-\d{4}-0(?:21|25|29))', TOURS\.RED_TEAM, 'venue-060'/g;
content = content.replace(bayfieldPattern, (match, showId) => {
  console.log(`  Moving ${showId} (Bayfield Apple Festival) from Red to Blue`);
  return match.replace('TOURS.RED_TEAM', 'TOURS.BLUE_TEAM');
});

// Fix 5: Adjust Twin Cities July 4th to end on July 4/5 instead of July 6
// This prevents overlap with Traverse City Cherry Festival
const twinCitiesJulyPattern = /createShow\('(show-\d{4}-(?:012|014))', TOURS\.RED_TEAM, 'venue-012', '(\d{4})-07-0[123]', '(\d{4})-07-0[56]'/g;
content = content.replace(twinCitiesJulyPattern, (match, showId, year1, year2) => {
  const newMatch = match.replace(/'(\d{4})-07-0[56]'/, `'${year2}-07-04'`);
  console.log(`  Adjusted ${showId} (Twin Cities July 4th) to end July 4`);
  return newMatch;
});

// Fix 6: 2026 specific - show-2026-030 Nashville is on Red, overlaps with KC Ren
// Move to Blue
content = content.replace(
  /createShow\('show-2026-030', TOURS\.RED_TEAM, 'venue-042'/,
  (match) => {
    console.log('  Moving show-2026-030 (Nashville) from Red to Blue');
    return match.replace('TOURS.RED_TEAM', 'TOURS.BLUE_TEAM');
  }
);

// Fix 7: 2026 Houston overlaps with Fargo - move Fargo (005) a week later
content = content.replace(
  /createShow\('show-2026-005', TOURS\.RED_TEAM, 'venue-036', '2026-03-07', '2026-03-08'/,
  (match) => {
    console.log('  Adjusted show-2026-005 (Fargo) to March 20-21');
    return "createShow('show-2026-005', TOURS.RED_TEAM, 'venue-036', '2026-03-20', '2026-03-21'";
  }
);

// Fix 8: Blue team summer conflicts - Chicago/Oshkosh overlap
// Chicago ends too late, overlaps with Oshkosh start
// Adjust Chicago to end before Oshkosh (July 20-ish)
const chicagoOshPattern = /createShow\('(show-\d{4}-(?:038|044|054))', TOURS\.BLUE_TEAM, 'venue-017', '(\d{4})-07-1[0-4]', '(\d{4})-07-2[5-9]'/g;
content = content.replace(chicagoOshPattern, (match, showId, year1, year2) => {
  // End Chicago by July 19 instead of July 25+
  const newMatch = match.replace(/'(\d{4})-07-2[5-9]'/, `'${year2}-07-19'`);
  console.log(`  Adjusted ${showId} (Chicago Summer Fest) to end July 19`);
  return newMatch;
});

// Fix 9: Wisconsin State Fair / Wisconsin Dells overlap
// State Fair Aug 1-11, Dells Aug 3-18 on same team
// Move Dells to start after State Fair ends (Aug 15)
const dellsPattern = /createShow\('(show-\d{4}-(?:040|046|056))', TOURS\.BLUE_TEAM, 'venue-003', '(\d{4})-08-0[35]', '(\d{4})-08-(?:18|20)'/g;
content = content.replace(dellsPattern, (match, showId, year1, year2) => {
  // Start Dells Aug 14 instead of Aug 3/5
  const newMatch = match.replace(/'(\d{4})-08-0[35]'/, `'${year1}-08-14'`);
  console.log(`  Adjusted ${showId} (Wisconsin Dells) to start Aug 14`);
  return newMatch;
});

// Fix 10: Brainerd / Nebraska State Fair overlap (same start date)
// Move Brainerd to earlier
const brainerdPattern = /createShow\('(show-\d{4}-(?:043|049|060))', TOURS\.BLUE_TEAM, 'venue-082', '(\d{4})-08-2[235]', '(\d{4})-08-2[457]'/g;
content = content.replace(brainerdPattern, (match, showId, year1, year2) => {
  // Move Brainerd to Aug 18-20
  const newMatch = match.replace(/'(\d{4})-08-2[235]', '(\d{4})-08-2[457]'/, `'${year1}-08-18', '${year1}-08-20'`);
  console.log(`  Adjusted ${showId} (Brainerd Lakes) to Aug 18-20`);
  return newMatch;
});

// Fix 11: MN State Fair / Iowa State Fair overlap
// MN Aug 22 - Sep 2, Iowa Sep 5-15 -> slight overlap in some years
// Check and fix if needed
// Actually looking at the data, these don't overlap - MN ends Sep 4/5, Iowa starts Sep 6/8

// Fix 12: 2026/2027 Blue team: Dubuque/Madison Memorial Day overlap
content = content.replace(
  /createShow\('(show-2026-047)', TOURS\.BLUE_TEAM, 'venue-102', '2026-05-22', '2026-05-24'/,
  (match) => {
    console.log('  Adjusted show-2026-047 (Dubuque) to May 15-17');
    return "createShow('show-2026-047', TOURS.BLUE_TEAM, 'venue-102', '2026-05-15', '2026-05-17'";
  }
);
content = content.replace(
  /createShow\('(show-2027-038)', TOURS\.BLUE_TEAM, 'venue-044', '2027-05-28', '2027-05-31'/,
  (match) => {
    console.log('  Adjusted show-2027-038 (Madison Memorial Day) to May 22-25');
    return "createShow('show-2027-038', TOURS.BLUE_TEAM, 'venue-044', '2027-05-22', '2027-05-25'";
  }
);
content = content.replace(
  /createShow\('(show-2027-039)', TOURS\.BLUE_TEAM, 'venue-051', '2027-05-28', '2027-05-30'/,
  (match) => {
    console.log('  Adjusted show-2027-039 (Superior Harbor) to May 30 - Jun 1');
    return "createShow('show-2027-039', TOURS.BLUE_TEAM, 'venue-051', '2027-05-30', '2027-06-01'";
  }
);

// Fix 13: 2026 Blue - Branson spring overlaps with several shows
// Branson is Feb 25 - Mar 27, but Omaha Feb 27, Sioux Falls Mar 13, Eau Claire Mar 27 overlap
// Move Branson to start later OR move the weekend shows
// Better: Move weekend shows to Red (they're small regional)
content = content.replace(
  /createShow\('show-2026-037', TOURS\.BLUE_TEAM, 'venue-033'/,
  (match) => {
    console.log('  Moving show-2026-037 (Omaha Feb) from Blue to Red');
    return match.replace('TOURS.BLUE_TEAM', 'TOURS.RED_TEAM');
  }
);
content = content.replace(
  /createShow\('show-2026-038', TOURS\.BLUE_TEAM, 'venue-035'/,
  (match) => {
    console.log('  Moving show-2026-038 (Sioux Falls) from Blue to Red');
    return match.replace('TOURS.BLUE_TEAM', 'TOURS.RED_TEAM');
  }
);
content = content.replace(
  /createShow\('show-2026-039', TOURS\.BLUE_TEAM, 'venue-007'/,
  (match) => {
    console.log('  Moving show-2026-039 (Eau Claire spring) from Blue to Red');
    return match.replace('TOURS.BLUE_TEAM', 'TOURS.RED_TEAM');
  }
);

// Fix 14: 2026 Blue - Sturgis Rally on Blue overlaps with WI State Fair, Dells
// Move Sturgis to Red (it was Red in other years)
content = content.replace(
  /createShow\('show-2026-058', TOURS\.BLUE_TEAM, 'venue-034'/,
  (match) => {
    console.log('  Moving show-2026-058 (Sturgis 2026) from Blue to Red');
    return match.replace('TOURS.BLUE_TEAM', 'TOURS.RED_TEAM');
  }
);

// Fix 15: 2026/2027 Blue - Bemidji overlaps with Sheboygan on same dates
// Move Bemidji slightly earlier
content = content.replace(
  /createShow\('(show-2026-059)', TOURS\.BLUE_TEAM, 'venue-081', '2026-08-14', '2026-08-16'/,
  (match) => {
    console.log('  Adjusted show-2026-059 (Bemidji) to Aug 21-23');
    return "createShow('show-2026-059', TOURS.BLUE_TEAM, 'venue-081', '2026-08-21', '2026-08-23'";
  }
);

// Write the fixed content
fs.writeFileSync(filePath, content);

console.log('\n=== Done! Running verification... ===\n');

// Now verify no overlaps remain
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;
const shows = [];
let match;
while ((match = showPattern.exec(content)) !== null) {
  shows.push({
    id: match[1],
    tour: match[2] === 'RED_TEAM' ? 'Red Team' : 'Blue Team',
    venueId: match[3],
    startDate: match[4],
    endDate: match[5]
  });
}

console.log(`Total shows after fixes: ${shows.length}`);

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
  redOverlaps.forEach(([a, b]) => console.log(`  ${a.id} (${a.startDate}-${a.endDate}) <-> ${b.id} (${b.startDate}-${b.endDate})`));
}
if (blueOverlaps.length > 0) {
  console.log('\nRemaining Blue overlaps:');
  blueOverlaps.forEach(([a, b]) => console.log(`  ${a.id} (${a.startDate}-${a.endDate}) <-> ${b.id} (${b.startDate}-${b.endDate})`));
}
