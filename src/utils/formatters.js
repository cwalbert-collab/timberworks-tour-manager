/**
 * Common formatting utilities
 */

/**
 * Format a number as currency (USD)
 * @param {number} amount - The amount to format
 * @param {boolean} showCents - Whether to show cents (default: false)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, showCents = false) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0';
  }

  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  };

  return amount.toLocaleString('en-US', options);
}

/**
 * Format a number with commas
 * @param {number} value - The number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(value) {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString();
}

/**
 * Format a phone number
 * @param {string} phone - Phone number string
 * @returns {string} - Formatted phone number
 */
export function formatPhone(phone) {
  if (!phone) return '';

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Return original if can't format
  return phone;
}

/**
 * Format a date range
 * @param {string} startDate - Start date string (YYYY-MM-DD)
 * @param {string} endDate - End date string (YYYY-MM-DD)
 * @returns {string} - Formatted date range
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate) return 'No date';

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const start = new Date(startDate + 'T00:00:00');

  if (!endDate || startDate === endDate) {
    return start.toLocaleDateString('en-US', options);
  }

  const end = new Date(endDate + 'T00:00:00');

  // Same month and year
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
  }

  // Same year
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', options)}`;
  }

  // Different years
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

/**
 * Format a venue type for display (capitalize first letter)
 * @param {string} type - Venue type string
 * @returns {string} - Formatted venue type
 */
export function formatVenueType(type) {
  if (!type) return 'Unknown';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get initials from a name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} - Initials (e.g., "JS")
 */
export function getInitials(firstName, lastName) {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last;
}
