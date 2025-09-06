import { neon } from '@neondatabase/serverless'

// Use the STORAGE_URL environment variable from Vercel integration
const sql = neon(process.env.STORAGE_URL)

// Initialize the orders and product_metadata tables
export async function initializeDatabase() {
  try {
    // Create orders table
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
    
    // Create product metadata table
    await sql`
      CREATE TABLE IF NOT EXISTS product_metadata (
        product_id VARCHAR(255) PRIMARY KEY,
        design_order INTEGER DEFAULT 1,
        units_sold INTEGER DEFAULT 0,
        categories JSONB DEFAULT '[]'::jsonb,
        custom_description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    
    console.log('✅ Database tables initialized successfully')
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

// Product metadata database functions
export async function getProductMetadataFromDB() {
  try {
    await initializeDatabase() // Ensure table exists
    
    const metadata = await sql`
      SELECT * FROM product_metadata
    `
    
    // Transform to the expected format
    const result = {}
    metadata.forEach(row => {
      result[row.product_id] = {
        designOrder: row.design_order,
        unitsSold: row.units_sold,
        categories: row.categories || [],
        customDescription: row.custom_description
      }
    })
    
    return result
  } catch (error) {
    console.error('❌ Error fetching product metadata from database:', error)
    return {}
  }
}

export async function saveProductMetadataToDB(productId, metadata) {
  try {
    await initializeDatabase() // Ensure table exists
    
    await sql`
      INSERT INTO product_metadata (
        product_id, design_order, units_sold, categories, custom_description, updated_at
      ) VALUES (
        ${productId},
        ${metadata.designOrder || 1},
        ${metadata.unitsSold || 0},
        ${JSON.stringify(metadata.categories || [])},
        ${metadata.customDescription || null},
        NOW()
      )
      ON CONFLICT (product_id) 
      DO UPDATE SET
        design_order = EXCLUDED.design_order,
        units_sold = EXCLUDED.units_sold,
        categories = EXCLUDED.categories,
        custom_description = EXCLUDED.custom_description,
        updated_at = NOW()
    `
    
    console.log('✅ Product metadata saved to database:', productId)
    return true
  } catch (error) {
    console.error('❌ Error saving product metadata to database:', error)
    return false
  }
}