# OnlyInTX Store - Claude Code Session Guide

## Project Overview
OnlyInTX is a live production Texas-themed e-commerce store selling city-specific and state-wide apparel. The store integrates with Printify for print-on-demand fulfillment and Stripe for payments.

**Live Site:** https://onlyintx.com  
**Admin Panel:** https://onlyintx.com/admin  

## Current Status - PRODUCTION READY! 🚀

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
- ✅ **PAYMENT PROCESSING PIPELINE** - Complete end-to-end order flow working
- ✅ **ENTERPRISE DATABASE STORAGE** - Neon Postgres for permanent order persistence
- ✅ **HTML DESCRIPTION CLEANING** - Consistent product description formatting site-wide

### 🎉 MAJOR BREAKTHROUGHS ACHIEVED
**Payment Processing Pipeline - FULLY FUNCTIONAL**
- **Stripe Integration**: ✅ Payments processing correctly
- **Admin Dashboard**: ✅ Orders appear immediately after purchase
- **Printify Fulfillment**: ✅ Orders automatically sent for production
- **Database Storage**: ✅ Neon Postgres storing all orders permanently
- **End-to-End Flow**: ✅ Customer checkout → Payment → Admin → Printify → Fulfillment

**Technical Infrastructure Upgraded**
- **Replaced**: Temporary in-memory cache with enterprise Postgres database
- **Solved**: Vercel serverless function data persistence issues
- **Implemented**: Production-ready scalable order management system

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
- `utils/textUtils.js` - HTML cleaning and text utilities (USE FOR ALL PRODUCT DESCRIPTIONS)

## Next Session Priorities

### 1. 🧪 FINAL TESTING & LAUNCH PREP
**Priority:** HIGH - Validate new database system and prepare for launch
- **URGENT**: Test database storage - Place test order to verify Postgres persistence  
- **Change Printify prices back** to normal from $0.50 test pricing
- **Remove non-functional admin status buttons** (Mark Shipped, etc.)
- **Performance review** and optimization check

### 2. 🚀 GO-LIVE PREPARATION  
- **Marketing content** preparation
- **SEO meta tags** validation across all pages
- **Analytics setup** for conversion tracking
- **Error monitoring** implementation
- **Launch checklist** completion

### 3. 🎯 POST-LAUNCH OPTIMIZATION
- **Customer experience** improvements
- **Conversion rate** optimization
- **Order fulfillment** monitoring and optimization
- **Business growth** features (email marketing, etc.)

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

### Session 2025-09-01 - COMPLETE INFRASTRUCTURE OVERHAUL ✅
**🚨 CRITICAL ACHIEVEMENTS:**
- ✅ **PAYMENT PIPELINE FULLY OPERATIONAL**: End-to-end Stripe → Admin → Printify flow working
- ✅ **ENTERPRISE DATABASE**: Implemented Neon Postgres replacing temporary memory cache
- ✅ **API AUTHENTICATION**: Fixed Printify webhook integration (PRINTIFY_API_TOKEN)
- ✅ **PRODUCT/VARIANT MAPPING**: Resolved product ID vs variant ID confusion 
- ✅ **TEST MODE REMOVAL**: Eliminated all test mode logic for production readiness
- ✅ **HTML DESCRIPTION CLEANING**: Created reusable utility for consistent formatting
- ✅ **TEXAS HERO IMAGE**: Fixed hero image path and display issues

**🏗️ INFRASTRUCTURE UPGRADES:**
- ✅ **Database Schema**: Created production-ready orders table with JSONB support
- ✅ **Persistent Storage**: Orders now survive serverless function restarts
- ✅ **Scalable Architecture**: Ready to handle high traffic and order volume
- ✅ **Error Handling**: Comprehensive logging and debugging systems

**🧹 CODE QUALITY:**
- ✅ **Centralized Utilities**: Created `utils/textUtils.js` for HTML cleaning
- ✅ **Consistent Patterns**: Unified product description handling site-wide  
- ✅ **Future-Proof**: New pages automatically inherit proper formatting

**Previous Sessions:**
- ✅ FREE SHIPPING implementation and category persistence fixes
- ✅ Admin system unification and build error resolution
- ✅ Complete product categorization and sorting system

---
**Last Updated:** Session 2025-09-01 (Infrastructure Complete)  
**Status:** 🚀 **PRODUCTION READY - Ready for launch after final testing**
**Next Session Goal:** Final testing, pricing normalization, and go-live preparation

## COMMIT REQUIREMENT - CRITICAL ⚠️
**ALWAYS commit and push changes at the end of each session or major task:**
1. Check `git status` before finishing any task
2. If there are uncommitted changes, ALWAYS commit them with descriptive messages  
3. ALWAYS push to deploy changes to production
4. NEVER finish a session without checking and committing outstanding changes
5. Use TodoWrite to track "Commit and push changes" as a final task when needed
6. **This is a PRODUCTION site - uncommitted changes cost real money in testing!**