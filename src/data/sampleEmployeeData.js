// Sample Employee Data for Timberworks Lumberjack Show
// Hayward, WI base location
// Team structure: 2 admin, 4 lumberjacks, 2 announcers (full-time)
// Day-raters: fill-in lumberjacks and lumberjills for larger state fair shows

export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full-Time Salaried', color: '#2e7d32' },
  { value: 'day_rate', label: 'Day-Rate Temp', color: '#1565c0' }
];

export const TEAM_ASSIGNMENTS = [
  { value: 'red', label: 'Red Team', color: '#c62828' },
  { value: 'blue', label: 'Blue Team', color: '#1565c0' },
  { value: 'flex', label: 'Flex (Either)', color: '#7b1fa2' }
];

export const EMPLOYEE_ROLES = [
  { value: 'performer', label: 'Performer' },
  { value: 'lead_performer', label: 'Lead Performer' },
  { value: 'lumberjill', label: 'Lumberjill' },
  { value: 'crew', label: 'Crew' },
  { value: 'driver', label: 'Driver' },
  { value: 'announcer', label: 'Announcer' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Administrative' }
];

// Lumberjack competition events - binary can/cannot perform
export const PERFORMANCE_EVENTS = [
  { id: 'single_buck', label: 'Single Buck', icon: '🪚' },
  { id: 'underhand_chop', label: 'Underhand Chop', icon: '🪓' },
  { id: 'springboard_chop', label: 'Springboard Chop', icon: '🪵' },
  { id: 'op_race', label: 'Obstacle Pole Race', icon: '🏃' },
  { id: 'hot_saw', label: 'Hot Saw', icon: '⚡' },
  { id: 'carve_skit', label: 'Carve Skit', icon: '🎭' },
  { id: 'speed_climb', label: 'Speed Climb', icon: '🧗' },
  { id: 'logrolling', label: 'Logrolling', icon: '🌊' }
];

// Other applicable skills
export const OTHER_SKILLS = [
  { id: 'cdl', label: 'CDL', icon: '🚛' },
  { id: 'admin_support', label: 'Admin Support', icon: '📋' },
  { id: 'social_media', label: 'Social Media', icon: '📱' },
  { id: 'announcer', label: 'Announcer', icon: '🎤' },
  { id: 'bear_carver', label: 'Bear Carver', icon: '🐻' }
];

// Certifications with expiration tracking
export const CERTIFICATION_TYPES = [
  { id: 'cdl_license', label: 'CDL License', icon: '🪪' },
  { id: 'first_aid', label: 'First Aid/CPR', icon: '🩹' },
  { id: 'chainsaw_safety', label: 'Chainsaw Safety', icon: '⛑️' }
];

// Placeholder avatar URLs (using UI Avatars service for initials-based placeholders)
const getPlaceholderAvatar = (firstName, lastName, bgColor = '2e7d32') =>
  `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${bgColor}&color=fff&size=128`;

export const sampleEmployees = [
  // ========== FULL-TIME SALARIED: 4 LUMBERJACKS ==========
  {
    id: 'emp-001',
    firstName: 'Cooper',
    lastName: 'Albert',
    photoUrl: getPlaceholderAvatar('Cooper', 'Albert', 'c62828'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 55000,
    dayRate: null,
    role: 'lead_performer',
    team: 'red',
    phone: '(715) 555-0101',
    email: 'cooper@timberworks.com',
    emergencyContact: {
      name: 'Emergency Contact',
      phone: '(715) 555-0102',
      relationship: 'Family'
    },
    startDate: '2018-01-15',
    isActive: true,
    notes: 'Owner/Lead performer. Manages Red Team operations.',
    events: {
      single_buck: true,
      underhand_chop: true,
      springboard_chop: true,
      op_race: true,
      hot_saw: true,
      carve_skit: true,
      speed_climb: true,
      logrolling: true
    },
    skills: {
      cdl: true,
      admin_support: true,
      social_media: true,
      announcer: true,
      bear_carver: true
    },
    certifications: {
      cdl_license: { certified: true, expirationDate: '2027-06-15' },
      first_aid: { certified: true, expirationDate: '2026-08-20' },
      chainsaw_safety: { certified: true, expirationDate: '2027-01-01' }
    }
  },
  {
    id: 'emp-002',
    firstName: 'Jake',
    lastName: 'Timber',
    photoUrl: getPlaceholderAvatar('Jake', 'Timber', '1565c0'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 48000,
    dayRate: null,
    role: 'lead_performer',
    team: 'blue',
    phone: '(715) 555-0201',
    email: 'jake@timberworks.com',
    emergencyContact: {
      name: 'Sarah Timber',
      phone: '(715) 555-0202',
      relationship: 'Spouse'
    },
    startDate: '2019-03-01',
    isActive: true,
    notes: 'Blue Team captain. Hot Saw specialist - holds company record.',
    events: {
      single_buck: true,
      underhand_chop: true,
      springboard_chop: true,
      op_race: true,
      hot_saw: true,
      carve_skit: false,
      speed_climb: true,
      logrolling: true
    },
    skills: {
      cdl: true,
      admin_support: false,
      social_media: false,
      announcer: false,
      bear_carver: true
    },
    certifications: {
      cdl_license: { certified: true, expirationDate: '2026-11-30' },
      first_aid: { certified: true, expirationDate: '2026-05-15' },
      chainsaw_safety: { certified: true, expirationDate: '2027-01-20' }
    }
  },
  {
    id: 'emp-003',
    firstName: 'Mike',
    lastName: 'Sawyer',
    photoUrl: getPlaceholderAvatar('Mike', 'Sawyer', 'c62828'),
    homeLocation: 'Cable, WI',
    employmentType: 'full_time',
    annualSalary: 46000,
    dayRate: null,
    role: 'performer',
    team: 'red',
    phone: '(715) 555-0301',
    email: 'mike@timberworks.com',
    emergencyContact: {
      name: 'Linda Sawyer',
      phone: '(715) 555-0302',
      relationship: 'Wife'
    },
    startDate: '2020-05-20',
    isActive: true,
    notes: 'Speed climb specialist. Great with crowd interaction.',
    events: {
      single_buck: true,
      underhand_chop: true,
      springboard_chop: true,
      op_race: true,
      hot_saw: false,
      carve_skit: true,
      speed_climb: true,
      logrolling: true
    },
    skills: {
      cdl: false,
      admin_support: false,
      social_media: false,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-09-10' },
      chainsaw_safety: { certified: true, expirationDate: '2026-07-01' }
    }
  },
  {
    id: 'emp-004',
    firstName: 'Ben',
    lastName: 'Oakley',
    photoUrl: getPlaceholderAvatar('Ben', 'Oakley', '1565c0'),
    homeLocation: 'Spooner, WI',
    employmentType: 'full_time',
    annualSalary: 45000,
    dayRate: null,
    role: 'performer',
    team: 'blue',
    phone: '(715) 555-0401',
    email: 'ben@timberworks.com',
    emergencyContact: {
      name: 'Carol Oakley',
      phone: '(715) 555-0402',
      relationship: 'Mother'
    },
    startDate: '2021-06-01',
    isActive: true,
    notes: 'Underhand chop specialist. Also handles equipment maintenance.',
    events: {
      single_buck: true,
      underhand_chop: true,
      springboard_chop: true,
      op_race: true,
      hot_saw: false,
      carve_skit: false,
      speed_climb: true,
      logrolling: true
    },
    skills: {
      cdl: true,
      admin_support: false,
      social_media: false,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: true, expirationDate: '2027-03-22' },
      first_aid: { certified: true, expirationDate: '2026-04-18' },
      chainsaw_safety: { certified: true, expirationDate: '2026-11-05' }
    }
  },

  // ========== FULL-TIME SALARIED: 2 ANNOUNCERS ==========
  {
    id: 'emp-005',
    firstName: 'Rachel',
    lastName: 'Pine',
    photoUrl: getPlaceholderAvatar('Rachel', 'Pine', '7b1fa2'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 44000,
    dayRate: null,
    role: 'announcer',
    team: 'flex',
    phone: '(715) 555-0501',
    email: 'rachel@timberworks.com',
    emergencyContact: {
      name: 'David Pine',
      phone: '(715) 555-0502',
      relationship: 'Husband'
    },
    startDate: '2020-02-15',
    isActive: true,
    notes: 'Primary show announcer. Energetic crowd engagement. Also manages social media.',
    events: {
      single_buck: false,
      underhand_chop: false,
      springboard_chop: false,
      op_race: false,
      hot_saw: false,
      carve_skit: true,
      speed_climb: false,
      logrolling: false
    },
    skills: {
      cdl: false,
      admin_support: true,
      social_media: true,
      announcer: true,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-10-30' },
      chainsaw_safety: { certified: false, expirationDate: null }
    }
  },
  {
    id: 'emp-006',
    firstName: 'Tom',
    lastName: 'Birch',
    photoUrl: getPlaceholderAvatar('Tom', 'Birch', '7b1fa2'),
    homeLocation: 'Rice Lake, WI',
    employmentType: 'full_time',
    annualSalary: 42000,
    dayRate: null,
    role: 'announcer',
    team: 'flex',
    phone: '(715) 555-0601',
    email: 'tom@timberworks.com',
    emergencyContact: {
      name: 'Mary Birch',
      phone: '(715) 555-0602',
      relationship: 'Wife'
    },
    startDate: '2022-08-10',
    isActive: true,
    notes: 'Secondary announcer. Also drives equipment trailer when needed.',
    events: {
      single_buck: false,
      underhand_chop: false,
      springboard_chop: false,
      op_race: false,
      hot_saw: false,
      carve_skit: false,
      speed_climb: false,
      logrolling: false
    },
    skills: {
      cdl: true,
      admin_support: false,
      social_media: false,
      announcer: true,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: true, expirationDate: '2027-08-15' },
      first_aid: { certified: true, expirationDate: '2026-06-20' },
      chainsaw_safety: { certified: false, expirationDate: null }
    }
  },

  // ========== FULL-TIME SALARIED: 2 ADMIN WORKERS ==========
  {
    id: 'emp-007',
    firstName: 'Lisa',
    lastName: 'Maple',
    photoUrl: getPlaceholderAvatar('Lisa', 'Maple', '2e7d32'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 48000,
    dayRate: null,
    role: 'manager',
    team: 'flex',
    phone: '(715) 555-0701',
    email: 'lisa@timberworks.com',
    emergencyContact: {
      name: 'John Maple',
      phone: '(715) 555-0702',
      relationship: 'Husband'
    },
    startDate: '2019-01-05',
    isActive: true,
    notes: 'Operations manager. Handles booking, contracts, and logistics.',
    events: {
      single_buck: false,
      underhand_chop: false,
      springboard_chop: false,
      op_race: false,
      hot_saw: false,
      carve_skit: false,
      speed_climb: false,
      logrolling: false
    },
    skills: {
      cdl: false,
      admin_support: true,
      social_media: true,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-12-15' },
      chainsaw_safety: { certified: false, expirationDate: null }
    }
  },
  {
    id: 'emp-008',
    firstName: 'Amy',
    lastName: 'Willow',
    photoUrl: getPlaceholderAvatar('Amy', 'Willow', '2e7d32'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 40000,
    dayRate: null,
    role: 'admin',
    team: 'flex',
    phone: '(715) 555-0801',
    email: 'amy@timberworks.com',
    emergencyContact: {
      name: 'Bob Willow',
      phone: '(715) 555-0802',
      relationship: 'Father'
    },
    startDate: '2023-03-15',
    isActive: true,
    notes: 'Administrative assistant. Handles merchandise orders, inventory, and customer service.',
    events: {
      single_buck: false,
      underhand_chop: false,
      springboard_chop: false,
      op_race: false,
      hot_saw: false,
      carve_skit: false,
      speed_climb: false,
      logrolling: false
    },
    skills: {
      cdl: false,
      admin_support: true,
      social_media: true,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: false, expirationDate: null },
      chainsaw_safety: { certified: false, expirationDate: null }
    }
  },

  // ========== DAY-RATE TEMPS: FILL-IN LUMBERJACKS ==========
  {
    id: 'emp-009',
    firstName: 'Chris',
    lastName: 'Hemlock',
    photoUrl: getPlaceholderAvatar('Chris', 'Hemlock', 'ff9800'),
    homeLocation: 'Duluth, MN',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 250,
    role: 'performer',
    team: 'flex',
    phone: '(218) 555-0901',
    email: 'chris.hemlock@gmail.com',
    emergencyContact: {
      name: 'Amy Hemlock',
      phone: '(218) 555-0902',
      relationship: 'Sister'
    },
    startDate: '2022-06-15',
    isActive: true,
    notes: 'Seasonal performer. Available May-September. Strong in springboard.',
    events: {
      single_buck: true,
      underhand_chop: true,
      springboard_chop: true,
      op_race: true,
      hot_saw: false,
      carve_skit: false,
      speed_climb: true,
      logrolling: false
    },
    skills: {
      cdl: false,
      admin_support: false,
      social_media: false,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-07-10' },
      chainsaw_safety: { certified: true, expirationDate: '2026-08-25' }
    }
  },
  {
    id: 'emp-010',
    firstName: 'Dan',
    lastName: 'Spruce',
    photoUrl: getPlaceholderAvatar('Dan', 'Spruce', 'ff9800'),
    homeLocation: 'Ashland, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 225,
    role: 'performer',
    team: 'flex',
    phone: '(715) 555-1001',
    email: 'dan.spruce@outlook.com',
    emergencyContact: {
      name: 'Pat Spruce',
      phone: '(715) 555-1002',
      relationship: 'Wife'
    },
    startDate: '2021-07-20',
    isActive: true,
    notes: 'Reliable fill-in. Good all-around performer.',
    events: {
      single_buck: true,
      underhand_chop: true,
      springboard_chop: false,
      op_race: true,
      hot_saw: false,
      carve_skit: false,
      speed_climb: false,
      logrolling: true
    },
    skills: {
      cdl: false,
      admin_support: false,
      social_media: false,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-11-20' },
      chainsaw_safety: { certified: true, expirationDate: '2026-10-15' }
    }
  },
  {
    id: 'emp-011',
    firstName: 'Kevin',
    lastName: 'Aspen',
    photoUrl: getPlaceholderAvatar('Kevin', 'Aspen', 'ff9800'),
    homeLocation: 'Superior, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 300,
    role: 'performer',
    team: 'flex',
    phone: '(715) 555-1101',
    email: 'kevin.aspen@gmail.com',
    emergencyContact: {
      name: 'Janet Aspen',
      phone: '(715) 555-1102',
      relationship: 'Mother'
    },
    startDate: '2020-04-10',
    isActive: true,
    notes: 'Hot Saw expert. Also does bear carving demonstrations. Premium rate for specialized skills.',
    events: {
      single_buck: true,
      underhand_chop: true,
      springboard_chop: false,
      op_race: false,
      hot_saw: true,
      carve_skit: true,
      speed_climb: false,
      logrolling: false
    },
    skills: {
      cdl: false,
      admin_support: false,
      social_media: false,
      announcer: false,
      bear_carver: true
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-05-05' },
      chainsaw_safety: { certified: true, expirationDate: '2027-02-28' }
    }
  },

  // ========== DAY-RATE TEMPS: LUMBERJILLS (mainly logrolling) ==========
  {
    id: 'emp-012',
    firstName: 'Sarah',
    lastName: 'Cedar',
    photoUrl: getPlaceholderAvatar('Sarah', 'Cedar', 'e91e63'),
    homeLocation: 'Eau Claire, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 275,
    role: 'lumberjill',
    team: 'flex',
    phone: '(715) 555-1201',
    email: 'sarah.cedar@yahoo.com',
    emergencyContact: {
      name: 'Mark Cedar',
      phone: '(715) 555-1202',
      relationship: 'Father'
    },
    startDate: '2023-05-01',
    isActive: true,
    notes: 'College student - available summer and weekends. Excellent logroller - state champion.',
    events: {
      single_buck: true,
      underhand_chop: false,
      springboard_chop: false,
      op_race: true,
      hot_saw: false,
      carve_skit: true,
      speed_climb: false,
      logrolling: true
    },
    skills: {
      cdl: false,
      admin_support: false,
      social_media: true,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2027-01-15' },
      chainsaw_safety: { certified: true, expirationDate: '2026-06-30' }
    }
  },
  {
    id: 'emp-013',
    firstName: 'Emma',
    lastName: 'Axelrod',
    photoUrl: getPlaceholderAvatar('Emma', 'Axelrod', 'e91e63'),
    homeLocation: 'Minneapolis, MN',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 275,
    role: 'lumberjill',
    team: 'flex',
    phone: '(612) 555-1301',
    email: 'emma.axelrod@gmail.com',
    emergencyContact: {
      name: 'Tom Axelrod',
      phone: '(612) 555-1302',
      relationship: 'Brother'
    },
    startDate: '2022-06-01',
    isActive: true,
    notes: 'Former competitive logroller. Great for larger state fair shows.',
    events: {
      single_buck: false,
      underhand_chop: false,
      springboard_chop: false,
      op_race: true,
      hot_saw: false,
      carve_skit: true,
      speed_climb: false,
      logrolling: true
    },
    skills: {
      cdl: false,
      admin_support: false,
      social_media: true,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-09-10' },
      chainsaw_safety: { certified: false, expirationDate: null }
    }
  },
  {
    id: 'emp-014',
    firstName: 'Jess',
    lastName: 'Redwood',
    photoUrl: getPlaceholderAvatar('Jess', 'Redwood', 'e91e63'),
    homeLocation: 'Wausau, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 250,
    role: 'lumberjill',
    team: 'flex',
    phone: '(715) 555-1401',
    email: 'jess.redwood@gmail.com',
    emergencyContact: {
      name: 'Julie Redwood',
      phone: '(715) 555-1402',
      relationship: 'Mother'
    },
    startDate: '2024-05-15',
    isActive: true,
    notes: 'New to the team. Training in logrolling. Available for summer shows.',
    events: {
      single_buck: false,
      underhand_chop: false,
      springboard_chop: false,
      op_race: true,
      hot_saw: false,
      carve_skit: false,
      speed_climb: false,
      logrolling: true
    },
    skills: {
      cdl: false,
      admin_support: false,
      social_media: false,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2027-03-01' },
      chainsaw_safety: { certified: false, expirationDate: null }
    }
  }
];

// Helper to get empty employee object for forms
export const getEmptyEmployee = () => ({
  id: '',
  firstName: '',
  lastName: '',
  photoUrl: '',
  homeLocation: '',
  employmentType: 'day_rate',
  annualSalary: null,
  dayRate: null,
  role: 'crew',
  team: 'flex',
  phone: '',
  email: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  },
  startDate: '',
  isActive: true,
  notes: '',
  events: {
    single_buck: false,
    underhand_chop: false,
    springboard_chop: false,
    op_race: false,
    hot_saw: false,
    carve_skit: false,
    speed_climb: false,
    logrolling: false
  },
  skills: {
    cdl: false,
    admin_support: false,
    social_media: false,
    announcer: false,
    bear_carver: false
  },
  certifications: {
    cdl_license: { certified: false, expirationDate: null },
    first_aid: { certified: false, expirationDate: null },
    chainsaw_safety: { certified: false, expirationDate: null }
  }
});
