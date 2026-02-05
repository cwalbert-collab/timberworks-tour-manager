import { useState, memo } from 'react';
import './ActivityLog.css';

const ACTIVITY_TYPES = [
  { value: 'note', label: 'Note', icon: '📝' },
  { value: 'call', label: 'Phone Call', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'other', label: 'Other', icon: '📌' }
];

const getActivityIcon = (type) => {
  const activityType = ACTIVITY_TYPES.find(t => t.value === type);
  return activityType?.icon || '📝';
};

const getActivityLabel = (type) => {
  const activityType = ACTIVITY_TYPES.find(t => t.value === type);
  return activityType?.label || 'Note';
};

const formatActivityDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

function ActivityForm({ onSave, onCancel }) {
  const [type, setType] = useState('note');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({ type, content: content.trim() });
    setContent('');
    setType('note');
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <div className="activity-form-row">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="activity-type-select"
        >
          {ACTIVITY_TYPES.map(t => (
            <option key={t.value} value={t.value}>
              {t.icon} {t.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn-cancel-activity" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a note, log a call, or record activity..."
        className="activity-content-input"
        rows={3}
        autoFocus
      />
      <div className="activity-form-actions">
        <button
          type="submit"
          className="btn-save-activity"
          disabled={!content.trim()}
        >
          Save Activity
        </button>
      </div>
    </form>
  );
}

function ActivityItem({ activity, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(activity.id);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirm after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div className="activity-item">
      <div className="activity-icon">{getActivityIcon(activity.type)}</div>
      <div className="activity-details">
        <div className="activity-header">
          <span className="activity-type-label">{getActivityLabel(activity.type)}</span>
          <span className="activity-date">{formatActivityDate(activity.createdAt)}</span>
        </div>
        <p className="activity-content">{activity.content}</p>
      </div>
      <button
        className={`btn-delete-activity ${showDeleteConfirm ? 'confirm' : ''}`}
        onClick={handleDelete}
        title={showDeleteConfirm ? 'Click again to confirm' : 'Delete activity'}
      >
        {showDeleteConfirm ? '?' : '×'}
      </button>
    </div>
  );
}

function ActivityLog({
  entityType,
  entityId,
  activities,
  onAddActivity,
  onDeleteActivity,
  maxItems = 5
}) {
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSaveActivity = (activityData) => {
    onAddActivity({
      ...activityData,
      entityType,
      entityId
    });
    setShowForm(false);
  };

  const displayedActivities = showAll ? activities : activities.slice(0, maxItems);
  const hasMore = activities.length > maxItems;

  return (
    <div className="activity-log">
      <div className="activity-log-header">
        <h4>Activity Log ({activities.length})</h4>
        {!showForm && (
          <button
            className="btn-add-activity"
            onClick={() => setShowForm(true)}
          >
            + Add
          </button>
        )}
      </div>

      {showForm && (
        <ActivityForm
          onSave={handleSaveActivity}
          onCancel={() => setShowForm(false)}
        />
      )}

      {activities.length === 0 && !showForm ? (
        <p className="no-activities">No activities yet. Click "+ Add" to log your first note or interaction.</p>
      ) : (
        <div className="activity-list">
          {displayedActivities.map(activity => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onDelete={onDeleteActivity}
            />
          ))}
        </div>
      )}

      {hasMore && !showAll && (
        <button
          className="btn-show-more"
          onClick={() => setShowAll(true)}
        >
          Show {activities.length - maxItems} more...
        </button>
      )}
      {showAll && hasMore && (
        <button
          className="btn-show-less"
          onClick={() => setShowAll(false)}
        >
          Show less
        </button>
      )}
    </div>
  );
}

export default memo(ActivityLog);
