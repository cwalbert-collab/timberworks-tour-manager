// Build final 400-show dataset
// 200 Red, 200 Blue, 75% weekend / 20% medium / 5% large
// ~40 shows per team per year (max 45), no same-team overlaps
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Parse all existing shows
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']*)'(?:,\s*'([^']*)')?\)/g;

const shows = [];
let match;
while ((match = showPattern.exec(content)) !== null) {
  const start = new Date(match[4] + 'T12:00:00');
  const end = new Date(match[5] + 'T12:00:00');
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  shows.push({
    id: match[1],
    team: match[2],
    venue: match[3],
    startDate: match[4],
    endDate: match[5],
    fee: parseInt(match[6]),
    merch: parseInt(match[7]),
    materials: parseInt(match[8]),
    expenses: parseInt(match[9]),
    name: match[10],
    status: match[11] || 'confirmed',
    days,
    year: parseInt(match[4].substring(0, 4))
  });
}

console.log(`Starting with ${shows.length} shows\n`);

// Separate by team
let redShows = shows.filter(s => s.team === 'RED_TEAM');
let blueShows = shows.filter(s => s.team === 'BLUE_TEAM');

// Helper: check if date ranges overlap
function datesOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1 + 'T12:00:00');
  const e1 = new Date(end1 + 'T12:00:00');
  const s2 = new Date(start2 + 'T12:00:00');
  const e2 = new Date(end2 + 'T12:00:00');
  return s1 <= e2 && s2 <= e1;
}

// Helper: find all free weekends for a team in a year
function findFreeWeekends(teamShows, year) {
  const yearShows = teamShows.filter(s => s.year === year);
  const freeWeekends = [];

  // Generate all Fridays in the year
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  for (let d = new Date(startOfYear); d <= endOfYear; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 5) { // Friday
      const friday = new Date(d);
      const sunday = new Date(d);
      sunday.setDate(sunday.getDate() + 2);

      const startStr = friday.toISOString().split('T')[0];
      const endStr = sunday.toISOString().split('T')[0];

      // Check if this weekend is free
      const isFree = !yearShows.some(s => datesOverlap(s.startDate, s.endDate, startStr, endStr));

      // Skip Dec 25-31 (holiday block)
      if (friday.getMonth() === 11 && friday.getDate() >= 24) continue;

      if (isFree) {
        freeWeekends.push({ startDate: startStr, endDate: endStr });
      }
    }
  }
  return freeWeekends;
}

// Helper: count shows per year for a team
function countByYear(teamShows) {
  const counts = { 2023: 0, 2024: 0, 2025: 0, 2026: 0, 2027: 0 };
  teamShows.forEach(s => counts[s.year]++);
  return counts;
}

// STEP 1: Remove excess large shows (keep 10 per team)
console.log('Step 1: Trimming large shows to 10 per team...');

function trimLargeShows(teamShows, teamName) {
  const large = teamShows.filter(s => s.days >= 15);
  const notLarge = teamShows.filter(s => s.days < 15);

  if (large.length > 10) {
    // Keep the 10 most important (highest fee)
    large.sort((a, b) => b.fee - a.fee);
    const kept = large.slice(0, 10);
    const removed = large.slice(10);
    console.log(`  ${teamName}: Removed ${removed.length} large shows`);
    return [...notLarge, ...kept];
  }
  return teamShows;
}

redShows = trimLargeShows(redShows, 'Red');
blueShows = trimLargeShows(blueShows, 'Blue');

// STEP 2: Fix overlaps by moving shows to free weekends
console.log('\nStep 2: Fixing overlaps...');

