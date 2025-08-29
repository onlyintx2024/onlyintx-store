import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { getColorMockupImage } from '../utils/mockupMapping'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { dispatch } = useCart()

  const cities = [
    { name: 'Austin', slug: 'austin', description: 'Keep Austin Weird', image: '/images/austin-hero.jpg' },
    { name: 'Dallas', slug: 'dallas', description: 'Big D Energy', image: '/images/dallas-hero.jpg' },
    { name: 'Houston', slug: 'houston', description: 'Space City Style', image: '/images/houston-hero.jpg' },
    { name: 'San Antonio', slug: 'san-antonio', description: 'Alamo City Pride', image: '/images/san-antonio-hero.jpg' },
  ]

  // Parse variant title to extract color and size
  const parseVariantTitle = (title) => {
    // Handle different Printify title formats:
    // "Unisex Heavy Cotton Tee - Black / S"
    // "Unisex Heavy Cotton Tee - White / M"
    // "Canvas Tote Bag - Natural"
    
    const parts = title.split(' - ')
    if (parts.length < 2) return { color: 'Default', size: 'Standard' }
    
    const colorSizePart = parts[1]
    
    // Check if there's a size (contains " / ")
    if (colorSizePart.includes(' / ')) {
      const [color, size] = colorSizePart.split(' / ')
      return { 
        color: color.trim(), 
        size: size.trim() 
      }
    }
    
    // Only color, no size (like tote bags)
    return { 
      color: colorSizePart.trim(), 
      size: 'Standard' 
    }
  }

  // Get unique colors from variants
  const getUniqueColors = (variants) => {
    const enabledVariants = variants.filter(v => v.is_enabled === true)
    const colors = enabledVariants.map(v => parseVariantTitle(v.title).color)
    return [...new Set(colors)].sort()
  }

  // Get unique sizes for a specific color
  const getSizesForColor = (variants, selectedColor) => {
    const enabledVariants = variants.filter(v => v.is_enabled === true)
    const sizesForColor = enabledVariants
      .filter(v => parseVariantTitle(v.title).color === selectedColor)
      .map(v => parseVariantTitle(v.title).size)
    return [...new Set(sizesForColor)].sort()
  }

  // Find variant by color and size
  const getVariantByColorSize = (variants, color, size) => {
    return variants.find(v => {
      const { color: vColor, size: vSize } = parseVariantTitle(v.title)
      return vColor === color && vSize === size && v.is_enabled
    })
  }

  // SEO Title Generator (same as before)
  const generateSEOTitle = (printifyTitle, cityName = 'Texas') => {
    const title = printifyTitle.toLowerCase()
    
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
    
    return `${cityName} T-Shirt - Local Texas Pride`
  }

  // SEO Description Generator (same as before)
  const generateSEODescription = (productName, cityName = 'Texas') => {
    const name = productName.toLowerCase()
    
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
            return `Celebrate ${cityName}'s incredible food scene with this foodie-inspired tee.`
          case 'music':
            return `Show your love for ${cityName}'s legendary music scene.`
          case 'landmarks':
            return `Iconic ${cityName} landmarks on a premium t-shirt.`
          case 'sports':
            return `Rep your ${cityName} team spirit with this sports-inspired tee.`
          case 'culture':
            return `Authentic ${cityName} culture shirt for true locals.`
          case 'vintage':
            return `Vintage-inspired ${cityName} design with retro appeal.`
        }
      }
    }
    
    return `Premium ${cityName} t-shirt with unique local design. Show your Texas pride!`
  }

  // Get city from product
  const getCityFromProduct = (product) => {
    const title = product.title?.toLowerCase() || ''
    const tags = product.tags?.join(' ').toLowerCase() || ''
    const searchText = `${title} ${tags}`
    
    if (searchText.includes('austin')) return 'Austin'
    if (searchText.includes('dallas')) return 'Dallas'
    if (searchText.includes('houston')) return 'Houston'
    if (searchText.includes('san antonio') || searchText.includes('san_antonio')) return 'San Antonio'
    return 'Texas'
  }

  // Get the best price from variants
  const getProductPrice = (variants) => {
    if (!variants || variants.length === 0) return 0
    const enabledVariants = variants.filter(v => v.is_enabled)
    if (enabledVariants.length === 0) return variants[0]?.price || 0
    return Math.min(...enabledVariants.map(v => v.price))
  }

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from API...')
        setLoading(true)
        const response = await fetch('/api/printify/products')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('API Response data:', data)
        
        if (data.products && data.products.length > 0) {
          // Transform products with SEO optimization
          const transformedProducts = data.products.map(product => {
            const cityName = getCityFromProduct(product)
            
            // Get the first available color from enabled variants for thumbnail
            const enabledVariants = product.variants.filter(v => v.is_enabled);
            const firstColor = enabledVariants.length > 0 ? 
              (enabledVariants[0].title.split(' / ')[0]?.trim() || 'Default') : 'Default';
            
            return {
              id: product.id,
              slug: product.slug,
              name: generateSEOTitle(product.title, cityName),
              description: generateSEODescription(product.title, cityName),
              price: getProductPrice(product.variants),
              image: getColorMockupImage(product.id, firstColor, 'thumb'),
              fallbackImage: product.images?.[0]?.src || null,
              city: cityName,
              variants: product.variants.filter(v => v.is_enabled),
              originalTitle: product.title,
              printifyId: product.id,
              primaryColor: firstColor
            }
          })

          console.log('Transformed products:', transformedProducts)
          setFeaturedProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])


  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-texas-blue to-texas-red text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Texas Pride, <span className="text-texas-gold">Authentic Style</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover premium apparel celebrating every corner of the Lone Star State. 
            From big cities to small towns, we've got your Texas pride covered.
          </p>
          <Link 
            href="/cities" 
            className="inline-block bg-texas-gold text-texas-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors duration-300"
          >
            Shop All Cities
          </Link>
        </div>
      </section>
      
      {/* Featured Cities */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Shop by Texas City
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cities.map((city) => (
              <Link key={city.slug} href={`/${city.slug}`} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={city.image}
                      alt={`${city.name}, Texas`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold drop-shadow-lg">{city.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-center">{city.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Best Selling Texas Gear
          </h2>
          
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-texas-blue"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>Error loading products: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/product/${product.slug || product.id}`}>
                      <div className="h-64 relative overflow-hidden cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.log(`Thumbnail failed for ${product.name}, using fallback`);
                            if (product.fallbackImage) {
                              e.target.src = product.fallbackImage;
                            } else {
                              e.target.src = '/images/texas-default.jpg';
                            }
                          }}
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link href={`/product/${product.slug || product.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-texas-blue transition-colors">
                          {product.name}
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
      </section>
      
      {/* Latest Designs - Show different products or all if less than 8 */}
      {featuredProducts.length > 4 && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Latest Designs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(4, 8).map((product) => (
                <div key={`latest-${product.id}`} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/product/${product.slug || product.id}`}>
                      <div className="h-64 relative overflow-hidden cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.log(`Thumbnail failed for ${product.name}, using fallback`);
                            if (product.fallbackImage) {
                              e.target.src = product.fallbackImage;
                            } else {
                              e.target.src = '/images/texas-default.jpg';
                            }
                          }}
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link href={`/product/${product.slug || product.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-texas-blue transition-colors">
                          {product.name}
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
          </div>
        </section>
      )}

      
      {/* Why Choose Us */}
      <section className="py-16 bg-texas-blue text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose OnlyInTX?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-texas-blue">TX</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">100% Texas Made</h3>
              <p className="text-gray-200">Designed and printed with Texas pride. Every design celebrates authentic Lone Star culture.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-texas-blue">★</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium Quality</h3>
              <p className="text-gray-200">High-quality materials and printing that lasts. Comfort and durability in every piece.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-texas-blue">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast Shipping</h3>
              <p className="text-gray-200">Free shipping on orders over $50. Get your Texas gear delivered fast anywhere in the US.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}