import { useState, useMemo } from 'react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import ShowSummaryPDF from './ShowSummaryPDF';
import FinancialReportPDF from './FinancialReportPDF';
import RouteSheetPDF from './RouteSheetPDF';
import './Reports.css';

const REPORT_TYPES = [
  {
    id: 'invoice',
    label: 'Invoice',
    icon: '📄',
    description: 'Generate a professional invoice for a venue',
    requiresShow: true
  },
  {
    id: 'show-summary',
    label: 'Show Summary',
    icon: '📋',
    description: 'Detailed report for a single show',
    requiresShow: true
  },
  {
    id: 'financial',
    label: 'Financial Report',
    icon: '💰',
    description: 'Revenue and expense summary for a date range',
    requiresDateRange: true
  },
  {
    id: 'route',
    label: 'Route Sheet',
    icon: '🗺️',
    description: 'Printable tour route with addresses and contacts',
    requiresDateRange: true
  }
];

export default function Reports({ shows, venues, contacts, transactions, employees }) {
  const [selectedReport, setSelectedReport] = useState('invoice');
  const [selectedShowId, setSelectedShowId] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [tourFilter, setTourFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportConfig = REPORT_TYPES.find(r => r.id === selectedReport);

  // Get selected show with venue/contact info
  const selectedShow = useMemo(() => {
    if (!selectedShowId) return null;
    return shows.find(s => s.id === selectedShowId);
  }, [shows, selectedShowId]);

  const selectedVenue = useMemo(() => {
    if (!selectedShow?.venueId) return null;
    return venues.find(v => v.id === selectedShow.venueId);
  }, [selectedShow, venues]);

  const selectedContact = useMemo(() => {
    if (!selectedShow?.contactId) return null;
    return contacts.find(c => c.id === selectedShow.contactId);
  }, [selectedShow, contacts]);

  // Filter shows for route/financial reports
  const filteredShows = useMemo(() => {
    return shows.filter(show => {
      const showDate = new Date(show.startDate);
      const inRange = showDate >= new Date(dateRange.start) && showDate <= new Date(dateRange.end);
      const matchesTour = tourFilter === 'all' || show.tour === tourFilter;
      return inRange && matchesTour;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [shows, dateRange, tourFilter]);

  // Sort shows by date for selection dropdown
  const sortedShows = useMemo(() => {
    return [...shows].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [shows]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    try {
      let doc;
      let filename;

      switch (selectedReport) {
        case 'invoice':
          if (!selectedShow) {
            alert('Please select a show');
            return;
          }
          doc = (
            <InvoicePDF
              show={selectedShow}
              venue={selectedVenue}
              contact={selectedContact}
            />
          );
          filename = `Invoice-${selectedVenue?.name || 'Show'}-${selectedShow.startDate}.pdf`;
          break;

        case 'show-summary':
          if (!selectedShow) {
            alert('Please select a show');
            return;
          }
          doc = (
            <ShowSummaryPDF
              show={selectedShow}
              venue={selectedVenue}
              contact={selectedContact}
              employees={employees}
              transactions={transactions}
            />
          );
          filename = `ShowSummary-${selectedVenue?.name || 'Show'}-${selectedShow.startDate}.pdf`;
          break;

        case 'financial':
          doc = (
            <FinancialReportPDF
              shows={filteredShows}
              transactions={transactions}
              dateRange={dateRange}
              reportTitle={`Financial Report - ${tourFilter === 'all' ? 'All Teams' : tourFilter}`}
            />
          );
          filename = `FinancialReport-${dateRange.start}-to-${dateRange.end}.pdf`;
          break;

        case 'route':
          doc = (
            <RouteSheetPDF
              shows={filteredShows}
              venues={venues}
              contacts={contacts}
              tourName={`${tourFilter === 'all' ? 'Combined' : tourFilter} Tour`}
              dateRange={dateRange}
            />
          );
          filename = `RouteSheet-${dateRange.start}-to-${dateRange.end}.pdf`;
          break;

        default:
          return;
      }

      // Generate PDF blob
      const blob = await pdf(doc).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = () => {
    if (reportConfig?.requiresShow && !selectedShowId) return false;
    if (reportConfig?.requiresDateRange && filteredShows.length === 0) return false;
    return true;
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports</h2>
        <p className="reports-subtitle">
          Generate professional PDF reports for invoices, summaries, and planning
        </p>
      </div>

      <div className="reports-content">
        {/* Report Type Selection */}
        <div className="report-type-section">
          <h3>Select Report Type</h3>
          <div className="report-type-grid">
            {REPORT_TYPES.map(report => (
              <button
                key={report.id}
                className={`report-type-card ${selectedReport === report.id ? 'active' : ''}`}
                onClick={() => setSelectedReport(report.id)}
              >
                <span className="report-icon">{report.icon}</span>
                <span className="report-label">{report.label}</span>
                <span className="report-description">{report.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Options */}
        <div className="report-options-section">
          <h3>Report Options</h3>

          {/* Show Selection (for invoice and show-summary) */}
          {reportConfig?.requiresShow && (
            <div className="option-group">
              <label>Select Show</label>
              <select
                value={selectedShowId}
                onChange={(e) => setSelectedShowId(e.target.value)}
                className="show-select"
              >
                <option value="">Choose a show...</option>
                {sortedShows.map(show => {
                  const venue = venues.find(v => v.id === show.venueId);
                  return (
                    <option key={show.id} value={show.id}>
                      {show.startDate} - {venue?.name || show.venueName || 'Unknown'} ({show.tour})
                    </option>
                  );
                })}
              </select>

              {selectedShow && selectedVenue && (
                <div className="selected-show-preview">
                  <div className="preview-header">
                    <span className={`tour-badge ${selectedShow.tour === 'Red Team' ? 'red' : 'blue'}`}>
                      {selectedShow.tour}
                    </span>
                    <strong>{selectedVenue.name}</strong>
                  </div>
                  <p>{selectedVenue.city}, {selectedVenue.state}</p>
                  <p>Date: {selectedShow.startDate}{selectedShow.endDate !== selectedShow.startDate ? ` - ${selectedShow.endDate}` : ''}</p>
                  <p>Fee: ${selectedShow.performanceFee?.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {/* Date Range (for financial and route) */}
          {reportConfig?.requiresDateRange && (
            <>
              <div className="option-group">
                <label>Date Range</label>
                <div className="date-range-inputs">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>

                {/* Quick date range buttons */}
                <div className="quick-ranges">
                  <button onClick={() => {
                    const now = new Date();
                    const start = new Date(now.getFullYear(), now.getMonth(), 1);
                    setDateRange({
                      start: start.toISOString().split('T')[0],
                      end: now.toISOString().split('T')[0]
                    });
                  }}>This Month</button>
                  <button onClick={() => {
                    const now = new Date();
                    const quarter = Math.floor(now.getMonth() / 3);
                    const start = new Date(now.getFullYear(), quarter * 3, 1);
                    setDateRange({
                      start: start.toISOString().split('T')[0],
                      end: now.toISOString().split('T')[0]
                    });
                  }}>This Quarter</button>
                  <button onClick={() => {
                    const now = new Date();
                    setDateRange({
                      start: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
                      end: now.toISOString().split('T')[0]
                    });
                  }}>This Year</button>
                  <button onClick={() => {
                    const now = new Date();
                    setDateRange({
                      start: new Date(now.getFullYear() - 1, 0, 1).toISOString().split('T')[0],
                      end: new Date(now.getFullYear() - 1, 11, 31).toISOString().split('T')[0]
                    });
                  }}>Last Year</button>
                </div>
              </div>

              <div className="option-group">
                <label>Filter by Team</label>
                <div className="tour-filter-buttons">
                  <button
                    className={tourFilter === 'all' ? 'active' : ''}
                    onClick={() => setTourFilter('all')}
                  >All Teams</button>
                  <button
                    className={`${tourFilter === 'Red Team' ? 'active' : ''} red`}
                    onClick={() => setTourFilter('Red Team')}
                  >Red Team</button>
                  <button
                    className={`${tourFilter === 'Blue Team' ? 'active' : ''} blue`}
                    onClick={() => setTourFilter('Blue Team')}
                  >Blue Team</button>
                </div>
              </div>

              {/* Preview of selected shows */}
              <div className="shows-preview">
                <label>{filteredShows.length} shows selected</label>
                {filteredShows.length > 0 && (
                  <div className="shows-preview-list">
                    {filteredShows.slice(0, 5).map(show => {
                      const venue = venues.find(v => v.id === show.venueId);
                      return (
                        <div key={show.id} className="preview-item">
                          <span className={`dot ${show.tour === 'Red Team' ? 'red' : 'blue'}`}></span>
                          <span>{show.startDate}</span>
                          <span>{venue?.name || show.venueName}</span>
                        </div>
                      );
                    })}
                    {filteredShows.length > 5 && (
                      <div className="preview-more">
                        + {filteredShows.length - 5} more shows
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Generate Button */}
        <div className="generate-section">
          <button
            className="btn-generate"
            onClick={handleGeneratePDF}
            disabled={!canGenerate() || isGenerating}
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <span className="btn-icon">📥</span>
                Download {reportConfig?.label} PDF
              </>
            )}
          </button>

          {!canGenerate() && (
            <p className="generate-hint">
              {reportConfig?.requiresShow && !selectedShowId && 'Please select a show above'}
              {reportConfig?.requiresDateRange && filteredShows.length === 0 && 'No shows found in selected date range'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
