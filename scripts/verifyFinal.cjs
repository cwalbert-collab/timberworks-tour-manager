// Final verification of show data
const fs = require('fs');
const content = fs.readFileSync('/Users/cooperalbert/lumberjack-tours/src/data/sampleData.js', 'utf-8');

const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;

const shows = [];
let match;
while ((match = showPattern.exec(content)) !== null) {
  const start = new Date(match[4] + 'T12:00:00');
  const end = new Date(match[5] + 'T12:00:00');
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  shows.push({
    id: match[1],
    team: match[2],
    startDate: match[4],
    endDate: match[5],
    days,
    year: parseInt(match[4].substring(0, 4))
  });
}

const red = shows.filter(s => s.team === 'RED_TEAM');
const blue = shows.filter(s => s.team === 'BLUE_TEAM');

console.log('=== FINAL VERIFICATION ===\n');
console.log(`Total: ${shows.length} (Red: ${red.length}, Blue: ${blue.length})\n`);

// Per year
console.log('Shows per year:');
[2023, 2024, 2025, 2026, 2027].forEach(year => {
  const r = red.filter(s => s.year === year).length;
  const b = blue.filter(s => s.year === year).length;
  console.log(`  ${year}: Red=${r}, Blue=${b}`);
});

// Duration
console.log('\nDuration distribution:');
const redW = red.filter(s => s.days <= 3).length;
const redM = red.filter(s => s.days >= 4 && s.days <= 14).length;
const redL = red.filter(s => s.days >= 15).length;
const blueW = blue.filter(s => s.days <= 3).length;
const blueM = blue.filter(s => s.days >= 4 && s.days <= 14).length;
const blueL = blue.filter(s => s.days >= 15).length;

console.log(`  Red:  Weekend=${redW} (${(redW/red.length*100).toFixed(0)}%), Medium=${redM} (${(redM/red.length*100).toFixed(0)}%), Large=${redL} (${(redL/red.length*100).toFixed(0)}%)`);
console.log(`  Blue: Weekend=${blueW} (${(blueW/blue.length*100).toFixed(0)}%), Medium=${blueM} (${(blueM/blue.length*100).toFixed(0)}%), Large=${blueL} (${(blueL/blue.length*100).toFixed(0)}%)`);

// Overlaps
function datesOverlap(s1, e1, s2, e2) {
  const a1 = new Date(s1), b1 = new Date(e1), a2 = new Date(s2), b2 = new Date(e2);
  return a1 <= b2 && a2 <= b1;
}

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

console.log(`\nOverlaps: Red=${countOverlaps(red)}, Blue=${countOverlaps(blue)}`);

// Check for any year over 45
console.log('\nMax shows per year check (max 45):');
let allGood = true;
[2023, 2024, 2025, 2026, 2027].forEach(year => {
  const r = red.filter(s => s.year === year).length;
  const b = blue.filter(s => s.year === year).length;
  if (r > 45 || b > 45) {
    console.log(`  WARNING: ${year} - Red=${r}, Blue=${b}`);
    allGood = false;
  }
});
if (allGood) console.log('  ✓ All years within limit');
