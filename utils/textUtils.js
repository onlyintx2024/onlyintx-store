/**
 * Clean HTML content and decode entities for safe display
 * Use this function for all product descriptions across the site
 */
export function cleanHTML(htmlString) {
  if (!htmlString) return ''
  
  return htmlString
    // First pass: decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')      // Em dash
    .replace(/&ndash;/g, '–')      // En dash
    .replace(/&ldquo;/g, '"')      // Left double quote
    .replace(/&rdquo;/g, '"')      // Right double quote
    .replace(/&lsquo;/g, ''')      // Left single quote
    .replace(/&rsquo;/g, ''')      // Right single quote
    .replace(/&hellip;/g, '…')     // Ellipsis
    // Second pass: remove ALL HTML tags
    .replace(/<\/?[^>]+(>|$)/g, '')  // Standard HTML tags
    .replace(/&lt;\/?[^&]*&gt;/g, '') // Encoded HTML tags like &lt;p&gt;
    .replace(/<[^>]*>/g, '')         // Any remaining tags
    // Third pass: normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Get safe product description with fallback
 */
export function getProductDescription(product, fallbackText = 'Premium quality apparel') {
  const cleaned = cleanHTML(product?.description)
  return cleaned || fallbackText
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}