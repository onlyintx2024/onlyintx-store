import Layout from '../../components/Layout'
import Head from 'next/head'
import ProductGrid from '../../components/ProductGrid'
import { useEffect, useState } from 'react'

export default function TexasGear() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/printify/products')
      .then(res => res.json())
      .then(data => {
        // Filter for state-wide Texas products (you can add specific tags or filtering logic)
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
            <ProductGrid products={products} />
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