// This is a simple file-based storage system
// In production, you'd use a proper database
import fs from 'fs'
import path from 'path'
import { requireAuth } from '../../utils/auth'

const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json')

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ordersFilePath)) {
  fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2))
}

function getOrders() {
  try {
    const data = fs.readFileSync(ordersFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
}

function saveOrders(orders) {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2))
    return true
  } catch (error) {
    console.error('Error saving orders:', error)
    return false
  }
}

export default requireAuth(async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const orders = getOrders()
        return res.status(200).json({ orders })
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch orders' })
      }
      
    case 'POST':
      try {
        const { order } = req.body
        const orders = getOrders()
        
        // Add timestamp if not present
        if (!order.createdAt) {
          order.createdAt = new Date().toISOString()
        }
        
        orders.unshift(order) // Add to beginning of array
        
        if (saveOrders(orders)) {
          return res.status(201).json({ success: true, order })
        } else {
          return res.status(500).json({ error: 'Failed to save order' })
        }
      } catch (error) {
        console.error('Error creating order:', error)
        return res.status(500).json({ error: 'Failed to create order' })
      }
      
    case 'PUT':
      try {
        const { orderId, updates } = req.body
        const orders = getOrders()
        
        const orderIndex = orders.findIndex(o => o.id === orderId)
        if (orderIndex === -1) {
          return res.status(404).json({ error: 'Order not found' })
        }
        
        orders[orderIndex] = { ...orders[orderIndex], ...updates }
        
        if (saveOrders(orders)) {
          return res.status(200).json({ success: true, order: orders[orderIndex] })
        } else {
          return res.status(500).json({ error: 'Failed to update order' })
        }
      } catch (error) {
        console.error('Error updating order:', error)
        return res.status(500).json({ error: 'Failed to update order' })
      }
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
})