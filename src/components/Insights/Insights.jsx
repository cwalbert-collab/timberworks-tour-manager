import { useState } from 'react';
import RouteOptimizer from './RouteOptimizer';
import RevenuePrediction from './RevenuePrediction';
import SmartScheduling from './SmartScheduling';
import AnomalyDetection from './AnomalyDetection';
import PricingRecommendations from './PricingRecommendations';
import './Insights.css';

const SUB_VIEWS = [
  { id: 'route', label: 'Route Optimizer', icon: '🗺️', description: 'Optimize tour routes' },
  { id: 'revenue', label: 'Revenue Forecast', icon: '📈', description: 'Predict show revenue' },
  { id: 'scheduling', label: 'Smart Scheduling', icon: '📅', description: 'Find optimal dates' },
  { id: 'anomalies', label: 'Anomaly Detection', icon: '🔍', description: 'Find data issues' },
  { id: 'pricing', label: 'Pricing', icon: '💰', description: 'Fee recommendations' }
];

export default function Insights({ shows, venues }) {
  const [activeView, setActiveView] = useState('route');

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h2>AI Insights</h2>
        <p className="insights-subtitle">
          Smart algorithms to optimize your touring operations
        </p>
      </div>

      <nav className="insights-nav">
        {SUB_VIEWS.map(view => (
          <button
            key={view.id}
            className={`insights-nav-btn ${activeView === view.id ? 'active' : ''}`}
            onClick={() => setActiveView(view.id)}
          >
            <span className="nav-icon">{view.icon}</span>
            <span className="nav-label">{view.label}</span>
          </button>
        ))}
      </nav>

      <div className="insights-content">
        {activeView === 'route' && (
          <RouteOptimizer shows={shows} venues={venues} />
        )}
        {activeView === 'revenue' && (
          <RevenuePrediction shows={shows} venues={venues} />
        )}
        {activeView === 'scheduling' && (
          <SmartScheduling shows={shows} venues={venues} />
        )}
        {activeView === 'anomalies' && (
          <AnomalyDetection shows={shows} venues={venues} />
        )}
        {activeView === 'pricing' && (
          <PricingRecommendations shows={shows} venues={venues} />
        )}
      </div>
    </div>
  );
}
