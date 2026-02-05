import { useState, useMemo, useCallback } from 'react';
import { exportShows } from '../../utils/exportUtils';
import './Calendar.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

// Generate Outlook calendar URL for a show
const generateOutlookCalendarUrl = (show, venue) => {
  const startDate = new Date(show.startDate + 'T' + (show.showTime || '10:00'));
  const endDate = show.endDate
    ? new Date(show.endDate + 'T' + (show.showTime || '18:00'))
    : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hour default

  // Format dates for Outlook URL (ISO format)
  const formatDateForOutlook = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const location = venue
    ? `${venue.name}, ${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`
    : `${show.venueName || 'Venue'}, ${show.city || ''}, ${show.state || ''}`;

  const subject = encodeURIComponent(`Lumberjack Show - ${show.venueName || venue?.name || 'Show'} (${show.tour})`);
  const body = encodeURIComponent(
    `Show Details:\n` +
    `Team: ${show.tour}\n` +
    `Venue: ${show.venueName || venue?.name}\n` +
    `Location: ${location}\n` +
    `Performance Fee: $${show.performanceFee?.toLocaleString() || 'TBD'}\n` +
    (show.notes ? `\nNotes: ${show.notes}` : '')
  );
  const locationEncoded = encodeURIComponent(location);

  // Outlook Web URL format
  return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${subject}&body=${body}&location=${locationEncoded}&startdt=${formatDateForOutlook(startDate)}&enddt=${formatDateForOutlook(endDate)}`;
};

// Generate ICS file content for download
const generateICSContent = (show, venue) => {
  const startDate = new Date(show.startDate + 'T' + (show.showTime || '10:00'));
  const endDate = show.endDate
    ? new Date(show.endDate + 'T' + (show.showTime || '18:00'))
    : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const formatDateForICS = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const location = venue
    ? `${venue.name}, ${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`
    : `${show.venueName || 'Venue'}, ${show.city || ''}, ${show.state || ''}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Timberworks Tour Manager//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDateForICS(startDate)}`,
    `DTEND:${formatDateForICS(endDate)}`,
    `SUMMARY:Lumberjack Show - ${show.venueName || venue?.name || 'Show'} (${show.tour})`,
    `LOCATION:${location}`,
    `DESCRIPTION:Team: ${show.tour}\\nVenue: ${show.venueName || venue?.name}\\nPerformance Fee: $${show.performanceFee?.toLocaleString() || 'TBD'}${show.notes ? '\\nNotes: ' + show.notes : ''}`,
    `UID:${show.id}@timberworks-tour-manager`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
};

export default function Calendar({
  shows,
  venues = [],
  contacts = [],
  onSelectShow,
  selectedShowId,
  onNavigateToVenue,
  onNavigateToContact
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Build calendar grid (6 rows x 7 days)
    const weeks = [];
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < startDayOfWeek) {
          // Previous month days
          const prevMonthLastDay = new Date(year, month, 0).getDate();
          const day = prevMonthLastDay - (startDayOfWeek - dayOfWeek - 1);
          days.push({ day, isCurrentMonth: false, date: new Date(year, month - 1, day) });
        } else if (dayCounter > daysInMonth) {
          // Next month days
          const nextMonthDay = dayCounter - daysInMonth;
          days.push({ day: nextMonthDay, isCurrentMonth: false, date: new Date(year, month + 1, nextMonthDay) });
          dayCounter++;
        } else {
          // Current month days
          days.push({ day: dayCounter, isCurrentMonth: true, date: new Date(year, month, dayCounter) });
          dayCounter++;
        }
      }
      weeks.push(days);
      // Stop if we've filled the month and started next month
      if (dayCounter > daysInMonth && weeks.length >= 5) break;
    }

    return { year, month, weeks };
  }, [currentDate]);

  // Map shows to dates
  const showsByDate = useMemo(() => {
    const map = new Map();

    shows.forEach(show => {
      if (!show.startDate) return;

      const start = new Date(show.startDate + 'T00:00:00');
      const end = show.endDate ? new Date(show.endDate + 'T00:00:00') : start;

      // Add show to all days it spans
      const current = new Date(start);
      while (current <= end) {
        const key = current.toISOString().split('T')[0];
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push({
          ...show,
          isStart: current.getTime() === start.getTime(),
          isEnd: current.getTime() === end.getTime(),
          isMiddle: current.getTime() !== start.getTime() && current.getTime() !== end.getTime()
        });
        current.setDate(current.getDate() + 1);
      }
    });

    return map;
  }, [shows]);

  // Get shows for a specific day
  const getShowsForDay = (date) => {
    const key = date.toISOString().split('T')[0];
    return showsByDate.get(key) || [];
  };

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Handle day click
  const handleDayClick = (dayData) => {
    const dayShows = getShowsForDay(dayData.date);
    if (dayShows.length > 0) {
      setSelectedDay(dayData);
    }
  };

  // Get selected day's shows
  const selectedDayShows = selectedDay ? getShowsForDay(selectedDay.date) : [];

  // Lookup venue by ID
  const getVenue = useCallback((venueId) => {
    return venues.find(v => v.id === venueId);
  }, [venues]);

  // Lookup contact by ID
  const getContact = useCallback((contactId) => {
    return contacts.find(c => c.id === contactId);
  }, [contacts]);

  // Handle venue click
  const handleVenueClick = (e, venueId) => {
    e.stopPropagation();
    if (venueId && onNavigateToVenue) {
      onNavigateToVenue(venueId);
    }
  };

  // Handle contact click
  const handleContactClick = (e, contactId) => {
    e.stopPropagation();
    if (contactId && onNavigateToContact) {
      onNavigateToContact(contactId);
    }
  };

  // Handle Outlook calendar add
  const handleAddToOutlook = (e, show) => {
    e.stopPropagation();
    const venue = getVenue(show.venueId);
    const url = generateOutlookCalendarUrl(show, venue);
    window.open(url, '_blank');
  };

  // Handle ICS download
  const handleDownloadICS = (e, show) => {
    e.stopPropagation();
    const venue = getVenue(show.venueId);
    const icsContent = generateICSContent(show, venue);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lumberjack-show-${show.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="btn-nav" onClick={goToPrevMonth}>&larr;</button>
          <h2 className="calendar-title">
            {MONTHS[calendarData.month]} {calendarData.year}
          </h2>
          <button className="btn-nav" onClick={goToNextMonth}>&rarr;</button>
        </div>
        <button className="btn-today" onClick={goToToday}>Today</button>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <span className="legend-item">
          <span className="legend-dot red"></span> Red Team
        </span>
        <span className="legend-item">
          <span className="legend-dot blue"></span> Blue Team
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day headers */}
        <div className="calendar-days-header">
          {DAYS.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>

        {/* Weeks */}
        <div className="calendar-weeks">
          {calendarData.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="calendar-week">
              {week.map((dayData, dayIndex) => {
                const dayShows = getShowsForDay(dayData.date);
                const hasShows = dayShows.length > 0;
                const isSelectedDay = selectedDay &&
                  dayData.date.toDateString() === selectedDay.date.toDateString();

                return (
                  <div
                    key={dayIndex}
                    className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''} ${isToday(dayData.date) ? 'today' : ''} ${hasShows ? 'has-shows' : ''} ${isSelectedDay ? 'selected' : ''}`}
                    onClick={() => handleDayClick(dayData)}
                  >
                    <span className="day-number">{dayData.day}</span>
                    {hasShows && (
                      <div className="day-shows">
                        {dayShows.slice(0, 3).map((show, i) => (
                          <div
                            key={`${show.id}-${i}`}
                            className={`show-indicator ${show.tour === 'Red Team' ? 'red' : 'blue'} ${show.isStart ? 'start' : ''} ${show.isEnd ? 'end' : ''} ${show.isMiddle ? 'middle' : ''}`}
                            title={`${show.venueName} (${show.tour})`}
                          >
                            {show.isStart && (
                              <span className="show-name">{show.venueName}</span>
                            )}
                          </div>
                        ))}
                        {dayShows.length > 3 && (
                          <span className="more-shows">+{dayShows.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="export-section">
        <button
          className="btn-export"
          onClick={() => exportShows(shows, venues, contacts)}
        >
          Download Calendar Data (CSV)
        </button>
      </div>

      {/* Selected Day Detail */}
      {selectedDay && selectedDayShows.length > 0 && (
        <div className="day-detail">
          <div className="day-detail-header">
            <h3>
              {selectedDay.date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <button className="btn-close" onClick={() => setSelectedDay(null)}>&times;</button>
          </div>
          <div className="day-detail-shows">
            {selectedDayShows.map(show => {
              const venue = getVenue(show.venueId);
              const contact = getContact(show.contactId);
              const venueName = venue?.name || show.venueName;
              const venueLocation = venue
                ? `${venue.city}, ${venue.state}`
                : `${show.city || ''}, ${show.state || ''}`;

              return (
                <div
                  key={show.id}
                  className={`detail-show-card ${show.tour === 'Red Team' ? 'red' : 'blue'} ${selectedShowId === show.id ? 'selected' : ''}`}
                  onClick={() => onSelectShow?.(show)}
                >
                  <div className="detail-show-header">
                    <div className="detail-show-team">{show.tour}</div>
                    <div className="detail-show-fee">${show.performanceFee?.toLocaleString()}</div>
                  </div>

                  {/* Venue Link */}
                  <div
                    className={`detail-show-venue ${show.venueId ? 'clickable' : ''}`}
                    onClick={(e) => handleVenueClick(e, show.venueId)}
                    title={show.venueId ? 'Click to view venue in Directory' : ''}
                  >
                    <span className="link-icon">📍</span>
                    <span className="venue-name">{venueName}</span>
                    {show.venueId && <span className="link-arrow">→</span>}
                  </div>
                  <div className="detail-show-location">{venueLocation}</div>

                  {/* Contact Link */}
                  {(contact || show.contactId) && (
                    <div
                      className={`detail-show-contact ${show.contactId ? 'clickable' : ''}`}
                      onClick={(e) => handleContactClick(e, show.contactId)}
                      title={show.contactId ? 'Click to view contact in Directory' : ''}
                    >
                      <span className="link-icon">👤</span>
                      <span className="contact-name">
                        {contact ? `${contact.firstName} ${contact.lastName}` : 'Contact'}
                      </span>
                      {contact?.role && <span className="contact-role">({contact.role})</span>}
                      {show.contactId && <span className="link-arrow">→</span>}
                    </div>
                  )}

                  {/* Show Time */}
                  {show.showTime && (
                    <div className="detail-show-time">
                      <span className="link-icon">🕐</span>
                      {show.showTime}
                    </div>
                  )}

                  {/* Calendar Actions */}
                  <div className="detail-show-actions">
                    <button
                      className="btn-calendar outlook"
                      onClick={(e) => handleAddToOutlook(e, show)}
                      title="Add to Microsoft Outlook"
                    >
                      <span className="btn-icon">📅</span>
                      Add to Outlook
                    </button>
                    <button
                      className="btn-calendar ics"
                      onClick={(e) => handleDownloadICS(e, show)}
                      title="Download .ics file (works with any calendar app)"
                    >
                      <span className="btn-icon">⬇️</span>
                      Download .ics
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
