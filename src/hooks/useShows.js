import { useState, useEffect, useCallback } from 'react';
import { sampleShows, calculateShowMetrics, DEFAULT_HOTEL_RATE } from '../data/sampleData';
import { distanceFromHomebase } from '../utils/geoUtils';

const STORAGE_KEY = 'lumberjack-tours-shows';

export function useShows() {
  const [shows, setShows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load shows from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let rawShows;
    if (stored) {
      try {
        rawShows = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored shows:', e);
        rawShows = sampleShows;
      }
    } else {
      rawShows = sampleShows;
    }

    // Auto-fill missing mileage/hotel estimates from coordinates and duration
    const filled = rawShows.map(show => {
      const needsMileage = !show.mileage || show.mileage === 0;
      const needsHotel = !show.hotelNights && show.hotelNights !== 0;

      if (!needsMileage && !needsHotel) return show;

      const updated = { ...show };

      if (needsMileage && show.latitude && show.longitude) {
        const oneWay = distanceFromHomebase(show.latitude, show.longitude);
        updated.mileage = Math.round(oneWay * 2);
      }

      if (needsHotel) {
        const start = new Date(show.startDate);
        const end = new Date(show.endDate || show.startDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        updated.hotelRate = show.hotelRate || DEFAULT_HOTEL_RATE;
        updated.hotelRooms = show.hotelRooms || 3;
        updated.hotelNights = Math.max(days - 1, 0);
      }

      return updated;
    });

    setShows(filled.map(calculateShowMetrics));
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever shows change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      // Store without calculated fields to save space
      const toStore = shows.map(({ totalRevenue, profit, durationDays, dayRateCost, mileageCost, hotelCost, ...rest }) => rest);
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