function fixOverlaps(teamShows, teamName) {
  let fixed = 0;
  let removed = 0;

  // Sort by start date
  teamShows.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  // Find overlaps
  for (let i = 0; i < teamShows.length; i++) {
    for (let j = i + 1; j < teamShows.length; j++) {
      const show1 = teamShows[i];
      const show2 = teamShows[j];

      if (new Date(show2.startDate) > new Date(show1.endDate)) break;

      if (datesOverlap(show1.startDate, show1.endDate, show2.startDate, show2.endDate)) {
        // Move the shorter/cheaper show
        const toMove = show1.days <= show2.days && show1.fee <= show2.fee ? show1 : show2;

        // Find a free weekend in the same year
        const freeWeekends = findFreeWeekends(teamShows, toMove.year);

        if (freeWeekends.length > 0 && toMove.days <= 3) {
          // Move to first available weekend
          const newSlot = freeWeekends[0];
          toMove.startDate = newSlot.startDate;
          toMove.endDate = newSlot.endDate;
          fixed++;
        } else {
          // Can't move - check if we're over 45 for the year, if so remove
          const yearCount = teamShows.filter(s => s.year === toMove.year).length;
          if (yearCount > 40) {
            teamShows.splice(teamShows.indexOf(toMove), 1);
            removed++;
            j--; // Adjust index
          }
        }
      }
    }
  }

  console.log(`  ${teamName}: Fixed ${fixed} overlaps, removed ${removed} unfixable`);
  return teamShows;
}

redShows = fixOverlaps(redShows, 'Red');
blueShows = fixOverlaps(blueShows, 'Blue');

// STEP 3: Add shows to reach 200 per team with proper distribution
console.log('\nStep 3: Adding shows to reach 200 per team...');

// Weekend venue templates (typical small festivals)
const weekendVenues = [
  { venue: 'venue-061', name: 'Ashland Timber Days', fee: 4500 },
  { venue: 'venue-062', name: 'Superior Harbor Fest', fee: 5200 },
  { venue: 'venue-063', name: 'Rhinelander Hodag', fee: 4800 },
  { venue: 'venue-064', name: 'Minocqua Beef-a-Rama', fee: 4200 },
  { venue: 'venue-065', name: 'Merrill Lumber Heritage', fee: 3800 },
  { venue: 'venue-066', name: 'Antigo Logger Days', fee: 4000 },
  { venue: 'venue-067', name: 'Wausau Balloon Rally', fee: 5500 },
  { venue: 'venue-068', name: 'Stevens Point Spud Bowl', fee: 4600 },
  { venue: 'venue-069', name: 'Marshfield Dairy Fest', fee: 4100 },
  { venue: 'venue-070', name: 'Wisconsin Rapids Cranberry', fee: 4400 },
  { venue: 'venue-071', name: 'Tomahawk Fall Ride', fee: 3900 },
  { venue: 'venue-072', name: 'Eagle River Cranberry', fee: 4300 },
  { venue: 'venue-073', name: 'Park Falls Flambeau', fee: 3700 },
  { venue: 'venue-074', name: 'Phillips Czech Fest', fee: 4000 },
  { venue: 'venue-075', name: 'Ladysmith Lumberjill', fee: 4200 },
  { venue: 'venue-076', name: 'Rice Lake Aquafest', fee: 4800 },
  { venue: 'venue-077', name: 'Spooner Rodeo Days', fee: 5100 },
  { venue: 'venue-078', name: 'Shell Lake Town & Country', fee: 3600 },
  { venue: 'venue-079', name: 'Cumberland Rutabaga', fee: 4500 },
  { venue: 'venue-080', name: 'Barron County Fair', fee: 5000 },
];

// Medium show templates (4-7 days)
const mediumVenues = [
  { venue: 'venue-085', name: 'La Crosse Oktoberfest', fee: 12000, days: 5 },
  { venue: 'venue-086', name: 'Green Bay Packers Heritage', fee: 14000, days: 6 },
  { venue: 'venue-087', name: 'Duluth Bayfront Blues', fee: 11000, days: 4 },
  { venue: 'venue-088', name: 'Fargo Summer Nights', fee: 10000, days: 5 },
  { venue: 'venue-089', name: 'Sioux City River-Cade', fee: 9500, days: 4 },
  { venue: 'venue-090', name: 'Rochester Med City', fee: 13000, days: 6 },
];

let nextShowId = 400;

