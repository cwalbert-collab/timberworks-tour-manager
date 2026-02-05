import { useState, useMemo } from 'react';
import { suggestSchedulingDates, calculateDistance, distanceFromHomebase } from '../../utils/insightsUtils';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function SmartScheduling({ shows, venues }) {
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const selectedVenue = useMemo(() => {
    return venues.find(v => v.id === selectedVenueId);
  }, [venues, selectedVenueId]);

  const suggestions = useMemo(() => {
    if (!selectedVenue) return [];
    return suggestSchedulingDates(shows, venues, selectedVenue, selectedMonth);
  }, [shows, venues, selectedVenue, selectedMonth]);

  // Get calendar view of the month
  const calendarDays = useMemo(() => {
    const year = new Date().getFullYear();
    const firstDay = new Date(year, selectedMonth, 1);
    const lastDay = new Date(year, selectedMonth + 1, 0);
    const startPadding = firstDay.getDay();

    const days = [];
    // Padding for start of month
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: null, isPadding: true });
    }

    // Actual days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const suggestion = suggestions.find(s => s.date === dateStr);
      const hasShow = shows.some(s => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate || s.startDate);
        const current = new Date(dateStr);
        return current >= start && current <= end;
      });

      days.push({
        date: dateStr,
        day: d,
        dayOfWeek: new Date(dateStr).getDay(),
        suggestion,
        hasShow,
        isWeekend: new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6
      });
    }

    return days;
  }, [selectedMonth, suggestions, shows]);

  // Find nearby venue suggestions
  const nearbyVenues = useMemo(() => {
    if (!selectedVenue || !selectedVenue.latitude || !selectedVenue.longitude) return [];

    return venues
      .filter(v => v.id !== selectedVenue.id && v.latitude && v.longitude)
      .map(v => ({
        ...v,
        distance: calculateDistance(
          selectedVenue.latitude, selectedVenue.longitude,
          v.latitude, v.longitude
        )
      }))
      .filter(v => v.distance < 200) // Within 200 miles
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [venues, selectedVenue]);

  // Get scheduling tips based on venue
  const schedulingTips = useMemo(() => {
    if (!selectedVenue) return [];

    const tips = [];
    const distance = distanceFromHomebase(selectedVenue);

    if (distance && distance > 300) {
      tips.push({
        icon: '🚗',
        text: `Long drive (${Math.round(distance)} mi from homebase) - consider booking nearby venues on the same trip`
      });
    }

    if (selectedVenue.type === 'Fair/Festival') {
      tips.push({
        icon: '🎪',
        text: 'Fairs typically book 6-12 months in advance. Contact early!'
      });
    }

    if (selectedVenue.type === 'Corporate Event') {
      tips.push({
        icon: '💼',
        text: 'Corporate events often have flexible dates. Propose dates that work with your route.'
      });
    }

    // Check if venue has been visited before
    const previousShows = shows.filter(s => s.venueId === selectedVenue.id);
    if (previousShows.length > 0) {
      const lastShow = previousShows.sort((a, b) =>
        new Date(b.startDate) - new Date(a.startDate)
      )[0];
      tips.push({
        icon: '📅',
        text: `Last show here: ${new Date(lastShow.startDate).toLocaleDateString()}. Consider booking similar timing.`
      });
    }

    // Weekend recommendation
    tips.push({
      icon: '📊',
      text: 'Weekends (Fri-Sat) typically have 20-30% higher attendance for public shows.'
    });

    return tips;
  }, [selectedVenue, shows]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#2e7d32';
    if (score >= 65) return '#558b2f';
    if (score >= 50) return '#f57c00';
    return '#757575';
  };

  return (
    <div className="insight-section smart-scheduling">
      <div className="insight-header">
        <h3>Smart Scheduling</h3>
        <p className="insight-description">
          Find optimal dates to book a venue based on existing schedule, travel efficiency, and historical patterns.
        </p>
      </div>

      <div className="scheduling-form">
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
            <span>Target Month</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {MONTHS.map((month, idx) => (
                <option key={month} value={idx}>{month}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {selectedVenue && (
        <div className="scheduling-results">
          <div className="calendar-view">
            <h4>{MONTHS[selectedMonth]} {new Date().getFullYear()}</h4>
            <div className="calendar-header">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-day-name">{day}</div>
              ))}
            </div>
            <div className="calendar-grid">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`calendar-cell ${day.isPadding ? 'padding' : ''} ${day.hasShow ? 'has-show' : ''} ${day.isWeekend ? 'weekend' : ''} ${day.suggestion ? 'suggested' : ''}`}
                  style={day.suggestion ? { borderColor: getScoreColor(day.suggestion.score) } : {}}
                >
                  {!day.isPadding && (
                    <>
                      <span className="cell-day">{day.day}</span>
                      {day.hasShow && <span className="cell-indicator show">●</span>}
                      {day.suggestion && !day.hasShow && (
                        <span
                          className="cell-score"
                          style={{ color: getScoreColor(day.suggestion.score) }}
                        >
                          {day.suggestion.score}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="calendar-legend">
              <span className="legend-item"><span className="legend-dot show">●</span> Existing Show</span>
              <span className="legend-item"><span className="legend-dot suggested">●</span> Suggested Date</span>
              <span className="legend-item"><span className="legend-dot weekend">●</span> Weekend</span>
            </div>
          </div>

          <div className="top-suggestions">
            <h4>Top Recommended Dates</h4>
            {suggestions.length === 0 ? (
              <p className="no-suggestions">No available dates this month (all days have shows)</p>
            ) : (
              <div className="suggestions-list">
                {suggestions.slice(0, 5).map((suggestion, idx) => (
                  <div key={suggestion.date} className="suggestion-card">
                    <div className="suggestion-rank">#{idx + 1}</div>
                    <div className="suggestion-info">
                      <span className="suggestion-date">
                        {suggestion.dayOfWeek}, {new Date(suggestion.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span
                        className="suggestion-score"
                        style={{ color: getScoreColor(suggestion.score) }}
                      >
                        Score: {suggestion.score}
                      </span>
                    </div>
                    <ul className="suggestion-reasons">
                      {suggestion.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {schedulingTips.length > 0 && (
            <div className="scheduling-tips">
              <h4>Scheduling Tips</h4>
              <ul className="tips-list">
                {schedulingTips.map((tip, idx) => (
                  <li key={idx}>
                    <span className="tip-icon">{tip.icon}</span>
                    <span className="tip-text">{tip.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {nearbyVenues.length > 0 && (
            <div className="nearby-venues">
              <h4>Consider Booking Together</h4>
              <p className="nearby-subtitle">
                These venues are within 200 miles - book them on the same trip!
              </p>
              <div className="nearby-list">
                {nearbyVenues.map(venue => (
                  <div key={venue.id} className="nearby-card">
                    <span className="nearby-name">{venue.name}</span>
                    <span className="nearby-location">{venue.city}, {venue.state}</span>
                    <span className="nearby-distance">{Math.round(venue.distance)} mi away</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedVenue && (
        <div className="empty-state">
          <p>Select a venue to see scheduling recommendations</p>
        </div>
      )}
    </div>
  );
}
