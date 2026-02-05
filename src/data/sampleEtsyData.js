// Sample Etsy orders for simulated integration
// These would normally come from the Etsy API

export const sampleEtsyOrders = [
  {
    orderId: 'etsy-3847291056',
    receiptId: '3847291056',
    buyerName: 'Sarah M.',
    buyerEmail: 's***@gmail.com',
    orderDate: '2024-06-28T14:23:00Z',
    items: [
      { name: 'Timberworks T-Shirt (L)', quantity: 2, price: 25 },
      { name: 'Mini Axe Keychain', quantity: 3, price: 8 }
    ],
    subtotal: 74,
    shippingCost: 5.99,
    etsyFees: 4.81,
    processingFees: 2.22,
    totalPaid: 79.99,
    netRevenue: 67.97,
    status: 'completed',
    shippedDate: '2024-06-29T10:00:00Z',
    trackingNumber: '9400111899223847291056'
  },
  {
    orderId: 'etsy-3851029384',
    receiptId: '3851029384',
    buyerName: 'Mike T.',
    buyerEmail: 'm***@yahoo.com',
    orderDate: '2024-07-02T09:15:00Z',
    items: [
      { name: 'Show Poster (Signed)', quantity: 1, price: 45 }
    ],
    subtotal: 45,
    shippingCost: 8.99,
    etsyFees: 3.24,
    processingFees: 1.62,
    totalPaid: 53.99,
    netRevenue: 40.14,
    status: 'completed',
    shippedDate: '2024-07-03T11:30:00Z',
    trackingNumber: '9400111899223851029384'
  },
  {
    orderId: 'etsy-3856712045',
    receiptId: '3856712045',
    buyerName: 'Jennifer L.',
    buyerEmail: 'j***@hotmail.com',
    orderDate: '2024-07-05T16:42:00Z',
    items: [
      { name: 'Timberworks Hoodie', quantity: 1, price: 45 },
      { name: 'Lumberjack Cap', quantity: 2, price: 20 },
      { name: 'Timber Coffee Mug', quantity: 1, price: 15 }
    ],
    subtotal: 100,
    shippingCost: 7.99,
    etsyFees: 6.48,
    processingFees: 3.24,
    totalPaid: 107.99,
    netRevenue: 90.28,
    status: 'completed',
    shippedDate: '2024-07-06T09:00:00Z',
    trackingNumber: '9400111899223856712045'
  },
  {
    orderId: 'etsy-3862094821',
    receiptId: '3862094821',
    buyerName: 'David R.',
    buyerEmail: 'd***@gmail.com',
    orderDate: '2024-07-10T11:08:00Z',
    items: [
      { name: 'Timberworks T-Shirt (XL)', quantity: 1, price: 25 },
      { name: 'Show Poster (Unsigned)', quantity: 2, price: 12 }
    ],
    subtotal: 49,
    shippingCost: 5.99,
    etsyFees: 3.30,
    processingFees: 1.65,
    totalPaid: 54.99,
    netRevenue: 44.05,
    status: 'completed',
    shippedDate: '2024-07-11T14:00:00Z',
    trackingNumber: '9400111899223862094821'
  },
  {
    orderId: 'etsy-3869483726',
    receiptId: '3869483726',
    buyerName: 'Emily W.',
    buyerEmail: 'e***@outlook.com',
    orderDate: '2024-07-15T08:30:00Z',
    items: [
      { name: 'Mini Axe Keychain', quantity: 5, price: 8 }
    ],
    subtotal: 40,
    shippingCost: 4.99,
    etsyFees: 2.70,
    processingFees: 1.35,
    totalPaid: 44.99,
    netRevenue: 35.95,
    status: 'completed',
    shippedDate: '2024-07-16T10:30:00Z',
    trackingNumber: '9400111899223869483726'
  },
  {
    orderId: 'etsy-3874920184',
    receiptId: '3874920184',
    buyerName: 'Chris B.',
    buyerEmail: 'c***@gmail.com',
    orderDate: '2024-07-20T13:45:00Z',
    items: [
      { name: 'Timberworks T-Shirt (M)', quantity: 3, price: 25 },
      { name: 'Timberworks Hoodie', quantity: 1, price: 45 },
      { name: 'Lumberjack Cap', quantity: 1, price: 20 }
    ],
    subtotal: 140,
    shippingCost: 9.99,
    etsyFees: 9.00,
    processingFees: 4.50,
    totalPaid: 149.99,
    netRevenue: 126.50,
    status: 'shipped',
    shippedDate: '2024-07-21T11:00:00Z',
    trackingNumber: '9400111899223874920184'
  },
  {
    orderId: 'etsy-3880291047',
    receiptId: '3880291047',
    buyerName: 'Amanda K.',
    buyerEmail: 'a***@icloud.com',
    orderDate: '2024-07-25T19:20:00Z',
    items: [
      { name: 'Timber Coffee Mug', quantity: 4, price: 15 }
    ],
    subtotal: 60,
    shippingCost: 8.99,
    etsyFees: 4.14,
    processingFees: 2.07,
    totalPaid: 68.99,
    netRevenue: 53.79,
    status: 'shipped',
    shippedDate: '2024-07-26T09:30:00Z',
    trackingNumber: '9400111899223880291047'
  },
  {
    orderId: 'etsy-3885647293',
    receiptId: '3885647293',
    buyerName: 'Robert H.',
    buyerEmail: 'r***@gmail.com',
    orderDate: '2024-07-30T10:12:00Z',
    items: [
      { name: 'Show Poster (Signed)', quantity: 2, price: 45 },
      { name: 'Mini Axe Keychain', quantity: 2, price: 8 }
    ],
    subtotal: 106,
    shippingCost: 7.99,
    etsyFees: 6.84,
    processingFees: 3.42,
    totalPaid: 113.99,
    netRevenue: 96.74,
    status: 'processing',
    shippedDate: null,
    trackingNumber: null
  },
  {
    orderId: 'etsy-3890182756',
    receiptId: '3890182756',
    buyerName: 'Lisa P.',
    buyerEmail: 'l***@yahoo.com',
    orderDate: '2024-08-02T15:55:00Z',
    items: [
      { name: 'Timberworks T-Shirt (S)', quantity: 1, price: 25 },
      { name: 'Timberworks T-Shirt (M)', quantity: 1, price: 25 }
    ],
    subtotal: 50,
    shippingCost: 5.99,
    etsyFees: 3.36,
    processingFees: 1.68,
    totalPaid: 55.99,
    netRevenue: 44.96,
    status: 'processing',
    shippedDate: null,
    trackingNumber: null
  }
];

// Shop statistics that would come from Etsy API
export const sampleEtsyShopStats = {
  shopName: 'TimberworksLumberjackShop',
  shopUrl: 'https://www.etsy.com/shop/TimberworksLumberjackShop',
  activeListings: 12,
  totalSales: 847,
  totalRevenue: 28439.50,
  averageRating: 4.9,
  reviewCount: 312,
  favoriteCount: 1847,
  memberSince: '2019-03-15',
  lastUpdated: new Date().toISOString()
};

// Convert Etsy order to transaction format
export function etsyOrderToTransaction(order) {
  const itemSummary = order.items
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');

  return {
    id: `etsy-txn-${order.receiptId}`,
    type: 'merch_sale',
    showId: null, // Online sales have no show
    date: order.orderDate.split('T')[0],
    description: `Etsy Order #${order.receiptId}: ${itemSummary}`,
    amount: order.netRevenue, // Use net after fees
    category: 'merchandise',
    paymentMethod: 'online',
    notes: `Etsy fees: $${(order.etsyFees + order.processingFees).toFixed(2)}`,
    source: 'etsy',
    etsyOrderId: order.orderId,
    createdAt: order.orderDate
  };
}
