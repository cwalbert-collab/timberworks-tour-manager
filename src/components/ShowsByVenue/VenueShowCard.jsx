import { memo } from 'react';
import ShowHistoryRow from './ShowHistoryRow';

function formatCurrency(amount) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const VenueShowCard = memo(function VenueShowCard({
  venueGroup,
  isExpanded,
  onToggleExpand,
  onSelectShow,
  onEdit,
  onDelete,
  selectedShowId
}) {
  const {
    venueId,
    venueName,
    city,
    state,
    totalShows,
    totalRevenue,
    nextShow,
    lastShow,
    futureShows,
    pastShows
  } = venueGroup;

  const hasUpcoming = futureShows.length > 0;

  return (
    <div className={`venue-show-card ${isExpanded ? 'expanded' : ''}`}>
      {/* Header - always visible */}
      <div
        className="vsc-header"
        onClick={() => onToggleExpand(venueId)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggleExpand(venueId)}
      >
        <div className="vsc-header-main">
          <h3 className="vsc-venue-name">{venueName}</h3>
          <p className="vsc-location">{city}, {state}</p>
        </div>

        <div className="vsc-header-stats">
          <span className="vsc-badge vsc-badge-count">
            {totalShows} show{totalShows !== 1 ? 's' : ''}
          </span>

          {hasUpcoming ? (
            <span className="vsc-badge vsc-badge-upcoming">
              Next: {formatDateShort(nextShow.startDate)}
            </span>
          ) : (
            <span className="vsc-badge vsc-badge-past">
              Last: {lastShow ? formatDateShort(lastShow.startDate) : 'None'}
            </span>
          )}

          <span className="vsc-badge vsc-badge-revenue">
            {formatCurrency(totalRevenue)}
          </span>
        </div>

        <span className={`vsc-expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>

      {/* Body - expandable */}
      {isExpanded && (
        <div className="vsc-body">
          {/* Upcoming Shows Section */}
          {futureShows.length > 0 && (
            <div className="vsc-section">
              <h4 className="vsc-section-header">
                <span className="vsc-section-icon upcoming">▶</span>
                Upcoming ({futureShows.length})
              </h4>
              <div className="vsc-show-list">
                {futureShows.map(show => (
                  <ShowHistoryRow
                    key={show.id}
                    show={show}
                    isPast={false}
                    isSelected={selectedShowId === show.id}
                    onSelect={onSelectShow}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Shows Section */}
          {pastShows.length > 0 && (
            <div className="vsc-section">
              <h4 className="vsc-section-header">
                <span className="vsc-section-icon past">○</span>
                Past Shows ({pastShows.length})
              </h4>
              <div className="vsc-show-list">
                {pastShows.map(show => (
                  <ShowHistoryRow
                    key={show.id}
                    show={show}
                    isPast={true}
                    isSelected={selectedShowId === show.id}
                    onSelect={onSelectShow}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {futureShows.length === 0 && pastShows.length === 0 && (
            <p className="vsc-empty">No shows recorded for this venue.</p>
          )}
        </div>
      )}
    </div>
  );
});

export default VenueShowCard;
