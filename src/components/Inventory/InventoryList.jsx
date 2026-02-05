import { useState, useMemo } from 'react';
import InventoryForm from './InventoryForm';
import { exportInventory } from '../../utils/exportUtils';
import './InventoryList.css';

const CATEGORY_LABELS = {
  apparel: 'Apparel',
  accessories: 'Accessories',
  souvenirs: 'Souvenirs',
  other: 'Other'
};

export default function InventoryList({ inventory, onAdd, onUpdate, onDelete, onAdjustStock }) {
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (!item.isActive) return false;

      // Category filter
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;

      // Low stock filter
      if (showLowStockOnly && item.quantityInStock > item.lowStockThreshold) return false;

      // Text filter
      if (filterText.trim()) {
        const search = filterText.toLowerCase();
        return (
          item.name.toLowerCase().includes(search) ||
          item.sku.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [inventory, filterCategory, filterText, showLowStockOnly]);

  // Sort inventory
  const sortedInventory = useMemo(() => {
    const sorted = [...filteredInventory];
    sorted.sort((a, b) => {
      let aVal, bVal;

      switch (sortConfig.key) {
        case 'name':
        case 'sku':
          aVal = (a[sortConfig.key] || '').toLowerCase();
          bVal = (b[sortConfig.key] || '').toLowerCase();
          break;
        case 'category':
          aVal = CATEGORY_LABELS[a.category] || a.category || '';
          bVal = CATEGORY_LABELS[b.category] || b.category || '';
          break;
        case 'quantityInStock':
        case 'unitPrice':
        case 'unitCost':
          aVal = a[sortConfig.key] || 0;
          bVal = b[sortConfig.key] || 0;
          break;
        case 'margin':
          aVal = a.unitPrice > 0 ? ((a.unitPrice - a.unitCost) / a.unitPrice * 100) : 0;
          bVal = b.unitPrice > 0 ? ((b.unitPrice - b.unitCost) / b.unitPrice * 100) : 0;
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
  }, [filteredInventory, sortConfig]);

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
      minimumFractionDigits: 2
    }).format(value);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = (item) => {
    if (editingItem) {
      onUpdate(item);
    } else {
      onAdd(item);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteClick = (item) => {
    setDeleteConfirm(item);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleStockAdjust = (itemId, change) => {
    onAdjustStock(itemId, change);
  };

  const lowStockCount = inventory.filter(
    item => item.isActive && item.quantityInStock <= item.lowStockThreshold
  ).length;

  return (
    <div className="inventory-list">
      {/* Header with filters */}
      <div className="list-header">
        <div className="list-filters">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="filter-input"
          />
          <label className="low-stock-toggle">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
            />
            Low stock only {lowStockCount > 0 && <span className="low-stock-badge">{lowStockCount}</span>}
          </label>
        </div>
        <button className="btn-add" onClick={handleAddNew}>
          + Add Item
        </button>
      </div>

      {/* Inventory table */}
      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Item{getSortIndicator('name')}
              </th>
              <th onClick={() => handleSort('sku')} className="sortable">
                SKU{getSortIndicator('sku')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category{getSortIndicator('category')}
              </th>
              <th onClick={() => handleSort('quantityInStock')} className="sortable qty-col">
                In Stock{getSortIndicator('quantityInStock')}
              </th>
              <th onClick={() => handleSort('unitPrice')} className="sortable price-col">
                Price{getSortIndicator('unitPrice')}
              </th>
              <th onClick={() => handleSort('unitCost')} className="sortable price-col">
                Cost{getSortIndicator('unitCost')}
              </th>
              <th onClick={() => handleSort('margin')} className="sortable price-col">
                Margin{getSortIndicator('margin')}
              </th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInventory.map(item => {
              const isLowStock = item.quantityInStock <= item.lowStockThreshold;
              const margin = ((item.unitPrice - item.unitCost) / item.unitPrice * 100).toFixed(0);

              return (
                <tr key={item.id} className={isLowStock ? 'low-stock-row' : ''}>
                  <td className="item-name">{item.name}</td>
                  <td className="sku-cell">{item.sku}</td>
                  <td>
                    <span className={`category-badge ${item.category}`}>
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </td>
                  <td className="qty-cell">
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => handleStockAdjust(item.id, -1)}
                        disabled={item.quantityInStock === 0}
                      >
                        -
                      </button>
                      <span className={`qty-value ${isLowStock ? 'low' : ''}`}>
                        {item.quantityInStock}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() => handleStockAdjust(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    {isLowStock && (
                      <span className="low-stock-warning">Low stock!</span>
                    )}
                  </td>
                  <td className="price-cell">{formatCurrency(item.unitPrice)}</td>
                  <td className="price-cell cost">{formatCurrency(item.unitCost)}</td>
                  <td className="price-cell margin">{margin}%</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {sortedInventory.length === 0 && (
              <tr>
                <td colSpan="8" className="no-results">
                  No inventory items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inventory Form Modal */}
      {showForm && (
        <InventoryForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Delete Item?</h3>
            <p>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
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
          onClick={() => exportInventory(inventory)}
        >
          Download Inventory Data (CSV)
        </button>
      </div>
    </div>
  );
}
