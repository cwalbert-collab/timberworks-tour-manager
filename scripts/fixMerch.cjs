// Fix merch values to $100 per day for all shows
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Fixing merch values to $100 per day...\n');

// Match createShow calls and update merch based on duration
// Pattern: createShow('id', TOURS.TEAM, 'venue', 'startDate', 'endDate', fee, merch, ...)
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+)/g;

let count = 0;
content = content.replace(showPattern, (match, id, team, venue, startDate, endDate, fee, oldMerch) => {
  // Calculate duration in days
  const start = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // New merch = $100 per day
  const newMerch = days * 100;

  count++;

  // Replace the merch value
  return `createShow('${id}', TOURS.${team}, '${venue}', '${startDate}', '${endDate}', ${fee}, ${newMerch}`;
});

fs.writeFileSync(filePath, content);

console.log(`Updated merch for ${count} shows to $100/day\n`);

// Verify the changes
const updatedContent = fs.readFileSync(filePath, 'utf-8');
const verifyPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+)/g;

let totalMerch = 0;
let showCount = 0;
let m;
while ((m = verifyPattern.exec(updatedContent)) !== null) {
  const startDate = m[4];
  const endDate = m[5];
  const merch = parseInt(m[7]);

  const start = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  totalMerch += merch;
  showCount++;
}

console.log(`=== Verification ===`);
console.log(`Total shows: ${showCount}`);
console.log(`Total merch revenue: $${totalMerch.toLocaleString()}`);
console.log(`Average merch per show: $${Math.round(totalMerch / showCount)}`);
