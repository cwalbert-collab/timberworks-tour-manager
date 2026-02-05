import { useState } from 'react';
import { formatDateRange } from '../../data/sampleData';
import './TransactionForm.css';

const TRANSACTION_TYPES = [
  { value: 'show_fee', label: 'Show Fee' },
  { value: 'merch_sale', label: 'Merch Sale' },
  { value: 'expense', label: 'Expense' },
  { value: 'refund', label: 'Refund' }
];

const CATEGORIES = {
  show_fee: [
    { value: 'performance_fee', label: 'Performance Fee' }
  ],
  merch_sale: [
    { value: 'merchandise', label: 'Merchandise' }
  ],
  expense: [
    { value: 'materials', label: 'Materials' },
    { value: 'travel', label: 'Travel' },
    { value: 'other', label: 'Other' }
  ],
  refund: [
    { value: 'merchandise', label: 'Merchandise Refund' },
    { value: 'other', label: 'Other' }
  ]
};

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'check', label: 'Check' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'online', label: 'Online' }
];

export default function TransactionForm({ transaction, shows, onSave, onCancel }) {
  const isEditing = !!transaction;
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    type: transaction?.type || 'show_fee',
    showId: transaction?.showId || '',
    date: transaction?.date || today,
    description: transaction?.description || '',
    amount: transaction?.amount ? Math.abs(transaction.amount) : '',
    category: transaction?.category || 'performance_fee',
    paymentMethod: transaction?.paymentMethod || 'check',
    notes: transaction?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Update category when type changes
      if (field === 'type') {
        const categories = CATEGORIES[value];
        updated.category = categories?.[0]?.value || '';
      }

      return updated;
    });
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Determine amount sign based on type
    let amount = parseFloat(formData.amount);
    if (formData.type === 'expense' || formData.type === 'refund') {
      amount = -Math.abs(amount);
    }

    const txn = {
      ...transaction,
      id: transaction?.id || `txn-${Date.now()}`,
      type: formData.type,
      showId: formData.showId || null,
      date: formData.date,
      description: formData.description.trim(),
      amount,
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim(),
      createdAt: transaction?.createdAt || new Date().toISOString()
    };

    onSave(txn);
  };

  const availableCategories = CATEGORIES[formData.type] || [];

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {TRANSACTION_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {availableCategories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="showId">
              Show {formData.type === 'merch_sale' ? '(leave blank for website sales)' : ''}
            </label>
            <select
              id="showId"
              value={formData.showId}
              onChange={(e) => handleChange('showId', e.target.value)}
            >
              <option value="">
                {formData.type === 'merch_sale' ? 'Website / No Show' : 'Select a show...'}
              </option>
              {shows.map(show => (
                <option key={show.id} value={show.id}>
                  {show.venueName} - {formatDateRange(show.startDate, show.endDate)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount ($) *</label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.amount ? 'error' : ''}
              />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
              {(formData.type === 'expense' || formData.type === 'refund') && (
                <span className="helper-text">Will be recorded as negative</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="e.g., Performance fee, T-shirt sales..."
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
            >
              {PAYMENT_METHODS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional notes..."
              rows="2"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
