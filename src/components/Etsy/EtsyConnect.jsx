import { useState } from 'react';
import './EtsyConnect.css';

export default function EtsyConnect({
  isConnected,
  isConnecting,
  isSyncing,
  shopStats,
  orders,
  stats,
  lastSyncTime,
  syncError,
  onConnect,
  onDisconnect,
  onSync,
  onImportOrder,
  onImportAll,
  isOrderImported
}) {
  const [showOrders, setShowOrders] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleImportAll = () => {
    const count = onImportAll();
    setImportResult(count > 0
      ? `Successfully imported ${count} order${count > 1 ? 's' : ''} as transactions!`
      : 'All orders have already been imported.'
    );
    setTimeout(() => setImportResult(null), 3000);
  };

  const handleImportOrder = (order) => {
    const success = onImportOrder(order);
    if (success) {
      setImportResult(`Imported order #${order.receiptId}`);
      setTimeout(() => setImportResult(null), 2000);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      default: return '';
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className="etsy-connect">
        <div className="etsy-connect-card">
          <div className="etsy-logo">
            <svg viewBox="0 0 24 24" className="etsy-icon">
              <path fill="currentColor" d="M8.559 1.018c-.353.047-.702.124-1.023.256-.627.256-1.17.664-1.576 1.167-.428.533-.694 1.165-.79 1.846-.048.34-.048.686-.024 1.025.024.363.094.718.19 1.068.168.599.377 1.187.6 1.766.218.571.44 1.14.672 1.705.232.567.468 1.132.707 1.696.239.564.48 1.127.722 1.69.242.562.486 1.123.731 1.684.245.561.491 1.122.738 1.683.247.56.495 1.12.744 1.68.249.559.499 1.118.75 1.677.25.559.502 1.117.755 1.675.126.28.253.559.38.838l.003.005c.058.13.058.13.246.13h6.696c.036 0 .07-.005.104-.015.035-.01.068-.026.098-.046.03-.02.057-.044.08-.072.023-.028.042-.06.055-.093.013-.034.021-.069.024-.105.002-.036-.002-.072-.012-.107-.01-.035-.025-.068-.045-.098-.02-.03-.044-.057-.072-.079-.028-.023-.059-.041-.092-.054-.034-.013-.069-.021-.105-.023-.036-.003-.072.001-.106.01-.035.01-.068.025-.098.045-.03.02-.057.044-.08.071-.023.028-.042.059-.055.092l-.001.003c-.127.279-.254.558-.381.837-.253.558-.505 1.116-.756 1.674-.251.559-.501 1.118-.75 1.677-.249.56-.497 1.119-.744 1.679-.247.56-.493 1.121-.738 1.682-.245.562-.489 1.123-.731 1.685-.242.563-.483 1.126-.722 1.69-.239.564-.476 1.129-.707 1.696-.232.565-.454 1.134-.672 1.705-.223.579-.432 1.167-.6 1.766-.096.35-.166.705-.19 1.068-.024.339-.024.685.024 1.025.096.681.362 1.313.79 1.846.406.503.949.911 1.576 1.167.321.132.67.209 1.023.256.374.049.755.049 1.128 0 .353-.047.702-.124 1.023-.256.627-.256 1.17-.664 1.576-1.167.428-.533.694-1.165.79-1.846.048-.34.048-.686.024-1.025-.024-.363-.094-.718-.19-1.068-.168-.599-.377-1.187-.6-1.766-.218-.571-.44-1.14-.672-1.705-.232-.567-.468-1.132-.707-1.696-.239-.564-.48-1.127-.722-1.69-.242-.562-.486-1.123-.731-1.684-.245-.561-.491-1.122-.738-1.683-.247-.56-.495-1.12-.744-1.68-.249-.559-.499-1.118-.75-1.677-.25-.559-.502-1.117-.755-1.675-.127-.28-.254-.559-.381-.838l-.003-.005c-.058-.13-.058-.13-.246-.13H3.764c-.188 0-.188 0-.246.13l-.003.005c-.127.279-.254.558-.381.838-.253.558-.505 1.116-.755 1.675-.251.559-.501 1.118-.75 1.677-.249.56-.497 1.12-.744 1.68-.247.56-.493 1.121-.738 1.683-.245.561-.489 1.122-.731 1.684-.242.563-.483 1.126-.722 1.69-.239.564-.476 1.129-.707 1.696-.232.566-.454 1.134-.672 1.705-.223.579-.432 1.167-.6 1.766-.096.35-.166.705-.19 1.068-.024.339-.024.685.024 1.025.096.681.362 1.313.79 1.846.406.503.949.911 1.576 1.167.321.132.67.209 1.023.256.374.049.755.049 1.128 0z"/>
            </svg>
          </div>
          <h3>Connect Your Etsy Shop</h3>
          <p className="etsy-description">
            Import your online merchandise sales automatically from Etsy.
            Orders will sync and can be imported as transactions.
          </p>
          <button
            className="btn-etsy-connect"
            onClick={onConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <span className="etsy-btn-icon">🔗</span>
                Connect to Etsy
              </>
            )}
          </button>
          <p className="etsy-note">
            This is a demo integration. In production, this would use Etsy's OAuth API.
          </p>
        </div>
      </div>
    );
  }

  // Connected state
  return (
    <div className="etsy-connect">
      {/* Connection Status Card */}
      <div className="etsy-status-card">
        <div className="etsy-status-header">
          <div className="etsy-shop-info">
            <div className="connection-badge connected">
              <span className="status-dot"></span>
              Connected
            </div>
            <h3 className="shop-name">{shopStats?.shopName || 'Etsy Shop'}</h3>
            <a
              href={shopStats?.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shop-link"
            >
              View on Etsy →
            </a>
          </div>
          <div className="etsy-actions">
            <button
              className="btn-sync"
              onClick={onSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <span className="spinner small"></span>
                  Syncing...
                </>
              ) : (
                <>
                  <span className="btn-icon">🔄</span>
                  Sync Now
                </>
              )}
            </button>
            <button
              className="btn-disconnect"
              onClick={onDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>

        {syncError && (
          <div className="sync-error">
            <span className="error-icon">⚠️</span>
            {syncError}
          </div>
        )}

        {importResult && (
          <div className="import-success">
            <span className="success-icon">✓</span>
            {importResult}
          </div>
        )}

        <div className="sync-info">
          <span>Last synced: {formatRelativeTime(lastSyncTime)}</span>
        </div>
      </div>

      {/* Shop Stats */}
      <div className="etsy-stats-grid">
        <div className="etsy-stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="stat-label">Recent Orders</span>
          </div>
        </div>
        <div className="etsy-stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-content">
            <span className="stat-value">{stats.completedOrders}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="etsy-stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-content">
            <span className="stat-value">{stats.pendingOrders}</span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
        <div className="etsy-stat-card highlight">
          <span className="stat-icon">💰</span>
          <div className="stat-content">
            <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
            <span className="stat-label">Net Revenue</span>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="etsy-import-section">
        <div className="import-header">
          <div>
            <h4>Import Orders as Transactions</h4>
            <p className="import-description">
              {stats.unimportedCount > 0
                ? `${stats.unimportedCount} order${stats.unimportedCount > 1 ? 's' : ''} ready to import`
                : 'All orders have been imported'
              }
            </p>
          </div>
          <button
            className="btn-import-all"
            onClick={handleImportAll}
            disabled={stats.allImported}
          >
            <span className="btn-icon">📥</span>
            Import All ({stats.unimportedCount})
          </button>
        </div>

        <button
          className="btn-toggle-orders"
          onClick={() => setShowOrders(!showOrders)}
        >
          {showOrders ? 'Hide' : 'Show'} Order Details
          <span className={`chevron ${showOrders ? 'open' : ''}`}>▼</span>
        </button>

        {showOrders && (
          <div className="orders-list">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Net Revenue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const imported = isOrderImported(order.orderId);
                  return (
                    <tr key={order.orderId} className={imported ? 'imported' : ''}>
                      <td className="order-id">{order.receiptId}</td>
                      <td>{formatDate(order.orderDate)}</td>
                      <td>{order.buyerName}</td>
                      <td className="items-cell">
                        {order.items.map((item, i) => (
                          <span key={i} className="item-tag">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </td>
                      <td className="revenue-cell">{formatCurrency(order.netRevenue)}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {imported ? (
                          <span className="imported-badge">
                            <span className="check-icon">✓</span>
                            Imported
                          </span>
                        ) : (
                          <button
                            className="btn-import-single"
                            onClick={() => handleImportOrder(order)}
                          >
                            Import
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shop Performance (from Etsy stats) */}
      {shopStats && (
        <div className="shop-performance">
          <h4>Shop Performance</h4>
          <div className="performance-stats">
            <div className="perf-stat">
              <span className="perf-value">{shopStats.totalSales}</span>
              <span className="perf-label">Total Sales</span>
            </div>
            <div className="perf-stat">
              <span className="perf-value">⭐ {shopStats.averageRating}</span>
              <span className="perf-label">{shopStats.reviewCount} Reviews</span>
            </div>
            <div className="perf-stat">
              <span className="perf-value">{shopStats.activeListings}</span>
              <span className="perf-label">Active Listings</span>
            </div>
            <div className="perf-stat">
              <span className="perf-value">❤️ {shopStats.favoriteCount}</span>
              <span className="perf-label">Favorites</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
