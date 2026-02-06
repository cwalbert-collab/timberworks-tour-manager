import { StyleSheet } from '@react-pdf/renderer';

// Timberworks brand colors
export const COLORS = {
  primary: '#2e7d32',      // Forest green
  secondary: '#1565c0',    // Blue
  accent: '#8b4513',       // Saddle brown (wood)
  text: '#333333',
  textLight: '#666666',
  border: '#dddddd',
  background: '#f5f5f5',
  white: '#ffffff',
  red: '#c62828',
  warning: '#f57c00'
};

export const COMPANY = {
  name: 'Timberworks Lumberjack Shows',
  tagline: 'Professional Lumberjack Entertainment',
  address: '123 Timber Lane',
  city: 'Hayward',
  state: 'WI',
  zip: '54843',
  phone: '(715) 555-LOGS',
  email: 'bookings@timberworks.show',
  website: 'www.timberworks.show'
};

// Shared styles for all PDF documents
export const baseStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: COLORS.text
  },

  // Header section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary
  },
  logo: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary
  },
  tagline: {
    fontSize: 9,
    color: COLORS.textLight,
    marginTop: 2
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
    color: COLORS.textLight
  },

  // Document title
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 20
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginBottom: 10
  },

  // Sections
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },

  // Tables
  table: {
    width: '100%',
    marginBottom: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    padding: 8,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: 8,
    fontSize: 9
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: 8,
    fontSize: 9,
    backgroundColor: COLORS.background
  },

  // Text styles
  text: {
    fontSize: 10,
    marginBottom: 4
  },
  textBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4
  },
  textSmall: {
    fontSize: 8,
    color: COLORS.textLight
  },
  textLarge: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold'
  },

  // Layout helpers
  row: {
    flexDirection: 'row',
    marginBottom: 4
  },
  col: {
    flex: 1
  },
  col2: {
    flex: 2
  },
  col3: {
    flex: 3
  },

  // Cards/boxes
  box: {
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    marginBottom: 10
  },
  highlightBox: {
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 10
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: COLORS.textLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10
  },

  // Amounts/money
  amount: {
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right'
  },
  amountLarge: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary
  },

  // Status badges
  badge: {
    padding: '2 6',
    borderRadius: 3,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold'
  },
  badgeGreen: {
    backgroundColor: '#e8f5e9',
    color: COLORS.primary
  },
  badgeBlue: {
    backgroundColor: '#e3f2fd',
    color: COLORS.secondary
  },
  badgeRed: {
    backgroundColor: '#ffebee',
    color: COLORS.red
  }
});

// Helper function to format currency
export const formatCurrency = (amount) => {
  return `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to format dates (adds T12:00:00 to avoid timezone issues)
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  // Add time component if it's just a date string to avoid timezone issues
  const normalizedDate = dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00';
  const date = new Date(normalizedDate);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper to format date range
export const formatDateRange = (start, end) => {
  if (!start) return 'N/A';
  if (!end || start === end) return formatDate(start);

  const startNorm = start.includes('T') ? start : start + 'T12:00:00';
  const endNorm = end.includes('T') ? end : end + 'T12:00:00';
  const startDate = new Date(startNorm);
  const endDate = new Date(endNorm);

  if (isNaN(startDate.getTime())) return 'Invalid date';
  if (isNaN(endDate.getTime())) return formatDate(start);

  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
  }

  return `${formatDate(start)} - ${formatDate(end)}`;
};
