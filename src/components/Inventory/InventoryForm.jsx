import { useState } from 'react';
import './InventoryForm.css';

const CATEGORIES = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'souvenirs', label: 'Souvenirs' },
  { value: 'other', label: 'Other' }
];

export default function InventoryForm({ item, onSave, onCancel }) {
  const isEditing = !!item;

  const [formData, setFormData] = useState({
    name: item?.name || '',
    sku: item?.sku || '',
    category: item?.category || 'apparel',
    unitPrice: item?.unitPrice || '',
    unitCost: item?.unitCost || '',
    quantityInStock: item?.quantityInStock ?? '',
    lowStockThreshold: item?.lowStockThreshold || 10,
    isActive: item?.isActive ?? true
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Price must be greater than 0';
    }

    if (!formData.unitCost || parseFloat(formData.unitCost) < 0) {
      newErrors.unitCost = 'Cost cannot be negative';
    }

    if (formData.quantityInStock === '' || parseInt(formData.quantityInStock) < 0) {
      newErrors.quantityInStock = 'Quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const inventoryItem = {
      ...item,
      id: item?.id || `inv-${Date.now()}`,
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      unitPrice: parseFloat(formData.unitPrice),
      unitCost: parseFloat(formData.unitCost),
      quantityInStock: parseInt(formData.quantityInStock),
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
      isActive: formData.isActive,
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(inventoryItem);
  };

  const margin = formData.unitPrice && formData.unitCost
    ? ((parseFloat(formData.unitPrice) - parseFloat(formData.unitCost)) / parseFloat(formData.unitPrice) * 100).toFixed(1)
    : null;

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Item' : 'Add Inventory Item'}</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Item Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Timberworks T-Shirt (L)"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sku">SKU *</label>
              <input
                type="text"
                id="sku"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                placeholder="e.g., SHIRT-L"
                className={errors.sku ? 'error' : ''}
              />
              {errors.sku && <span className="error-text">{errors.sku}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="unitPrice">Sell Price ($) *</label>
              <input
                type="number"
                id="unitPrice"
                value={formData.unitPrice}
                onChange={(e) => handleChange('unitPrice', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.unitPrice ? 'error' : ''}
              />
              {errors.unitPrice && <span className="error-text">{errors.unitPrice}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="unitCost">Unit Cost ($) *</label>
              <input
                type="number"
                id="unitCost"
                value={formData.unitCost}
                onChange={(e) => handleChange('unitCost', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.unitCost ? 'error' : ''}
              />
              {errors.unitCost && <span className="error-text">{errors.unitCost}</span>}
            </div>
          </div>

          {margin !== null && (
            <div className="margin-display">
              Profit Margin: <strong>{margin}%</strong>
              {parseFloat(margin) < 30 && (
                <span className="margin-warning"> (Low margin)</span>
              )}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantityInStock">Quantity in Stock *</label>
              <input
                type="number"
                id="quantityInStock"
                value={formData.quantityInStock}
                onChange={(e) => handleChange('quantityInStock', e.target.value)}
                placeholder="0"
                min="0"
                className={errors.quantityInStock ? 'error' : ''}
              />
              {errors.quantityInStock && <span className="error-text">{errors.quantityInStock}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lowStockThreshold">Low Stock Alert</label>
              <input
                type="number"
                id="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
                placeholder="10"
                min="0"
              />
              <span className="helper-text">Alert when stock falls below this</span>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
              Active (available for sale)
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {isEditing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
