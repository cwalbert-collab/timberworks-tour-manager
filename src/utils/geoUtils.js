/**
 * Geographic utility functions for distance calculations and formatting
 */

// Homebase location (Hayward, WI)
export const HOMEBASE = { lat: 46.0130, lng: -91.4846, name: 'Hayward, WI' };

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} - Distance in miles
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate distance from homebase to a given point
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {number} - Distance in miles from homebase
 */
export function distanceFromHomebase(lat, lng) {
  return calculateDistance(HOMEBASE.lat, HOMEBASE.lng, lat, lng);
}

/**
 * Format distance for display
 * @param {number} miles - Distance in miles
 * @returns {string} - Formatted distance string
 */
export function formatDistance(miles) {
  if (miles === undefined || miles === null || !isFinite(miles)) {
    return 'N/A';
  }
  if (miles < 1) return '< 1 mi';
  if (miles < 100) return `${Math.round(miles)} mi`;
  return `${Math.round(miles).toLocaleString()} mi`;
}

/**
 * Get cardinal direction from one point to another
 * @param {number} lat1 - Starting latitude
 * @param {number} lng1 - Starting longitude
 * @param {number} lat2 - Ending latitude
 * @param {number} lng2 - Ending longitude
 * @returns {string} - Cardinal direction (N, NE, E, SE, S, SW, W, NW)
 */
export function getDirection(lat1, lng1, lat2, lng2) {
  const dLng = lng2 - lng1;
  const y = Math.sin(dLng * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng * Math.PI / 180);
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}
