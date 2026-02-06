// Sample data for the Lumberjack Tour Management Dashboard
// COMPREHENSIVE DATASET: 400+ shows from 2023-2027
// ROUTING OPTIMIZED: Midwest-focused (2/3), weekend events local, long-term events distant

// Available tours
export const TOURS = {
  RED_TEAM: 'Red Team',
  BLUE_TEAM: 'Blue Team'
};

// Show status types
export const SHOW_STATUS = {
  COMPLETED: 'completed',
  CONFIRMED: 'confirmed',
  TENTATIVE: 'tentative'
};

// Venue ID mapping for data synergy with Directory
const VENUE_IDS = {
  'Hayward Lumberjack World Championships': 'venue-001',
  'Northwoods County Fair': 'venue-002',
  'Wisconsin Dells Resort': 'venue-003',
  'Milwaukee Summerfest': 'venue-004',
  'La Crosse Riverfest': 'venue-005',
  'Green Bay Packers Family Night': 'venue-006',
  'Eau Claire Country Fest': 'venue-007',
  'Minnesota State Fair': 'venue-008',
  'Duluth Tall Ships': 'venue-009',
  'Rochester Mayo Fest': 'venue-010',
  'St Cloud River Days': 'venue-011',
  'Twin Cities Summer Fest': 'venue-012',
  'Iowa State Fair': 'venue-013',
  'Cedar Rapids Freedom Festival': 'venue-014',
  'Quad Cities River Bandits': 'venue-015',
  'Des Moines State Fair': 'venue-016',
  'Chicago Summer Fest': 'venue-017',
  'Rockford Forest Festival': 'venue-018',
  'Springfield State Fair': 'venue-019',
  'Peoria Riverfront': 'venue-020',
  'Detroit Maker Faire': 'venue-021',
  'Grand Rapids Lumberjack Days': 'venue-022',
  'Traverse City Cherry Festival': 'venue-023',
  'Indianapolis Motorsports': 'venue-024',
  'Fort Wayne Johnny Appleseed': 'venue-025',
  'Columbus Heritage Days': 'venue-026',
  'Cincinnati Spring Festival': 'venue-027',
  'Cleveland Irish Festival': 'venue-028',
  'Kansas City Renaissance': 'venue-029',
  'Branson Mountain Theater': 'venue-030',
  'St Louis Forest Park': 'venue-031',
  'Nebraska State Fair': 'venue-032',
  'Omaha Riverfront': 'venue-033',
  'Sturgis Rally': 'venue-034',
  'Sioux Falls Festival': 'venue-035',
  'Fargo Air Show': 'venue-036',
  'San Antonio Rodeo': 'venue-037',
  'Houston Livestock Show': 'venue-038',
  'Dallas State Fair': 'venue-039',
  'Orlando Theme Park': 'venue-040',
  'Pigeon Forge Entertainment Center': 'venue-041',
  'Nashville Country Expo': 'venue-042',
  'Wausau Logging Congress': 'venue-043',
  'Madison Capitol Square': 'venue-044',
  'Appleton Oktoberfest': 'venue-045',
  'Sheboygan Bratwurst Days': 'venue-046',
  'Oshkosh AirVenture': 'venue-047',
  'Wisconsin State Fair': 'venue-048',
  'Fond du Lac County Fair': 'venue-049',
  'Stevens Point Spud Bowl': 'venue-050',
  'Superior Harbor Fest': 'venue-051',
  'Ashland Bay Days': 'venue-052',
  'Rhinelander Hodag Country': 'venue-053',
  'Minocqua Beef-A-Rama': 'venue-054',
  'Eagle River Cranberry Fest': 'venue-055',
  'Park Falls Flambeau Rama': 'venue-056',
  'Rice Lake Aquafest': 'venue-057',
  'Spooner Rodeo': 'venue-058',
  'Cable Car Show': 'venue-059',
  'Bayfield Apple Festival': 'venue-060',
  'Hurley Iron County Fair': 'venue-061',
  'Ironwood Ski Jump': 'venue-062',
  'Marquette Ore Dock': 'venue-063',
  'Escanaba State Fair': 'venue-064',
  'Sault Ste Marie Winter Fest': 'venue-065',
  'Mackinaw City Bridge Walk': 'venue-066',
  'Petoskey Waterfront': 'venue-067',
  'Charlevoix Venetian Festival': 'venue-068',
  'Manistee Forest Festival': 'venue-069',
  'Ludington Salmon Derby': 'venue-070',
  'Muskegon Summer Celebration': 'venue-071',
  'Holland Tulip Time': 'venue-072',
  'Kalamazoo Ribfest': 'venue-073',
  'Battle Creek Cereal Fest': 'venue-074',
  'Lansing Folk Festival': 'venue-075',
  'Ann Arbor Summer Festival': 'venue-076',
  'Flint Vehicle City': 'venue-077',
  'Saginaw County Fair': 'venue-078',
  'Bay City River Roar': 'venue-079',
  'Alpena Thunder Bay': 'venue-080',
  'Bemidji Paul Bunyan Days': 'venue-081',
  'Brainerd Lakes Festival': 'venue-082',
  'Alexandria Vikingland': 'venue-083',
  'Fergus Falls Summerfest': 'venue-084',
  'Moorhead Scandinavian Days': 'venue-085',
  'Detroit Lakes WeFest': 'venue-086',
  'Wadena Tri-County Fair': 'venue-087',
  'Little Falls Dam Festival': 'venue-088',
  'Willmar Kandiyohi Fair': 'venue-089',
  'Marshall Prairie Pioneer': 'venue-090',
  'Mankato Ribfest': 'venue-091',
  'Winona Steamboat Days': 'venue-092',
  'Red Wing River City': 'venue-093',
  'Stillwater Lumberjack Days': 'venue-094',
  'Albert Lea Big Island': 'venue-095',
  'Austin SPAM Festival': 'venue-096',
  'Owatonna Steele County': 'venue-097',
  'Faribault Heritage Days': 'venue-098',
  'Northfield Defeat of Jesse James': 'venue-099',
  'Mason City Band Festival': 'venue-100',
  'Waterloo My Waterloo Days': 'venue-101',
  'Dubuque Music and More': 'venue-102',
  'Sioux City River-Cade': 'venue-103',
  'Council Bluffs Westfair': 'venue-104',
  'Fort Dodge Frontier Days': 'venue-105',
  'Ames Octagon Arts': 'venue-106',
  'Iowa City Jazz Festival': 'venue-107',
  'Burlington Steamboat Days': 'venue-108',
  'Ottumwa Beach Ottumwa': 'venue-109',
  'Decorah Nordic Fest': 'venue-110',
  'Spirit Lake Okoboji': 'venue-111',
  'Spencer Clay County': 'venue-112',
  'Storm Lake Stars': 'venue-113',
  'Cherokee Heritage Days': 'venue-114',
  'Le Mars Ice Cream Days': 'venue-115',
  'Brookings Summer Arts': 'venue-116',
  'Watertown Glacial Lakes': 'venue-117',
  'Aberdeen Hub City Days': 'venue-118',
  'Pierre Oahe Days': 'venue-119',
  'Rapid City Summer Nights': 'venue-120'
};

// Contact ID mapping for data synergy
const CONTACT_IDS = Object.fromEntries(
  Object.entries(VENUE_IDS).map(([name, venueId]) => [name, venueId.replace('venue', 'contact')])
);

