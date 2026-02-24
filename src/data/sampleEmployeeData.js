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
  { value: 'announcer', label: 'Announcer' },
  { value: 'admin', label: 'Administrative' }
];

/**
 * Get the display color for an employee based on their role and employment type.
 * Priority:
 *   - Lumberjill → Pink (#e91e63)
 *   - Announcer → Gray (#757575)
 *   - Admin/Crew → Yellow (#f9a825)
 *   - Performer/Lead Performer (full-time) → Red (#c62828) or Blue (#1565c0) by team
 *   - Performer/Lead Performer (day-rate) → Green (#4caf50)
 *   - Any other day-rate → Green (#4caf50)
 */
export function getRoleColor(employee) {
  switch (employee.role) {
    case 'lumberjill':
      return '#e91e63';
    case 'announcer':
      return '#757575';
    case 'admin':
    case 'crew':
      return '#f9a825';
    case 'performer':
    case 'lead_performer':
      if (employee.employmentType === 'day_rate') return '#4caf50';
      return employee.team === 'red' ? '#c62828' : '#1565c0';
    default:
      if (employee.employmentType === 'day_rate') return '#4caf50';
      return '#757575';
  }
}

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
    homeLocation: 'Madison, WI',
    employmentType: 'full_time',
    annualSalary: 70000,
    dayRate: null,
    role: 'lead_performer',
    team: 'red',
    phone: '(715) 555-0101',
    email: 'cooper@timberworks.com',
    emergencyContact: {
      name: 'Carson Albert',
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
      cdl: false,
      admin_support: true,
      social_media: true,
      announcer: true,
      bear_carver: true
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-08-20' },
      chainsaw_safety: { certified: true, expirationDate: '2027-01-01' }
    }
  },
  {
    id: 'emp-002',
    firstName: 'Nick',
    lastName: 'Shirley',
    photoUrl: getPlaceholderAvatar('Nick', 'Shirley', '1565c0'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 70000,
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
      carve_skit: true,
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
    firstName: 'Deven',
    lastName: 'Blair',
    photoUrl: getPlaceholderAvatar('Deven', 'Blair', 'c62828'),
    homeLocation: 'Cable, WI',
    employmentType: 'full_time',
    annualSalary: 70000,
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
      hot_saw: true,
      carve_skit: true,
      speed_climb: true,
      logrolling: true
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
      first_aid: { certified: true, expirationDate: '2026-09-10' },
      chainsaw_safety: { certified: true, expirationDate: '2026-07-01' }
    }
  },
  {
    id: 'emp-004',
    firstName: 'Zachary',
    lastName: 'Ray',
    photoUrl: getPlaceholderAvatar('Zachary', 'Ray', '1565c0'),
    homeLocation: 'Spooner, WI',
    employmentType: 'full_time',
    annualSalary: 70000,
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
      hot_saw: true,
      carve_skit: true,
      speed_climb: true,
      logrolling: true
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
      first_aid: { certified: true, expirationDate: '2026-04-18' },
      chainsaw_safety: { certified: true, expirationDate: '2026-11-05' }
    }
  },

  // ========== FULL-TIME SALARIED: 2 ANNOUNCERS ==========
  {
    id: 'emp-005',
    firstName: 'Dave',
    lastName: 'Weatherhead',
    photoUrl: getPlaceholderAvatar('Dave', 'Weatherhead', '757575'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 70000,
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
      social_media: false,
      announcer: true,
      bear_carver: true
    },
    certifications: {
      cdl_license: { certified: true, expirationDate: '2027-03-22' },
      first_aid: { certified: true, expirationDate: '2026-10-30' },
      chainsaw_safety: { certified: true, expirationDate: null }
    }
  },
  {
    id: 'emp-006',
    firstName: 'Sam',
    lastName: 'Benish',
    photoUrl: getPlaceholderAvatar('Sam', 'Benish', '757575'),
    homeLocation: 'Rice Lake, WI',
    employmentType: 'full_time',
    annualSalary: 70000,
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
      cdl: false,
      admin_support: false,
      social_media: true,
      announcer: true,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-06-20' },
      chainsaw_safety: { certified: false, expirationDate: null }
    }
  },

  // ========== FULL-TIME SALARIED: 2 ADMIN WORKERS ==========
  {
    id: 'emp-007',
    firstName: 'Suzanne',
    lastName: 'Jones',
    photoUrl: getPlaceholderAvatar('Suzanne', 'Jones', 'f9a825'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 70000,
    dayRate: null,
    role: 'admin',
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
      social_media: false,
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
    firstName: 'Samantha',
    lastName: 'LaSelle',
    photoUrl: getPlaceholderAvatar('Samantha', 'LaSelle', 'f9a825'),
    homeLocation: 'Hayward, WI',
    employmentType: 'full_time',
    annualSalary: 70000,
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
      announcer: true,
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
    firstName: 'Robert',
    lastName: 'Eggar',
    photoUrl: getPlaceholderAvatar('Robert', 'Eggar', '4caf50'),
    homeLocation: 'Madison, WI',
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
    notes: 'College student - available summer and weekends. Excellent logroller - state champion.',
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
      admin_support: true,
      social_media: true,
      announcer: true,
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
    firstName: 'Grant',
    lastName: 'Papp',
    photoUrl: getPlaceholderAvatar('Grant', 'Papp', '4caf50'),
    homeLocation: 'Hayward, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 200,
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
    isActive: false,
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
      chainsaw_safety: { certified: false, expirationDate: '2026-10-15' }
    }
  },
  {
    id: 'emp-011',
    firstName: 'Birk',
    lastName: 'Lee',
    photoUrl: getPlaceholderAvatar('Birk', 'Lee', '4caf50'),
    homeLocation: 'Hayward, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 200,
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
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-05-05' },
      chainsaw_safety: { certified: false, expirationDate: '2027-02-28' }
    }
  },
  {
    id: 'emp-012',
    firstName: 'Zachary',
    lastName: 'Tom',
    photoUrl: getPlaceholderAvatar('Zachary', 'Tom', '4caf50'),
    homeLocation: 'Spooner, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 200,
    role: 'performer',
    team: 'flex',
    phone: '(715) 555-1201',
    email: 'sarah.cedar@yahoo.com',
    emergencyContact: {
      name: 'Mark Cedar',
      phone: '(715) 555-1202',
      relationship: 'Father'
    },
    startDate: '2023-05-01',
    isActive: false,
    notes: 'College student - available summer and weekends. Excellent logroller - state champion.',
    events: {
      single_buck: true,
      underhand_chop: true,
      springboard_chop: true,
      op_race: true,
      hot_saw: true,
      carve_skit: true,
      speed_climb: false,
      logrolling: true
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
      first_aid: { certified: true, expirationDate: '2027-01-15' },
      chainsaw_safety: { certified: false, expirationDate: '2026-06-30' }
    }
  },
  {
    id: 'emp-013',
    firstName: 'Matt',
    lastName: 'Minocqua',
    photoUrl: getPlaceholderAvatar('Matt', 'Minocqua', '4caf50'),
    homeLocation: 'Milwaukee, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 200,
    role: 'performer',
    team: 'flex',
    phone: '(612) 555-1301',
    email: 'emma.axelrod@gmail.com',
    emergencyContact: {
      name: 'Tom Axelrod',
      phone: '(612) 555-1302',
      relationship: 'Brother'
    },
    startDate: '2022-06-01',
    isActive: false,
    notes: 'Former competitive logroller. Great for larger state fair shows.',
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
      cdl: false,
      admin_support: false,
      social_media: false,
      announcer: false,
      bear_carver: false
    },
    certifications: {
      cdl_license: { certified: false, expirationDate: null },
      first_aid: { certified: true, expirationDate: '2026-09-10' },
      chainsaw_safety: { certified: false, expirationDate: null }
    }
  },

  // ========== DAY-RATE TEMPS: LUMBERJILL ==========
  {
    id: 'emp-014',
    firstName: 'Livvy',
    lastName: 'Pappadapolous',
    photoUrl: getPlaceholderAvatar('Livvy', 'Pappadapolous', 'e91e63'),
    homeLocation: 'Wausau, WI',
    employmentType: 'day_rate',
    annualSalary: null,
    dayRate: 200,
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
      hot_saw: true,
      carve_skit: false,
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
