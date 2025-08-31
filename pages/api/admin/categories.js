import { updateProductCategories, getProductMetadata, getAvailableCategories, getAllProductMetadata } from '../../../lib/productMetadata'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { productId } = req.query
    
    if (productId) {
      // Get categories for a specific product
      const metadata = getProductMetadata(productId)
      return res.status(200).json({ 
        categories: metadata?.categories || [],
        available: getAvailableCategories()
      })
    } else {
      // Get all product categories
      const allMetadata = getAllProductMetadata()
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
      const updatedMetadata = updateProductCategories(productId, categories)
      return res.status(200).json({ 
        success: true, 
        metadata: updatedMetadata 
      })
    } catch (error) {
      console.error('Error updating categories:', error)
      return res.status(500).json({ error: 'Failed to update categories' })
    }
  }
  
  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}