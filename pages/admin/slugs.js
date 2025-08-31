import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function AdminSlugs() {
  const [products, setProducts] = useState([])
  const [customSlugs, setCustomSlugs] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load products and current slugs
      const [productsResponse, slugsResponse] = await Promise.all([
        fetch('/api/printify/products'),
        fetch('/api/admin/slugs', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
      ])
      
      if (!productsResponse.ok || !slugsResponse.ok) {
        throw new Error('Failed to load data')
      }
      
      const productsData = await productsResponse.json()
      const slugsData = await slugsResponse.json()
      
      setProducts(productsData.products || [])
      setCustomSlugs(slugsData.slugs || {})
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load products and slugs')
    } finally {
      setLoading(false)
    }
  }

  const updateSlug = async (productId, newSlug) => {
    try {
      setSaving({ ...saving, [productId]: true })
      setError(null)
      setSuccessMessage('')
      
      const response = await fetch('/api/admin/slugs', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, slug: newSlug })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update slug')
      }
      
      // Update local state
      setCustomSlugs({
        ...customSlugs,
        [productId]: data.slug
      })
      
      setSuccessMessage(`Slug updated for ${products.find(p => p.id === productId)?.title}`)
      setTimeout(() => setSuccessMessage(''), 3000)
      
    } catch (err) {
      console.error('Error updating slug:', err)
      setError(err.message)
    } finally {
      setSaving({ ...saving, [productId]: false })
    }
  }

  const generateSlugFromTitle = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Product Slugs</h1>
          <div className="text-sm text-gray-500">
            Total Products: {products.length}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Custom URL Slugs</h2>
            <p className="text-sm text-gray-600 mt-1">
              Set custom URL slugs for your products. Leave blank to use auto-generated slug from title.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {products.map((product) => {
              const currentSlug = customSlugs[product.id] || generateSlugFromTitle(product.title)
              const hasCustomSlug = !!customSlugs[product.id]
              
              return (
                <div key={product.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current URL Slug
                            {hasCustomSlug && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                Custom
                              </span>
                            )}
                          </label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                            /product/{currentSlug}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Set Custom Slug
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              placeholder={generateSlugFromTitle(product.title)}
                              defaultValue={customSlugs[product.id] || ''}
                              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  updateSlug(product.id, e.target.value)
                                }
                              }}
                              id={`slug-${product.id}`}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`slug-${product.id}`)
                                updateSlug(product.id, input.value)
                              }}
                              disabled={saving[product.id]}
                              className="bg-red-600 text-white px-4 py-2 rounded-r-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              {saving[product.id] ? 'Saving...' : 'Update'}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Leave blank to use auto-generated slug from title
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}