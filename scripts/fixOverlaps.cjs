// Fix overlapping shows within each team
// This script reads the current data, identifies overlaps, and outputs fixes

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let fileContent = fs.readFileSync(filePath, 'utf-8');

// Key fixes needed (based on overlap analysis):
//
// RED TEAM FIXES:
// 1. KC Ren Faire + Dallas State Fair overlap -> Move Dallas to Blue
// 2. Twin Cities July 4th + Traverse City overlap -> Stagger dates
// 3. MN State Fair + Iowa State Fair overlap -> Fix Iowa dates
//
// BLUE TEAM FIXES:
// 1. Chicago Summer Fest + Oshkosh overlap -> Stagger dates
// 2. Wisconsin State Fair + Wisconsin Dells overlap -> Stagger dates
// 3. Nashville + Minocqua/Eagle River -> Stagger dates

// Fix 1: Move Dallas State Fair from Red Team to Blue Team (all years)
// This is a major structural fix - Dallas was incorrectly on Red along with KC Ren

const fixes = [];

// 2023 fixes
fixes.push({
  pattern: /createShow\('show-2023-019', TOURS\.RED_TEAM, 'venue-039', '2023-09-29', '2023-10-22'/,
  replacement: "createShow('show-2023-047', TOURS.BLUE_TEAM, 'venue-039', '2023-09-29', '2023-10-22'"
});

// Fix Appleton Oktoberfest (2023-020) - overlaps with KC Ren -> move to Blue
fixes.push({
  pattern: /createShow\('show-2023-020', TOURS\.RED_TEAM, 'venue-045', '2023-10-06', '2023-10-08'/,
  replacement: "createShow('show-2023-020', TOURS.BLUE_TEAM, 'venue-045', '2023-10-06', '2023-10-08'"
});

// Fix Bayfield Apple Festival (2023-021) - overlaps with KC Ren -> move to Blue
fixes.push({
  pattern: /createShow\('show-2023-021', TOURS\.RED_TEAM, 'venue-060', '2023-10-13', '2023-10-15'/,
  replacement: "createShow('show-2023-021', TOURS.BLUE_TEAM, 'venue-060', '2023-10-13', '2023-10-15'"
});

// Fix the July 4th / Cherry Festival overlaps by adjusting dates
// Currently: Twin Cities 2024-07-03 to 2024-07-06, Traverse City 2024-07-06 to 2024-07-13
// Fix: Make Twin Cities end July 4th, Traverse City starts July 6th (both end/start on July 5th)
const yearlyJulyFix = [2024, 2025, 2026, 2027];
yearlyJulyFix.forEach(year => {
  // Twin Cities ends a day earlier
  fixes.push({
    pattern: new RegExp(`createShow\\('show-${year}-014', TOURS\\.RED_TEAM, 'venue-012', '${year}-07-03', '${year}-07-06'`),
    replacement: `createShow('show-${year}-014', TOURS.RED_TEAM, 'venue-012', '${year}-07-02', '${year}-07-05'`
  });
  // Cherry Festival starts a day later (already Jul 6 in most years, should be fine after Twin Cities ends Jul 5)
});

// Actually, let me be more comprehensive. Let me identify ALL the changes needed.

console.log('Analyzing overlaps and generating fixes...\n');

// Parse shows
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']+)'(?:,\s*'([^']+)')?\)/g;

const shows = [];
let match;
while ((match = showPattern.exec(fileContent)) !== null) {
  shows.push({
    id: match[1],
    tour: match[2] === 'RED_TEAM' ? 'Red Team' : 'Blue Team',
    venueId: match[3],
    startDate: match[4],
    endDate: match[5],
    fee: parseInt(match[6]),
    merch: parseInt(match[7]),
    materials: parseInt(match[8]),
    expenses: parseInt(match[9]),
    notes: match[10],
    status: match[11] || 'completed',
    fullMatch: match[0]
  });
}

console.log(`Parsed ${shows.length} shows\n`);

// Group by team
const redShows = shows.filter(s => s.tour === 'Red Team').sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
const blueShows = shows.filter(s => s.tour === 'Blue Team').sort((a,b) => new Date(a.startDate) - new Date(b.startDate));

function datesOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  return s1 <= e2 && s2 <= e1;
}

function findOverlaps(teamShows) {
  const overlaps = [];
  for (let i = 0; i < teamShows.length; i++) {
    for (let j = i + 1; j < teamShows.length; j++) {
      if (datesOverlap(teamShows[i].startDate, teamShows[i].endDate,
                       teamShows[j].startDate, teamShows[j].endDate)) {
        overlaps.push([teamShows[i], teamShows[j]]);
      }
    }
  }
  return overlaps;
}

const redOverlaps = findOverlaps(redShows);
const blueOverlaps = findOverlaps(blueShows);

console.log('=== RED TEAM OVERLAPS ===');
redOverlaps.forEach(([a, b]) => {
  console.log(`${a.id} (${a.startDate} to ${a.endDate}) vs ${b.id} (${b.startDate} to ${b.endDate})`);
  console.log(`  "${a.notes}" vs "${b.notes}"`);
});

console.log('\n=== BLUE TEAM OVERLAPS ===');
blueOverlaps.forEach(([a, b]) => {
  console.log(`${a.id} (${a.startDate} to ${a.endDate}) vs ${b.id} (${b.startDate} to ${b.endDate})`);
  console.log(`  "${a.notes}" vs "${b.notes}"`);
});

// Strategy for each conflict type:
//
// 1. KC Ren Faire + Dallas State Fair (both 4+ week events)
//    -> Move Dallas to Blue Team (Blue handles Texas/South, Red handles KC)
//
// 2. KC Ren Faire + Appleton Oktoberfest / Bayfield Apple Festival
//    -> Move weekend WI shows to Blue Team
//
// 3. Twin Cities July 4th + Traverse City Cherry Festival
//    -> End Twin Cities July 4th (not 5th/6th), Cherry starts July 6th
//
// 4. Chicago Summer Fest + Oshkosh AirVenture
//    -> Alternate: Odd years Red gets Chicago/Blue gets Oshkosh
//                  Even years flip
//    OR just stagger dates properly
//
// 5. Wisconsin State Fair + Wisconsin Dells
//    -> Similar alternating or stagger
//
// 6. MN State Fair + Iowa State Fair overlap
//    -> Iowa should end before MN starts
//
// 7. Various "additional shows" (100+ IDs) that duplicate dates
//    -> Remove the additional shows entirely

console.log('\n\n=== GENERATING FIX COMMANDS ===\n');

// Generate sed-like replacements
const replacements = [];

// REMOVE all additional shows (100+, 200+) - they cause most conflicts
console.log('Step 1: Remove all additional shows (IDs 100+, 200+)');
const additionalShowIds = shows.filter(s => {
  const numPart = parseInt(s.id.split('-')[2]);
  return numPart >= 100;
}).map(s => s.id);

console.log(`  Will remove ${additionalShowIds.length} additional shows`);

// For main shows, generate specific date adjustments
console.log('\nStep 2: Fix main show date conflicts');

// Output a simpler fix approach: just list what needs to change
console.log('\n--- SHOWS TO MOVE FROM RED TO BLUE ---');
// Dallas State Fair should be Blue team (all years)
shows.filter(s => s.notes.includes('Dallas State Fair') && s.tour === 'Red Team').forEach(s => {
  console.log(`  ${s.id}: ${s.notes}`);
});

// Appleton Oktoberfest during KC Ren should be Blue
shows.filter(s => s.notes.includes('Appleton Oktoberfest') && s.tour === 'Red Team').forEach(s => {
  const year = s.startDate.substring(0, 4);
  // Check if KC Ren is happening at same time
  const kcRen = shows.find(ks => ks.tour === 'Red Team' && ks.notes.includes('KC Renaissance') && ks.startDate.startsWith(year));
  if (kcRen && datesOverlap(s.startDate, s.endDate, kcRen.startDate, kcRen.endDate)) {
    console.log(`  ${s.id}: ${s.notes} (conflicts with ${kcRen.id})`);
  }
});

// Bayfield Apple Festival during KC Ren should be Blue
shows.filter(s => s.notes.includes('Bayfield Apple Festival') && s.tour === 'Red Team').forEach(s => {
  const year = s.startDate.substring(0, 4);
  const kcRen = shows.find(ks => ks.tour === 'Red Team' && ks.notes.includes('KC Renaissance') && ks.startDate.startsWith(year));
  if (kcRen && datesOverlap(s.startDate, s.endDate, kcRen.startDate, kcRen.endDate)) {
    console.log(`  ${s.id}: ${s.notes} (conflicts with ${kcRen.id})`);
  }
});

console.log('\n--- SHOWS NEEDING DATE ADJUSTMENTS ---');
// Twin Cities / Cherry Festival conflicts
shows.filter(s => s.notes.includes('Twin Cities July 4th')).forEach(s => {
  const year = s.startDate.substring(0, 4);
  const cherry = shows.find(cs => cs.tour === 'Red Team' && cs.notes.includes('Cherry Festival') && cs.startDate.startsWith(year));
  if (cherry && datesOverlap(s.startDate, s.endDate, cherry.startDate, cherry.endDate)) {
    console.log(`  ${s.id}: ${s.startDate} to ${s.endDate} -> end on 07-04 (not ${s.endDate.substring(5)})`);
  }
});

// MN State Fair / Iowa State Fair
shows.filter(s => s.notes.includes('Minnesota State Fair') && s.tour === 'Red Team').forEach(s => {
  const year = s.startDate.substring(0, 4);
  const iowa = shows.find(is => is.tour === 'Red Team' && is.notes.includes('Iowa State Fair') && is.startDate.startsWith(year));
  if (iowa && datesOverlap(s.startDate, s.endDate, iowa.startDate, iowa.endDate)) {
    console.log(`  ${iowa.id}: ${iowa.startDate} to ${iowa.endDate} -> should end before MN starts (${s.startDate})`);
  }
});

console.log('\n--- BLUE TEAM SUMMER CONFLICTS ---');
// Chicago / Oshkosh
shows.filter(s => s.notes.includes('Chicago Summer Fest') && s.tour === 'Blue Team').forEach(s => {
  const year = s.startDate.substring(0, 4);
  const osh = shows.find(os => os.tour === 'Blue Team' && os.notes.includes('Oshkosh AirVenture') && os.startDate.startsWith(year));
  if (osh && datesOverlap(s.startDate, s.endDate, osh.startDate, osh.endDate)) {
    console.log(`  ${s.id}: Chicago (${s.startDate} to ${s.endDate})`);
    console.log(`  ${osh.id}: Oshkosh (${osh.startDate} to ${osh.endDate})`);
    console.log(`    -> End Chicago before Oshkosh starts, OR split teams`);
  }
});

console.log('\n\nTotal overlapping pairs: Red=' + redOverlaps.length + ', Blue=' + blueOverlaps.length);
