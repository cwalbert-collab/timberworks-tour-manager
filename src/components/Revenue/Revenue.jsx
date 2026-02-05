import { useState } from 'react';
import RevenueNav from './RevenueNav';
import TransactionList from '../Transactions/TransactionList';
import InventoryList from '../Inventory/InventoryList';
import ShowRevenueList from '../ShowRevenue/ShowRevenueList';
import PaymentList from '../Payments/PaymentList';
import EtsyConnect from '../Etsy/EtsyConnect';
import './Revenue.css';

export default function Revenue({
  shows,
  transactions,
  inventory,
  payments,
  metrics,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onAddInventoryItem,
  onUpdateInventoryItem,
  onDeleteInventoryItem,
  onAdjustStock,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment,
  onMarkPaymentPaid,
  getShowRevenueBreakdown,
  getShowPayment,
  // Etsy integration props
  etsy
}) {
  const [activeView, setActiveView] = useState('transactions');

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="revenue">
      {/* Summary Stats */}
      <div className="revenue-summary">
        <div className="revenue-stat">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value positive">{formatCurrency(metrics.totalRevenue)}</span>
        </div>
        <div className="revenue-stat">
          <span className="stat-label">Show Fees</span>
          <span className="stat-value">{formatCurrency(metrics.showFeeRevenue)}</span>
        </div>
        <div className="revenue-stat">
          <span className="stat-label">Merch Sales</span>
          <span className="stat-value">{formatCurrency(metrics.merchRevenue)}</span>
        </div>
        <div className="revenue-stat">
          <span className="stat-label">Outstanding</span>
          <span className="stat-value warning">{formatCurrency(metrics.outstandingAmount)}</span>
        </div>
        {metrics.lowStockItemsCount > 0 && (
          <div className="revenue-stat alert">
            <span className="stat-label">Low Stock</span>
            <span className="stat-value">{metrics.lowStockItemsCount} items</span>
          </div>
        )}
      </div>

      {/* Sub-navigation */}
      <RevenueNav activeView={activeView} onViewChange={setActiveView} />

      {/* Content Views */}
      {activeView === 'transactions' && (
        <TransactionList
          transactions={transactions}
          shows={shows}
          onAdd={onAddTransaction}
          onUpdate={onUpdateTransaction}
          onDelete={onDeleteTransaction}
        />
      )}

      {activeView === 'by-show' && (
        <ShowRevenueList
          shows={shows}
          payments={payments}
          getShowRevenueBreakdown={getShowRevenueBreakdown}
          getShowPayment={getShowPayment}
        />
      )}

      {activeView === 'inventory' && (
        <InventoryList
          inventory={inventory}
          onAdd={onAddInventoryItem}
          onUpdate={onUpdateInventoryItem}
          onDelete={onDeleteInventoryItem}
          onAdjustStock={onAdjustStock}
        />
      )}

      {activeView === 'payments' && (
        <PaymentList
          payments={payments}
          shows={shows}
          onAdd={onAddPayment}
          onUpdate={onUpdatePayment}
          onDelete={onDeletePayment}
          onMarkPaid={onMarkPaymentPaid}
        />
      )}

      {activeView === 'etsy' && etsy && (
        <EtsyConnect
          isConnected={etsy.isConnected}
          isConnecting={etsy.isConnecting}
          isSyncing={etsy.isSyncing}
          shopStats={etsy.shopStats}
          orders={etsy.orders}
          stats={etsy.stats}
          lastSyncTime={etsy.lastSyncTime}
          syncError={etsy.syncError}
          onConnect={etsy.connect}
          onDisconnect={etsy.disconnect}
          onSync={etsy.syncOrders}
          onImportOrder={etsy.importOrder}
          onImportAll={etsy.importAllOrders}
          isOrderImported={etsy.isOrderImported}
        />
      )}
    </div>
  );
}