function addShowsToTeam(teamShows, teamName, targetCount) {
  const team = teamName === 'Red' ? 'RED_TEAM' : 'BLUE_TEAM';
  let added = 0;

  // Calculate current distribution
  const currentWeekend = teamShows.filter(s => s.days <= 3).length;
  const currentMedium = teamShows.filter(s => s.days >= 4 && s.days <= 14).length;

  // Target: 75% weekend, 20% medium (large already set at ~10)
  const targetWeekend = Math.floor(targetCount * 0.75);
  const targetMedium = Math.floor(targetCount * 0.20);

  const needWeekend = Math.max(0, targetWeekend - currentWeekend);
  const needMedium = Math.max(0, targetMedium - currentMedium);
  const needTotal = targetCount - teamShows.length;

  console.log(`  ${teamName}: Need ${needTotal} more shows (${needWeekend} weekend, ${needMedium} medium)`);

  // Add weekend shows first
  for (let year = 2023; year <= 2027 && added < needTotal; year++) {
    const yearShows = teamShows.filter(s => s.year === year);
    if (yearShows.length >= 45) continue; // Skip full years

    const freeWeekends = findFreeWeekends(teamShows, year);
    const slotsToFill = Math.min(freeWeekends.length, 45 - yearShows.length, needTotal - added);

    for (let i = 0; i < slotsToFill && added < needWeekend; i++) {
      const slot = freeWeekends[i];
      const template = weekendVenues[(nextShowId + added) % weekendVenues.length];

      const newShow = {
        id: `show-${year}-${nextShowId++}`,
        team,
        venue: template.venue,
        startDate: slot.startDate,
        endDate: slot.endDate,
        fee: template.fee,
        merch: 300, // 3 days * $100
        materials: Math.round(template.fee * 0.07),
        expenses: Math.round(template.fee * 0.08),
        name: template.name,
        status: year <= 2025 ? 'completed' : 'confirmed',
        days: 3,
        year
      };

      teamShows.push(newShow);
      added++;
    }
  }

  // Add medium shows if still needed
  let mediumAdded = 0;
  for (let year = 2023; year <= 2027 && mediumAdded < needMedium; year++) {
    const yearShows = teamShows.filter(s => s.year === year);
    if (yearShows.length >= 45) continue;

    // Find a gap for medium show (need 4-6 consecutive free days)
    for (let month = 4; month <= 10 && mediumAdded < needMedium; month++) {
      const template = mediumVenues[mediumAdded % mediumVenues.length];
      const startDate = `${year}-${String(month).padStart(2, '0')}-10`;
      const endDay = 10 + template.days - 1;
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

      // Check if slot is free
      const conflicts = teamShows.some(s => s.year === year && datesOverlap(s.startDate, s.endDate, startDate, endDate));

      if (!conflicts) {
        const newShow = {
          id: `show-${year}-${nextShowId++}`,
          team,
          venue: template.venue,
          startDate,
          endDate,
          fee: template.fee,
          merch: template.days * 100,
          materials: Math.round(template.fee * 0.07),
          expenses: Math.round(template.fee * 0.08),
          name: template.name,
          status: year <= 2025 ? 'completed' : 'confirmed',
          days: template.days,
          year
        };

        teamShows.push(newShow);
        mediumAdded++;
        added++;
      }
    }
  }

  console.log(`  ${teamName}: Added ${added} shows`);
  return teamShows;
}

redShows = addShowsToTeam(redShows, 'Red', 200);
blueShows = addShowsToTeam(blueShows, 'Blue', 200);

// STEP 4: Final overlap check and trim to exactly 200
console.log('\nStep 4: Final cleanup...');

