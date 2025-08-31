// Custom slug management system
// Stores custom slugs separate from Printify titles

let customSlugs = {
  // Default custom slugs for existing products
  '68afd1f5a85dd8cf040a3818': 'keep-austin-loud',
  '68a2bcee571c2c156d0885f8': 'austin-foodie-tee',
  '68a2bc1b87987a828a0b6a4b': 'dallas-big-d-energy',
  '68a2b13ab9d87186e105fab5': 'san-antonio-alamo',
  '68a2acaa09de3a1de90e76bc': 'houston-music-lover'
}

export function getCustomSlug(productId) {
  return customSlugs[productId] || null
}

export function setCustomSlug(productId, slug) {
  // Validate slug format
  const cleanSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  
  if (!cleanSlug) {
    throw new Error('Invalid slug format')
  }
  
  // Check for duplicates
  const existingProductId = Object.keys(customSlugs).find(id => 
    id !== productId && customSlugs[id] === cleanSlug
  )
  
  if (existingProductId) {
    throw new Error(`Slug "${cleanSlug}" is already used by another product`)
  }
  
  customSlugs[productId] = cleanSlug
  return cleanSlug
}

export function getAllCustomSlugs() {
  return { ...customSlugs }
}

export function generateAutoSlug(title) {
  // Generate a clean slug from title as fallback
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Keep reasonable length
}

export function getProductSlug(productId, title) {
  // First try custom slug, then generate from title
  return getCustomSlug(productId) || generateAutoSlug(title)
}

export function removeCustomSlug(productId) {
  delete customSlugs[productId]
}