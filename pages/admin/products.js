import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [bulkPricing, setBulkPricing] = useState({
    basePrice: 32.00,
    profitMargin: 20.00
  })
  
  const cities = ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Plano', 'Lubbock', 'Amarillo']
  
  // Load products from Printify on component mount
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/printify/products?t=${Date.now()}`, {
  cache: 'no-cache'
})
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load products')
      }
      
      // Transform Printify products for our admin table
      const transformedProducts = data.products.map(product => ({
        id: product.id,
        name: product.title,
        city: extractCityFromTitle(product.title) || 'Unknown',
        price: getLowestVariantPrice(product.variants),
        status: product.visible ? 'Active' : 'Draft',
        printifyId: product.id,
        description: product.description,
        variants: product.variants || [],
        images: product.images || [],
        tags: product.tags || [],
        created_at: product.created_at,
        updated_at: product.updated_at
      }))
      
      setProducts(transformedProducts)
    } catch (error) {
      console.error('Failed to load products:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const refreshProducts = async () => {
    setRefreshing(true)
    await loadProducts()
    setRefreshing(false)
  }

  // Helper function to extract city from product title
  const extractCityFromTitle = (title) => {
    const cityKeywords = ['Austin', 'Dallas', 'Houston', 'San Antonio']
    return cityKeywords.find(city => 
      title.toLowerCase().includes(city.toLowerCase())
    )
  }

  // Helper function to get lowest variant price
const getLowestVariantPrice = (variants) => {
  console.log('Debug variants for lowest price:', variants)
  
  if (!variants || variants.length === 0) return 0
  
  // Log first few variants to see structure
  console.log('First 3 variants:', variants.slice(0, 3))
  
  const prices = variants.map(v => {
    const price = parseFloat(v.price) / 100
    console.log('Variant price conversion:', v.price, '→', price)
    return price
  })
  
  console.log('All prices:', prices)
  const lowest = Math.min(...prices)
  console.log('Lowest price found:', lowest)
  
  return lowest
}

  // Helper function to get highest variant price
  const getHighestVariantPrice = (variants) => {
    if (!variants || variants.length === 0) return 0
    const prices = variants.map(v => parseFloat(v.price) / 100)
    return Math.max(...prices)
  }

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product from Printify?')) return
    
    try {
      const response = await fetch(`/api/printify/products?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete product')
      }
      
      // Remove from local state
      setProducts(products.filter(p => p.id !== id))
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Failed to delete product: ${error.message}`)
    }
  }

  const updateProductPricing = async (productId, newPricing) => {
  try {
    const product = products.find(p => p.id === productId)
    if (!product) return

    console.log('Updating all variants for product:', productId)
    
    // Update ALL variants, not just the first one
    const updatedVariants = product.variants.map(variant => ({
      id: variant.id,
      price: Math.round(newPricing * 100),
      is_enabled: true
    }))

    console.log('Updating', updatedVariants.length, 'variants')

    const response = await fetch('/api/printify/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: productId,
        updateData: { variants: updatedVariants }
      })
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message || `API Error: ${response.status}`)
    }

    // Update local state to reflect new pricing
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, variants: updatedVariants, price: newPricing }
        : p
    ))

    alert('All variants updated successfully!')
  } catch (error) {
    console.error('Pricing update error:', error)
    alert(`Failed to update pricing: ${error.message}`)
  }
}

  const applyBulkPricing = async () => {
    if (!confirm(`Apply $${bulkPricing.basePrice} pricing to all products?`)) return

    try {
      const updatePromises = products.map(product => 
        updateProductPricing(product.id, bulkPricing.basePrice)
      )
      
      await Promise.all(updatePromises)
      alert('Bulk pricing applied to all products!')
      await refreshProducts()
    } catch (error) {
      console.error('Bulk pricing error:', error)
      alert('Some products failed to update. Please check individual products.')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-texas-blue"></div>
          <span className="ml-4 text-gray-600">Loading products from Printify...</span>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium">Error Loading Products</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={loadProducts}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    )
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your Texas city apparel from Printify</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshProducts}
              disabled={refreshing}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-texas-blue text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {/* Bulk Pricing Controls */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="h-6 w-6 mr-2 text-yellow-600">💰</span>
            Bulk Pricing Manager
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={bulkPricing.basePrice}
                onChange={(e) => setBulkPricing({...bulkPricing, basePrice: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Profit: ${(bulkPricing.basePrice - 11.90).toFixed(2)} per shirt
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Breakdown
              </label>
              <div className="text-sm text-gray-600">
                <div>Base Cost: $7.91</div>
                <div>Shipping: $3.99</div>
                <div className="font-medium border-t pt-1">Total: $11.90</div>
              </div>
            </div>
            <div>
              <button
                onClick={applyBulkPricing}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Apply to All Products
              </button>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Printify Products ({products.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Printify ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0].src}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            Created: {new Date(product.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-texas-gold text-texas-blue rounded-full">
                        {product.city}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        ${product.price.toFixed(2)} - ${getHighestVariantPrice(product.variants).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Profit: ${(product.price - 11.90).toFixed(2)}+
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.variants.length} sizes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {product.printifyId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="text-texas-blue hover:text-blue-700 transition-colors"
                          title="Edit pricing"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete product"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Pricing: {editingProduct.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct.price}
                    id="newPrice"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current profit: ${(editingProduct.price - 11.90).toFixed(2)}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const newPrice = parseFloat(document.getElementById('newPrice').value)
                      updateProductPricing(editingProduct.id, newPrice)
                      setEditingProduct(null)
                    }}
                    className="flex-1 bg-texas-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Active Products</h4>
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Draft Products</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'Draft').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Average Price</h4>
            <p className="text-2xl font-bold text-texas-blue">
              ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Average Profit</h4>
            <p className="text-2xl font-bold text-green-600">
              ${products.length > 0 ? (products.reduce((sum, p) => sum + (p.price - 11.90), 0) / products.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}