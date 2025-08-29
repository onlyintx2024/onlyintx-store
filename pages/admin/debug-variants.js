// Temporary debug script - add this to any page to see your variant data
// Add this to pages/admin/printify-test.js or create a new debug page

import { useState } from 'react'

export default function DebugVariants() {
  const [variantData, setVariantData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchVariantData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/printify/products')
      const data = await response.json()
      
      if (data.products && data.products.length > 0) {
        const firstProduct = data.products[0]
        console.log('First product variants:', firstProduct.variants)
        setVariantData({
          productTitle: firstProduct.title,
          totalVariants: firstProduct.variants.length,
          enabledVariants: firstProduct.variants.filter(v => v.is_enabled).length,
          sampleVariants: firstProduct.variants.slice(0, 5)
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Printify Variants</h1>
      
      <button 
        onClick={fetchVariantData}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Loading...' : 'Fetch Variant Data'}
      </button>

      {variantData && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Product: {variantData.productTitle}</h2>
          <p>Total variants: {variantData.totalVariants}</p>
          <p>Enabled variants: {variantData.enabledVariants}</p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Sample Variants:</h3>
          <pre className="bg-gray-100 p-4 overflow-auto text-sm">
            {JSON.stringify(variantData.sampleVariants, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}