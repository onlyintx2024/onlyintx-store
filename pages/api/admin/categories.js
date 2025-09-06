import { getAvailableCategories } from '../../../lib/productMetadata'
import { updateProductCategoriesServer, getProductMetadataServer, getAllProductMetadataServer, loadMetadata, saveMetadata } from '../../../lib/serverMetadata'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { productId } = req.query
    
    if (productId) {
      // Get categories for a specific product
      const metadata = getProductMetadataServer(productId)
      return res.status(200).json({ 
        categories: metadata?.categories || [],
        available: getAvailableCategories()
      })
    } else {
      // Get all product categories, but first sync with current Printify products
      try {
        // Fetch current products from Printify to ensure all are initialized
        const printifyResponse = await fetch(`${process.env.PRINTIFY_API_BASE}/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (printifyResponse.ok) {
          const printifyData = await printifyResponse.json()
          const metadata = loadMetadata()
          let hasChanges = false
          
          // Initialize any new products that don't have metadata yet
          printifyData.data?.forEach(product => {
            if (!metadata[product.id]) {
              const orders = Object.values(metadata).map(p => p.designOrder || 0)
              const nextOrder = Math.max(...orders, 0) + 1
              metadata[product.id] = {
                designOrder: nextOrder,
                unitsSold: 0,
                categories: []
              }
              hasChanges = true
              console.log(`Auto-initialized product ${product.id} with design order ${nextOrder}`)
            }
          })
          
          if (hasChanges) {
            saveMetadata(metadata)
          }
        }
      } catch (error) {
        console.warn('Could not sync with Printify products:', error)
        // Continue anyway with existing metadata
      }
      
      const allMetadata = getAllProductMetadataServer()
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
      const updatedMetadata = updateProductCategoriesServer(productId, categories)
      console.log(`✅ CATEGORIES SAVED: ${JSON.stringify(updatedMetadata)}`)
      
      return res.status(200).json({ 
        success: true, 
        metadata: updatedMetadata 
      })
    } catch (error) {
      console.error('❌ ERROR updating categories:', error)
      return res.status(500).json({ error: 'Failed to update categories', details: error.message })
    }
  }
  
  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}