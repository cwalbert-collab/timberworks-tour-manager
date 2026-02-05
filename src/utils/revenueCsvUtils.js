import Papa from 'papaparse';

// ========== TRANSACTIONS CSV ==========

export const TRANSACTION_CSV_COLUMNS = [
  'id',
  'type',
  'showId',
  'date',
  'description',
  'amount',
  'category',
  'paymentMethod',
  'notes'
];

export const TRANSACTION_CSV_HEADERS = {
  id: 'ID',
  type: 'Type',
  showId: 'Show ID',
  date: 'Date',
  description: 'Description',
  amount: 'Amount',
  category: 'Category',
  paymentMethod: 'Payment Method',
  notes: 'Notes'
};

const TRANSACTION_HEADER_TO_FIELD = Object.fromEntries(
  Object.entries(TRANSACTION_CSV_HEADERS).map(([field, header]) => [header.toLowerCase(), field])
);

/**
 * Export transactions to CSV string
 */
export function exportTransactionsToCSV(transactions) {
  const data = transactions.map(txn => {
    const row = {};
    TRANSACTION_CSV_COLUMNS.forEach(col => {
      const value = txn[col];
      if (col === 'showId') {
        row[TRANSACTION_CSV_HEADERS[col]] = value || '';
      } else if (col === 'amount') {
        // Format amount with 2 decimal places
        row[TRANSACTION_CSV_HEADERS[col]] = typeof value === 'number' ? value.toFixed(2) : value;
      } else {
        row[TRANSACTION_CSV_HEADERS[col]] = value ?? '';
      }
    });
    return row;
  });

  return Papa.unparse(data, { quotes: true, header: true });
}

/**
 * Download transactions CSV
 */
export function downloadTransactionsCSV(transactions, filename = 'lumberjack-transactions.csv') {
  const csv = exportTransactionsToCSV(transactions);
  downloadCSVFile(csv, filename);
}

/**
 * Parse transactions CSV
 */
export function parseTransactionsCSV(csvString) {
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
          const transactions = results.data.map((row, index) => mapRowToTransaction(row, index));
          resolve(transactions);
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => reject(new Error(`CSV parsing error: ${error.message}`))
    });
  });
}

function mapRowToTransaction(row, index) {
  const normalizedRow = {};
  Object.entries(row).forEach(([key, value]) => {
    const fieldName = TRANSACTION_HEADER_TO_FIELD[key.toLowerCase().trim()] || key;
    normalizedRow[fieldName] = value;
  });

  const id = normalizedRow.id?.trim() || `txn-import-${Date.now()}-${index}`;

  // Validate type
  const validTypes = ['show_fee', 'merch_sale', 'expense', 'refund'];
  let type = normalizedRow.type?.trim().toLowerCase() || 'expense';
  // Handle common variations
  if (type.includes('fee') || type.includes('performance')) type = 'show_fee';
  else if (type.includes('merch') || type.includes('sale')) type = 'merch_sale';
  else if (type.includes('expense') || type.includes('cost')) type = 'expense';
  else if (type.includes('refund')) type = 'refund';
  if (!validTypes.includes(type)) type = 'expense';

  // Handle showId - allow null for non-show transactions
  let showId = normalizedRow.showId?.trim() || null;
  if (showId === '' || showId === 'null' || showId === 'NULL') {
    showId = null;
  }

  // Parse amount
  let amount = parseFloat(normalizedRow.amount) || 0;
  // Expenses should be negative if not already
  if (type === 'expense' && amount > 0) {
    amount = -amount;
  }

  // Validate category
  const validCategories = ['performance_fee', 'merchandise', 'materials', 'travel', 'other'];
  let category = normalizedRow.category?.trim().toLowerCase() || 'other';
  if (category.includes('performance') || category.includes('fee')) category = 'performance_fee';
  else if (category.includes('merch')) category = 'merchandise';
  else if (category.includes('material')) category = 'materials';
  else if (category.includes('travel')) category = 'travel';
  if (!validCategories.includes(category)) category = 'other';

  // Validate payment method
  const validMethods = ['cash', 'card', 'check', 'invoice', 'online'];
  let paymentMethod = normalizedRow.paymentMethod?.trim().toLowerCase() || 'cash';
  if (!validMethods.includes(paymentMethod)) paymentMethod = 'cash';

  const date = normalizedRow.date?.trim() || new Date().toISOString().split('T')[0];

  return {
    id,
    type,
    showId,
    date,
    description: normalizedRow.description?.trim() || '',
    amount,
    category,
    paymentMethod,
    notes: normalizedRow.notes?.trim() || '',
    createdAt: new Date().toISOString()
  };
}

