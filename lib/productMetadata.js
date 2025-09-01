// Product metadata management - PERSISTENT FILE-BASED STORAGE
import fs from 'fs'
import path from 'path'

const METADATA_FILE = path.join(process.cwd(), 'data', 'productMetadata.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Default metadata for existing products
const DEFAULT_METADATA = {
  '68a2acaa09de3a1de90e76bc': { designOrder: 1, unitsSold: 1, categories: ['houston'] },  // Houston (oldest)
  '68a2b13ab9d87186e105fab5': { designOrder: 2, unitsSold: 2, categories: ['san-antonio'] },  // San Antonio  
  '68a2bc1b87987a828a0b6a4b': { designOrder: 3, unitsSold: 3, categories: ['dallas'] },  // Dallas
  '68a2bcee571c2c156d0885f8': { designOrder: 4, unitsSold: 4, categories: ['austin'] },  // Austin Foodie
  '68afd1f5a85dd8cf040a3818': { designOrder: 5, unitsSold: 0, categories: ['austin'] },   // Keep Austin Loud
  '68b506eb0502fbdf1c062ebc': { designOrder: 6, unitsSold: 0, categories: ['texas'] }     // Lone Star Spirit (newest)
}

// Load metadata from file
const loadMetadata = () => {
  try {
    ensureDataDir()
    if (fs.existsSync(METADATA_FILE)) {
      const data = fs.readFileSync(METADATA_FILE, 'utf8')
      return JSON.parse(data)
    }
    return DEFAULT_METADATA
  } catch (error) {
    console.error('Error loading metadata:', error)
    return DEFAULT_METADATA
  }
}

// Save metadata to file
const saveMetadata = (metadata) => {
  try {
    ensureDataDir()
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2))
    return true
  } catch (error) {
    console.error('Error saving metadata:', error)
    return false
  }
}

export function getProductMetadata(productId) {
  const metadata = loadMetadata()
  return metadata[productId] || null
}

export function setProductMetadata(productId, newData) {
  const metadata = loadMetadata()
  metadata[productId] = {
    ...metadata[productId],
    ...newData
  }
  saveMetadata(metadata)
  return metadata[productId]
}

export function getAllProductMetadata() {
  return loadMetadata()
}

export function getNextDesignOrder() {
  const metadata = loadMetadata()
  const orders = Object.values(metadata).map(p => p.designOrder || 0)
  return Math.max(...orders, 0) + 1
}

export function assignDesignOrderToNewProduct(productId) {
  const metadata = loadMetadata()
  
  if (!metadata[productId]) {
    const nextOrder = getNextDesignOrder()
    metadata[productId] = {
      designOrder: nextOrder,
      unitsSold: 0,
      categories: []
    }
    saveMetadata(metadata)
    console.log(`Auto-assigned design order ${nextOrder} to new product ${productId}`)
  }
  
  return metadata[productId]
}

export function initializeProductIfNeeded(productId) {
  const metadata = loadMetadata()
  
  if (!metadata[productId]) {
    const nextOrder = getNextDesignOrder()
    metadata[productId] = {
      designOrder: nextOrder,
      unitsSold: 0,
      categories: []
    }
    saveMetadata(metadata)
    console.log(`Initialized metadata for new product ${productId} with design order ${nextOrder}`)
  }
  
  return metadata[productId]
}

export function updateUnitsSold(productId, quantity = 1) {
  const metadata = loadMetadata()
  
  if (!metadata[productId]) {
    metadata[productId] = {
      designOrder: getNextDesignOrder(),
      unitsSold: 0,
      categories: []
    }
  }
  
  metadata[productId].unitsSold = (metadata[productId].unitsSold || 0) + quantity
  saveMetadata(metadata)
  return metadata[productId]
}

export function updateProductCategories(productId, categories) {
  const metadata = loadMetadata()
  
  if (!metadata[productId]) {
    metadata[productId] = {
      designOrder: getNextDesignOrder(),
      unitsSold: 0,
      categories: []
    }
  }
  
  metadata[productId].categories = categories || []
  saveMetadata(metadata)
  console.log(`Updated categories for product ${productId}:`, categories)
  console.log(`Saved to file: ${METADATA_FILE}`)
  return metadata[productId]
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