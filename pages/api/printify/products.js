// pages/api/printify/products.js
export default async function handler(req, res) {
  const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;
  const SHOP_ID = '18727817'; // Your OnlyInTX shop ID
  
  if (!PRINTIFY_API_KEY) {
    return res.status(500).json({ error: 'Printify API key not configured' });
  }

  const headers = {
    'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    switch (req.method) {
      case 'GET':
        // Get all products from OnlyInTX shop
        const response = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products.json`, {
          headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch products');
        }
        
        // Transform Printify data for your site
        const transformedProducts = data.data?.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description,
          tags: product.tags,
          images: product.images,
          variants: product.variants?.map(variant => ({
            id: variant.id,
            price: variant.price,
            title: variant.title,
            sku: variant.sku,
            grams: variant.grams
          })) || [],
          blueprint_id: product.blueprint_id,
          shop_id: product.shop_id,
          created_at: product.created_at,
          updated_at: product.updated_at
        })) || [];
        
        return res.status(200).json({ 
          products: transformedProducts,
          total: data.data?.length || 0 
        });

      case 'POST':
        // Create new product
        const { productData } = req.body;
        
        const createResponse = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products.json`, {
          method: 'POST',
          headers,
          body: JSON.stringify(productData)
        });
        
        const createData = await createResponse.json();
        
        if (!createResponse.ok) {
          throw new Error(createData.message || 'Failed to create product');
        }
        
        return res.status(201).json(createData);

      case 'PUT':
        // Update existing product
        const { productId, updateData } = req.body;
        
        const updateResponse = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products/${productId}.json`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updateData)
        });
        
        const updatedData = await updateResponse.json();
        
        if (!updateResponse.ok) {
          throw new Error(updatedData.message || 'Failed to update product');
        }
        
        return res.status(200).json(updatedData);

      case 'DELETE':
        // Delete product
        const { id } = req.query;
        
        const deleteResponse = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products/${id}.json`, {
          method: 'DELETE',
          headers
        });
        
        if (!deleteResponse.ok) {
          const deleteData = await deleteResponse.json();
          throw new Error(deleteData.message || 'Failed to delete product');
        }
        
        return res.status(200).json({ success: true, message: 'Product deleted' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Printify Products API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}