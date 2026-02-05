import { useState, useMemo, useRef, useEffect } from 'react';
import './GlobalSearch.css';

export default function GlobalSearch({
  shows,
  venues,
  contacts,
  employees,
  onSelectShow,
  onNavigateToVenue,
  onNavigateToContact,
  onNavigateToEmployee,
  onNavigateToTab
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Search results
  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase();
    const items = [];

    // Search shows
    shows.forEach(show => {
      const venue = venues.find(v => v.id === show.venueId);
      const venueName = venue?.name || show.venueName || '';
      const contact = contacts.find(c => c.id === show.contactId);

      if (
        venueName.toLowerCase().includes(q) ||
        show.tour?.toLowerCase().includes(q) ||
        show.startDate?.includes(q) ||
        show.notes?.toLowerCase().includes(q) ||
        contact?.name?.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'show',
          id: show.id,
          title: venueName || 'Unknown Venue',
          subtitle: `${show.startDate} • ${show.tour}`,
          icon: '🎪',
          data: show
        });
      }
    });

    // Search venues
    venues.forEach(venue => {
      if (
        venue.name?.toLowerCase().includes(q) ||
        venue.city?.toLowerCase().includes(q) ||
        venue.state?.toLowerCase().includes(q) ||
        venue.address?.toLowerCase().includes(q) ||
        venue.type?.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'venue',
          id: venue.id,
          title: venue.name,
          subtitle: `${venue.city}, ${venue.state}`,
          icon: '📍',
          data: venue
        });
      }
    });

    // Search contacts
    contacts.forEach(contact => {
      const fullName = contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
      if (
        fullName.toLowerCase().includes(q) ||
        contact.email?.toLowerCase().includes(q) ||
        contact.phone?.includes(q) ||
        contact.role?.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'contact',
          id: contact.id,
          title: fullName,
          subtitle: contact.role || contact.email || '',
          icon: '👤',
          data: contact
        });
      }
    });

    // Search employees
    employees.forEach(employee => {
      const fullName = `${employee.firstName} ${employee.lastName}`;
      if (
        fullName.toLowerCase().includes(q) ||
        employee.role?.toLowerCase().includes(q) ||
        employee.team?.toLowerCase().includes(q) ||
        employee.email?.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'employee',
          id: employee.id,
          title: fullName,
          subtitle: `${employee.role} • ${employee.team} Team`,
          icon: '👥',
          data: employee
        });
      }
    });

    // Limit results
    return items.slice(0, 10);
  }, [query, shows, venues, contacts, employees]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, results.length]);

  const handleSelect = (item) => {
    setQuery('');
    setIsOpen(false);

    switch (item.type) {
      case 'show':
        onSelectShow?.(item.data);
        onNavigateToTab?.('shows');
        break;
      case 'venue':
        onNavigateToVenue?.(item.id);
        break;
      case 'contact':
        onNavigateToContact?.(item.id);
        break;
      case 'employee':
        onNavigateToEmployee?.(item.id);
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = (e) => {
    // Delay to allow click on results
    setTimeout(() => {
      if (!resultsRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 150);
  };

  return (
    <div className="global-search">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search shows, venues, contacts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            tabIndex={-1}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results" ref={resultsRef}>
          {results.map((item, index) => (
            <button
              key={`${item.type}-${item.id}`}
              className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="result-icon">{item.icon}</span>
              <div className="result-content">
                <span className="result-title">{item.title}</span>
                <span className="result-subtitle">{item.subtitle}</span>
              </div>
              <span className="result-type">{item.type}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">
            No results found for "{query}"
          </div>
        </div>
      )}

      {isOpen && query.length > 0 && query.length < 2 && (
        <div className="search-results">
          <div className="search-hint">
            Type at least 2 characters to search
          </div>
        </div>
      )}
    </div>
  );
}
