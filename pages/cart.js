import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import Link from 'next/link'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

export default function Cart() {
  const { state, dispatch } = useCart()
  
  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } })
    }
  }
  
  const removeItem = (id, size) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } })
  }
  
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 7.99
  const total = subtotal + shipping
  
  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart is Empty</h1>
              <p className="text-lg text-gray-600 mb-8">Start shopping for some awesome Texas gear!</p>
              <Link href="/" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-gray-500 text-xs">Image</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      <p className="text-sm text-gray-600">Color: {item.color}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {subtotal < 50 && (
                    <p className="text-sm text-green-600">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Link href="/checkout" className="w-full btn-primary mt-6 block text-center">
                  Proceed to Checkout
                </Link>
                
                <Link href="/" className="w-full btn-secondary mt-3 block text-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}