import { useState, useMemo } from 'react';
import TransactionForm from './TransactionForm';
import { exportTransactions } from '../../utils/exportUtils';
import './TransactionList.css';

const TYPE_LABELS = {
  show_fee: 'Show Fee',
  merch_sale: 'Merch Sale',
  expense: 'Expense',
  refund: 'Refund'
};

const TYPE_FILTERS = [
  { value: 'all', label: 'All Types' },
  { value: 'show_fee', label: 'Show Fees' },
  { value: 'merch_sale', label: 'Merch Sales' },
  { value: 'expense', label: 'Expenses' },
  { value: 'refund', label: 'Refunds' }
];

export default function TransactionList({ transactions, shows, onAdd, onUpdate, onDelete }) {
  const [filterType, setFilterType] = useState('all');
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Create show lookup map
  const showMap = useMemo(() => {
    return new Map(shows.map(s => [s.id, s]));
  }, [shows]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      // Type filter
      if (filterType !== 'all' && txn.type !== filterType) return false;

      // Text filter
      if (filterText.trim()) {
        const search = filterText.toLowerCase();
        const show = showMap.get(txn.showId);
        const showName = show?.venueName || '';
        return (
          txn.description.toLowerCase().includes(search) ||
          showName.toLowerCase().includes(search) ||
          txn.category?.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [transactions, filterType, filterText, showMap]);

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'amount') {
        aVal = Math.abs(aVal);
        bVal = Math.abs(bVal);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredTransactions, sortConfig]);

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
    const prefix = value < 0 ? '-' : '';
    return prefix + new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(Math.abs(value));
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
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (txn) => {
    setEditingTransaction(txn);
    setShowForm(true);
  };

  const handleSave = (txn) => {
    if (editingTransaction) {
      onUpdate(txn);
    } else {
      onAdd(txn);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDeleteClick = (txn) => {
    setDeleteConfirm(txn);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="transaction-list">
      {/* Header with filters and add button */}
      <div className="list-header">
        <div className="list-filters">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            {TYPE_FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="filter-input"
          />
        </div>
        <button className="btn-add" onClick={handleAddNew}>
          + Add Transaction
        </button>
      </div>

      {/* Transactions table */}
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} className="sortable">
                Date{getSortIndicator('date')}
              </th>
              <th onClick={() => handleSort('type')} className="sortable">
                Type{getSortIndicator('type')}
              </th>
              <th>Show/Source</th>
              <th>Description</th>
              <th onClick={() => handleSort('amount')} className="sortable amount-col">
                Amount{getSortIndicator('amount')}
              </th>
              <th>Method</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(txn => {
              const show = showMap.get(txn.showId);
              return (
                <tr key={txn.id} className={txn.amount < 0 ? 'expense-row' : ''}>
                  <td>{formatDate(txn.date)}</td>
                  <td>
                    <span className={`type-badge ${txn.type}`}>
                      {TYPE_LABELS[txn.type] || txn.type}
                    </span>
                  </td>
                  <td>{show?.venueName || (txn.showId ? 'Unknown' : 'Website')}</td>
                  <td className="description-cell">{txn.description}</td>
                  <td className={`amount-cell ${txn.amount < 0 ? 'negative' : 'positive'}`}>
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="method-cell">{txn.paymentMethod}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(txn)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteClick(txn)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {sortedTransactions.length === 0 && (
              <tr>
                <td colSpan="7" className="no-results">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          shows={shows}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Delete Transaction?</h3>
            <p>
              Are you sure you want to delete this transaction?
              <br />
              <strong>{deleteConfirm.description}</strong>
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
          onClick={() => exportTransactions(transactions, shows)}
        >
          Download Transactions Data (CSV)
        </button>
      </div>
    </div>
  );
}
