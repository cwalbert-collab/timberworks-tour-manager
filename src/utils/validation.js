// Validation utilities for Timberworks Tour Manager

/**
 * Validate a show object
 * @param {Object} show - The show to validate
 * @param {Array} existingShows - Array of existing shows (for duplicate checking)
 * @param {string} editingId - ID of show being edited (to exclude from duplicate check)
 * @returns {Object} { isValid: boolean, errors: { field: message } }
 */
export function validateShow(show, existingShows = [], editingId = null) {
  const errors = {};

  // Required fields
  if (!show.venueId && !show.venueName) {
    errors.venue = 'Please select or enter a venue';
  }

  if (!show.startDate) {
    errors.startDate = 'Start date is required';
  }

  // Date validation
  if (show.startDate && show.endDate) {
    const start = new Date(show.startDate);
    const end = new Date(show.endDate);
    if (end < start) {
      errors.endDate = 'End date cannot be before start date';
    }
  }

  // Numeric validation
  if (show.performanceFee !== undefined && show.performanceFee < 0) {
    errors.performanceFee = 'Performance fee cannot be negative';
  }

  if (show.merchandiseSales !== undefined && show.merchandiseSales < 0) {
    errors.merchandiseSales = 'Merchandise sales cannot be negative';
  }

  if (show.materialsUsed !== undefined && show.materialsUsed < 0) {
    errors.materialsUsed = 'Materials used cannot be negative';
  }

  if (show.expenses !== undefined && show.expenses < 0) {
    errors.expenses = 'Expenses cannot be negative';
  }

  // Duplicate show check (same venue + overlapping dates)
  if (show.venueId && show.startDate) {
    const duplicate = existingShows.find(existing => {
      if (editingId && existing.id === editingId) return false;
      if (existing.venueId !== show.venueId) return false;

      const existStart = new Date(existing.startDate);
      const existEnd = new Date(existing.endDate || existing.startDate);
      const newStart = new Date(show.startDate);
      const newEnd = new Date(show.endDate || show.startDate);

      // Check for date overlap
      return newStart <= existEnd && newEnd >= existStart;
    });

    if (duplicate) {
      errors.duplicate = 'A show already exists at this venue during these dates';
    }
  }

  // Tour selection
  if (!show.tour) {
    errors.tour = 'Please select a tour team';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate a venue object
 * @param {Object} venue - The venue to validate
 * @param {Array} existingVenues - Array of existing venues
 * @param {string} editingId - ID of venue being edited
 * @returns {Object} { isValid: boolean, errors: { field: message } }
 */
export function validateVenue(venue, existingVenues = [], editingId = null) {
  const errors = {};

  if (!venue.name?.trim()) {
    errors.name = 'Venue name is required';
  }

  if (!venue.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!venue.state?.trim()) {
    errors.state = 'State is required';
  }

  // Check for duplicate venue name in same city
  if (venue.name && venue.city) {
    const duplicate = existingVenues.find(existing => {
      if (editingId && existing.id === editingId) return false;
      return (
        existing.name.toLowerCase() === venue.name.toLowerCase() &&
        existing.city.toLowerCase() === venue.city.toLowerCase()
      );
    });

    if (duplicate) {
      errors.duplicate = 'A venue with this name already exists in this city';
    }
  }

  // Validate coordinates if provided
  if (venue.latitude !== undefined && venue.latitude !== '') {
    const lat = parseFloat(venue.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitude must be between -90 and 90';
    }
  }

  if (venue.longitude !== undefined && venue.longitude !== '') {
    const lng = parseFloat(venue.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = 'Longitude must be between -180 and 180';
    }
  }

  // Validate capacity if provided
  if (venue.capacity !== undefined && venue.capacity !== '') {
    const cap = parseInt(venue.capacity);
    if (isNaN(cap) || cap < 0) {
      errors.capacity = 'Capacity must be a positive number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate a contact object
 * @param {Object} contact - The contact to validate
 * @param {Array} existingContacts - Array of existing contacts
 * @param {string} editingId - ID of contact being edited
 * @returns {Object} { isValid: boolean, errors: { field: message } }
 */
export function validateContact(contact, existingContacts = [], editingId = null) {
  const errors = {};

  if (!contact.name?.trim()) {
    errors.name = 'Contact name is required';
  }

  // Email validation
  if (contact.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Phone validation (basic - allows various formats)
  if (contact.phone) {
    const cleanPhone = contact.phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleanPhone.length < 10 || !/^\+?[\d]+$/.test(cleanPhone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  // Check for duplicate contact (same name + email)
  if (contact.name && contact.email) {
    const duplicate = existingContacts.find(existing => {
      if (editingId && existing.id === editingId) return false;
      return (
        existing.name.toLowerCase() === contact.name.toLowerCase() &&
        existing.email?.toLowerCase() === contact.email.toLowerCase()
      );
    });

    if (duplicate) {
      errors.duplicate = 'A contact with this name and email already exists';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate an employee object
 * @param {Object} employee - The employee to validate
 * @param {Array} existingEmployees - Array of existing employees
 * @param {string} editingId - ID of employee being edited
 * @returns {Object} { isValid: boolean, errors: { field: message } }
 */
export function validateEmployee(employee, existingEmployees = [], editingId = null) {
  const errors = {};

  if (!employee.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!employee.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!employee.role?.trim()) {
    errors.role = 'Role is required';
  }

  // Email validation
  if (employee.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Pay rate validation
  if (employee.payRate !== undefined && employee.payRate < 0) {
    errors.payRate = 'Pay rate cannot be negative';
  }

  // Check for duplicate employee (same name)
  if (employee.firstName && employee.lastName) {
    const duplicate = existingEmployees.find(existing => {
      if (editingId && existing.id === editingId) return false;
      return (
        existing.firstName.toLowerCase() === employee.firstName.toLowerCase() &&
        existing.lastName.toLowerCase() === employee.lastName.toLowerCase()
      );
    });

    if (duplicate) {
      errors.duplicate = 'An employee with this name already exists';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate a transaction object
 * @param {Object} transaction - The transaction to validate
 * @returns {Object} { isValid: boolean, errors: { field: message } }
 */
export function validateTransaction(transaction) {
  const errors = {};

  if (!transaction.type) {
    errors.type = 'Transaction type is required';
  }

  if (!transaction.date) {
    errors.date = 'Date is required';
  }

  if (transaction.amount === undefined || transaction.amount === '') {
    errors.amount = 'Amount is required';
  } else if (isNaN(parseFloat(transaction.amount))) {
    errors.amount = 'Amount must be a number';
  }

  if (!transaction.description?.trim()) {
    errors.description = 'Description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Format validation errors for display
 * @param {Object} errors - Errors object from validation
 * @returns {string} Formatted error message
 */
export function formatValidationErrors(errors) {
  return Object.values(errors).join('. ');
}

/**
 * Check if a date is in the past
 * @param {string} dateStr - Date string
 * @returns {boolean}
 */
export function isDateInPast(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is in the future
 * @param {string} dateStr - Date string
 * @returns {boolean}
 */
export function isDateInFuture(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}
