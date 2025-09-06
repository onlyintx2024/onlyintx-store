import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Head from 'next/head'

export default function ProductCategories() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState({})
  const [availableCategories, setAvailableCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load products from Printify
      const productsResponse = await fetch('/api/printify/products')
      const productsData = await productsResponse.json()
      
      // Load category data
      const categoriesResponse = await fetch('/api/admin/categories')
      const categoriesData = await categoriesResponse.json()
      
      setProducts(productsData.products || [])
      setAvailableCategories(categoriesData.available || [])
      
      // Set current categories for each product
      const currentCategories = {}
      productsData.products?.forEach(product => {
        const metadata = categoriesData.products[product.id]
        currentCategories[product.id] = metadata?.categories || []
      })
      setCategories(currentCategories)
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCategories = async (productId, newCategories) => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          categories: newCategories
        })
      })
      
      if (response.ok) {
        setCategories(prev => ({
          ...prev,
          [productId]: newCategories
        }))
        
        // Show success feedback
        console.log(`✅ Categories updated for product ${productId}:`, newCategories)
      } else {
        throw new Error('Failed to update categories')
      }
    } catch (error) {
      console.error('Error updating categories:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleCategory = (productId, category) => {
    const currentProductCategories = categories[productId] || []
    let newCategories
    
    if (currentProductCategories.includes(category)) {
      newCategories = currentProductCategories.filter(c => c !== category)
    } else {
      newCategories = [...currentProductCategories, category]
    }
    
    updateCategories(productId, newCategories)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <div className="text-2xl">Loading products...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Head>
        <title>Product Categories - Admin</title>
      </Head>
      
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Categories</h1>
          <p className="text-gray-600">Assign products to categories to control where they appear on the site</p>
        </div>
        <div className="space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={async () => {
              if (!confirm('Fix design orders based on Printify creation dates? This will update the Latest Designs sorting on homepage.')) return
              try {
                const response = await fetch('/api/admin/fix-design-orders', { method: 'POST' })
                const data = await response.json()
                if (response.ok) {
                  alert(`✅ Success! Fixed design orders for ${data.totalProducts} products.\n\nOldest: ${data.oldestProduct}\nNewest: ${data.newestProduct}`)
                  loadData() // Refresh the page
                } else {
                  alert(`❌ Error: ${data.error}`)
                }
              } catch (error) {
                alert(`❌ Error: ${error.message}`)
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Fix Latest Designs Sort
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold">Available Categories</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableCategories.map(category => (
              <span key={category} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {category === 'texas' ? 'Texas State' : 
                 category === 'san-antonio' ? 'San Antonio' :
                 category === 'fort-worth' ? 'Fort Worth' :
                 category === 'el-paso' ? 'El Paso' :
                 category === 'corpus-christi' ? 'Corpus Christi' :
                 category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {products.map(product => (
            <div key={product.id} className="p-6">
              <div className="flex items-start space-x-4">
                <img 
                  src={product.images?.[0]?.src || '/images/texas-default.jpg'}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">ID: {product.id}</p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map(category => {
                        const isSelected = categories[product.id]?.includes(category)
                        return (
                          <button
                            key={category}
                            onClick={() => toggleCategory(product.id, category)}
                            disabled={saving}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {category === 'texas' ? 'Texas State' : 
                             category === 'san-antonio' ? 'San Antonio' :
                             category === 'fort-worth' ? 'Fort Worth' :
                             category === 'el-paso' ? 'El Paso' :
                             category === 'corpus-christi' ? 'Corpus Christi' :
                             category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {categories[product.id]?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        Currently appears in: {categories[product.id]?.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">How Categories Work</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Texas State:</strong> Products appear on /texas page (state-wide designs)</li>
          <li>• <strong>City Names:</strong> Products appear on respective city pages (austin, dallas, etc.)</li>
          <li>• Products can belong to multiple categories</li>
          <li>• Products without categories won't appear on category pages</li>
        </ul>
      </div>
    </AdminLayout>
  )
}