import { useState, useMemo, useEffect, useRef, memo, useCallback } from 'react';
import ContactForm from './ContactForm';
import ContactCard from './ContactCard';
import ConfirmModal, { getDeleteConfirmProps } from '../shared/ConfirmModal';
import { useDebounce } from '../../hooks/useDebounce';
import { usePreferences } from '../../hooks/useLocalStorage';
import { exportContacts } from '../../utils/exportUtils';
import './ContactList.css';

// Sort options for contacts
const SORT_OPTIONS = [
  { value: 'name_asc', label: 'A to Z', key: 'name', direction: 'asc' },
  { value: 'name_desc', label: 'Z to A', key: 'name', direction: 'desc' },
  { value: 'relationship_desc', label: 'Best Relationships', key: 'relationship', direction: 'desc' },
  { value: 'relationship_asc', label: 'Needs Attention', key: 'relationship', direction: 'asc' },
  { value: 'role_asc', label: 'Role (A-Z)', key: 'role', direction: 'asc' },
  { value: 'primary_first', label: 'Primary First', key: 'primary', direction: 'desc' }
];

// Relationship strength priority (higher = stronger)
const RELATIONSHIP_PRIORITY = {
  locked_in: 5,
  good: 4,
  neutral: 3,
  needs_work: 2,
  new: 1
};

