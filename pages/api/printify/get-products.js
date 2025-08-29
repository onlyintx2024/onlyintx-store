// pages/api/printify/get-products.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const shopId = '18727817'; // Your shop ID
    
    // Debug token
    const token = process.env.PRINTIFY_API_TOKEN;
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length);
    console.log('Token starts with:', token?.substring(0, 10) + '...');
    
    if (!token) {
      throw new Error('PRINTIFY_API_TOKEN not found in environment variables');
    }
    
    const response = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Log products for debugging
    console.log('Shop Products:', JSON.stringify(data, null, 2));
    
    // Format response to show key info
    const products = data.data?.map(product => ({
      id: product.id,
      title: product.title,
      status: product.status,
      variants: product.variants?.length || 0,
      created_at: product.created_at
    })) || [];

    res.status(200).json({
      success: true,
      products,
      total: data.data?.length || 0
    });

  } catch (error) {
    console.error('Error fetching shop products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error.message 
    });
  }
}