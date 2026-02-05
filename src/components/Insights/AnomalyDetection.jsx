import { useMemo } from 'react';
import { detectAnomalies, mean, standardDeviation } from '../../utils/insightsUtils';

export default function AnomalyDetection({ shows, venues }) {
  const anomalies = useMemo(() => {
    return detectAnomalies(shows, venues);
  }, [shows, venues]);

  // Group anomalies by type
  const groupedAnomalies = useMemo(() => {
    const groups = {
      alert: anomalies.filter(a => a.severity === 'alert'),
      warning: anomalies.filter(a => a.severity === 'warning'),
      info: anomalies.filter(a => a.severity === 'info')
    };
    return groups;
  }, [anomalies]);

  // Calculate data health score
  const healthScore = useMemo(() => {
    if (shows.length === 0) return 100;

    const totalShows = shows.length;
    const alertPenalty = groupedAnomalies.alert.length * 10;
    const warningPenalty = groupedAnomalies.warning.length * 5;
    const infoPenalty = groupedAnomalies.info.length * 1;

    const score = Math.max(0, 100 - ((alertPenalty + warningPenalty + infoPenalty) / totalShows * 10));
    return Math.round(score);
  }, [shows.length, groupedAnomalies]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (shows.length === 0) return null;

    const fees = shows.map(s => s.performanceFee || 0).filter(f => f > 0);
    const merch = shows.map(s => s.merchandiseSales || 0).filter(m => m > 0);
    const expenses = shows.map(s => s.expenses || 0).filter(e => e > 0);
    const profits = shows.map(s => s.profit || 0);

    return {
      fee: {
        mean: Math.round(mean(fees)),
        std: Math.round(standardDeviation(fees)),
        count: fees.length
      },
      merch: {
        mean: Math.round(mean(merch)),
        std: Math.round(standardDeviation(merch)),
        count: merch.length
      },
      expenses: {
        mean: Math.round(mean(expenses)),
        std: Math.round(standardDeviation(expenses)),
        count: expenses.length
      },
      profit: {
        mean: Math.round(mean(profits)),
        std: Math.round(standardDeviation(profits)),
        negative: profits.filter(p => p < 0).length
      }
    };
  }, [shows]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'alert': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return '#2e7d32';
    if (score >= 60) return '#f57c00';
    return '#c62828';
  };

  return (
    <div className="insight-section anomaly-detection">
      <div className="insight-header">
        <h3>Anomaly Detection</h3>
        <p className="insight-description">
          Automatically identifies unusual patterns, outliers, and potential data entry errors in your show records.
        </p>
      </div>

      <div className="anomaly-summary">
        <div className="health-score-card">
          <div className="health-circle" style={{ borderColor: getHealthColor(healthScore) }}>
            <span className="health-value" style={{ color: getHealthColor(healthScore) }}>
              {healthScore}
            </span>
            <span className="health-label">Data Health</span>
          </div>
          <div className="health-breakdown">
            <div className={`health-item ${groupedAnomalies.alert.length > 0 ? 'has-issues' : ''}`}>
              <span className="severity-icon">🚨</span>
              <span className="severity-count">{groupedAnomalies.alert.length}</span>
              <span className="severity-label">Critical</span>
            </div>
            <div className={`health-item ${groupedAnomalies.warning.length > 0 ? 'has-issues' : ''}`}>
              <span className="severity-icon">⚠️</span>
              <span className="severity-count">{groupedAnomalies.warning.length}</span>
              <span className="severity-label">Warnings</span>
            </div>
            <div className="health-item">
              <span className="severity-icon">ℹ️</span>
              <span className="severity-count">{groupedAnomalies.info.length}</span>
              <span className="severity-label">Info</span>
            </div>
          </div>
        </div>

        {stats && (
          <div className="stats-overview">
            <h4>Normal Ranges (based on your data)</h4>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Performance Fee</span>
                <span className="stat-value">${stats.fee.mean.toLocaleString()}</span>
                <span className="stat-range">±${stats.fee.std.toLocaleString()}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Merchandise</span>
                <span className="stat-value">${stats.merch.mean.toLocaleString()}</span>
                <span className="stat-range">±${stats.merch.std.toLocaleString()}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Expenses</span>
                <span className="stat-value">${stats.expenses.mean.toLocaleString()}</span>
                <span className="stat-range">±${stats.expenses.std.toLocaleString()}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Profit</span>
                <span className="stat-value">${stats.profit.mean.toLocaleString()}</span>
                <span className="stat-range">
                  {stats.profit.negative > 0 && (
                    <span className="negative-count">{stats.profit.negative} losses</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="anomaly-list">
        {anomalies.length === 0 ? (
          <div className="no-anomalies">
            <span className="success-icon">✓</span>
            <h4>All Clear!</h4>
            <p>No anomalies detected in your show data. Everything looks normal.</p>
          </div>
        ) : (
          <>
            {groupedAnomalies.alert.length > 0 && (
              <div className="anomaly-group alert">
                <h4>Critical Issues ({groupedAnomalies.alert.length})</h4>
                <div className="anomaly-cards">
                  {groupedAnomalies.alert.map((anomaly, idx) => (
                    <div key={`alert-${idx}`} className="anomaly-card alert">
                      <div className="anomaly-header">
                        <span className="anomaly-icon">{getSeverityIcon(anomaly.severity)}</span>
                        <span className="anomaly-type">{anomaly.type.replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                      <div className="anomaly-content">
                        <p className="anomaly-message">{anomaly.message}</p>
                        <div className="anomaly-meta">
                          <span className="anomaly-venue">{anomaly.venue}</span>
                          <span className="anomaly-date">{formatDate(anomaly.date)}</span>
                        </div>
                        <div className="anomaly-values">
                          <span>Actual: ${Math.abs(anomaly.value).toLocaleString()}</span>
                          {anomaly.expected > 0 && (
                            <span>Expected: ~${anomaly.expected.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedAnomalies.warning.length > 0 && (
              <div className="anomaly-group warning">
                <h4>Warnings ({groupedAnomalies.warning.length})</h4>
                <div className="anomaly-cards">
                  {groupedAnomalies.warning.map((anomaly, idx) => (
                    <div key={`warning-${idx}`} className="anomaly-card warning">
                      <div className="anomaly-header">
                        <span className="anomaly-icon">{getSeverityIcon(anomaly.severity)}</span>
                        <span className="anomaly-type">{anomaly.type.replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                      <div className="anomaly-content">
                        <p className="anomaly-message">{anomaly.message}</p>
                        <div className="anomaly-meta">
                          <span className="anomaly-venue">{anomaly.venue}</span>
                          <span className="anomaly-date">{formatDate(anomaly.date)}</span>
                        </div>
                        <div className="anomaly-values">
                          <span>Actual: ${Math.abs(anomaly.value).toLocaleString()}</span>
                          {anomaly.expected > 0 && (
                            <span>Expected: ~${anomaly.expected.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedAnomalies.info.length > 0 && (
              <div className="anomaly-group info">
                <h4>Information ({groupedAnomalies.info.length})</h4>
                <div className="anomaly-cards">
                  {groupedAnomalies.info.map((anomaly, idx) => (
                    <div key={`info-${idx}`} className="anomaly-card info">
                      <div className="anomaly-header">
                        <span className="anomaly-icon">{getSeverityIcon(anomaly.severity)}</span>
                        <span className="anomaly-type">{anomaly.type.replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                      <div className="anomaly-content">
                        <p className="anomaly-message">{anomaly.message}</p>
                        <div className="anomaly-meta">
                          <span className="anomaly-venue">{anomaly.venue}</span>
                          <span className="anomaly-date">{formatDate(anomaly.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="anomaly-tips">
        <h4>Understanding Anomalies</h4>
        <ul>
          <li><strong>Critical:</strong> Significant issues like negative profits that need immediate attention</li>
          <li><strong>Warnings:</strong> Values significantly outside normal range - verify they're correct</li>
          <li><strong>Info:</strong> Noteworthy patterns that may be intentional (e.g., promotional shows with no fee)</li>
        </ul>
      </div>
    </div>
  );
}
