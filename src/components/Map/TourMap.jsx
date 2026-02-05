import { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TourMap.css';
import { formatDateRange } from '../../data/sampleData';
import { useRoadRoute } from '../../hooks/useRoadRoute';

// Hayward, Wisconsin - Homebase
const HOMEBASE = {
  name: 'Hayward, WI (Homebase)',
  lat: 46.0130,
  lng: -91.4846
};

// Marker colors
const colors = {
  redTeam: '#c62828',
  blueTeam: '#1565c0',
  futureBooked: '#2e7d32',  // Green for future booked venues
  past: '#9e9e9e'           // Gray for past shows
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

// Route planning window (3 months)
const ROUTE_WINDOW_MONTHS = 3;

// Helper to get show date status based on startDate and endDate
const getShowDateStatus = (startDate, endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate || startDate);
  end.setHours(0, 0, 0, 0);

  const routeWindowEnd = new Date(today);
  routeWindowEnd.setMonth(routeWindowEnd.getMonth() + ROUTE_WINDOW_MONTHS);

  if (end < today) {
    return 'past'; // Show has completely ended
  } else if (start <= routeWindowEnd) {
    return 'upcoming'; // Starts within next 3 months - shows on route line
  } else {
    return 'future'; // Starts beyond 3 months - green marker
  }
};

// Calculate duration in days
const getDurationDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate || startDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

export default function TourMap({
  shows,
  selectedShowId,
  onSelectShow,
  showRouteLines = true
}) {
  // Categorize shows by date status
  const { pastShows, upcomingShows, futureShows, redTeamUpcoming, blueTeamUpcoming } = useMemo(() => {
    const past = [];
    const upcoming = [];
    const future = [];
    const redUpcoming = [];
    const blueUpcoming = [];

    shows.forEach(show => {
      if (!show.latitude || !show.longitude) return;

      const status = getShowDateStatus(show.startDate, show.endDate);

      if (status === 'past') {
        past.push(show);
      } else if (status === 'upcoming') {
        upcoming.push(show);
        if (show.tour === 'Red Team') {
          redUpcoming.push(show);
        } else {
          blueUpcoming.push(show);
        }
      } else {
        future.push(show);
      }
    });

    // Sort upcoming shows by startDate for route lines
    redUpcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    blueUpcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return {
      pastShows: past,
      upcomingShows: upcoming,
      futureShows: future,
      redTeamUpcoming: redUpcoming,
      blueTeamUpcoming: blueUpcoming
    };
  }, [shows]);

  // Create waypoints for upcoming shows within 3 months (starting and ending at homebase)
  const redWaypoints = useMemo(() => {
    if (redTeamUpcoming.length === 0) return [];
    return [
      [HOMEBASE.lat, HOMEBASE.lng],
      ...redTeamUpcoming.map(s => [s.latitude, s.longitude]),
      [HOMEBASE.lat, HOMEBASE.lng] // Return to homebase
    ];
  }, [redTeamUpcoming]);

  const blueWaypoints = useMemo(() => {
    if (blueTeamUpcoming.length === 0) return [];
    return [
      [HOMEBASE.lat, HOMEBASE.lng],
      ...blueTeamUpcoming.map(s => [s.latitude, s.longitude]),
      [HOMEBASE.lat, HOMEBASE.lng] // Return to homebase
    ];
  }, [blueTeamUpcoming]);

  // Fetch road-following routes from OSRM (with caching and fallback)
  const { route: redRoute, isLoading: redLoading, isRoadRoute: redIsRoad } = useRoadRoute(
    redWaypoints,
    { enabled: showRouteLines && redWaypoints.length >= 2 }
  );
  const { route: blueRoute, isLoading: blueLoading, isRoadRoute: blueIsRoad } = useRoadRoute(
    blueWaypoints,
    { enabled: showRouteLines && blueWaypoints.length >= 2 }
  );

  const isLoadingRoutes = redLoading || blueLoading;

  // Get all valid shows for bounds calculation
  const validShows = shows.filter(s => s.latitude && s.longitude);

  // Get marker icon based on show status
  const getMarkerIcon = (show) => {
    const status = getShowDateStatus(show.startDate, show.endDate);

    if (status === 'past') {
      return createIcon(colors.past, 'small');
    } else if (status === 'future') {
      return createIcon(colors.futureBooked, 'normal');
    } else {
      // Upcoming (within next 3 months) - use team colors
      return createIcon(show.tour === 'Red Team' ? colors.redTeam : colors.blueTeam, 'normal');
    }
  };

  // Get status label for popup
  const getStatusLabel = (show) => {
    const status = getShowDateStatus(show.startDate, show.endDate);
    const duration = getDurationDays(show.startDate, show.endDate);
    const durationStr = duration > 1 ? ` (${duration} days)` : '';

    if (status === 'past') return `Past Show${durationStr}`;
    if (status === 'future') return `Future Booking${durationStr}`;
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

        {/* Route lines - for upcoming shows within 3 months */}
        {/* Road routes shown as solid, straight-line fallbacks shown as dashed */}
        {showRouteLines && redRoute && redRoute.length > 1 && (
          <Polyline
            positions={redRoute}
            color={colors.redTeam}
            weight={3}
            opacity={0.8}
            dashArray={redIsRoad ? null : '10, 10'}
          />
        )}
        {showRouteLines && blueRoute && blueRoute.length > 1 && (
          <Polyline
            positions={blueRoute}
            color={colors.blueTeam}
            weight={3}
            opacity={0.8}
            dashArray={blueIsRoad ? null : '10, 10'}
          />
        )}

        {/* Past venue markers (smaller, gray) */}
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

        {/* Upcoming venue markers (within next 3 months - team colors, on route) */}
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

        {/* Future venue markers (beyond 3 months - green) */}
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
