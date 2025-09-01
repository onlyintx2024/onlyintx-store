import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm({ total, formData, setFormData }) {
  const stripe = useStripe()
  const elements = useElements()
  const { state, dispatch } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [testMode, setTestMode] = useState(true) // Toggle for testing

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: testMode ? 0.50 : total, // Use 50 cents in test mode
          testMode: testMode, // Pass test mode flag
          metadata: {
            items: JSON.stringify(state.items),
            customer: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        }),
      })

      // Add error checking
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Payment intent error:', errorText)
        throw new Error(`Payment failed: ${response.status}`)
      }

      const data = await response.json()

      // Confirm payment with the client secret from the response
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
            },
          },
        }
      })

      if (result.error) {
        setError(result.error.message)
      } else {
        // Payment successful
        window.location.href = '/checkout-success'
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TEST MODE TOGGLE - REMOVE IN PRODUCTION */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">🧪 Test Mode Active</p>
            <p className="text-sm">Payment will be $0.50 for testing. Toggle off for real payments.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Existing form fields... */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          required
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="TX">Texas</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="FL">Florida</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            required
            value={formData.zipCode}
            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
        <div className="border border-gray-300 rounded-md p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={isLoading || !stripe}
        className={`w-full py-3 px-4 rounded-lg font-semibold ${
          isLoading || !stripe
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-texas-blue hover:bg-blue-700'
        } text-white transition-colors duration-200`}
      >
        {isLoading ? 'Processing...' : `Pay $${(testMode ? 0.50 : total).toFixed(2)}`}
      </button>
    </form>
  )
}

export default function Checkout() {
  const { state } = useCart()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: 'TX',
    zipCode: ''
  })
  
  const subtotal = state.items.reduce((total, item) => total + ((item.price / 100) * item.quantity), 0)
  const shipping = 0 // FREE SHIPPING ALWAYS!
  const total = subtotal + shipping
  
  // Add this check
  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart before checking out.</p>
            <a href="/" className="bg-texas-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </a>
          </div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping & Payment</h2>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  total={total}
                  formData={formData}
                  setFormData={setFormData}
                />
              </Elements>
            </div>
            
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              {state.items.map((item) => (
                <div key={item.variantId || `${item.id}-${item.size}-${item.color}`} className="flex justify-between items-center py-3 border-b">
                  <div>
                    <h4 className="font-medium">{item.name || item.title}</h4>
                    <p className="text-sm text-gray-600">
                      {item.color && `${item.color} / `}{item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">${((item.price / 100) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE!</span>
                </div>
                <div className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded">
                  🚚 Free shipping on all orders
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}