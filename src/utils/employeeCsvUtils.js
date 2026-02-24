import Papa from 'papaparse';
import {
  PERFORMANCE_EVENTS,
  OTHER_SKILLS,
  CERTIFICATION_TYPES,
  getEmptyEmployee
} from '../data/sampleEmployeeData';

// Define the stable column order for CSV export/import
export const EMPLOYEE_CSV_COLUMNS = [
  // Basic Info
  'id',
  'firstName',
  'lastName',
  'homeLocation',
  // Employment
  'employmentType',
  'role',
  'team',
  'annualSalary',
  'dayRate',
  'startDate',
  'isActive',
  // Contact
  'phone',
  'email',
  'emergencyContactName',
  'emergencyContactPhone',
  'emergencyContactRelationship',
  // Performance Events (8 columns)
  ...PERFORMANCE_EVENTS.map(e => `event_${e.id}`),
  // Other Skills (5 columns)
  ...OTHER_SKILLS.map(s => `skill_${s.id}`),
  // Certifications (6 columns - certified + expiration for each)
  ...CERTIFICATION_TYPES.flatMap(c => [`cert_${c.id}`, `cert_${c.id}_expires`]),
  // Read-only calculated field
  'daysWorked',
  // Notes
  'notes'
];

// Human-readable column headers for CSV
export const EMPLOYEE_CSV_HEADERS = {
  id: 'ID',
  firstName: 'First Name',
  lastName: 'Last Name',
  homeLocation: 'Home Location',
  employmentType: 'Employment Type',
  role: 'Role',
  team: 'Team',
  annualSalary: 'Annual Salary',
  dayRate: 'Day Rate',
  startDate: 'Start Date',
  isActive: 'Active',
  phone: 'Phone',
  email: 'Email',
  emergencyContactName: 'Emergency Contact Name',
  emergencyContactPhone: 'Emergency Contact Phone',
  emergencyContactRelationship: 'Emergency Contact Relationship',
  // Performance Events
  event_single_buck: 'Single Buck',
  event_underhand_chop: 'Underhand Chop',
  event_springboard_chop: 'Springboard Chop',
  event_op_race: 'Obstacle Pole Race',
  event_hot_saw: 'Hot Saw',
  event_carve_skit: 'Carve Skit',
  event_speed_climb: 'Speed Climb',
  event_logrolling: 'Logrolling',
  // Other Skills
  skill_cdl: 'CDL Skill',
  skill_admin_support: 'Admin Support',
  skill_social_media: 'Social Media',
  skill_announcer: 'Announcer Skill',
  skill_bear_carver: 'Bear Carver',
  // Certifications
  cert_cdl_license: 'CDL License Certified',
  cert_cdl_license_expires: 'CDL License Expires',
  cert_first_aid: 'First Aid Certified',
  cert_first_aid_expires: 'First Aid Expires',
  cert_chainsaw_safety: 'Chainsaw Safety Certified',
  cert_chainsaw_safety_expires: 'Chainsaw Safety Expires',
  // Read-only
  daysWorked: 'Days Worked (Read-Only)',
  notes: 'Notes'
};

// Reverse mapping from header to field name (case-insensitive)
const HEADER_TO_FIELD = Object.fromEntries(
  Object.entries(EMPLOYEE_CSV_HEADERS).map(([field, header]) => [header.toLowerCase(), field])
);

/**
 * Flatten an employee object to CSV row format
 */
