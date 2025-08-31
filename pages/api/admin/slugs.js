import { requireAuth } from '../../../utils/auth'
import { getCustomSlug, setCustomSlug, getAllCustomSlugs, removeCustomSlug } from '../../../lib/slugs'

export default requireAuth(async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const slugs = getAllCustomSlugs()
        return res.status(200).json({ slugs })
      } catch (error) {
        console.error('Error fetching slugs:', error)
        return res.status(500).json({ error: 'Failed to fetch slugs' })
      }
      
    case 'PUT':
      try {
        const { productId, slug } = req.body
        
        if (!productId) {
          return res.status(400).json({ error: 'Product ID is required' })
        }
        
        if (!slug || slug.trim() === '') {
          // Remove custom slug if empty
          removeCustomSlug(productId)
          return res.status(200).json({ 
            success: true, 
            message: 'Custom slug removed',
            slug: null 
          })
        }
        
        const cleanSlug = setCustomSlug(productId, slug)
        return res.status(200).json({ 
          success: true, 
          slug: cleanSlug,
          message: 'Slug updated successfully'
        })
      } catch (error) {
        console.error('Error updating slug:', error)
        return res.status(400).json({ 
          error: error.message || 'Failed to update slug' 
        })
      }
      
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
})