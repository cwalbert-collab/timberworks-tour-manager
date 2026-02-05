import { useState, useRef, useCallback } from 'react';
import { downloadCSV, importFromFile, validateImport } from '../../utils/csvUtils';
import './CSVTools.css';

export default function CSVTools({ shows, onImport, existingShows, onReset, onResetDirectory, venueCount, contactCount }) {
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetType, setResetType] = useState('all'); // 'all', 'shows', 'directory'
  const fileInputRef = useRef(null);

  // Handle export
  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(shows, `lumberjack-tours-${timestamp}.csv`);
    setImportStatus({ type: 'success', message: 'CSV exported successfully!' });
    setTimeout(() => setImportStatus(null), 3000);
  };

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file) return;

    setImportStatus({ type: 'loading', message: 'Processing CSV...' });

    try {
      const importedShows = await importFromFile(file);
      const validation = validateImport(importedShows, existingShows);

      if (!validation.valid) {
        setImportStatus({
          type: 'error',
          message: validation.errors.join('\n')
        });
        return;
      }

      // Show confirmation dialog
      setPendingImport({ shows: importedShows, validation });
      setShowConfirm(true);
      setImportStatus(null);
    } catch (err) {
      setImportStatus({ type: 'error', message: err.message });
    }
  };

  // Confirm import
  const confirmImport = () => {
    if (pendingImport) {
      onImport(pendingImport.shows);
      setImportStatus({
        type: 'success',
        message: `Imported successfully! ${pendingImport.validation.summary}`
      });
      setTimeout(() => setImportStatus(null), 4000);
    }
    setShowConfirm(false);
    setPendingImport(null);
  };

  // Cancel import
  const cancelImport = () => {
    setShowConfirm(false);
    setPendingImport(null);
  };

  // Handle reset to sample data
  const handleResetClick = (type) => {
    setResetType(type);
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    let message = '';
    if (resetType === 'all' || resetType === 'shows') {
      onReset();
      message = 'Shows reset successfully!';
    }
    if (resetType === 'all' || resetType === 'directory') {
      onResetDirectory?.();
      message = resetType === 'all'
        ? 'All data reset to sample data successfully!'
        : 'Directory reset successfully!';
    }
    setShowResetConfirm(false);
    setImportStatus({
      type: 'success',
      message
    });
    setTimeout(() => setImportStatus(null), 3000);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
    setResetType('all');
  };

  // File input change handler
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the container entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [existingShows]);

  return (
    <div className="csv-tools">
      <div className="csv-tools-header">
        <h3>Data Import/Export</h3>
        <p className="csv-tools-subtitle">
          Export to edit in Excel or Google Sheets, then import your changes
        </p>
      </div>

      <div className="csv-tools-actions">
        {/* Export Button */}
        <button className="btn-export" onClick={handleExport}>
          <span className="btn-icon">↓</span>
          Export CSV
        </button>

        {/* Import Button */}
        <button
          className="btn-import"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="btn-icon">↑</span>
          Import CSV
        </button>

        {/* Reset Buttons */}
        <div className="reset-button-group">
          <button className="btn-reset" onClick={() => handleResetClick('all')}>
            <span className="btn-icon">↻</span>
            Reset All Data
          </button>
          <button className="btn-reset btn-reset-small" onClick={() => handleResetClick('directory')}>
            <span className="btn-icon">📁</span>
            Reset Directory Only
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Drag and Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          <span className="drop-icon">📄</span>
          <p>Drag & drop a CSV file here to import</p>
          <p className="drop-hint">or use the Import button above</p>
        </div>
      </div>

      {/* Status Message */}
      {importStatus && (
        <div className={`import-status ${importStatus.type}`}>
          {importStatus.type === 'loading' && <span className="spinner"></span>}
          {importStatus.message}
        </div>
      )}

      {/* Import Confirmation Modal */}
      {showConfirm && pendingImport && (
        <div className="csv-confirm-overlay">
          <div className="csv-confirm-modal">
            <h3>Confirm Import</h3>
            <div className="import-summary">
              <p><strong>{pendingImport.shows.length}</strong> shows found in file:</p>
              <ul>
                <li><span className="count">{pendingImport.validation.newShows.length}</span> new shows will be added</li>
                <li><span className="count">{pendingImport.validation.updatedShows.length}</span> existing shows will be updated</li>
              </ul>
            </div>
            <p className="import-warning">
              This will replace any existing shows with matching IDs.
            </p>
            <div className="csv-confirm-actions">
              <button className="btn-cancel" onClick={cancelImport}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmImport}>
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="csv-confirm-overlay">
          <div className="csv-confirm-modal reset-modal">
            <h3>
              {resetType === 'all' && 'Reset All Data?'}
              {resetType === 'shows' && 'Reset Shows Only?'}
              {resetType === 'directory' && 'Reset Directory Only?'}
            </h3>
            <div className="reset-warning">
              <span className="warning-icon">⚠️</span>
              <div>
                <p><strong>This will permanently delete your current data</strong></p>
                {resetType === 'all' && (
                  <p>All {shows.length} shows, {venueCount || 0} venues, and {contactCount || 0} contacts will be replaced. This action cannot be undone.</p>
                )}
                {resetType === 'shows' && (
                  <p>All {shows.length} shows will be replaced with sample show data. Directory will remain unchanged.</p>
                )}
                {resetType === 'directory' && (
                  <p>All {venueCount || 0} venues and {contactCount || 0} contacts will be replaced with 40 sample venues and contacts.</p>
                )}
              </div>
            </div>
            <div className="reset-info">
              {(resetType === 'all' || resetType === 'shows') && (
                <>
                  <p>The sample shows include:</p>
                  <ul>
                    <li>56 shows across 40 unique venues</li>
                    <li>Past shows (2024-early 2026)</li>
                    <li>Upcoming shows (next 2 months)</li>
                    <li>Future bookings (2026 season)</li>
                  </ul>
                </>
              )}
              {(resetType === 'all' || resetType === 'directory') && (
                <>
                  <p>{resetType === 'all' ? 'The sample directory includes:' : 'The sample data includes:'}</p>
                  <ul>
                    <li>40 venues across 15 states (Midwest-focused)</li>
                    <li>40+ contacts with venue associations</li>
                    <li>1 independent talent agent contact</li>
                  </ul>
                </>
              )}
            </div>
            <div className="csv-confirm-actions">
              <button className="btn-cancel" onClick={cancelReset}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmReset}>
                {resetType === 'all' && 'Reset All Data'}
                {resetType === 'shows' && 'Reset Shows'}
                {resetType === 'directory' && 'Reset Directory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="csv-help">
        <details>
          <summary>How to use CSV import/export</summary>
          <ol>
            <li><strong>Export</strong> your current data to CSV</li>
            <li><strong>Open</strong> the CSV in Excel or Google Sheets</li>
            <li><strong>Edit</strong> existing rows or add new ones</li>
            <li><strong>Save</strong> as CSV (not .xlsx or .xls)</li>
            <li><strong>Import</strong> the updated CSV back here</li>
          </ol>
          <p className="help-note">
            <strong>Tip:</strong> Keep the ID column intact for existing shows to update them.
            Leave ID blank for new shows.
          </p>
        </details>
      </div>
    </div>
  );
}
