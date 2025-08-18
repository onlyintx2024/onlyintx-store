import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const cities = [
    { name: 'Austin', slug: 'austin', description: 'Keep Austin Weird', image: '/images/austin-hero.jpg' },
    { name: 'Dallas', slug: 'dallas', description: 'Big D Energy', image: '/images/dallas-hero.jpg' },
    { name: 'Houston', slug: 'houston', description: 'Space City Style', image: '/images/houston-hero.jpg' },
    { name: 'San Antonio', slug: 'san-antonio', description: 'Alamo City Pride', image: '/images/san-antonio-hero.jpg' },
  ]
  
  const featuredProducts = [
    {
      id: 1,
      name: 'Austin "Keep It Weird" Tee',
      price: 24.99,
      image: '/images/austin-tee.jpg',
      city: 'Austin'
    },
    {
      id: 2,
      name: 'Dallas Big D Skyline Hoodie',
      price: 39.99,
      image: '/images/dallas-hoodie.jpg',
      city: 'Dallas'
    },
    {
      id: 3,
      name: 'Houston Space City Vintage Tee',
      price: 26.99,
      image: '/images/houston-tee.jpg',
      city: 'Houston'
    },
    {
      id: 4,
      name: 'San Antonio Historic Downtown Tee',
      price: 24.99,
      image: '/images/san-antonio-tee.jpg',
      city: 'San Antonio'
    },
  ]
  
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
                      src={`/images/${city.slug}-card.jpg`}
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
            Featured Texas Gear
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-64 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Product Image
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.city}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-texas-blue">${product.price}</span>
                      <button className="bg-texas-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
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