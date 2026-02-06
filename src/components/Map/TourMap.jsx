import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TourMap.css';
import { formatDateRange } from '../../data/sampleData';
import { useRoadRoute } from '../../hooks/useRoadRoute';

// Hayward, Wisconsin - Homebase (configurable for future changes)
const HOMEBASE = {
  name: 'Hayward, WI (Homebase)',
  lat: 46.0130,
  lng: -91.4846
};

// Route planning windows
const FIRST_MONTH_DAYS = 30;   // Next month = solid lines
const SECOND_MONTH_DAYS = 60;  // Following month = dotted lines

// Marker colors
const colors = {
  redTeam: '#c62828',
  blueTeam: '#1565c0',
  futureBooked: '#2e7d32',  // Green for future confirmed bookings
  past: '#9e9e9e'           // Gray for past shows (no team distinction)
};

// Custom marker icons with size option
const createIcon = (color, size = 'normal') => {
  const isSmall = size === 'small';
  const pinSize = isSmall ? 16 : 24;

  return L.divIcon({
    className: `custom-marker ${isSmall ? 'small' : ''}`,
    html: `<div class="marker-pin ${size}" style="background-color: ${color}; width: ${pinSize}px; height: ${pinSize}px;"></div>`,
    iconSize: [pinSize, pinSize * 1.5],
    iconAnchor: [pinSize / 2, pinSize * 1.5],
    popupAnchor: [0, -pinSize * 1.5]
  });
};

const createStarIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-star">★</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const starIcon = createStarIcon();

// Component to fit map bounds to markers
function FitBounds({ shows }) {
  const map = useMap();

  useMemo(() => {
    if (shows.length === 0) return;

    const validShows = shows.filter(s => s.latitude && s.longitude);
    if (validShows.length === 0) return;

    const bounds = L.latLngBounds([
      [HOMEBASE.lat, HOMEBASE.lng],
      ...validShows.map(s => [s.latitude, s.longitude])
    ]);

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [shows, map]);

  return null;
}

// Helper to normalize date string to avoid timezone issues
const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  // Add T12:00:00 if it's just a date string to avoid timezone midnight issues
  return dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00';
};

// Helper to get show date status based on startDate and endDate
const getShowDateStatus = (startDate, endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startNorm = normalizeDate(startDate);
  const endNorm = normalizeDate(endDate || startDate);

  if (!startNorm) return 'past'; // No date = treat as past

  const start = new Date(startNorm);
  const end = new Date(endNorm);

  // Handle invalid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'past';

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const firstMonthEnd = new Date(today);
  firstMonthEnd.setDate(firstMonthEnd.getDate() + FIRST_MONTH_DAYS);

  const secondMonthEnd = new Date(today);
  secondMonthEnd.setDate(secondMonthEnd.getDate() + SECOND_MONTH_DAYS);

  if (end < today) {
    return 'past'; // Show has completely ended
  } else if (start <= firstMonthEnd) {
    return 'firstMonth'; // Within next month - solid route line
  } else if (start <= secondMonthEnd) {
    return 'secondMonth'; // Within following month - dotted route line
  } else {
    return 'future'; // Beyond 2 months - green marker, no route
  }
};

