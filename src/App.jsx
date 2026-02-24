import { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable from './components/DataTable/DataTable';
import ShowsByVenue from './components/ShowsByVenue/ShowsByVenue';
import ShowForm from './components/Forms/ShowForm';
import TourMap from './components/Map/TourMap';
import CSVTools from './components/CSVTools/CSVTools';
import Dashboard from './components/Dashboard/Dashboard';
import Revenue from './components/Revenue/Revenue';
import Directory from './components/Directory/Directory';
import Calendar from './components/Calendar/Calendar';
import EmployeeList from './components/Employees/EmployeeList';
import Insights from './components/Insights/Insights';
import Reports from './components/Reports/Reports';
import TabNavigation from './components/TabNavigation/TabNavigation';
import GlobalSearch from './components/GlobalSearch/GlobalSearch';
import InstallPrompt from './components/PWA/InstallPrompt';
import DesignEditor from './components/DesignEditor/DesignEditor';
import GoogleSheetsSettings from './components/GoogleSheetsSettings/GoogleSheetsSettings';
import { useShows } from './hooks/useShows';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { useRevenue } from './hooks/useRevenue';
import { useDirectory } from './hooks/useDirectory';
import { useEmployees } from './hooks/useEmployees';
import { useEtsy } from './hooks/useEtsy';
import { useTheme } from './hooks/useTheme';
import { formatDateRange } from './data/sampleData';
import './App.css';

function App() {
  const { shows, isLoaded, addShow, updateShow, deleteShow, importShows, resetToSampleData } = useShows();
  const {
    transactions,
    inventory,
    payments,
    isLoaded: revenueLoaded,
    metrics: revenueMetrics,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
    addPayment,
    updatePayment,
    deletePayment,
    markPaymentPaid,
    getShowRevenueBreakdown,
    getShowPayment,
    importTransactions,
    importInventory,
    resetToSampleData: resetRevenueToSampleData
  } = useRevenue();
  const {
    venues,
    contacts,
    isLoaded: directoryLoaded,
    metrics: directoryMetrics,
    addVenue,
    updateVenue,
    deleteVenue,
    addContact,
    updateContact,
    deleteContact,
    addActivity,
    deleteActivity,
    getVenueContacts,
    getContactVenue,
    getEntityActivities,
    importVenues,
    importContacts,
    resetToSampleData: resetDirectoryToSampleData
  } = useDirectory();

  // Employee management - pass shows for day counting
  const {
    employees,
    isLoaded: employeesLoaded,
    employeeDaysWorked,
    certificationAlerts,
    metrics: employeeMetrics,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmploymentType,
    getShowAssignments,
    updateShowAssignments,
    importEmployees
  } = useEmployees(shows);

  // Etsy integration - pass importTransactions to sync orders as transactions
  const etsy = useEtsy((importedTxns) => {
    importedTxns.forEach(txn => addTransaction(txn));
  });

  // Theme management
  const { theme, toggleTheme } = useTheme();

  const [selectedShow, setSelectedShow] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRouteLines, setShowRouteLines] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [highlightedDirectoryItem, setHighlightedDirectoryItem] = useState(null); // { type: 'venue'|'contact', id: string }
  const [designEditorOpen, setDesignEditorOpen] = useState(false);
  const [designEditorPosition, setDesignEditorPosition] = useState(null);
  const [sheetsSettingsOpen, setSheetsSettingsOpen] = useState(false);
  const [showsView, setShowsView] = useState('venue'); // 'table' or 'venue'

  // Google Sheets two-way sync
  const googleSheets = useGoogleSheets();

  // Right-click handler for design editor
  useEffect(() => {
    const handleContextMenu = (e) => {
      // Only trigger on right-click with Ctrl or Meta key held
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setDesignEditorPosition({ x: e.clientX, y: e.clientY });
        setDesignEditorOpen(true);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Create lookup maps for venues and contacts (for Directory lookups)
  const venueMap = useMemo(() => {
    const map = new Map();
    venues.forEach(v => map.set(v.id, v));
    return map;
  }, [venues]);

  const contactMap = useMemo(() => {
    const map = new Map();
    contacts.forEach(c => map.set(c.id, c));
    return map;
  }, [contacts]);

  // Get venue info for a show (live lookup from Directory)
  const getVenueInfo = useCallback((show) => {
    if (!show) return null;
    const venue = venueMap.get(show.venueId);
    if (venue) {
      return {
        venueName: venue.name,
        city: venue.city,
        state: venue.state,
        address: venue.address,
        zip: venue.zip,
        venueType: venue.type,
        capacity: venue.capacity
      };
    }
    // Fallback to show data if venue not found (backwards compatibility)
    return {
      venueName: show.venueName || 'Unknown Venue',
      city: show.city || '',
      state: show.state || '',
      address: show.address || '',
      zip: show.zip || ''
    };
  }, [venueMap]);

  // Get contact info for a show (live lookup from Directory)
  const getContactInfo = useCallback((show) => {
    if (!show) return null;
    const contact = contactMap.get(show.contactId);
    if (contact) {
      return {
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        contactRole: contact.role
      };
    }
    // Fallback to show data if contact not found (backwards compatibility)
    return {
      contactName: show.contactName || 'Unknown Contact',
      contactPhone: show.contactPhone || '',
      contactEmail: show.contactEmail || ''
    };
  }, [contactMap]);

  const handleSelectShow = (show) => {
    setSelectedShow(show);
  };

  // Navigate to Directory and highlight a specific venue or contact
  const handleNavigateToDirectory = (type, id) => {
    setHighlightedDirectoryItem({ type, id });
    setActiveTab('directory');
  };

  const handleAddNew = () => {
    setEditingShow(null);
    setShowForm(true);
  };

  const handleEdit = (show) => {
    setEditingShow(show);
    setShowForm(true);
  };

  const handleSave = (show) => {
    if (editingShow) {
      updateShow(show);
      // Update selected show if it was being edited
      if (selectedShow?.id === show.id) {
        setSelectedShow({ ...show, profit: show.performanceFee + show.merchandiseSales - show.materialsUsed - show.expenses });
      }
    } else {
      addShow(show);
    }
    setShowForm(false);
    setEditingShow(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingShow(null);
  };

  const handleDeleteClick = (show) => {
    setShowDeleteConfirm(show);
  };

  const handleConfirmDelete = () => {
    if (showDeleteConfirm) {
      deleteShow(showDeleteConfirm.id);
      // Clear selection if deleted show was selected
      if (selectedShow?.id === showDeleteConfirm.id) {
        setSelectedShow(null);
      }
      setShowDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  if (!isLoaded || !revenueLoaded || !directoryLoaded || !employeesLoaded) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Timberworks Tour Manager</h1>
          <p className="subtitle">Track venues, shows, and revenue for your touring lumberjack shows</p>
        </div>
        <GlobalSearch
          shows={shows}
          venues={venues}
          contacts={contacts}
          employees={employees}
          onSelectShow={handleSelectShow}
          onNavigateToVenue={(venueId) => handleNavigateToDirectory('venue', venueId)}
          onNavigateToContact={(contactId) => handleNavigateToDirectory('contact', contactId)}
          onNavigateToEmployee={() => setActiveTab('employees')}
          onNavigateToTab={setActiveTab}
        />
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="app-main">
        {/* Action bar */}
        <div className="action-bar">
          <button className="btn-add-show" onClick={handleAddNew}>
            + Add New Show
          </button>
        </div>

        {/* Selected show details panel */}
        {selectedShow && (() => {
          const venueInfo = getVenueInfo(selectedShow);
          const contactInfo = getContactInfo(selectedShow);
          return (
            <div className="selected-show-panel">
              <div className="panel-header">
                <h2>{venueInfo.venueName}</h2>
                <div className="panel-actions">
                  <button
                    className="btn-panel-edit"
                    onClick={() => handleEdit(selectedShow)}
                  >
                    Edit
                  </button>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedShow(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="panel-content">
                <div className="detail-section">
                  <h3>Tour</h3>
                  <p className={`tour-badge ${selectedShow.tour === 'Red Team' ? 'tour-red' : 'tour-blue'}`}>
                    {selectedShow.tour}
                  </p>
                </div>
                <div
                  className="detail-section clickable-section"
                  onClick={() => selectedShow.venueId && handleNavigateToDirectory('venue', selectedShow.venueId)}
                  title="Click to view venue in Directory"
                >
                  <h3>Location <span className="link-hint">View in Directory →</span></h3>
                  <p>{venueInfo.address}</p>
                  <p>{venueInfo.city}, {venueInfo.state} {venueInfo.zip}</p>
                  {venueInfo.venueType && (
                    <p><strong>Venue Type:</strong> {venueInfo.venueType}</p>
                  )}
                  {venueInfo.capacity && (
                    <p><strong>Capacity:</strong> {venueInfo.capacity.toLocaleString()}</p>
                  )}
                </div>
                <div className="detail-section">
                  <h3>Show Details</h3>
                  <p><strong>Dates:</strong> {formatDateRange(selectedShow.startDate, selectedShow.endDate)}</p>
                  {selectedShow.showTime && <p><strong>Time:</strong> {selectedShow.showTime}</p>}
                  <p><strong>Performance Fee:</strong> ${selectedShow.performanceFee.toLocaleString()}</p>
                </div>
                <div className="detail-section">
                  <h3>Financials</h3>
                  <p><strong>Merch Sales:</strong> ${selectedShow.merchandiseSales.toLocaleString()}</p>
                  <p><strong>Materials:</strong> ${selectedShow.materialsUsed.toLocaleString()}</p>
                  <p><strong>Expenses:</strong> ${selectedShow.expenses.toLocaleString()}</p>
                  <p><strong>Profit:</strong> ${selectedShow.profit.toLocaleString()}</p>
                </div>
                <div
                  className="detail-section clickable-section"
                  onClick={() => selectedShow.contactId && handleNavigateToDirectory('contact', selectedShow.contactId)}
                  title="Click to view contact in Directory"
                >
                  <h3>Contact <span className="link-hint">View in Directory →</span></h3>
                  <p><strong>{contactInfo.contactName}</strong></p>
                  {contactInfo.contactRole && (
                    <p className="contact-role-display">{contactInfo.contactRole}</p>
                  )}
                  <p>{contactInfo.contactPhone}</p>
                  <p>{contactInfo.contactEmail}</p>
                </div>
                {selectedShow.notes && (
                  <div className="detail-section">
                    <h3>Notes</h3>
                    <p>{selectedShow.notes}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard
            shows={shows}
            contacts={contacts}
            venues={venues}
            employees={employees}
            onNavigateToRevenue={() => setActiveTab('revenue')}
            onNavigateToContact={(contactId) => handleNavigateToDirectory('contact', contactId)}
          />
        )}

        {/* Shows Tab */}
        {activeTab === 'shows' && (
          <section className="shows-section">
            <div className="shows-view-toggle">
              <button
                className={`view-toggle-btn ${showsView === 'venue' ? 'active' : ''}`}
                onClick={() => setShowsView('venue')}
              >
                By Venue
              </button>
              <button
                className={`view-toggle-btn ${showsView === 'table' ? 'active' : ''}`}
                onClick={() => setShowsView('table')}
              >
                Table View
              </button>
            </div>

            {showsView === 'table' ? (
              <DataTable
                shows={shows}
                onSelectShow={handleSelectShow}
                selectedShowId={selectedShow?.id}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                venues={venues}
                contacts={contacts}
              />
            ) : (
              <ShowsByVenue
                shows={shows}
                venues={venues}
                contacts={contacts}
                onSelectShow={handleSelectShow}
                selectedShowId={selectedShow?.id}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            )}
          </section>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <Calendar
            shows={shows}
            venues={venues}
            contacts={contacts}
            onSelectShow={handleSelectShow}
            onAddShow={handleAddNew}
            selectedShowId={selectedShow?.id}
            onNavigateToVenue={(venueId) => handleNavigateToDirectory('venue', venueId)}
            onNavigateToContact={(contactId) => handleNavigateToDirectory('contact', contactId)}
          />
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <EmployeeList
            employees={employees}
            employeeDaysWorked={employeeDaysWorked}
            certificationAlerts={certificationAlerts}
            metrics={employeeMetrics}
            onAdd={addEmployee}
            onUpdate={updateEmployee}
            onDelete={deleteEmployee}
            onToggleEmploymentType={toggleEmploymentType}
            onImport={importEmployees}
          />
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <Insights
            shows={shows}
            venues={venues}
          />
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <Reports
            shows={shows}
            venues={venues}
            contacts={contacts}
            transactions={transactions}
            employees={employees}
          />
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <Revenue
            shows={shows}
            transactions={transactions}
            inventory={inventory}
            payments={payments}
            metrics={revenueMetrics}
            onAddTransaction={addTransaction}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
            onAddInventoryItem={addInventoryItem}
            onUpdateInventoryItem={updateInventoryItem}
            onDeleteInventoryItem={deleteInventoryItem}
            onAdjustStock={adjustStock}
            onAddPayment={addPayment}
            onUpdatePayment={updatePayment}
            onDeletePayment={deletePayment}
            onMarkPaymentPaid={markPaymentPaid}
            getShowRevenueBreakdown={getShowRevenueBreakdown}
            getShowPayment={getShowPayment}
            etsy={etsy}
          />
        )}

        {/* Directory Tab */}
        {activeTab === 'directory' && (
          <Directory
            venues={venues}
            contacts={contacts}
            shows={shows}
            metrics={directoryMetrics}
            onAddVenue={addVenue}
            onUpdateVenue={updateVenue}
            onDeleteVenue={deleteVenue}
            onAddContact={addContact}
            onUpdateContact={updateContact}
            onDeleteContact={deleteContact}
            getVenueContacts={getVenueContacts}
            getContactVenue={getContactVenue}
            getEntityActivities={getEntityActivities}
            onAddActivity={addActivity}
            onDeleteActivity={deleteActivity}
            highlightedItem={highlightedDirectoryItem}
            onClearHighlight={() => setHighlightedDirectoryItem(null)}
          />
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <section className="map-section">
            <div className="map-header">
              <h2>Tour Routes</h2>
              <div className="map-controls">
                <div className="map-legend">
                  <span className="legend-item">
                    <span className="legend-line solid red"></span> Next Month (Red)
                  </span>
                  <span className="legend-item">
                    <span className="legend-line solid blue"></span> Next Month (Blue)
                  </span>
                  <span className="legend-item">
                    <span className="legend-line dotted red"></span> Following Month (Red)
                  </span>
                  <span className="legend-item">
                    <span className="legend-line dotted blue"></span> Following Month (Blue)
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot green"></span> Future Confirmed
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot gray small"></span> Past Shows
                  </span>
                  <span className="legend-item">
                    <span className="legend-star">★</span> Homebase
                  </span>
                </div>
                <div className="route-toggle">
                  <input
                    type="checkbox"
                    id="routeToggle"
                    checked={showRouteLines}
                    onChange={(e) => setShowRouteLines(e.target.checked)}
                  />
                  <label htmlFor="routeToggle">Show route lines</label>
                </div>
              </div>
            </div>
            <TourMap
              shows={shows}
              selectedShowId={selectedShow?.id}
              onSelectShow={handleSelectShow}
              showRouteLines={showRouteLines}
            />
          </section>
        )}

        {/* Import/Export Tab */}
        {activeTab === 'import-export' && (
          <CSVTools
            shows={shows}
            onImport={importShows}
            existingShows={shows}
            // Directory data
            venues={venues}
            contacts={contacts}
            onImportVenues={importVenues}
            onImportContacts={importContacts}
            // Revenue data
            transactions={transactions}
            inventory={inventory}
            onImportTransactions={importTransactions}
            onImportInventory={importInventory}
            // Reset functions
            onReset={resetToSampleData}
            onResetDirectory={resetDirectoryToSampleData}
            onResetRevenue={resetRevenueToSampleData}
            venueCount={venues.length}
            contactCount={contacts.length}
            onOpenGoogleSheets={() => setSheetsSettingsOpen(true)}
            googleSheetsConnected={googleSheets.isConfigured}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Click on a row to view show details. Data auto-saves to your browser.</p>
      </footer>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <ShowForm
          show={editingShow}
          onSave={handleSave}
          onCancel={handleCancelForm}
          venues={venues}
          contacts={contacts}
          onAddVenue={addVenue}
          onAddContact={addContact}
          employees={employees}
          shows={shows}
          getShowAssignments={getShowAssignments}
          onUpdateShowAssignments={updateShowAssignments}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (() => {
        const deleteVenueInfo = getVenueInfo(showDeleteConfirm);
        return (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <h3>Delete Show?</h3>
              <p>
                Are you sure you want to delete the show at{' '}
                <strong>{deleteVenueInfo.venueName}</strong>?
              </p>
              <p className="confirm-warning">This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="btn-cancel" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button className="btn-delete-confirm" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Google Sheets Settings Modal */}
      <GoogleSheetsSettings
        isOpen={sheetsSettingsOpen}
        onClose={() => setSheetsSettingsOpen(false)}
        config={googleSheets.config}
        setConfig={googleSheets.setConfig}
        syncing={googleSheets.syncing}
        lastSync={googleSheets.lastSync}
        error={googleSheets.error}
        onFetchShows={googleSheets.fetchShows}
        onPushAllShows={googleSheets.pushAllShows}
        testConnection={googleSheets.testConnection}
        shows={shows}
      />

      {/* Design Editor (right-click with Ctrl/Cmd to open) */}
      <DesignEditor
        isOpen={designEditorOpen}
        onClose={() => setDesignEditorOpen(false)}
        position={designEditorPosition}
      />
    </div>
  );
}

export default App;
