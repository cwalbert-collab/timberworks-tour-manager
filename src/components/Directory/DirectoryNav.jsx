import './DirectoryNav.css';

const SUB_VIEWS = [
  { id: 'venues', label: 'Venues', icon: '🏟️' },
  { id: 'contacts', label: 'Contacts', icon: '👤' }
];

export default function DirectoryNav({ activeView, onViewChange }) {
  return (
    <div className="directory-nav">
      {SUB_VIEWS.map(view => (
        <button
          key={view.id}
          className={`directory-nav-btn ${activeView === view.id ? 'active' : ''}`}
          onClick={() => onViewChange(view.id)}
        >
          <span className="nav-icon">{view.icon}</span>
          <span className="nav-label">{view.label}</span>
        </button>
      ))}
    </div>
  );
}
