// utils/mockupMapping.js
// Utility functions for mapping product colors to custom mockup images

/**
 * Get the mockup image path for a specific product and color
 * @param {string} productId - The Printify product ID
 * @param {string} color - The color name from Printify
 * @param {string} size - Image size: 'thumb' (600x600) or 'full' (1200x1200)
 * @returns {string} - Path to the mockup image
 */
export function getColorMockupImage(productId, color, size = 'full') {
  if (!productId || !color) {
    return '/images/texas-default.jpg'; // Fallback image
  }

  // Normalize color name for file naming (lowercase, replace spaces with hyphens)
  const normalizedColor = normalizeColorName(color);
  
  // Construct the path to the custom mockup
  const suffix = size === 'thumb' ? '-thumb' : '';
  const mockupPath = `/mockups/product-${productId}/${normalizedColor}${suffix}.jpg`;
  
  return mockupPath;
}

/**
 * Normalize color names for consistent file naming
 * @param {string} color - Raw color name from Printify
 * @returns {string} - Normalized color name for file system
 */
export function normalizeColorName(color) {
  return color
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')   // Remove special characters
    .replace(/-+/g, '-');         // Remove duplicate hyphens
}

/**
 * Get all available mockup images for a product with their colors
 * @param {string} productId - The Printify product ID
 * @param {Array} availableColors - Array of color names from Printify
 * @param {string} size - Image size: 'thumb' or 'full'
 * @returns {Array} - Array of {color, image, thumbnail} objects
 */
export function getProductMockups(productId, availableColors, size = 'full') {
  if (!productId || !availableColors || availableColors.length === 0) {
    return [{
      color: 'Default',
      image: '/images/texas-default.jpg',
      thumbnail: '/images/texas-default.jpg'
    }];
  }

  return availableColors.map(color => ({
    color,
    image: getColorMockupImage(productId, color, 'full'),
    thumbnail: getColorMockupImage(productId, color, 'thumb'),
    normalizedName: normalizeColorName(color)
  }));
}

/**
 * Check if a custom mockup exists (client-side check)
 * This would need to be implemented with a server-side check in production
 * @param {string} imagePath - Path to the image
 * @returns {Promise<boolean>} - Whether the image exists
 */
export async function mockupExists(imagePath) {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get mockup image with fallback logic
 * @param {string} productId - The Printify product ID
 * @param {string} color - The color name
 * @param {string} size - Image size: 'thumb' or 'full'
 * @param {string} fallbackImage - Fallback image URL (usually from Printify)
 * @returns {string} - Best available image path
 */
export function getMockupWithFallback(productId, color, size = 'full', fallbackImage = null) {
  // Try custom mockup first
  const customMockup = getColorMockupImage(productId, color, size);
  
  // In a production environment, you'd check if the file exists server-side
  // For now, we'll return the custom path and let the browser handle 404s
  return customMockup;
}

/**
 * Generate mockup file naming guide for a product
 * @param {string} productId - The Printify product ID  
 * @param {Array} colors - Available colors for the product
 * @returns {Object} - Guide for organizing mockup files
 */
export function generateMockupGuide(productId, colors) {
  const folderPath = `/public/mockups/product-${productId}/`;
  
  return {
    folderPath,
    requiredFiles: colors.flatMap(color => [
      {
        color,
        type: 'Full Size',
        filename: `${normalizeColorName(color)}.jpg`,
        dimensions: '1200x1200px',
        usage: 'Product page main image',
        fullPath: `${folderPath}${normalizeColorName(color)}.jpg`
      },
      {
        color,
        type: 'Thumbnail',
        filename: `${normalizeColorName(color)}-thumb.jpg`,
        dimensions: '600x600px', 
        usage: 'Product listings, thumbnails',
        fullPath: `${folderPath}${normalizeColorName(color)}-thumb.jpg`
      }
    ]),
    instructions: [
      `1. Create folder: ${folderPath}`,
      `2. For each color, create TWO image sizes:`,
      `   • Full Size (1200x1200px): [color].jpg - for product pages`,
      `   • Thumbnail (600x600px): [color]-thumb.jpg - for listings`,
      `3. Example for Black color:`,
      `   • black.jpg (1200x1200px, 90% quality, ~150-250KB)`,
      `   • black-thumb.jpg (600x600px, 85% quality, ~50-80KB)`,
      `4. Use JPG format with appropriate compression`,
      `5. Ensure consistent lighting and product positioning across all sizes`,
      `6. Square aspect ratio (1:1) is required for both sizes`
    ],
    sizeSpecs: {
      full: {
        dimensions: '1200x1200px',
        quality: '90%',
        fileSize: '150-250KB',
        usage: 'Product page main display'
      },
      thumb: {
        dimensions: '600x600px', 
        quality: '85%',
        fileSize: '50-80KB',
        usage: 'Product listings, color thumbnails'
      }
    }
  };
}