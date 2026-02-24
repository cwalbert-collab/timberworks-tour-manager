import { useState, useEffect, useCallback } from 'react';
import { sampleShows, calculateShowMetrics } from '../data/sampleData';

const STORAGE_KEY = 'lumberjack-tours-shows';

export function useShows() {
  const [shows, setShows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load shows from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Calculate metrics for each show
        setShows(parsed.map(calculateShowMetrics));
      } catch (e) {
        console.error('Failed to parse stored shows:', e);
        // Fall back to sample data
        setShows(sampleShows.map(calculateShowMetrics));
      }
    } else {
      // First time: use sample data
      setShows(sampleShows.map(calculateShowMetrics));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever shows change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      // Store without calculated fields to save space
      const toStore = shows.map(({ totalRevenue, profit, durationDays, dayRateCost, mileageCost, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }
  }, [shows, isLoaded]);

  // Add a new show
  const addShow = useCallback((show) => {
    const newShow = calculateShowMetrics(show);
    setShows(prev => [...prev, newShow]);
  }, []);

  // Update an existing show
  const updateShow = useCallback((updatedShow) => {
    setShows(prev =>
      prev.map(show =>
        show.id === updatedShow.id ? calculateShowMetrics(updatedShow) : show
      )
    );
  }, []);

  // Delete a show
  const deleteShow = useCallback((showId) => {
    setShows(prev => prev.filter(show => show.id !== showId));
  }, []);

  // Reset to sample data
  const resetToSampleData = useCallback(() => {
    setShows(sampleShows.map(calculateShowMetrics));
  }, []);

  // Import shows (merge with existing - update by ID or add new)
  const importShows = useCallback((importedShows) => {
    setShows(prev => {
      const existingMap = new Map(prev.map(s => [s.id, s]));

      // Update existing or add new
      importedShows.forEach(show => {
        existingMap.set(show.id, calculateShowMetrics(show));
      });

      return Array.from(existingMap.values());
    });
  }, []);

  // Replace all shows (for full import)
  const replaceAllShows = useCallback((newShows) => {
    setShows(newShows.map(calculateShowMetrics));
  }, []);

  return {
    shows,
    isLoaded,
    addShow,
    updateShow,
    deleteShow,
    resetToSampleData,
    importShows,
    replaceAllShows
  };
}
