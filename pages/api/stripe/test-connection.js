import Stripe from 'stripe'

export default async function handler(req, res) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    
    // Try to retrieve your account details to test the connection
    const account = await stripe.accounts.retrieve()
    
    res.status(200).json({ 
      success: true, 
      message: 'Stripe connected successfully',
      accountId: account.id,
      country: account.country
    })
  } catch (error) {
    console.error('Stripe connection error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}