// Sample revenue data for initial testing
// Links to shows via showId from sampleData.js

export const sampleTransactions = [
  // Show fees
  {
    id: 'txn-001',
    type: 'show_fee',
    showId: 'show-001',
    date: '2024-06-15',
    description: 'Performance fee - Pine Valley County Fair',
    amount: 4500,
    category: 'performance_fee',
    paymentMethod: 'check',
    notes: 'Paid on show date',
    createdAt: '2024-06-15T18:00:00Z'
  },
  {
    id: 'txn-002',
    type: 'show_fee',
    showId: 'show-002',
    date: '2024-06-22',
    description: 'Performance fee - Lake Superior Festival',
    amount: 5000,
    category: 'performance_fee',
    paymentMethod: 'invoice',
    notes: 'Net 30 invoice sent',
    createdAt: '2024-06-22T18:00:00Z'
  },
  {
    id: 'txn-003',
    type: 'show_fee',
    showId: 'show-003',
    date: '2024-07-01',
    description: 'Performance fee - Northwoods Timber Days',
    amount: 6000,
    category: 'performance_fee',
    paymentMethod: 'check',
    notes: '',
    createdAt: '2024-07-01T18:00:00Z'
  },
  // Merch sales at shows
  {
    id: 'txn-004',
    type: 'merch_sale',
    showId: 'show-001',
    date: '2024-06-15',
    description: 'T-shirts (12), Hats (8)',
    amount: 620,
    category: 'merchandise',
    paymentMethod: 'cash',
    notes: 'Good sales day',
    createdAt: '2024-06-15T20:00:00Z'
  },
  {
    id: 'txn-005',
    type: 'merch_sale',
    showId: 'show-002',
    date: '2024-06-22',
    description: 'T-shirts (18), Mugs (10), Posters (25)',
    amount: 985,
    category: 'merchandise',
    paymentMethod: 'card',
    notes: 'Card reader worked great',
    createdAt: '2024-06-22T20:00:00Z'
  },
  // Website merch sales (no showId)
  {
    id: 'txn-006',
    type: 'merch_sale',
    showId: null,
    date: '2024-06-18',
    description: 'Online order - 2x T-shirts, 1x Hoodie',
    amount: 95,
    category: 'merchandise',
    paymentMethod: 'online',
    notes: 'Shipped via USPS',
    createdAt: '2024-06-18T14:30:00Z'
  },
  {
    id: 'txn-007',
    type: 'merch_sale',
    showId: null,
    date: '2024-06-25',
    description: 'Online order - 1x Signed poster',
    amount: 45,
    category: 'merchandise',
    paymentMethod: 'online',
    notes: '',
    createdAt: '2024-06-25T09:15:00Z'
  },
  // Expenses
  {
    id: 'txn-008',
    type: 'expense',
    showId: 'show-001',
    date: '2024-06-14',
    description: 'Gas - travel to Pine Valley',
    amount: -85,
    category: 'travel',
    paymentMethod: 'card',
    notes: '',
    createdAt: '2024-06-14T16:00:00Z'
  },
  {
    id: 'txn-009',
    type: 'expense',
    showId: 'show-001',
    date: '2024-06-15',
    description: 'Chainsaw bar oil and fuel',
    amount: -45,
    category: 'materials',
    paymentMethod: 'cash',
    notes: '',
    createdAt: '2024-06-15T10:00:00Z'
  },
  {
    id: 'txn-010',
    type: 'expense',
    showId: null,
    date: '2024-06-10',
    description: 'T-shirt restock order (50 units)',
    amount: -375,
    category: 'materials',
    paymentMethod: 'card',
    notes: 'Bulk order from supplier',
    createdAt: '2024-06-10T11:00:00Z'
  }
];

