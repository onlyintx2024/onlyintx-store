// Product metadata management - CLIENT-SAFE VERSION
// File operations moved to server-side API endpoints

// Default metadata for existing products (fallback only)
const DEFAULT_METADATA = {
  '68a2acaa09de3a1de90e76bc': { designOrder: 1, unitsSold: 1, categories: ['houston'] },  // Houston (oldest)
  '68a2b13ab9d87186e105fab5': { designOrder: 2, unitsSold: 2, categories: ['san-antonio'] },  // San Antonio  
  '68a2bc1b87987a828a0b6a4b': { designOrder: 3, unitsSold: 3, categories: ['dallas'] },  // Dallas
  '68a2bcee571c2c156d0885f8': { designOrder: 4, unitsSold: 4, categories: ['austin'] },  // Austin Foodie
  '68afd1f5a85dd8cf040a3818': { designOrder: 5, unitsSold: 0, categories: ['austin'] },   // Keep Austin Loud
  '68b506eb0502fbdf1c062ebc': { designOrder: 6, unitsSold: 0, categories: ['texas'] }     // Lone Star Spirit (newest)
}

// Client-safe functions - for use in browser/client-side code
// These work with the default data and don't perform file operations

export function getProductMetadata(productId) {
  return DEFAULT_METADATA[productId] || null
}

export function getAllProductMetadata() {
  return { ...DEFAULT_METADATA }
}

export function getNextDesignOrder() {
  const orders = Object.values(DEFAULT_METADATA).map(p => p.designOrder || 0)
  return Math.max(...orders, 0) + 1
}

export function assignDesignOrderToNewProduct(productId) {
  // Client-side version - returns default structure
  if (!DEFAULT_METADATA[productId]) {
    const nextOrder = getNextDesignOrder()
    return {
      designOrder: nextOrder,
      unitsSold: 0,
      categories: []
    }
  }
  
  return DEFAULT_METADATA[productId]
}

// Legacy functions for backward compatibility
export function setProductMetadata(productId, newData) {
  console.warn('setProductMetadata called on client - use API instead')
  return DEFAULT_METADATA[productId] || null
}

export function initializeProductIfNeeded(productId) {
  return assignDesignOrderToNewProduct(productId)
}

export function updateUnitsSold(productId, quantity = 1) {
  console.warn('updateUnitsSold called on client - use API instead')
  return DEFAULT_METADATA[productId] || null
}

export function updateProductCategories(productId, categories) {
  console.warn('updateProductCategories called on client - use API instead')
  return DEFAULT_METADATA[productId] || null
}

export function getAvailableCategories() {
  return [
    'texas',      // State-wide Texas gear
    'austin',     // Austin city-specific
    'dallas',     // Dallas city-specific  
    'houston',    // Houston city-specific
    'san-antonio', // San Antonio city-specific
    'fort-worth', // Fort Worth city-specific
    'el-paso',    // El Paso city-specific
    'arlington',  // Arlington city-specific
    'corpus-christi' // Corpus Christi city-specific
  ]
}