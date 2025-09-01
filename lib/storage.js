import { promises as fs } from 'fs'
import path from 'path'

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json')

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

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(ORDERS_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read orders from file
async function readOrdersFromFile() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is invalid, return initial orders
    console.log('📋 Creating initial orders file')
    await writeOrdersToFile(INITIAL_ORDERS)
    return INITIAL_ORDERS
  }
}

// Write orders to file
async function writeOrdersToFile(orders) {
  try {
    await ensureDataDir()
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
    return true
  } catch (error) {
    console.error('❌ Error writing orders file:', error)
    return false
  }
}

export async function saveOrder(order) {
  try {
    console.log('💾 Saving order to persistent storage:', order.id)
    
    // Get current orders from file
    const orders = await readOrdersFromFile()
    
    // Add new order to beginning
    orders.unshift(order)
    
    // Keep only last 50 orders
    const trimmedOrders = orders.slice(0, 50)
    
    // Save to file
    const success = await writeOrdersToFile(trimmedOrders)
    
    if (success) {
      console.log('✅ Order saved successfully. Total orders:', trimmedOrders.length)
      return true
    } else {
      console.error('❌ Failed to write orders to file')
      return false
    }
  } catch (error) {
    console.error('❌ Error saving order:', error)
    return false
  }
}

export async function getOrders() {
  try {
    // Read orders from persistent file storage
    const orders = await readOrdersFromFile()
    console.log('📋 Retrieved orders from file, count:', orders.length)
    return orders
  } catch (error) {
    console.error('❌ Error fetching orders:', error)
    return INITIAL_ORDERS.slice()
  }
}

export async function updateOrder(orderId, updates) {
  try {
    // Read current orders from file
    const orders = await readOrdersFromFile()
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      console.error('❌ Order not found for update:', orderId)
      return false
    }
    
    // Update the order
    orders[orderIndex] = { ...orders[orderIndex], ...updates }
    
    // Save back to file
    const success = await writeOrdersToFile(orders)
    
    if (success) {
      console.log('✅ Order updated successfully')
      return true
    } else {
      console.error('❌ Failed to write updated orders to file')
      return false
    }
  } catch (error) {
    console.error('❌ Error updating order:', error)
    return false
  }
}