export const sampleInventory = [
  {
    id: 'inv-001',
    name: 'Timberworks T-Shirt (S)',
    sku: 'SHIRT-S',
    category: 'apparel',
    unitPrice: 25,
    unitCost: 8,
    quantityInStock: 15,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-002',
    name: 'Timberworks T-Shirt (M)',
    sku: 'SHIRT-M',
    category: 'apparel',
    unitPrice: 25,
    unitCost: 8,
    quantityInStock: 28,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-003',
    name: 'Timberworks T-Shirt (L)',
    sku: 'SHIRT-L',
    category: 'apparel',
    unitPrice: 25,
    unitCost: 8,
    quantityInStock: 32,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-004',
    name: 'Timberworks T-Shirt (XL)',
    sku: 'SHIRT-XL',
    category: 'apparel',
    unitPrice: 25,
    unitCost: 8,
    quantityInStock: 8,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-005',
    name: 'Timberworks Hoodie',
    sku: 'HOODIE',
    category: 'apparel',
    unitPrice: 45,
    unitCost: 18,
    quantityInStock: 20,
    lowStockThreshold: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-006',
    name: 'Lumberjack Cap',
    sku: 'CAP',
    category: 'accessories',
    unitPrice: 20,
    unitCost: 6,
    quantityInStock: 45,
    lowStockThreshold: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-007',
    name: 'Timber Coffee Mug',
    sku: 'MUG',
    category: 'souvenirs',
    unitPrice: 15,
    unitCost: 4,
    quantityInStock: 60,
    lowStockThreshold: 20,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-008',
    name: 'Show Poster (Signed)',
    sku: 'POSTER-SIGN',
    category: 'souvenirs',
    unitPrice: 45,
    unitCost: 5,
    quantityInStock: 25,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-009',
    name: 'Show Poster (Unsigned)',
    sku: 'POSTER',
    category: 'souvenirs',
    unitPrice: 12,
    unitCost: 3,
    quantityInStock: 100,
    lowStockThreshold: 30,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  },
  {
    id: 'inv-010',
    name: 'Mini Axe Keychain',
    sku: 'KEYCHAIN',
    category: 'souvenirs',
    unitPrice: 8,
    unitCost: 2,
    quantityInStock: 150,
    lowStockThreshold: 50,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z'
  }
];

export const samplePayments = [
  {
    id: 'pay-001',
    showId: 'show-001',
    expectedAmount: 4500,
    receivedAmount: 4500,
    status: 'paid',
    dueDate: '2024-06-15',
    paidDate: '2024-06-15',
    invoiceNumber: null,
    notes: 'Paid on site',
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2024-06-15T18:00:00Z'
  },
  {
    id: 'pay-002',
    showId: 'show-002',
    expectedAmount: 5000,
    receivedAmount: 0,
    status: 'invoiced',
    dueDate: '2024-07-22',
    paidDate: null,
    invoiceNumber: 'INV-2024-002',
    notes: 'Net 30',
    createdAt: '2024-06-22T00:00:00Z',
    updatedAt: '2024-06-22T00:00:00Z'
  },
  {
    id: 'pay-003',
    showId: 'show-003',
    expectedAmount: 6000,
    receivedAmount: 6000,
    status: 'paid',
    dueDate: '2024-07-01',
    paidDate: '2024-07-01',
    invoiceNumber: null,
    notes: 'Check received day of show',
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-01T18:00:00Z'
  },
  {
    id: 'pay-004',
    showId: 'show-004',
    expectedAmount: 7000,
    receivedAmount: 3500,
    status: 'partial',
    dueDate: '2024-07-15',
    paidDate: null,
    invoiceNumber: 'INV-2024-004',
    notes: '50% deposit received, balance due on show date',
    createdAt: '2024-07-10T00:00:00Z',
    updatedAt: '2024-07-10T00:00:00Z'
  },
  {
    id: 'pay-005',
    showId: 'show-005',
    expectedAmount: 4000,
    receivedAmount: 0,
    status: 'pending',
    dueDate: '2024-07-21',
    paidDate: null,
    invoiceNumber: null,
    notes: 'Awaiting contract signature',
    createdAt: '2024-07-15T00:00:00Z',
    updatedAt: '2024-07-15T00:00:00Z'
  }
];