function finalCleanup(teamShows, teamName, target) {
  // Remove any remaining overlaps
  teamShows.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const toRemove = new Set();
  for (let i = 0; i < teamShows.length; i++) {
    if (toRemove.has(teamShows[i].id)) continue;
    for (let j = i + 1; j < teamShows.length; j++) {
      if (toRemove.has(teamShows[j].id)) continue;
      if (new Date(teamShows[j].startDate) > new Date(teamShows[i].endDate)) break;
      if (datesOverlap(teamShows[i].startDate, teamShows[i].endDate, teamShows[j].startDate, teamShows[j].endDate)) {
        // Remove the one with lower fee
        const removeShow = teamShows[i].fee < teamShows[j].fee ? teamShows[i] : teamShows[j];
        toRemove.add(removeShow.id);
      }
    }
  }

  teamShows = teamShows.filter(s => !toRemove.has(s.id));
  console.log(`  ${teamName}: Removed ${toRemove.size} remaining overlaps`);

  // Trim to target if over
  if (teamShows.length > target) {
    // Remove lowest fee weekend shows
    teamShows.sort((a, b) => a.fee - b.fee);
    const excess = teamShows.length - target;
    teamShows = teamShows.slice(excess);
    console.log(`  ${teamName}: Trimmed ${excess} to reach ${target}`);
  }

  return teamShows;
}

redShows = finalCleanup(redShows, 'Red', 200);
blueShows = finalCleanup(blueShows, 'Blue', 200);

// Generate final output
console.log('\n=== FINAL STATISTICS ===\n');

const allShows = [...redShows, ...blueShows];

console.log(`Total shows: ${allShows.length} (Red: ${redShows.length}, Blue: ${blueShows.length})`);
console.log('');

// Per year
console.log('Shows per year:');
[2023, 2024, 2025, 2026, 2027].forEach(year => {
  const r = redShows.filter(s => s.year === year).length;
  const b = blueShows.filter(s => s.year === year).length;
  console.log(`  ${year}: Red=${r}, Blue=${b}, Total=${r+b}`);
});

// Duration distribution
console.log('');
console.log('Duration distribution:');
const redWeekend = redShows.filter(s => s.days <= 3).length;
const redMedium = redShows.filter(s => s.days >= 4 && s.days <= 14).length;
const redLarge = redShows.filter(s => s.days >= 15).length;
const blueWeekend = blueShows.filter(s => s.days <= 3).length;
const blueMedium = blueShows.filter(s => s.days >= 4 && s.days <= 14).length;
const blueLarge = blueShows.filter(s => s.days >= 15).length;

console.log(`  Red:  Weekend=${redWeekend} (${(redWeekend/redShows.length*100).toFixed(0)}%), Medium=${redMedium} (${(redMedium/redShows.length*100).toFixed(0)}%), Large=${redLarge} (${(redLarge/redShows.length*100).toFixed(0)}%)`);
console.log(`  Blue: Weekend=${blueWeekend} (${(blueWeekend/blueShows.length*100).toFixed(0)}%), Medium=${blueMedium} (${(blueMedium/blueShows.length*100).toFixed(0)}%), Large=${blueLarge} (${(blueLarge/blueShows.length*100).toFixed(0)}%)`);

// Final overlap check
function countOverlaps(teamShows) {
  let count = 0;
  const sorted = [...teamShows].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (new Date(sorted[j].startDate) > new Date(sorted[i].endDate)) break;
      if (datesOverlap(sorted[i].startDate, sorted[i].endDate, sorted[j].startDate, sorted[j].endDate)) {
        count++;
      }
    }
  }
  return count;
}

console.log('');
console.log(`Overlaps: Red=${countOverlaps(redShows)}, Blue=${countOverlaps(blueShows)}`);

// Write the new sampleData.js
console.log('\nWriting updated sampleData.js...');

// Read existing file to get the header/venue definitions
const headerEnd = content.indexOf('export const sampleShows');
const header = content.substring(0, headerEnd);

// Generate show entries
const showEntries = allShows
  .sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return new Date(a.startDate) - new Date(b.startDate);
  })
  .map(s => {
    const statusPart = s.status ? `, '${s.status}'` : '';
    return `  createShow('${s.id}', TOURS.${s.team}, '${s.venue}', '${s.startDate}', '${s.endDate}', ${s.fee}, ${s.merch}, ${s.materials}, ${s.expenses}, '${s.name}'${statusPart})`;
  })
  .join(',\n');

const newContent = header + `export const sampleShows = [\n${showEntries}\n];\n`;

fs.writeFileSync(filePath, newContent);
console.log('Done!');
