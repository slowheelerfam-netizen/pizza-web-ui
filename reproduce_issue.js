
const { ORDER_STATUS } = require('./src/types/models');
const { demoStorage } = require('./src/lib/demoStorage');

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

// Inject mock into global (since demoStorage checks window/localStorage)
global.window = {};
global.localStorage = localStorageMock;

// Mock OrderService (simplified)
const orderService = {
  updateStatus: async (orderId, newStatus) => {
    console.log(`[Server] Updating status of ${orderId} to ${newStatus}`);
    if (newStatus === ORDER_STATUS.COMPLETED) {
      return { id: orderId, status: newStatus, completedAt: new Date().toISOString() };
    }
    return { id: orderId, status: newStatus };
  }
};

// Simulation
async function runSimulation() {
  console.log('--- Starting Simulation ---');

  // 1. Create an order in "Server" (represented by object)
  const orderId = 'order-123';
  const serverOrder = {
    id: orderId,
    status: ORDER_STATUS.READY,
    customerSnapshot: { name: 'Test Customer' },
    createdAt: new Date(Date.now() - 10000).toISOString(),
    updatedAt: new Date(Date.now() - 5000).toISOString() // 5s ago
  };

  console.log('1. Initial Server Order:', serverOrder.status);

  // 2. Simulate AdminDashboard receiving this order
  let dashboardOrders = [serverOrder];

  // 3. Simulate "Order Picked Up" click
  console.log('2. User clicks "Order Picked Up"');
  
  // 3a. Update demoStorage (Client-side persistence)
  // NOTE: If order is NOT in demoStorage, updateOrderStatus does nothing.
  // Let's assume the order is NOT in demoStorage initially (common for server-fetched orders).
  demoStorage.updateOrderStatus(orderId, ORDER_STATUS.COMPLETED);
  
  const localOrdersAfterUpdate = demoStorage.getOrders();
  console.log('3a. Local Storage after update (should be empty if not present):', localOrdersAfterUpdate);

  // 3b. Optimistic UI update
  dashboardOrders = dashboardOrders.map(o => 
    o.id === orderId ? { ...o, status: ORDER_STATUS.COMPLETED } : o
  );
  console.log('3b. Dashboard State (Optimistic):', dashboardOrders[0].status);

  // 3c. API Call (Server update)
  const updatedServerOrder = await orderService.updateStatus(orderId, ORDER_STATUS.COMPLETED);
  // Server updates its record
  serverOrder.status = updatedServerOrder.status;
  serverOrder.updatedAt = new Date().toISOString();
  console.log('3c. Server Order after API:', serverOrder.status);

  // 4. Simulate router.refresh() -> Re-fetching server props
  // Server returns the updated order
  const refreshedServerOrders = [serverOrder];
  
  // 5. Simulate useEffect merge
  const mergedOrders = mergeOrders(refreshedServerOrders, demoStorage.getOrders());
  
  console.log('4. Final Dashboard State (after merge):', mergedOrders[0].status);

  if (mergedOrders[0].status === 'NEW') {
    console.error('!!! BUG REPRODUCED: Status reverted to NEW !!!');
  } else if (mergedOrders[0].status === ORDER_STATUS.COMPLETED) {
    console.log('SUCCESS: Status is COMPLETED');
  } else {
    console.log('RESULT:', mergedOrders[0].status);
  }
}

// Logic from AdminDashboard.js
function mergeOrders(initialOrders, localOrders) {
    const orderMap = new Map();
    initialOrders.forEach((o) => orderMap.set(o.id, o));

    localOrders.forEach((localOrder) => {
      const serverOrder = orderMap.get(localOrder.id);
      if (!serverOrder) {
        orderMap.set(localOrder.id, localOrder);
      } else {
        const serverTime = new Date(serverOrder.updatedAt || 0).getTime();
        const localTime = new Date(localOrder.updatedAt || 0).getTime();
        if (localTime > serverTime) {
          orderMap.set(localOrder.id, localOrder);
        }
      }
    });
    return Array.from(orderMap.values());
}

runSimulation();
