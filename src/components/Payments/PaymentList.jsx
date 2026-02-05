import { useState, useMemo } from 'react';
import PaymentForm from './PaymentForm';
import { formatDateRange } from '../../data/sampleData';
import { exportPayments } from '../../utils/exportUtils';
import './PaymentList.css';

const STATUS_LABELS = {
  pending: 'Pending',
  invoiced: 'Invoiced',
  partial: 'Partial',
  paid: 'Paid',
  overdue: 'Overdue'
};

const STATUS_FILTERS = [
  { value: 'all', label: 'All Payments' },
  { value: 'pending', label: 'Pending' },
  { value: 'invoiced', label: 'Invoiced' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' }
];

export default function PaymentList({ payments, shows, onAdd, onUpdate, onDelete, onMarkPaid }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [markPaidModal, setMarkPaidModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Create show lookup map
  const showMap = useMemo(() => {
    return new Map(shows.map(s => [s.id, s]));
  }, [shows]);

  // Determine actual status (check for overdue)
  const getActualStatus = (payment) => {
    if (payment.status === 'paid') return 'paid';
    if (payment.dueDate && new Date(payment.dueDate) < new Date()) {
      return 'overdue';
    }
    return payment.status;
  };

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      if (filterStatus === 'all') return true;
      const actualStatus = getActualStatus(payment);
      return actualStatus === filterStatus;
    });
  }, [payments, filterStatus]);

  // Sort payments
  const sortedPayments = useMemo(() => {
    const sorted = [...filteredPayments];
    sorted.sort((a, b) => {
      let aVal, bVal;

      switch (sortConfig.key) {
        case 'showName':
          const aShow = showMap.get(a.showId);
          const bShow = showMap.get(b.showId);
          aVal = (aShow?.venueName || '').toLowerCase();
          bVal = (bShow?.venueName || '').toLowerCase();
          break;
        case 'dueDate':
        case 'paidDate':
          aVal = a[sortConfig.key] || '9999-12-31';
          bVal = b[sortConfig.key] || '9999-12-31';
          break;
        case 'expectedAmount':
        case 'receivedAmount':
          aVal = a[sortConfig.key] || 0;
          bVal = b[sortConfig.key] || 0;
          break;
        case 'balance':
          aVal = (a.expectedAmount || 0) - (a.receivedAmount || 0);
          bVal = (b.expectedAmount || 0) - (b.receivedAmount || 0);
          break;
        case 'invoiceNumber':
          aVal = (a.invoiceNumber || '').toLowerCase();
          bVal = (b.invoiceNumber || '').toLowerCase();
          break;
        case 'status':
          const statusOrder = { overdue: 0, pending: 1, invoiced: 2, partial: 3, paid: 4 };
          aVal = statusOrder[getActualStatus(a)] ?? 5;
          bVal = statusOrder[getActualStatus(b)] ?? 5;
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
  }, [filteredPayments, sortConfig, showMap]);

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

  const handleAddNew = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleSave = (payment) => {
    if (editingPayment) {
      onUpdate(payment);
    } else {
      onAdd(payment);
    }
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleMarkPaidClick = (payment) => {
    setMarkPaidModal(payment);
  };

  const handleConfirmMarkPaid = (amount) => {
    if (markPaidModal) {
      onMarkPaid(markPaidModal.id, amount, new Date().toISOString().split('T')[0]);
      setMarkPaidModal(null);
    }
  };

  const handleDeleteClick = (payment) => {
    setDeleteConfirm(payment);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.expectedAmount, 0);
    const received = payments.reduce((sum, p) => sum + p.receivedAmount, 0);
    const outstanding = total - received;
    const overdueCount = payments.filter(p => getActualStatus(p) === 'overdue').length;
    return { total, received, outstanding, overdueCount };
  }, [payments]);

  return (
    <div className="payment-list">
      {/* Summary stats */}
      <div className="payment-stats">
        <div className="payment-stat">
          <span className="stat-label">Total Expected</span>
          <span className="stat-value">{formatCurrency(stats.total)}</span>
        </div>
        <div className="payment-stat">
          <span className="stat-label">Received</span>
          <span className="stat-value positive">{formatCurrency(stats.received)}</span>
        </div>
        <div className="payment-stat">
          <span className="stat-label">Outstanding</span>
          <span className="stat-value warning">{formatCurrency(stats.outstanding)}</span>
        </div>
        {stats.overdueCount > 0 && (
          <div className="payment-stat alert">
            <span className="stat-label">Overdue</span>
            <span className="stat-value">{stats.overdueCount}</span>
          </div>
        )}
      </div>

      {/* Header with filters */}
      <div className="list-header">
        <div className="list-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            {STATUS_FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <button className="btn-add" onClick={handleAddNew}>
          + Add Payment
        </button>
      </div>

      {/* Payments table */}
      <div className="table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('showName')} className="sortable">
                Show{getSortIndicator('showName')}
              </th>
              <th onClick={() => handleSort('dueDate')} className="sortable">
                Due Date{getSortIndicator('dueDate')}
              </th>
              <th onClick={() => handleSort('expectedAmount')} className="sortable amount-col">
                Expected{getSortIndicator('expectedAmount')}
              </th>
              <th onClick={() => handleSort('receivedAmount')} className="sortable amount-col">
                Received{getSortIndicator('receivedAmount')}
              </th>
              <th onClick={() => handleSort('balance')} className="sortable amount-col">
                Balance{getSortIndicator('balance')}
              </th>
              <th onClick={() => handleSort('invoiceNumber')} className="sortable">
                Invoice #{getSortIndicator('invoiceNumber')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status{getSortIndicator('status')}
              </th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.map(payment => {
              const show = showMap.get(payment.showId);
              const status = getActualStatus(payment);
              const balance = payment.expectedAmount - payment.receivedAmount;

              return (
                <tr key={payment.id} className={status === 'overdue' ? 'overdue-row' : ''}>
                  <td className="show-cell">
                    <span className="show-name">{show?.venueName || 'Unknown'}</span>
                    {show && (
                      <span className="show-date">{formatDateRange(show.startDate, show.endDate)}</span>
                    )}
                  </td>
                  <td className={status === 'overdue' ? 'overdue-date' : ''}>
                    {formatDate(payment.dueDate)}
                  </td>
                  <td className="amount-cell">{formatCurrency(payment.expectedAmount)}</td>
                  <td className="amount-cell positive">{formatCurrency(payment.receivedAmount)}</td>
                  <td className={`amount-cell ${balance > 0 ? 'warning' : 'positive'}`}>
                    {formatCurrency(balance)}
                  </td>
                  <td className="invoice-cell">{payment.invoiceNumber || '-'}</td>
                  <td>
                    <span className={`status-badge ${status}`}>
                      {STATUS_LABELS[status]}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {status !== 'paid' && (
                      <button
                        className="btn-action btn-paid"
                        onClick={() => handleMarkPaidClick(payment)}
                      >
                        Mark Paid
                      </button>
                    )}
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(payment)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteClick(payment)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {sortedPayments.length === 0 && (
              <tr>
                <td colSpan="8" className="no-results">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Form Modal */}
      {showForm && (
        <PaymentForm
          payment={editingPayment}
          shows={shows}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
        />
      )}

      {/* Mark Paid Modal */}
      {markPaidModal && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Mark Payment as Paid</h3>
            <p>
              Recording payment for <strong>{showMap.get(markPaidModal.showId)?.venueName || 'Unknown'}</strong>
            </p>
            <p>
              Expected: {formatCurrency(markPaidModal.expectedAmount)}<br />
              Already received: {formatCurrency(markPaidModal.receivedAmount)}<br />
              <strong>Balance: {formatCurrency(markPaidModal.expectedAmount - markPaidModal.receivedAmount)}</strong>
            </p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setMarkPaidModal(null)}>
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={() => handleConfirmMarkPaid(markPaidModal.expectedAmount - markPaidModal.receivedAmount)}
              >
                Mark Full Amount Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Delete Payment?</h3>
            <p>
              Are you sure you want to delete this payment record?
            </p>
            <p className="confirm-warning">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="export-section">
        <button
          className="btn-export"
          onClick={() => exportPayments(payments, shows)}
        >
          Download Payments Data (CSV)
        </button>
      </div>
    </div>
  );
}
