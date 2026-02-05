import { useState, useMemo } from 'react';
import { formatDateRange } from '../../data/sampleData';
import { exportShowRevenue } from '../../utils/exportUtils';
import './ShowRevenueList.css';

const STATUS_LABELS = {
  pending: 'Pending',
  invoiced: 'Invoiced',
  partial: 'Partial',
  paid: 'Paid',
  overdue: 'Overdue'
};

export default function ShowRevenueList({ shows, payments, getShowRevenueBreakdown, getShowPayment, venues = [] }) {
  const [filterText, setFilterText] = useState('');
  const [filterTour, setFilterTour] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });

  // Calculate revenue data for each show
  const showRevenueData = useMemo(() => {
    return shows.map(show => {
      const breakdown = getShowRevenueBreakdown(show.id);
      const payment = getShowPayment(show.id);

      return {
        ...show,
        breakdown,
        payment,
        totalRevenue: breakdown.performanceFee + breakdown.merchandise,
        netRevenue: breakdown.total
      };
    });
  }, [shows, getShowRevenueBreakdown, getShowPayment]);

  // Filter shows
  const filteredShows = useMemo(() => {
    return showRevenueData.filter(show => {
      // Tour filter
      if (filterTour !== 'all' && show.tour !== filterTour) return false;

      // Text filter
      if (filterText.trim()) {
        const search = filterText.toLowerCase();
        return (
          show.venueName.toLowerCase().includes(search) ||
          show.city.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [showRevenueData, filterTour, filterText]);

  // Sort shows
  const sortedShows = useMemo(() => {
    const sorted = [...filteredShows];
    sorted.sort((a, b) => {
      let aVal, bVal;

      switch (sortConfig.key) {
        case 'startDate':
        case 'venueName':
        case 'tour':
          aVal = a[sortConfig.key] || '';
          bVal = b[sortConfig.key] || '';
          break;
        case 'performanceFee':
          aVal = a.breakdown?.performanceFee || 0;
          bVal = b.breakdown?.performanceFee || 0;
          break;
        case 'merchandise':
          aVal = a.breakdown?.merchandise || 0;
          bVal = b.breakdown?.merchandise || 0;
          break;
        case 'expenses':
          aVal = a.breakdown?.expenses || 0;
          bVal = b.breakdown?.expenses || 0;
          break;
        case 'netRevenue':
        case 'totalRevenue':
          aVal = a[sortConfig.key] || 0;
          bVal = b[sortConfig.key] || 0;
          break;
        case 'paymentStatus':
          const statusOrder = { overdue: 0, pending: 1, invoiced: 2, partial: 3, paid: 4 };
          aVal = statusOrder[getPaymentStatus(a.payment)] ?? 5;
          bVal = statusOrder[getPaymentStatus(b.payment)] ?? 5;
          break;
        default:
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredShows, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPaymentStatus = (payment) => {
    if (!payment) return 'pending';
    // Check if overdue
    if (payment.status !== 'paid' && payment.dueDate) {
      if (new Date(payment.dueDate) < new Date()) {
        return 'overdue';
      }
    }
    return payment.status;
  };

  // Calculate totals
  const totals = useMemo(() => {
    return sortedShows.reduce((acc, show) => ({
      performanceFees: acc.performanceFees + show.breakdown.performanceFee,
      merchandise: acc.merchandise + show.breakdown.merchandise,
      expenses: acc.expenses + show.breakdown.expenses,
      total: acc.total + show.netRevenue
    }), { performanceFees: 0, merchandise: 0, expenses: 0, total: 0 });
  }, [sortedShows]);

  return (
    <div className="show-revenue-list">
      {/* Header with filters */}
      <div className="list-header">
        <div className="list-filters">
          <select
            value={filterTour}
            onChange={(e) => setFilterTour(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Teams</option>
            <option value="Red Team">Red Team</option>
            <option value="Blue Team">Blue Team</option>
          </select>
          <input
            type="text"
            placeholder="Search shows..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* Revenue table */}
      <div className="table-container">
        <table className="revenue-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('startDate')} className="sortable">
                Date{getSortIndicator('startDate')}
              </th>
              <th onClick={() => handleSort('venueName')} className="sortable">
                Venue{getSortIndicator('venueName')}
              </th>
              <th onClick={() => handleSort('tour')} className="sortable">
                Team{getSortIndicator('tour')}
              </th>
              <th onClick={() => handleSort('performanceFee')} className="sortable amount-col">
                Performance Fee{getSortIndicator('performanceFee')}
              </th>
              <th onClick={() => handleSort('merchandise')} className="sortable amount-col">
                Merch Sales{getSortIndicator('merchandise')}
              </th>
              <th onClick={() => handleSort('expenses')} className="sortable amount-col">
                Expenses{getSortIndicator('expenses')}
              </th>
              <th onClick={() => handleSort('netRevenue')} className="sortable amount-col">
                Net{getSortIndicator('netRevenue')}
              </th>
              <th onClick={() => handleSort('paymentStatus')} className="sortable">
                Payment Status{getSortIndicator('paymentStatus')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedShows.map(show => {
              const status = getPaymentStatus(show.payment);
              return (
                <tr key={show.id}>
                  <td>{formatDateRange(show.startDate, show.endDate)}</td>
                  <td className="venue-cell">
                    <span className="venue-name">{show.venueName}</span>
                    <span className="venue-location">{show.city}, {show.state}</span>
                  </td>
                  <td>
                    <span className={`tour-badge ${show.tour === 'Red Team' ? 'red' : 'blue'}`}>
                      {show.tour}
                    </span>
                  </td>
                  <td className="amount-cell">
                    {formatCurrency(show.breakdown.performanceFee)}
                  </td>
                  <td className="amount-cell">
                    {formatCurrency(show.breakdown.merchandise)}
                  </td>
                  <td className="amount-cell expense">
                    {show.breakdown.expenses > 0 ? `-${formatCurrency(show.breakdown.expenses)}` : '-'}
                  </td>
                  <td className={`amount-cell net ${show.netRevenue >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(show.netRevenue)}
                  </td>
                  <td>
                    <span className={`status-badge ${status}`}>
                      {STATUS_LABELS[status]}
                    </span>
                    {show.payment && show.payment.status === 'partial' && (
                      <span className="partial-amount">
                        {formatCurrency(show.payment.receivedAmount)} / {formatCurrency(show.payment.expectedAmount)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {sortedShows.length === 0 && (
              <tr>
                <td colSpan="8" className="no-results">
                  No shows found
                </td>
              </tr>
            )}
          </tbody>
          {sortedShows.length > 0 && (
            <tfoot>
              <tr className="totals-row">
                <td colSpan="3"><strong>Totals ({sortedShows.length} shows)</strong></td>
                <td className="amount-cell"><strong>{formatCurrency(totals.performanceFees)}</strong></td>
                <td className="amount-cell"><strong>{formatCurrency(totals.merchandise)}</strong></td>
                <td className="amount-cell expense"><strong>{totals.expenses > 0 ? `-${formatCurrency(totals.expenses)}` : '-'}</strong></td>
                <td className="amount-cell net positive"><strong>{formatCurrency(totals.total)}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Export Button */}
      <div className="export-section">
        <button
          className="btn-export"
          onClick={() => exportShowRevenue(shows, getShowRevenueBreakdown, getShowPayment, venues)}
        >
          Download Revenue Data (CSV)
        </button>
      </div>
    </div>
  );
}
