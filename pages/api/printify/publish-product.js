// pages/api/printify/publish-product.js
import { requireAuth } from '../../../utils/auth'

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const shopId = '18727817'; // Your shop ID
    const token = process.env.PRINTIFY_API_TOKEN;
    
    if (!token) {
      throw new Error('PRINTIFY_API_TOKEN not found in environment variables');
    }

    console.log(`Publishing product ${productId} to shop ${shopId}`);
    
    const response = await fetch(`https://api.printify.com/v1/shops/${shopId}/products/${productId}/publish.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: true,      // Use Printify title
        description: true, // Use Printify description  
        images: true,     // Use Printify images
        variants: true,   // Use Printify variants
        tags: true,       // Use Printify tags
        keyFeatures: true,
        seoTitle: true,
        seoDescription: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printify publish error:', response.status, errorText);
      throw new Error(`Printify API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Product published successfully:', data);

    res.status(200).json({
      success: true,
      message: 'Product published successfully',
      data
    });

  } catch (error) {
    console.error('Error publishing product:', error);
    res.status(500).json({ 
      error: 'Failed to publish product',
      details: error.message 
    });
  }
})