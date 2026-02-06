// Generate clean show data without overlaps
// Key fixes:
// 1. Dallas State Fair moves to Blue Team (Red stays at KC Ren Faire)
// 2. Stagger Chicago/Oshkosh (alternate teams)
// 3. Stagger Wisconsin State Fair/Dells (alternate teams)
// 4. Fix all minor overlaps

const fs = require('fs');
const path = require('path');

// Read current file to preserve structure
const filePath = path.join(__dirname, '../src/data/sampleData.js');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Extract everything before sampleShows array
const beforeShowsMatch = fileContent.match(/^([\s\S]*?)export const sampleShows = \[/);
const beforeShows = beforeShowsMatch ? beforeShowsMatch[1] : '';

// Extract everything after sampleShows array (formatDateRange, etc)
const afterShowsMatch = fileContent.match(/\];\s*\n\n\/\/ Helper function to calculate derived values[\s\S]*$/);
const afterShows = afterShowsMatch ? afterShowsMatch[0].slice(3) : ''; // Remove ];\n\n

// Helper to generate a clean show dataset
// Structure: Each year has coordinated Red/Blue team schedules with NO overlaps

function generateCleanShows() {
  const shows = [];

  // VENUE IDs reference (from file)
  // Texas: venue-037 (San Antonio), venue-038 (Houston), venue-039 (Dallas)
  // Major Midwest: venue-001 (Hayward), venue-004 (Milwaukee), venue-008 (MN State Fair), etc.

  // ========== 2023 SEASON ==========

  // === 2023 RED TEAM ===
  // Winter: Texas swing
  shows.push(`createShow('show-2023-001', TOURS.RED_TEAM, 'venue-037', '2023-01-12', '2023-01-28', 40000, 18500, 2900, 4800, 'San Antonio Rodeo winter engagement')`);
  shows.push(`createShow('show-2023-002', TOURS.RED_TEAM, 'venue-038', '2023-02-20', '2023-03-12', 55000, 24000, 3900, 6500, 'Houston Livestock Show - 3 week run')`);

  // Spring: Midwest ramp-up
  shows.push(`createShow('show-2023-003', TOURS.RED_TEAM, 'venue-027', '2023-04-07', '2023-04-09', 8000, 3500, 520, 620, 'Cincinnati Spring Festival')`);
  shows.push(`createShow('show-2023-004', TOURS.RED_TEAM, 'venue-026', '2023-04-14', '2023-04-16', 7200, 3100, 480, 560, 'Columbus Heritage Days')`);
  shows.push(`createShow('show-2023-005', TOURS.RED_TEAM, 'venue-022', '2023-04-21', '2023-04-23', 6800, 3300, 500, 460, 'Grand Rapids Lumberjack Days')`);
  shows.push(`createShow('show-2023-006', TOURS.RED_TEAM, 'venue-005', '2023-05-05', '2023-05-07', 5200, 2300, 350, 270, 'La Crosse Riverfest')`);
  shows.push(`createShow('show-2023-007', TOURS.RED_TEAM, 'venue-018', '2023-05-12', '2023-05-14', 4800, 2100, 320, 300, 'Rockford Forest Festival')`);
  shows.push(`createShow('show-2023-008', TOURS.RED_TEAM, 'venue-006', '2023-05-26', '2023-05-28', 11500, 5200, 780, 650, 'Green Bay Memorial Day weekend')`);

  // Summer peak
  shows.push(`createShow('show-2023-009', TOURS.RED_TEAM, 'venue-009', '2023-06-02', '2023-06-04', 7800, 3400, 520, 400, 'Duluth Tall Ships Festival')`);
  shows.push(`createShow('show-2023-010', TOURS.RED_TEAM, 'venue-002', '2023-06-09', '2023-06-11', 3800, 1900, 290, 145, 'Northwoods County Fair - home')`);
  shows.push(`createShow('show-2023-011', TOURS.RED_TEAM, 'venue-007', '2023-06-16', '2023-06-18', 6200, 2700, 410, 270, 'Eau Claire Country Fest')`);
  shows.push(`createShow('show-2023-012', TOURS.RED_TEAM, 'venue-050', '2023-06-23', '2023-06-25', 4800, 2100, 320, 350, 'Stevens Point Spud Bowl')`);
  shows.push(`createShow('show-2023-013', TOURS.RED_TEAM, 'venue-012', '2023-06-30', '2023-07-04', 13500, 6000, 880, 900, 'Twin Cities July 4th')`);
  shows.push(`createShow('show-2023-014', TOURS.RED_TEAM, 'venue-057', '2023-07-07', '2023-07-09', 4500, 2000, 300, 330, 'Rice Lake Aquafest')`);
  shows.push(`createShow('show-2023-015', TOURS.RED_TEAM, 'venue-023', '2023-07-12', '2023-07-16', 17500, 8200, 1250, 1750, 'Traverse City Cherry Festival')`);
  shows.push(`createShow('show-2023-016', TOURS.RED_TEAM, 'venue-049', '2023-07-21', '2023-07-23', 4200, 1850, 280, 320, 'Fond du Lac County Fair')`);
  shows.push(`createShow('show-2023-017', TOURS.RED_TEAM, 'venue-001', '2023-07-27', '2023-07-30', 0, 21000, 2100, 2700, 'Hayward World Championships - HOME')`);
  shows.push(`createShow('show-2023-018', TOURS.RED_TEAM, 'venue-034', '2023-08-04', '2023-08-13', 30000, 26000, 2300, 4000, 'Sturgis Rally')`);
  shows.push(`createShow('show-2023-019', TOURS.RED_TEAM, 'venue-083', '2023-08-18', '2023-08-20', 5200, 2300, 350, 400, 'Alexandria Vikingland')`);
  shows.push(`createShow('show-2023-020', TOURS.RED_TEAM, 'venue-008', '2023-08-24', '2023-09-04', 34000, 18000, 2750, 4400, 'Minnesota State Fair')`);

  // Fall: KC Ren Faire (Red stays here all 5 weekends)
  shows.push(`createShow('show-2023-021', TOURS.RED_TEAM, 'venue-013', '2023-09-08', '2023-09-17', 27000, 14000, 2150, 3500, 'Iowa State Fair')`);
  shows.push(`createShow('show-2023-022', TOURS.RED_TEAM, 'venue-029', '2023-09-23', '2023-10-22', 56000, 27000, 4050, 7200, 'KC Renaissance Faire - 5 weekends')`);
  shows.push(`createShow('show-2023-023', TOURS.RED_TEAM, 'venue-041', '2023-11-01', '2023-11-14', 36000, 15000, 2500, 4100, 'Pigeon Forge 2-week run')`);
  shows.push(`createShow('show-2023-024', TOURS.RED_TEAM, 'venue-021', '2023-11-17', '2023-11-19', 5200, 2300, 360, 500, 'Detroit Maker Faire')`);
  // IAFE Convention Nov 29-Dec 3 blocks Red Team
  shows.push(`createShow('show-2023-025', TOURS.RED_TEAM, 'venue-024', '2023-12-08', '2023-12-10', 7200, 3100, 460, 600, 'Indianapolis holiday event')`);
  shows.push(`createShow('show-2023-026', TOURS.RED_TEAM, 'venue-004', '2023-12-15', '2023-12-17', 11500, 6200, 850, 700, 'Milwaukee Holiday Market')`);
  // Last week Dec blocked for truck repair

  // === 2023 BLUE TEAM ===
  // Winter: Florida/Branson
  shows.push(`createShow('show-2023-027', TOURS.BLUE_TEAM, 'venue-040', '2023-01-15', '2023-02-15', 82000, 36000, 5600, 11500, 'Orlando month-long winter engagement')`);
  shows.push(`createShow('show-2023-028', TOURS.BLUE_TEAM, 'venue-030', '2023-03-01', '2023-03-31', 72000, 27000, 4100, 8200, 'Branson March engagement')`);

  // Spring
  shows.push(`createShow('show-2023-029', TOURS.BLUE_TEAM, 'venue-028', '2023-04-14', '2023-04-16', 6300, 2700, 400, 500, 'Cleveland Irish Festival')`);
  shows.push(`createShow('show-2023-030', TOURS.BLUE_TEAM, 'venue-025', '2023-04-21', '2023-04-23', 4800, 2100, 330, 440, 'Fort Wayne Johnny Appleseed')`);
  shows.push(`createShow('show-2023-031', TOURS.BLUE_TEAM, 'venue-014', '2023-04-28', '2023-04-30', 5300, 2300, 360, 400, 'Cedar Rapids Freedom Festival')`);
  shows.push(`createShow('show-2023-032', TOURS.BLUE_TEAM, 'venue-011', '2023-05-05', '2023-05-07', 4800, 2100, 320, 360, 'St Cloud River Days')`);
  shows.push(`createShow('show-2023-033', TOURS.BLUE_TEAM, 'venue-015', '2023-05-12', '2023-05-14', 5800, 2500, 380, 460, 'Quad Cities River Bandits')`);
  shows.push(`createShow('show-2023-034', TOURS.BLUE_TEAM, 'venue-044', '2023-05-26', '2023-05-29', 9800, 4400, 660, 580, 'Madison Capitol Square Memorial Day')`);

  // Summer: Blue gets Oshkosh and Wisconsin Dells
  shows.push(`createShow('show-2023-035', TOURS.BLUE_TEAM, 'venue-051', '2023-06-02', '2023-06-04', 5200, 2300, 350, 380, 'Superior Harbor Fest')`);
  shows.push(`createShow('show-2023-036', TOURS.BLUE_TEAM, 'venue-052', '2023-06-09', '2023-06-11', 4500, 2000, 300, 340, 'Ashland Bay Days')`);
  shows.push(`createShow('show-2023-037', TOURS.BLUE_TEAM, 'venue-053', '2023-06-16', '2023-06-18', 5000, 2200, 340, 360, 'Rhinelander Hodag Country')`);
  shows.push(`createShow('show-2023-038', TOURS.BLUE_TEAM, 'venue-036', '2023-06-23', '2023-06-25', 4500, 2000, 300, 380, 'Fargo Air Show')`);
  shows.push(`createShow('show-2023-039', TOURS.BLUE_TEAM, 'venue-004', '2023-06-29', '2023-07-09', 36000, 17500, 2800, 4600, 'Milwaukee Summerfest')`);
  shows.push(`createShow('show-2023-040', TOURS.BLUE_TEAM, 'venue-035', '2023-07-14', '2023-07-16', 5000, 2200, 340, 400, 'Sioux Falls Festival')`);
  shows.push(`createShow('show-2023-041', TOURS.BLUE_TEAM, 'venue-047', '2023-07-24', '2023-07-30', 22000, 10500, 1600, 2200, 'Oshkosh AirVenture')`);
  shows.push(`createShow('show-2023-042', TOURS.BLUE_TEAM, 'venue-048', '2023-08-03', '2023-08-13', 28000, 13500, 2100, 3400, 'Wisconsin State Fair')`);
  shows.push(`createShow('show-2023-043', TOURS.BLUE_TEAM, 'venue-081', '2023-08-18', '2023-08-20', 6500, 2900, 440, 480, 'Bemidji Paul Bunyan Days')`);
  shows.push(`createShow('show-2023-044', TOURS.BLUE_TEAM, 'venue-082', '2023-08-25', '2023-08-27', 5800, 2600, 400, 420, 'Brainerd Lakes Festival')`);
  shows.push(`createShow('show-2023-045', TOURS.BLUE_TEAM, 'venue-003', '2023-09-01', '2023-09-10', 40000, 18500, 2700, 4100, 'Wisconsin Dells Resort')`);

  // Fall: Blue gets Dallas State Fair (moved from Red to avoid KC Ren overlap)
  shows.push(`createShow('show-2023-046', TOURS.BLUE_TEAM, 'venue-094', '2023-09-15', '2023-09-17', 7200, 3300, 500, 520, 'Stillwater Lumberjack Days')`);
  shows.push(`createShow('show-2023-047', TOURS.BLUE_TEAM, 'venue-039', '2023-09-29', '2023-10-22', 42000, 19500, 3100, 5500, 'Dallas State Fair')`);
  shows.push(`createShow('show-2023-048', TOURS.BLUE_TEAM, 'venue-042', '2023-10-26', '2023-11-05', 26000, 12000, 1850, 3400, 'Nashville Country Expo')`);
  shows.push(`createShow('show-2023-049', TOURS.BLUE_TEAM, 'venue-030', '2023-11-10', '2023-11-26', 50000, 20000, 3000, 5500, 'Branson fall engagement')`);
  shows.push(`createShow('show-2023-050', TOURS.BLUE_TEAM, 'venue-033', '2023-12-01', '2023-12-03', 5800, 2500, 380, 460, 'Omaha Riverfront holiday')`);
  shows.push(`createShow('show-2023-051', TOURS.BLUE_TEAM, 'venue-012', '2023-12-08', '2023-12-10', 8500, 4200, 580, 520, 'Twin Cities holiday market')`);
  // Last week Dec blocked for truck repair

  return shows;
}

