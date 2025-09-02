import { neon } from '@neondatabase/serverless'

// Use the STORAGE_URL environment variable from Vercel integration
const sql = neon(process.env.STORAGE_URL)

// Initialize the orders table
export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        payment_id VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        items JSONB NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'paid',
        printify_order_ids JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Orders table initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    return false
  }
}

// Save order to database
export async function saveOrderToDB(order) {
  try {
    await initializeDatabase() // Ensure table exists
    
    await sql`
      INSERT INTO orders (
        id, payment_id, customer_email, customer_name, 
        items, amount, status, printify_order_ids, created_at
      ) VALUES (
        ${order.id}, 
        ${order.paymentId}, 
        ${order.customer.email}, 
        ${order.customer.name},
        ${JSON.stringify(order.items)}, 
        ${order.amount}, 
        ${order.status}, 
        ${JSON.stringify(order.printifyOrderIds || [])},
        ${order.createdAt}
      )
    `
    console.log('✅ Order saved to database:', order.id)
    return true
  } catch (error) {
    console.error('❌ Error saving order to database:', error)
    return false
  }
}

// Get all orders from database
export async function getOrdersFromDB() {
  try {
    await initializeDatabase() // Ensure table exists
    
    const orders = await sql`
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT 50
    `
    
    // Transform database rows back to order format
    return orders.map(row => ({
      id: row.id,
      paymentId: row.payment_id,
      customer: {
        email: row.customer_email,
        name: row.customer_name
      },
      items: row.items,
      amount: parseFloat(row.amount),
      status: row.status,
      printifyOrderIds: row.printify_order_ids || [],
      createdAt: row.created_at
    }))
  } catch (error) {
    console.error('❌ Error fetching orders from database:', error)
    return []
  }
}

// Update order in database
export async function updateOrderInDB(orderId, updates) {
  try {
    const setParts = []
    const values = [orderId]
    let paramCount = 2
    
    if (updates.status) {
      setParts.push(`status = $${paramCount}`)
      values.push(updates.status)
      paramCount++
    }
    
    if (updates.printifyOrderIds) {
      setParts.push(`printify_order_ids = $${paramCount}`)
      values.push(JSON.stringify(updates.printifyOrderIds))
      paramCount++
    }
    
    if (setParts.length === 0) return false
    
    await sql`
      UPDATE orders 
      SET ${sql(setParts.join(', '))}
      WHERE id = ${orderId}
    `
    
    console.log('✅ Order updated in database:', orderId)
    return true
  } catch (error) {
    console.error('❌ Error updating order in database:', error)
    return false
  }
}