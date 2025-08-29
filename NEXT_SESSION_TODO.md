# Next Session TODO - Priority Tasks

## 🚨 **CRITICAL PATH TO LAUNCH**

### **🔴 IMMEDIATE (This Session)**

#### **1. Stripe Production Configuration**
**Status**: Test webhooks working, need production setup  
**Action Items**:
- [ ] Switch Stripe account from test to live mode
- [ ] Create production webhook endpoint in Stripe Dashboard
- [ ] Set webhook URL: `https://yourdomain.com/api/stripe/webhook`
- [ ] Copy webhook secret and update `STRIPE_WEBHOOK_SECRET` env var
- [ ] Update `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to live keys
- [ ] Test webhook with $0.50 payment to verify integration

#### **2. Production Deployment**
**Platform**: Vercel (recommended) or Netlify  
**Action Items**:
- [ ] Connect GitHub repository to deployment platform
- [ ] Configure environment variables in hosting platform:
  ```bash
  PRINTIFY_API_TOKEN=your_token
  STRIPE_SECRET_KEY=sk_live_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ADMIN_PASSWORD=your_secure_password
  NODE_ENV=production
  ```
- [ ] Deploy and verify build succeeds
- [ ] Set up custom domain (if ready)
- [ ] Verify SSL certificate is active

#### **3. End-to-End Testing**
**Critical Flow**: Homepage → Product → Cart → Checkout → Payment → Order  
**Test Cases**:
- [ ] Browse products on homepage and city pages
- [ ] Add product to cart with specific color/size selection
- [ ] Verify cart shows correct product image and pricing ($4.99 shipping)
- [ ] Complete checkout with test payment
- [ ] Verify webhook triggers and Printify order is created
- [ ] Check admin dashboard shows new order
- [ ] Verify customer receives correct product variant

---

## 🟡 **HIGH PRIORITY (Within 48 Hours)**

#### **4. Admin Security Verification**
**Login URL**: `/admin/login`  
**Default Password**: `onlyintx2024`  
**Action Items**:
- [ ] Verify admin login works on production
- [ ] Test all admin pages require authentication
- [ ] Verify logout functionality works
- [ ] Change default password via `ADMIN_PASSWORD` environment variable

#### **5. Email & Communication Testing**
**Contact Email**: `onlyintx2024@gmail.com`  
**Action Items**:
- [ ] Test contact form submission from production site
- [ ] Verify emails arrive at `onlyintx2024@gmail.com`
- [ ] Test "Return/Exchange" subject option
- [ ] Verify all pages show correct email addresses

---

## 📋 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment**
- [x] ✅ Security implemented (admin authentication)
- [x] ✅ Custom mockup system operational
- [x] ✅ All critical bugs fixed
- [x] ✅ Email addresses corrected
- [x] ✅ Cart and checkout working
- [ ] Environment variables prepared for production
- [ ] Domain name ready (if applicable)

### **During Deployment**
- [ ] Repository connected to hosting platform
- [ ] Environment variables configured
- [ ] Build and deploy successful
- [ ] Custom domain connected (if applicable)
- [ ] SSL certificate verified

### **Post-Deployment**
- [ ] Homepage loads correctly
- [ ] All product images display (custom mockups)
- [ ] Admin login accessible at `/admin/login`
- [ ] Stripe webhooks receiving test payments
- [ ] Contact form sending emails
- [ ] Mobile responsiveness verified

---

## 🚀 **SUCCESS METRICS TO VERIFY**

### **Technical Validation**
- [ ] Site loads under 3 seconds on mobile
- [ ] Custom mockup images display instead of Printify defaults
- [ ] Admin dashboard shows real-time data
- [ ] Cart calculates shipping correctly ($4.99 or FREE over $50)
- [ ] Checkout processes payments without errors

### **Business Validation**
- [ ] Complete test purchase from product selection to order confirmation
- [ ] Verify Printify receives order with correct variant details
- [ ] Admin dashboard shows accurate order information
- [ ] Customer communication flows work (contact form)

---

## ⚡ **QUICK COMMANDS FOR NEXT SESSION**

### **Environment Setup Check**
```bash
# Verify all required environment variables
echo "PRINTIFY_API_TOKEN: ${PRINTIFY_API_TOKEN:0:10}..."
echo "STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:0:10}..."
echo "ADMIN_PASSWORD: Set = ${ADMIN_PASSWORD:+Yes}"
```

### **Local Testing Commands**
```bash
# Start development server
npm run dev

# Build for production (verify no errors)
npm run build

# Start production server locally
npm start
```

### **Critical URLs to Test**
- Homepage: `/`
- Product page: `/product/austin-music-lover-t-shirt-guitar-design`
- Cart: `/cart`
- Checkout: `/checkout`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`
- Contact form: `/contact`

---

## 🎯 **SESSION SUCCESS DEFINITION**

**"Next session is successful when":**
1. ✅ Customer can complete a real payment on production site
2. ✅ Order automatically appears in Printify for fulfillment
3. ✅ Admin can log in and manage orders securely
4. ✅ All custom mockup images display correctly
5. ✅ Contact form delivers messages to `onlyintx2024@gmail.com`

**Result**: OnlyInTX store is LIVE and generating revenue! 🎉

---

## 📞 **IF STUCK - COMMON ISSUES & SOLUTIONS**

### **Webhook Not Working**
- Verify webhook URL matches exactly: `https://yourdomain.com/api/stripe/webhook`
- Check webhook secret is correct in environment variables
- Verify webhook is set to send `payment_intent.succeeded` events

### **Images Not Loading**
- Verify mockup files exist in `/public/mockups/product-[ID]/`
- Check file names match color names (lowercase, hyphens for spaces)
- Ensure both full and thumbnail versions exist

### **Admin Login Issues**
- Verify `ADMIN_PASSWORD` environment variable is set
- Check `/admin/login` URL is accessible
- Clear browser cookies and try again

---

*Prepared: August 27, 2025 - Ready for Production Launch!*