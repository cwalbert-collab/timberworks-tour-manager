import { useState, useMemo, useEffect, useRef, memo, useCallback } from 'react';
import VenueForm from './VenueForm';
import VenueCard from './VenueCard';
import ConfirmModal, { getDeleteConfirmProps } from '../shared/ConfirmModal';
import { useDebounce } from '../../hooks/useDebounce';
import { usePreferences } from '../../hooks/useLocalStorage';
import { HOMEBASE, calculateDistance } from '../../utils/geoUtils';
import { formatVenueType } from '../../utils/formatters';
import { exportVenues } from '../../utils/exportUtils';
import './VenueList.css';

// Sort options for venues
const SORT_OPTIONS = [
  { value: 'name_asc', label: 'A to Z', key: 'name', direction: 'asc' },
  { value: 'name_desc', label: 'Z to A', key: 'name', direction: 'desc' },
  { value: 'proximity_asc', label: 'Nearest First', key: 'proximity', direction: 'asc' },
  { value: 'proximity_desc', label: 'Farthest First', key: 'proximity', direction: 'desc' },
  { value: 'revenue_desc', label: 'Highest Revenue', key: 'revenue', direction: 'desc' },
  { value: 'revenue_asc', label: 'Lowest Revenue', key: 'revenue', direction: 'asc' },
  { value: 'capacity_desc', label: 'Largest Capacity', key: 'capacity', direction: 'desc' },
  { value: 'capacity_asc', label: 'Smallest Capacity', key: 'capacity', direction: 'asc' },
  { value: 'lastshow_desc', label: 'Most Recent Show', key: 'lastshow', direction: 'desc' },
  { value: 'lastshow_asc', label: 'Oldest Show', key: 'lastshow', direction: 'asc' }
];