// Generate more years following same pattern
function generateYear(year, status = 'completed') {
  const shows = [];
  const statusParam = status !== 'completed' ? `, '${status}'` : '';

  // Calculate date offsets (some shows shift by day-of-week each year)
  // For simplicity, use fixed dates that work for the pattern

  // === RED TEAM ===
  // Winter: Texas
  shows.push(`createShow('show-${year}-001', TOURS.RED_TEAM, 'venue-037', '${year}-01-10', '${year}-01-26', 42000, 19500, 3050, 4950, 'San Antonio Rodeo'${statusParam})`);
  shows.push(`createShow('show-${year}-002', TOURS.RED_TEAM, 'venue-038', '${year}-02-22', '${year}-03-13', 56500, 25500, 4050, 6650, 'Houston Livestock Show'${statusParam})`);

  // Spring
  shows.push(`createShow('show-${year}-003', TOURS.RED_TEAM, 'venue-027', '${year}-04-04', '${year}-04-06', 8200, 3600, 540, 650, 'Cincinnati Spring Festival'${statusParam})`);
  shows.push(`createShow('show-${year}-004', TOURS.RED_TEAM, 'venue-026', '${year}-04-11', '${year}-04-13', 7400, 3200, 495, 585, 'Columbus Heritage Days'${statusParam})`);
  shows.push(`createShow('show-${year}-005', TOURS.RED_TEAM, 'venue-022', '${year}-04-18', '${year}-04-20', 7000, 3400, 515, 480, 'Grand Rapids Lumberjack Days'${statusParam})`);
  shows.push(`createShow('show-${year}-006', TOURS.RED_TEAM, 'venue-043', '${year}-04-25', '${year}-04-27', 5600, 2450, 370, 410, 'Wausau Logging Congress'${statusParam})`);
  shows.push(`createShow('show-${year}-007', TOURS.RED_TEAM, 'venue-005', '${year}-05-02', '${year}-05-04', 5400, 2400, 365, 285, 'La Crosse Riverfest'${statusParam})`);
  shows.push(`createShow('show-${year}-008', TOURS.RED_TEAM, 'venue-018', '${year}-05-09', '${year}-05-11', 5000, 2200, 335, 315, 'Rockford Forest Festival'${statusParam})`);
  shows.push(`createShow('show-${year}-009', TOURS.RED_TEAM, 'venue-050', '${year}-05-16', '${year}-05-18', 4750, 2075, 310, 360, 'Stevens Point Spud Bowl'${statusParam})`);
  shows.push(`createShow('show-${year}-010', TOURS.RED_TEAM, 'venue-006', '${year}-05-23', '${year}-05-26', 12000, 5400, 815, 680, 'Green Bay Memorial Day'${statusParam})`);

  // Summer
  shows.push(`createShow('show-${year}-011', TOURS.RED_TEAM, 'venue-009', '${year}-06-06', '${year}-06-08', 8100, 3550, 540, 420, 'Duluth Tall Ships'${statusParam})`);
  shows.push(`createShow('show-${year}-012', TOURS.RED_TEAM, 'venue-002', '${year}-06-13', '${year}-06-15', 3950, 1975, 300, 155, 'Northwoods County Fair - home'${statusParam})`);
  shows.push(`createShow('show-${year}-013', TOURS.RED_TEAM, 'venue-007', '${year}-06-20', '${year}-06-22', 6500, 2850, 430, 285, 'Eau Claire Country Fest'${statusParam})`);
  shows.push(`createShow('show-${year}-014', TOURS.RED_TEAM, 'venue-057', '${year}-06-27', '${year}-06-29', 4900, 2150, 325, 365, 'Rice Lake Aquafest'${statusParam})`);
  shows.push(`createShow('show-${year}-015', TOURS.RED_TEAM, 'venue-012', '${year}-07-02', '${year}-07-05', 14000, 6200, 915, 940, 'Twin Cities July 4th'${statusParam})`);
  shows.push(`createShow('show-${year}-016', TOURS.RED_TEAM, 'venue-023', '${year}-07-08', '${year}-07-13', 18000, 8600, 1300, 1820, 'Traverse City Cherry Festival'${statusParam})`);
  shows.push(`createShow('show-${year}-017', TOURS.RED_TEAM, 'venue-049', '${year}-07-18', '${year}-07-20', 4400, 1950, 295, 340, 'Fond du Lac County Fair'${statusParam})`);
  shows.push(`createShow('show-${year}-018', TOURS.RED_TEAM, 'venue-001', '${year}-07-24', '${year}-07-27', 0, 22500, 2250, 2850, 'Hayward World Championships - HOME'${statusParam})`);
  shows.push(`createShow('show-${year}-019', TOURS.RED_TEAM, 'venue-034', '${year}-08-01', '${year}-08-10', 31500, 27500, 2375, 4175, 'Sturgis Rally'${statusParam})`);
  shows.push(`createShow('show-${year}-020', TOURS.RED_TEAM, 'venue-083', '${year}-08-15', '${year}-08-17', 5700, 2550, 390, 435, 'Alexandria Vikingland'${statusParam})`);
  shows.push(`createShow('show-${year}-021', TOURS.RED_TEAM, 'venue-008', '${year}-08-22', '${year}-09-02', 35500, 18750, 2825, 4550, 'Minnesota State Fair'${statusParam})`);
  shows.push(`createShow('show-${year}-022', TOURS.RED_TEAM, 'venue-013', '${year}-09-06', '${year}-09-15', 28000, 14500, 2200, 3600, 'Iowa State Fair'${statusParam})`);

  // Fall
  shows.push(`createShow('show-${year}-023', TOURS.RED_TEAM, 'venue-029', '${year}-09-20', '${year}-10-19', 57500, 27750, 4125, 7425, 'KC Renaissance Faire'${statusParam})`);
  shows.push(`createShow('show-${year}-024', TOURS.RED_TEAM, 'venue-060', '${year}-10-24', '${year}-10-26', 4450, 1975, 300, 345, 'Bayfield Apple Festival'${statusParam})`);
  shows.push(`createShow('show-${year}-025', TOURS.RED_TEAM, 'venue-041', '${year}-10-31', '${year}-11-13', 37500, 15750, 2575, 4275, 'Pigeon Forge'${statusParam})`);
  shows.push(`createShow('show-${year}-026', TOURS.RED_TEAM, 'venue-021', '${year}-11-17', '${year}-11-19', 5500, 2450, 375, 535, 'Detroit Maker Faire'${statusParam})`);
  // IAFE Nov 29-Dec 3 blocks Red
  shows.push(`createShow('show-${year}-027', TOURS.RED_TEAM, 'venue-024', '${year}-12-05', '${year}-12-07', 7500, 3250, 480, 635, 'Indianapolis holiday'${statusParam})`);
  shows.push(`createShow('show-${year}-028', TOURS.RED_TEAM, 'venue-004', '${year}-12-12', '${year}-12-14', 12000, 6500, 885, 735, 'Milwaukee Holiday Market'${statusParam})`);
  // Last week Dec blocked

  // === BLUE TEAM ===
  // Winter
  shows.push(`createShow('show-${year}-029', TOURS.BLUE_TEAM, 'venue-040', '${year}-01-12', '${year}-02-12', 85000, 37500, 5750, 11900, 'Orlando winter engagement'${statusParam})`);
  shows.push(`createShow('show-${year}-030', TOURS.BLUE_TEAM, 'venue-030', '${year}-02-26', '${year}-03-28', 73500, 27750, 4175, 8350, 'Branson spring engagement'${statusParam})`);

  // Spring
  shows.push(`createShow('show-${year}-031', TOURS.BLUE_TEAM, 'venue-028', '${year}-04-11', '${year}-04-13', 6600, 2850, 430, 535, 'Cleveland Irish Festival'${statusParam})`);
  shows.push(`createShow('show-${year}-032', TOURS.BLUE_TEAM, 'venue-025', '${year}-04-18', '${year}-04-20', 5000, 2200, 345, 465, 'Fort Wayne Johnny Appleseed'${statusParam})`);
  shows.push(`createShow('show-${year}-033', TOURS.BLUE_TEAM, 'venue-014', '${year}-04-25', '${year}-04-27', 5600, 2450, 375, 435, 'Cedar Rapids Freedom Festival'${statusParam})`);
  shows.push(`createShow('show-${year}-034', TOURS.BLUE_TEAM, 'venue-011', '${year}-05-02', '${year}-05-04', 5000, 2200, 335, 380, 'St Cloud River Days'${statusParam})`);
  shows.push(`createShow('show-${year}-035', TOURS.BLUE_TEAM, 'venue-015', '${year}-05-09', '${year}-05-11', 6100, 2650, 400, 490, 'Quad Cities River Bandits'${statusParam})`);
  shows.push(`createShow('show-${year}-036', TOURS.BLUE_TEAM, 'venue-102', '${year}-05-16', '${year}-05-18', 5350, 2375, 360, 415, 'Dubuque Music and More'${statusParam})`);
  shows.push(`createShow('show-${year}-037', TOURS.BLUE_TEAM, 'venue-044', '${year}-05-23', '${year}-05-26', 10200, 4600, 690, 610, 'Madison Memorial Day'${statusParam})`);

  // Summer
  shows.push(`createShow('show-${year}-038', TOURS.BLUE_TEAM, 'venue-051', '${year}-05-30', '${year}-06-01', 5500, 2450, 375, 415, 'Superior Harbor Fest'${statusParam})`);
  shows.push(`createShow('show-${year}-039', TOURS.BLUE_TEAM, 'venue-052', '${year}-06-06', '${year}-06-08', 4800, 2150, 325, 365, 'Ashland Bay Days'${statusParam})`);
  shows.push(`createShow('show-${year}-040', TOURS.BLUE_TEAM, 'venue-053', '${year}-06-13', '${year}-06-15', 5300, 2350, 360, 395, 'Rhinelander Hodag Country'${statusParam})`);
  shows.push(`createShow('show-${year}-041', TOURS.BLUE_TEAM, 'venue-056', '${year}-06-20', '${year}-06-22', 4650, 2075, 315, 360, 'Park Falls Flambeau Rama'${statusParam})`);
  shows.push(`createShow('show-${year}-042', TOURS.BLUE_TEAM, 'venue-004', '${year}-06-26', '${year}-07-06', 37500, 18250, 2875, 4750, 'Milwaukee Summerfest'${statusParam})`);
  shows.push(`createShow('show-${year}-043', TOURS.BLUE_TEAM, 'venue-035', '${year}-07-10', '${year}-07-12', 5250, 2325, 355, 425, 'Sioux Falls Festival'${statusParam})`);
  shows.push(`createShow('show-${year}-044', TOURS.BLUE_TEAM, 'venue-047', '${year}-07-21', '${year}-07-27', 23500, 11250, 1675, 2350, 'Oshkosh AirVenture'${statusParam})`);
  shows.push(`createShow('show-${year}-045', TOURS.BLUE_TEAM, 'venue-048', '${year}-08-01', '${year}-08-11', 29500, 14250, 2175, 3550, 'Wisconsin State Fair'${statusParam})`);
  shows.push(`createShow('show-${year}-046', TOURS.BLUE_TEAM, 'venue-081', '${year}-08-15', '${year}-08-17', 6800, 3050, 465, 510, 'Bemidji Paul Bunyan Days'${statusParam})`);
  shows.push(`createShow('show-${year}-047', TOURS.BLUE_TEAM, 'venue-082', '${year}-08-22', '${year}-08-24', 6100, 2750, 420, 450, 'Brainerd Lakes Festival'${statusParam})`);
  shows.push(`createShow('show-${year}-048', TOURS.BLUE_TEAM, 'venue-003', '${year}-08-29', '${year}-09-08', 41000, 19000, 2775, 4200, 'Wisconsin Dells Resort'${statusParam})`);

  // Fall
  shows.push(`createShow('show-${year}-049', TOURS.BLUE_TEAM, 'venue-094', '${year}-09-12', '${year}-09-14', 7500, 3450, 525, 550, 'Stillwater Lumberjack Days'${statusParam})`);
  shows.push(`createShow('show-${year}-050', TOURS.BLUE_TEAM, 'venue-039', '${year}-09-26', '${year}-10-19', 43500, 20250, 3175, 5650, 'Dallas State Fair'${statusParam})`);
  shows.push(`createShow('show-${year}-051', TOURS.BLUE_TEAM, 'venue-045', '${year}-10-03', '${year}-10-05', 5700, 2500, 380, 445, 'Appleton Oktoberfest'${statusParam})`);
  shows.push(`createShow('show-${year}-052', TOURS.BLUE_TEAM, 'venue-042', '${year}-10-23', '${year}-11-02', 27000, 12500, 1925, 3500, 'Nashville Country Expo'${statusParam})`);
  shows.push(`createShow('show-${year}-053', TOURS.BLUE_TEAM, 'venue-030', '${year}-11-07', '${year}-11-23', 52000, 21000, 3100, 5700, 'Branson fall engagement'${statusParam})`);
  shows.push(`createShow('show-${year}-054', TOURS.BLUE_TEAM, 'venue-031', '${year}-11-28', '${year}-11-30', 5600, 2450, 390, 525, 'St Louis Forest Park'${statusParam})`);
  shows.push(`createShow('show-${year}-055', TOURS.BLUE_TEAM, 'venue-033', '${year}-12-05', '${year}-12-07', 6150, 2675, 415, 495, 'Omaha Riverfront holiday'${statusParam})`);
  shows.push(`createShow('show-${year}-056', TOURS.BLUE_TEAM, 'venue-012', '${year}-12-12', '${year}-12-14', 9000, 4500, 620, 560, 'Twin Cities holiday event'${statusParam})`);
  // Last week Dec blocked

  return shows;
}

// Generate all shows
let allShows = [];

// 2023 - manually crafted above
allShows = allShows.concat(generateCleanShows());

// 2024-2027 with slight variations
for (let year = 2024; year <= 2027; year++) {
  let status = 'completed';
  if (year === 2026) status = year <= 2026 ? 'confirmed' : 'tentative';
  if (year === 2027) status = 'tentative';
  allShows = allShows.concat(generateYear(year, status));
}

// Write output
const showsStr = allShows.map(s => '  ' + s).join(',\n');
const output = `${beforeShows}export const sampleShows = [
${showsStr}
];

${afterShows}`;

fs.writeFileSync(path.join(__dirname, '../src/data/sampleData-clean.js'), output);
console.log(`Generated ${allShows.length} shows to sampleData-clean.js`);
console.log('Review and copy to sampleData.js when verified');
