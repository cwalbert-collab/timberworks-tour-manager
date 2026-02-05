import { useState, useMemo } from 'react';
import { getPricingRecommendations, distanceFromHomebase, mean } from '../../utils/insightsUtils';

export default function PricingRecommendations({ shows, venues }) {
  const [selectedVenueId, setSelectedVenueId] = useState('');

  const selectedVenue = useMemo(() => {
    return venues.find(v => v.id === selectedVenueId);
  }, [venues, selectedVenueId]);

  const recommendations = useMemo(() => {
    if (!selectedVenue) return null;
    return getPricingRecommendations(shows, venues, selectedVenue);
  }, [shows, venues, selectedVenue]);

  // Calculate pricing tiers across all venues
  const pricingTiers = useMemo(() => {
    const allFees = shows.map(s => s.performanceFee || 0).filter(f => f > 0);
    if (allFees.length === 0) return [];

    const sorted = [...allFees].sort((a, b) => a - b);
    const p25 = sorted[Math.floor(sorted.length * 0.25)];
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p75 = sorted[Math.floor(sorted.length * 0.75)];

    return [
      { label: 'Budget', range: `$0 - $${p25.toLocaleString()}`, color: '#757575' },
      { label: 'Standard', range: `$${p25.toLocaleString()} - $${p50.toLocaleString()}`, color: '#1565c0' },
      { label: 'Premium', range: `$${p50.toLocaleString()} - $${p75.toLocaleString()}`, color: '#2e7d32' },
      { label: 'Elite', range: `$${p75.toLocaleString()}+`, color: '#7b1fa2' }
    ];
  }, [shows]);

  // Get state-by-state pricing
  const statePricing = useMemo(() => {
    const stateData = {};
    shows.forEach(show => {
      const venue = venues.find(v => v.id === show.venueId);
      if (!venue?.state || !show.performanceFee) return;

      if (!stateData[venue.state]) {
        stateData[venue.state] = [];
      }
      stateData[venue.state].push(show.performanceFee);
    });

    return Object.entries(stateData)
      .map(([state, fees]) => ({
        state,
        avgFee: Math.round(mean(fees)),
        showCount: fees.length
      }))
      .sort((a, b) => b.avgFee - a.avgFee);
  }, [shows, venues]);

  // Get venue type pricing
  const typePricing = useMemo(() => {
    const typeData = {};
    shows.forEach(show => {
      const venue = venues.find(v => v.id === show.venueId);
      if (!venue?.type || !show.performanceFee) return;

      if (!typeData[venue.type]) {
        typeData[venue.type] = [];
      }
      typeData[venue.type].push(show.performanceFee);
    });

    return Object.entries(typeData)
      .map(([type, fees]) => ({
        type,
        avgFee: Math.round(mean(fees)),
        showCount: fees.length
      }))
      .sort((a, b) => b.avgFee - a.avgFee);
  }, [shows, venues]);

  const venueDistance = useMemo(() => {
    if (!selectedVenue) return null;
    return distanceFromHomebase(selectedVenue);
  }, [selectedVenue]);

  return (
    <div className="insight-section pricing-recommendations">
      <div className="insight-header">
        <h3>Pricing Recommendations</h3>
        <p className="insight-description">
          Get data-driven pricing suggestions based on venue type, location, distance, and historical performance.
        </p>
      </div>

      <div className="pricing-form">
        <label className="form-field">
          <span>Select Venue for Pricing Analysis</span>
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
      </div>

      {recommendations && selectedVenue && (
        <div className="recommendation-results">
          <div className="recommendation-main">
            <div className="suggested-price">
              <span className="price-label">Suggested Performance Fee</span>
              <span className="price-value">
                ${recommendations.suggestedFee?.toLocaleString() || 'N/A'}
              </span>
              {recommendations.suggestedRange?.min && (
                <span className="price-range">
                  Range: ${recommendations.suggestedRange.min.toLocaleString()} - ${recommendations.suggestedRange.max.toLocaleString()}
                </span>
              )}
            </div>

            <div className="venue-details">
              <h4>Venue Profile</h4>
              <div className="venue-info-grid">
                <div className="info-item">
                  <span className="info-label">Type</span>
                  <span className="info-value">{selectedVenue.type || 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Location</span>
                  <span className="info-value">{selectedVenue.city}, {selectedVenue.state}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Distance</span>
                  <span className="info-value">
                    {venueDistance ? `${Math.round(venueDistance)} mi from homebase` : 'Unknown'}
                  </span>
                </div>
                {selectedVenue.capacity && (
                  <div className="info-item">
                    <span className="info-label">Capacity</span>
                    <span className="info-value">{selectedVenue.capacity.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {recommendations.factors?.length > 0 && (
            <div className="pricing-factors">
              <h4>Price Adjustment Factors</h4>
              <div className="factors-list">
                {recommendations.factors.map((factor, idx) => (
                  <div key={idx} className="factor-item">
                    <span className="factor-name">{factor.name}</span>
                    <span className={`factor-adjustment ${factor.adjustment.startsWith('+') ? 'positive' : factor.adjustment.startsWith('-') ? 'negative' : ''}`}>
                      {factor.adjustment}
                    </span>
                    <span className="factor-basis">{factor.basedOn}</span>
                    {factor.average && (
                      <span className="factor-avg">Avg: ${factor.average.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.comparisons?.length > 0 && (
            <div className="comparable-venues">
              <h4>Similar Venues for Comparison</h4>
              <div className="comparisons-table">
                <div className="comparison-header">
                  <span>Venue</span>
                  <span>Location</span>
                  <span>Avg Fee</span>
                  <span>Shows</span>
                </div>
                {recommendations.comparisons.map((comp, idx) => (
                  <div key={idx} className="comparison-row">
                    <span className="comp-name">{comp.venueName}</span>
                    <span className="comp-location">{comp.city}, {comp.state}</span>
                    <span className="comp-fee">${comp.avgFee.toLocaleString()}</span>
                    <span className="comp-count">{comp.showCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pricing-overview">
        <div className="overview-section">
          <h4>Your Pricing Tiers</h4>
          <div className="tiers-display">
            {pricingTiers.map((tier, idx) => (
              <div key={idx} className="tier-card" style={{ borderLeftColor: tier.color }}>
                <span className="tier-label">{tier.label}</span>
                <span className="tier-range">{tier.range}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-row">
          <div className="overview-section">
            <h4>Average by Venue Type</h4>
            <div className="pricing-list">
              {typePricing.slice(0, 6).map(({ type, avgFee, showCount }) => (
                <div key={type} className="pricing-row">
                  <span className="pricing-name">{type}</span>
                  <span className="pricing-value">${avgFee.toLocaleString()}</span>
                  <span className="pricing-count">{showCount} shows</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overview-section">
            <h4>Average by State</h4>
            <div className="pricing-list">
              {statePricing.slice(0, 6).map(({ state, avgFee, showCount }) => (
                <div key={state} className="pricing-row">
                  <span className="pricing-name">{state}</span>
                  <span className="pricing-value">${avgFee.toLocaleString()}</span>
                  <span className="pricing-count">{showCount} shows</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-tips">
        <h4>Pricing Strategy Tips</h4>
        <ul>
          <li><strong>Distance premium:</strong> Add 5-15% for venues over 300 miles from homebase to cover travel costs</li>
          <li><strong>Multi-day discount:</strong> Consider offering 10-15% discount for 2+ day bookings at same venue</li>
          <li><strong>Peak season:</strong> Summer fairs and festivals often support 10-20% higher fees</li>
          <li><strong>Repeat business:</strong> Lock in returning venues at a consistent rate for loyalty</li>
          <li><strong>Package deals:</strong> Offer discounted rates when booking nearby venues together</li>
        </ul>
      </div>
    </div>
  );
}
