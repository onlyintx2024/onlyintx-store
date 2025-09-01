import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { getColorMockupImage } from '../utils/mockupMapping'
const generateSEOTitle = (printifyTitle, cityName) => {
  const title = printifyTitle.toLowerCase()
  
  // Clean up common patterns
  if (title.includes('saucy')) {
    return `${cityName} Foodie T-Shirt - Saucy Tee`
  }
  if (title.includes('guitar') || title.includes('music')) {
    return `${cityName} Music Lover T-Shirt - Guitar Design`
  }
  if (title.includes('alamo')) {
    return `San Antonio Alamo T-Shirt - Remember Texas`
  }
  if (title.includes('big d') || title.includes('energy')) {
    return `Dallas Big D Energy T-Shirt - Texas Pride`
  }
  if (title.includes('skyline')) {
    return `${cityName} Skyline T-Shirt - City Pride`
  }
  
  // Default clean format
  return `${cityName} T-Shirt - Local Texas Pride`
}
const getProductDescription = (product, cityName) => {
  // Check for custom description first
  const customDescriptions = JSON.parse(localStorage.getItem('customProductDescriptions') || '{}')
  if (customDescriptions[product.id]) {
    return customDescriptions[product.id]
  }
  
  // Fall back to auto-generation
  return generateSEODescription(product.title, cityName)
}
const generateSEODescription = (productName, cityName) => {
  const name = productName.toLowerCase()
  
  // Detailed keyword matching for auto-generation
  const patterns = {
    food: ['saucy', 'bbq', 'taco', 'food', 'eat', 'kitchen', 'chef', 'restaurant'],
    music: ['guitar', 'music', 'sound', 'beat', 'rhythm', 'concert', 'band'],
    landmarks: ['alamo', 'skyline', 'downtown', 'bridge', 'tower', 'capitol'],
    sports: ['team', 'football', 'baseball', 'basketball', 'soccer', 'sports'],
    culture: ['keep', 'weird', 'local', 'native', 'born', 'raised', 'culture'],
    vintage: ['vintage', 'retro', 'classic', 'throwback', 'old school']
  }
  
  for (const [category, keywords] of Object.entries(patterns)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      switch(category) {
        case 'food':
          return `Celebrate ${cityName}'s incredible food scene with this foodie-inspired tee. Perfect for locals who love ${cityName}'s culinary culture.`
        case 'music':
          return `Show your love for ${cityName}'s legendary music scene. Premium t-shirt perfect for music lovers and concert-goers.`
        case 'landmarks':
          return `Iconic ${cityName} landmarks on a premium t-shirt. Show your city pride with this unique local design.`
        case 'sports':
          return `Rep your ${cityName} team spirit with this sports-inspired tee. Perfect for game day and showing local pride.`
        case 'culture':
          return `Authentic ${cityName} culture shirt for true locals. Celebrate what makes ${cityName} unique and special.`
        case 'vintage':
          return `Vintage-inspired ${cityName} design with retro appeal. Classic style meets local pride in this premium tee.`
      }
    }
  }
  
  return `Premium ${cityName}, Texas t-shirt with unique local design. Comfortable cotton tee perfect for showing your ${cityName} pride.`
}

export default function CityPage({ city }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  // Load products from Printify filtered by city
  useEffect(() => {
  const loadCityProducts = async () => {
    try {
      console.log('Loading products for city:', city.name)
      const response = await fetch(`/api/printify/products?t=${Date.now()}`)
      const data = await response.json()
      
      console.log('API Response:', data)
      console.log('Total products from API:', data.products?.length)
      
      if (response.ok) {
        // Log all product titles to see what we're working with
        console.log('All product titles:', data.products.map(p => p.title))
        
        // Filter products for this city
        const cityProducts = data.products.filter(product => {
          const matches = product.title.toLowerCase().includes(city.name.toLowerCase())
          console.log(`Product "${product.title}" matches "${city.name}"?`, matches)
          return matches
        }).map(product => {
          // Get the first available color from enabled variants for thumbnail
          const enabledVariants = product.variants.filter(v => v.is_enabled);
          const firstColor = enabledVariants.length > 0 ? 
            (enabledVariants[0].title.split(' / ')[0]?.trim() || 'Black') : 'Black';
          
          return {
            id: product.id,
            slug: product.slug,
            name: generateSEOTitle(product.title, city.name),
            printifyTitle: product.title,
            price: getLowestVariantPrice(product.variants),
            description: getProductDescription(product, city.name),
            image: getColorMockupImage(product.id, firstColor, 'thumb'),
            fallbackImage: product.images?.[0]?.src || '/images/texas-default.jpg',
            variants: product.variants.filter(v => v.is_enabled),
            printifyId: product.id,
            primaryColor: firstColor
          };
        })
        
        console.log('Filtered city products:', cityProducts)
        setProducts(cityProducts)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  loadCityProducts()
}, [city.name])

  const getLowestVariantPrice = (variants) => {
    if (!variants || variants.length === 0) return 0
    const enabledVariants = variants.filter(v => v.is_enabled === true)
    if (enabledVariants.length === 0) return 0
    const prices = enabledVariants.map(v => parseFloat(v.price) / 100)
    return Math.min(...prices)
  }

  const getUniqueSizes = (variants) => {
    const enabledVariants = variants.filter(v => v.is_enabled === true)
    const sizes = enabledVariants.map(v => v.title.split(' / ')[1] || v.title.split(' - ')[1] || 'Standard')
    return [...new Set(sizes)].sort()
  }

  
  return (
    <>
      <Head>
        <title>{city.name}, Texas Apparel & Gifts | OnlyInTX - {city.tagline}</title>
        <meta name="description" content={`${city.description} Shop authentic ${city.name} t-shirts, hoodies, and gifts. Always free shipping on all orders.`} />
        <meta name="keywords" content={city.keywords} />
        <link rel="canonical" href={`https://onlyintx.com/${city.slug}`} />
        
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": `OnlyInTX ${city.name}`,
              "description": city.description,
              "url": `https://onlyintx.com/${city.slug}`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": city.name,
                "addressRegion": "TX",
                "addressCountry": "US"
              }
            })
          }}
        />
      </Head>
      
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src={city.heroImage || '/images/texas-default.jpg'}
            alt={`${city.name}, Texas skyline and landmarks`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {city.name}, Texas
            </h1>
            <p className="text-xl md:text-3xl mb-6 text-texas-gold drop-shadow-md font-semibold">
              {city.tagline}
            </p>
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              {city.description}
            </p>
          </div>
        </div>
      </section>
      
      {/* City Info */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-texas-blue mb-2">Population</h3>
              <p className="text-lg text-gray-700">{city.population}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-texas-blue mb-2">Founded</h3>
              <p className="text-lg text-gray-700">{city.founded}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-texas-blue mb-2">Famous For</h3>
              <p className="text-lg text-gray-700">{city.landmarks.slice(0, 2).join(', ')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {city.name} Apparel & Gifts
          </h2>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-texas-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading {city.name} products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No {city.name} products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Clickable Image */}
                  <Link href={`/product/${product.slug || product.id}`}>
                    <div className="h-80 relative cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain bg-gray-100 hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to Printify image if custom thumbnail fails
                          console.log(`Thumbnail failed for ${product.name}, using fallback`);
                          e.target.src = product.fallbackImage;
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    {/* Clickable Title */}
                    <Link href={`/product/${product.slug || product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-texas-blue cursor-pointer transition-colors duration-200">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
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

      
      {/* Landmarks Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Famous {city.name} Landmarks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {city.landmarks.map((landmark, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="font-medium text-gray-700">{landmark}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}