// Calculate duration in days
const getDurationDays = (startDate, endDate) => {
  const startNorm = normalizeDate(startDate);
  const endNorm = normalizeDate(endDate || startDate);
  if (!startNorm) return 1;

  const start = new Date(startNorm);
  const end = new Date(endNorm);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Build waypoints for a list of shows including homebase at start and end.
 */
const buildWaypoints = (shows) => {
  if (!shows || shows.length === 0) return [];
  return [
    [HOMEBASE.lat, HOMEBASE.lng],
    ...shows.map(s => [s.latitude, s.longitude]),
    [HOMEBASE.lat, HOMEBASE.lng]
  ];
};

export default function TourMap({
  shows,
  selectedShowId,
  onSelectShow,
  showRouteLines = true
}) {
  // Categorize shows by date status and team
  const {
    pastShows,
    upcomingShows,
    futureShows,
    redFirstMonth,
    redSecondMonth,
    blueFirstMonth,
    blueSecondMonth
  } = useMemo(() => {
    const past = [];
    const upcoming = [];  // All shows within 2 months (for markers)
    const future = [];
    const redFirst = [];
    const redSecond = [];
    const blueFirst = [];
    const blueSecond = [];

    shows.forEach(show => {
      if (!show.latitude || !show.longitude) return;

      const status = getShowDateStatus(show.startDate, show.endDate);

      if (status === 'past') {
        past.push(show);
      } else if (status === 'firstMonth') {
        upcoming.push(show);
        if (show.tour === 'Red Team') {
          redFirst.push(show);
        } else {
          blueFirst.push(show);
        }
      } else if (status === 'secondMonth') {
        upcoming.push(show);
        if (show.tour === 'Red Team') {
          redSecond.push(show);
        } else {
          blueSecond.push(show);
        }
      } else {
        future.push(show);
      }
    });

    // Sort by startDate for proper route ordering
    const sortByDate = (a, b) => new Date(a.startDate) - new Date(b.startDate);
    redFirst.sort(sortByDate);
    redSecond.sort(sortByDate);
    blueFirst.sort(sortByDate);
    blueSecond.sort(sortByDate);

    return {
      pastShows: past,
      upcomingShows: upcoming,
      futureShows: future,
      redFirstMonth: redFirst,
      redSecondMonth: redSecond,
      blueFirstMonth: blueFirst,
      blueSecondMonth: blueSecond
    };
  }, [shows]);

  // Build waypoints for each route segment
  const redFirstWaypoints = useMemo(() => buildWaypoints(redFirstMonth), [redFirstMonth]);
  const redSecondWaypoints = useMemo(() => buildWaypoints(redSecondMonth), [redSecondMonth]);
  const blueFirstWaypoints = useMemo(() => buildWaypoints(blueFirstMonth), [blueFirstMonth]);
  const blueSecondWaypoints = useMemo(() => buildWaypoints(blueSecondMonth), [blueSecondMonth]);

  // Fetch road-following routes from OSRM for all route segments
  const { route: redFirstRoute, isLoading: redFirstLoading } = useRoadRoute(
    redFirstWaypoints,
    { enabled: showRouteLines && redFirstWaypoints.length >= 2 }
  );
  const { route: redSecondRoute, isLoading: redSecondLoading } = useRoadRoute(
    redSecondWaypoints,
    { enabled: showRouteLines && redSecondWaypoints.length >= 2 }
  );
  const { route: blueFirstRoute, isLoading: blueFirstLoading } = useRoadRoute(
    blueFirstWaypoints,
    { enabled: showRouteLines && blueFirstWaypoints.length >= 2 }
  );
  const { route: blueSecondRoute, isLoading: blueSecondLoading } = useRoadRoute(
    blueSecondWaypoints,
    { enabled: showRouteLines && blueSecondWaypoints.length >= 2 }
  );

  const isLoadingRoutes = redFirstLoading || redSecondLoading || blueFirstLoading || blueSecondLoading;

  // Get all valid shows for bounds calculation
  const validShows = shows.filter(s => s.latitude && s.longitude);

  // Get marker icon based on show status
  const getMarkerIcon = (show) => {
    const status = getShowDateStatus(show.startDate, show.endDate);

    if (status === 'past') {
      return createIcon(colors.past, 'small');  // Gray, no team distinction
    } else if (status === 'future') {
      return createIcon(colors.futureBooked, 'normal');  // Green
    } else {
      // Within 2 months - use team colors
      return createIcon(show.tour === 'Red Team' ? colors.redTeam : colors.blueTeam, 'normal');
    }
  };

  // Get status label for popup
  const getStatusLabel = (show) => {
    const status = getShowDateStatus(show.startDate, show.endDate);
    const duration = getDurationDays(show.startDate, show.endDate);
    const durationStr = duration > 1 ? ` (${duration} days)` : '';

    if (status === 'past') return `Past Show${durationStr}`;
    if (status === 'future') return `Future Confirmed${durationStr}`;
    return `Upcoming${durationStr}`;
  };

  // Default center (US center)
  const defaultCenter = [39.8283, -98.5795];
  const defaultZoom = 4;

  return (
    <div className="tour-map-container">
      {isLoadingRoutes && (
        <div className="route-loading-indicator">
          Loading road routes...
        </div>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="tour-map"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds to show all markers */}
        <FitBounds shows={validShows} />

        {/* Homebase star marker */}
        <Marker position={[HOMEBASE.lat, HOMEBASE.lng]} icon={starIcon}>
          <Popup>
            <div className="popup-content homebase">
              <strong>{HOMEBASE.name}</strong>
              <p>Tour Headquarters</p>
            </div>
          </Popup>
        </Marker>

        {/* First month routes - SOLID lines (road-following) */}
        {showRouteLines && redFirstRoute && redFirstRoute.length > 1 && (
          <Polyline
            positions={redFirstRoute}
            color={colors.redTeam}
            weight={3}
            opacity={0.9}
          />
        )}
        {showRouteLines && blueFirstRoute && blueFirstRoute.length > 1 && (
          <Polyline
            positions={blueFirstRoute}
            color={colors.blueTeam}
            weight={3}
            opacity={0.9}
          />
        )}

        {/* Second month routes - DOTTED lines (road-following) */}
        {showRouteLines && redSecondRoute && redSecondRoute.length > 1 && (
          <Polyline
            positions={redSecondRoute}
            color={colors.redTeam}
            weight={2}
            opacity={0.6}
            dashArray="5, 10"
          />
        )}
        {showRouteLines && blueSecondRoute && blueSecondRoute.length > 1 && (
          <Polyline
            positions={blueSecondRoute}
            color={colors.blueTeam}
            weight={2}
            opacity={0.6}
            dashArray="5, 10"
          />
        )}

        {/* Past venue markers (smaller, gray - no team distinction) */}
        {pastShows.map(show => (
          <Marker
            key={show.id}
            position={[show.latitude, show.longitude]}
            icon={getMarkerIcon(show)}
            eventHandlers={{
              click: () => onSelectShow && onSelectShow(show)
            }}
          >
            <Popup>
              <div className="popup-content past-show">
                <span className="popup-status past">{getStatusLabel(show)}</span>
                <span className={`popup-tour ${show.tour === 'Red Team' ? 'red' : 'blue'}`}>
                  {show.tour}
                </span>
                <strong>{show.venueName}</strong>
                <p>{show.city}, {show.state}</p>
                <p className="popup-date">{formatDateRange(show.startDate, show.endDate)}</p>
                <p className="popup-fee">${show.performanceFee.toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Upcoming venue markers (within 2 months - team colors) */}
        {upcomingShows.map(show => (
          <Marker
            key={show.id}
            position={[show.latitude, show.longitude]}
            icon={getMarkerIcon(show)}
            eventHandlers={{
              click: () => onSelectShow && onSelectShow(show)
            }}
          >
            <Popup>
              <div className={`popup-content ${show.tour === 'Red Team' ? 'red-team' : 'blue-team'}`}>
                <span className="popup-status upcoming">{getStatusLabel(show)}</span>
                <span className="popup-tour">{show.tour}</span>
                <strong>{show.venueName}</strong>
                <p>{show.city}, {show.state}</p>
                <p className="popup-date">{formatDateRange(show.startDate, show.endDate)}</p>
                <p className="popup-fee">${show.performanceFee.toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Future venue markers (beyond 2 months - green) */}
        {futureShows.map(show => (
          <Marker
            key={show.id}
            position={[show.latitude, show.longitude]}
            icon={getMarkerIcon(show)}
            eventHandlers={{
              click: () => onSelectShow && onSelectShow(show)
            }}
          >
            <Popup>
              <div className="popup-content future-show">
                <span className="popup-status future">{getStatusLabel(show)}</span>
                <span className={`popup-tour ${show.tour === 'Red Team' ? 'red' : 'blue'}`}>
                  {show.tour}
                </span>
                <strong>{show.venueName}</strong>
                <p>{show.city}, {show.state}</p>
                <p className="popup-date">{formatDateRange(show.startDate, show.endDate)}</p>
                <p className="popup-fee">${show.performanceFee.toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
