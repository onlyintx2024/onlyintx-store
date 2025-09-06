import { saveOrderToDB, getOrdersFromDB, updateOrderInDB, getProductMetadataFromDB, saveProductMetadataToDB } from './db.js'

// Legacy initial order for reference (will be automatically migrated to DB)
const INITIAL_ORDER = {
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
      "price": 1318,
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

export async function saveOrder(order) {
  try {
    console.log('💾 Saving order to database:', order.id)
    console.log('📄 Order details:', JSON.stringify(order, null, 2))
    
    const success = await saveOrderToDB(order)
    
    if (success) {
      console.log('✅ Order saved successfully to database')
      
      // Update unitsSold for each product in the order
      try {
        console.log('📊 Updating product sales counts...')
        const currentMetadata = await getProductMetadataFromDB()
        
        for (const item of order.items) {
          const productId = item.id
          const quantity = item.quantity || 1
          
          console.log(`📈 Incrementing unitsSold for product ${productId} by ${quantity}`)
          
          const existingMeta = currentMetadata[productId] || {
            designOrder: 1,
            unitsSold: 0,
            categories: [],
            customDescription: null
          }
          
          const updatedMeta = {
            ...existingMeta,
            unitsSold: (existingMeta.unitsSold || 0) + quantity
          }
          
          await saveProductMetadataToDB(productId, updatedMeta)
          console.log(`✅ Updated ${productId}: unitsSold = ${updatedMeta.unitsSold}`)
        }
        
        console.log('✅ All product sales counts updated')
      } catch (metaError) {
        console.error('❌ Error updating product sales counts:', metaError)
        // Don't fail the entire order save if metadata update fails
      }
      
      return true
    } else {
      console.error('❌ Failed to save order to database')
      return false
    }
  } catch (error) {
    console.error('❌ Error saving order:', error)
    return false
  }
}

export async function getOrders() {
  try {
    console.log('📋 Fetching orders from database...')
    const orders = await getOrdersFromDB()
    console.log('📋 Retrieved orders from database, count:', orders.length)
    
    // If no orders in database, ensure we have at least the initial order for reference
    if (orders.length === 0) {
      console.log('📋 No orders found, ensuring initial order exists...')
      await saveOrderToDB(INITIAL_ORDER)
      return [INITIAL_ORDER]
    }
    
    return orders
  } catch (error) {
    console.error('❌ Error fetching orders from database:', error)
    return [INITIAL_ORDER]
  }
}

export async function updateOrder(orderId, updates) {
  try {
    console.log('🔄 Updating order in database:', orderId, updates)
    
    const success = await updateOrderInDB(orderId, updates)
    
    if (success) {
      console.log('✅ Order updated successfully in database')
      return true
    } else {
      console.error('❌ Failed to update order in database')
      return false
    }
  } catch (error) {
    console.error('❌ Error updating order:', error)
    return false
  }
}