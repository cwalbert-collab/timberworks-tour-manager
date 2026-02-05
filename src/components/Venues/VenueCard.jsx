import { memo, forwardRef } from 'react';
import { formatDistance } from '../../utils/geoUtils';
import { formatVenueType } from '../../utils/formatters';
import ActivityLog from '../shared/ActivityLog';

/**
 * Memoized VenueCard component for efficient rendering in lists
 */
const VenueCard = forwardRef(function VenueCard({
  venue,
  venueContacts,
  isExpanded,
  isHighlighted,
  distance,
  revenueData,
  activities = [],
  onToggleExpand,
  onEdit,
  onDelete,
  onClearHighlight,
  onAddActivity,
  onDeleteActivity
}, ref) {

  return (
    <div
      ref={ref}
      className={`venue-card ${isExpanded ? 'expanded' : ''} ${!venue.isActive ? 'inactive' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      onClick={isHighlighted ? onClearHighlight : undefined}
    >
      <div className="venue-card-header" onClick={() => onToggleExpand(venue.id)}>
        <div className="venue-main-info">
          <h3 className="venue-name">{venue.name}</h3>
          <p className="venue-location">{venue.city}, {venue.state}</p>
          <div className="venue-quick-stats">
            {distance !== undefined && distance !== Infinity && (
              <span className="distance-badge" title="Distance from homebase">
                {formatDistance(distance)}
              </span>
            )}
            {revenueData && (
              <span className="revenue-badge" title={`Last show: ${revenueData.date}`}>
                ${revenueData.revenue.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="venue-meta">
          <span className={`venue-type-badge ${venue.venueType}`}>
            {formatVenueType(venue.venueType)}
          </span>
          <span className="contact-count">
            {venueContacts.length} contact{venueContacts.length !== 1 ? 's' : ''}
          </span>
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            &#9660;
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="venue-card-body">
          <div className="venue-details">
            <div className="detail-section">
              <h4>Address</h4>
              <p>{venue.address}</p>
              <p>{venue.city}, {venue.state} {venue.zip}</p>
              {venue.website && (
                <a href={venue.website} target="_blank" rel="noopener noreferrer" className="venue-website">
                  {venue.website}
                </a>
              )}
            </div>
            <div className="detail-section">
              <h4>Details</h4>
              <p><strong>Capacity:</strong> {venue.capacity?.toLocaleString() || 'N/A'}</p>
              <p><strong>Setting:</strong> {venue.indoorOutdoor || 'N/A'}</p>
              {venue.notes && <p className="venue-notes">{venue.notes}</p>}
            </div>
          </div>

          {/* Contacts Section */}
          <div className="venue-contacts">
            <h4>Contacts ({venueContacts.length})</h4>
            {venueContacts.length === 0 ? (
              <p className="no-contacts">No contacts for this venue</p>
            ) : (
              <div className="contacts-grid">
                {venueContacts.map(contact => (
                  <div key={contact.id} className={`contact-mini-card ${contact.isPrimary ? 'primary' : ''}`}>
                    {contact.isPrimary && <span className="primary-badge">Primary</span>}
                    <p className="contact-name">{contact.firstName} {contact.lastName}</p>
                    <p className="contact-role">{contact.role}</p>
                    <p className="contact-phone">{contact.phone}</p>
                    <p className="contact-email">{contact.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <ActivityLog
            entityType="venue"
            entityId={venue.id}
            activities={activities}
            onAddActivity={onAddActivity}
            onDeleteActivity={onDeleteActivity}
          />

          {/* Actions */}
          <div className="venue-actions">
            <button className="btn-edit" onClick={() => onEdit(venue)}>
              Edit Venue
            </button>
            <button className="btn-delete" onClick={() => onDelete(venue)}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default memo(VenueCard, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.venue === nextProps.venue &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.distance === nextProps.distance &&
    prevProps.revenueData === nextProps.revenueData &&
    prevProps.venueContacts === nextProps.venueContacts &&
    prevProps.activities === nextProps.activities
  );
});
