import { memo } from 'react';

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (startDate === endDate) {
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return `${startStr} - ${endStr}`;
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString()}`;
}

const ShowHistoryRow = memo(function ShowHistoryRow({
  show,
  isPast,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) {
  const duration = calculateDuration(show.startDate, show.endDate);
  const revenue = (show.performanceFee || 0) + (show.merchandiseSales || 0);
  const profit = revenue - (show.materialsUsed || 0) - (show.expenses || 0);

  const isRedTeam = show.tour === 'Red Team';

  return (
    <div
      className={`show-history-row ${isPast ? 'past' : 'upcoming'} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(show)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(show)}
    >
      <div className="shr-main">
        <span className="shr-date">
          {formatDateRange(show.startDate, show.endDate)}
        </span>
        <span className="shr-duration">
          {duration}d
        </span>
        <span className={`shr-team ${isRedTeam ? 'red' : 'blue'}`}>
          {isRedTeam ? 'Red' : 'Blue'}
        </span>
      </div>

      <div className="shr-financials">
        <span className="shr-fee" title="Performance Fee">
          {formatCurrency(show.performanceFee || 0)}
        </span>
        <span className="shr-merch" title="Merchandise">
          +{formatCurrency(show.merchandiseSales || 0)}
        </span>
        <span className={`shr-profit ${profit >= 0 ? 'positive' : 'negative'}`} title="Profit">
          = {formatCurrency(profit)}
        </span>
      </div>

      <div className="shr-actions">
        <button
          className="shr-btn-edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(show);
          }}
          title="Edit show"
        >
          Edit
        </button>
        <button
          className="shr-btn-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(show);
          }}
          title="Delete show"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default ShowHistoryRow;
