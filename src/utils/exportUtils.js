/**
 * CSV Export Utilities
 * Converts data to CSV format optimized for Excel pivot tables
 */

// Escape CSV values (handle commas, quotes, newlines)
const escapeCSV = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Convert array of objects to CSV string
const arrayToCSV = (data, columns) => {
  if (!data || data.length === 0) return '';

  // Header row
  const headers = columns.map(col => escapeCSV(col.label)).join(',');

  // Data rows
  const rows = data.map(row => {
    return columns.map(col => {
      let value = col.getValue ? col.getValue(row) : row[col.key];
      return escapeCSV(value);
    }).join(',');
  });

  return [headers, ...rows].join('\r\n');
};

// Trigger file download
const downloadCSV = (csvContent, filename) => {
  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================
// SHOWS EXPORT
// ============================================
export const exportShows = (shows, venues = [], contacts = []) => {
  const venueMap = new Map(venues.map(v => [v.id, v]));
  const contactMap = new Map(contacts.map(c => [c.id, c]));

  const columns = [
    { key: 'id', label: 'Show ID' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'showTime', label: 'Show Time' },
    { key: 'tour', label: 'Team' },
    { label: 'Venue Name', getValue: (row) => venueMap.get(row.venueId)?.name || row.venueName || '' },
    { label: 'Venue Type', getValue: (row) => venueMap.get(row.venueId)?.venueType || '' },
    { label: 'Address', getValue: (row) => venueMap.get(row.venueId)?.address || row.address || '' },
    { label: 'City', getValue: (row) => venueMap.get(row.venueId)?.city || row.city || '' },
    { label: 'State', getValue: (row) => venueMap.get(row.venueId)?.state || row.state || '' },
    { label: 'Zip', getValue: (row) => venueMap.get(row.venueId)?.zip || row.zip || '' },
    { label: 'Capacity', getValue: (row) => venueMap.get(row.venueId)?.capacity || '' },
    { label: 'Latitude', getValue: (row) => row.latitude || venueMap.get(row.venueId)?.latitude || '' },
    { label: 'Longitude', getValue: (row) => row.longitude || venueMap.get(row.venueId)?.longitude || '' },
    { key: 'performanceFee', label: 'Performance Fee' },
    { key: 'merchandiseSales', label: 'Merch Sales' },
    { key: 'materialsUsed', label: 'Materials Used' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'profit', label: 'Profit' },
    { label: 'Contact Name', getValue: (row) => {
      const c = contactMap.get(row.contactId);
      return c ? `${c.firstName} ${c.lastName}` : '';
    }},
    { label: 'Contact Email', getValue: (row) => contactMap.get(row.contactId)?.email || '' },
    { label: 'Contact Phone', getValue: (row) => contactMap.get(row.contactId)?.phone || '' },
    { key: 'notes', label: 'Notes' }
  ];

  const csv = arrayToCSV(shows, columns);
  downloadCSV(csv, 'lumberjack-shows');
};

// ============================================
// VENUES EXPORT
// ============================================
export const exportVenues = (venues, contacts = []) => {
  // Count contacts per venue
  const contactCounts = venues.reduce((acc, v) => {
    acc[v.id] = contacts.filter(c => c.venueId === v.id).length;
    return acc;
  }, {});

  const columns = [
    { key: 'id', label: 'Venue ID' },
    { key: 'name', label: 'Venue Name' },
    { key: 'venueType', label: 'Venue Type' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zip', label: 'Zip' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'indoorOutdoor', label: 'Indoor/Outdoor' },
    { key: 'website', label: 'Website' },
    { key: 'latitude', label: 'Latitude' },
    { key: 'longitude', label: 'Longitude' },
    { key: 'isActive', label: 'Active' },
    { label: 'Contact Count', getValue: (row) => contactCounts[row.id] || 0 },
    { key: 'notes', label: 'Notes' }
  ];

  const csv = arrayToCSV(venues, columns);
  downloadCSV(csv, 'lumberjack-venues');
};

// ============================================
// CONTACTS EXPORT
// ============================================
export const exportContacts = (contacts, venues = []) => {
  const venueMap = new Map(venues.map(v => [v.id, v]));

  const columns = [
    { key: 'id', label: 'Contact ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
    { key: 'isPrimary', label: 'Is Primary' },
    { key: 'relationshipStrength', label: 'Relationship Strength' },
    { key: 'followUpDate', label: 'Follow-Up Date' },
    { label: 'Venue Name', getValue: (row) => venueMap.get(row.venueId)?.name || 'Independent' },
    { label: 'Venue City', getValue: (row) => venueMap.get(row.venueId)?.city || '' },
    { label: 'Venue State', getValue: (row) => venueMap.get(row.venueId)?.state || '' },
    { key: 'notes', label: 'Notes' }
  ];

  const csv = arrayToCSV(contacts, columns);
  downloadCSV(csv, 'lumberjack-contacts');
};

// ============================================
// SHOW REVENUE EXPORT
// ============================================
export const exportShowRevenue = (shows, getShowRevenueBreakdown, getShowPayment, venues = []) => {
  const venueMap = new Map(venues.map(v => [v.id, v]));

  const data = shows.map(show => {
    const breakdown = getShowRevenueBreakdown ? getShowRevenueBreakdown(show.id) : {};
    const payment = getShowPayment ? getShowPayment(show.id) : null;

    return {
      ...show,
      breakdown,
      payment,
      venueName: venueMap.get(show.venueId)?.name || show.venueName || '',
      venueCity: venueMap.get(show.venueId)?.city || show.city || '',
      venueState: venueMap.get(show.venueId)?.state || show.state || ''
    };
  });

  const columns = [
    { key: 'id', label: 'Show ID' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'tour', label: 'Team' },
    { key: 'venueName', label: 'Venue' },
    { key: 'venueCity', label: 'City' },
    { key: 'venueState', label: 'State' },
    { label: 'Performance Fee', getValue: (row) => row.breakdown?.performanceFee || 0 },
    { label: 'Merch Sales', getValue: (row) => row.breakdown?.merchandise || 0 },
    { label: 'Materials', getValue: (row) => row.breakdown?.materials || 0 },
    { label: 'Expenses', getValue: (row) => row.breakdown?.expenses || 0 },
    { label: 'Net Revenue', getValue: (row) => row.breakdown?.total || 0 },
    { label: 'Payment Status', getValue: (row) => row.payment?.status || 'pending' },
    { label: 'Expected Amount', getValue: (row) => row.payment?.expectedAmount || 0 },
    { label: 'Received Amount', getValue: (row) => row.payment?.receivedAmount || 0 },
    { label: 'Due Date', getValue: (row) => row.payment?.dueDate || '' },
    { label: 'Paid Date', getValue: (row) => row.payment?.paidDate || '' }
  ];

  const csv = arrayToCSV(data, columns);
  downloadCSV(csv, 'lumberjack-show-revenue');
};

// ============================================
// INVENTORY EXPORT
// ============================================
export const exportInventory = (inventory) => {
  const columns = [
    { key: 'id', label: 'Item ID' },
    { key: 'name', label: 'Item Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    { key: 'quantityInStock', label: 'Quantity In Stock' },
    { key: 'lowStockThreshold', label: 'Low Stock Threshold' },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'unitCost', label: 'Unit Cost' },
    { label: 'Margin %', getValue: (row) => row.unitPrice > 0 ? ((row.unitPrice - row.unitCost) / row.unitPrice * 100).toFixed(1) : 0 },
    { label: 'Stock Value', getValue: (row) => (row.quantityInStock * row.unitCost).toFixed(2) },
    { label: 'Potential Revenue', getValue: (row) => (row.quantityInStock * row.unitPrice).toFixed(2) },
    { key: 'isActive', label: 'Active' }
  ];

  const csv = arrayToCSV(inventory, columns);
  downloadCSV(csv, 'lumberjack-inventory');
};

// ============================================
// PAYMENTS EXPORT
// ============================================
export const exportPayments = (payments, shows = []) => {
  const showMap = new Map(shows.map(s => [s.id, s]));

  const data = payments.map(payment => {
    const show = showMap.get(payment.showId);
    return {
      ...payment,
      showVenue: show?.venueName || 'Unknown',
      showDate: show?.startDate || '',
      showTeam: show?.tour || ''
    };
  });

  const columns = [
    { key: 'id', label: 'Payment ID' },
    { key: 'showId', label: 'Show ID' },
    { key: 'showVenue', label: 'Venue' },
    { key: 'showDate', label: 'Show Date' },
    { key: 'showTeam', label: 'Team' },
    { key: 'status', label: 'Status' },
    { key: 'expectedAmount', label: 'Expected Amount' },
    { key: 'receivedAmount', label: 'Received Amount' },
    { label: 'Balance', getValue: (row) => (row.expectedAmount || 0) - (row.receivedAmount || 0) },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'paidDate', label: 'Paid Date' },
    { key: 'invoiceNumber', label: 'Invoice Number' }
  ];

  const csv = arrayToCSV(data, columns);
  downloadCSV(csv, 'lumberjack-payments');
};

// ============================================
// TRANSACTIONS EXPORT
// ============================================
export const exportTransactions = (transactions, shows = []) => {
  const showMap = new Map(shows.map(s => [s.id, s]));

  const data = transactions.map(tx => ({
    ...tx,
    showVenue: tx.showId ? (showMap.get(tx.showId)?.venueName || 'Unknown') : 'N/A'
  }));

  const columns = [
    { key: 'id', label: 'Transaction ID' },
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'showId', label: 'Show ID' },
    { key: 'showVenue', label: 'Show Venue' },
    { key: 'notes', label: 'Notes' }
  ];

  const csv = arrayToCSV(data, columns);
  downloadCSV(csv, 'lumberjack-transactions');
};

// ============================================
// DASHBOARD SUMMARY EXPORT
// ============================================
export const exportDashboardSummary = (shows, venues, contacts) => {
  // Calculate metrics
  const totalShows = shows.length;
  const totalRevenue = shows.reduce((sum, s) => sum + (s.performanceFee || 0) + (s.merchandiseSales || 0), 0);
  const totalExpenses = shows.reduce((sum, s) => sum + (s.materialsUsed || 0) + (s.expenses || 0), 0);
  const totalProfit = shows.reduce((sum, s) => sum + (s.profit || 0), 0);

  const redTeamShows = shows.filter(s => s.tour === 'Red Team');
  const blueTeamShows = shows.filter(s => s.tour === 'Blue Team');

  const summaryData = [
    { metric: 'Total Shows', value: totalShows },
    { metric: 'Total Revenue', value: totalRevenue },
    { metric: 'Total Expenses', value: totalExpenses },
    { metric: 'Total Profit', value: totalProfit },
    { metric: 'Average Profit per Show', value: totalShows > 0 ? (totalProfit / totalShows).toFixed(2) : 0 },
    { metric: 'Red Team Shows', value: redTeamShows.length },
    { metric: 'Red Team Revenue', value: redTeamShows.reduce((sum, s) => sum + (s.performanceFee || 0) + (s.merchandiseSales || 0), 0) },
    { metric: 'Red Team Profit', value: redTeamShows.reduce((sum, s) => sum + (s.profit || 0), 0) },
    { metric: 'Blue Team Shows', value: blueTeamShows.length },
    { metric: 'Blue Team Revenue', value: blueTeamShows.reduce((sum, s) => sum + (s.performanceFee || 0) + (s.merchandiseSales || 0), 0) },
    { metric: 'Blue Team Profit', value: blueTeamShows.reduce((sum, s) => sum + (s.profit || 0), 0) },
    { metric: 'Total Venues', value: venues.length },
    { metric: 'Active Venues', value: venues.filter(v => v.isActive).length },
    { metric: 'Total Contacts', value: contacts.length },
    { metric: 'States Covered', value: new Set(venues.map(v => v.state)).size }
  ];

  const columns = [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Value' }
  ];

  const csv = arrayToCSV(summaryData, columns);
  downloadCSV(csv, 'lumberjack-dashboard-summary');
};

// ============================================
// ACTIVITIES EXPORT
// ============================================
export const exportActivities = (activities, venues = [], contacts = []) => {
  const venueMap = new Map(venues.map(v => [v.id, v]));
  const contactMap = new Map(contacts.map(c => [c.id, c]));

  const data = activities.map(activity => {
    let entityName = '';
    if (activity.entityType === 'venue') {
      entityName = venueMap.get(activity.entityId)?.name || 'Unknown Venue';
    } else if (activity.entityType === 'contact') {
      const contact = contactMap.get(activity.entityId);
      entityName = contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
    }
    return { ...activity, entityName };
  });

  const columns = [
    { key: 'id', label: 'Activity ID' },
    { key: 'createdAt', label: 'Date/Time' },
    { key: 'entityType', label: 'Entity Type' },
    { key: 'entityId', label: 'Entity ID' },
    { key: 'entityName', label: 'Entity Name' },
    { key: 'type', label: 'Activity Type' },
    { key: 'content', label: 'Content' }
  ];

  const csv = arrayToCSV(data, columns);
  downloadCSV(csv, 'lumberjack-activities');
};
