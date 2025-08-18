import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ProductSEO() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [customDescriptions, setCustomDescriptions] = useState({})

  useEffect(() => {
    loadProducts()
    loadCustomDescriptions()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch(`/api/printify/products?t=${Date.now()}`)
      const data = await response.json()
      if (response.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCustomDescriptions = () => {
    const saved = localStorage.getItem('customProductDescriptions')
    if (saved) {
      setCustomDescriptions(JSON.parse(saved))
    }
  }

  const saveCustomDescription = (productId, description) => {
    const updated = {
      ...customDescriptions,
      [productId]: description
    }
    setCustomDescriptions(updated)
    localStorage.setItem('customProductDescriptions', JSON.stringify(updated))
    setEditingProduct(null)
  }

  const removeCustomDescription = (productId) => {
    const updated = { ...customDescriptions }
    delete updated[productId]
    setCustomDescriptions(updated)
    localStorage.setItem('customProductDescriptions', JSON.stringify(updated))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-texas-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product SEO Manager</h1>
          <p className="text-gray-600">Customize SEO descriptions for your products</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium">Products ({products.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{product.title}</h4>
                    
                    {editingProduct === product.id ? (
                      <div className="space-y-3">
                        <textarea
                          defaultValue={customDescriptions[product.id] || ''}
                          placeholder="Enter custom SEO description..."
                          className="w-full border border-gray-300 rounded-md p-3 h-24"
                          id={`desc-${product.id}`}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const desc = document.getElementById(`desc-${product.id}`).value
                              saveCustomDescription(product.id, desc)
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            <CheckIcon className="h-4 w-4 inline mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                          >
                            <XMarkIcon className="h-4 w-4 inline mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Current Description:</strong>
                        </p>
                        <p className="text-sm bg-gray-50 p-3 rounded border">
                          {customDescriptions[product.id] || 
                           `Auto-generated: Premium ${extractCityFromTitle(product.title)} t-shirt with unique design.`}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            customDescriptions[product.id] 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {customDescriptions[product.id] ? 'Custom' : 'Auto-generated'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => setEditingProduct(product.id)}
                      className="text-texas-blue hover:text-blue-700"
                      title="Edit description"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    {customDescriptions[product.id] && (
                      <button
                        onClick={() => removeCustomDescription(product.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove custom description"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

const extractCityFromTitle = (title) => {
  const cities = ['Austin', 'Dallas', 'Houston', 'San Antonio']
  return cities.find(city => title.toLowerCase().includes(city.toLowerCase())) || 'Texas'
}