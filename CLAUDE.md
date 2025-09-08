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

## 🚀 STORE STATUS: FULLY LAUNCHED & OPERATIONAL

### ✅ Recently Completed (Sept 2025)
- **Category System Fixed**: New products stay hidden until manually categorized ✅
- **Database Migration**: Categories now use Neon Postgres (permanent storage) ✅
- **Admin System Working**: Category assignments persist properly ✅
- **Payment Pipeline**: Complete order flow working end-to-end ✅
- **SEO Protection**: Products only appear when properly categorized ✅

## 🚨 CRITICAL ISSUE - NEEDS IMMEDIATE ATTENTION

### **Homepage Latest Designs Sorting STILL BROKEN**
**Problem:** Homepage shows Houston, Dallas, San Antonio, Austin (old designs) instead of actual latest designs
**Attempted Fix:** Added "Fix Latest Designs Sort" button in `/admin/categories` - BUT STILL NOT WORKING
**Root Cause:** Homepage sorting logic is fundamentally broken despite database migration

**NEXT SESSION PRIORITY #1**: Debug and fix homepage sorting logic permanently
- Check if homepage is reading correct data from database
- Verify design orders are actually updated correctly  
- May need to completely rewrite homepage product loading logic
- Test sorting with actual product creation dates vs design orders

## 📋 FUTURE FEATURE: Product Type Filtering System

### 🎯 **PLANNED IMPLEMENTATION (When Ready)**

**Goal:** Add product types (hoodies, mugs, hats, etc.) within each city page without breaking current URL structure.

**Approved Approach: Filter Tabs**
```
/austin → Shows all Austin products with tabs:
├── All Products (default)
├── T-Shirts  
├── Hoodies
├── Mugs
└── Accessories
```

**Implementation Plan:**
1. **Product Type Detection**: Auto-categorize from Printify product titles/tags
2. **Filter Tab UI**: Add to CityPage.js component and Texas page
3. **Admin System Update**: Manual product type assignment in categories admin
4. **Database Schema**: Extend product_metadata table with `product_type` field

**Benefits:**
- ✅ Preserves all current URLs and SEO
- ✅ Maintains existing category system
- ✅ Scales to unlimited product types
- ✅ User-friendly filtering interface

**Technical Requirements:**
- Update `product_metadata` table: add `product_type` column
- Modify CityPage.js: add filter tabs and product type filtering
- Extend admin categories: add product type selection
- Update all page queries to support product type filtering

**Status:** 📋 Documented for future implementation (focus on t-shirts first)

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

### Session 2025-09-06 - HOMEPAGE SORTING & SALES TRACKING CRISIS RESOLVED ✅

**🚨 CRITICAL ISSUES RESOLVED:**

**🔧 Homepage Sorting Crisis → RESOLVED**
- **Root Cause Found**: Design orders weren't set after database migration to Neon Postgres
- **Fix Applied**: Ran `/api/admin/fix-design-orders` successfully on production (15 products updated)
- **Result**: Latest Designs section now shows newest products (Paddle Austin, etc.) instead of old Houston/Dallas designs

**💰 Sales Tracking System → FULLY IMPLEMENTED**
- **Problem**: Orders saved to database but `unitsSold` never updated → Best Sellers couldn't work
- **Solutions Applied**:
  - Modified `saveOrder()` function to increment `unitsSold` when orders placed  
  - Created `/api/admin/sync-sales` to fix existing orders (1 order processed ✅)
  - Temporarily hard-coded Best Sellers with one shirt from each major city
- **Result**: Sales tracking infrastructure ready for when 4+ real sales achieved

**📝 Product Content → AUTHENTIC PRINTIFY DATA**
- **Problem**: Homepage/city pages showing generic "Austin T-Shirt - Local Texas Pride" titles (ruining SEO)
- **Fix**: Updated both homepage and CityPage.js to use real `product.title` and `cleanHTML(product.description)`
- **Result**: Now displays actual Printify titles like "Paddle Austin - Lady Bird Lake Kayaking T-Shirt"

**🔒 Security Review → CONFIRMED SECURE**
- Admin authentication system intact after database changes
- All API endpoints properly protected with `requireAuth`
- Cookie-based auth working correctly

**📚 Content Accuracy**
- Fixed homepage copy from "100% Texas Made" → "100% Designed by Texans" (more accurate)

**🎯 NEXT STEPS (User Responsibility)**:
1. Add more designs in Printify
2. Update current mockups as needed
3. Monitor sales - once 4+ real sales achieved, can switch from hard-coded Best Sellers to real sales data

---
**Last Updated:** Session 2025-09-06 (Homepage Sorting Fixed + Sales Tracking Implemented)  
**Status:** 🚀 **FULLY OPERATIONAL - Ready for marketing and sales growth!**

## COMMIT REQUIREMENT - CRITICAL ⚠️
**ALWAYS commit and push changes at the end of each session or major task:**
1. Check `git status` before finishing any task
2. If there are uncommitted changes, ALWAYS commit them with descriptive messages  
3. ALWAYS push to deploy changes to production
4. NEVER finish a session without checking and committing outstanding changes
5. Use TodoWrite to track "Commit and push changes" as a final task when needed
6. **This is a PRODUCTION site - uncommitted changes cost real money in testing!**