import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lumberjack-tours-fixed-costs';

const DEFAULT_FIXED_COSTS = {
  insurance: { label: 'Insurance', amount: 0, notes: 'General liability, workers comp, equipment' },
  vehicleEquipment: { label: 'Vehicle / Equipment', amount: 0, notes: 'Truck maintenance, trailer, chainsaws, axes, logs' },
  storageFacilities: { label: 'Storage / Facilities', amount: 0, notes: 'Shop rent, storage units, utilities' },
  officeAdmin: { label: 'Office / Admin', amount: 0, notes: 'Software, phone, marketing, website, accounting' }
};

export function useFixedCosts() {
  const [fixedCosts, setFixedCosts] = useState(DEFAULT_FIXED_COSTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with defaults to pick up any new categories
        setFixedCosts({ ...DEFAULT_FIXED_COSTS, ...parsed });
      } catch (e) {
        console.error('Failed to parse stored fixed costs:', e);
        setFixedCosts(DEFAULT_FIXED_COSTS);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever fixed costs change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedCosts));
    }
  }, [fixedCosts, isLoaded]);

  // Update a single cost category
  const updateFixedCost = useCallback((key, updates) => {
    setFixedCosts(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
    }));
  }, []);

  // Add a custom cost category
  const addFixedCost = useCallback((label, notes = '') => {
    const key = `custom_${Date.now()}`;
    setFixedCosts(prev => ({
      ...prev,
      [key]: { label, amount: 0, notes, custom: true }
    }));
    return key;
  }, []);

  // Remove a cost category (only custom ones)
  const removeFixedCost = useCallback((key) => {
    setFixedCosts(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Get total annual fixed costs
  const totalFixedCosts = Object.values(fixedCosts).reduce((sum, c) => sum + (c.amount || 0), 0);

  return {
    fixedCosts,
    isLoaded,
    updateFixedCost,
    addFixedCost,
    removeFixedCost,
    totalFixedCosts
  };
}
