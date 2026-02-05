import { useState, useMemo, useCallback } from 'react';
import VenueShowCard from './VenueShowCard';
import './ShowsByVenue.css';

const SORT_OPTIONS = [
  { value: 'next_show', label: 'Next Show Date' },
  { value: 'venue_name', label: 'Venue Name (A-Z)' },
  { value: 'total_revenue', label: 'Total Revenue' },
  { value: 'show_count', label: 'Most Shows' },
  { value: 'last_show', label: 'Most Recent Show' }
];

export default function ShowsByVenue({
  shows,
  venues,
  contacts,
  onSelectShow,
  selectedShowId,
  onEdit,
  onDelete
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('next_show');
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedVenueId, setExpandedVenueId] = useState(null);

  // Create venue lookup map
  const venueMap = useMemo(() => {
    const map = new Map();
    venues.forEach(v => map.set(v.id, v));
    return map;
  }, [venues]);

  // Group shows by venue
  const venueGroups = useMemo(() => {
    const groups = new Map();
    const today = new Date().toISOString().split('T')[0];

    shows.forEach(show => {
      const venueId = show.venueId || 'unknown';

      if (!groups.has(venueId)) {
        const venue = venueMap.get(venueId);
        groups.set(venueId, {
          venueId,
          venueName: venue?.name || show.venueName || 'Unknown Venue',
          city: venue?.city || show.city || '',
          state: venue?.state || show.state || '',
          shows: [],
          pastShows: [],
          futureShows: [],
          totalRevenue: 0,
          totalProfit: 0,
          nextShow: null,
          lastShow: null
        });
      }

      const group = groups.get(venueId);
      const showRevenue = (show.performanceFee || 0) + (show.merchandiseSales || 0);
      const showProfit = showRevenue - (show.materialsUsed || 0) - (show.expenses || 0);

      group.shows.push(show);
      group.totalRevenue += showRevenue;
      group.totalProfit += showProfit;

      // Categorize past vs future
      if (show.endDate < today) {
        group.pastShows.push(show);
      } else {
        group.futureShows.push(show);
      }
    });

    // Sort shows within each group and determine next/last
    groups.forEach(group => {
      group.shows.sort((a, b) => a.startDate.localeCompare(b.startDate));
      group.pastShows.sort((a, b) => b.startDate.localeCompare(a.startDate)); // Most recent first
      group.futureShows.sort((a, b) => a.startDate.localeCompare(b.startDate)); // Soonest first

      group.nextShow = group.futureShows[0] || null;
      group.lastShow = group.pastShows[0] || null;
      group.totalShows = group.shows.length;
    });

    return Array.from(groups.values());
  }, [shows, venueMap]);

  // Filter by search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return venueGroups;

    const query = searchQuery.toLowerCase();
    return venueGroups.filter(group =>
      group.venueName.toLowerCase().includes(query) ||
      group.city.toLowerCase().includes(query) ||
      group.state.toLowerCase().includes(query)
    );
  }, [venueGroups, searchQuery]);

  // Sort groups
  const sortedGroups = useMemo(() => {
    const sorted = [...filteredGroups];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'venue_name':
          comparison = a.venueName.localeCompare(b.venueName);
          break;
        case 'total_revenue':
          comparison = b.totalRevenue - a.totalRevenue;
          break;
        case 'show_count':
          comparison = b.totalShows - a.totalShows;
          break;
        case 'next_show':
          // Venues with upcoming shows first, then by next show date
          if (a.nextShow && b.nextShow) {
            comparison = a.nextShow.startDate.localeCompare(b.nextShow.startDate);
          } else if (a.nextShow) {
            comparison = -1;
          } else if (b.nextShow) {
            comparison = 1;
          } else {
            // Both have no upcoming shows, sort by last show
            comparison = (b.lastShow?.startDate || '').localeCompare(a.lastShow?.startDate || '');
          }
          break;
        case 'last_show':
          const aDate = a.lastShow?.startDate || a.nextShow?.startDate || '';
          const bDate = b.lastShow?.startDate || b.nextShow?.startDate || '';
          comparison = bDate.localeCompare(aDate);
          break;
        default:
          comparison = 0;
      }

      return sortAsc ? comparison : -comparison;
    });

    return sorted;
  }, [filteredGroups, sortBy, sortAsc]);

  const handleToggleExpand = useCallback((venueId) => {
    setExpandedVenueId(prev => prev === venueId ? null : venueId);
  }, []);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortAsc(prev => !prev);
  };

  // Summary stats
  const totalVenues = sortedGroups.length;
  const venuesWithUpcoming = sortedGroups.filter(g => g.nextShow).length;
  const totalShowCount = shows.length;

  return (
    <div className="shows-by-venue">
      {/* Toolbar */}
      <div className="sbv-toolbar">
        <div className="sbv-search">
          <input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sbv-search-input"
          />
          {searchQuery && (
            <button
              className="sbv-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              x
            </button>
          )}
        </div>

        <div className="sbv-sort">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="sbv-sort-select"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            className="sbv-sort-direction"
            onClick={toggleSortDirection}
            title={sortAsc ? 'Ascending' : 'Descending'}
          >
            {sortAsc ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sbv-stats">
        <span className="sbv-stat">
          <strong>{totalVenues}</strong> venues
        </span>
        <span className="sbv-stat">
          <strong>{venuesWithUpcoming}</strong> with upcoming shows
        </span>
        <span className="sbv-stat">
          <strong>{totalShowCount}</strong> total shows
        </span>
      </div>

      {/* Venue Cards */}
      <div className="sbv-list">
        {sortedGroups.length === 0 ? (
          <div className="sbv-empty">
            {searchQuery ? 'No venues match your search.' : 'No shows found.'}
          </div>
        ) : (
          sortedGroups.map(group => (
            <VenueShowCard
              key={group.venueId}
              venueGroup={group}
              isExpanded={expandedVenueId === group.venueId}
              onToggleExpand={handleToggleExpand}
              onSelectShow={onSelectShow}
              onEdit={onEdit}
              onDelete={onDelete}
              selectedShowId={selectedShowId}
            />
          ))
        )}
      </div>
    </div>
  );
}
