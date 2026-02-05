import { useState, useRef, useCallback } from 'react';
import { downloadCSV, importFromFile, validateImport } from '../../utils/csvUtils';
import {
  downloadVenuesCSV,
  downloadContactsCSV,
  importVenuesFromFile,
  importContactsFromFile,
  validateVenueImport,
  validateContactImport
} from '../../utils/directoryCsvUtils';
import {
  downloadTransactionsCSV,
  downloadPLCSV,
  downloadInventoryCSV,
  importTransactionsFromFile,
  importInventoryFromFile,
  validateTransactionImport,
  validateInventoryImport
} from '../../utils/revenueCsvUtils';
import './CSVTools.css';

export default function CSVTools({
  // Shows data
  shows,
  onImport,
  existingShows,
  // Directory data
  venues,
  contacts,
  onImportVenues,
  onImportContacts,
  // Revenue data
  transactions,
  inventory,
  onImportTransactions,
  onImportInventory,
  // Reset functions
  onReset,
  onResetDirectory,
  onResetRevenue,
  venueCount,
  contactCount,
  // Google Sheets
  onOpenGoogleSheets,
  googleSheetsConnected
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [importType, setImportType] = useState(null); // 'shows', 'venues', 'contacts', 'transactions', 'inventory'
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetType, setResetType] = useState('all');
  const [activeSection, setActiveSection] = useState('shows'); // 'shows', 'directory', 'revenue'

  // File input refs for each type
  const showsFileRef = useRef(null);
  const venuesFileRef = useRef(null);
  const contactsFileRef = useRef(null);
  const transactionsFileRef = useRef(null);
  const inventoryFileRef = useRef(null);

  // ===== EXPORT HANDLERS =====

  const handleExportShows = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(shows, `lumberjack-shows-${timestamp}.csv`);
    showSuccessMessage('Shows CSV exported successfully!');
  };

  const handleExportVenues = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadVenuesCSV(venues || [], `lumberjack-venues-${timestamp}.csv`);
    showSuccessMessage('Venues CSV exported successfully!');
  };

  const handleExportContacts = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadContactsCSV(contacts || [], venues || [], `lumberjack-contacts-${timestamp}.csv`);
    showSuccessMessage('Contacts CSV exported successfully!');
  };

  const handleExportTransactions = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadTransactionsCSV(transactions || [], `lumberjack-transactions-${timestamp}.csv`);
    showSuccessMessage('Transactions CSV exported successfully!');
  };

  const handleExportPL = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadPLCSV(transactions || [], shows || [], `lumberjack-pl-summary-${timestamp}.csv`);
    showSuccessMessage('P&L Summary CSV exported successfully!');
  };

  const handleExportInventory = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadInventoryCSV(inventory || [], `lumberjack-inventory-${timestamp}.csv`);
    showSuccessMessage('Inventory CSV exported successfully!');
  };

  // ===== IMPORT HANDLERS =====

  const handleFileSelect = async (file, type) => {
    if (!file) return;

    setImportStatus({ type: 'loading', message: `Processing ${type} CSV...` });

    try {
      let imported, validation;

      switch (type) {
        case 'shows':
          imported = await importFromFile(file);
          validation = validateImport(imported, existingShows || []);
          break;
        case 'venues':
          imported = await importVenuesFromFile(file);
          validation = validateVenueImport(imported, venues || []);
          break;
        case 'contacts':
          imported = await importContactsFromFile(file);
          validation = validateContactImport(imported, contacts || []);
          break;
        case 'transactions':
          imported = await importTransactionsFromFile(file);
          validation = validateTransactionImport(imported, transactions || []);
          break;
        case 'inventory':
          imported = await importInventoryFromFile(file);
          validation = validateInventoryImport(imported, inventory || []);
          break;
        default:
          throw new Error('Unknown import type');
      }

      if (!validation.valid) {
        setImportStatus({
          type: 'error',
          message: validation.errors.join('\n')
        });
        return;
      }

      setPendingImport({ data: imported, validation, type });
      setImportType(type);
      setShowConfirm(true);
      setImportStatus(null);
    } catch (err) {
      setImportStatus({ type: 'error', message: err.message });
    }
  };

  const handleInputChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, type);
      e.target.value = '';
    }
  };

  // Confirm import
  const confirmImport = () => {
    if (!pendingImport) return;

    const { data, validation, type } = pendingImport;

    switch (type) {
      case 'shows':
        onImport?.(data);
        break;
      case 'venues':
        onImportVenues?.(data);
        break;
      case 'contacts':
        onImportContacts?.(data);
        break;
      case 'transactions':
        onImportTransactions?.(data);
        break;
      case 'inventory':
        onImportInventory?.(data);
        break;
    }

    showSuccessMessage(`Imported successfully! ${validation.summary}`);
    setShowConfirm(false);
    setPendingImport(null);
    setImportType(null);
  };

  const cancelImport = () => {
    setShowConfirm(false);
    setPendingImport(null);
    setImportType(null);
  };

  // ===== RESET HANDLERS =====

  const handleResetClick = (type) => {
    setResetType(type);
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    let message = '';
    if (resetType === 'all') {
      onReset?.();
      onResetDirectory?.();
      onResetRevenue?.();
      message = 'All data reset to sample data successfully!';
    } else if (resetType === 'shows') {
      onReset?.();
      message = 'Shows reset successfully!';
    } else if (resetType === 'directory') {
      onResetDirectory?.();
      message = 'Directory reset successfully!';
    } else if (resetType === 'revenue') {
      onResetRevenue?.();
      message = 'Revenue data reset successfully!';
    }
    setShowResetConfirm(false);
    showSuccessMessage(message);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
    setResetType('all');
  };

  // ===== DRAG AND DROP =====

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
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
      // Determine type based on active section
      handleFileSelect(file, activeSection === 'directory' ? 'venues' : activeSection === 'revenue' ? 'transactions' : 'shows');
    }
  }, [activeSection, existingShows, venues, contacts, transactions, inventory]);

  // ===== HELPERS =====

  const showSuccessMessage = (message) => {
    setImportStatus({ type: 'success', message });
    setTimeout(() => setImportStatus(null), 4000);
  };

  const getImportSummary = () => {
    if (!pendingImport) return null;
    const { data, validation, type } = pendingImport;

    const typeLabels = {
      shows: 'shows',
      venues: 'venues',
      contacts: 'contacts',
      transactions: 'transactions',
      inventory: 'inventory items'
    };

    const newCount = type === 'venues' ? validation.newVenues?.length :
                     type === 'contacts' ? validation.newContacts?.length :
                     type === 'transactions' ? validation.newTransactions?.length :
                     type === 'inventory' ? validation.newItems?.length :
                     validation.newShows?.length;

    const updatedCount = type === 'venues' ? validation.updatedVenues?.length :
                         type === 'contacts' ? validation.updatedContacts?.length :
                         type === 'transactions' ? validation.updatedTransactions?.length :
                         type === 'inventory' ? validation.updatedItems?.length :
                         validation.updatedShows?.length;

    return {
      total: data.length,
      label: typeLabels[type],
      newCount: newCount || 0,
      updatedCount: updatedCount || 0
    };
  };

  return (
    <div className="csv-tools">
      <div className="csv-tools-header">
        <h3>Data Import/Export</h3>
        <p className="csv-tools-subtitle">
          Export to edit in Excel or Google Sheets, then import your changes
        </p>
      </div>

      {/* Section Tabs */}
      <div className="csv-section-tabs">
        <button
          className={`csv-tab ${activeSection === 'shows' ? 'active' : ''}`}
          onClick={() => setActiveSection('shows')}
        >
          Shows
        </button>
        <button
          className={`csv-tab ${activeSection === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveSection('directory')}
        >
          Directory
        </button>
        <button
          className={`csv-tab ${activeSection === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveSection('revenue')}
        >
          Revenue
        </button>
      </div>

      {/* SHOWS SECTION */}
      {activeSection === 'shows' && (
        <div className="csv-section">
          <div className="csv-section-header">
            <span className="section-icon">📋</span>
            <div>
              <h4>Shows Data</h4>
              <p>{shows?.length || 0} shows in database</p>
            </div>
          </div>
          <div className="csv-tools-actions">
            <button className="btn-export" onClick={handleExportShows}>
              <span className="btn-icon">↓</span>
              Export Shows
            </button>
            <button className="btn-import" onClick={() => showsFileRef.current?.click()}>
              <span className="btn-icon">↑</span>
              Import Shows
            </button>
            <input
              ref={showsFileRef}
              type="file"
              accept=".csv"
              onChange={(e) => handleInputChange(e, 'shows')}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}

      {/* DIRECTORY SECTION */}
      {activeSection === 'directory' && (
        <div className="csv-section">
          {/* Venues */}
          <div className="csv-subsection">
            <div className="csv-section-header">
              <span className="section-icon">📍</span>
              <div>
                <h4>Venues</h4>
                <p>{venues?.length || 0} venues in database</p>
              </div>
            </div>
            <div className="csv-tools-actions">
              <button className="btn-export" onClick={handleExportVenues}>
                <span className="btn-icon">↓</span>
                Export Venues
              </button>
              <button className="btn-import" onClick={() => venuesFileRef.current?.click()}>
                <span className="btn-icon">↑</span>
                Import Venues
              </button>
              <input
                ref={venuesFileRef}
                type="file"
                accept=".csv"
                onChange={(e) => handleInputChange(e, 'venues')}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="csv-subsection">
            <div className="csv-section-header">
              <span className="section-icon">👤</span>
              <div>
                <h4>Contacts</h4>
                <p>{contacts?.length || 0} contacts in database</p>
              </div>
            </div>
            <div className="csv-tools-actions">
              <button className="btn-export" onClick={handleExportContacts}>
                <span className="btn-icon">↓</span>
                Export Contacts
              </button>
              <button className="btn-import" onClick={() => contactsFileRef.current?.click()}>
                <span className="btn-icon">↑</span>
                Import Contacts
              </button>
              <input
                ref={contactsFileRef}
                type="file"
                accept=".csv"
                onChange={(e) => handleInputChange(e, 'contacts')}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* REVENUE SECTION */}
      {activeSection === 'revenue' && (
        <div className="csv-section">
          {/* Transactions */}
          <div className="csv-subsection">
            <div className="csv-section-header">
              <span className="section-icon">💰</span>
              <div>
                <h4>Transactions (Raw Data)</h4>
                <p>{transactions?.length || 0} transactions in database</p>
              </div>
            </div>
            <div className="csv-tools-actions">
              <button className="btn-export" onClick={handleExportTransactions}>
                <span className="btn-icon">↓</span>
                Export Transactions
              </button>
              <button className="btn-import" onClick={() => transactionsFileRef.current?.click()}>
                <span className="btn-icon">↑</span>
                Import Transactions
              </button>
              <input
                ref={transactionsFileRef}
                type="file"
                accept=".csv"
                onChange={(e) => handleInputChange(e, 'transactions')}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* P&L Summary */}
          <div className="csv-subsection">
            <div className="csv-section-header">
              <span className="section-icon">📊</span>
              <div>
                <h4>P&L Summary (Monthly)</h4>
                <p>Aggregated from transactions data</p>
              </div>
            </div>
            <div className="csv-tools-actions">
              <button className="btn-export btn-export-pl" onClick={handleExportPL}>
                <span className="btn-icon">↓</span>
                Export P&L Summary
              </button>
              <span className="export-only-note">Export only - calculated from transactions</span>
            </div>
          </div>

          {/* Inventory */}
          <div className="csv-subsection">
            <div className="csv-section-header">
              <span className="section-icon">📦</span>
              <div>
                <h4>Inventory</h4>
                <p>{inventory?.length || 0} items in database</p>
              </div>
            </div>
            <div className="csv-tools-actions">
              <button className="btn-export" onClick={handleExportInventory}>
                <span className="btn-icon">↓</span>
                Export Inventory
              </button>
              <button className="btn-import" onClick={() => inventoryFileRef.current?.click()}>
                <span className="btn-icon">↑</span>
                Import Inventory
              </button>
              <input
                ref={inventoryFileRef}
                type="file"
                accept=".csv"
                onChange={(e) => handleInputChange(e, 'inventory')}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

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
          <p className="drop-hint">
            {activeSection === 'shows' && 'Will import as Shows data'}
            {activeSection === 'directory' && 'Will import as Venues data'}
            {activeSection === 'revenue' && 'Will import as Transactions data'}
          </p>
        </div>
      </div>

      {/* Status Message */}
      {importStatus && (
        <div className={`import-status ${importStatus.type}`}>
          {importStatus.type === 'loading' && <span className="spinner"></span>}
          {importStatus.message}
        </div>
      )}

      {/* Reset & Google Sheets Section */}
      <div className="csv-tools-footer">
        <div className="reset-button-group">
          <button className="btn-reset" onClick={() => handleResetClick('all')}>
            <span className="btn-icon">↻</span>
            Reset All Data
          </button>
          <button className="btn-reset btn-reset-small" onClick={() => handleResetClick('shows')}>
            <span className="btn-icon">📋</span>
            Shows
          </button>
          <button className="btn-reset btn-reset-small" onClick={() => handleResetClick('directory')}>
            <span className="btn-icon">📁</span>
            Directory
          </button>
          <button className="btn-reset btn-reset-small" onClick={() => handleResetClick('revenue')}>
            <span className="btn-icon">💰</span>
            Revenue
          </button>
        </div>

        <button
          className={`btn-google-sheets ${googleSheetsConnected ? 'connected' : ''}`}
          onClick={onOpenGoogleSheets}
        >
          <span className="btn-icon">📊</span>
          {googleSheetsConnected ? 'Google Sheets Connected' : 'Connect Google Sheets'}
        </button>
      </div>

      {/* Import Confirmation Modal */}
      {showConfirm && pendingImport && (
        <div className="csv-confirm-overlay">
          <div className="csv-confirm-modal">
            <h3>Confirm Import</h3>
            {(() => {
              const summary = getImportSummary();
              return summary && (
                <div className="import-summary">
                  <p><strong>{summary.total}</strong> {summary.label} found in file:</p>
                  <ul>
                    <li><span className="count">{summary.newCount}</span> new will be added</li>
                    <li><span className="count">{summary.updatedCount}</span> existing will be updated</li>
                  </ul>
                </div>
              );
            })()}
            <p className="import-warning">
              This will replace any existing records with matching IDs.
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
              {resetType === 'revenue' && 'Reset Revenue Data?'}
            </h3>
            <div className="reset-warning">
              <span className="warning-icon">⚠️</span>
              <div>
                <p><strong>This will permanently delete your current data</strong></p>
                {resetType === 'all' && (
                  <p>All {shows?.length || 0} shows, {venueCount || 0} venues, {contactCount || 0} contacts, and revenue data will be replaced.</p>
                )}
                {resetType === 'shows' && (
                  <p>All {shows?.length || 0} shows will be replaced with sample data.</p>
                )}
                {resetType === 'directory' && (
                  <p>All {venueCount || 0} venues and {contactCount || 0} contacts will be replaced with sample data.</p>
                )}
                {resetType === 'revenue' && (
                  <p>All transactions, inventory, and payment data will be replaced with sample data.</p>
                )}
              </div>
            </div>
            <div className="csv-confirm-actions">
              <button className="btn-cancel" onClick={cancelReset}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmReset}>
                Reset {resetType === 'all' ? 'All Data' : resetType.charAt(0).toUpperCase() + resetType.slice(1)}
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
            <strong>Tip:</strong> Keep the ID column intact for existing records to update them.
            Leave ID blank for new records.
          </p>
        </details>
      </div>
    </div>
  );
}
