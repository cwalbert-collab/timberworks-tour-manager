import { useState, useEffect, useCallback, useMemo } from 'react';
import { sampleEtsyOrders, sampleEtsyShopStats, etsyOrderToTransaction } from '../data/sampleEtsyData';

const STORAGE_KEY = 'lumberjack-tours-etsy';

// Simulate network delay for realistic feel
const simulateNetworkDelay = (ms = 1500) => new Promise(resolve => setTimeout(resolve, ms));

export function useEtsy(onImportTransactions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [shopStats, setShopStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [importedOrderIds, setImportedOrderIds] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setIsConnected(data.isConnected || false);
        setLastSyncTime(data.lastSyncTime || null);
        setShopStats(data.shopStats || null);
        setOrders(data.orders || []);
        setImportedOrderIds(new Set(data.importedOrderIds || []));
      } catch (e) {
        console.error('Failed to parse Etsy state:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isLoaded) {
      const data = {
        isConnected,
        lastSyncTime,
        shopStats,
        orders,
        importedOrderIds: Array.from(importedOrderIds)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [isConnected, lastSyncTime, shopStats, orders, importedOrderIds, isLoaded]);

  // Connect to Etsy (simulated OAuth flow)
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setSyncError(null);

    try {
      // Simulate OAuth redirect and token exchange
      await simulateNetworkDelay(2000);

      // "Successfully connected"
      setIsConnected(true);
      setShopStats({
        ...sampleEtsyShopStats,
        lastUpdated: new Date().toISOString()
      });

      // Auto-sync after connecting
      await syncOrders();
    } catch (error) {
      setSyncError('Failed to connect to Etsy. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect from Etsy
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setShopStats(null);
    setOrders([]);
    setLastSyncTime(null);
    setImportedOrderIds(new Set());
    setSyncError(null);
  }, []);

  // Sync orders from Etsy
  const syncOrders = useCallback(async () => {
    if (!isConnected && !isConnecting) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Simulate API call to fetch orders
      await simulateNetworkDelay(1500);

      // Get "fresh" orders (with randomized recent dates for demo)
      const now = new Date();
      const freshOrders = sampleEtsyOrders.map((order, index) => {
        // Make some orders appear more recent
        const daysAgo = index * 3 + Math.floor(Math.random() * 2);
        const orderDate = new Date(now);
        orderDate.setDate(orderDate.getDate() - daysAgo);

        return {
          ...order,
          orderDate: orderDate.toISOString()
        };
      });

      setOrders(freshOrders);
      setLastSyncTime(new Date().toISOString());
      setShopStats(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      setSyncError('Failed to sync orders. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, isConnecting]);

  // Import a single order as a transaction
  const importOrder = useCallback((order) => {
    if (importedOrderIds.has(order.orderId)) return false;

    const transaction = etsyOrderToTransaction(order);
    onImportTransactions?.([transaction]);

    setImportedOrderIds(prev => new Set([...prev, order.orderId]));
    return true;
  }, [importedOrderIds, onImportTransactions]);

  // Import all unimported orders
  const importAllOrders = useCallback(() => {
    const newOrders = orders.filter(o => !importedOrderIds.has(o.orderId));
    if (newOrders.length === 0) return 0;

    const transactions = newOrders.map(etsyOrderToTransaction);
    onImportTransactions?.(transactions);

    setImportedOrderIds(prev => new Set([
      ...prev,
      ...newOrders.map(o => o.orderId)
    ]));

    return newOrders.length;
  }, [orders, importedOrderIds, onImportTransactions]);

  // Computed stats
  const stats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'shipped');
    const pendingOrders = orders.filter(o => o.status === 'processing');
    const totalRevenue = orders.reduce((sum, o) => sum + o.netRevenue, 0);
    const unimportedCount = orders.filter(o => !importedOrderIds.has(o.orderId)).length;

    return {
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue,
      unimportedCount,
      allImported: unimportedCount === 0
    };
  }, [orders, importedOrderIds]);

  // Check if an order has been imported
  const isOrderImported = useCallback((orderId) => {
    return importedOrderIds.has(orderId);
  }, [importedOrderIds]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    isSyncing,
    isLoaded,

    // Data
    shopStats,
    orders,
    stats,
    lastSyncTime,
    syncError,

    // Actions
    connect,
    disconnect,
    syncOrders,
    importOrder,
    importAllOrders,
    isOrderImported
  };
}
