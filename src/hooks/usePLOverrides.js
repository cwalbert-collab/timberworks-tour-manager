import { useState, useEffect, useCallback } from 'react';
import { IRS_MILEAGE_RATE, DEFAULT_HOTEL_RATE, STANDARD_DAY_RATE } from '../data/sampleData';

const STORAGE_KEY = 'lumberjack-tours-pl-overrides';

const DEFAULT_RATES = {
  mileageRate: IRS_MILEAGE_RATE,
  hotelRate: DEFAULT_HOTEL_RATE,
  dayRate: STANDARD_DAY_RATE
};

const DEFAULT_STATE = {
  rates: DEFAULT_RATES,
  lineOverrides: {},  // { 'performanceFees': 50000, ... }
  scenarios: [],      // [{ name: 'Budget', rates: {...}, lineOverrides: {...} }]
  activeScenario: null
};

export function usePLOverrides() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState({
          ...DEFAULT_STATE,
          ...parsed,
          rates: { ...DEFAULT_RATES, ...parsed.rates }
        });
      } catch (e) {
        console.error('Failed to parse PL overrides:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  // Update a rate
  const updateRate = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      rates: { ...prev.rates, [key]: value }
    }));
  }, []);

  // Reset rates to defaults
  const resetRates = useCallback(() => {
    setState(prev => ({
      ...prev,
      rates: DEFAULT_RATES
    }));
  }, []);

  // Set a line-item override
  const setLineOverride = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      lineOverrides: { ...prev.lineOverrides, [key]: value }
    }));
  }, []);

  // Clear a line-item override
  const clearLineOverride = useCallback((key) => {
    setState(prev => {
      const next = { ...prev.lineOverrides };
      delete next[key];
      return { ...prev, lineOverrides: next };
    });
  }, []);

  // Clear all line overrides
  const clearAllOverrides = useCallback(() => {
    setState(prev => ({ ...prev, lineOverrides: {} }));
  }, []);

  // Save current state as a named scenario
  const saveScenario = useCallback((name) => {
    setState(prev => {
      const existing = prev.scenarios.findIndex(s => s.name === name);
      const scenario = { name, rates: { ...prev.rates }, lineOverrides: { ...prev.lineOverrides } };
      const scenarios = [...prev.scenarios];
      if (existing >= 0) {
        scenarios[existing] = scenario;
      } else {
        scenarios.push(scenario);
      }
      return { ...prev, scenarios, activeScenario: name };
    });
  }, []);

  // Load a saved scenario
  const loadScenario = useCallback((name) => {
    setState(prev => {
      const scenario = prev.scenarios.find(s => s.name === name);
      if (!scenario) return prev;
      return {
        ...prev,
        rates: { ...DEFAULT_RATES, ...scenario.rates },
        lineOverrides: { ...scenario.lineOverrides },
        activeScenario: name
      };
    });
  }, []);

  // Delete a scenario
  const deleteScenario = useCallback((name) => {
    setState(prev => ({
      ...prev,
      scenarios: prev.scenarios.filter(s => s.name !== name),
      activeScenario: prev.activeScenario === name ? null : prev.activeScenario
    }));
  }, []);

  // Clear scenario selection (back to live/actual)
  const clearScenario = useCallback(() => {
    setState(prev => ({
      ...prev,
      rates: DEFAULT_RATES,
      lineOverrides: {},
      activeScenario: null
    }));
  }, []);

  const hasOverrides = Object.keys(state.lineOverrides).length > 0 ||
    state.rates.mileageRate !== DEFAULT_RATES.mileageRate ||
    state.rates.hotelRate !== DEFAULT_RATES.hotelRate ||
    state.rates.dayRate !== DEFAULT_RATES.dayRate;

  return {
    rates: state.rates,
    lineOverrides: state.lineOverrides,
    scenarios: state.scenarios,
    activeScenario: state.activeScenario,
    hasOverrides,
    isLoaded,
    updateRate,
    resetRates,
    setLineOverride,
    clearLineOverride,
    clearAllOverrides,
    saveScenario,
    loadScenario,
    deleteScenario,
    clearScenario,
    DEFAULT_RATES
  };
}
