// Fix payment structure for half of 2+ week shows
// Only charge for Thu-Fri-Sat-Sun days
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.js');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Finding shows over 2 weeks (15+ days)...\n');

// First pass: identify all 2+ week shows
const showPattern = /createShow\('([^']+)',\s*TOURS\.(RED_TEAM|BLUE_TEAM),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+)/g;

const longShows = [];
let match;
while ((match = showPattern.exec(content)) !== null) {
  const startDate = match[4];
  const endDate = match[5];
  const start = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  if (totalDays >= 15) {
    longShows.push({
      id: match[1],
      team: match[2],
      venue: match[3],
      startDate,
      endDate,
      fee: parseInt(match[6]),
      merch: parseInt(match[7]),
      totalDays
    });
  }
}

console.log(`Found ${longShows.length} shows over 2 weeks\n`);

// Randomly select half
const shuffled = [...longShows].sort(() => Math.random() - 0.5);
const selectedShows = shuffled.slice(0, Math.floor(longShows.length / 2));

console.log(`Randomly selected ${selectedShows.length} shows for weekend-only pricing:\n`);

// Function to count Thu-Sun days in a date range
function countWeekendDays(startDate, endDate) {
  const start = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');
  let count = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu, 5=Fri, 6=Sat
    if (day === 0 || day === 4 || day === 5 || day === 6) {
      count++;
    }
  }
  return count;
}

// Apply changes to selected shows
selectedShows.forEach(show => {
  const weekendDays = countWeekendDays(show.startDate, show.endDate);
  const ratio = weekendDays / show.totalDays;

  // New fee = original fee * ratio (proportional to weekend days)
  const newFee = Math.round(show.fee * ratio);

  // New merch = $100 per weekend day
  const newMerch = weekendDays * 100;

  console.log(`  ${show.id}: ${show.totalDays} days → ${weekendDays} Thu-Sun days (${(ratio * 100).toFixed(0)}%)`);
  console.log(`    Fee: $${show.fee.toLocaleString()} → $${newFee.toLocaleString()}`);
  console.log(`    Merch: $${show.merch} → $${newMerch}`);

  // Replace in content
  const searchPattern = new RegExp(
    `createShow\\('${show.id}',\\s*TOURS\\.${show.team},\\s*'${show.venue}',\\s*'${show.startDate}',\\s*'${show.endDate}',\\s*${show.fee},\\s*${show.merch}`
  );

  content = content.replace(searchPattern,
    `createShow('${show.id}', TOURS.${show.team}, '${show.venue}', '${show.startDate}', '${show.endDate}', ${newFee}, ${newMerch}`
  );
});

fs.writeFileSync(filePath, content);

console.log(`\n✓ Updated ${selectedShows.length} shows to weekend-only pricing`);

// Summary
const totalOriginalFee = selectedShows.reduce((sum, s) => sum + s.fee, 0);
const totalNewFee = selectedShows.reduce((sum, s) => {
  const weekendDays = countWeekendDays(s.startDate, s.endDate);
  return sum + Math.round(s.fee * (weekendDays / s.totalDays));
}, 0);

console.log(`\nTotal fee reduction: $${totalOriginalFee.toLocaleString()} → $${totalNewFee.toLocaleString()}`);