// Venue database with coordinates and details
const VENUES = {
  'venue-001': { name: 'Hayward Lumberjack World Championships', address: '15670 US-63', city: 'Hayward', state: 'WI', zip: '54843', lat: 46.0130, lng: -91.4846, contact: 'Homebase Admin', phone: '(715) 555-1960', email: 'admin@lumberjackworld.com' },
  'venue-002': { name: 'Northwoods County Fair', address: '456 Birch Street', city: 'Hayward', state: 'WI', zip: '54843', lat: 46.0130, lng: -91.4846, contact: 'Earl Gustafson', phone: '(715) 555-0111', email: 'earl@northwoodsfair.com' },
  'venue-003': { name: 'Wisconsin Dells Resort', address: '1800 Wisconsin Dells Pkwy', city: 'Wisconsin Dells', state: 'WI', zip: '53965', lat: 43.6275, lng: -89.7710, contact: 'Karen Schmidt', phone: '(608) 555-4567', email: 'kschmidt@wisdells.com' },
  'venue-004': { name: 'Milwaukee Summerfest', address: '200 N Harbor Dr', city: 'Milwaukee', state: 'WI', zip: '53202', lat: 43.0275, lng: -87.8989, contact: 'Bob Uecker Jr', phone: '(414) 555-1962', email: 'buecker@summerfest.com' },
  'venue-005': { name: 'La Crosse Riverfest', address: '100 State St', city: 'La Crosse', state: 'WI', zip: '54601', lat: 43.8014, lng: -91.2396, contact: 'River Ray', phone: '(608) 555-1856', email: 'rray@lacrosseriverfest.com' },
  'venue-006': { name: 'Green Bay Packers Family Night', address: '1265 Lombardi Ave', city: 'Green Bay', state: 'WI', zip: '54304', lat: 44.5013, lng: -88.0622, contact: 'Vince Lombardi III', phone: '(920) 555-1967', email: 'vlombardi@packers.com' },
  'venue-007': { name: 'Eau Claire Country Fest', address: '123 Lake St', city: 'Eau Claire', state: 'WI', zip: '54701', lat: 44.8113, lng: -91.4985, contact: 'Bon Iver', phone: '(715) 555-2007', email: 'boniver@eauclarefest.com' },
  'venue-008': { name: 'Minnesota State Fair', address: '1265 Snelling Ave N', city: 'Saint Paul', state: 'MN', zip: '55108', lat: 44.9831, lng: -93.1737, contact: 'Jerry Olson', phone: '(651) 555-1234', email: 'jolson@mnstatefair.org' },
  'venue-009': { name: 'Duluth Tall Ships', address: '323 W Superior St', city: 'Duluth', state: 'MN', zip: '55802', lat: 46.7833, lng: -92.1066, contact: 'Bob Dylan III', phone: '(218) 555-1941', email: 'bdylan@duluthtallships.com' },
  'venue-010': { name: 'Rochester Mayo Fest', address: '30 Civic Center Dr SE', city: 'Rochester', state: 'MN', zip: '55904', lat: 44.0234, lng: -92.4632, contact: 'Mayo Mike', phone: '(507) 555-1883', email: 'mmike@rochestermayo.com' },
  'venue-011': { name: 'St Cloud River Days', address: '400 2nd St S', city: 'St. Cloud', state: 'MN', zip: '56301', lat: 45.5579, lng: -94.1632, contact: 'Cloud Carl', phone: '(320) 555-1851', email: 'carl@stcloudriverdays.com' },
  'venue-012': { name: 'Twin Cities Summer Fest', address: '600 Nicollet Mall', city: 'Minneapolis', state: 'MN', zip: '55402', lat: 44.9778, lng: -93.2650, contact: 'Prince Johnson', phone: '(612) 555-1999', email: 'prince@twincitiesfest.com' },
  'venue-013': { name: 'Iowa State Fair', address: '3000 E Grand Ave', city: 'Des Moines', state: 'IA', zip: '50317', lat: 41.5979, lng: -93.5643, contact: 'Ashton Kutcher Sr', phone: '(515) 555-1978', email: 'akutcher@iowastatefair.org' },
  'venue-014': { name: 'Cedar Rapids Freedom Festival', address: '50 2nd Ave SE', city: 'Cedar Rapids', state: 'IA', zip: '52401', lat: 42.0083, lng: -91.6441, contact: 'Cedar Chris', phone: '(319) 555-1838', email: 'cchris@cedarrapidsfreedom.com' },
  'venue-015': { name: 'Quad Cities River Bandits', address: '209 S Gaines St', city: 'Davenport', state: 'IA', zip: '52801', lat: 41.5192, lng: -90.5775, contact: 'Bandit Bill', phone: '(563) 555-1871', email: 'bill@riverbandits.com' },
  'venue-016': { name: 'Des Moines State Fair', address: '3000 E Grand Ave', city: 'Des Moines', state: 'IA', zip: '50317', lat: 41.5979, lng: -93.5643, contact: 'Fair Director', phone: '(515) 555-1900', email: 'fair@desmoines.gov' },
  'venue-017': { name: 'Chicago Summer Fest', address: '337 E Randolph St', city: 'Chicago', state: 'IL', zip: '60601', lat: 41.8824, lng: -87.6212, contact: 'Mike Ditka Jr', phone: '(312) 555-1985', email: 'mditka@chicagofest.com' },
  'venue-018': { name: 'Rockford Forest Festival', address: '711 N Main St', city: 'Rockford', state: 'IL', zip: '61103', lat: 42.2711, lng: -89.0940, contact: 'Forest Fred', phone: '(815) 555-1852', email: 'fred@rockfordforest.com' },
  'venue-019': { name: 'Springfield State Fair', address: '801 Sangamon Ave', city: 'Springfield', state: 'IL', zip: '62702', lat: 39.8356, lng: -89.6011, contact: 'Abe Lincoln Jr', phone: '(217) 555-1865', email: 'abe@springfieldillfair.com' },
  'venue-020': { name: 'Peoria Riverfront', address: '100 SW Water St', city: 'Peoria', state: 'IL', zip: '61602', lat: 40.6936, lng: -89.5890, contact: 'River Pete', phone: '(309) 555-1850', email: 'rpete@peoriariverfront.com' },
  'venue-021': { name: 'Detroit Maker Faire', address: '1 Washington Blvd', city: 'Detroit', state: 'MI', zip: '48226', lat: 42.3293, lng: -83.0435, contact: 'Henry Ford V', phone: '(313) 555-1903', email: 'hford@detroitmaker.com' },
  'venue-022': { name: 'Grand Rapids Lumberjack Days', address: '300 Monroe Ave NW', city: 'Grand Rapids', state: 'MI', zip: '49503', lat: 42.9634, lng: -85.6681, contact: 'Gerald Ford Jr', phone: '(616) 555-1974', email: 'gford@grandrapidslumber.com' },
  'venue-023': { name: 'Traverse City Cherry Festival', address: '102 E Grandview Pkwy', city: 'Traverse City', state: 'MI', zip: '49684', lat: 44.7631, lng: -85.6206, contact: 'Cherry Charlie', phone: '(231) 555-1925', email: 'charlie@cherryfestival.org' },
  'venue-024': { name: 'Indianapolis Motorsports', address: '4790 W 16th St', city: 'Indianapolis', state: 'IN', zip: '46222', lat: 39.7956, lng: -86.2353, contact: 'A.J. Foyt Jr', phone: '(317) 555-5001', email: 'ajf@indymotorsports.com' },
  'venue-025': { name: 'Fort Wayne Johnny Appleseed', address: '1500 Bluffton Rd', city: 'Fort Wayne', state: 'IN', zip: '46809', lat: 41.0534, lng: -85.2402, contact: 'Johnny Seed', phone: '(260) 555-1774', email: 'jseed@fortwayneappleseed.com' },
  'venue-026': { name: 'Columbus Heritage Days', address: '717 E 17th Ave', city: 'Columbus', state: 'OH', zip: '43211', lat: 39.9968, lng: -82.9882, contact: 'Woody Hayes IV', phone: '(614) 555-1870', email: 'whayes@columbusheritage.org' },
  'venue-027': { name: 'Cincinnati Spring Festival', address: '1 E Pete Rose Way', city: 'Cincinnati', state: 'OH', zip: '45202', lat: 39.0964, lng: -84.5075, contact: 'Pete Rose Jr', phone: '(513) 555-9753', email: 'pjr@cincyfest.com' },
  'venue-028': { name: 'Cleveland Irish Festival', address: '100 Alfred Lerner Way', city: 'Cleveland', state: 'OH', zip: '44114', lat: 41.5061, lng: -81.6995, contact: 'Patrick OBrien', phone: '(216) 555-1840', email: 'pobrien@clevelandirish.com' },
  'venue-029': { name: 'Kansas City Renaissance', address: '633 N 130th St', city: 'Bonner Springs', state: 'KS', zip: '66012', lat: 39.0558, lng: -94.9272, contact: 'Sir Charles', phone: '(913) 555-1520', email: 'sircharles@kcrenfest.com' },
  'venue-030': { name: 'Branson Mountain Theater', address: '3505 W 76 Country Blvd', city: 'Branson', state: 'MO', zip: '65616', lat: 36.6434, lng: -93.2618, contact: 'Bob Franklin', phone: '(417) 555-8901', email: 'bfranklin@bransontheater.com' },
  'venue-031': { name: 'St Louis Forest Park', address: '1 Government Dr', city: 'St. Louis', state: 'MO', zip: '63110', lat: 38.6349, lng: -90.2857, contact: 'Stan Musial Jr', phone: '(314) 555-1944', email: 'smusial@stlouisforest.com' },
  'venue-032': { name: 'Nebraska State Fair', address: '501 E Fonner Park Rd', city: 'Grand Island', state: 'NE', zip: '68801', lat: 40.9228, lng: -98.3420, contact: 'Warren Buffett Jr', phone: '(308) 555-1930', email: 'wbuffett@nestatefair.org' },
  'venue-033': { name: 'Omaha Riverfront', address: '455 N 10th St', city: 'Omaha', state: 'NE', zip: '68102', lat: 41.2586, lng: -95.9378, contact: 'Warren Jr', phone: '(402) 555-1867', email: 'warren@omahariverfront.com' },
  'venue-034': { name: 'Sturgis Rally', address: '1040 Junction Ave', city: 'Sturgis', state: 'SD', zip: '57785', lat: 44.4094, lng: -103.5091, contact: 'Biker Bob', phone: '(605) 555-1938', email: 'bikerbob@sturgisrally.com' },
  'venue-035': { name: 'Sioux Falls Festival', address: '200 N Phillips Ave', city: 'Sioux Falls', state: 'SD', zip: '57104', lat: 43.5460, lng: -96.7313, contact: 'Falls Fred', phone: '(605) 555-1889', email: 'fred@siouxfallsfest.com' },
  'venue-036': { name: 'Fargo Air Show', address: '2801 32nd Ave N', city: 'Fargo', state: 'ND', zip: '58102', lat: 46.9202, lng: -96.8158, contact: 'Frances McDormand', phone: '(701) 555-1996', email: 'fmcdormand@fargoair.com' },
  'venue-037': { name: 'San Antonio Rodeo', address: '3201 E Houston St', city: 'San Antonio', state: 'TX', zip: '78219', lat: 29.4340, lng: -98.4541, contact: 'Juan Rodriguez', phone: '(210) 555-7890', email: 'jrodriguez@sarodeo.com' },
  'venue-038': { name: 'Houston Livestock Show', address: '3 NRG Park', city: 'Houston', state: 'TX', zip: '77054', lat: 29.6847, lng: -95.4107, contact: 'George Strait Jr', phone: '(713) 555-1932', email: 'gstrait@rodeohouston.com' },
  'venue-039': { name: 'Dallas State Fair', address: '3921 Martin Luther King Jr Blvd', city: 'Dallas', state: 'TX', zip: '75210', lat: 32.7831, lng: -96.7587, contact: 'Big Tex', phone: '(214) 555-1886', email: 'bigtex@statefairoftexas.com' },
  'venue-040': { name: 'Orlando Theme Park', address: '6000 Universal Blvd', city: 'Orlando', state: 'FL', zip: '32819', lat: 28.4747, lng: -81.4664, contact: 'Mickey Masters', phone: '(407) 555-1971', email: 'mmasters@orlandoparks.com' },
  'venue-041': { name: 'Pigeon Forge Entertainment Center', address: '2655 Parkway', city: 'Pigeon Forge', state: 'TN', zip: '37863', lat: 35.7884, lng: -83.5543, contact: 'Dolly May', phone: '(865) 555-2345', email: 'dmay@pigeonforge.com' },
  'venue-042': { name: 'Nashville Country Expo', address: '600 Korean Veterans Blvd', city: 'Nashville', state: 'TN', zip: '37203', lat: 36.1561, lng: -86.7774, contact: 'Hank Williams III', phone: '(615) 555-1357', email: 'hwilliams@nashvilleexpo.com' },
  'venue-043': { name: 'Wausau Logging Congress', address: '3740 Stewart Ave', city: 'Wausau', state: 'WI', zip: '54401', lat: 44.9591, lng: -89.6301, contact: 'Logger Larry', phone: '(715) 555-4321', email: 'larry@loggingcongress.com' },
  'venue-044': { name: 'Madison Capitol Square', address: '2 E Main St', city: 'Madison', state: 'WI', zip: '53703', lat: 43.0747, lng: -89.3840, contact: 'Badger Bob', phone: '(608) 555-1848', email: 'bbob@madisoncapitol.com' },
  'venue-045': { name: 'Appleton Oktoberfest', address: '100 W College Ave', city: 'Appleton', state: 'WI', zip: '54911', lat: 44.2619, lng: -88.4154, contact: 'Otto Fest', phone: '(920) 555-1857', email: 'otto@appletonoktoberfest.com' },
  'venue-046': { name: 'Sheboygan Bratwurst Days', address: '508 New York Ave', city: 'Sheboygan', state: 'WI', zip: '53081', lat: 43.7508, lng: -87.7145, contact: 'Brat Brad', phone: '(920) 555-1846', email: 'brad@bratwurstdays.com' },
  'venue-047': { name: 'Oshkosh AirVenture', address: '3000 Poberezny Rd', city: 'Oshkosh', state: 'WI', zip: '54902', lat: 43.9844, lng: -88.5570, contact: 'Pilot Pete', phone: '(920) 555-1953', email: 'pete@airventure.org' },
  'venue-048': { name: 'Wisconsin State Fair', address: '640 S 84th St', city: 'West Allis', state: 'WI', zip: '53214', lat: 43.0141, lng: -88.0331, contact: 'Fair Director', phone: '(414) 555-1851', email: 'director@wistatefair.com' },
  'venue-049': { name: 'Fond du Lac County Fair', address: '520 Fond du Lac Ave', city: 'Fond du Lac', state: 'WI', zip: '54935', lat: 43.7730, lng: -88.4468, contact: 'Fondy Frank', phone: '(920) 555-1852', email: 'frank@fondyco.fair.com' },
  'venue-050': { name: 'Stevens Point Spud Bowl', address: '1000 Main St', city: 'Stevens Point', state: 'WI', zip: '54481', lat: 44.5236, lng: -89.5746, contact: 'Spud Spencer', phone: '(715) 555-1858', email: 'spud@spudbowl.com' },
  'venue-051': { name: 'Superior Harbor Fest', address: '305 Harbor View Pkwy', city: 'Superior', state: 'WI', zip: '54880', lat: 46.7208, lng: -92.1041, contact: 'Harbor Harry', phone: '(715) 555-1883', email: 'harry@superiorharbor.com' },
  'venue-052': { name: 'Ashland Bay Days', address: '101 W Main St', city: 'Ashland', state: 'WI', zip: '54806', lat: 46.5927, lng: -90.8835, contact: 'Bay Betty', phone: '(715) 555-1854', email: 'betty@ashlandbay.com' },
  'venue-053': { name: 'Rhinelander Hodag Country', address: '100 W Davenport St', city: 'Rhinelander', state: 'WI', zip: '54501', lat: 45.6366, lng: -89.4112, contact: 'Hodag Hank', phone: '(715) 555-1882', email: 'hank@hodagcountry.com' },
  'venue-054': { name: 'Minocqua Beef-A-Rama', address: '8216 US-51', city: 'Minocqua', state: 'WI', zip: '54548', lat: 45.8705, lng: -89.7123, contact: 'Beef Bob', phone: '(715) 555-1955', email: 'bob@beefarama.com' },
  'venue-055': { name: 'Eagle River Cranberry Fest', address: '201 N Railroad St', city: 'Eagle River', state: 'WI', zip: '54521', lat: 45.9172, lng: -89.2443, contact: 'Cranberry Carl', phone: '(715) 555-1950', email: 'carl@cranberryfest.com' },
  'venue-056': { name: 'Park Falls Flambeau Rama', address: '400 4th Ave S', city: 'Park Falls', state: 'WI', zip: '54552', lat: 45.9344, lng: -90.4418, contact: 'Flambeau Fred', phone: '(715) 555-1912', email: 'fred@flambeaurama.com' },
  'venue-057': { name: 'Rice Lake Aquafest', address: '37 S Main St', city: 'Rice Lake', state: 'WI', zip: '54868', lat: 45.5061, lng: -91.7382, contact: 'Aqua Andy', phone: '(715) 555-1887', email: 'andy@aquafest.com' },
  'venue-058': { name: 'Spooner Rodeo', address: '801 N River St', city: 'Spooner', state: 'WI', zip: '54801', lat: 45.8222, lng: -91.8893, contact: 'Rodeo Rick', phone: '(715) 555-1897', email: 'rick@spoonerrodeo.com' },
  'venue-059': { name: 'Cable Car Show', address: '13470 County Hwy M', city: 'Cable', state: 'WI', zip: '54821', lat: 46.2116, lng: -91.2974, contact: 'Cable Cal', phone: '(715) 555-1924', email: 'cal@cablecarshow.com' },
  'venue-060': { name: 'Bayfield Apple Festival', address: '42 S Broad St', city: 'Bayfield', state: 'WI', zip: '54814', lat: 46.8108, lng: -90.8199, contact: 'Apple Annie', phone: '(715) 555-1862', email: 'annie@applefestival.com' },
  'venue-081': { name: 'Bemidji Paul Bunyan Days', address: '300 Bemidji Ave N', city: 'Bemidji', state: 'MN', zip: '56601', lat: 47.4736, lng: -94.8803, contact: 'Bunyan Bill', phone: '(218) 555-1896', email: 'bill@paulbunyandays.com' },
  'venue-082': { name: 'Brainerd Lakes Festival', address: '501 Laurel St', city: 'Brainerd', state: 'MN', zip: '56401', lat: 46.3580, lng: -94.2008, contact: 'Lake Larry', phone: '(218) 555-1871', email: 'larry@brainerdlakes.com' },
  'venue-083': { name: 'Alexandria Vikingland', address: '206 Broadway St', city: 'Alexandria', state: 'MN', zip: '56308', lat: 45.8852, lng: -95.3775, contact: 'Viking Vic', phone: '(320) 555-1858', email: 'vic@vikingland.com' },
  'venue-094': { name: 'Stillwater Lumberjack Days', address: '102 N Second St', city: 'Stillwater', state: 'MN', zip: '55082', lat: 45.0564, lng: -92.8063, contact: 'Lumber Lou', phone: '(651) 555-1843', email: 'lou@stillwaterlumberjack.com' },
  'venue-102': { name: 'Dubuque Music and More', address: '350 W 5th St', city: 'Dubuque', state: 'IA', zip: '52001', lat: 42.5006, lng: -90.6648, contact: 'Music Mike', phone: '(563) 555-1833', email: 'mike@dubuquemusic.com' },
  'venue-120': { name: 'Rapid City Summer Nights', address: '515 West Blvd', city: 'Rapid City', state: 'SD', zip: '57701', lat: 44.0805, lng: -103.2310, contact: 'Rapid Ralph', phone: '(605) 555-1876', email: 'ralph@rapidcitynights.com' }
};

// Helper to create a show object
function createShow(id, tour, venueId, startDate, endDate, fee, merch, materials, expenses, notes, status = 'completed') {
  const venue = VENUES[venueId] || VENUES['venue-001'];
  return {
    id,
    tour,
    venueId,
    contactId: venueId.replace('venue', 'contact'),
    venueName: venue.name,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    zip: venue.zip,
    latitude: venue.lat,
    longitude: venue.lng,
    startDate,
    endDate,
    showTime: '12:00',
    performanceFee: fee,
    merchandiseSales: merch,
    materialsUsed: materials,
    expenses,
    contactName: venue.contact,
    contactPhone: venue.phone,
    contactEmail: venue.email,
    notes,
    status
  };
}

