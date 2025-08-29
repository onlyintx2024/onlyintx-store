// pages/api/printify/product-details.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Product ID or slug is required' });
  }

  // If the id looks like a slug (contains letters/hyphens), we need to find the actual product ID
  let productId = id;
  
  // Check if this is a slug (contains non-numeric characters other than just numbers)
  if (isNaN(id) || id.includes('-')) {
    // This is a slug, we need to fetch all products first to find the matching ID
    try {
      const allProductsResponse = await fetch(`https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID || '18727817'}/products.json`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (allProductsResponse.ok) {
        const allProducts = await allProductsResponse.json();
        
        // Generate slug for each product and find the match
        const generateSlug = (title) => {
          return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 50);
        };

        const matchingProduct = allProducts.data?.find(product => 
          generateSlug(product.title) === id
        );

        if (matchingProduct) {
          productId = matchingProduct.id;
        } else {
          return res.status(404).json({ error: 'Product not found' });
        }
      }
    } catch (slugError) {
      console.error('Error finding product by slug:', slugError);
      // Fall back to treating it as an ID
    }
  }

  try {
    const shopId = '18727817';
    const token = process.env.PRINTIFY_API_TOKEN;
    
    if (!token) {
      throw new Error('PRINTIFY_API_TOKEN not found in environment variables');
    }

    // Get individual product with full details including variant images
    const response = await fetch(`https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.status}`);
    }

    const product = await response.json();
    
    // Enhanced variant parsing using SKU and title
    const parseVariantDetails = (variant) => {
      const title = variant.title;
      const sku = variant.sku;
      
      // Debug logging
      console.log('Parsing variant:', { title, sku, enabled: variant.is_enabled });
      
      // Split title by common delimiters
      const parts = title.split(' / ');
      
      let color = 'Unknown';
      let size = 'Standard';
      
      // Your 6 t-shirt sizes (including all possible Printify variations)
      const allPossibleSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL', '4XL', '5XL'];
      const yourDesiredSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
      
      // Extract size (check all parts for size matches, convert to your desired format)
      parts.forEach(part => {
        const trimmedPart = part.trim().toUpperCase();
        if (allPossibleSizes.includes(trimmedPart)) {
          // Convert XXL -> 2XL and XXXL -> 3XL if needed
          if (trimmedPart === 'XXL') {
            size = '2XL';
          } else if (trimmedPart === 'XXXL') {
            size = '3XL';
          } else if (yourDesiredSizes.includes(trimmedPart)) {
            size = trimmedPart;
          }
        }
      });
      
      // Extract color (find the non-size, non-product-type part)
      parts.forEach(part => {
        const trimmedPart = part.trim();
        const upperPart = trimmedPart.toUpperCase();
        
        // Skip if it's ANY size, or common product type words
        if (!allPossibleSizes.includes(upperPart) && 
            !upperPart.includes('UNISEX') && 
            !upperPart.includes('T-SHIRT') && 
            !upperPart.includes('SHIRT') &&
            !upperPart.includes('HOODIE') &&
            !upperPart.includes('TANK') &&
            trimmedPart.length > 0) {
          color = trimmedPart;
        }
      });
      
      // Debug the results
      console.log('Parsed result:', { color, size, sku: sku || `${variant.id}` });
      
      return { 
        color, 
        size, 
        sku: sku || `${variant.id}` // Use SKU as unique identifier
      };
    };

    // Generate SEO-friendly slug from product title
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .substring(0, 50); // Limit length
    };

    // Transform the product data with enhanced variant parsing
    const transformedProduct = {
      id: product.id,
      title: product.title,
      slug: generateSlug(product.title),
      description: product.description,
      tags: product.tags,
      images: product.images,
      variants: product.variants?.map(variant => {
        const { color, size, sku } = parseVariantDetails(variant);
        
        return {
          id: variant.id,
          price: variant.price,
          title: variant.title,
          sku: sku,
          grams: variant.grams,
          is_enabled: variant.is_enabled,
          color: color,
          size: size
        };
      }) || [],
      blueprint_id: product.blueprint_id,
      shop_id: product.shop_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
      visible: product.visible,
      status: product.status || 'draft'
    };

    // Filter to only ENABLED variants for this specific product
    const enabledVariants = transformedProduct.variants.filter(v => v.is_enabled === true);
    
    // Get only colors and sizes that are actually available for this product
    const availableColorOptions = [...new Set(enabledVariants.map(v => v.color))];
    const availableSizeOptions = [...new Set(enabledVariants.map(v => v.size))];
    
    // Filter to only your 6 t-shirt sizes that are actually available
    const yourTshirtSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    const sizeOptions = availableSizeOptions.filter(size => 
      yourTshirtSizes.includes(size.toUpperCase())
    ).sort((a, b) => {
      const sizeOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
      return sizeOrder.indexOf(a.toUpperCase()) - sizeOrder.indexOf(b.toUpperCase());
    });

    res.status(200).json({
      success: true,
      product: transformedProduct,
      colorOptions: availableColorOptions,
      sizeOptions
    });

  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch product details',
      details: error.message 
    });
  }
}