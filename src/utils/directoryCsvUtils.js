import Papa from 'papaparse';

// ========== VENUES CSV ==========

export const VENUE_CSV_COLUMNS = [
  'id',
  'name',
  'address',
  'city',
  'state',
  'zip',
  'latitude',
  'longitude',
  'venueType',
  'capacity',
  'indoorOutdoor',
  'website',
  'isActive',
  'notes'
];

export const VENUE_CSV_HEADERS = {
  id: 'ID',
  name: 'Venue Name',
  address: 'Address',
  city: 'City',
  state: 'State',
  zip: 'ZIP',
  latitude: 'Latitude',
  longitude: 'Longitude',
  venueType: 'Venue Type',
  capacity: 'Capacity',
  indoorOutdoor: 'Indoor/Outdoor',
  website: 'Website',
  isActive: 'Active',
  notes: 'Notes'
};

const VENUE_HEADER_TO_FIELD = Object.fromEntries(
  Object.entries(VENUE_CSV_HEADERS).map(([field, header]) => [header.toLowerCase(), field])
);

/**
 * Export venues to CSV string
 */
export function exportVenuesToCSV(venues) {
  const data = venues.map(venue => {
    const row = {};
    VENUE_CSV_COLUMNS.forEach(col => {
      const value = venue[col];
      if (col === 'isActive') {
        row[VENUE_CSV_HEADERS[col]] = value ? 'Yes' : 'No';
      } else {
        row[VENUE_CSV_HEADERS[col]] = value ?? '';
      }
    });
    return row;
  });

  return Papa.unparse(data, { quotes: true, header: true });
}

/**
 * Download venues CSV
 */
export function downloadVenuesCSV(venues, filename = 'lumberjack-venues.csv') {
  const csv = exportVenuesToCSV(venues);
  downloadCSVFile(csv, filename);
}

/**
 * Parse venues CSV
 */
export function parseVenuesCSV(csvString) {
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
          const venues = results.data.map((row, index) => mapRowToVenue(row, index));
          resolve(venues);
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => reject(new Error(`CSV parsing error: ${error.message}`))
    });
  });
}

function mapRowToVenue(row, index) {
  const normalizedRow = {};
  Object.entries(row).forEach(([key, value]) => {
    const fieldName = VENUE_HEADER_TO_FIELD[key.toLowerCase().trim()] || key;
    normalizedRow[fieldName] = value;
  });

  const id = normalizedRow.id?.trim() || `venue-import-${Date.now()}-${index}`;
  const name = normalizedRow.name?.trim();

  if (!name) {
    throw new Error(`Row ${index + 2}: Venue Name is required`);
  }

  const city = normalizedRow.city?.trim();
  if (!city) {
    throw new Error(`Row ${index + 2}: City is required`);
  }

  const state = normalizedRow.state?.trim();
  if (!state) {
    throw new Error(`Row ${index + 2}: State is required`);
  }

  // Parse isActive - accept Yes/No, true/false, 1/0
  let isActive = true;
  const activeValue = normalizedRow.isActive?.toString().toLowerCase().trim();
  if (activeValue === 'no' || activeValue === 'false' || activeValue === '0') {
    isActive = false;
  }

  return {
    id,
    name,
    address: normalizedRow.address?.trim() || '',
    city,
    state,
    zip: normalizedRow.zip?.trim() || '',
    latitude: parseFloat(normalizedRow.latitude) || 0,
    longitude: parseFloat(normalizedRow.longitude) || 0,
    venueType: normalizedRow.venueType?.trim() || 'other',
    capacity: parseInt(normalizedRow.capacity) || 0,
    indoorOutdoor: normalizedRow.indoorOutdoor?.trim() || 'outdoor',
    website: normalizedRow.website?.trim() || '',
    isActive,
    notes: normalizedRow.notes?.trim() || ''
  };
}

/**
 * Validate imported venues
 */
export function validateVenueImport(venues, existingVenues) {
  const existingIds = new Set(existingVenues.map(v => v.id));
  const newVenues = [];
  const updatedVenues = [];
  const errors = [];

  venues.forEach((venue, index) => {
    const duplicateInImport = venues.findIndex((v, i) => i !== index && v.id === venue.id);
    if (duplicateInImport !== -1 && duplicateInImport < index) {
      errors.push(`Row ${index + 2}: Duplicate ID "${venue.id}" in import file`);
      return;
    }

    if (existingIds.has(venue.id)) {
      updatedVenues.push(venue);
    } else {
      newVenues.push(venue);
    }
  });

  return {
    valid: errors.length === 0,
    newVenues,
    updatedVenues,
    errors,
    summary: `${newVenues.length} new, ${updatedVenues.length} updated`
  };
}


// ========== CONTACTS CSV ==========

export const CONTACT_CSV_COLUMNS = [
  'id',
  'venueId',
  'venueName',  // Reference only - for readability
  'firstName',
  'lastName',
  'role',
  'phone',
  'email',
  'isPrimary',
  'relationshipStrength',
  'followUpDate',
  'notes'
];

export const CONTACT_CSV_HEADERS = {
  id: 'ID',
  venueId: 'Venue ID',
  venueName: 'Venue Name',
  firstName: 'First Name',
  lastName: 'Last Name',
  role: 'Role',
  phone: 'Phone',
  email: 'Email',
  isPrimary: 'Primary Contact',
  relationshipStrength: 'Relationship',
  followUpDate: 'Follow-Up Date',
  notes: 'Notes'
};

