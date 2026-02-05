import React, { useState } from 'react';
import './GoogleSheetsSettings.css';

export default function GoogleSheetsSettings({
  isOpen,
  onClose,
  config,
  setConfig,
  syncing,
  lastSync,
  error,
  onFetchShows,
  onPushAllShows,
  testConnection,
  shows
}) {
  const [url, setUrl] = useState(config.url || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url.trim()) return;
    setTesting(true);
    setTestResult(null);

    const success = await testConnection(url);
    setTestResult(success ? 'success' : 'failed');
    setTesting(false);
  };

  const handleSave = () => {
    setConfig({ url: url.trim(), enabled: true });
    setTestResult(null);
  };

  const handleDisable = () => {
    setConfig({ ...config, enabled: false });
  };

  const handlePull = async () => {
    const result = await onFetchShows();
    if (result.success) {
      alert(`Pulled ${result.shows.length} shows from Google Sheets`);
    } else {
      alert(`Pull failed: ${result.error}`);
    }
  };

  const handlePush = async () => {
    if (!confirm(`This will replace ALL data in your Google Sheet with ${shows.length} shows. Continue?`)) {
      return;
    }
    const result = await onPushAllShows(shows);
    if (result.success) {
      alert(result.message);
    } else {
      alert(`Push failed: ${result.error}`);
    }
  };

  return (
    <div className="sheets-modal-overlay" onClick={onClose}>
      <div className="sheets-modal" onClick={e => e.stopPropagation()}>
        <div className="sheets-modal-header">
          <h2>Google Sheets Sync</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="sheets-modal-content">
          {/* Status */}
          <div className="sync-status">
            <div className={`status-indicator ${config.enabled ? 'connected' : 'disconnected'}`}>
              {config.enabled ? 'Connected' : 'Not Connected'}
            </div>
            {lastSync && (
              <div className="last-sync">
                Last sync: {lastSync.toLocaleTimeString()}
              </div>
            )}
            {error && <div className="sync-error">{error}</div>}
          </div>

          {/* Setup Instructions */}
          <div className="setup-instructions">
            <h3>Setup Instructions</h3>
            <ol>
              <li>Open your Google Sheet</li>
              <li>Go to <strong>Extensions → Apps Script</strong></li>
              <li>Copy code from <code>docs/google-apps-script.js</code></li>
              <li>Click <strong>Deploy → New deployment</strong></li>
              <li>Select <strong>Web app</strong>, set access to <strong>Anyone</strong></li>
              <li>Copy the deployment URL below</li>
            </ol>
          </div>

          {/* URL Input */}
          <div className="url-input-group">
            <label>Apps Script Web App URL</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="url-input"
            />
            <div className="url-actions">
              <button
                onClick={handleTest}
                disabled={!url.trim() || testing}
                className="btn-test"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              {testResult && (
                <span className={`test-result ${testResult}`}>
                  {testResult === 'success' ? '✓ Connected!' : '✗ Failed'}
                </span>
              )}
            </div>
          </div>

          {/* Column Requirements */}
          <div className="column-requirements">
            <h4>Required Sheet Columns</h4>
            <div className="columns-grid">
              {['id', 'venueName', 'city', 'state', 'startDate', 'endDate',
                'performanceFee', 'merchandiseSales', 'materialsUsed', 'expenses', 'tour'].map(col => (
                <code key={col}>{col}</code>
              ))}
            </div>
            <p className="hint">Your Google Sheet's first row must have these exact column headers.</p>
          </div>

          {/* Actions */}
          <div className="sheets-actions">
            {config.enabled ? (
              <>
                <button onClick={handlePull} disabled={syncing} className="btn-pull">
                  {syncing ? 'Syncing...' : 'Pull from Sheet'}
                </button>
                <button onClick={handlePush} disabled={syncing} className="btn-push">
                  Push to Sheet
                </button>
                <button onClick={handleDisable} className="btn-disable">
                  Disable Sync
                </button>
              </>
            ) : (
              <button
                onClick={handleSave}
                disabled={!url.trim() || testResult !== 'success'}
                className="btn-enable"
              >
                Enable Google Sheets Sync
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
