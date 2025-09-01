import Stripe from 'stripe'
import { buffer } from 'micro'
import { saveOrder, updateOrder } from '../../../lib/storage'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret)
    console.log('✅ Webhook verified:', event.type)
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).json({ message: `Webhook Error: ${err.message}` })
  }

  try {
    console.log('🔍 Processing webhook event:', event.type)
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('💰 Payment succeeded:', paymentIntent.id)
        console.log('Amount:', paymentIntent.amount / 100)
        console.log('Metadata:', paymentIntent.metadata)
        
        // Create order in our system and Printify
        const result = await handleSuccessfulPayment(paymentIntent)
        console.log('📊 Order handling result:', result ? 'SUCCESS' : 'FAILED')
        break
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('❌ Payment failed:', failedPayment.id)
        // You could update order status or notify customer
        break
        
      case 'checkout.session.completed':
        // Handle if using Checkout Sessions
        const session = event.data.object
        console.log('✅ Checkout session completed:', session.id)
        break
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error('❌ Webhook handler error:', err)
    res.status(500).json({ message: 'Webhook handler failed' })
  }
}

async function handleSuccessfulPayment(paymentIntent) {
  try {
    const { metadata, amount, id: paymentId, shipping } = paymentIntent
    // Get shipping from payment intent or use defaults
const shippingInfo = paymentIntent.shipping || {
  address: {
    line1: metadata.address || '123 Test St',
    city: metadata.city || 'Austin',
    state: metadata.state || 'TX',
    postal_code: metadata.zipCode || '78701',
    country: 'US'
  },
  phone: metadata.phone || ''
}
    
    // Parse cart items from metadata
    const items = JSON.parse(metadata.items || '[]')
    const customerEmail = metadata.email
    const customerName = metadata.customer
    const isTestMode = false // Test mode removed - always create Printify orders
    
    console.log('📦 Processing order for:', customerEmail)
    console.log('📦 Items:', items)
    console.log('🧪 Test mode:', isTestMode)
    
    // Create order object
    const order = {
      id: `order_${Date.now()}`,
      paymentId,
      customer: {
        email: customerEmail,
        name: customerName
      },
      items,
      amount: amount / 100, // Convert from cents
      status: 'paid',
      printifyOrderIds: [], // Will store Printify order IDs
      createdAt: new Date().toISOString()
    }
    
    // Save order to persistent storage
    console.log('💾 Attempting to save order to persistent storage:', order.id)
    console.log('📄 Order details:', JSON.stringify(order, null, 2))
    const saveResult = await saveOrder(order)
    console.log('💾 Save result:', saveResult)
    if (!saveResult) {
      console.error('❌ Failed to save order to persistent storage')
      throw new Error('Failed to save order - aborting webhook')
    } else {
      console.log('✅ Order saved successfully to persistent storage')
    }
    
    // Create orders in Printify for each item (skip if test mode)
    const printifyResults = []
    console.log('🔍 Test mode check - isTestMode:', isTestMode, '(should be false)')
    if (isTestMode) {
      console.log('🧪 Test mode active - skipping Printify order creation')
    } else {
      console.log('🏭 Production mode - creating Printify orders for', items.length, 'items')
      for (const item of items) {
        try {
          console.log('🔄 Processing item for Printify:', item.id, item.name)
          const printifyOrder = await createPrintifyOrder(item, order, shippingInfo)
          if (printifyOrder) {
            printifyResults.push(printifyOrder.id)
            console.log('✅ Printify order created:', printifyOrder.id)
          } else {
            console.log('⚠️ Printify order creation returned null for item:', item.id)
          }
        } catch (printifyError) {
          console.error('❌ Failed to create Printify order for item:', item.id, printifyError)
        }
      }
      console.log('🏭 Printify processing complete. Created orders:', printifyResults.length)
    }
    
    // Update order with Printify IDs
    if (printifyResults.length > 0) {
      order.printifyOrderIds = printifyResults
      order.status = 'processing'
      
      // Update order in persistent storage
      const updateResult = await updateOrder(order.id, {
        printifyOrderIds: printifyResults,
        status: 'processing'
      })
      
      if (!updateResult) {
        console.error('❌ Failed to update order with Printify IDs')
      }
    }
    
    return order
  } catch (error) {
    console.error('❌ Error handling successful payment:', error)
    throw error
  }
}

async function createPrintifyOrder(item, order, shippingInfo) {
  const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY
  const SHOP_ID = '18727817'
  
  try {
    console.log('🔍 Fetching product details for:', item.id)
    
    // Get product details from Printify
    const productResponse = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/products/${item.id}.json`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!productResponse.ok) {
      const errorText = await productResponse.text()
      throw new Error(`Failed to fetch product: ${errorText}`)
    }
    
    const product = await productResponse.json()
    console.log('📦 Product found:', product.title)
    
    // Find the variant using the stored variantId (preferred) or fallback to size matching
    let variant
    if (item.variantId) {
      // Use the exact variant ID stored from cart
      variant = product.variants.find(v => v.id === item.variantId && v.is_enabled)
      console.log('🎯 Using stored variant ID:', item.variantId)
    } else {
      // Fallback: try to match by size (legacy support)
      variant = product.variants.find(v => {
        const variantSize = v.title.split(' / ')[1] || v.title.split(' - ')[1] || v.title
        return variantSize === item.size && v.is_enabled
      })
      console.log('⚠️ Using size fallback for:', item.size)
    }
    
    if (!variant) {
      console.error('❌ Available variants:', product.variants.map(v => ({ id: v.id, title: v.title, enabled: v.is_enabled })))
      throw new Error(`No variant found for ${item.variantId ? `variant ID ${item.variantId}` : `size ${item.size}`}`)
    }
    
    console.log('✅ Variant found:', variant.title, 'ID:', variant.id)
    
    // Create the Printify order
    const printifyOrder = {
      external_id: order.id,
      label: `OnlyInTX Order ${order.id}`,
      line_items: [
        {
          product_id: item.id,
          variant_id: variant.id,
          quantity: item.quantity || 1
        }
      ],
      shipping_method: 1, // Standard shipping
      send_shipping_notification: true,
      address_to: {
        first_name: order.customer.name?.split(' ')[0] || 'Customer',
        last_name: order.customer.name?.split(' ').slice(1).join(' ') || '',
        email: order.customer.email || '',
        phone: shippingInfo?.phone || '',
        country: 'US',
        region: shippingInfo?.address?.state || 'TX',
        address1: shippingInfo?.address?.line1 || '123 Test St',
        address2: shippingInfo?.address?.line2 || '',
        city: shippingInfo?.address?.city || 'Austin',
        zip: shippingInfo?.address?.postal_code || '78701'
      }
    }
    
    console.log('📤 Sending order to Printify:', JSON.stringify(printifyOrder, null, 2))
    
    const orderResponse = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(printifyOrder)
      }
    )
    
    if (!orderResponse.ok) {
      const errorData = await orderResponse.text()
      throw new Error(`Printify order creation failed: ${errorData}`)
    }
    
    const createdOrder = await orderResponse.json()
    console.log('🎉 Printify order created successfully:', createdOrder.id)
    
    return createdOrder
  } catch (error) {
    console.error('❌ Error creating Printify order:', error.message)
    // Don't throw - we don't want to fail the entire webhook
    // Log for manual processing if needed
    return null
  }
}