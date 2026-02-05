import { useState, useMemo, useCallback } from 'react';
import { formatDateRange } from '../../data/sampleData';
import { exportShows } from '../../utils/exportUtils';
import './DataTable.css';

// Column definitions for the data table
const columns = [
  { key: 'tour', label: 'Tour', sortable: true, format: 'tour' },
  { key: 'venueName', label: 'Venue', sortable: true, lookup: 'venue' },
  { key: 'city', label: 'City', sortable: true, lookup: 'venue' },
  { key: 'state', label: 'State', sortable: true, lookup: 'venue' },
  { key: 'startDate', label: 'Dates', sortable: true, format: 'dateRange' },
  { key: 'durationDays', label: 'Days', sortable: true, format: 'number' },
  { key: 'performanceFee', label: 'Fee', sortable: true, format: 'currency' },
  { key: 'merchandiseSales', label: 'Merch', sortable: true, format: 'currency' },
  { key: 'profit', label: 'Profit', sortable: true, format: 'currency' },
];

// Format cell values based on type
function formatValue(value, format, show) {
  if (value === null || value === undefined) return '-';

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    case 'number':
      return new Intl.NumberFormat('en-US').format(value);
    case 'tour':
      return value; // Will be styled via CSS class
    case 'dateRange':
      return formatDateRange(show.startDate, show.endDate);
    default:
      return value;
  }
}

// Get CSS class for tour badge
function getTourClass(tour) {
  if (tour === 'Red Team') return 'tour-red';
  if (tour === 'Blue Team') return 'tour-blue';
  return '';
}

export default function DataTable({ shows, onSelectShow, selectedShowId, onEdit, onDelete, venues = [], contacts = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'asc' });
  const [filterText, setFilterText] = useState('');

  // Create lookup maps for venues and contacts
  const venueMap = useMemo(() => {
    const map = new Map();
    venues.forEach(v => map.set(v.id, v));
    return map;
  }, [venues]);

  const contactMap = useMemo(() => {
    const map = new Map();
    contacts.forEach(c => map.set(c.id, c));
    return map;
  }, [contacts]);

  // Get venue info for a show (live lookup from Directory)
  const getVenueInfo = useCallback((show) => {
    const venue = venueMap.get(show.venueId);
    if (venue) {
      return {
        venueName: venue.name,
        city: venue.city,
        state: venue.state,
        address: venue.address,
        zip: venue.zip,
        latitude: venue.latitude,
        longitude: venue.longitude
      };
    }
    // Fallback to show data if venue not found (backwards compatibility)
    return {
      venueName: show.venueName || 'Unknown Venue',
      city: show.city || '',
      state: show.state || '',
      address: show.address || '',
      zip: show.zip || '',
      latitude: show.latitude,
      longitude: show.longitude
    };
  }, [venueMap]);

  // Get contact info for a show (live lookup from Directory)
  const getContactInfo = useCallback((show) => {
    const contact = contactMap.get(show.contactId);
    if (contact) {
      return {
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email
      };
    }
    // Fallback to show data if contact not found (backwards compatibility)
    return {
      contactName: show.contactName || 'Unknown Contact',
      contactPhone: show.contactPhone || '',
      contactEmail: show.contactEmail || ''
    };
  }, [contactMap]);

  // Enrich shows with looked-up venue/contact data
  const enrichedShows = useMemo(() => {
    return shows.map(show => ({
      ...show,
      ...getVenueInfo(show),
      ...getContactInfo(show)
    }));
  }, [shows, getVenueInfo, getContactInfo]);

  // Filter shows based on search text (using enriched data)
  const filteredShows = useMemo(() => {
    if (!filterText.trim()) return enrichedShows;

    const searchLower = filterText.toLowerCase();
    return enrichedShows.filter(show =>
      show.tour.toLowerCase().includes(searchLower) ||
      (show.venueName || '').toLowerCase().includes(searchLower) ||
      (show.city || '').toLowerCase().includes(searchLower) ||
      (show.state || '').toLowerCase().includes(searchLower) ||
      (show.contactName || '').toLowerCase().includes(searchLower)
    );
  }, [enrichedShows, filterText]);

  // Sort filtered shows
  const sortedShows = useMemo(() => {
    const sorted = [...filteredShows];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle null/undefined
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Compare based on type
      if (typeof aVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredShows, sortConfig]);

  // Handle column header click for sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort indicator for column header
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="data-table-container">
      <div className="table-controls">
        <input
          type="text"
          className="filter-input"
          placeholder="Search venues, cities, states, contacts..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <span className="result-count">
          {sortedShows.length} of {shows.length} shows
        </span>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={col.sortable ? 'sortable' : ''}
                >
                  {col.label}
                  {col.sortable && getSortIndicator(col.key)}
                </th>
              ))}
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedShows.map(show => (
              <tr
                key={show.id}
                onClick={() => onSelectShow && onSelectShow(show)}
                className={selectedShowId === show.id ? 'selected' : ''}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={`${col.format || ''} ${col.key === 'tour' ? getTourClass(show.tour) : ''}`}
                  >
                    {formatValue(show[col.key], col.format, show)}
                  </td>
                ))}
                <td className="actions-cell">
                  <button
                    className="btn-action btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit && onEdit(show);
                    }}
                    title="Edit show"
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete && onDelete(show);
                    }}
                    title="Delete show"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sortedShows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="no-results">
                  No shows found matching "{filterText}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <div className="export-section">
        <button
          className="btn-export"
          onClick={() => exportShows(shows, venues, contacts)}
        >
          Download Shows Data (CSV)
        </button>
      </div>
    </div>
  );
}