function flattenEmployee(employee, daysWorked = 0) {
  const row = {};

  // Basic Info
  row.id = employee.id || '';
  row.firstName = employee.firstName || '';
  row.lastName = employee.lastName || '';
  row.homeLocation = employee.homeLocation || '';

  // Employment
  row.employmentType = employee.employmentType || 'day_rate';
  row.role = employee.role || '';
  row.team = employee.team || 'flex';
  row.annualSalary = employee.annualSalary || '';
  row.dayRate = employee.dayRate || '';
  row.startDate = employee.startDate || '';
  row.isActive = employee.isActive ? 'Yes' : 'No';

  // Contact
  row.phone = employee.phone || '';
  row.email = employee.email || '';
  row.emergencyContactName = employee.emergencyContact?.name || '';
  row.emergencyContactPhone = employee.emergencyContact?.phone || '';
  row.emergencyContactRelationship = employee.emergencyContact?.relationship || '';

  // Performance Events
  PERFORMANCE_EVENTS.forEach(event => {
    row[`event_${event.id}`] = employee.events?.[event.id] ? 'Yes' : 'No';
  });

  // Other Skills
  OTHER_SKILLS.forEach(skill => {
    row[`skill_${skill.id}`] = employee.skills?.[skill.id] ? 'Yes' : 'No';
  });

  // Certifications
  CERTIFICATION_TYPES.forEach(cert => {
    const certData = employee.certifications?.[cert.id];
    row[`cert_${cert.id}`] = certData?.certified ? 'Yes' : 'No';
    row[`cert_${cert.id}_expires`] = certData?.expirationDate || '';
  });

  // Read-only calculated field
  row.daysWorked = daysWorked;

  // Notes
  row.notes = employee.notes || '';

  return row;
}

/**
 * Export employees to CSV string
 */
export function exportEmployeesToCSV(employees, employeeDaysWorked = new Map()) {
  // Prepare data with human-readable headers
  const data = employees.map(employee => {
    const flatRow = flattenEmployee(employee, employeeDaysWorked.get(employee.id) || 0);
    const row = {};
    EMPLOYEE_CSV_COLUMNS.forEach(col => {
      row[EMPLOYEE_CSV_HEADERS[col]] = flatRow[col] ?? '';
    });
    return row;
  });

  return Papa.unparse(data, {
    quotes: true,
    header: true
  });
}

/**
 * Download CSV as a file
 */
