import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting state to localStorage with automatic sync
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if no stored value exists
 * @returns {[any, Function, Function]} - [value, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Wrapped setter that handles errors
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`Error in setValue for key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from storage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for persisting user preferences (sort, filter settings)
 * @param {string} componentKey - Unique key for the component
 * @returns {object} - Preference getter/setter functions
 */
export function usePreferences(componentKey) {
  const [preferences, setPreferences] = useLocalStorage(`${componentKey}_prefs`, {});

  const getPreference = useCallback((key, defaultValue) => {
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
  }, [preferences]);

  const setPreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setPreferences]);

  const clearPreferences = useCallback(() => {
    setPreferences({});
  }, [setPreferences]);

  return { getPreference, setPreference, clearPreferences };
}

export default useLocalStorage;
