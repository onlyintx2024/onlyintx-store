// In-memory storage that works across API calls during the same session
let ordersCache = null

// Initialize with your old test order so you can see it working
const INITIAL_ORDERS = [
  {
    "id": "order_1755662701964",
    "paymentId": "pi_3Ry3GiRc68QoU5s80oqjdzfi",
    "customer": {
      "email": "joe@joe.com",
      "name": "joe mama"
    },
    "items": [
      {
        "id": "68a2acaa09de3a1de90e76bc",
        "name": "Houston Music Lover T-Shirt - Guitar Design",
        "price": 1318,  // Convert back to cents
        "size": "L",
        "image": "https://images-api.printify.com/mockup/68a2acaa09de3a1de90e76bc/38191/97992/houston-guitar-skyline-unisex-t-shirt-texas-pride-shirt-music-lover-gift-casual-wear-cityscape-tee.jpg?camera_label=front",
        "quantity": 1
      }
    ],
    "amount": 0.5,
    "status": "processing",
    "printifyOrderIds": [
      "68a54971e2c704eda2086078"
    ],
    "createdAt": "2025-08-20T04:05:01.964Z"
  }
]

export async function saveOrder(order) {
  try {
    console.log('💾 Saving order to memory storage:', order.id)
    
    // Get current orders or use initial data
    const orders = ordersCache || INITIAL_ORDERS.slice()
    
    // Add new order to beginning
    orders.unshift(order)
    
    // Keep only last 50 orders
    const trimmedOrders = orders.slice(0, 50)
    
    // Update cache
    ordersCache = trimmedOrders
    
    console.log('✅ Order saved successfully. Total orders:', ordersCache.length)
    return true
  } catch (error) {
    console.error('❌ Error saving order:', error)
    return false
  }
}

export async function getOrders() {
  try {
    // Return cache if available, otherwise return initial orders
    const orders = ordersCache || INITIAL_ORDERS.slice()
    console.log('📋 Retrieved orders, count:', orders.length)
    return orders
  } catch (error) {
    console.error('❌ Error fetching orders:', error)
    return INITIAL_ORDERS.slice()
  }
}

export async function updateOrder(orderId, updates) {
  try {
    const orders = ordersCache || INITIAL_ORDERS.slice()
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      console.error('❌ Order not found for update:', orderId)
      return false
    }
    
    orders[orderIndex] = { ...orders[orderIndex], ...updates }
    ordersCache = orders
    
    console.log('✅ Order updated successfully')
    return true
  } catch (error) {
    console.error('❌ Error updating order:', error)
    return false
  }
}