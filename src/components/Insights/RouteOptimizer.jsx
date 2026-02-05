import { useState, useMemo } from 'react';
import { optimizeRoute, distanceFromHomebase, HOMEBASE } from '../../utils/insightsUtils';

export default function RouteOptimizer({ shows, venues }) {
  const [selectedShowIds, setSelectedShowIds] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterMode, setFilterMode] = useState('manual'); // 'manual' or 'dateRange'

  // Get future shows for selection
  const futureShows = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return shows
      .filter(s => s.startDate >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [shows]);

  // Get shows in date range
  const showsInRange = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return [];
    return shows.filter(s =>
      s.startDate >= dateRange.start && s.startDate <= dateRange.end
    ).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [shows, dateRange]);

  // Get venues for selected shows
  const selectedVenues = useMemo(() => {
    const showsToUse = filterMode === 'manual'
      ? shows.filter(s => selectedShowIds.includes(s.id))
      : showsInRange;

    return showsToUse.map(show => {
      const venue = venues.find(v => v.id === show.venueId);
      if (!venue) return null;
      return {
        ...venue,
        showId: show.id,
        showDate: show.startDate,
        showEndDate: show.endDate
      };
    }).filter(Boolean);
  }, [shows, venues, selectedShowIds, showsInRange, filterMode]);

  // Calculate optimized route
  const optimization = useMemo(() => {
    return optimizeRoute(selectedVenues);
  }, [selectedVenues]);

  const handleShowToggle = (showId) => {
    setSelectedShowIds(prev =>
      prev.includes(showId)
        ? prev.filter(id => id !== showId)
        : [...prev, showId]
    );
  };

  const handleSelectAll = () => {
    setSelectedShowIds(futureShows.map(s => s.id));
  };

  const handleClearAll = () => {
    setSelectedShowIds([]);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="insight-section route-optimizer">
      <div className="insight-header">
        <h3>Route Optimizer</h3>
        <p className="insight-description">
          Find the most efficient travel route between your shows using the nearest-neighbor algorithm.
          Starts and ends at homebase (Hayward, WI).
        </p>
      </div>

      <div className="route-controls">
        <div className="filter-mode-toggle">
          <button
            className={`mode-btn ${filterMode === 'manual' ? 'active' : ''}`}
            onClick={() => setFilterMode('manual')}
          >
            Select Shows
          </button>
          <button
            className={`mode-btn ${filterMode === 'dateRange' ? 'active' : ''}`}
            onClick={() => setFilterMode('dateRange')}
          >
            Date Range
          </button>
        </div>

        {filterMode === 'dateRange' && (
          <div className="date-range-inputs">
            <label>
              From:
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </label>
            <label>
              To:
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </label>
            {showsInRange.length > 0 && (
              <span className="range-count">{showsInRange.length} shows in range</span>
            )}
          </div>
        )}

        {filterMode === 'manual' && (
          <div className="show-selection">
            <div className="selection-actions">
              <button className="btn-small" onClick={handleSelectAll}>
                Select All Future
              </button>
              <button className="btn-small" onClick={handleClearAll}>
                Clear
              </button>
              <span className="selection-count">
                {selectedShowIds.length} selected
              </span>
            </div>
            <div className="show-list">
              {futureShows.length === 0 ? (
                <p className="no-data">No future shows scheduled</p>
              ) : (
                futureShows.map(show => {
                  const venue = venues.find(v => v.id === show.venueId);
                  return (
                    <label key={show.id} className="show-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedShowIds.includes(show.id)}
                        onChange={() => handleShowToggle(show.id)}
                      />
                      <span className="show-info">
                        <span className="show-date">{formatDate(show.startDate)}</span>
                        <span className="show-venue">{venue?.name || 'Unknown'}</span>
                        <span className="show-location">{venue?.city}, {venue?.state}</span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {selectedVenues.length > 0 && (
        <div className="route-results">
          <div className="route-summary">
            <div className="summary-card savings">
              <span className="summary-label">Distance Saved</span>
              <span className="summary-value">
                {optimization.savings > 0 ? (
                  <>
                    {optimization.savings.toLocaleString()} mi
                    <span className="savings-percent">({optimization.savingsPercent}% less)</span>
                  </>
                ) : (
                  'Already optimal'
                )}
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Optimized Distance</span>
              <span className="summary-value">{optimization.totalDistance.toLocaleString()} mi</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Original Distance</span>
              <span className="summary-value">{optimization.originalDistance.toLocaleString()} mi</span>
            </div>
          </div>

          <div className="route-display">
            <h4>Optimized Route</h4>
            <div className="route-stops">
              <div className="route-stop homebase">
                <span className="stop-icon">★</span>
                <div className="stop-info">
                  <span className="stop-name">{HOMEBASE.name}</span>
                  <span className="stop-detail">Starting Point</span>
                </div>
              </div>

              {optimization.route.map((venue, idx) => (
                <div key={venue.id} className="route-stop">
                  <span className="stop-number">{idx + 1}</span>
                  <div className="stop-info">
                    <span className="stop-name">{venue.name}</span>
                    <span className="stop-detail">
                      {venue.city}, {venue.state}
                      {venue.showDate && ` • ${formatDate(venue.showDate)}`}
                    </span>
                  </div>
                  <span className="stop-distance">
                    {Math.round(venue.distanceFromPrevious)} mi
                  </span>
                </div>
              ))}

              <div className="route-stop homebase">
                <span className="stop-icon">★</span>
                <div className="stop-info">
                  <span className="stop-name">{HOMEBASE.name}</span>
                  <span className="stop-detail">Return</span>
                </div>
              </div>
            </div>
          </div>

          <div className="route-tips">
            <h4>Tips</h4>
            <ul>
              <li>Consider booking shows along the optimized route to maximize efficiency</li>
              <li>The algorithm minimizes total driving distance, not necessarily time</li>
              <li>Multi-day shows at the same venue count as one stop</li>
            </ul>
          </div>
        </div>
      )}

      {selectedVenues.length === 0 && (
        <div className="empty-state">
          <p>Select shows above to calculate the optimal route</p>
        </div>
      )}
    </div>
  );
}
