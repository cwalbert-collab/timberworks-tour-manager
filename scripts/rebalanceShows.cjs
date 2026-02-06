// Rebalance show distribution to 65% weekend, 25% medium, 10% large
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Rebalancing show distribution...\n');

// First, identify and remove some large shows (keep only the most important)
const largeShowsToRemove = [
  // Remove duplicate/less important large shows - keep major ones like State Fairs, Branson, KC Ren Faire
  'show-2023-026', // KC summer - 32 days
  'show-2024-030', // KC summer - 32 days
  'show-2025-031', // KC summer - 31 days
  'show-2026-040', // KC summer - 31 days
  'show-2027-030', // KC summer - 32 days
  'show-2023-001', // 17 day show
  'show-2024-002', // 22 day show
  'show-2025-001', // 17 day show
  'show-2026-002', // 20 day show
  'show-2027-002', // 20 day show
];

console.log(`Removing ${largeShowsToRemove.length} large shows...`);
largeShowsToRemove.forEach(id => {
  const pattern = new RegExp(`\\s*createShow\\('${id}'[^)]+\\),?\\n`, 'g');
  content = content.replace(pattern, '\n');
});

// Now add weekend shows - typical 3-day festival bookings
// Using existing venues, spread across years
const weekendShowsToAdd = [];
const years = [2023, 2024, 2025, 2026, 2027];

// Weekend show templates - typical small festival bookings
const weekendTemplates = [
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
];

// Generate weekend dates that don't overlap with existing shows
// Simple approach: add shows in spring (Apr-May) and fall (Sep-Oct) gaps
const weekendDates = [
  // 2023 additions
  { year: 2023, month: 4, day: 14 }, // Apr
  { year: 2023, month: 4, day: 28 },
  { year: 2023, month: 5, day: 5 },
  { year: 2023, month: 5, day: 19 },
  { year: 2023, month: 6, day: 2 },
  { year: 2023, month: 6, day: 16 },
  { year: 2023, month: 9, day: 8 },
  { year: 2023, month: 9, day: 22 },
  // 2024 additions
  { year: 2024, month: 4, day: 12 },
  { year: 2024, month: 4, day: 26 },
  { year: 2024, month: 5, day: 3 },
  { year: 2024, month: 5, day: 17 },
  { year: 2024, month: 6, day: 7 },
  { year: 2024, month: 6, day: 21 },
  { year: 2024, month: 9, day: 6 },
  { year: 2024, month: 9, day: 20 },
  // 2025 additions
  { year: 2025, month: 4, day: 11 },
  { year: 2025, month: 4, day: 25 },
  { year: 2025, month: 5, day: 2 },
  { year: 2025, month: 5, day: 16 },
  { year: 2025, month: 6, day: 6 },
  { year: 2025, month: 6, day: 20 },
  { year: 2025, month: 9, day: 5 },
  { year: 2025, month: 9, day: 19 },
  // 2026 additions
  { year: 2026, month: 4, day: 10 },
  { year: 2026, month: 4, day: 24 },
  { year: 2026, month: 5, day: 1 },
  { year: 2026, month: 5, day: 29 },
  { year: 2026, month: 6, day: 5 },
  { year: 2026, month: 6, day: 19 },
  { year: 2026, month: 9, day: 11 },
  { year: 2026, month: 9, day: 18 },
  // 2027 additions
  { year: 2027, month: 4, day: 9 },
  { year: 2027, month: 4, day: 23 },
  { year: 2027, month: 5, day: 7 },
  { year: 2027, month: 5, day: 21 },
  { year: 2027, month: 6, day: 4 },
  { year: 2027, month: 6, day: 18 },
  { year: 2027, month: 9, day: 3 },
  { year: 2027, month: 9, day: 17 },
];

// Generate show entries
let showId = 300; // Start with new ID range
const newShows = [];

weekendDates.forEach((date, i) => {
  const template = weekendTemplates[i % weekendTemplates.length];
  const team = i % 2 === 0 ? 'RED_TEAM' : 'BLUE_TEAM';

  const startDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  const endDay = date.day + 2; // 3-day show (Fri-Sun)
  const endDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

  const merch = 300; // 3 days * $100
  const materials = Math.round(template.fee * 0.07);
  const expenses = Math.round(template.fee * 0.08);

  const status = date.year <= 2025 ? 'completed' : 'confirmed';

  newShows.push(`  createShow('show-${date.year}-${showId}', TOURS.${team}, '${template.venue}', '${startDate}', '${endDate}', ${template.fee}, ${merch}, ${materials}, ${expenses}, '${template.name}', '${status}'),`);
  showId++;
});

console.log(`Adding ${newShows.length} new weekend shows...`);

// Find the end of the sampleShows array and insert new shows
const insertPoint = content.lastIndexOf('];');
const newShowsBlock = newShows.join('\n');
content = content.slice(0, insertPoint) + '\n  // Additional weekend shows\n' + newShowsBlock + '\n' + content.slice(insertPoint);

fs.writeFileSync(filePath, content);

// Verify new distribution
console.log('\n=== Verifying new distribution ===\n');

const updatedContent = fs.readFileSync(filePath, 'utf-8');
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;

const shows = [];
let match;
while ((match = showPattern.exec(updatedContent)) !== null) {
  const start = new Date(match[4] + 'T12:00:00');
  const end = new Date(match[5] + 'T12:00:00');
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  shows.push({ id: match[1], team: match[2], days });
}

const weekend = shows.filter(s => s.days <= 3);
const medium = shows.filter(s => s.days >= 4 && s.days <= 14);
const large = shows.filter(s => s.days >= 15);

const redShows = shows.filter(s => s.team === 'RED_TEAM');
const blueShows = shows.filter(s => s.team === 'BLUE_TEAM');

console.log(`Total shows: ${shows.length}`);
console.log(`Red Team: ${redShows.length}, Blue Team: ${blueShows.length}`);
console.log('');
console.log('Duration Distribution:');
console.log(`Weekend (1-3 days): ${weekend.length} (${(weekend.length/shows.length*100).toFixed(1)}%) - target: 65%`);
console.log(`Medium (4-14 days): ${medium.length} (${(medium.length/shows.length*100).toFixed(1)}%) - target: 25%`);
console.log(`Large (15+ days): ${large.length} (${(large.length/shows.length*100).toFixed(1)}%) - target: 10%`);
