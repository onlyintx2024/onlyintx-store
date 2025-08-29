import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { amount, currency = 'usd', metadata = {}, shipping = {}, testMode = false } = req.body

    // FOR TESTING ONLY - Create a $0.50 charge if testMode is true
    const finalAmount = testMode ? 50 : Math.round(amount * 100) // 50 cents for testing

    // Validate amount
    if (!testMode && (!amount || amount <= 0)) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount, // Will be 50 cents in test mode
      currency,
      metadata: {
        ...metadata,
        test_mode: testMode ? 'true' : 'false',
        created_at: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
      description: `OnlyInTX ${testMode ? 'TEST' : ''} Order - ${metadata.customer || 'Customer'}`
    })

    console.log(`Payment Intent created: ${paymentIntent.id} - Amount: $${finalAmount/100}`)

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      testMode,
      amount: finalAmount
    })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ message: error.message })
  }
}