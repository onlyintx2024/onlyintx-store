// Custom slug management system
// Stores custom slugs separate from Printify titles

let customSlugs = {
  // NEVER change existing product slugs - SEO disaster!
  // Only add custom slugs for NEW products going forward
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