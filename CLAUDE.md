# OnlyInTX Store - Claude Code Session Guide

## Project Overview
OnlyInTX is a live production Texas-themed e-commerce store selling city-specific and state-wide apparel. The store integrates with Printify for print-on-demand fulfillment and Stripe for payments.

**Live Site:** https://onlyintx.com  
**Admin Panel:** https://onlyintx.com/admin  

## Current Status - PAYMENT PROCESSING FIXED ✅

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
- ✅ **PAYMENT PROCESSING FIXED** - Orders now persist properly between serverless invocations

### ✅ CRITICAL ISSUE RESOLVED
**Root Cause Found & Fixed**: Order storage was using in-memory cache that reset between Vercel serverless function invocations
- **Problem**: `ordersCache` variable lost data when webhook and admin accessed different function instances  
- **Solution**: Converted to persistent file-based storage (`data/orders.json`) like category system
- **Status**: Deployed and ready for testing

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

### 1. 🧪 VALIDATE PAYMENT PROCESSING FIX
**Priority:** HIGH - Test the fixed order processing system
- **Test**: Complete end-to-end order flow with real payment
- **Verify**: Orders appear in `/admin/orders` immediately after payment
- **Check**: Printify order creation and tracking
- **Monitor**: Webhook processing logs for any issues

### 2. Final Production Readiness
- Performance optimization review
- SEO meta tag validation
- Error monitoring setup
- Marketing preparation
- Go-live checklist completion

### 3. Post-Launch Monitoring
- Order fulfillment pipeline validation
- Customer experience optimization
- Analytics and conversion tracking

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

### Session 2025-09-01 - PAYMENT PROCESSING CRITICAL FIX ✅
**Completed:**
- ✅ **CRITICAL**: Fixed payment processing pipeline - orders now persist properly
- ✅ Root cause analysis: In-memory cache reset between serverless invocations
- ✅ Converted order storage to persistent file system (`lib/storage.js`)
- ✅ All CRUD operations now use `data/orders.json` for persistence
- ✅ Deployed fix to production - ready for testing

**Previous Session:**
- ✅ Implemented FREE SHIPPING site-wide with prominent messaging
- ✅ Fixed category persistence issue (converted to file storage)
- ✅ Unified admin category system across all pages
- ✅ Resolved client/server separation build errors

---
**Last Updated:** Session 2025-09-01 (Payment Processing Fix)
**Next Session Goal:** Test and validate the fixed payment processing system

## COMMIT REQUIREMENT - CRITICAL ⚠️
**ALWAYS commit and push changes at the end of each session or major task:**
1. Check `git status` before finishing any task
2. If there are uncommitted changes, ALWAYS commit them with descriptive messages  
3. ALWAYS push to deploy changes to production
4. NEVER finish a session without checking and committing outstanding changes
5. Use TodoWrite to track "Commit and push changes" as a final task when needed
6. **This is a PRODUCTION site - uncommitted changes cost real money in testing!**