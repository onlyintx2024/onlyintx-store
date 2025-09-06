import { getProductMetadataFromDB, saveProductMetadataToDB } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔧 Fixing design orders based on Printify creation dates...')
    
    // Fetch all products from Printify
    const printifyResponse = await fetch(`https://api.printify.com/v1/shops/18727817/products.json`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!printifyResponse.ok) {
      throw new Error('Failed to fetch products from Printify')
    }

    const printifyData = await printifyResponse.json()
    const products = printifyData.data || []

    // Sort products by creation date (oldest first)
    const sortedProducts = products.sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return dateA - dateB
    })

    // Get current metadata from database
    const currentMetadata = await getProductMetadataFromDB()

    console.log('📊 Products sorted by creation date:')
    
    // Assign design orders: 1 = oldest, highest number = newest
    let updatedCount = 0
    for (let i = 0; i < sortedProducts.length; i++) {
      const product = sortedProducts[i]
      const designOrder = i + 1 // 1-based indexing
      
      const currentMeta = currentMetadata[product.id] || {}
      const updatedMetadata = {
        designOrder,
        unitsSold: currentMeta.unitsSold || 0,
        categories: currentMeta.categories || [],
        customDescription: currentMeta.customDescription || null
      }
      
      await saveProductMetadataToDB(product.id, updatedMetadata)
      updatedCount++
      
      console.log(`${designOrder}: ${product.title} (Created: ${product.created_at})`)
    }

    console.log(`✅ Fixed design orders for ${updatedCount} products`)

    return res.status(200).json({
      success: true,
      message: `Fixed design orders for ${updatedCount} products`,
      totalProducts: products.length,
      oldestProduct: sortedProducts[0]?.title,
      newestProduct: sortedProducts[sortedProducts.length - 1]?.title
    })

  } catch (error) {
    console.error('❌ Error fixing design orders:', error)
    return res.status(500).json({ 
      error: 'Failed to fix design orders',
      details: error.message 
    })
  }
}