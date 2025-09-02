import Layout from '../../components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getColorMockupImage } from '../../utils/mockupMapping'

export default function TexasGear() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTexasProducts = async () => {
      try {
        // Fetch categories via API endpoint (CORRECT PATTERN)
        const categoriesResponse = await fetch('/api/admin/categories')
        const categoriesData = await categoriesResponse.json()
        
        const productsResponse = await fetch('/api/printify/products')
        const data = await productsResponse.json()
        
        if (categoriesResponse.ok && productsResponse.ok) {
          // Filter for products categorized as "texas" state gear
          const texasProducts = data.products.filter(product => {
            const metadata = categoriesData.products[product.id]
            return metadata?.categories?.includes('texas') || false
          }).map(product => {
            // Get the first available color from enabled variants for thumbnail
            const enabledVariants = product.variants.filter(v => v.is_enabled);
            const firstColor = enabledVariants.length > 0 ? 
              (enabledVariants[0].title.split(' / ')[0]?.trim() || 'Black') : 'Black';
            
            return {
              id: product.id,
              slug: product.slug,
              name: product.title,
              description: product.description || 'Premium Texas state pride apparel',
              price: getLowestVariantPrice(product.variants),
              image: getColorMockupImage(product.id, firstColor, 'thumb'),
              fallbackImage: product.images?.[0]?.src || '/images/texas-default.jpg',
              variants: product.variants.filter(v => v.is_enabled),
              primaryColor: firstColor
            };
          })
          
          setProducts(texasProducts)
        }
      } catch (error) {
        console.error('Failed to load Texas products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTexasProducts()
  }, [])

  const getLowestVariantPrice = (variants) => {
    if (!variants || variants.length === 0) return 0
    const enabledVariants = variants.filter(v => v.is_enabled === true)
    if (enabledVariants.length === 0) return 0
    const prices = enabledVariants.map(v => parseFloat(v.price) / 100)
    return Math.min(...prices)
  }

  return (
    <Layout>
      <Head>
        <title>Texas State Gear - OnlyInTX | Lone Star State Pride Apparel</title>
        <meta name="description" content="Show your Texas state pride with our collection of Lone Star State apparel. T-shirts, hoodies, and gifts celebrating all of Texas." />
        <meta name="keywords" content="Texas state apparel, Lone Star State, Texas pride, Texas t-shirts, Texas gear, state of Texas" />
        <link rel="canonical" href="https://onlyintx.com/texas" />
      </Head>
      
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/texas-hero.jpg?v=1"
            alt="Texas State Flag and Lone Star"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Texas State Gear
            </h1>
            <p className="text-xl md:text-3xl mb-6 text-texas-gold drop-shadow-md font-semibold">
              Lone Star State Pride
            </p>
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Celebrate the entire Lone Star State with our collection of Texas pride apparel celebrating the spirit, history, and culture of all Texas.
            </p>
          </div>
        </div>
      </section>
      
      {/* Texas Info */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-texas-blue mb-2">🌟 Lone Star</h3>
              <p className="text-lg text-gray-700">The Independent Republic</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-texas-blue mb-2">🤠 Heritage</h3>
              <p className="text-lg text-gray-700">Rich Culture & History</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-texas-blue mb-2">🏴 State Pride</h3>
              <p className="text-lg text-gray-700">Everything's Bigger in Texas</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Lone Star State Collection
          </h2>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-texas-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading Texas state products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No Texas state products categorized yet. Check back soon!</p>
              <p className="text-sm text-gray-500 mt-2">Admin: Use the product categories section to assign products to "Texas State"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/product/${product.slug || product.id}`}>
                    <div className="h-80 relative cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain bg-gray-100 hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.log(`Thumbnail failed for ${product.name}, using fallback`);
                          e.target.src = product.fallbackImage;
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link href={`/product/${product.slug || product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-texas-blue cursor-pointer transition-colors duration-200">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-4">
                      {/* Clean HTML from description like on product pages */}
                      {product.description
                        ?.replace(/<\/?[^>]+(>|$)/g, '')  // Remove HTML tags
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&lt;\/?[^&]*&gt;/g, '') // Remove encoded HTML tags
                        .replace(/\s+/g, ' ')
                        .trim() || 'Premium Texas state pride apparel'
                      }
                    </p>
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
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Texas Heritage Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Texas Heritage & Culture
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Lone Star Flag', 'Alamo', 'Cowboys', 'Oil & Energy', 'BBQ Culture', 'Music Heritage'].map((heritage, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="font-medium text-gray-700">{heritage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}