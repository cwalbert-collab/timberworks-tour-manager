import { useState, useMemo } from 'react';
import { predictRevenue, getSeason, mean } from '../../utils/insightsUtils';

export default function RevenuePrediction({ shows, venues }) {
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const selectedVenue = useMemo(() => {
    return venues.find(v => v.id === selectedVenueId);
  }, [venues, selectedVenueId]);

  const prediction = useMemo(() => {
    if (!selectedVenue) return null;
    return predictRevenue(shows, venues, selectedVenue, targetDate || null);
  }, [shows, venues, selectedVenue, targetDate]);

  // Get venue history
  const venueHistory = useMemo(() => {
    if (!selectedVenueId) return [];
    return shows
      .filter(s => s.venueId === selectedVenueId)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [shows, selectedVenueId]);

  // Calculate seasonal trends
  const seasonalTrends = useMemo(() => {
    const seasons = { spring: [], summer: [], fall: [], winter: [] };
    shows.forEach(show => {
      const season = getSeason(show.startDate);
      const revenue = (show.performanceFee || 0) + (show.merchandiseSales || 0);
      if (revenue > 0) {
        seasons[season].push(revenue);
      }
    });
    return Object.entries(seasons).map(([season, revenues]) => ({
      season,
      avgRevenue: revenues.length > 0 ? Math.round(mean(revenues)) : 0,
      showCount: revenues.length
    }));
  }, [shows]);

  // Get venue type averages
  const venueTypeStats = useMemo(() => {
    const types = {};
    shows.forEach(show => {
      const venue = venues.find(v => v.id === show.venueId);
      if (!venue?.type) return;
      if (!types[venue.type]) {
        types[venue.type] = { revenues: [], fees: [], merch: [] };
      }
      types[venue.type].revenues.push((show.performanceFee || 0) + (show.merchandiseSales || 0));
      types[venue.type].fees.push(show.performanceFee || 0);
      types[venue.type].merch.push(show.merchandiseSales || 0);
    });
    return Object.entries(types).map(([type, data]) => ({
      type,
      avgRevenue: Math.round(mean(data.revenues)),
      avgFee: Math.round(mean(data.fees)),
      avgMerch: Math.round(mean(data.merch)),
      showCount: data.revenues.length
    })).sort((a, b) => b.avgRevenue - a.avgRevenue);
  }, [shows, venues]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 75) return '#2e7d32';
    if (confidence >= 50) return '#f57c00';
    return '#c62828';
  };

  return (
    <div className="insight-section revenue-prediction">
      <div className="insight-header">
        <h3>Revenue Prediction</h3>
        <p className="insight-description">
          Forecast expected revenue for a venue based on historical data, venue type, location, and seasonality.
        </p>
      </div>

      <div className="prediction-form">
        <div className="form-row">
          <label className="form-field">
            <span>Select Venue</span>
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
            >
              <option value="">Choose a venue...</option>
              {venues
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}, {venue.state}
                  </option>
                ))}
            </select>
          </label>

          <label className="form-field">
            <span>Target Date (optional)</span>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </label>
        </div>
      </div>

      {prediction && (
        <div className="prediction-results">
          <div className="prediction-main">
            <div className="predicted-revenue">
              <span className="prediction-label">Predicted Revenue</span>
              <span className="prediction-value">
                ${prediction.predicted.toLocaleString()}
              </span>
              <div
                className="confidence-badge"
                style={{ backgroundColor: getConfidenceColor(prediction.confidence) }}
              >
                {prediction.confidence}% confidence
              </div>
            </div>

            <div className="prediction-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Est. Performance Fee</span>
                <span className="breakdown-value">
                  ${prediction.breakdown.estimatedFee.toLocaleString()}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Est. Merchandise</span>
                <span className="breakdown-value">
                  ${prediction.breakdown.estimatedMerch.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="prediction-factors">
            <h4>Prediction Factors</h4>
            <div className="factors-grid">
              {prediction.factors.venueType !== null && (
                <div className="factor-card">
                  <span className="factor-icon">🏢</span>
                  <span className="factor-name">Venue Type ({selectedVenue?.type})</span>
                  <span className="factor-value">${prediction.factors.venueType.toLocaleString()}</span>
                </div>
              )}
              {prediction.factors.state !== null && (
                <div className="factor-card">
                  <span className="factor-icon">📍</span>
                  <span className="factor-name">State ({selectedVenue?.state})</span>
                  <span className="factor-value">${prediction.factors.state.toLocaleString()}</span>
                </div>
              )}
              {prediction.factors.season !== null && targetDate && (
                <div className="factor-card">
                  <span className="factor-icon">📅</span>
                  <span className="factor-name">Season ({getSeason(targetDate)})</span>
                  <span className="factor-value">${prediction.factors.season.toLocaleString()}</span>
                </div>
              )}
              <div className="factor-card">
                <span className="factor-icon">📊</span>
                <span className="factor-name">Overall Average</span>
                <span className="factor-value">${prediction.factors.overall.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {venueHistory.length > 0 && (
            <div className="venue-history">
              <h4>Previous Shows at {selectedVenue?.name}</h4>
              <div className="history-list">
                {venueHistory.slice(0, 5).map(show => (
                  <div key={show.id} className="history-item">
                    <span className="history-date">{formatDate(show.startDate)}</span>
                    <span className="history-revenue">
                      ${((show.performanceFee || 0) + (show.merchandiseSales || 0)).toLocaleString()}
                    </span>
                    <span className="history-detail">
                      Fee: ${(show.performanceFee || 0).toLocaleString()} | Merch: ${(show.merchandiseSales || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="trends-section">
        <div className="trends-row">
          <div className="trend-card">
            <h4>Seasonal Trends</h4>
            <div className="trend-bars">
              {seasonalTrends.map(({ season, avgRevenue, showCount }) => {
                const maxRevenue = Math.max(...seasonalTrends.map(t => t.avgRevenue));
                const width = maxRevenue > 0 ? (avgRevenue / maxRevenue) * 100 : 0;
                return (
                  <div key={season} className="trend-bar-row">
                    <span className="trend-label">{season.charAt(0).toUpperCase() + season.slice(1)}</span>
                    <div className="trend-bar-container">
                      <div
                        className={`trend-bar season-${season}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="trend-value">
                      ${avgRevenue.toLocaleString()}
                      <span className="trend-count">({showCount})</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="trend-card">
            <h4>Revenue by Venue Type</h4>
            <div className="type-stats">
              {venueTypeStats.slice(0, 6).map(({ type, avgRevenue, showCount }) => (
                <div key={type} className="type-stat-row">
                  <span className="type-name">{type}</span>
                  <span className="type-revenue">${avgRevenue.toLocaleString()}</span>
                  <span className="type-count">{showCount} shows</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
