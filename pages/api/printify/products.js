// pages/api/printify/products.js
import { getProductSlug } from '../../../lib/slugs'

export default async function handler(req, res) {
  const PRINTIFY_API_KEY = process.env.PRINTIFY_API_TOKEN;
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
        
        // Generate SEO-friendly slug from product title
        const generateSlug = (title) => {
          return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Remove duplicate hyphens
            .substring(0, 100); // Limit length to 100 chars
        };

        // Get detailed product info including creation dates
        const detailedProducts = await Promise.all(
          (data.data || []).map(async (product) => {
            try {
              // Fetch individual product details to get creation date
              const detailResponse = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products/${product.id}.json`, {
                headers
              });
              
              if (detailResponse.ok) {
                const detailData = await detailResponse.json();
                return {
                  ...product,
                  created_at: detailData.created_at,
                  updated_at: detailData.updated_at
                };
              }
            } catch (error) {
              console.error(`Failed to fetch details for product ${product.id}:`, error);
            }
            
            // Return original product if detail fetch fails
            return product;
          })
        );

        // Transform Printify data for your site
        const transformedProducts = detailedProducts.map(product => ({
          id: product.id,
          title: product.title,
          slug: getProductSlug(product.id, product.title),
          description: product.description,
          tags: product.tags,
          images: product.images,
          variants: product.variants?.map(variant => ({
            id: variant.id,
            price: variant.price,
            title: variant.title,
            sku: variant.sku,
            grams: variant.grams,
            is_enabled: variant.is_enabled
          })) || [],
          blueprint_id: product.blueprint_id,
          shop_id: product.shop_id,
          created_at: product.created_at,
          updated_at: product.updated_at,
          visible: product.visible
        }));
        
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
        
        console.log('Updating product:', productId);
        console.log('Update data:', JSON.stringify(updateData, null, 2));
        
        // First, get the current product to preserve existing data
        const currentProductResponse = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products/${productId}.json`, {
          headers
        });
        
        if (!currentProductResponse.ok) {
          throw new Error('Failed to fetch current product data');
        }
        
        const currentProduct = await currentProductResponse.json();
        console.log('Current product variants:', currentProduct.variants.length);
        
        // Prepare the update payload - only update variants that we're changing
        const updatePayload = {
          ...updateData,
          // Ensure we keep the existing structure
          variants: updateData.variants?.map(updatedVariant => {
            const existingVariant = currentProduct.variants.find(v => v.id === updatedVariant.id);
            return {
              id: updatedVariant.id,
              price: updatedVariant.price,
              is_enabled: updatedVariant.is_enabled !== undefined ? updatedVariant.is_enabled : (existingVariant?.is_enabled || true)
            };
          }) || currentProduct.variants
        };
        
        console.log('Final payload to Printify:', JSON.stringify(updatePayload, null, 2));
        
        const updateResponse = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products/${productId}.json`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatePayload)
        });
        
        const responseText = await updateResponse.text();
        console.log('Printify response text:', responseText);
        
        let updatedData;
        try {
          updatedData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse Printify response:', parseError);
          throw new Error(`Invalid response from Printify: ${responseText}`);
        }
        
        if (!updateResponse.ok) {
          console.error('Printify API error:', updatedData);
          throw new Error(updatedData.message || `Printify API error: ${updateResponse.status}`);
        }
        
        return res.status(200).json(updatedData);
        case 'PATCH':
        // Handle special actions like unpublish
        const { productId: patchProductId, action } = req.body;
        
        if (action === 'unpublish') {
          console.log('Unpublishing product:', patchProductId);
          
          const unpublishResponse = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products/${patchProductId}/unpublish.json`, {
            method: 'POST',
            headers
          });
          
          const unpublishText = await unpublishResponse.text();
          console.log('Unpublish response:', unpublishText);
          
          if (!unpublishResponse.ok) {
            let unpublishData;
            try {
              unpublishData = JSON.parse(unpublishText);
            } catch {
              unpublishData = { message: unpublishText };
            }
            throw new Error(unpublishData.message || 'Failed to unpublish product');
          }
          
          return res.status(200).json({ success: true, message: 'Product unpublished' });
        }
        
        return res.status(400).json({ error: 'Invalid action' });

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
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Printify Products API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    });
  }
}