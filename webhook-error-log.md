2025-09-01T23:37:16.303Z [info] ✅ Webhook verified: payment_intent.succeeded
2025-09-01T23:37:16.303Z [info] 🔍 Processing webhook event: payment_intent.succeeded
2025-09-01T23:37:16.303Z [info] 💰 Payment succeeded: pi_3S2hHhRc68QoU5s813qBQNdE
2025-09-01T23:37:16.303Z [info] Amount: 0.5
2025-09-01T23:37:16.303Z [info] Metadata: {
  created_at: '2025-09-01T23:37:13.133Z',
  items: '[{"id":38218,"productId":"68b506eb0502fbdf1c062ebc","title":"Lone Star Spirit – Texas Icons Design","price":50,"color":"Sport Grey","size":"2XL","variantId":38218,"image":"https://images-api.printify.com/mockup/68b506eb0502fbdf1c062ebc/38191/97992/lone-star-spirit-texas-icons-design.jpg?camera_label=front","quantity":1}]',
  customer: 'jason bryant',
  zipCode: '77365',
  address: '21424 Surrey Glen Ct',
  email: 'jbryant77@hotmail.com',
  state: 'TX',
  city: 'Porter',
  test_mode: 'false'
}
2025-09-01T23:37:16.303Z [info] 📦 Processing order for: jbryant77@hotmail.com
2025-09-01T23:37:16.303Z [info] 📦 Items: [
  {
    id: 38218,
    productId: '68b506eb0502fbdf1c062ebc',
    title: 'Lone Star Spirit – Texas Icons Design',
    price: 50,
    color: 'Sport Grey',
    size: '2XL',
    variantId: 38218,
    image: 'https://images-api.printify.com/mockup/68b506eb0502fbdf1c062ebc/38191/97992/lone-star-spirit-texas-icons-design.jpg?camera_label=front',
    quantity: 1
  }
]
2025-09-01T23:37:16.304Z [info] 🧪 Test mode: false
2025-09-01T23:37:16.304Z [info] 💾 Attempting to save order to persistent storage: order_1756769836303
2025-09-01T23:37:16.304Z [info] 📄 Order details: {
  "id": "order_1756769836303",
  "paymentId": "pi_3S2hHhRc68QoU5s813qBQNdE",
  "customer": {
    "email": "jbryant77@hotmail.com",
    "name": "jason bryant"
  },
  "items": [
    {
      "id": 38218,
      "productId": "68b506eb0502fbdf1c062ebc",
      "title": "Lone Star Spirit – Texas Icons Design",
      "price": 50,
      "color": "Sport Grey",
      "size": "2XL",
      "variantId": 38218,
      "image": "https://images-api.printify.com/mockup/68b506eb0502fbdf1c062ebc/38191/97992/lone-star-spirit-texas-icons-design.jpg?camera_label=front",
      "quantity": 1
    }
  ],
  "amount": 0.5,
  "status": "paid",
  "printifyOrderIds": [],
  "createdAt": "2025-09-01T23:37:16.303Z"
}
2025-09-01T23:37:16.305Z [info] 💾 Saving order to persistent storage: order_1756769836303
2025-09-01T23:37:16.305Z [info] 📋 Reading orders from memory cache, count: 1
2025-09-01T23:37:16.305Z [info] ✅ Orders saved to memory cache, count: 2
2025-09-01T23:37:16.305Z [info] ✅ Order saved successfully. Total orders: 2
2025-09-01T23:37:16.305Z [info] 💾 Save result: true
2025-09-01T23:37:16.306Z [info] ✅ Order saved successfully to persistent storage
2025-09-01T23:37:16.306Z [info] 🔍 Test mode check - isTestMode: false (should be false)
2025-09-01T23:37:16.306Z [info] 🏭 Production mode - creating Printify orders for 1 items
2025-09-01T23:37:16.306Z [info] 🔄 Processing item for Printify: 38218 undefined
2025-09-01T23:37:16.306Z [info] 🔍 Fetching product details for: 38218
2025-09-01T23:37:16.440Z [error] ❌ Error creating Printify order: Failed to fetch product: {"error":"Unauthenticated."}
2025-09-01T23:37:16.440Z [info] ⚠️ Printify order creation returned null for item: 38218
2025-09-01T23:37:16.440Z [info] 🏭 Printify processing complete. Created orders: 0
2025-09-01T23:37:16.440Z [info] 📊 Order handling result: SUCCESS