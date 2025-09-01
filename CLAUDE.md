# OnlyInTX Store - Claude Code Session Guide

## Project Overview
OnlyInTX is a live production Texas-themed e-commerce store selling city-specific and state-wide apparel. The store integrates with Printify for print-on-demand fulfillment and Stripe for payments.

**Live Site:** https://onlyintx.com  
**Admin Panel:** https://onlyintx.com/admin  

## Current Status - READY FOR ORDER TESTING ✅

### Recently Completed Features
- ✅ **8 City Pages** - Austin, Dallas, Houston, San Antonio, Fort Worth, El Paso, Arlington, Corpus Christi
- ✅ **Texas State Gear Section** - Dedicated /texas page with category filtering
- ✅ **Product Category Management** - Full admin system for assigning products to cities/texas
- ✅ **Custom Mockup System** - Automatic mockup loading from /mockups/ folders
- ✅ **Product Sorting System** - Manual priority-based sorting (Houston=1, Austin Loud=5)
- ✅ **Custom Slug Management** - Admin interface for SEO-friendly product URLs
- ✅ **Admin Dashboard** - Products, Categories, Orders, Slugs, Settings management

### Architecture & Integration
- **Frontend:** Next.js 14 with Tailwind CSS
- **Backend:** Printify API for products, Stripe for payments
- **Storage:** File-based with in-memory caching (Vercel serverless)
- **Deployment:** Vercel with automatic deployments from GitHub

### Key Components
- `components/CityPage.js` - Reusable city page template
- `lib/productMetadata.js` - Product categorization and sorting
- `utils/mockupMapping.js` - Custom mockup image management
- `lib/slugs.js` - Custom URL slug management

## Next Session Priorities

### 1. IMMEDIATE - Test Real Order Flow 🚨
**Priority:** CRITICAL - This is production testing
- Place actual test order end-to-end
- Verify Stripe payment processing
- Check Printify order fulfillment
- Validate order tracking in admin
- Test webhook processing

### 2. Product Category Assignment
**Location:** `/admin/categories`
- Assign existing products to appropriate categories:
  - Houston product → 'houston' category
  - Austin products → 'austin' category  
  - State-wide designs → 'texas' category
- Verify products appear on correct city/texas pages

### 3. Expand Product Catalog
- Add 2-3 new products via Printify
- Create custom mockups for new products
- Assign categories and test display

### 4. Final Polish for Launch
- Performance optimization
- SEO meta tag review
- Error handling improvements
- Marketing preparation

## Technical Context

### Product Categories System
```javascript
// Available categories (expandable)
const categories = [
  'texas',        // State-wide gear
  'austin',       // City-specific
  'dallas', 
  'houston',
  'san-antonio',
  'fort-worth',
  'el-paso', 
  'arlington',
  'corpus-christi'
]
```

### Product Metadata Structure
```javascript
// In lib/productMetadata.js
let productMetadata = {
  'productId': {
    designOrder: 1,      // For sorting (1=oldest, 5=newest)
    unitsSold: 0,        // Sales tracking
    categories: ['city'] // Category assignments
  }
}
```

### Critical Files to Know
- `/pages/texas/index.js` - Texas state gear page
- `/pages/admin/categories.js` - Category management interface
- `/pages/api/admin/categories.js` - Category API endpoints
- `/lib/productMetadata.js` - Core metadata functions
- All city pages: `/pages/[city]/index.js`

## Common Commands
```bash
# Local development
npm run dev

# Build test
npm run build

# Deploy
git add -A && git commit -m "message" && git push
```

## Known Issues & Limitations
- Printify API doesn't provide reliable creation dates
- File-based storage is ephemeral on Vercel
- Manual category assignment required for new products
- SEO: Never change existing product slugs (breaks indexing)

## IMPORTANT: Category-Based Pages Pattern 🚨

### When creating pages that filter products by categories:
**NEVER** import `getProductMetadata` directly in client-side components. This function is server-only.

**CORRECT PATTERN:**
```javascript
// Fetch categories via API endpoint
const response = await fetch('/api/admin/categories')
const categoriesData = await response.json()

// Filter products using API data
const filteredProducts = products.filter(product => {
  const metadata = categoriesData.products[product.id]
  return metadata?.categories?.includes('target-category') || false
})
```

**WRONG PATTERN:**
```javascript
import { getProductMetadata } from '../lib/productMetadata' // ❌ Server-only function
const metadata = getProductMetadata(product.id) // ❌ Breaks on client
```

### Best Sellers vs Latest Designs Logic:
- **Best Sellers:** Sort by `unitsSold` (products with sales > 0)
- **Latest Designs:** Sort by `designOrder` (newest design = highest number)
- New products have `unitsSold: 0` and should NOT appear in Best Sellers

## Success Metrics
- Real order processing works end-to-end
- Products display in correct categories
- Admin category management functional
- Site ready for marketing launch

---
**Last Updated:** Session ending 2025-08-31
**Next Session Goal:** Complete order testing and finalize for launch