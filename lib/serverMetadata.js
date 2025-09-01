// Server-only file operations for product metadata
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
  '68a2acaa09de3a1de90e76bc': { designOrder: 1, unitsSold: 1, categories: ['houston'] },
  '68a2b13ab9d87186e105fab5': { designOrder: 2, unitsSold: 2, categories: ['san-antonio'] },
  '68a2bc1b87987a828a0b6a4b': { designOrder: 3, unitsSold: 3, categories: ['dallas'] },
  '68a2bcee571c2c156d0885f8': { designOrder: 4, unitsSold: 4, categories: ['austin'] },
  '68afd1f5a85dd8cf040a3818': { designOrder: 5, unitsSold: 0, categories: ['austin'] },
  '68b506eb0502fbdf1c062ebc': { designOrder: 6, unitsSold: 0, categories: ['texas'] }
}

// Load metadata from file
export const loadMetadata = () => {
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
export const saveMetadata = (metadata) => {
  try {
    ensureDataDir()
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2))
    return true
  } catch (error) {
    console.error('Error saving metadata:', error)
    return false
  }
}

// Server-only metadata functions
export const getProductMetadataServer = (productId) => {
  const metadata = loadMetadata()
  return metadata[productId] || null
}

export const updateProductCategoriesServer = (productId, categories) => {
  const metadata = loadMetadata()
  
  if (!metadata[productId]) {
    const orders = Object.values(metadata).map(p => p.designOrder || 0)
    const nextOrder = Math.max(...orders, 0) + 1
    metadata[productId] = {
      designOrder: nextOrder,
      unitsSold: 0,
      categories: []
    }
  }
  
  metadata[productId].categories = categories || []
  saveMetadata(metadata)
  console.log(`Updated categories for product ${productId}:`, categories)
  return metadata[productId]
}

export const getAllProductMetadataServer = () => {
  return loadMetadata()
}