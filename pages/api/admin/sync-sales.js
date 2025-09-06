import { getProductMetadataFromDB, saveProductMetadataToDB, getOrdersFromDB } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔄 Syncing sales data from existing orders...')
    
    // Get all existing orders
    const orders = await getOrdersFromDB()
    console.log(`📋 Found ${orders.length} existing orders`)
    
    // Get current product metadata
    const currentMetadata = await getProductMetadataFromDB()
    
    // Reset all unitsSold to 0 first, then recalculate
    const productSales = {}
    
    // Count sales from all orders
    for (const order of orders) {
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          const productId = item.id
          const quantity = item.quantity || 1
          
          if (!productSales[productId]) {
            productSales[productId] = 0
          }
          productSales[productId] += quantity
          
          console.log(`📊 Product ${productId}: +${quantity} sales (total: ${productSales[productId]})`)
        }
      }
    }
    
    // Update metadata for products with sales
    let updatedCount = 0
    for (const [productId, totalSales] of Object.entries(productSales)) {
      const existingMeta = currentMetadata[productId] || {
        designOrder: 1,
        unitsSold: 0,
        categories: [],
        customDescription: null
      }
      
      const updatedMeta = {
        ...existingMeta,
        unitsSold: totalSales
      }
      
      await saveProductMetadataToDB(productId, updatedMeta)
      console.log(`✅ Updated ${productId}: unitsSold = ${totalSales}`)
      updatedCount++
    }
    
    console.log(`✅ Synced sales data for ${updatedCount} products`)
    
    return res.status(200).json({
      success: true,
      message: `Synced sales data for ${updatedCount} products`,
      ordersProcessed: orders.length,
      productsSales: productSales
    })

  } catch (error) {
    console.error('❌ Error syncing sales data:', error)
    return res.status(500).json({ 
      error: 'Failed to sync sales data',
      details: error.message 
    })
  }
}