function ContactList({
  contacts,
  venues,
  onAdd,
  onUpdate,
  onDelete,
  getContactVenue,
  getEntityActivities,
  onAddActivity,
  onDeleteActivity,
  highlightedId,
  onClearHighlight
}) {
  // Persist user preferences
  const { getPreference, setPreference } = usePreferences('contactList');

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [filterVenue, setFilterVenue] = useState(() => getPreference('filterVenue', 'all'));
  const [sortBy, setSortBy] = useState(() => getPreference('sortBy', 'name_asc'));
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [expandedContactId, setExpandedContactId] = useState(null);
  const highlightedRef = useRef(null);

  // Persist preferences when they change
  useEffect(() => { setPreference('filterVenue', filterVenue); }, [filterVenue, setPreference]);
  useEffect(() => { setPreference('sortBy', sortBy); }, [sortBy, setPreference]);

  // Auto-scroll to highlighted contact
  useEffect(() => {
    if (highlightedId) {
      // Clear filters to ensure the contact is visible
      setSearchQuery('');
      setFilterVenue('all');
      // Scroll after a short delay to allow re-render
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [highlightedId]);

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    // First filter
    const filtered = contacts.filter(contact => {
      // Search filter (using debounced value for performance)
      const query = debouncedSearch.toLowerCase();
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const matchesSearch = !query ||
        fullName.includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.role.toLowerCase().includes(query) ||
        contact.phone.includes(query);

      // Venue filter
      const matchesVenue = filterVenue === 'all' ||
        (filterVenue === 'independent' && !contact.venueId) ||
        contact.venueId === filterVenue;

      return matchesSearch && matchesVenue;
    });

    // Then sort
    const sortOption = SORT_OPTIONS.find(opt => opt.value === sortBy) || SORT_OPTIONS[0];
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption.key === 'name') {
        const aName = `${a.firstName} ${a.lastName}`.toLowerCase();
        const bName = `${b.firstName} ${b.lastName}`.toLowerCase();
        const comparison = aName.localeCompare(bName);
        return sortOption.direction === 'asc' ? comparison : -comparison;
      } else if (sortOption.key === 'relationship') {
        const aPriority = RELATIONSHIP_PRIORITY[a.relationshipStrength] || 1;
        const bPriority = RELATIONSHIP_PRIORITY[b.relationshipStrength] || 1;
        const comparison = aPriority - bPriority;
        return sortOption.direction === 'desc' ? -comparison : comparison;
      } else if (sortOption.key === 'role') {
        const comparison = (a.role || '').localeCompare(b.role || '');
        return sortOption.direction === 'asc' ? comparison : -comparison;
      } else if (sortOption.key === 'primary') {
        const aIsPrimary = a.isPrimary ? 1 : 0;
        const bIsPrimary = b.isPrimary ? 1 : 0;
        return bIsPrimary - aIsPrimary; // Primary contacts first
      }
      return 0;
    });

    return sorted;
  }, [contacts, debouncedSearch, filterVenue, sortBy]);

  // Group contacts by venue for display
  const groupedContacts = useMemo(() => {
    const groups = new Map();

    filteredContacts.forEach(contact => {
      const venueId = contact.venueId || 'independent';
      if (!groups.has(venueId)) {
        groups.set(venueId, []);
      }
      groups.get(venueId).push(contact);
    });

    // Convert to array and sort: venues first (alphabetically), then independent
    const sorted = Array.from(groups.entries()).sort(([aId], [bId]) => {
      if (aId === 'independent') return 1;
      if (bId === 'independent') return -1;
      const aVenue = venues.find(v => v.id === aId);
      const bVenue = venues.find(v => v.id === bId);
      return (aVenue?.name || '').localeCompare(bVenue?.name || '');
    });

    return sorted;
  }, [filteredContacts, venues]);

  const handleAddNew = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSave = (contact) => {
    if (editingContact) {
      onUpdate(contact);
    } else {
      onAdd(contact);
    }
    setShowForm(false);
    setEditingContact(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleDeleteClick = (contact) => {
    setShowDeleteConfirm(contact);
  };

  const handleConfirmDelete = () => {
    if (showDeleteConfirm) {
      onDelete(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const getVenueName = (venueId) => {
    if (!venueId) return 'Independent Contacts';
    const venue = venues.find(v => v.id === venueId);
    return venue?.name || 'Unknown Venue';
  };

  const getVenueLocation = (venueId) => {
    if (!venueId) return '';
    const venue = venues.find(v => v.id === venueId);
    return venue ? `${venue.city}, ${venue.state}` : '';
  };

  const toggleExpand = useCallback((contactId) => {
    setExpandedContactId(prev => prev === contactId ? null : contactId);
  }, []);

  return (
    <div className="contact-list">
      {/* Toolbar */}
      <div className="contact-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filterVenue}
            onChange={(e) => setFilterVenue(e.target.value)}
          >
            <option value="all">All Venues</option>
            <option value="independent">Independent Only</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sort-group">
          <label htmlFor="sortBy">Sort:</label>
          <select
            id="sortBy"
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
          + Add Contact
        </button>
      </div>

      {/* Results count */}
      <div className="results-count">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </div>

      {/* Contact Groups */}
      <div className="contact-groups">
        {groupedContacts.map(([venueId, groupContacts]) => (
          <div key={venueId} className="contact-group">
            <div className="group-header">
              <h3 className="group-name">{getVenueName(venueId)}</h3>
              {venueId !== 'independent' && (
                <span className="group-location">{getVenueLocation(venueId)}</span>
              )}
              <span className="group-count">{groupContacts.length}</span>
            </div>
            <div className="contact-cards">
              {groupContacts.map(contact => {
                const isHighlighted = contact.id === highlightedId;
                const contactActivities = getEntityActivities ? getEntityActivities('contact', contact.id) : [];
                return (
                  <ContactCard
                    key={contact.id}
                    ref={isHighlighted ? highlightedRef : null}
                    contact={contact}
                    isHighlighted={isHighlighted}
                    isExpanded={expandedContactId === contact.id}
                    activities={contactActivities}
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
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="empty-state">
          <p>No contacts found matching your criteria.</p>
        </div>
      )}

      {/* Contact Form Modal */}
      {showForm && (
        <ContactForm
          contact={editingContact}
          venues={venues}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        {...getDeleteConfirmProps('Contact', showDeleteConfirm ? `${showDeleteConfirm.firstName} ${showDeleteConfirm.lastName}` : '')}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Export Button */}
      <div className="export-section">
        <button
          className="btn-export"
          onClick={() => exportContacts(contacts, venues)}
        >
          Download Contacts Data (CSV)
        </button>
      </div>
    </div>
  );
}

export default memo(ContactList);