export const sampleShows = [
  // =====================================
  // 2023 SEASON - Red Team (~40 shows)
  // =====================================

  // 2023 Winter/Spring - Texas
  createShow('show-2023-001', TOURS.RED_TEAM, 'venue-037', '2023-01-12', '2023-01-28', 40000, 18500, 2900, 4800, 'San Antonio Rodeo winter engagement'),
  createShow('show-2023-002', TOURS.RED_TEAM, 'venue-038', '2023-02-20', '2023-03-12', 55000, 24000, 3900, 6500, 'Houston Livestock Show - 3 week run'),

  // 2023 Spring - Midwest ramp-up
  createShow('show-2023-003', TOURS.RED_TEAM, 'venue-027', '2023-04-07', '2023-04-09', 8000, 3500, 520, 620, 'Cincinnati Spring Festival'),
  createShow('show-2023-004', TOURS.RED_TEAM, 'venue-026', '2023-04-14', '2023-04-16', 7200, 3100, 480, 560, 'Columbus Heritage Days'),
  createShow('show-2023-005', TOURS.RED_TEAM, 'venue-022', '2023-04-21', '2023-04-23', 6800, 3300, 500, 460, 'Grand Rapids Lumberjack Days'),
  createShow('show-2023-006', TOURS.RED_TEAM, 'venue-005', '2023-05-05', '2023-05-07', 5200, 2300, 350, 270, 'La Crosse Riverfest'),
  createShow('show-2023-007', TOURS.RED_TEAM, 'venue-018', '2023-05-12', '2023-05-14', 4800, 2100, 320, 300, 'Rockford Forest Festival'),
  createShow('show-2023-008', TOURS.RED_TEAM, 'venue-006', '2023-05-26', '2023-05-29', 11500, 5200, 780, 650, 'Green Bay Memorial Day weekend'),

  // 2023 Summer - Peak Season
  createShow('show-2023-009', TOURS.RED_TEAM, 'venue-009', '2023-06-02', '2023-06-04', 7800, 3400, 520, 400, 'Duluth Tall Ships Festival'),
  createShow('show-2023-010', TOURS.RED_TEAM, 'venue-002', '2023-06-09', '2023-06-11', 3800, 1900, 290, 145, 'Northwoods County Fair - home'),
  createShow('show-2023-011', TOURS.RED_TEAM, 'venue-007', '2023-06-16', '2023-06-18', 6200, 2700, 410, 270, 'Eau Claire Country Fest'),
  createShow('show-2023-012', TOURS.RED_TEAM, 'venue-012', '2023-07-01', '2023-07-04', 13500, 6000, 880, 900, 'Twin Cities July 4th'),
  createShow('show-2023-013', TOURS.RED_TEAM, 'venue-023', '2023-07-08', '2023-07-15', 17500, 8200, 1250, 1750, 'Traverse City Cherry Festival'),
  createShow('show-2023-014', TOURS.RED_TEAM, 'venue-001', '2023-07-27', '2023-07-30', 0, 21000, 2100, 2700, 'Hayward World Championships - HOME'),
  createShow('show-2023-015', TOURS.RED_TEAM, 'venue-034', '2023-08-04', '2023-08-13', 30000, 26000, 2300, 4000, 'Sturgis Rally'),
  createShow('show-2023-016', TOURS.RED_TEAM, 'venue-008', '2023-08-24', '2023-09-04', 34000, 18000, 2750, 4400, 'Minnesota State Fair'),
  createShow('show-2023-017', TOURS.RED_TEAM, 'venue-013', '2023-09-08', '2023-09-17', 27000, 14000, 2150, 3500, 'Iowa State Fair'),

  // 2023 Fall
  createShow('show-2023-018', TOURS.RED_TEAM, 'venue-029', '2023-09-23', '2023-10-22', 56000, 27000, 4050, 7200, 'KC Renaissance Faire - 5 weekends'),
  createShow('show-2023-019', TOURS.RED_TEAM, 'venue-039', '2023-09-29', '2023-10-22', 42000, 19500, 3100, 5500, 'Dallas State Fair'),
  createShow('show-2023-020', TOURS.RED_TEAM, 'venue-045', '2023-10-06', '2023-10-08', 5500, 2400, 360, 420, 'Appleton Oktoberfest'),
  createShow('show-2023-021', TOURS.RED_TEAM, 'venue-060', '2023-10-13', '2023-10-15', 4200, 1850, 280, 320, 'Bayfield Apple Festival'),
  createShow('show-2023-022', TOURS.RED_TEAM, 'venue-041', '2023-11-01', '2023-11-14', 36000, 15000, 2500, 4100, 'Pigeon Forge 2-week run'),
  createShow('show-2023-023', TOURS.RED_TEAM, 'venue-021', '2023-11-24', '2023-11-26', 5200, 2300, 360, 500, 'Detroit Maker Faire - Thanksgiving'),

  // 2023 Winter
  createShow('show-2023-024', TOURS.RED_TEAM, 'venue-024', '2023-12-08', '2023-12-10', 7200, 3100, 460, 600, 'Indianapolis holiday event'),
  createShow('show-2023-025', TOURS.RED_TEAM, 'venue-004', '2023-12-22', '2023-12-24', 11500, 6200, 850, 700, 'Milwaukee Holiday Market'),

  // =====================================
  // 2023 SEASON - Blue Team (~40 shows)
  // =====================================

  // 2023 Winter/Spring
  createShow('show-2023-026', TOURS.BLUE_TEAM, 'venue-040', '2023-01-15', '2023-02-15', 82000, 36000, 5600, 11500, 'Orlando month-long winter engagement'),
  createShow('show-2023-027', TOURS.BLUE_TEAM, 'venue-030', '2023-03-01', '2023-03-31', 72000, 27000, 4100, 8200, 'Branson March engagement'),

  // 2023 Spring
  createShow('show-2023-028', TOURS.BLUE_TEAM, 'venue-028', '2023-04-14', '2023-04-16', 6300, 2700, 400, 500, 'Cleveland Irish Festival'),
  createShow('show-2023-029', TOURS.BLUE_TEAM, 'venue-025', '2023-04-21', '2023-04-23', 4800, 2100, 330, 440, 'Fort Wayne Johnny Appleseed'),
  createShow('show-2023-030', TOURS.BLUE_TEAM, 'venue-014', '2023-04-28', '2023-04-30', 5300, 2300, 360, 400, 'Cedar Rapids Freedom Festival'),
  createShow('show-2023-031', TOURS.BLUE_TEAM, 'venue-011', '2023-05-05', '2023-05-07', 4800, 2100, 320, 360, 'St Cloud River Days'),
  createShow('show-2023-032', TOURS.BLUE_TEAM, 'venue-015', '2023-05-12', '2023-05-14', 5800, 2500, 380, 460, 'Quad Cities River Bandits'),
  createShow('show-2023-033', TOURS.BLUE_TEAM, 'venue-044', '2023-05-26', '2023-05-29', 9800, 4400, 660, 580, 'Madison Capitol Square Memorial Day'),

  // 2023 Summer
  createShow('show-2023-034', TOURS.BLUE_TEAM, 'venue-051', '2023-06-02', '2023-06-04', 5200, 2300, 350, 380, 'Superior Harbor Fest'),
  createShow('show-2023-035', TOURS.BLUE_TEAM, 'venue-052', '2023-06-09', '2023-06-11', 4500, 2000, 300, 340, 'Ashland Bay Days'),
  createShow('show-2023-036', TOURS.BLUE_TEAM, 'venue-053', '2023-06-16', '2023-06-18', 5000, 2200, 340, 360, 'Rhinelander Hodag Country'),
  createShow('show-2023-037', TOURS.BLUE_TEAM, 'venue-004', '2023-06-29', '2023-07-10', 36000, 17500, 2800, 4600, 'Milwaukee Summerfest'),
  createShow('show-2023-038', TOURS.BLUE_TEAM, 'venue-017', '2023-07-14', '2023-07-30', 43000, 20000, 3250, 5600, 'Chicago Summer Fest'),
  createShow('show-2023-039', TOURS.BLUE_TEAM, 'venue-047', '2023-07-24', '2023-07-30', 22000, 10500, 1600, 2200, 'Oshkosh AirVenture'),
  createShow('show-2023-040', TOURS.BLUE_TEAM, 'venue-003', '2023-08-05', '2023-08-20', 40000, 18500, 2700, 4100, 'Wisconsin Dells Resort'),
  createShow('show-2023-041', TOURS.BLUE_TEAM, 'venue-048', '2023-08-03', '2023-08-13', 28000, 13500, 2100, 3400, 'Wisconsin State Fair'),
  createShow('show-2023-042', TOURS.BLUE_TEAM, 'venue-081', '2023-08-18', '2023-08-20', 6500, 2900, 440, 480, 'Bemidji Paul Bunyan Days'),
  createShow('show-2023-043', TOURS.BLUE_TEAM, 'venue-082', '2023-08-25', '2023-08-27', 5800, 2600, 400, 420, 'Brainerd Lakes Festival'),
  createShow('show-2023-044', TOURS.BLUE_TEAM, 'venue-032', '2023-08-25', '2023-09-04', 25000, 11500, 1850, 3100, 'Nebraska State Fair'),

  // 2023 Fall
  createShow('show-2023-045', TOURS.BLUE_TEAM, 'venue-094', '2023-09-08', '2023-09-10', 7200, 3300, 500, 520, 'Stillwater Lumberjack Days'),
  createShow('show-2023-046', TOURS.BLUE_TEAM, 'venue-042', '2023-10-05', '2023-10-15', 26000, 12000, 1850, 3400, 'Nashville Country Expo'),
  createShow('show-2023-047', TOURS.BLUE_TEAM, 'venue-054', '2023-09-30', '2023-10-01', 4200, 1850, 280, 320, 'Minocqua Beef-A-Rama'),
  createShow('show-2023-048', TOURS.BLUE_TEAM, 'venue-055', '2023-10-07', '2023-10-08', 4500, 2000, 300, 350, 'Eagle River Cranberry Fest'),
  createShow('show-2023-049', TOURS.BLUE_TEAM, 'venue-030', '2023-10-15', '2023-11-15', 74000, 28000, 4200, 8400, 'Branson fall engagement'),
  createShow('show-2023-050', TOURS.BLUE_TEAM, 'venue-031', '2023-11-17', '2023-11-19', 5300, 2300, 360, 500, 'St Louis Forest Park'),

  // 2023 Winter
  createShow('show-2023-051', TOURS.BLUE_TEAM, 'venue-033', '2023-12-01', '2023-12-03', 5800, 2500, 380, 460, 'Omaha Riverfront holiday'),
  createShow('show-2023-052', TOURS.BLUE_TEAM, 'venue-012', '2023-12-28', '2023-12-31', 14500, 7200, 960, 860, 'Twin Cities New Years'),

  // =====================================
  // 2024 SEASON - Red Team (~40 shows)
  // =====================================

  // 2024 Winter/Spring - Texas Swing
  createShow('show-2024-001', TOURS.RED_TEAM, 'venue-037', '2024-01-11', '2024-01-27', 41000, 19000, 3000, 4900, 'San Antonio Rodeo'),
  createShow('show-2024-002', TOURS.RED_TEAM, 'venue-038', '2024-02-22', '2024-03-14', 56000, 25000, 4000, 6700, 'Houston Livestock Show'),

  // 2024 Spring
  createShow('show-2024-003', TOURS.RED_TEAM, 'venue-027', '2024-04-05', '2024-04-07', 8200, 3600, 540, 650, 'Cincinnati Spring Festival'),
  createShow('show-2024-004', TOURS.RED_TEAM, 'venue-026', '2024-04-12', '2024-04-14', 7400, 3200, 490, 570, 'Columbus Heritage Days'),
  createShow('show-2024-005', TOURS.RED_TEAM, 'venue-022', '2024-04-19', '2024-04-21', 6900, 3400, 510, 470, 'Grand Rapids Lumberjack Days'),
  createShow('show-2024-006', TOURS.RED_TEAM, 'venue-043', '2024-04-26', '2024-04-28', 5500, 2400, 360, 400, 'Wausau Logging Congress'),
  createShow('show-2024-007', TOURS.RED_TEAM, 'venue-005', '2024-05-03', '2024-05-05', 5300, 2350, 360, 280, 'La Crosse Riverfest'),
  createShow('show-2024-008', TOURS.RED_TEAM, 'venue-018', '2024-05-10', '2024-05-12', 4900, 2150, 330, 310, 'Rockford Forest Festival'),
  createShow('show-2024-009', TOURS.RED_TEAM, 'venue-050', '2024-05-17', '2024-05-19', 4600, 2000, 300, 340, 'Stevens Point Spud Bowl'),
  createShow('show-2024-010', TOURS.RED_TEAM, 'venue-006', '2024-05-24', '2024-05-27', 11800, 5350, 800, 670, 'Green Bay Memorial Day'),

  // 2024 Summer
  createShow('show-2024-011', TOURS.RED_TEAM, 'venue-009', '2024-06-07', '2024-06-09', 8000, 3500, 530, 410, 'Duluth Tall Ships'),
  createShow('show-2024-012', TOURS.RED_TEAM, 'venue-002', '2024-06-14', '2024-06-16', 3900, 1950, 295, 150, 'Northwoods County Fair - home'),
  createShow('show-2024-013', TOURS.RED_TEAM, 'venue-007', '2024-06-21', '2024-06-23', 6400, 2800, 420, 280, 'Eau Claire Country Fest'),
  createShow('show-2024-014', TOURS.RED_TEAM, 'venue-012', '2024-07-03', '2024-07-06', 14000, 6200, 900, 920, 'Twin Cities July 4th'),
  createShow('show-2024-015', TOURS.RED_TEAM, 'venue-023', '2024-07-06', '2024-07-13', 18000, 8500, 1280, 1800, 'Traverse City Cherry Festival'),
  createShow('show-2024-016', TOURS.RED_TEAM, 'venue-057', '2024-07-19', '2024-07-21', 4800, 2100, 320, 350, 'Rice Lake Aquafest'),
  createShow('show-2024-017', TOURS.RED_TEAM, 'venue-001', '2024-07-25', '2024-07-28', 0, 22000, 2200, 2800, 'Hayward World Championships - HOME'),
  createShow('show-2024-018', TOURS.RED_TEAM, 'venue-034', '2024-08-02', '2024-08-11', 31000, 27000, 2350, 4100, 'Sturgis Rally'),
  createShow('show-2024-019', TOURS.RED_TEAM, 'venue-083', '2024-08-16', '2024-08-18', 5600, 2500, 380, 420, 'Alexandria Vikingland'),
  createShow('show-2024-020', TOURS.RED_TEAM, 'venue-008', '2024-08-22', '2024-09-02', 35000, 18500, 2800, 4500, 'Minnesota State Fair'),
  createShow('show-2024-021', TOURS.RED_TEAM, 'venue-013', '2024-09-07', '2024-09-17', 28000, 14500, 2200, 3600, 'Iowa State Fair'),

  // 2024 Fall
  createShow('show-2024-022', TOURS.RED_TEAM, 'venue-029', '2024-09-21', '2024-10-20', 57000, 27500, 4100, 7300, 'KC Renaissance Faire'),
  createShow('show-2024-023', TOURS.RED_TEAM, 'venue-039', '2024-09-27', '2024-10-20', 43000, 20000, 3150, 5600, 'Dallas State Fair'),
  createShow('show-2024-024', TOURS.RED_TEAM, 'venue-045', '2024-10-04', '2024-10-06', 5600, 2450, 370, 430, 'Appleton Oktoberfest'),
  createShow('show-2024-025', TOURS.RED_TEAM, 'venue-060', '2024-10-11', '2024-10-13', 4300, 1900, 290, 330, 'Bayfield Apple Festival'),
  createShow('show-2024-026', TOURS.RED_TEAM, 'venue-041', '2024-11-01', '2024-11-14', 37000, 15500, 2550, 4200, 'Pigeon Forge'),
  createShow('show-2024-027', TOURS.RED_TEAM, 'venue-021', '2024-11-22', '2024-11-24', 5400, 2400, 370, 520, 'Detroit Maker Faire'),

  // 2024 Winter
  createShow('show-2024-028', TOURS.RED_TEAM, 'venue-024', '2024-12-06', '2024-12-08', 7400, 3200, 470, 620, 'Indianapolis holiday'),
  createShow('show-2024-029', TOURS.RED_TEAM, 'venue-004', '2024-12-20', '2024-12-23', 11800, 6400, 870, 720, 'Milwaukee Holiday Market'),

  // =====================================
  // 2024 SEASON - Blue Team (~40 shows)
  // =====================================

  // 2024 Winter/Spring
  createShow('show-2024-030', TOURS.BLUE_TEAM, 'venue-040', '2024-01-13', '2024-02-13', 84000, 37000, 5700, 11800, 'Orlando winter engagement'),
  createShow('show-2024-031', TOURS.BLUE_TEAM, 'venue-030', '2024-02-28', '2024-03-30', 73000, 27500, 4150, 8300, 'Branson spring engagement'),

  // 2024 Spring
  createShow('show-2024-032', TOURS.BLUE_TEAM, 'venue-028', '2024-04-12', '2024-04-14', 6500, 2800, 420, 520, 'Cleveland Irish Festival'),
  createShow('show-2024-033', TOURS.BLUE_TEAM, 'venue-025', '2024-04-19', '2024-04-21', 4900, 2150, 340, 450, 'Fort Wayne Johnny Appleseed'),
  createShow('show-2024-034', TOURS.BLUE_TEAM, 'venue-014', '2024-04-26', '2024-04-28', 5500, 2400, 370, 420, 'Cedar Rapids Freedom Festival'),
  createShow('show-2024-035', TOURS.BLUE_TEAM, 'venue-011', '2024-05-03', '2024-05-05', 4900, 2150, 330, 370, 'St Cloud River Days'),
  createShow('show-2024-036', TOURS.BLUE_TEAM, 'venue-015', '2024-05-10', '2024-05-12', 6000, 2600, 390, 480, 'Quad Cities River Bandits'),
  createShow('show-2024-037', TOURS.BLUE_TEAM, 'venue-102', '2024-05-17', '2024-05-19', 5200, 2300, 350, 400, 'Dubuque Music and More'),
  createShow('show-2024-038', TOURS.BLUE_TEAM, 'venue-044', '2024-05-24', '2024-05-27', 10000, 4500, 680, 600, 'Madison Memorial Day'),

  // 2024 Summer
  createShow('show-2024-039', TOURS.BLUE_TEAM, 'venue-051', '2024-05-31', '2024-06-02', 5400, 2400, 360, 400, 'Superior Harbor Fest'),
  createShow('show-2024-040', TOURS.BLUE_TEAM, 'venue-052', '2024-06-07', '2024-06-09', 4700, 2100, 310, 350, 'Ashland Bay Days'),
  createShow('show-2024-041', TOURS.BLUE_TEAM, 'venue-053', '2024-06-14', '2024-06-16', 5200, 2300, 350, 380, 'Rhinelander Hodag Country'),
  createShow('show-2024-042', TOURS.BLUE_TEAM, 'venue-056', '2024-06-21', '2024-06-23', 4500, 2000, 300, 340, 'Park Falls Flambeau Rama'),
  createShow('show-2024-043', TOURS.BLUE_TEAM, 'venue-004', '2024-06-27', '2024-07-08', 37000, 18000, 2850, 4700, 'Milwaukee Summerfest'),
  createShow('show-2024-044', TOURS.BLUE_TEAM, 'venue-017', '2024-07-12', '2024-07-28', 44000, 20500, 3300, 5700, 'Chicago Summer Fest'),
  createShow('show-2024-045', TOURS.BLUE_TEAM, 'venue-047', '2024-07-22', '2024-07-28', 23000, 11000, 1650, 2300, 'Oshkosh AirVenture'),
  createShow('show-2024-046', TOURS.BLUE_TEAM, 'venue-003', '2024-08-03', '2024-08-18', 41000, 19000, 2750, 4200, 'Wisconsin Dells Resort'),
  createShow('show-2024-047', TOURS.BLUE_TEAM, 'venue-048', '2024-08-01', '2024-08-11', 29000, 14000, 2150, 3500, 'Wisconsin State Fair'),
  createShow('show-2024-048', TOURS.BLUE_TEAM, 'venue-081', '2024-08-16', '2024-08-18', 6700, 3000, 450, 500, 'Bemidji Paul Bunyan Days'),
  createShow('show-2024-049', TOURS.BLUE_TEAM, 'venue-082', '2024-08-23', '2024-08-25', 6000, 2700, 410, 440, 'Brainerd Lakes Festival'),
  createShow('show-2024-050', TOURS.BLUE_TEAM, 'venue-032', '2024-08-23', '2024-09-02', 26000, 12000, 1900, 3200, 'Nebraska State Fair'),

  // 2024 Fall
  createShow('show-2024-051', TOURS.BLUE_TEAM, 'venue-094', '2024-09-06', '2024-09-08', 7400, 3400, 520, 540, 'Stillwater Lumberjack Days'),
  createShow('show-2024-052', TOURS.BLUE_TEAM, 'venue-054', '2024-09-28', '2024-09-29', 4400, 1950, 290, 330, 'Minocqua Beef-A-Rama'),
  createShow('show-2024-053', TOURS.BLUE_TEAM, 'venue-055', '2024-10-05', '2024-10-06', 4700, 2100, 310, 360, 'Eagle River Cranberry Fest'),
  createShow('show-2024-054', TOURS.BLUE_TEAM, 'venue-042', '2024-10-03', '2024-10-13', 27000, 12500, 1900, 3500, 'Nashville Country Expo'),
  createShow('show-2024-055', TOURS.BLUE_TEAM, 'venue-030', '2024-10-17', '2024-11-17', 75000, 28500, 4250, 8500, 'Branson fall engagement'),
  createShow('show-2024-056', TOURS.BLUE_TEAM, 'venue-031', '2024-11-22', '2024-11-24', 5500, 2400, 380, 520, 'St Louis Forest Park'),

  // 2024 Winter
  createShow('show-2024-057', TOURS.BLUE_TEAM, 'venue-033', '2024-12-06', '2024-12-08', 6000, 2600, 400, 480, 'Omaha Riverfront holiday'),
  createShow('show-2024-058', TOURS.BLUE_TEAM, 'venue-012', '2024-12-27', '2024-12-31', 15000, 7500, 980, 880, 'Twin Cities New Years'),

  // =====================================
  // 2025 SEASON - Red Team (~40 shows)
  // =====================================

  // 2025 Winter/Spring - Texas
  createShow('show-2025-001', TOURS.RED_TEAM, 'venue-037', '2025-01-09', '2025-01-25', 42000, 19500, 3100, 5000, 'San Antonio Rodeo'),
  createShow('show-2025-002', TOURS.RED_TEAM, 'venue-038', '2025-02-24', '2025-03-15', 57000, 26000, 4100, 6900, 'Houston Livestock Show'),

  // 2025 Spring
  createShow('show-2025-003', TOURS.RED_TEAM, 'venue-027', '2025-04-04', '2025-04-06', 8400, 3700, 550, 670, 'Cincinnati Spring Festival'),
  createShow('show-2025-004', TOURS.RED_TEAM, 'venue-026', '2025-04-11', '2025-04-13', 7600, 3300, 500, 590, 'Columbus Heritage Days'),
  createShow('show-2025-005', TOURS.RED_TEAM, 'venue-022', '2025-04-18', '2025-04-20', 7100, 3500, 520, 490, 'Grand Rapids Lumberjack Days'),
  createShow('show-2025-006', TOURS.RED_TEAM, 'venue-043', '2025-04-25', '2025-04-27', 5700, 2500, 380, 420, 'Wausau Logging Congress'),
  createShow('show-2025-007', TOURS.RED_TEAM, 'venue-005', '2025-05-02', '2025-05-04', 5500, 2450, 370, 290, 'La Crosse Riverfest'),
  createShow('show-2025-008', TOURS.RED_TEAM, 'venue-018', '2025-05-09', '2025-05-11', 5100, 2250, 340, 320, 'Rockford Forest Festival'),
  createShow('show-2025-009', TOURS.RED_TEAM, 'venue-050', '2025-05-16', '2025-05-18', 4800, 2100, 320, 360, 'Stevens Point Spud Bowl'),
  createShow('show-2025-010', TOURS.RED_TEAM, 'venue-006', '2025-05-23', '2025-05-26', 12200, 5500, 820, 690, 'Green Bay Memorial Day'),

  // 2025 Summer
  createShow('show-2025-011', TOURS.RED_TEAM, 'venue-009', '2025-06-06', '2025-06-08', 8200, 3600, 550, 430, 'Duluth Tall Ships'),
  createShow('show-2025-012', TOURS.RED_TEAM, 'venue-002', '2025-06-13', '2025-06-15', 4000, 2000, 300, 155, 'Northwoods County Fair - home'),
  createShow('show-2025-013', TOURS.RED_TEAM, 'venue-007', '2025-06-20', '2025-06-22', 6600, 2900, 440, 290, 'Eau Claire Country Fest'),
  createShow('show-2025-014', TOURS.RED_TEAM, 'venue-012', '2025-07-03', '2025-07-06', 14500, 6400, 930, 960, 'Twin Cities July 4th'),
  createShow('show-2025-015', TOURS.RED_TEAM, 'venue-023', '2025-07-05', '2025-07-12', 18500, 8800, 1310, 1850, 'Traverse City Cherry Festival'),
  createShow('show-2025-016', TOURS.RED_TEAM, 'venue-057', '2025-07-18', '2025-07-20', 5000, 2200, 340, 370, 'Rice Lake Aquafest'),
  createShow('show-2025-017', TOURS.RED_TEAM, 'venue-001', '2025-07-24', '2025-07-27', 0, 23000, 2300, 2900, 'Hayward World Championships - HOME'),
  createShow('show-2025-018', TOURS.RED_TEAM, 'venue-034', '2025-08-01', '2025-08-10', 32000, 28000, 2400, 4200, 'Sturgis Rally'),
  createShow('show-2025-019', TOURS.RED_TEAM, 'venue-083', '2025-08-15', '2025-08-17', 5800, 2600, 400, 440, 'Alexandria Vikingland'),
  createShow('show-2025-020', TOURS.RED_TEAM, 'venue-008', '2025-08-21', '2025-09-01', 36000, 19000, 2850, 4600, 'Minnesota State Fair'),
  createShow('show-2025-021', TOURS.RED_TEAM, 'venue-013', '2025-09-06', '2025-09-16', 29000, 15000, 2250, 3700, 'Iowa State Fair'),

  // 2025 Fall
  createShow('show-2025-022', TOURS.RED_TEAM, 'venue-029', '2025-09-20', '2025-10-19', 58000, 28000, 4200, 7500, 'KC Renaissance Faire'),
  createShow('show-2025-023', TOURS.RED_TEAM, 'venue-039', '2025-09-26', '2025-10-19', 44000, 20500, 3200, 5700, 'Dallas State Fair'),
  createShow('show-2025-024', TOURS.RED_TEAM, 'venue-045', '2025-10-03', '2025-10-05', 5800, 2550, 380, 450, 'Appleton Oktoberfest'),
  createShow('show-2025-025', TOURS.RED_TEAM, 'venue-060', '2025-10-10', '2025-10-12', 4500, 2000, 300, 340, 'Bayfield Apple Festival'),
  createShow('show-2025-026', TOURS.RED_TEAM, 'venue-041', '2025-10-31', '2025-11-13', 38000, 16000, 2600, 4300, 'Pigeon Forge'),
  createShow('show-2025-027', TOURS.RED_TEAM, 'venue-021', '2025-11-21', '2025-11-23', 5600, 2500, 380, 540, 'Detroit Maker Faire'),

  // 2025 Winter
  createShow('show-2025-028', TOURS.RED_TEAM, 'venue-024', '2025-12-05', '2025-12-07', 7600, 3300, 490, 640, 'Indianapolis holiday'),
  createShow('show-2025-029', TOURS.RED_TEAM, 'venue-004', '2025-12-19', '2025-12-22', 12200, 6600, 900, 740, 'Milwaukee Holiday Market'),

  // =====================================
  // 2025 SEASON - Blue Team (~40 shows)
  // =====================================

  // 2025 Winter/Spring
  createShow('show-2025-030', TOURS.BLUE_TEAM, 'venue-040', '2025-01-11', '2025-02-11', 86000, 38000, 5800, 12000, 'Orlando winter engagement'),
  createShow('show-2025-031', TOURS.BLUE_TEAM, 'venue-030', '2025-02-26', '2025-03-28', 74000, 28000, 4200, 8400, 'Branson spring engagement'),

  // 2025 Spring
  createShow('show-2025-032', TOURS.BLUE_TEAM, 'venue-028', '2025-04-11', '2025-04-13', 6700, 2900, 440, 540, 'Cleveland Irish Festival'),
  createShow('show-2025-033', TOURS.BLUE_TEAM, 'venue-025', '2025-04-18', '2025-04-20', 5100, 2250, 350, 470, 'Fort Wayne Johnny Appleseed'),
  createShow('show-2025-034', TOURS.BLUE_TEAM, 'venue-014', '2025-04-25', '2025-04-27', 5700, 2500, 380, 440, 'Cedar Rapids Freedom Festival'),
  createShow('show-2025-035', TOURS.BLUE_TEAM, 'venue-011', '2025-05-02', '2025-05-04', 5100, 2250, 340, 390, 'St Cloud River Days'),
  createShow('show-2025-036', TOURS.BLUE_TEAM, 'venue-015', '2025-05-09', '2025-05-11', 6200, 2700, 410, 500, 'Quad Cities River Bandits'),
  createShow('show-2025-037', TOURS.BLUE_TEAM, 'venue-102', '2025-05-16', '2025-05-18', 5400, 2400, 360, 420, 'Dubuque Music and More'),
  createShow('show-2025-038', TOURS.BLUE_TEAM, 'venue-044', '2025-05-23', '2025-05-26', 10400, 4700, 700, 620, 'Madison Memorial Day'),

  // 2025 Summer
  createShow('show-2025-039', TOURS.BLUE_TEAM, 'venue-051', '2025-05-30', '2025-06-01', 5600, 2500, 380, 420, 'Superior Harbor Fest'),
  createShow('show-2025-040', TOURS.BLUE_TEAM, 'venue-052', '2025-06-06', '2025-06-08', 4900, 2200, 330, 370, 'Ashland Bay Days'),
  createShow('show-2025-041', TOURS.BLUE_TEAM, 'venue-053', '2025-06-13', '2025-06-15', 5400, 2400, 360, 400, 'Rhinelander Hodag Country'),
  createShow('show-2025-042', TOURS.BLUE_TEAM, 'venue-056', '2025-06-20', '2025-06-22', 4700, 2100, 320, 360, 'Park Falls Flambeau Rama'),
  createShow('show-2025-043', TOURS.BLUE_TEAM, 'venue-004', '2025-06-26', '2025-07-07', 38000, 18500, 2900, 4800, 'Milwaukee Summerfest'),
  createShow('show-2025-044', TOURS.BLUE_TEAM, 'venue-017', '2025-07-11', '2025-07-27', 45000, 21000, 3400, 5800, 'Chicago Summer Fest'),
  createShow('show-2025-045', TOURS.BLUE_TEAM, 'venue-047', '2025-07-21', '2025-07-27', 24000, 11500, 1700, 2400, 'Oshkosh AirVenture'),
  createShow('show-2025-046', TOURS.BLUE_TEAM, 'venue-003', '2025-08-02', '2025-08-17', 42000, 19500, 2800, 4300, 'Wisconsin Dells Resort'),
  createShow('show-2025-047', TOURS.BLUE_TEAM, 'venue-048', '2025-07-31', '2025-08-10', 30000, 14500, 2200, 3600, 'Wisconsin State Fair'),
  createShow('show-2025-048', TOURS.BLUE_TEAM, 'venue-081', '2025-08-15', '2025-08-17', 6900, 3100, 470, 520, 'Bemidji Paul Bunyan Days'),
  createShow('show-2025-049', TOURS.BLUE_TEAM, 'venue-082', '2025-08-22', '2025-08-24', 6200, 2800, 430, 460, 'Brainerd Lakes Festival'),
  createShow('show-2025-050', TOURS.BLUE_TEAM, 'venue-032', '2025-08-22', '2025-09-01', 27000, 12500, 1950, 3300, 'Nebraska State Fair'),

  // 2025 Fall
  createShow('show-2025-051', TOURS.BLUE_TEAM, 'venue-094', '2025-09-05', '2025-09-07', 7600, 3500, 540, 560, 'Stillwater Lumberjack Days'),
  createShow('show-2025-052', TOURS.BLUE_TEAM, 'venue-054', '2025-09-27', '2025-09-28', 4600, 2050, 310, 350, 'Minocqua Beef-A-Rama'),
  createShow('show-2025-053', TOURS.BLUE_TEAM, 'venue-055', '2025-10-04', '2025-10-05', 4900, 2200, 330, 380, 'Eagle River Cranberry Fest'),
  createShow('show-2025-054', TOURS.BLUE_TEAM, 'venue-042', '2025-10-02', '2025-10-12', 28000, 13000, 1950, 3600, 'Nashville Country Expo'),
  createShow('show-2025-055', TOURS.BLUE_TEAM, 'venue-030', '2025-10-16', '2025-11-16', 76000, 29000, 4300, 8600, 'Branson fall engagement'),
  createShow('show-2025-056', TOURS.BLUE_TEAM, 'venue-031', '2025-11-21', '2025-11-23', 5700, 2500, 400, 540, 'St Louis Forest Park'),

  // 2025 Winter
  createShow('show-2025-057', TOURS.BLUE_TEAM, 'venue-033', '2025-12-05', '2025-12-07', 6200, 2700, 420, 500, 'Omaha Riverfront holiday'),
  createShow('show-2025-058', TOURS.BLUE_TEAM, 'venue-012', '2025-12-27', '2025-12-31', 15500, 7800, 1010, 910, 'Twin Cities New Years'),

  // =====================================
  // 2026 SEASON - Red Team (~40 shows)
  // Status: confirmed (upcoming) or tentative (later)
  // =====================================

  // 2026 Winter/Spring - Texas
  createShow('show-2026-001', TOURS.RED_TEAM, 'venue-037', '2026-01-08', '2026-01-24', 43000, 20000, 3200, 5100, 'San Antonio Rodeo', 'completed'),
  createShow('show-2026-002', TOURS.RED_TEAM, 'venue-038', '2026-02-23', '2026-03-14', 58000, 27000, 4200, 7000, 'Houston Livestock Show', 'tentative'),

  // 2026 Spring (starts becoming confirmed shows around Feb 2026)
  createShow('show-2026-003', TOURS.RED_TEAM, 'venue-017', '2026-02-07', '2026-02-08', 6500, 2800, 420, 580, 'Chicago winter event', 'confirmed'),
  createShow('show-2026-004', TOURS.RED_TEAM, 'venue-031', '2026-02-21', '2026-02-22', 5500, 2400, 380, 520, 'St Louis Forest Park', 'confirmed'),
  createShow('show-2026-005', TOURS.RED_TEAM, 'venue-036', '2026-03-07', '2026-03-08', 4500, 1900, 290, 380, 'Fargo Air Show', 'confirmed'),
  createShow('show-2026-006', TOURS.RED_TEAM, 'venue-010', '2026-03-21', '2026-03-22', 4500, 2000, 320, 340, 'Rochester Mayo Fest', 'confirmed'),
  createShow('show-2026-007', TOURS.RED_TEAM, 'venue-027', '2026-04-03', '2026-04-05', 8600, 3800, 560, 690, 'Cincinnati Spring Festival', 'confirmed'),
  createShow('show-2026-008', TOURS.RED_TEAM, 'venue-026', '2026-04-10', '2026-04-12', 7800, 3400, 520, 610, 'Columbus Heritage Days', 'confirmed'),
  createShow('show-2026-009', TOURS.RED_TEAM, 'venue-022', '2026-04-17', '2026-04-19', 7300, 3600, 540, 510, 'Grand Rapids Lumberjack Days', 'confirmed'),
  createShow('show-2026-010', TOURS.RED_TEAM, 'venue-043', '2026-04-24', '2026-04-26', 5900, 2600, 400, 440, 'Wausau Logging Congress', 'confirmed'),
  createShow('show-2026-011', TOURS.RED_TEAM, 'venue-005', '2026-05-01', '2026-05-03', 5700, 2550, 380, 300, 'La Crosse Riverfest', 'tentative'),
  createShow('show-2026-012', TOURS.RED_TEAM, 'venue-019', '2026-05-08', '2026-05-10', 6500, 2800, 420, 520, 'Springfield State Fair', 'tentative'),
  createShow('show-2026-013', TOURS.RED_TEAM, 'venue-050', '2026-05-15', '2026-05-17', 5000, 2200, 340, 380, 'Stevens Point Spud Bowl', 'tentative'),
  createShow('show-2026-014', TOURS.RED_TEAM, 'venue-006', '2026-05-22', '2026-05-25', 12600, 5700, 850, 710, 'Green Bay Memorial Day', 'tentative'),

  // 2026 Summer
  createShow('show-2026-015', TOURS.RED_TEAM, 'venue-009', '2026-06-05', '2026-06-07', 8400, 3700, 560, 450, 'Duluth Tall Ships', 'tentative'),
  createShow('show-2026-016', TOURS.RED_TEAM, 'venue-002', '2026-06-12', '2026-06-14', 4200, 2100, 320, 160, 'Northwoods County Fair - home', 'tentative'),
  createShow('show-2026-017', TOURS.RED_TEAM, 'venue-007', '2026-06-19', '2026-06-21', 6800, 3000, 460, 300, 'Eau Claire Country Fest', 'tentative'),
  createShow('show-2026-018', TOURS.RED_TEAM, 'venue-012', '2026-07-02', '2026-07-05', 15000, 6600, 960, 1000, 'Twin Cities July 4th', 'tentative'),
  createShow('show-2026-019', TOURS.RED_TEAM, 'venue-023', '2026-07-04', '2026-07-11', 19000, 9100, 1350, 1900, 'Traverse City Cherry Festival', 'tentative'),
  createShow('show-2026-020', TOURS.RED_TEAM, 'venue-057', '2026-07-17', '2026-07-19', 5200, 2300, 360, 390, 'Rice Lake Aquafest', 'tentative'),
  createShow('show-2026-021', TOURS.RED_TEAM, 'venue-001', '2026-07-23', '2026-07-26', 0, 24000, 2400, 3000, 'Hayward World Championships - HOME', 'tentative'),
  createShow('show-2026-022', TOURS.RED_TEAM, 'venue-034', '2026-07-31', '2026-08-09', 33000, 29000, 2450, 4300, 'Sturgis Rally', 'tentative'),
  createShow('show-2026-023', TOURS.RED_TEAM, 'venue-083', '2026-08-14', '2026-08-16', 6000, 2700, 420, 460, 'Alexandria Vikingland', 'tentative'),
  createShow('show-2026-024', TOURS.RED_TEAM, 'venue-008', '2026-08-27', '2026-09-07', 37000, 19500, 2900, 4700, 'Minnesota State Fair', 'tentative'),
  createShow('show-2026-025', TOURS.RED_TEAM, 'venue-013', '2026-09-05', '2026-09-15', 30000, 15500, 2300, 3800, 'Iowa State Fair', 'tentative'),

  // 2026 Fall
  createShow('show-2026-026', TOURS.RED_TEAM, 'venue-029', '2026-09-19', '2026-10-18', 59000, 28500, 4250, 7600, 'KC Renaissance Faire', 'tentative'),
  createShow('show-2026-027', TOURS.RED_TEAM, 'venue-039', '2026-09-25', '2026-10-18', 45000, 21000, 3250, 5800, 'Dallas State Fair', 'tentative'),
  createShow('show-2026-028', TOURS.RED_TEAM, 'venue-045', '2026-10-02', '2026-10-04', 6000, 2650, 400, 470, 'Appleton Oktoberfest', 'tentative'),
  createShow('show-2026-029', TOURS.RED_TEAM, 'venue-060', '2026-10-09', '2026-10-11', 4700, 2100, 320, 360, 'Bayfield Apple Festival', 'tentative'),
  createShow('show-2026-030', TOURS.RED_TEAM, 'venue-042', '2026-10-01', '2026-10-11', 29000, 13500, 2000, 3700, 'Nashville Country Expo', 'tentative'),
  createShow('show-2026-031', TOURS.RED_TEAM, 'venue-041', '2026-10-30', '2026-11-12', 39000, 16500, 2650, 4400, 'Pigeon Forge', 'tentative'),
  createShow('show-2026-032', TOURS.RED_TEAM, 'venue-021', '2026-11-20', '2026-11-22', 5800, 2600, 400, 560, 'Detroit Maker Faire', 'tentative'),

  // 2026 Winter
  createShow('show-2026-033', TOURS.RED_TEAM, 'venue-024', '2026-12-04', '2026-12-06', 7800, 3400, 510, 660, 'Indianapolis holiday', 'tentative'),
  createShow('show-2026-034', TOURS.RED_TEAM, 'venue-004', '2026-12-18', '2026-12-21', 12600, 6800, 920, 760, 'Milwaukee Holiday Market', 'tentative'),

  // =====================================
  // 2026 SEASON - Blue Team (~40 shows)
  // =====================================

  // 2026 Winter/Spring
  createShow('show-2026-035', TOURS.BLUE_TEAM, 'venue-040', '2026-01-10', '2026-02-10', 88000, 39000, 5900, 12200, 'Orlando winter engagement', 'completed'),
  createShow('show-2026-036', TOURS.BLUE_TEAM, 'venue-024', '2026-02-13', '2026-02-15', 7000, 3000, 460, 620, 'Indianapolis Motorsports', 'confirmed'),
  createShow('show-2026-037', TOURS.BLUE_TEAM, 'venue-033', '2026-02-27', '2026-03-01', 6000, 2600, 400, 480, 'Omaha Riverfront', 'confirmed'),
  createShow('show-2026-038', TOURS.BLUE_TEAM, 'venue-035', '2026-03-13', '2026-03-15', 5000, 2200, 340, 420, 'Sioux Falls Festival', 'confirmed'),
  createShow('show-2026-039', TOURS.BLUE_TEAM, 'venue-007', '2026-03-27', '2026-03-29', 6000, 2600, 400, 280, 'Eau Claire Country Fest spring', 'confirmed'),
  createShow('show-2026-040', TOURS.BLUE_TEAM, 'venue-030', '2026-02-25', '2026-03-27', 75000, 28500, 4250, 8500, 'Branson spring engagement', 'tentative'),

  // 2026 Spring
  createShow('show-2026-041', TOURS.BLUE_TEAM, 'venue-020', '2026-04-10', '2026-04-12', 5800, 2550, 400, 500, 'Peoria Riverfront', 'tentative'),
  createShow('show-2026-042', TOURS.BLUE_TEAM, 'venue-028', '2026-04-17', '2026-04-19', 6900, 3000, 460, 560, 'Cleveland Irish Festival', 'tentative'),
  createShow('show-2026-043', TOURS.BLUE_TEAM, 'venue-025', '2026-04-24', '2026-04-26', 5300, 2350, 360, 490, 'Fort Wayne Johnny Appleseed', 'tentative'),
  createShow('show-2026-044', TOURS.BLUE_TEAM, 'venue-014', '2026-05-01', '2026-05-03', 5900, 2600, 400, 460, 'Cedar Rapids Freedom Festival', 'tentative'),
  createShow('show-2026-045', TOURS.BLUE_TEAM, 'venue-011', '2026-05-08', '2026-05-10', 5300, 2350, 360, 410, 'St Cloud River Days', 'tentative'),
  createShow('show-2026-046', TOURS.BLUE_TEAM, 'venue-015', '2026-05-15', '2026-05-17', 6400, 2800, 430, 520, 'Quad Cities River Bandits', 'tentative'),
  createShow('show-2026-047', TOURS.BLUE_TEAM, 'venue-102', '2026-05-22', '2026-05-24', 5600, 2500, 380, 440, 'Dubuque Music and More', 'tentative'),
  createShow('show-2026-048', TOURS.BLUE_TEAM, 'venue-044', '2026-05-22', '2026-05-25', 10800, 4900, 720, 640, 'Madison Memorial Day', 'tentative'),

  // 2026 Summer
  createShow('show-2026-049', TOURS.BLUE_TEAM, 'venue-051', '2026-05-29', '2026-05-31', 5800, 2600, 400, 440, 'Superior Harbor Fest', 'tentative'),
  createShow('show-2026-050', TOURS.BLUE_TEAM, 'venue-052', '2026-06-05', '2026-06-07', 5100, 2300, 350, 390, 'Ashland Bay Days', 'tentative'),
  createShow('show-2026-051', TOURS.BLUE_TEAM, 'venue-053', '2026-06-12', '2026-06-14', 5600, 2500, 380, 420, 'Rhinelander Hodag Country', 'tentative'),
  createShow('show-2026-052', TOURS.BLUE_TEAM, 'venue-056', '2026-06-19', '2026-06-21', 4900, 2200, 340, 380, 'Park Falls Flambeau Rama', 'tentative'),
  createShow('show-2026-053', TOURS.BLUE_TEAM, 'venue-004', '2026-06-25', '2026-07-06', 39000, 19000, 2950, 4900, 'Milwaukee Summerfest', 'tentative'),
  createShow('show-2026-054', TOURS.BLUE_TEAM, 'venue-017', '2026-07-10', '2026-07-26', 46000, 21500, 3450, 5900, 'Chicago Summer Fest', 'tentative'),
  createShow('show-2026-055', TOURS.BLUE_TEAM, 'venue-047', '2026-07-20', '2026-07-26', 25000, 12000, 1750, 2500, 'Oshkosh AirVenture', 'tentative'),
  createShow('show-2026-056', TOURS.BLUE_TEAM, 'venue-003', '2026-08-01', '2026-08-16', 43000, 20000, 2850, 4400, 'Wisconsin Dells Resort', 'tentative'),
  createShow('show-2026-057', TOURS.BLUE_TEAM, 'venue-048', '2026-07-30', '2026-08-09', 31000, 15000, 2250, 3700, 'Wisconsin State Fair', 'tentative'),
  createShow('show-2026-058', TOURS.BLUE_TEAM, 'venue-034', '2026-08-07', '2026-08-16', 35000, 32000, 2600, 4500, 'Sturgis Rally', 'tentative'),
  createShow('show-2026-059', TOURS.BLUE_TEAM, 'venue-081', '2026-08-14', '2026-08-16', 7100, 3200, 490, 540, 'Bemidji Paul Bunyan Days', 'tentative'),
  createShow('show-2026-060', TOURS.BLUE_TEAM, 'venue-082', '2026-08-21', '2026-08-23', 6400, 2900, 450, 480, 'Brainerd Lakes Festival', 'tentative'),
  createShow('show-2026-061', TOURS.BLUE_TEAM, 'venue-032', '2026-08-21', '2026-08-31', 28000, 13000, 2000, 3400, 'Nebraska State Fair', 'tentative'),
  createShow('show-2026-062', TOURS.BLUE_TEAM, 'venue-013', '2026-09-10', '2026-09-20', 31000, 16000, 2350, 3900, 'Iowa State Fair', 'tentative'),

  // 2026 Fall
  createShow('show-2026-063', TOURS.BLUE_TEAM, 'venue-094', '2026-09-04', '2026-09-06', 7800, 3600, 560, 580, 'Stillwater Lumberjack Days', 'tentative'),
  createShow('show-2026-064', TOURS.BLUE_TEAM, 'venue-054', '2026-09-26', '2026-09-27', 4800, 2150, 330, 370, 'Minocqua Beef-A-Rama', 'tentative'),
  createShow('show-2026-065', TOURS.BLUE_TEAM, 'venue-055', '2026-10-03', '2026-10-04', 5100, 2300, 350, 400, 'Eagle River Cranberry Fest', 'tentative'),
  createShow('show-2026-066', TOURS.BLUE_TEAM, 'venue-030', '2026-10-15', '2026-11-15', 77000, 29500, 4350, 8700, 'Branson fall engagement', 'tentative'),
  createShow('show-2026-067', TOURS.BLUE_TEAM, 'venue-031', '2026-11-20', '2026-11-22', 5900, 2600, 420, 560, 'St Louis Forest Park', 'tentative'),

  // 2026 Winter
  createShow('show-2026-068', TOURS.BLUE_TEAM, 'venue-033', '2026-12-04', '2026-12-06', 6400, 2800, 440, 520, 'Omaha Riverfront holiday', 'tentative'),
  createShow('show-2026-069', TOURS.BLUE_TEAM, 'venue-012', '2026-12-26', '2026-12-31', 16000, 8100, 1040, 940, 'Twin Cities New Years', 'tentative'),

  // =====================================
  // 2027 SEASON - Red Team (~40 shows)
  // Status: all tentative
  // =====================================

  // 2027 Winter/Spring - Texas
  createShow('show-2027-001', TOURS.RED_TEAM, 'venue-037', '2027-01-07', '2027-01-23', 44000, 20500, 3250, 5200, 'San Antonio Rodeo', 'tentative'),
  createShow('show-2027-002', TOURS.RED_TEAM, 'venue-038', '2027-02-22', '2027-03-13', 59000, 28000, 4300, 7200, 'Houston Livestock Show', 'tentative'),

  // 2027 Spring
  createShow('show-2027-003', TOURS.RED_TEAM, 'venue-027', '2027-04-02', '2027-04-04', 8800, 3900, 580, 710, 'Cincinnati Spring Festival', 'tentative'),
  createShow('show-2027-004', TOURS.RED_TEAM, 'venue-026', '2027-04-09', '2027-04-11', 8000, 3500, 540, 630, 'Columbus Heritage Days', 'tentative'),
  createShow('show-2027-005', TOURS.RED_TEAM, 'venue-022', '2027-04-16', '2027-04-18', 7500, 3700, 560, 530, 'Grand Rapids Lumberjack Days', 'tentative'),
  createShow('show-2027-006', TOURS.RED_TEAM, 'venue-043', '2027-04-23', '2027-04-25', 6100, 2700, 420, 460, 'Wausau Logging Congress', 'tentative'),
  createShow('show-2027-007', TOURS.RED_TEAM, 'venue-005', '2027-04-30', '2027-05-02', 5900, 2650, 400, 320, 'La Crosse Riverfest', 'tentative'),
  createShow('show-2027-008', TOURS.RED_TEAM, 'venue-018', '2027-05-07', '2027-05-09', 5400, 2400, 360, 350, 'Rockford Forest Festival', 'tentative'),
  createShow('show-2027-009', TOURS.RED_TEAM, 'venue-050', '2027-05-14', '2027-05-16', 5200, 2300, 360, 400, 'Stevens Point Spud Bowl', 'tentative'),
  createShow('show-2027-010', TOURS.RED_TEAM, 'venue-006', '2027-05-28', '2027-05-31', 13000, 5900, 880, 730, 'Green Bay Memorial Day', 'tentative'),

  // 2027 Summer
  createShow('show-2027-011', TOURS.RED_TEAM, 'venue-009', '2027-06-04', '2027-06-06', 8600, 3800, 580, 470, 'Duluth Tall Ships', 'tentative'),
  createShow('show-2027-012', TOURS.RED_TEAM, 'venue-002', '2027-06-11', '2027-06-13', 4400, 2200, 340, 170, 'Northwoods County Fair - home', 'tentative'),
  createShow('show-2027-013', TOURS.RED_TEAM, 'venue-007', '2027-06-18', '2027-06-20', 7000, 3100, 480, 320, 'Eau Claire Country Fest', 'tentative'),
  createShow('show-2027-014', TOURS.RED_TEAM, 'venue-012', '2027-07-02', '2027-07-05', 15500, 6800, 990, 1040, 'Twin Cities July 4th', 'tentative'),
  createShow('show-2027-015', TOURS.RED_TEAM, 'venue-023', '2027-07-03', '2027-07-10', 19500, 9400, 1390, 1950, 'Traverse City Cherry Festival', 'tentative'),
  createShow('show-2027-016', TOURS.RED_TEAM, 'venue-057', '2027-07-16', '2027-07-18', 5400, 2400, 380, 410, 'Rice Lake Aquafest', 'tentative'),
  createShow('show-2027-017', TOURS.RED_TEAM, 'venue-001', '2027-07-22', '2027-07-25', 0, 25000, 2500, 3100, 'Hayward World Championships - HOME', 'tentative'),
  createShow('show-2027-018', TOURS.RED_TEAM, 'venue-034', '2027-07-30', '2027-08-08', 34000, 30000, 2500, 4400, 'Sturgis Rally', 'tentative'),
  createShow('show-2027-019', TOURS.RED_TEAM, 'venue-083', '2027-08-13', '2027-08-15', 6200, 2800, 440, 480, 'Alexandria Vikingland', 'tentative'),
  createShow('show-2027-020', TOURS.RED_TEAM, 'venue-008', '2027-08-26', '2027-09-06', 38000, 20000, 2950, 4800, 'Minnesota State Fair', 'tentative'),
  createShow('show-2027-021', TOURS.RED_TEAM, 'venue-013', '2027-09-04', '2027-09-14', 31000, 16000, 2350, 3900, 'Iowa State Fair', 'tentative'),

  // 2027 Fall
  createShow('show-2027-022', TOURS.RED_TEAM, 'venue-029', '2027-09-18', '2027-10-17', 60000, 29000, 4300, 7700, 'KC Renaissance Faire', 'tentative'),
  createShow('show-2027-023', TOURS.RED_TEAM, 'venue-039', '2027-09-24', '2027-10-17', 46000, 21500, 3300, 5900, 'Dallas State Fair', 'tentative'),
  createShow('show-2027-024', TOURS.RED_TEAM, 'venue-045', '2027-10-01', '2027-10-03', 6200, 2750, 420, 490, 'Appleton Oktoberfest', 'tentative'),
  createShow('show-2027-025', TOURS.RED_TEAM, 'venue-060', '2027-10-08', '2027-10-10', 4900, 2200, 340, 380, 'Bayfield Apple Festival', 'tentative'),
  createShow('show-2027-026', TOURS.RED_TEAM, 'venue-041', '2027-10-29', '2027-11-11', 40000, 17000, 2700, 4500, 'Pigeon Forge', 'tentative'),
  createShow('show-2027-027', TOURS.RED_TEAM, 'venue-021', '2027-11-19', '2027-11-21', 6000, 2700, 420, 580, 'Detroit Maker Faire', 'tentative'),

  // 2027 Winter
  createShow('show-2027-028', TOURS.RED_TEAM, 'venue-024', '2027-12-03', '2027-12-05', 8000, 3500, 530, 680, 'Indianapolis holiday', 'tentative'),
  createShow('show-2027-029', TOURS.RED_TEAM, 'venue-004', '2027-12-17', '2027-12-20', 13000, 7000, 950, 780, 'Milwaukee Holiday Market', 'tentative'),

  // =====================================
  // 2027 SEASON - Blue Team (~40 shows)
  // =====================================

  // 2027 Winter/Spring
  createShow('show-2027-030', TOURS.BLUE_TEAM, 'venue-040', '2027-01-09', '2027-02-09', 90000, 40000, 6000, 12500, 'Orlando winter engagement', 'tentative'),
  createShow('show-2027-031', TOURS.BLUE_TEAM, 'venue-030', '2027-02-24', '2027-03-26', 76000, 29000, 4300, 8600, 'Branson spring engagement', 'tentative'),

  // 2027 Spring
  createShow('show-2027-032', TOURS.BLUE_TEAM, 'venue-028', '2027-04-09', '2027-04-11', 7100, 3100, 480, 580, 'Cleveland Irish Festival', 'tentative'),
  createShow('show-2027-033', TOURS.BLUE_TEAM, 'venue-025', '2027-04-16', '2027-04-18', 5500, 2450, 380, 510, 'Fort Wayne Johnny Appleseed', 'tentative'),
  createShow('show-2027-034', TOURS.BLUE_TEAM, 'venue-014', '2027-04-23', '2027-04-25', 6100, 2700, 420, 480, 'Cedar Rapids Freedom Festival', 'tentative'),
  createShow('show-2027-035', TOURS.BLUE_TEAM, 'venue-011', '2027-04-30', '2027-05-02', 5500, 2450, 380, 430, 'St Cloud River Days', 'tentative'),
  createShow('show-2027-036', TOURS.BLUE_TEAM, 'venue-015', '2027-05-07', '2027-05-09', 6600, 2900, 450, 540, 'Quad Cities River Bandits', 'tentative'),
  createShow('show-2027-037', TOURS.BLUE_TEAM, 'venue-102', '2027-05-14', '2027-05-16', 5800, 2600, 400, 460, 'Dubuque Music and More', 'tentative'),
  createShow('show-2027-038', TOURS.BLUE_TEAM, 'venue-044', '2027-05-28', '2027-05-31', 11200, 5100, 740, 660, 'Madison Memorial Day', 'tentative'),

  // 2027 Summer
  createShow('show-2027-039', TOURS.BLUE_TEAM, 'venue-051', '2027-05-28', '2027-05-30', 6000, 2700, 420, 460, 'Superior Harbor Fest', 'tentative'),
  createShow('show-2027-040', TOURS.BLUE_TEAM, 'venue-052', '2027-06-04', '2027-06-06', 5300, 2400, 370, 410, 'Ashland Bay Days', 'tentative'),
  createShow('show-2027-041', TOURS.BLUE_TEAM, 'venue-053', '2027-06-11', '2027-06-13', 5800, 2600, 400, 440, 'Rhinelander Hodag Country', 'tentative'),
  createShow('show-2027-042', TOURS.BLUE_TEAM, 'venue-056', '2027-06-18', '2027-06-20', 5100, 2300, 360, 400, 'Park Falls Flambeau Rama', 'tentative'),
  createShow('show-2027-043', TOURS.BLUE_TEAM, 'venue-004', '2027-06-24', '2027-07-05', 40000, 19500, 3000, 5000, 'Milwaukee Summerfest', 'tentative'),
  createShow('show-2027-044', TOURS.BLUE_TEAM, 'venue-017', '2027-07-09', '2027-07-25', 47000, 22000, 3500, 6000, 'Chicago Summer Fest', 'tentative'),
  createShow('show-2027-045', TOURS.BLUE_TEAM, 'venue-047', '2027-07-19', '2027-07-25', 26000, 12500, 1800, 2600, 'Oshkosh AirVenture', 'tentative'),
  createShow('show-2027-046', TOURS.BLUE_TEAM, 'venue-003', '2027-07-31', '2027-08-15', 44000, 20500, 2900, 4500, 'Wisconsin Dells Resort', 'tentative'),
  createShow('show-2027-047', TOURS.BLUE_TEAM, 'venue-048', '2027-07-29', '2027-08-08', 32000, 15500, 2300, 3800, 'Wisconsin State Fair', 'tentative'),
  createShow('show-2027-048', TOURS.BLUE_TEAM, 'venue-081', '2027-08-13', '2027-08-15', 7300, 3300, 510, 560, 'Bemidji Paul Bunyan Days', 'tentative'),
  createShow('show-2027-049', TOURS.BLUE_TEAM, 'venue-082', '2027-08-20', '2027-08-22', 6600, 3000, 470, 500, 'Brainerd Lakes Festival', 'tentative'),
  createShow('show-2027-050', TOURS.BLUE_TEAM, 'venue-032', '2027-08-20', '2027-08-30', 29000, 13500, 2050, 3500, 'Nebraska State Fair', 'tentative'),

  // 2027 Fall
  createShow('show-2027-051', TOURS.BLUE_TEAM, 'venue-094', '2027-09-03', '2027-09-05', 8000, 3700, 580, 600, 'Stillwater Lumberjack Days', 'tentative'),
  createShow('show-2027-052', TOURS.BLUE_TEAM, 'venue-054', '2027-09-25', '2027-09-26', 5000, 2250, 350, 390, 'Minocqua Beef-A-Rama', 'tentative'),
  createShow('show-2027-053', TOURS.BLUE_TEAM, 'venue-055', '2027-10-02', '2027-10-03', 5300, 2400, 370, 420, 'Eagle River Cranberry Fest', 'tentative'),
  createShow('show-2027-054', TOURS.BLUE_TEAM, 'venue-042', '2027-09-30', '2027-10-10', 30000, 14000, 2050, 3800, 'Nashville Country Expo', 'tentative'),
  createShow('show-2027-055', TOURS.BLUE_TEAM, 'venue-030', '2027-10-14', '2027-11-14', 78000, 30000, 4400, 8800, 'Branson fall engagement', 'tentative'),
  createShow('show-2027-056', TOURS.BLUE_TEAM, 'venue-031', '2027-11-19', '2027-11-21', 6100, 2700, 440, 580, 'St Louis Forest Park', 'tentative'),

  // 2027 Winter
  createShow('show-2027-057', TOURS.BLUE_TEAM, 'venue-033', '2027-12-03', '2027-12-05', 6600, 2900, 460, 540, 'Omaha Riverfront holiday', 'tentative'),
  createShow('show-2027-058', TOURS.BLUE_TEAM, 'venue-012', '2027-12-26', '2027-12-31', 16500, 8400, 1080, 970, 'Twin Cities New Years', 'tentative'),

  // =====================================
  // ADDITIONAL REGIONAL SHOWS - 2023
  // =====================================
  createShow('show-2023-100', TOURS.RED_TEAM, 'venue-044', '2023-04-21', '2023-04-23', 8500, 3800, 560, 500, 'Madison Spring Fling'),
  createShow('show-2023-101', TOURS.RED_TEAM, 'venue-011', '2023-05-19', '2023-05-21', 5000, 2200, 340, 380, 'St Cloud River Days'),
  createShow('show-2023-102', TOURS.RED_TEAM, 'venue-050', '2023-06-23', '2023-06-25', 4800, 2100, 320, 350, 'Stevens Point Spud Bowl'),
  createShow('show-2023-103', TOURS.RED_TEAM, 'venue-057', '2023-07-14', '2023-07-16', 4500, 2000, 300, 330, 'Rice Lake Aquafest'),
  createShow('show-2023-104', TOURS.RED_TEAM, 'venue-083', '2023-08-11', '2023-08-13', 5200, 2300, 350, 400, 'Alexandria Vikingland'),
  createShow('show-2023-105', TOURS.RED_TEAM, 'venue-043', '2023-09-01', '2023-09-03', 5600, 2500, 380, 420, 'Wausau Logging Congress'),
  createShow('show-2023-106', TOURS.RED_TEAM, 'venue-019', '2023-09-15', '2023-09-17', 6200, 2700, 400, 480, 'Springfield State Fair'),
  createShow('show-2023-107', TOURS.RED_TEAM, 'venue-020', '2023-10-20', '2023-10-22', 5000, 2200, 340, 420, 'Peoria Riverfront fall'),
  createShow('show-2023-108', TOURS.RED_TEAM, 'venue-046', '2023-08-04', '2023-08-06', 5200, 2300, 350, 380, 'Sheboygan Bratwurst Days'),
  createShow('show-2023-109', TOURS.RED_TEAM, 'venue-049', '2023-07-21', '2023-07-23', 4200, 1850, 280, 320, 'Fond du Lac County Fair'),
  createShow('show-2023-110', TOURS.BLUE_TEAM, 'venue-010', '2023-05-19', '2023-05-21', 4800, 2100, 320, 360, 'Rochester Mayo Fest spring'),
  createShow('show-2023-111', TOURS.BLUE_TEAM, 'venue-036', '2023-06-23', '2023-06-25', 4500, 2000, 300, 380, 'Fargo Air Show'),
  createShow('show-2023-112', TOURS.BLUE_TEAM, 'venue-035', '2023-07-08', '2023-07-10', 5000, 2200, 340, 400, 'Sioux Falls Festival'),
  createShow('show-2023-113', TOURS.BLUE_TEAM, 'venue-019', '2023-08-12', '2023-08-14', 6000, 2600, 400, 480, 'Springfield State Fair'),
  createShow('show-2023-114', TOURS.BLUE_TEAM, 'venue-020', '2023-09-15', '2023-09-17', 5200, 2300, 350, 420, 'Peoria Riverfront'),
  createShow('show-2023-115', TOURS.BLUE_TEAM, 'venue-046', '2023-08-18', '2023-08-20', 5000, 2200, 340, 380, 'Sheboygan Bratwurst Days'),
  createShow('show-2023-116', TOURS.BLUE_TEAM, 'venue-049', '2023-07-28', '2023-07-30', 4400, 1950, 290, 330, 'Fond du Lac County Fair'),
  createShow('show-2023-117', TOURS.BLUE_TEAM, 'venue-043', '2023-09-22', '2023-09-24', 5400, 2400, 360, 400, 'Wausau Logging Congress'),

  // =====================================
  // ADDITIONAL REGIONAL SHOWS - 2024
  // =====================================
  createShow('show-2024-100', TOURS.RED_TEAM, 'venue-044', '2024-04-19', '2024-04-21', 8800, 3900, 580, 520, 'Madison Spring Fling'),
  createShow('show-2024-101', TOURS.RED_TEAM, 'venue-011', '2024-05-17', '2024-05-19', 5200, 2300, 350, 400, 'St Cloud River Days'),
  createShow('show-2024-102', TOURS.RED_TEAM, 'venue-046', '2024-08-02', '2024-08-04', 5400, 2400, 360, 400, 'Sheboygan Bratwurst Days'),
  createShow('show-2024-103', TOURS.RED_TEAM, 'venue-049', '2024-07-19', '2024-07-21', 4400, 1950, 290, 340, 'Fond du Lac County Fair'),
  createShow('show-2024-104', TOURS.RED_TEAM, 'venue-019', '2024-09-13', '2024-09-15', 6400, 2800, 420, 500, 'Springfield State Fair'),
  createShow('show-2024-105', TOURS.RED_TEAM, 'venue-020', '2024-10-18', '2024-10-20', 5200, 2300, 350, 440, 'Peoria Riverfront fall'),
  createShow('show-2024-106', TOURS.RED_TEAM, 'venue-036', '2024-06-28', '2024-06-30', 4800, 2100, 320, 400, 'Fargo Air Show'),
  createShow('show-2024-107', TOURS.RED_TEAM, 'venue-035', '2024-07-12', '2024-07-14', 5200, 2300, 350, 420, 'Sioux Falls Festival'),
  createShow('show-2024-108', TOURS.RED_TEAM, 'venue-010', '2024-05-24', '2024-05-26', 5000, 2200, 340, 380, 'Rochester Mayo Fest'),
  createShow('show-2024-109', TOURS.RED_TEAM, 'venue-120', '2024-07-04', '2024-07-06', 5400, 2400, 360, 420, 'Rapid City Summer Nights'),
  createShow('show-2024-110', TOURS.BLUE_TEAM, 'venue-044', '2024-04-26', '2024-04-28', 8600, 3800, 560, 520, 'Madison Spring Fling'),
  createShow('show-2024-111', TOURS.BLUE_TEAM, 'venue-010', '2024-05-31', '2024-06-02', 5200, 2300, 350, 400, 'Rochester Mayo Fest'),
  createShow('show-2024-112', TOURS.BLUE_TEAM, 'venue-036', '2024-06-21', '2024-06-23', 4600, 2000, 300, 380, 'Fargo Air Show'),
  createShow('show-2024-113', TOURS.BLUE_TEAM, 'venue-035', '2024-07-05', '2024-07-07', 5000, 2200, 340, 400, 'Sioux Falls Festival'),
  createShow('show-2024-114', TOURS.BLUE_TEAM, 'venue-019', '2024-08-09', '2024-08-11', 6200, 2700, 400, 480, 'Springfield State Fair'),
  createShow('show-2024-115', TOURS.BLUE_TEAM, 'venue-020', '2024-09-13', '2024-09-15', 5400, 2400, 360, 440, 'Peoria Riverfront'),
  createShow('show-2024-116', TOURS.BLUE_TEAM, 'venue-046', '2024-08-16', '2024-08-18', 5200, 2300, 350, 400, 'Sheboygan Bratwurst Days'),
  createShow('show-2024-117', TOURS.BLUE_TEAM, 'venue-049', '2024-07-26', '2024-07-28', 4600, 2050, 310, 360, 'Fond du Lac County Fair'),
  createShow('show-2024-118', TOURS.BLUE_TEAM, 'venue-043', '2024-09-20', '2024-09-22', 5600, 2500, 380, 420, 'Wausau Logging Congress'),
  createShow('show-2024-119', TOURS.BLUE_TEAM, 'venue-120', '2024-07-11', '2024-07-13', 5600, 2500, 380, 440, 'Rapid City Summer Nights'),

  // =====================================
  // ADDITIONAL REGIONAL SHOWS - 2025
  // =====================================
  createShow('show-2025-100', TOURS.RED_TEAM, 'venue-044', '2025-04-18', '2025-04-20', 9000, 4000, 600, 540, 'Madison Spring Fling'),
  createShow('show-2025-101', TOURS.RED_TEAM, 'venue-011', '2025-05-23', '2025-05-25', 5400, 2400, 360, 420, 'St Cloud River Days'),
  createShow('show-2025-102', TOURS.RED_TEAM, 'venue-046', '2025-08-01', '2025-08-03', 5600, 2500, 380, 420, 'Sheboygan Bratwurst Days'),
  createShow('show-2025-103', TOURS.RED_TEAM, 'venue-049', '2025-07-18', '2025-07-20', 4600, 2050, 310, 360, 'Fond du Lac County Fair'),
  createShow('show-2025-104', TOURS.RED_TEAM, 'venue-019', '2025-09-12', '2025-09-14', 6600, 2900, 440, 520, 'Springfield State Fair'),
  createShow('show-2025-105', TOURS.RED_TEAM, 'venue-020', '2025-10-17', '2025-10-19', 5400, 2400, 360, 460, 'Peoria Riverfront fall'),
  createShow('show-2025-106', TOURS.RED_TEAM, 'venue-036', '2025-06-27', '2025-06-29', 5000, 2200, 340, 420, 'Fargo Air Show'),
  createShow('show-2025-107', TOURS.RED_TEAM, 'venue-035', '2025-07-11', '2025-07-13', 5400, 2400, 360, 440, 'Sioux Falls Festival'),
  createShow('show-2025-108', TOURS.RED_TEAM, 'venue-010', '2025-05-30', '2025-06-01', 5200, 2300, 350, 400, 'Rochester Mayo Fest'),
  createShow('show-2025-109', TOURS.RED_TEAM, 'venue-120', '2025-07-03', '2025-07-05', 5600, 2500, 380, 440, 'Rapid City Summer Nights'),
  createShow('show-2025-110', TOURS.BLUE_TEAM, 'venue-044', '2025-04-25', '2025-04-27', 8800, 3900, 580, 540, 'Madison Spring Fling'),
  createShow('show-2025-111', TOURS.BLUE_TEAM, 'venue-010', '2025-05-23', '2025-05-25', 5400, 2400, 360, 420, 'Rochester Mayo Fest'),
  createShow('show-2025-112', TOURS.BLUE_TEAM, 'venue-036', '2025-06-20', '2025-06-22', 4800, 2100, 320, 400, 'Fargo Air Show'),
  createShow('show-2025-113', TOURS.BLUE_TEAM, 'venue-035', '2025-07-04', '2025-07-06', 5200, 2300, 350, 420, 'Sioux Falls Festival'),
  createShow('show-2025-114', TOURS.BLUE_TEAM, 'venue-019', '2025-08-08', '2025-08-10', 6400, 2800, 420, 500, 'Springfield State Fair'),
  createShow('show-2025-115', TOURS.BLUE_TEAM, 'venue-020', '2025-09-12', '2025-09-14', 5600, 2500, 380, 460, 'Peoria Riverfront'),
  createShow('show-2025-116', TOURS.BLUE_TEAM, 'venue-046', '2025-08-15', '2025-08-17', 5400, 2400, 360, 420, 'Sheboygan Bratwurst Days'),
  createShow('show-2025-117', TOURS.BLUE_TEAM, 'venue-049', '2025-07-25', '2025-07-27', 4800, 2150, 330, 380, 'Fond du Lac County Fair'),
  createShow('show-2025-118', TOURS.BLUE_TEAM, 'venue-043', '2025-09-19', '2025-09-21', 5800, 2600, 400, 440, 'Wausau Logging Congress'),
  createShow('show-2025-119', TOURS.BLUE_TEAM, 'venue-120', '2025-07-10', '2025-07-12', 5800, 2600, 400, 460, 'Rapid City Summer Nights'),

  // =====================================
  // ADDITIONAL REGIONAL SHOWS - 2026
  // =====================================
  createShow('show-2026-100', TOURS.RED_TEAM, 'venue-044', '2026-04-17', '2026-04-19', 9200, 4100, 620, 560, 'Madison Spring Fling', 'confirmed'),
  createShow('show-2026-101', TOURS.RED_TEAM, 'venue-011', '2026-05-22', '2026-05-24', 5600, 2500, 380, 440, 'St Cloud River Days', 'tentative'),
  createShow('show-2026-102', TOURS.RED_TEAM, 'venue-046', '2026-07-31', '2026-08-02', 5800, 2600, 400, 440, 'Sheboygan Bratwurst Days', 'tentative'),
  createShow('show-2026-103', TOURS.RED_TEAM, 'venue-049', '2026-07-17', '2026-07-19', 4800, 2150, 330, 380, 'Fond du Lac County Fair', 'tentative'),
  createShow('show-2026-104', TOURS.RED_TEAM, 'venue-120', '2026-07-10', '2026-07-12', 5800, 2600, 400, 460, 'Rapid City Summer Nights', 'tentative'),
  createShow('show-2026-105', TOURS.RED_TEAM, 'venue-035', '2026-07-03', '2026-07-05', 5600, 2500, 380, 460, 'Sioux Falls Independence Day', 'tentative'),
  createShow('show-2026-106', TOURS.BLUE_TEAM, 'venue-044', '2026-04-24', '2026-04-26', 9000, 4000, 600, 560, 'Madison Spring Fling', 'tentative'),
  createShow('show-2026-107', TOURS.BLUE_TEAM, 'venue-010', '2026-05-22', '2026-05-24', 5600, 2500, 380, 440, 'Rochester Mayo Fest', 'tentative'),
  createShow('show-2026-108', TOURS.BLUE_TEAM, 'venue-036', '2026-06-19', '2026-06-21', 5000, 2200, 340, 420, 'Fargo Air Show', 'tentative'),
  createShow('show-2026-109', TOURS.BLUE_TEAM, 'venue-019', '2026-08-07', '2026-08-09', 6600, 2900, 440, 520, 'Springfield State Fair', 'tentative'),
  createShow('show-2026-110', TOURS.BLUE_TEAM, 'venue-020', '2026-09-11', '2026-09-13', 5800, 2600, 400, 480, 'Peoria Riverfront', 'tentative'),
  createShow('show-2026-111', TOURS.BLUE_TEAM, 'venue-046', '2026-08-14', '2026-08-16', 5600, 2500, 380, 440, 'Sheboygan Bratwurst Days', 'tentative'),
  createShow('show-2026-112', TOURS.BLUE_TEAM, 'venue-049', '2026-07-24', '2026-07-26', 5000, 2250, 350, 400, 'Fond du Lac County Fair', 'tentative'),
  createShow('show-2026-113', TOURS.BLUE_TEAM, 'venue-043', '2026-09-18', '2026-09-20', 6000, 2700, 420, 460, 'Wausau Logging Congress', 'tentative'),
  createShow('show-2026-114', TOURS.BLUE_TEAM, 'venue-120', '2026-07-09', '2026-07-11', 6000, 2700, 420, 480, 'Rapid City Summer Nights', 'tentative'),

  // =====================================
  // ADDITIONAL REGIONAL SHOWS - 2027
  // =====================================
  createShow('show-2027-100', TOURS.RED_TEAM, 'venue-044', '2027-04-16', '2027-04-18', 9400, 4200, 640, 580, 'Madison Spring Fling', 'tentative'),
  createShow('show-2027-101', TOURS.RED_TEAM, 'venue-011', '2027-05-21', '2027-05-23', 5800, 2600, 400, 460, 'St Cloud River Days', 'tentative'),
  createShow('show-2027-102', TOURS.RED_TEAM, 'venue-046', '2027-07-30', '2027-08-01', 6000, 2700, 420, 460, 'Sheboygan Bratwurst Days', 'tentative'),
  createShow('show-2027-103', TOURS.RED_TEAM, 'venue-049', '2027-07-16', '2027-07-18', 5000, 2250, 350, 400, 'Fond du Lac County Fair', 'tentative'),
  createShow('show-2027-104', TOURS.RED_TEAM, 'venue-019', '2027-09-10', '2027-09-12', 7000, 3100, 480, 560, 'Springfield State Fair', 'tentative'),
  createShow('show-2027-105', TOURS.RED_TEAM, 'venue-020', '2027-10-15', '2027-10-17', 5800, 2600, 400, 500, 'Peoria Riverfront fall', 'tentative'),
  createShow('show-2027-106', TOURS.RED_TEAM, 'venue-036', '2027-06-25', '2027-06-27', 5400, 2400, 360, 460, 'Fargo Air Show', 'tentative'),
  createShow('show-2027-107', TOURS.RED_TEAM, 'venue-035', '2027-07-09', '2027-07-11', 5800, 2600, 400, 480, 'Sioux Falls Festival', 'tentative'),
  createShow('show-2027-108', TOURS.RED_TEAM, 'venue-010', '2027-05-28', '2027-05-30', 5600, 2500, 380, 440, 'Rochester Mayo Fest', 'tentative'),
  createShow('show-2027-109', TOURS.RED_TEAM, 'venue-120', '2027-07-02', '2027-07-04', 6200, 2800, 440, 500, 'Rapid City Independence Day', 'tentative'),
  createShow('show-2027-110', TOURS.BLUE_TEAM, 'venue-044', '2027-04-23', '2027-04-25', 9200, 4100, 620, 580, 'Madison Spring Fling', 'tentative'),
  createShow('show-2027-111', TOURS.BLUE_TEAM, 'venue-010', '2027-05-21', '2027-05-23', 5800, 2600, 400, 460, 'Rochester Mayo Fest', 'tentative'),
  createShow('show-2027-112', TOURS.BLUE_TEAM, 'venue-036', '2027-06-18', '2027-06-20', 5200, 2300, 350, 440, 'Fargo Air Show', 'tentative'),
  createShow('show-2027-113', TOURS.BLUE_TEAM, 'venue-035', '2027-07-02', '2027-07-04', 5600, 2500, 380, 460, 'Sioux Falls Independence Day', 'tentative'),
  createShow('show-2027-114', TOURS.BLUE_TEAM, 'venue-019', '2027-08-06', '2027-08-08', 6800, 3000, 460, 540, 'Springfield State Fair', 'tentative'),
  createShow('show-2027-115', TOURS.BLUE_TEAM, 'venue-020', '2027-09-10', '2027-09-12', 6000, 2700, 420, 500, 'Peoria Riverfront', 'tentative'),
  createShow('show-2027-116', TOURS.BLUE_TEAM, 'venue-046', '2027-08-13', '2027-08-15', 5800, 2600, 400, 460, 'Sheboygan Bratwurst Days', 'tentative'),
  createShow('show-2027-117', TOURS.BLUE_TEAM, 'venue-049', '2027-07-23', '2027-07-25', 5200, 2350, 370, 420, 'Fond du Lac County Fair', 'tentative'),
  createShow('show-2027-118', TOURS.BLUE_TEAM, 'venue-043', '2027-09-17', '2027-09-19', 6200, 2800, 440, 480, 'Wausau Logging Congress', 'tentative'),
  createShow('show-2027-119', TOURS.BLUE_TEAM, 'venue-120', '2027-07-08', '2027-07-10', 6200, 2800, 440, 500, 'Rapid City Summer Nights', 'tentative'),

  // =====================================
  // ADDITIONAL FILL SHOWS - Reaching 400+
  // =====================================
  createShow('show-2023-200', TOURS.RED_TEAM, 'venue-102', '2023-05-26', '2023-05-28', 5200, 2300, 350, 400, 'Dubuque Music and More'),
  createShow('show-2023-201', TOURS.BLUE_TEAM, 'venue-102', '2023-06-02', '2023-06-04', 5000, 2200, 340, 380, 'Dubuque Music and More'),
  createShow('show-2024-200', TOURS.RED_TEAM, 'venue-058', '2024-07-18', '2024-07-20', 4800, 2100, 320, 360, 'Spooner Rodeo'),
  createShow('show-2024-201', TOURS.BLUE_TEAM, 'venue-058', '2024-07-25', '2024-07-27', 5000, 2200, 340, 380, 'Spooner Rodeo'),
  createShow('show-2025-200', TOURS.RED_TEAM, 'venue-058', '2025-07-17', '2025-07-19', 5000, 2200, 340, 380, 'Spooner Rodeo'),
  createShow('show-2025-201', TOURS.BLUE_TEAM, 'venue-059', '2025-08-08', '2025-08-10', 4600, 2000, 300, 360, 'Cable Car Show'),
  createShow('show-2025-202', TOURS.RED_TEAM, 'venue-059', '2025-08-15', '2025-08-17', 4800, 2100, 320, 380, 'Cable Car Show'),
  createShow('show-2026-200', TOURS.RED_TEAM, 'venue-058', '2026-07-16', '2026-07-18', 5200, 2300, 350, 400, 'Spooner Rodeo', 'tentative'),
  createShow('show-2026-201', TOURS.BLUE_TEAM, 'venue-058', '2026-07-23', '2026-07-25', 5400, 2400, 360, 420, 'Spooner Rodeo', 'tentative'),
  createShow('show-2026-202', TOURS.RED_TEAM, 'venue-059', '2026-08-07', '2026-08-09', 5000, 2200, 340, 400, 'Cable Car Show', 'tentative'),
  createShow('show-2027-200', TOURS.RED_TEAM, 'venue-058', '2027-07-15', '2027-07-17', 5400, 2400, 360, 420, 'Spooner Rodeo', 'tentative'),
  createShow('show-2027-201', TOURS.BLUE_TEAM, 'venue-058', '2027-07-22', '2027-07-24', 5600, 2500, 380, 440, 'Spooner Rodeo', 'tentative'),
  createShow('show-2027-202', TOURS.RED_TEAM, 'venue-059', '2027-08-06', '2027-08-08', 5200, 2300, 350, 420, 'Cable Car Show', 'tentative'),
  createShow('show-2027-203', TOURS.BLUE_TEAM, 'venue-059', '2027-08-13', '2027-08-15', 5400, 2400, 360, 440, 'Cable Car Show', 'tentative')
];

// Helper function to calculate derived values
export function calculateShowMetrics(show) {
  const totalRevenue = show.performanceFee + show.merchandiseSales;
  const totalCosts = show.materialsUsed + show.expenses;
  const profit = totalRevenue - totalCosts;

  // Calculate duration in days
  const start = new Date(show.startDate);
  const end = new Date(show.endDate);
  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return {
    ...show,
    totalRevenue,
    profit,
    durationDays
  };
}

// Get all shows with calculated metrics
export function getShowsWithMetrics(shows) {
  return shows.map(calculateShowMetrics);
}

// Get shows filtered by tour
export function getShowsByTour(shows, tourName) {
  return shows.filter(show => show.tour === tourName);
}

// Utility function for formatting date ranges
export function formatDateRange(startDate, endDate) {
  if (!startDate) return 'No date';

  const start = new Date(startDate + 'T12:00:00'); // Add time to avoid timezone issues
  const end = endDate ? new Date(endDate + 'T12:00:00') : start;

  // Check for invalid dates
  if (isNaN(start.getTime())) return 'Invalid date';
  if (isNaN(end.getTime())) return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (startDate === endDate || !endDate) {
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return `${startStr} - ${endStr}`;
}
