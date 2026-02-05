import { useState, useEffect } from 'react';
import DirectoryNav from './DirectoryNav';
import VenueList from '../Venues/VenueList';
import ContactList from '../Contacts/ContactList';
import './Directory.css';

export default function Directory({
  venues,
  contacts,
  shows,
  metrics,
  onAddVenue,
  onUpdateVenue,
  onDeleteVenue,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  getVenueContacts,
  getContactVenue,
  getEntityActivities,
  onAddActivity,
  onDeleteActivity,
  highlightedItem,
  onClearHighlight
}) {
  const [activeView, setActiveView] = useState('venues');

  // Switch to correct view and scroll to item when highlighted
  useEffect(() => {
    if (highlightedItem) {
      setActiveView(highlightedItem.type === 'venue' ? 'venues' : 'contacts');
    }
  }, [highlightedItem]);

  // Format number
  const formatNumber = (value) => value.toLocaleString();

  return (
    <div className="directory">
      {/* Summary Stats */}
      <div className="directory-stats">
        <div className="stat-card">
          <span className="stat-value">{formatNumber(metrics.totalVenues)}</span>
          <span className="stat-label">Venues</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatNumber(metrics.activeVenues)}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatNumber(metrics.totalContacts)}</span>
          <span className="stat-label">Contacts</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{Object.keys(metrics.venuesByState).length}</span>
          <span className="stat-label">States</span>
        </div>
      </div>

      {/* Sub Navigation */}
      <DirectoryNav activeView={activeView} onViewChange={setActiveView} />

      {/* Content */}
      {activeView === 'venues' && (
        <VenueList
          venues={venues}
          contacts={contacts}
          shows={shows}
          onAdd={onAddVenue}
          onUpdate={onUpdateVenue}
          onDelete={onDeleteVenue}
          getVenueContacts={getVenueContacts}
          getEntityActivities={getEntityActivities}
          onAddActivity={onAddActivity}
          onDeleteActivity={onDeleteActivity}
          highlightedId={highlightedItem?.type === 'venue' ? highlightedItem.id : null}
          onClearHighlight={onClearHighlight}
        />
      )}

      {activeView === 'contacts' && (
        <ContactList
          contacts={contacts}
          venues={venues}
          onAdd={onAddContact}
          onUpdate={onUpdateContact}
          onDelete={onDeleteContact}
          getContactVenue={getContactVenue}
          getEntityActivities={getEntityActivities}
          onAddActivity={onAddActivity}
          onDeleteActivity={onDeleteActivity}
          highlightedId={highlightedItem?.type === 'contact' ? highlightedItem.id : null}
          onClearHighlight={onClearHighlight}
        />
      )}
    </div>
  );
}