export function downloadEmployeeCSV(employees, employeeDaysWorked = new Map(), filename = 'team-roster.csv') {
  const csv = exportEmployeesToCSV(employees, employeeDaysWorked);
  // Add BOM for Excel UTF-8 compatibility
  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  // Add date to filename
  const today = new Date().toISOString().split('T')[0];
  link.download = filename.replace('.csv', `-${today}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse CSV string to employees array
 */
export function parseEmployeeCSV(csvString) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          const criticalErrors = results.errors.filter(e => e.type === 'FieldMismatch');
          if (criticalErrors.length > 0) {
            reject(new Error(`CSV parsing error: ${criticalErrors[0].message}`));
            return;
          }
        }

        try {
          const employees = results.data.map((row, index) => mapRowToEmployee(row, index));
          resolve(employees);
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
}

/**
 * Parse Yes/No to boolean
 */
function parseYesNo(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  const lower = value.trim().toLowerCase();
  return lower === 'yes' || lower === 'true' || lower === '1';
}

/**
 * Map a CSV row to an employee object
 */
function mapRowToEmployee(row, index) {
  // Normalize headers (case-insensitive matching)
  const normalizedRow = {};
  Object.entries(row).forEach(([key, value]) => {
    const fieldName = HEADER_TO_FIELD[key.toLowerCase().trim()] || key;
    normalizedRow[fieldName] = value;
  });

  // Generate ID if not present
  const id = normalizedRow.id?.trim() || `emp-import-${Date.now()}-${index}`;

  // Validate required fields
  const firstName = normalizedRow.firstName?.trim();
  if (!firstName) {
    throw new Error(`Row ${index + 2}: First Name is required`);
  }

  const lastName = normalizedRow.lastName?.trim();
  if (!lastName) {
    throw new Error(`Row ${index + 2}: Last Name is required`);
  }

  // Parse employment type
  let employmentType = normalizedRow.employmentType?.trim()?.toLowerCase() || 'day_rate';
  if (employmentType.includes('full') || employmentType.includes('salaried')) {
    employmentType = 'full_time';
  } else {
    employmentType = 'day_rate';
  }

  // Parse team
  let team = normalizedRow.team?.trim()?.toLowerCase() || 'flex';
  if (team.includes('red')) {
    team = 'red';
  } else if (team.includes('blue')) {
    team = 'blue';
  } else {
    team = 'flex';
  }

  // Parse role - normalize common variations
  let role = normalizedRow.role?.trim()?.toLowerCase() || 'crew';
  const roleMap = {
    'performer': 'performer',
    'lead performer': 'lead_performer',
    'lead_performer': 'lead_performer',
    'lumberjill': 'lumberjill',
    'crew': 'crew',
    'announcer': 'announcer',
    'admin': 'admin',
    'administrative': 'admin',
    'manager': 'admin'
  };
  role = roleMap[role] || 'crew';

  // Build events object
  const events = {};
  PERFORMANCE_EVENTS.forEach(event => {
    events[event.id] = parseYesNo(normalizedRow[`event_${event.id}`]);
  });

  // Build skills object
  const skills = {};
  OTHER_SKILLS.forEach(skill => {
    skills[skill.id] = parseYesNo(normalizedRow[`skill_${skill.id}`]);
  });

  // Build certifications object
  const certifications = {};
  CERTIFICATION_TYPES.forEach(cert => {
    const certified = parseYesNo(normalizedRow[`cert_${cert.id}`]);
    const expirationDate = normalizedRow[`cert_${cert.id}_expires`]?.trim() || null;
    certifications[cert.id] = {
      certified,
      expirationDate: certified ? expirationDate : null
    };
  });

  // Build emergency contact
  const emergencyContact = {
    name: normalizedRow.emergencyContactName?.trim() || '',
    phone: normalizedRow.emergencyContactPhone?.trim() || '',
    relationship: normalizedRow.emergencyContactRelationship?.trim() || ''
  };

  return {
    ...getEmptyEmployee(),
    id,
    firstName,
    lastName,
    homeLocation: normalizedRow.homeLocation?.trim() || '',
    employmentType,
    annualSalary: employmentType === 'full_time' ? parseFloat(normalizedRow.annualSalary) || null : null,
    dayRate: employmentType === 'day_rate' ? parseFloat(normalizedRow.dayRate) || null : null,
    role,
    team,
    phone: normalizedRow.phone?.trim() || '',
    email: normalizedRow.email?.trim() || '',
    emergencyContact,
    startDate: normalizedRow.startDate?.trim() || '',
    isActive: parseYesNo(normalizedRow.isActive ?? 'yes'),
    notes: normalizedRow.notes?.trim() || '',
    events,
    skills,
    certifications,
    // photoUrl will be generated automatically or kept empty
    photoUrl: ''
  };
}

/**
 * Read a File object and parse as CSV
 */
export function importEmployeesFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      reject(new Error('Please select a CSV file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const employees = await parseEmployeeCSV(e.target.result);
        resolve(employees);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
}

/**
 * Validate imported employees and return validation result
 */
export function validateEmployeeImport(employees, existingEmployees) {
  const existingIds = new Set(existingEmployees.map(e => e.id));
  const newEmployees = [];
  const updatedEmployees = [];
  const errors = [];

  employees.forEach((employee, index) => {
    // Check for duplicate IDs within import
    const duplicateInImport = employees.findIndex((e, i) => i !== index && e.id === employee.id);
    if (duplicateInImport !== -1 && duplicateInImport < index) {
      errors.push(`Row ${index + 2}: Duplicate ID "${employee.id}" in import file`);
      return;
    }

    if (existingIds.has(employee.id)) {
      updatedEmployees.push(employee);
    } else {
      newEmployees.push(employee);
    }
  });

  return {
    valid: errors.length === 0,
    newEmployees,
    updatedEmployees,
    errors,
    summary: `${newEmployees.length} new, ${updatedEmployees.length} to update`
  };
}