function VenueList({
  venues,
  contacts,
  shows = [],
  onAdd,
  onUpdate,
  onDelete,
  getVenueContacts,
  getEntityActivities,
  onAddActivity,
  onDeleteActivity,
  highlightedId,
  onClearHighlight
}) {
  // Persist user preferences
  const { getPreference, setPreference } = usePreferences('venueList');

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [filterState, setFilterState] = useState(() => getPreference('filterState', 'all'));
  const [filterType, setFilterType] = useState(() => getPreference('filterType', 'all'));
  const [sortBy, setSortBy] = useState(() => getPreference('sortBy', 'name_asc'));
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [expandedVenueId, setExpandedVenueId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const highlightedRef = useRef(null);

  // Persist preferences when they change
  useEffect(() => { setPreference('filterState', filterState); }, [filterState, setPreference]);
  useEffect(() => { setPreference('filterType', filterType); }, [filterType, setPreference]);
  useEffect(() => { setPreference('sortBy', sortBy); }, [sortBy, setPreference]);

  // Calculate venue revenue from most recent show
  const venueRevenueMap = useMemo(() => {
    const revenueMap = new Map();
    shows.forEach(show => {
      if (show.venueId) {
        const existing = revenueMap.get(show.venueId);
        const showRevenue = (show.performanceFee || 0) + (show.merchandiseSales || 0);
        // Keep most recent show's revenue (by date)
        if (!existing || show.startDate > existing.date) {
          revenueMap.set(show.venueId, { revenue: showRevenue, date: show.startDate });
        }
      }
    });
    return revenueMap;
  }, [shows]);

  // Calculate distance from homebase for each venue
  const venueDistanceMap = useMemo(() => {
    const distanceMap = new Map();
    venues.forEach(venue => {
      if (venue.latitude && venue.longitude) {
        const distance = calculateDistance(
          HOMEBASE.lat, HOMEBASE.lng,
          venue.latitude, venue.longitude
        );
        distanceMap.set(venue.id, distance);
      } else {
        distanceMap.set(venue.id, Infinity);
      }
    });
    return distanceMap;
  }, [venues]);

  // Auto-expand and scroll to highlighted venue
  useEffect(() => {
    if (highlightedId) {
      // Clear filters to ensure the venue is visible
      setSearchQuery('');
      setFilterState('all');
      setFilterType('all');
      // Expand the venue
      setExpandedVenueId(highlightedId);
      // Scroll after a short delay to allow re-render
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [highlightedId]);

  // Get unique states and types for filters
  const { states, types } = useMemo(() => {
    const stateSet = new Set(venues.map(v => v.state));
    const typeSet = new Set(venues.map(v => v.venueType));
    return {
      states: Array.from(stateSet).sort(),
      types: Array.from(typeSet).sort()
    };
  }, [venues]);

  // Filter and sort venues
  const filteredVenues = useMemo(() => {
    // First filter
    const filtered = venues.filter(venue => {
      // Search filter (using debounced value for performance)
      const query = debouncedSearch.toLowerCase();
      const matchesSearch = !query ||
        venue.name.toLowerCase().includes(query) ||
        venue.city.toLowerCase().includes(query) ||
        venue.state.toLowerCase().includes(query) ||
        venue.address.toLowerCase().includes(query);

      // State filter
      const matchesState = filterState === 'all' || venue.state === filterState;

      // Type filter
      const matchesType = filterType === 'all' || venue.venueType === filterType;

      return matchesSearch && matchesState && matchesType;
    });

    // Then sort
    const sortOption = SORT_OPTIONS.find(opt => opt.value === sortBy) || SORT_OPTIONS[0];
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption.key === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortOption.direction === 'asc' ? comparison : -comparison;
      } else if (sortOption.key === 'proximity') {
        const aDistance = venueDistanceMap.get(a.id) || Infinity;
        const bDistance = venueDistanceMap.get(b.id) || Infinity;
        const comparison = aDistance - bDistance;
        return sortOption.direction === 'asc' ? comparison : -comparison;
      } else if (sortOption.key === 'revenue') {
        const aRevenue = venueRevenueMap.get(a.id)?.revenue || 0;
        const bRevenue = venueRevenueMap.get(b.id)?.revenue || 0;
        const comparison = aRevenue - bRevenue;
        return sortOption.direction === 'desc' ? -comparison : comparison;
      } else if (sortOption.key === 'capacity') {
        const aCapacity = a.capacity || 0;
        const bCapacity = b.capacity || 0;
        const comparison = aCapacity - bCapacity;
        return sortOption.direction === 'desc' ? -comparison : comparison;
      } else if (sortOption.key === 'lastshow') {
        const aDate = venueRevenueMap.get(a.id)?.date || '1900-01-01';
        const bDate = venueRevenueMap.get(b.id)?.date || '1900-01-01';
        const comparison = aDate.localeCompare(bDate);
        return sortOption.direction === 'desc' ? -comparison : comparison;
      }
      return 0;
    });

    return sorted;
  }, [venues, debouncedSearch, filterState, filterType, sortBy, venueDistanceMap, venueRevenueMap]);

  const handleAddNew = () => {
    setEditingVenue(null);
    setShowForm(true);
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setShowForm(true);
  };

  const handleSave = (venue) => {
    if (editingVenue) {
      onUpdate(venue);
    } else {
      onAdd(venue);
    }
    setShowForm(false);
    setEditingVenue(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingVenue(null);
  };

  const handleDeleteClick = (venue) => {
    setShowDeleteConfirm(venue);
  };

  const handleConfirmDelete = () => {
    if (showDeleteConfirm) {
      onDelete(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
      if (expandedVenueId === showDeleteConfirm.id) {
        setExpandedVenueId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const toggleExpand = useCallback((venueId) => {
    setExpandedVenueId(prev => prev === venueId ? null : venueId);
  }, []);

  return (
    <div className="venue-list">
      {/* Toolbar */}
      <div className="venue-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="all">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{formatVenueType(type)}</option>
            ))}
          </select>
        </div>
        <div className="sort-group">
          <label htmlFor="venueSortBy">Sort:</label>
          <select
            id="venueSortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-add" onClick={handleAddNew}>
          + Add Venue
        </button>
      </div>

      {/* Results count */}
      <div className="results-count">
        Showing {filteredVenues.length} of {venues.length} venues
      </div>

      {/* Venue Cards */}
      <div className="venue-cards">
        {filteredVenues.map(venue => {
          const venueContacts = getVenueContacts(venue.id);
          const isHighlighted = venue.id === highlightedId;
          const venueActivities = getEntityActivities ? getEntityActivities('venue', venue.id) : [];
          return (
            <VenueCard
              key={venue.id}
              ref={isHighlighted ? highlightedRef : null}
              venue={venue}
              venueContacts={venueContacts}
              isExpanded={expandedVenueId === venue.id}
              isHighlighted={isHighlighted}
              distance={venueDistanceMap.get(venue.id)}
              revenueData={venueRevenueMap.get(venue.id)}
              activities={venueActivities}
              onToggleExpand={toggleExpand}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onClearHighlight={onClearHighlight}
              onAddActivity={onAddActivity}
              onDeleteActivity={onDeleteActivity}
            />
          );
        })}
      </div>

      {filteredVenues.length === 0 && (
        <div className="empty-state">
          <p>No venues found matching your criteria.</p>
        </div>
      )}

      {/* Venue Form Modal */}
      {showForm && (
        <VenueForm
          venue={editingVenue}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        {...getDeleteConfirmProps('Venue', showDeleteConfirm?.name)}
        warning="This will also remove all contacts associated with this venue."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Export Button */}
      <div className="export-section">
        <button
          className="btn-export"
          onClick={() => exportVenues(venues, contacts)}
        >
          Download Venues Data (CSV)
        </button>
      </div>
    </div>
  );
}

export default memo(VenueList);
