import Image from 'next/image'
import Head from 'next/head'
import { useState } from 'react'

export default function CityPage({ city }) {
  const [products] = useState([
    {
      id: 1,
      name: `${city.name} Classic Tee`,
      price: 24.99,
      description: `Show your ${city.name} pride with this comfortable cotton tee`,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'White', 'Heather Gray']
    },
    {
      id: 2,
      name: `${city.name} Hoodie`,
      price: 39.99,
      description: `Stay warm in style with our premium ${city.name} hoodie`,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'Navy', 'Heather Gray']
    },
    {
      id: 3,
      name: `${city.name} Vintage Tee`,
      price: 26.99,
      description: `Vintage-inspired design celebrating ${city.name}`,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Vintage Black', 'Vintage White', 'Vintage Red']
    }
  ])
  
  return (
    <>
      <Head>
        <title>{city.name}, Texas Apparel & Gifts | OnlyInTX - {city.tagline}</title>
        <meta name="description" content={`${city.description} Shop authentic ${city.name} t-shirts, hoodies, and gifts. Free shipping on orders over $50.`} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Product Image
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-texas-blue">${product.price}</span>
                    <button className="bg-texas-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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