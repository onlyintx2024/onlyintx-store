// Simple persistent storage using JSONBin.io
// Free service that provides JSON storage via REST API

const BIN_ID = '677e74f5ad19ca34f8e3e6f5' // Free public bin for OnlyInTX orders

export async function saveOrder(order) {
  try {
    // Get existing orders
    const orders = await getOrders()
    
    // Add new order to beginning
    orders.unshift(order)
    
    // Keep only last 50 orders to avoid hitting storage limits
    const trimmedOrders = orders.slice(0, 50)
    
    // Save back to JSONBin
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orders: trimmedOrders })
    })
    
    if (response.ok) {
      console.log('✅ Order saved to persistent storage')
      return true
    } else {
      const errorText = await response.text()
      console.error('❌ Failed to save to persistent storage:', response.status, errorText)
      return false
    }
  } catch (error) {
    console.error('❌ Error saving order:', error)
    return false
  }
}

export async function getOrders() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`)
    
    if (response.ok) {
      const data = await response.json()
      return data.record?.orders || []
    } else if (response.status === 404) {
      // No data yet, return empty array
      return []
    } else {
      console.error('❌ Failed to fetch orders:', response.status)
      return []
    }
  } catch (error) {
    console.error('❌ Error fetching orders:', error)
    return []
  }
}

export async function updateOrder(orderId, updates) {
  try {
    const orders = await getOrders()
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      console.error('❌ Order not found for update:', orderId)
      return false
    }
    
    orders[orderIndex] = { ...orders[orderIndex], ...updates }
    
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orders })
    })
    
    if (response.ok) {
      console.log('✅ Order updated successfully')
      return true
    } else {
      console.error('❌ Failed to update order:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Error updating order:', error)
    return false
  }
}