const CONTACT_HEADER_TO_FIELD = Object.fromEntries(
  Object.entries(CONTACT_CSV_HEADERS).map(([field, header]) => [header.toLowerCase(), field])
);

/**
 * Export contacts to CSV string
 * @param {Array} contacts - Contact array
 * @param {Array} venues - Venue array (for venueName lookup)
 */
export function exportContactsToCSV(contacts, venues) {
  const venueMap = new Map(venues.map(v => [v.id, v.name]));

  const data = contacts.map(contact => {
    const row = {};
    CONTACT_CSV_COLUMNS.forEach(col => {
      if (col === 'venueName') {
        // Lookup venue name for reference
        row[CONTACT_CSV_HEADERS[col]] = contact.venueId ? (venueMap.get(contact.venueId) || '') : '';
      } else if (col === 'isPrimary') {
        row[CONTACT_CSV_HEADERS[col]] = contact[col] ? 'Yes' : 'No';
      } else {
        row[CONTACT_CSV_HEADERS[col]] = contact[col] ?? '';
      }
    });
    return row;
  });

  return Papa.unparse(data, { quotes: true, header: true });
}

/**
 * Download contacts CSV
 */
export function downloadContactsCSV(contacts, venues, filename = 'lumberjack-contacts.csv') {
  const csv = exportContactsToCSV(contacts, venues);
  downloadCSVFile(csv, filename);
}

/**
 * Parse contacts CSV
 */
export function parseContactsCSV(csvString) {
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
          const contacts = results.data.map((row, index) => mapRowToContact(row, index));
          resolve(contacts);
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => reject(new Error(`CSV parsing error: ${error.message}`))
    });
  });
}

function mapRowToContact(row, index) {
  const normalizedRow = {};
  Object.entries(row).forEach(([key, value]) => {
    const fieldName = CONTACT_HEADER_TO_FIELD[key.toLowerCase().trim()] || key;
    normalizedRow[fieldName] = value;
  });

  const id = normalizedRow.id?.trim() || `contact-import-${Date.now()}-${index}`;

  const firstName = normalizedRow.firstName?.trim();
  if (!firstName) {
    throw new Error(`Row ${index + 2}: First Name is required`);
  }

  const lastName = normalizedRow.lastName?.trim();
  if (!lastName) {
    throw new Error(`Row ${index + 2}: Last Name is required`);
  }

  // Parse isPrimary
  let isPrimary = false;
  const primaryValue = normalizedRow.isPrimary?.toString().toLowerCase().trim();
  if (primaryValue === 'yes' || primaryValue === 'true' || primaryValue === '1') {
    isPrimary = true;
  }

  // Handle venueId - allow null/empty for independent contacts
  let venueId = normalizedRow.venueId?.trim() || null;
  if (venueId === '' || venueId === 'null' || venueId === 'NULL') {
    venueId = null;
  }

  // Validate relationshipStrength
  const validStrengths = ['locked_in', 'good', 'neutral', 'needs_work', 'new'];
  let relationshipStrength = normalizedRow.relationshipStrength?.trim() || 'neutral';
  if (!validStrengths.includes(relationshipStrength)) {
    // Try to match partial strings
    const lower = relationshipStrength.toLowerCase();
    if (lower.includes('lock')) relationshipStrength = 'locked_in';
    else if (lower.includes('good')) relationshipStrength = 'good';
    else if (lower.includes('need')) relationshipStrength = 'needs_work';
    else if (lower.includes('new')) relationshipStrength = 'new';
    else relationshipStrength = 'neutral';
  }

  return {
    id,
    venueId,
    firstName,
    lastName,
    role: normalizedRow.role?.trim() || '',
    phone: normalizedRow.phone?.trim() || '',
    email: normalizedRow.email?.trim() || '',
    isPrimary,
    relationshipStrength,
    followUpDate: normalizedRow.followUpDate?.trim() || null,
    notes: normalizedRow.notes?.trim() || ''
  };
}

/**
 * Validate imported contacts
 */
export function validateContactImport(contacts, existingContacts) {
  const existingIds = new Set(existingContacts.map(c => c.id));
  const newContacts = [];
  const updatedContacts = [];
  const errors = [];

  contacts.forEach((contact, index) => {
    const duplicateInImport = contacts.findIndex((c, i) => i !== index && c.id === contact.id);
    if (duplicateInImport !== -1 && duplicateInImport < index) {
      errors.push(`Row ${index + 2}: Duplicate ID "${contact.id}" in import file`);
      return;
    }

    if (existingIds.has(contact.id)) {
      updatedContacts.push(contact);
    } else {
      newContacts.push(contact);
    }
  });

  return {
    valid: errors.length === 0,
    newContacts,
    updatedContacts,
    errors,
    summary: `${newContacts.length} new, ${updatedContacts.length} updated`
  };
}

/**
 * Import contacts from file
 */
export function importContactsFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      reject(new Error('Please select a CSV file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const contacts = await parseContactsCSV(e.target.result);
        resolve(contacts);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Import venues from file
 */
export function importVenuesFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      reject(new Error('Please select a CSV file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const venues = await parseVenuesCSV(e.target.result);
        resolve(venues);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}


// ========== SHARED UTILITIES ==========

function downloadCSVFile(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
