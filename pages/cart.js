import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import Link from 'next/link'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { getColorMockupImage } from '../utils/mockupMapping'

export default function Cart() {
  const { state, dispatch } = useCart()
  // FREE SHIPPING ALWAYS!
  const shippingCost = 0
  
  const updateQuantity = (id, size, color, variantId, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size, color, variantId } })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, color, variantId, quantity } })
    }
  }
  
  const removeItem = (id, size, color, variantId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size, color, variantId } })
  }
  
  const subtotal = state.items.reduce((total, item) => total + ((item.price / 100) * item.quantity), 0)
  const shipping = 0 // FREE SHIPPING ALWAYS!
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
                  <div key={item.variantId || `${item.id}-${item.size}-${item.color}`} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            // Fallback to mockup image based on product info
                            const mockupImage = getColorMockupImage(item.id, item.color, 'thumb')
                            if (e.target.src !== mockupImage) {
                              e.target.src = mockupImage
                            } else {
                              // Final fallback to placeholder
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'block'
                            }
                          }}
                        />
                      ) : (
                        <img
                          src={getColorMockupImage(item.id, item.color, 'thumb')}
                          alt={item.name}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                      )}
                      <span className="text-gray-500 text-xs" style={{display: 'none'}}>No Image</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      <p className="text-sm text-gray-600">Color: {item.color}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.variantId, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.variantId, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="font-semibold">${((item.price / 100) * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color, item.variantId)}
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
                    <span className="text-green-600 font-semibold">FREE!</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded">
                    🚚 Free shipping on all orders - always!
                  </p>
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