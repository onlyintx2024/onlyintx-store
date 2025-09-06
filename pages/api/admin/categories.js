import { getAvailableCategories } from '../../../lib/productMetadata'
import { getProductMetadataFromDB, saveProductMetadataToDB } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { productId } = req.query
    
    if (productId) {
      // Get categories for a specific product
      const allMetadata = await getProductMetadataFromDB()
      const metadata = allMetadata[productId]
      return res.status(200).json({ 
        categories: metadata?.categories || [],
        available: getAvailableCategories()
      })
    } else {
      // Get all product categories from database
      const allMetadata = await getProductMetadataFromDB()
      
      // Sync with current Printify products to initialize new ones
      try {
        const printifyResponse = await fetch(`https://api.printify.com/v1/shops/18727817/products.json`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (printifyResponse.ok) {
          const printifyData = await printifyResponse.json()
          
          // Initialize any new products that don't have metadata yet
          for (const product of printifyData.data || []) {
            if (!allMetadata[product.id]) {
              const existingOrders = Object.values(allMetadata).map(p => p.designOrder || 0)
              const nextOrder = Math.max(...existingOrders, 0) + 1
              
              const newMetadata = {
                designOrder: nextOrder,
                unitsSold: 0,
                categories: []
              }
              
              await saveProductMetadataToDB(product.id, newMetadata)
              allMetadata[product.id] = newMetadata
              console.log(`Auto-initialized product ${product.id} with design order ${nextOrder}`)
            }
          }
        }
      } catch (error) {
        console.warn('Could not sync with Printify products:', error)
      }
      
      return res.status(200).json({ 
        products: allMetadata,
        available: getAvailableCategories()
      })
    }
  }
  
  if (req.method === 'PUT') {
    const { productId, categories } = req.body
    
    if (!productId || !Array.isArray(categories)) {
      return res.status(400).json({ error: 'Product ID and categories array required' })
    }
    
    try {
      console.log(`🔧 UPDATING CATEGORIES: Product ${productId} -> ${JSON.stringify(categories)}`)
      
      // Get current metadata or create new
      const allMetadata = await getProductMetadataFromDB()
      const currentMetadata = allMetadata[productId] || {
        designOrder: 1,
        unitsSold: 0,
        categories: []
      }
      
      // Update categories
      const updatedMetadata = {
        ...currentMetadata,
        categories: categories
      }
      
      // Save to database
      const success = await saveProductMetadataToDB(productId, updatedMetadata)
      
      if (success) {
        console.log(`✅ CATEGORIES SAVED TO DATABASE: ${JSON.stringify(updatedMetadata)}`)
        return res.status(200).json({ 
          success: true, 
          metadata: updatedMetadata 
        })
      } else {
        throw new Error('Failed to save to database')
      }
    } catch (error) {
      console.error('❌ ERROR updating categories:', error)
      return res.status(500).json({ error: 'Failed to update categories', details: error.message })
    }
  }
  
  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}