/**
 * Validate imported transactions
 */
export function validateTransactionImport(transactions, existingTransactions) {
  const existingIds = new Set(existingTransactions.map(t => t.id));
  const newTransactions = [];
  const updatedTransactions = [];
  const errors = [];

  transactions.forEach((txn, index) => {
    const duplicateInImport = transactions.findIndex((t, i) => i !== index && t.id === txn.id);
    if (duplicateInImport !== -1 && duplicateInImport < index) {
      errors.push(`Row ${index + 2}: Duplicate ID "${txn.id}" in import file`);
      return;
    }

    if (existingIds.has(txn.id)) {
      updatedTransactions.push(txn);
    } else {
      newTransactions.push(txn);
    }
  });

  return {
    valid: errors.length === 0,
    newTransactions,
    updatedTransactions,
    errors,
    summary: `${newTransactions.length} new, ${updatedTransactions.length} updated`
  };
}

/**
 * Import transactions from file
 */
export function importTransactionsFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      reject(new Error('Please select a CSV file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const transactions = await parseTransactionsCSV(e.target.result);
        resolve(transactions);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}


// ========== P&L SUMMARY CSV ==========

/**
 * Generate P&L summary from transactions
 * Groups by month and calculates totals
 */
export function generatePLSummary(transactions, shows = []) {
  // Group transactions by month
  const monthlyData = new Map();

  transactions.forEach(txn => {
    if (!txn.date) return;

    // Extract YYYY-MM from date
    const month = txn.date.substring(0, 7);

    if (!monthlyData.has(month)) {
      monthlyData.set(month, {
        period: month,
        showFeeRevenue: 0,
        merchRevenue: 0,
        otherRevenue: 0,
        materialsCost: 0,
        travelCost: 0,
        otherExpenses: 0,
        showCount: 0
      });
    }

    const data = monthlyData.get(month);
    const amount = txn.amount || 0;

    if (amount > 0) {
      // Revenue
      if (txn.type === 'show_fee' || txn.category === 'performance_fee') {
        data.showFeeRevenue += amount;
      } else if (txn.type === 'merch_sale' || txn.category === 'merchandise') {
        data.merchRevenue += amount;
      } else {
        data.otherRevenue += amount;
      }
    } else {
      // Expenses (stored as negative, convert to positive for reporting)
      const expenseAmount = Math.abs(amount);
      if (txn.category === 'materials') {
        data.materialsCost += expenseAmount;
      } else if (txn.category === 'travel') {
        data.travelCost += expenseAmount;
      } else {
        data.otherExpenses += expenseAmount;
      }
    }
  });

  // Count shows per month
  shows.forEach(show => {
    if (!show.startDate) return;
    const month = show.startDate.substring(0, 7);
    if (monthlyData.has(month)) {
      monthlyData.get(month).showCount++;
    } else {
      monthlyData.set(month, {
        period: month,
        showFeeRevenue: 0,
        merchRevenue: 0,
        otherRevenue: 0,
        materialsCost: 0,
        travelCost: 0,
        otherExpenses: 0,
        showCount: 1
      });
    }
  });

  // Convert to array and sort by period
  const summaryArray = Array.from(monthlyData.values())
    .sort((a, b) => a.period.localeCompare(b.period))
    .map(data => ({
      ...data,
      totalRevenue: data.showFeeRevenue + data.merchRevenue + data.otherRevenue,
      totalExpenses: data.materialsCost + data.travelCost + data.otherExpenses,
      netIncome: (data.showFeeRevenue + data.merchRevenue + data.otherRevenue) -
                 (data.materialsCost + data.travelCost + data.otherExpenses)
    }));

  return summaryArray;
}

export const PL_CSV_COLUMNS = [
  'period',
  'showCount',
  'showFeeRevenue',
  'merchRevenue',
  'otherRevenue',
  'totalRevenue',
  'materialsCost',
  'travelCost',
  'otherExpenses',
  'totalExpenses',
  'netIncome'
];

export const PL_CSV_HEADERS = {
  period: 'Period (YYYY-MM)',
  showCount: 'Show Count',
  showFeeRevenue: 'Performance Fees',
  merchRevenue: 'Merchandise Revenue',
  otherRevenue: 'Other Revenue',
  totalRevenue: 'Total Revenue',
  materialsCost: 'Materials Cost',
  travelCost: 'Travel Cost',
  otherExpenses: 'Other Expenses',
  totalExpenses: 'Total Expenses',
  netIncome: 'Net Income'
};

/**
 * Export P&L summary to CSV string
 */
export function exportPLToCSV(transactions, shows = []) {
  const summary = generatePLSummary(transactions, shows);

  const data = summary.map(row => {
    const csvRow = {};
    PL_CSV_COLUMNS.forEach(col => {
      const value = row[col];
      if (typeof value === 'number' && col !== 'showCount') {
        csvRow[PL_CSV_HEADERS[col]] = value.toFixed(2);
      } else {
        csvRow[PL_CSV_HEADERS[col]] = value;
      }
    });
    return csvRow;
  });

  // Add totals row
  if (summary.length > 0) {
    const totals = {
      [PL_CSV_HEADERS.period]: 'TOTAL',
      [PL_CSV_HEADERS.showCount]: summary.reduce((sum, r) => sum + r.showCount, 0),
      [PL_CSV_HEADERS.showFeeRevenue]: summary.reduce((sum, r) => sum + r.showFeeRevenue, 0).toFixed(2),
      [PL_CSV_HEADERS.merchRevenue]: summary.reduce((sum, r) => sum + r.merchRevenue, 0).toFixed(2),
      [PL_CSV_HEADERS.otherRevenue]: summary.reduce((sum, r) => sum + r.otherRevenue, 0).toFixed(2),
      [PL_CSV_HEADERS.totalRevenue]: summary.reduce((sum, r) => sum + r.totalRevenue, 0).toFixed(2),
      [PL_CSV_HEADERS.materialsCost]: summary.reduce((sum, r) => sum + r.materialsCost, 0).toFixed(2),
      [PL_CSV_HEADERS.travelCost]: summary.reduce((sum, r) => sum + r.travelCost, 0).toFixed(2),
      [PL_CSV_HEADERS.otherExpenses]: summary.reduce((sum, r) => sum + r.otherExpenses, 0).toFixed(2),
      [PL_CSV_HEADERS.totalExpenses]: summary.reduce((sum, r) => sum + r.totalExpenses, 0).toFixed(2),
      [PL_CSV_HEADERS.netIncome]: summary.reduce((sum, r) => sum + r.netIncome, 0).toFixed(2)
    };
    data.push(totals);
  }

  return Papa.unparse(data, { quotes: true, header: true });
}

/**
 * Download P&L summary CSV
 */
export function downloadPLCSV(transactions, shows = [], filename = 'lumberjack-pl-summary.csv') {
  const csv = exportPLToCSV(transactions, shows);
  downloadCSVFile(csv, filename);
}


// ========== INVENTORY CSV ==========

export const INVENTORY_CSV_COLUMNS = [
  'id',
  'name',
  'sku',
  'category',
  'unitPrice',
  'unitCost',
  'quantityInStock',
  'lowStockThreshold',
  'isActive'
];

export const INVENTORY_CSV_HEADERS = {
  id: 'ID',
  name: 'Product Name',
  sku: 'SKU',
  category: 'Category',
  unitPrice: 'Unit Price',
  unitCost: 'Unit Cost',
  quantityInStock: 'Quantity',
  lowStockThreshold: 'Low Stock Alert',
  isActive: 'Active'
};

const INVENTORY_HEADER_TO_FIELD = Object.fromEntries(
  Object.entries(INVENTORY_CSV_HEADERS).map(([field, header]) => [header.toLowerCase(), field])
);

/**
 * Export inventory to CSV string
 */
export function exportInventoryToCSV(inventory) {
  const data = inventory.map(item => {
    const row = {};
    INVENTORY_CSV_COLUMNS.forEach(col => {
      const value = item[col];
      if (col === 'isActive') {
        row[INVENTORY_CSV_HEADERS[col]] = value ? 'Yes' : 'No';
      } else if (col === 'unitPrice' || col === 'unitCost') {
        row[INVENTORY_CSV_HEADERS[col]] = typeof value === 'number' ? value.toFixed(2) : value;
      } else {
        row[INVENTORY_CSV_HEADERS[col]] = value ?? '';
      }
    });
    return row;
  });

  return Papa.unparse(data, { quotes: true, header: true });
}

/**
 * Download inventory CSV
 */
export function downloadInventoryCSV(inventory, filename = 'lumberjack-inventory.csv') {
  const csv = exportInventoryToCSV(inventory);
  downloadCSVFile(csv, filename);
}

/**
 * Parse inventory CSV
 */
export function parseInventoryCSV(csvString) {
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
          const inventory = results.data.map((row, index) => mapRowToInventory(row, index));
          resolve(inventory);
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => reject(new Error(`CSV parsing error: ${error.message}`))
    });
  });
}

