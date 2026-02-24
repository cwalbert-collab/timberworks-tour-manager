import Papa from 'papaparse';

// Define the stable column order for CSV export/import
// This ensures backwards/forwards compatibility with Excel/Sheets
export const CSV_COLUMNS = [
  'id',
  'tour',
  'status',
  'venueName',
  'address',
  'city',
  'state',
  'zip',
  'latitude',
  'longitude',
  'startDate',
  'endDate',
  'showTime',
  'performanceFee',
  'merchandiseSales',
  'materialsUsed',
  'expenses',
  'dayRateCount',
  'mileage',
  'contactName',
  'contactPhone',
  'contactEmail',
  'notes'
];

// Human-readable column headers for CSV
export const CSV_HEADERS = {
  id: 'ID',
  tour: 'Tour',
  status: 'Status',
  venueName: 'Venue Name',
  address: 'Address',
  city: 'City',
  state: 'State',
  zip: 'ZIP',
  latitude: 'Latitude',
  longitude: 'Longitude',
  startDate: 'Start Date',
  endDate: 'End Date',
  showTime: 'Show Time',
  performanceFee: 'Performance Fee',
  merchandiseSales: 'Merchandise Sales',
  materialsUsed: 'Materials Used',
  expenses: 'Expenses',
  dayRateCount: 'Day Raters',
  mileage: 'Mileage (RT)',
  contactName: 'Contact Name',
  contactPhone: 'Contact Phone',
  contactEmail: 'Contact Email',
  notes: 'Notes'
};

// Reverse mapping from header to field name
const HEADER_TO_FIELD = Object.fromEntries(
  Object.entries(CSV_HEADERS).map(([field, header]) => [header.toLowerCase(), field])
);

/**
 * Export shows to CSV string
 */
export function exportToCSV(shows) {
  // Prepare data with human-readable headers
  const data = shows.map(show => {
    const row = {};
    CSV_COLUMNS.forEach(col => {
      row[CSV_HEADERS[col]] = show[col] ?? '';
    });
    return row;
  });

  return Papa.unparse(data, {
    quotes: true, // Quote all fields for safety
    header: true
  });
}

/**
 * Download CSV as a file
 */
export function downloadCSV(shows, filename = 'lumberjack-tours.csv') {
  const csv = exportToCSV(shows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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

/**
 * Parse CSV string to shows array
 */
export function parseCSV(csvString) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          // Filter out minor errors
          const criticalErrors = results.errors.filter(e => e.type === 'FieldMismatch');
          if (criticalErrors.length > 0) {
            reject(new Error(`CSV parsing error: ${criticalErrors[0].message}`));
            return;
          }
        }

        try {
          const shows = results.data.map((row, index) => mapRowToShow(row, index));
          resolve(shows);
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
 * Map a CSV row to a show object
 */
function mapRowToShow(row, index) {
  // Normalize headers (case-insensitive matching)
  const normalizedRow = {};
  Object.entries(row).forEach(([key, value]) => {
    const fieldName = HEADER_TO_FIELD[key.toLowerCase().trim()] || key;
    normalizedRow[fieldName] = value;
  });

  // Generate ID if not present
  const id = normalizedRow.id?.trim() || `import-${Date.now()}-${index}`;

  // Validate required fields
  const venueName = normalizedRow.venueName?.trim();
  if (!venueName) {
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

  // Parse and validate tour
  let tour = normalizedRow.tour?.trim() || 'Red Team';
  if (tour !== 'Red Team' && tour !== 'Blue Team') {
    // Try to match partial strings
    if (tour.toLowerCase().includes('red')) {
      tour = 'Red Team';
    } else if (tour.toLowerCase().includes('blue')) {
      tour = 'Blue Team';
    } else {
      tour = 'Red Team'; // Default
    }
  }

  // Parse and validate status
  let status = normalizedRow.status?.trim()?.toLowerCase() || 'confirmed';
  if (!['completed', 'confirmed', 'tentative'].includes(status)) {
    status = 'confirmed'; // Default to confirmed
  }

  // Handle dates - support both old showDate and new startDate/endDate
  const startDate = normalizedRow.startDate?.trim() || normalizedRow.showDate?.trim() || '';
  const endDate = normalizedRow.endDate?.trim() || startDate; // Default endDate to startDate

  return {
    id,
    tour,
    status,
    venueName,
    address: normalizedRow.address?.trim() || '',
    city,
    state,
    zip: normalizedRow.zip?.trim() || '',
    latitude: parseFloat(normalizedRow.latitude) || 0,
    longitude: parseFloat(normalizedRow.longitude) || 0,
    startDate,
    endDate,
    showTime: normalizedRow.showTime?.trim() || '',
    performanceFee: parseFloat(normalizedRow.performanceFee) || 0,
    merchandiseSales: parseFloat(normalizedRow.merchandiseSales) || 0,
    materialsUsed: parseFloat(normalizedRow.materialsUsed) || 0,
    expenses: parseFloat(normalizedRow.expenses) || 0,
    dayRateCount: parseInt(normalizedRow.dayRateCount) || 0,
    mileage: parseInt(normalizedRow.mileage) || 0,
    contactName: normalizedRow.contactName?.trim() || '',
    contactPhone: normalizedRow.contactPhone?.trim() || '',
    contactEmail: normalizedRow.contactEmail?.trim() || '',
    notes: normalizedRow.notes?.trim() || ''
  };
}

/**
 * Read a File object and parse as CSV
 */
export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      reject(new Error('Please select a CSV file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const shows = await parseCSV(e.target.result);
        resolve(shows);
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
 * Validate imported shows and return validation result
 */
export function validateImport(shows, existingShows) {
  const existingIds = new Set(existingShows.map(s => s.id));
  const newShows = [];
  const updatedShows = [];
  const errors = [];

  shows.forEach((show, index) => {
    // Check for duplicate IDs within import
    const duplicateInImport = shows.findIndex((s, i) => i !== index && s.id === show.id);
    if (duplicateInImport !== -1 && duplicateInImport < index) {
      errors.push(`Row ${index + 2}: Duplicate ID "${show.id}" in import file`);
      return;
    }

    if (existingIds.has(show.id)) {
      updatedShows.push(show);
    } else {
      newShows.push(show);
    }
  });

  return {
    valid: errors.length === 0,
    newShows,
    updatedShows,
    errors,
    summary: `${newShows.length} new, ${updatedShows.length} updated`
  };
}
