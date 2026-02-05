import { useState } from 'react';
import './TabNavigation.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', primary: true },
  { id: 'shows', label: 'Shows', icon: '📋', primary: true },
  { id: 'calendar', label: 'Calendar', icon: '📅', primary: true },
  { id: 'employees', label: 'Team', icon: '👥', primary: true },
  { id: 'insights', label: 'Insights', icon: '🧠', primary: false },
  { id: 'revenue', label: 'Revenue', icon: '💰', primary: false },
  { id: 'reports', label: 'Reports', icon: '📄', primary: false },
  { id: 'directory', label: 'Directory', icon: '📇', primary: false },
  { id: 'map', label: 'Map', icon: '🗺️', primary: false },
  { id: 'import-export', label: 'Import/Export', icon: '📁', primary: false }
];

const PRIMARY_TABS = TABS.filter(t => t.primary);
const SECONDARY_TABS = TABS.filter(t => !t.primary);

export default function TabNavigation({ activeTab, onTabChange }) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    setMoreMenuOpen(false);
  };

  const isSecondaryActive = SECONDARY_TABS.some(t => t.id === activeTab);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="tab-navigation desktop-nav">
        <div className="tab-list">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-list">
          {PRIMARY_TABS.map(tab => (
            <button
              key={tab.id}
              className={`mobile-nav-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
            >
              <span className="mobile-nav-icon">{tab.icon}</span>
              <span className="mobile-nav-label">{tab.label}</span>
            </button>
          ))}
          <button
            className={`mobile-nav-button ${isSecondaryActive ? 'active' : ''} ${moreMenuOpen ? 'menu-open' : ''}`}
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            aria-expanded={moreMenuOpen}
          >
            <span className="mobile-nav-icon">•••</span>
            <span className="mobile-nav-label">More</span>
          </button>
        </div>

        {/* More Menu Dropdown */}
        {moreMenuOpen && (
          <>
            <div className="more-menu-backdrop" onClick={() => setMoreMenuOpen(false)} />
            <div className="more-menu">
              {SECONDARY_TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`more-menu-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className="more-menu-icon">{tab.icon}</span>
                  <span className="more-menu-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </nav>
    </>
  );
}
