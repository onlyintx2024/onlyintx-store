# OnlyInTX Store - Claude Code Session Guide

## Project Overview
OnlyInTX is a live production Texas-themed e-commerce store selling city-specific and state-wide apparel. The store integrates with Printify for print-on-demand fulfillment and Stripe for payments.

**Live Site:** https://onlyintx.com  
**Admin Panel:** https://onlyintx.com/admin  

## Current Status - PAYMENT PROCESSING ISSUE ⚠️

### Recently Completed Features
- ✅ **FREE SHIPPING EVERYWHERE** - Eliminated all shipping costs, prominent messaging site-wide
- ✅ **Category Persistence Fixed** - Categories now save permanently via file storage
- ✅ **Admin System Unified** - All admin pages sync category data properly  
- ✅ **8 City Pages** - Austin, Dallas, Houston, San Antonio, Fort Worth, El Paso, Arlington, Corpus Christi
- ✅ **Texas State Gear Section** - Dedicated /texas page with category filtering
- ✅ **Product Category Management** - Full admin system for assigning products to cities/texas
- ✅ **Custom Mockup System** - Automatic mockup loading from /mockups/ folders
- ✅ **Product Sorting System** - Manual priority-based sorting (Houston=1, Austin Loud=5)
- ✅ **Custom Slug Management** - Admin interface for SEO-friendly product URLs
- ✅ **Admin Dashboard** - Products, Categories, Orders, Slugs, Settings management

### ⚠️ CRITICAL ISSUE IDENTIFIED
**Payment Processing Broken**: Stripe payments go through but orders don't appear in admin/Printify

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

### 1. 🚨 CRITICAL - Fix Payment Processing Pipeline
**Priority:** URGENT - Orders not being created despite successful Stripe payments
- **Issue**: Stripe payment succeeded but no orders in admin/Printify
- **Investigate**: Webhook processing (`/api/stripe/webhook.js`)
- **Check**: Order creation flow from payment to Printify
- **Verify**: Stripe webhook configuration and endpoints
- **Test**: Complete end-to-end order flow again

### 2. Complete Order System Validation  
- Ensure orders appear in `/admin/orders`
- Verify Printify order creation
- Test order tracking and fulfillment
- Validate webhook processing logs

### 3. Final Launch Preparation
- Performance optimization
- SEO meta tag review  
- Marketing preparation
- Go-live checklist

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

## Session History

### Session 2025-09-01 - FREE SHIPPING & CATEGORY FIXES ✅
**Completed:**
- ✅ Implemented FREE SHIPPING site-wide with prominent messaging
- ✅ Fixed category persistence issue (converted to file storage)
- ✅ Unified admin category system across all pages
- ✅ Resolved client/server separation build errors

**Critical Issue Discovered:** 
- ⚠️ Payment processing broken - Stripe payments succeed but no orders created

---
**Last Updated:** Session ending 2025-09-01
**Next Session Goal:** Fix payment processing pipeline and complete order testing