import { useState } from 'react';
import { formatDateRange } from '../../data/sampleData';
import './PaymentForm.css';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'invoiced', label: 'Invoiced' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' }
];

export default function PaymentForm({ payment, shows, onSave, onCancel }) {
  const isEditing = !!payment;
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    showId: payment?.showId || '',
    expectedAmount: payment?.expectedAmount || '',
    receivedAmount: payment?.receivedAmount || 0,
    status: payment?.status || 'pending',
    dueDate: payment?.dueDate || '',
    paidDate: payment?.paidDate || '',
    invoiceNumber: payment?.invoiceNumber || '',
    notes: payment?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.showId) {
      newErrors.showId = 'Please select a show';
    }

    if (!formData.expectedAmount || parseFloat(formData.expectedAmount) <= 0) {
      newErrors.expectedAmount = 'Expected amount must be greater than 0';
    }

    if (formData.receivedAmount && parseFloat(formData.receivedAmount) < 0) {
      newErrors.receivedAmount = 'Received amount cannot be negative';
    }

    if (formData.status === 'invoiced' && !formData.invoiceNumber) {
      newErrors.invoiceNumber = 'Invoice number required for invoiced status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const paymentData = {
      ...payment,
      id: payment?.id || `pay-${Date.now()}`,
      showId: formData.showId,
      expectedAmount: parseFloat(formData.expectedAmount),
      receivedAmount: parseFloat(formData.receivedAmount) || 0,
      status: formData.status,
      dueDate: formData.dueDate || null,
      paidDate: formData.status === 'paid' ? (formData.paidDate || today) : null,
      invoiceNumber: formData.invoiceNumber || null,
      notes: formData.notes.trim(),
      createdAt: payment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(paymentData);
  };

  // Get show info for pre-fill
  const selectedShow = shows.find(s => s.id === formData.showId);

  const handleShowSelect = (showId) => {
    handleChange('showId', showId);
    // Auto-fill expected amount from show's performance fee if not editing
    if (!isEditing && showId) {
      const show = shows.find(s => s.id === showId);
      if (show && !formData.expectedAmount) {
        handleChange('expectedAmount', show.performanceFee);
      }
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Payment' : 'Add Payment'}</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="showId">Show *</label>
            <select
              id="showId"
              value={formData.showId}
              onChange={(e) => handleShowSelect(e.target.value)}
              className={errors.showId ? 'error' : ''}
            >
              <option value="">Select a show...</option>
              {shows.map(show => (
                <option key={show.id} value={show.id}>
                  {show.venueName} - {formatDateRange(show.startDate, show.endDate)}
                </option>
              ))}
            </select>
            {errors.showId && <span className="error-text">{errors.showId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expectedAmount">Expected Amount ($) *</label>
              <input
                type="number"
                id="expectedAmount"
                value={formData.expectedAmount}
                onChange={(e) => handleChange('expectedAmount', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.expectedAmount ? 'error' : ''}
              />
              {errors.expectedAmount && <span className="error-text">{errors.expectedAmount}</span>}
              {selectedShow && !isEditing && (
                <span className="helper-text">Show fee: ${selectedShow.performanceFee?.toLocaleString()}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="receivedAmount">Received Amount ($)</label>
              <input
                type="number"
                id="receivedAmount"
                value={formData.receivedAmount}
                onChange={(e) => handleChange('receivedAmount', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.receivedAmount ? 'error' : ''}
              />
              {errors.receivedAmount && <span className="error-text">{errors.receivedAmount}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="invoiceNumber">Invoice Number</label>
              <input
                type="text"
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                placeholder="e.g., INV-2024-001"
                className={errors.invoiceNumber ? 'error' : ''}
              />
              {errors.invoiceNumber && <span className="error-text">{errors.invoiceNumber}</span>}
            </div>

            {formData.status === 'paid' && (
              <div className="form-group">
                <label htmlFor="paidDate">Paid Date</label>
                <input
                  type="date"
                  id="paidDate"
                  value={formData.paidDate}
                  onChange={(e) => handleChange('paidDate', e.target.value)}
                />
              </div>
            )}
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
              {isEditing ? 'Save Changes' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
