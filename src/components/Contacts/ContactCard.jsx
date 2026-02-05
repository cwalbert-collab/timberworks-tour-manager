import { memo, forwardRef } from 'react';
import { RELATIONSHIP_STRENGTHS } from '../../data/sampleDirectoryData';
import ActivityLog from '../shared/ActivityLog';

// Get relationship info
const getRelationshipInfo = (strength) => {
  return RELATIONSHIP_STRENGTHS.find(s => s.value === strength) || RELATIONSHIP_STRENGTHS[4]; // default to 'new'
};

// Get follow-up status
const getFollowUpStatus = (followUpDate) => {
  if (!followUpDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followUp = new Date(followUpDate + 'T00:00:00');

  const diffDays = Math.ceil((followUp - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `${Math.abs(diffDays)}d overdue`, className: 'overdue', icon: '⚠️' };
  } else if (diffDays === 0) {
    return { label: 'Today', className: 'today', icon: '📞' };
  } else if (diffDays <= 7) {
    return { label: `in ${diffDays}d`, className: 'soon', icon: '📅' };
  } else {
    return { label: followUp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), className: 'later', icon: '📅' };
  }
};

/**
 * Memoized ContactCard component for efficient rendering in lists
 */
const ContactCard = forwardRef(function ContactCard({
  contact,
  isHighlighted,
  isExpanded,
  activities = [],
  onToggleExpand,
  onEdit,
  onDelete,
  onClearHighlight,
  onAddActivity,
  onDeleteActivity
}, ref) {
  const relationshipInfo = getRelationshipInfo(contact.relationshipStrength);
  const followUpStatus = getFollowUpStatus(contact.followUpDate);

  return (
    <div
      ref={ref}
      className={`contact-card ${contact.isPrimary ? 'primary' : ''} ${isHighlighted ? 'highlighted' : ''} ${followUpStatus?.className === 'overdue' ? 'has-overdue' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={isHighlighted ? onClearHighlight : undefined}
    >
      <div className="contact-card-header" onClick={() => onToggleExpand && onToggleExpand(contact.id)}>
        <div className="contact-badges">
          {contact.isPrimary && <span className="primary-badge">Primary</span>}
          <span
            className="relationship-badge"
            style={{ backgroundColor: relationshipInfo.color }}
          >
            {relationshipInfo.label}
          </span>
          {followUpStatus && (
            <span className={`follow-up-badge ${followUpStatus.className}`}>
              {followUpStatus.icon} {followUpStatus.label}
            </span>
          )}
        </div>
        <div className="contact-info">
          <h4 className="contact-name">
            {contact.firstName} {contact.lastName}
          </h4>
          <p className="contact-role">{contact.role}</p>
          <div className="contact-details">
            <p className="contact-phone">
              <span className="icon">📞</span>
              {contact.phone}
            </p>
            <p className="contact-email">
              <span className="icon">✉️</span>
              <a href={`mailto:${contact.email}`} onClick={e => e.stopPropagation()}>{contact.email}</a>
            </p>
          </div>
          {contact.notes && (
            <p className="contact-notes">{contact.notes}</p>
          )}
        </div>
        <div className="contact-expand">
          {activities.length > 0 && (
            <span className="activity-count">{activities.length} note{activities.length !== 1 ? 's' : ''}</span>
          )}
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div className="contact-card-body">
          {/* Activity Log */}
          <ActivityLog
            entityType="contact"
            entityId={contact.id}
            activities={activities}
            onAddActivity={onAddActivity}
            onDeleteActivity={onDeleteActivity}
          />
        </div>
      )}

      <div className="contact-actions">
        <button className="btn-edit" onClick={(e) => { e.stopPropagation(); onEdit(contact); }}>
          Edit
        </button>
        <button className="btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(contact); }}>
          Delete
        </button>
      </div>
    </div>
  );
});

export default memo(ContactCard, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.contact === nextProps.contact &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.activities === nextProps.activities
  );
});