function mapRowToInventory(row, index) {
  const normalizedRow = {};
  Object.entries(row).forEach(([key, value]) => {
    const fieldName = INVENTORY_HEADER_TO_FIELD[key.toLowerCase().trim()] || key;
    normalizedRow[fieldName] = value;
  });

  const id = normalizedRow.id?.trim() || `inv-import-${Date.now()}-${index}`;
  const name = normalizedRow.name?.trim();

  if (!name) {
    throw new Error(`Row ${index + 2}: Product Name is required`);
  }

  // Parse isActive
  let isActive = true;
  const activeValue = normalizedRow.isActive?.toString().toLowerCase().trim();
  if (activeValue === 'no' || activeValue === 'false' || activeValue === '0') {
    isActive = false;
  }

  // Validate category
  const validCategories = ['apparel', 'accessories', 'souvenirs', 'other'];
  let category = normalizedRow.category?.trim().toLowerCase() || 'other';
  if (!validCategories.includes(category)) category = 'other';

  return {
    id,
    name,
    sku: normalizedRow.sku?.trim() || '',
    category,
    unitPrice: parseFloat(normalizedRow.unitPrice) || 0,
    unitCost: parseFloat(normalizedRow.unitCost) || 0,
    quantityInStock: parseInt(normalizedRow.quantityInStock) || 0,
    lowStockThreshold: parseInt(normalizedRow.lowStockThreshold) || 5,
    isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Validate imported inventory
 */
export function validateInventoryImport(inventory, existingInventory) {
  const existingIds = new Set(existingInventory.map(i => i.id));
  const newItems = [];
  const updatedItems = [];
  const errors = [];

  inventory.forEach((item, index) => {
    const duplicateInImport = inventory.findIndex((i, idx) => idx !== index && i.id === item.id);
    if (duplicateInImport !== -1 && duplicateInImport < index) {
      errors.push(`Row ${index + 2}: Duplicate ID "${item.id}" in import file`);
      return;
    }

    if (existingIds.has(item.id)) {
      updatedItems.push(item);
    } else {
      newItems.push(item);
    }
  });

  return {
    valid: errors.length === 0,
    newItems,
    updatedItems,
    errors,
    summary: `${newItems.length} new, ${updatedItems.length} updated`
  };
}

/**
 * Import inventory from file
 */
export function importInventoryFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      reject(new Error('Please select a CSV file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const inventory = await parseInventoryCSV(e.target.result);
        resolve(inventory);
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
