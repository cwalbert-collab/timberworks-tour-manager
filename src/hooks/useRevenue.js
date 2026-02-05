import { useState, useEffect, useCallback, useMemo } from 'react';
import { sampleTransactions, sampleInventory, samplePayments } from '../data/sampleRevenueData';

const STORAGE_KEYS = {
  TRANSACTIONS: 'lumberjack-tours-transactions',
  INVENTORY: 'lumberjack-tours-inventory',
  PAYMENTS: 'lumberjack-tours-payments'
};

export function useRevenue() {
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    // Load transactions
    const storedTxns = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (storedTxns) {
      try {
        setTransactions(JSON.parse(storedTxns));
      } catch (e) {
        console.error('Failed to parse stored transactions:', e);
        setTransactions(sampleTransactions);
      }
    } else {
      setTransactions(sampleTransactions);
    }

    // Load inventory
    const storedInv = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (storedInv) {
      try {
        setInventory(JSON.parse(storedInv));
      } catch (e) {
        console.error('Failed to parse stored inventory:', e);
        setInventory(sampleInventory);
      }
    } else {
      setInventory(sampleInventory);
    }

    // Load payments
    const storedPay = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (storedPay) {
      try {
        setPayments(JSON.parse(storedPay));
      } catch (e) {
        console.error('Failed to parse stored payments:', e);
        setPayments(samplePayments);
      }
    } else {
      setPayments(samplePayments);
    }

    setIsLoaded(true);
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  // Save inventory to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    }
  }, [inventory, isLoaded]);

  // Save payments to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    }
  }, [payments, isLoaded]);

  // Transaction CRUD operations
  const addTransaction = useCallback((transaction) => {
    const newTxn = {
      ...transaction,
      id: transaction.id || `txn-${Date.now()}`,
      createdAt: transaction.createdAt || new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTxn]);
  }, []);

  const updateTransaction = useCallback((updatedTxn) => {
    setTransactions(prev =>
      prev.map(txn => txn.id === updatedTxn.id ? updatedTxn : txn)
    );
  }, []);

  const deleteTransaction = useCallback((txnId) => {
    setTransactions(prev => prev.filter(txn => txn.id !== txnId));
  }, []);

  // Inventory CRUD operations
  const addInventoryItem = useCallback((item) => {
    const newItem = {
      ...item,
      id: item.id || `inv-${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInventory(prev => [...prev, newItem]);
  }, []);

  const updateInventoryItem = useCallback((updatedItem) => {
    setInventory(prev =>
      prev.map(item => item.id === updatedItem.id
        ? { ...updatedItem, updatedAt: new Date().toISOString() }
        : item
      )
    );
  }, []);

  const deleteInventoryItem = useCallback((itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const adjustStock = useCallback((itemId, quantityChange) => {
    setInventory(prev =>
      prev.map(item => item.id === itemId
        ? {
            ...item,
            quantityInStock: Math.max(0, item.quantityInStock + quantityChange),
            updatedAt: new Date().toISOString()
          }
        : item
      )
    );
  }, []);

  // Payment CRUD operations
  const addPayment = useCallback((payment) => {
    const newPayment = {
      ...payment,
      id: payment.id || `pay-${Date.now()}`,
      createdAt: payment.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPayments(prev => [...prev, newPayment]);
  }, []);

  const updatePayment = useCallback((updatedPayment) => {
    setPayments(prev =>
      prev.map(pay => pay.id === updatedPayment.id
        ? { ...updatedPayment, updatedAt: new Date().toISOString() }
        : pay
      )
    );
  }, []);

  const deletePayment = useCallback((paymentId) => {
    setPayments(prev => prev.filter(pay => pay.id !== paymentId));
  }, []);

  const markPaymentPaid = useCallback((paymentId, amount, paidDate) => {
    setPayments(prev =>
      prev.map(pay => {
        if (pay.id !== paymentId) return pay;
        const newReceived = pay.receivedAmount + amount;
        const newStatus = newReceived >= pay.expectedAmount ? 'paid' : 'partial';
        return {
          ...pay,
          receivedAmount: newReceived,
          status: newStatus,
          paidDate: newStatus === 'paid' ? (paidDate || new Date().toISOString().split('T')[0]) : pay.paidDate,
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  // Computed metrics
  const metrics = useMemo(() => {
    // Revenue calculations
    const totalRevenue = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const showFeeRevenue = transactions
      .filter(t => t.type === 'show_fee' && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const merchRevenue = transactions
      .filter(t => t.type === 'merch_sale' && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const websiteMerchRevenue = transactions
      .filter(t => t.type === 'merch_sale' && t.showId === null && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const showMerchRevenue = merchRevenue - websiteMerchRevenue;

    // Payment calculations
    const pendingPayments = payments.filter(p => p.status !== 'paid');
    const overduePayments = payments.filter(p => {
      if (p.status === 'paid') return false;
      if (!p.dueDate) return false;
      return new Date(p.dueDate) < new Date();
    });

    const totalExpected = payments.reduce((sum, p) => sum + p.expectedAmount, 0);
    const totalReceived = payments.reduce((sum, p) => sum + p.receivedAmount, 0);
    const outstandingAmount = totalExpected - totalReceived;

    // Inventory calculations
    const lowStockItems = inventory.filter(item =>
      item.isActive && item.quantityInStock <= item.lowStockThreshold
    );

    const totalInventoryValue = inventory
      .filter(item => item.isActive)
      .reduce((sum, item) => sum + (item.quantityInStock * item.unitCost), 0);

    const totalInventoryRetailValue = inventory
      .filter(item => item.isActive)
      .reduce((sum, item) => sum + (item.quantityInStock * item.unitPrice), 0);

    return {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      showFeeRevenue,
      merchRevenue,
      websiteMerchRevenue,
      showMerchRevenue,
      pendingPaymentsCount: pendingPayments.length,
      overduePaymentsCount: overduePayments.length,
      outstandingAmount,
      totalExpected,
      totalReceived,
      lowStockItemsCount: lowStockItems.length,
      totalInventoryValue,
      totalInventoryRetailValue
    };
  }, [transactions, payments, inventory]);

  // Query helpers
  const getShowTransactions = useCallback((showId) => {
    return transactions.filter(t => t.showId === showId);
  }, [transactions]);

  const getShowPayment = useCallback((showId) => {
    return payments.find(p => p.showId === showId);
  }, [payments]);

  const getShowRevenueBreakdown = useCallback((showId) => {
    const showTxns = transactions.filter(t => t.showId === showId);
    return {
      performanceFee: showTxns
        .filter(t => t.category === 'performance_fee')
        .reduce((sum, t) => sum + t.amount, 0),
      merchandise: showTxns
        .filter(t => t.category === 'merchandise')
        .reduce((sum, t) => sum + t.amount, 0),
      expenses: showTxns
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      total: showTxns.reduce((sum, t) => sum + t.amount, 0)
    };
  }, [transactions]);

  const getLowStockItems = useCallback(() => {
    return inventory.filter(item =>
      item.isActive && item.quantityInStock <= item.lowStockThreshold
    );
  }, [inventory]);

  // Import operations
  const importTransactions = useCallback((importedTxns) => {
    setTransactions(prev => {
      const existingMap = new Map(prev.map(t => [t.id, t]));
      importedTxns.forEach(txn => {
        existingMap.set(txn.id, txn);
      });
      return Array.from(existingMap.values());
    });
  }, []);

  const importInventory = useCallback((importedItems) => {
    setInventory(prev => {
      const existingMap = new Map(prev.map(i => [i.id, i]));
      importedItems.forEach(item => {
        existingMap.set(item.id, item);
      });
      return Array.from(existingMap.values());
    });
  }, []);

  const importPayments = useCallback((importedPayments) => {
    setPayments(prev => {
      const existingMap = new Map(prev.map(p => [p.id, p]));
      importedPayments.forEach(payment => {
        existingMap.set(payment.id, payment);
      });
      return Array.from(existingMap.values());
    });
  }, []);

  // Reset to sample data
  const resetToSampleData = useCallback(() => {
    setTransactions(sampleTransactions);
    setInventory(sampleInventory);
    setPayments(samplePayments);
  }, []);

  return {
    // Data
    transactions,
    inventory,
    payments,
    isLoaded,
    metrics,

    // Transaction operations
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // Inventory operations
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,

    // Payment operations
    addPayment,
    updatePayment,
    deletePayment,
    markPaymentPaid,

    // Query helpers
    getShowTransactions,
    getShowPayment,
    getShowRevenueBreakdown,
    getLowStockItems,

    // Import/export
    importTransactions,
    importInventory,
    importPayments,
    resetToSampleData
  };
}
