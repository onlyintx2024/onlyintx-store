import { requireAuth } from '../../utils/auth'
import { getOrders, saveOrder, updateOrder } from '../../lib/storage'

export default requireAuth(async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const orders = await getOrders()
        return res.status(200).json({ orders })
      } catch (error) {
        console.error('Error fetching orders:', error)
        return res.status(500).json({ error: 'Failed to fetch orders' })
      }
      
    case 'POST':
      try {
        const { order } = req.body
        
        // Add timestamp if not present
        if (!order.createdAt) {
          order.createdAt = new Date().toISOString()
        }
        
        const success = await saveOrder(order)
        
        if (success) {
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
        
        const success = await updateOrder(orderId, updates)
        
        if (success) {
          return res.status(200).json({ success: true })
        } else {
          return res.status(404).json({ error: 'Order not found or failed to update' })
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