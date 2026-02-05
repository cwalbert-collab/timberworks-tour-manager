import './RevenueNav.css';

const SUB_VIEWS = [
  { id: 'transactions', label: 'Transactions', icon: '📝' },
  { id: 'by-show', label: 'By Show', icon: '🎪' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  { id: 'etsy', label: 'Etsy Shop', icon: '🛒' }
];

export default function RevenueNav({ activeView, onViewChange }) {
  return (
    <nav className="revenue-nav">
      <div className="revenue-nav-list">
        {SUB_VIEWS.map(view => (
          <button
            key={view.id}
            className={`revenue-nav-button ${activeView === view.id ? 'active' : ''}`}
            onClick={() => onViewChange(view.id)}
            aria-selected={activeView === view.id}
          >
            <span className="revenue-nav-icon">{view.icon}</span>
            <span className="revenue-nav-label">{view.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
