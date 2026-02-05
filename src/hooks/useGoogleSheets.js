import { useState, useCallback } from 'react';

/**
 * Hook for two-way sync with Google Sheets via Apps Script
 *
 * Setup:
 * 1. Create a Google Sheet with columns matching your show data
 * 2. Go to Extensions → Apps Script
 * 3. Paste the code from docs/google-apps-script.js
 * 4. Deploy → New deployment → Web app → Anyone can access
 * 5. Copy the deployment URL and paste it below or in settings
 */

const STORAGE_KEY = 'googleSheetsConfig';

// Get stored config
const getConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { url: '', enabled: false };
  } catch {
    return { url: '', enabled: false };
  }
};

// Save config
const saveConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export function useGoogleSheets() {
  const [config, setConfigState] = useState(getConfig);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  // Update config
  const setConfig = useCallback((newConfig) => {
    const updated = { ...config, ...newConfig };
    setConfigState(updated);
    saveConfig(updated);
    setError(null);
  }, [config]);

  // Fetch all shows from Google Sheet
  const fetchShows = useCallback(async () => {
    if (!config.url || !config.enabled) {
      return { success: false, error: 'Google Sheets not configured' };
    }

    setSyncing(true);
    setError(null);

    try {
      const response = await fetch(config.url);
      const data = await response.json();

      if (data.success) {
        setLastSync(new Date());
        setSyncing(false);
        return { success: true, shows: data.shows };
      } else {
        throw new Error(data.error || 'Failed to fetch');
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error';
      setError(errorMsg);
      setSyncing(false);
      return { success: false, error: errorMsg };
    }
  }, [config.url, config.enabled]);

  // Send action to Google Sheet
  const sendAction = useCallback(async (action, payload) => {
    if (!config.url || !config.enabled) {
      return { success: false, error: 'Google Sheets not configured' };
    }

    setSyncing(true);
    setError(null);

    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await response.json();

      if (data.success) {
        setLastSync(new Date());
        setSyncing(false);
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Action failed');
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error';
      setError(errorMsg);
      setSyncing(false);
      return { success: false, error: errorMsg };
    }
  }, [config.url, config.enabled]);

  // Create a show in Google Sheet
  const createShow = useCallback((show) => {
    return sendAction('create', { show });
  }, [sendAction]);

  // Update a show in Google Sheet
  const updateShow = useCallback((show) => {
    return sendAction('update', { show });
  }, [sendAction]);

  // Delete a show from Google Sheet
  const deleteShow = useCallback((id) => {
    return sendAction('delete', { show: { id } });
  }, [sendAction]);

  // Full sync - push all local shows to Google Sheet
  const pushAllShows = useCallback((shows) => {
    return sendAction('sync', { shows });
  }, [sendAction]);

  // Test connection
  const testConnection = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  }, []);

  return {
    // Config
    config,
    setConfig,
    isConfigured: !!config.url && config.enabled,

    // State
    syncing,
    lastSync,
    error,

    // Actions
    fetchShows,
    createShow,
    updateShow,
    deleteShow,
    pushAllShows,
    testConnection,
  };
}
