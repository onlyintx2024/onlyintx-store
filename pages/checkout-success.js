import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'

export default function CheckoutSuccess() {
  const router = useRouter()
  const { dispatch } = useCart()
  
  useEffect(() => {
    // Clear cart on successful payment
    dispatch({ type: 'CLEAR_CART' })
  }, [dispatch])
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order! We'll send you an email confirmation shortly.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto bg-texas-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}