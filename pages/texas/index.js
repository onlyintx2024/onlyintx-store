import Layout from '../../components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function TexasGear() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/printify/products')
      .then(res => res.json())
      .then(data => {
        // Show all products for now (you can add filtering logic later)
        const texasProducts = data.products || []
        setProducts(texasProducts)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching products:', err)
        setLoading(false)
      })
  }, [])

  return (
    <Layout>
      <Head>
        <title>Texas State Gear - OnlyInTX | Lone Star State Pride Apparel</title>
        <meta name="description" content="Show your Texas state pride with our collection of Lone Star State apparel. T-shirts, hoodies, and gifts celebrating all of Texas." />
        <meta name="keywords" content="Texas state apparel, Lone Star State, Texas pride, Texas t-shirts, Texas gear, state of Texas" />
        <link rel="canonical" href="https://onlyintx.com/texas" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-texas-blue to-texas-red text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                🌟 Texas State Gear
              </h1>
              <p className="text-xl md:text-2xl text-texas-gold mb-8 max-w-3xl mx-auto">
                Celebrate the entire Lone Star State with our collection of Texas pride apparel
              </p>
              <div className="text-lg max-w-2xl mx-auto">
                From the Panhandle to the Gulf Coast, East Texas to West Texas - 
                show your statewide Texas pride with designs celebrating all of Texas.
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lone Star State Collection
            </h2>
            <p className="text-lg text-gray-600">
              Designs celebrating the spirit, history, and pride of Texas as a whole
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-2xl text-gray-600">Loading Texas gear...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/product/${product.slug || product.id}`}>
                      <div className="h-64 relative overflow-hidden cursor-pointer">
                        <img
                          src={product.images?.[0]?.src || '/images/texas-default.jpg'}
                          alt={product.title}
                          className="w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link href={`/product/${product.slug || product.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-texas-blue transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                      <div className="text-right">
                        <Link 
                          href={`/product/${product.slug || product.id}`}
                          className="bg-texas-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 inline-block text-center"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lone Star Pride</h3>
                <p className="text-gray-600">
                  Designs celebrating Texas as the Lone Star State with iconic symbols and imagery
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Texas Heritage</h3>
                <p className="text-gray-600">
                  Celebrating the rich history, culture, and traditions that make Texas unique
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏴</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">State Spirit</h3>
                <p className="text-gray-600">
                  Show your love for the entire state of Texas with bold, authentic designs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}