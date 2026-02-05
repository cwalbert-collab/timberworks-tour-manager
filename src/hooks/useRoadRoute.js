import { useState, useEffect, useCallback, useRef } from 'react';

// OSRM public routing server
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

// Cache expiration time (24 hours)
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

// Local storage key prefix
const CACHE_KEY_PREFIX = 'osrm_route_cache_';

/**
 * Generate a cache key from waypoints
 */
function generateCacheKey(waypoints) {
  const coordString = waypoints
    .map(([lat, lng]) => `${lat.toFixed(4)},${lng.toFixed(4)}`)
    .join('|');
  return CACHE_KEY_PREFIX + btoa(coordString).slice(0, 32);
}

/**
 * Get cached route if valid
 */
function getCachedRoute(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { route, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return route;
  } catch {
    return null;
  }
}

/**
 * Cache a route
 */
function cacheRoute(key, route) {
  try {
    localStorage.setItem(key, JSON.stringify({
      route,
      timestamp: Date.now()
    }));
  } catch (e) {
    // localStorage might be full, ignore
    console.warn('Failed to cache route:', e);
  }
}

/**
 * Fetch road route from OSRM
 * @param {Array} waypoints - Array of [lat, lng] coordinates
 * @returns {Promise<Array>} - Array of [lat, lng] route coordinates
 */
async function fetchOSRMRoute(waypoints) {
  if (waypoints.length < 2) return waypoints;

  // OSRM expects lng,lat format (opposite of Leaflet's lat,lng)
  const coordinates = waypoints
    .map(([lat, lng]) => `${lng},${lat}`)
    .join(';');

  const url = `${OSRM_URL}/${coordinates}?overview=full&geometries=geojson`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OSRM request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
    throw new Error('No route found');
  }

  // Convert GeoJSON coordinates [lng, lat] back to Leaflet format [lat, lng]
  const routeCoords = data.routes[0].geometry.coordinates.map(
    ([lng, lat]) => [lat, lng]
  );

  return routeCoords;
}

/**
 * Custom hook for fetching road-following routes
 * @param {Array} waypoints - Array of [lat, lng] coordinates
 * @param {Object} options - Hook options
 * @param {boolean} options.enabled - Whether to fetch routes (default: true)
 * @returns {Object} - { route, isLoading, error, isRoadRoute }
 */
export function useRoadRoute(waypoints, options = {}) {
  const { enabled = true } = options;
  const [route, setRoute] = useState(waypoints);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRoadRoute, setIsRoadRoute] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchRoute = useCallback(async () => {
    if (!enabled || !waypoints || waypoints.length < 2) {
      setRoute(waypoints || []);
      setIsRoadRoute(false);
      return;
    }

    const cacheKey = generateCacheKey(waypoints);

    // Check cache first
    const cachedRoute = getCachedRoute(cacheKey);
    if (cachedRoute) {
      setRoute(cachedRoute);
      setIsRoadRoute(true);
      setError(null);
      return;
    }

    // Abort any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const roadRoute = await fetchOSRMRoute(waypoints);
      cacheRoute(cacheKey, roadRoute);
      setRoute(roadRoute);
      setIsRoadRoute(true);
    } catch (err) {
      // Fall back to straight line on error
      console.warn('Road routing failed, using straight line:', err.message);
      setRoute(waypoints);
      setIsRoadRoute(false);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [waypoints, enabled]);

  useEffect(() => {
    fetchRoute();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRoute]);

  return { route, isLoading, error, isRoadRoute };
}

/**
 * Hook that manages multiple road routes (for multiple teams)
 * @param {Object} routes - Object with route arrays by key (e.g., { red: [[lat,lng]...], blue: [[lat,lng]...] })
 * @param {Object} options - Hook options
 * @returns {Object} - { routes: { red: [...], blue: [...] }, isLoading, hasRoadRoutes }
 */
export function useMultipleRoadRoutes(routeConfig, options = {}) {
  const { enabled = true } = options;
  const [routes, setRoutes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasRoadRoutes, setHasRoadRoutes] = useState({});

  useEffect(() => {
    if (!enabled) {
      setRoutes(routeConfig);
      return;
    }

    const fetchAllRoutes = async () => {
      setIsLoading(true);
      const newRoutes = {};
      const newHasRoadRoutes = {};

      for (const [key, waypoints] of Object.entries(routeConfig)) {
        if (!waypoints || waypoints.length < 2) {
          newRoutes[key] = waypoints || [];
          newHasRoadRoutes[key] = false;
          continue;
        }

        const cacheKey = generateCacheKey(waypoints);
        const cachedRoute = getCachedRoute(cacheKey);

        if (cachedRoute) {
          newRoutes[key] = cachedRoute;
          newHasRoadRoutes[key] = true;
        } else {
          try {
            const roadRoute = await fetchOSRMRoute(waypoints);
            cacheRoute(cacheKey, roadRoute);
            newRoutes[key] = roadRoute;
            newHasRoadRoutes[key] = true;
          } catch (err) {
            console.warn(`Road routing failed for ${key}:`, err.message);
            newRoutes[key] = waypoints;
            newHasRoadRoutes[key] = false;
          }
        }
      }

      setRoutes(newRoutes);
      setHasRoadRoutes(newHasRoadRoutes);
      setIsLoading(false);
    };

    fetchAllRoutes();
  }, [routeConfig, enabled]);

  return { routes, isLoading, hasRoadRoutes };
}

/**
 * Clear all cached routes
 */
export function clearRouteCache() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  return keysToRemove.length;
}

export default useRoadRoute;
