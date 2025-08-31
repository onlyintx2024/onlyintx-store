import Layout from '../components/Layout'
import Head from 'next/head'
import Link from 'next/link'

export default function AllCities() {
  const activeCities = [
    { name: 'Austin', slug: 'austin', tagline: 'Keep Austin Weird' },
    { name: 'Dallas', slug: 'dallas', tagline: 'Big D Energy' },
    { name: 'Houston', slug: 'houston', tagline: 'Space City Style' },
    { name: 'San Antonio', slug: 'san-antonio', tagline: 'Alamo City Pride' },
    { name: 'Fort Worth', slug: 'fort-worth', tagline: 'Where the West Begins' },
    { name: 'El Paso', slug: 'el-paso', tagline: 'The Sun City' },
    { name: 'Arlington', slug: 'arlington', tagline: 'The American Dream City' },
    { name: 'Corpus Christi', slug: 'corpus-christi', tagline: 'The Sparkling City by the Sea' },
  ]
  
  const comingSoonCities = [
    { name: 'Plano', population: '285,494', famous: 'Tech Hub' },
    { name: 'Lubbock', population: '258,862', famous: 'Red Raider Country' },
    { name: 'Laredo', population: '255,205', famous: 'Gateway City' },
    { name: 'Garland', population: '246,018', famous: 'Family Community' },
    { name: 'Irving', population: '246,109', famous: 'Business Center' },
    { name: 'Amarillo', population: '200,393', famous: 'Yellow City' },
    { name: 'Grand Prairie', population: '196,100', famous: 'Entertainment District' },
    { name: 'Brownsville', population: '186,738', famous: 'Valley Culture' },
    { name: 'McKinney', population: '195,308', famous: 'Historic Charm' },
    { name: 'Frisco', population: '200,509', famous: 'Sports & Growth' },
    { name: 'Mesquite', population: '150,108', famous: 'Rodeo Heritage' },
    { name: 'Killeen', population: '153,095', famous: 'Military Strong' },
    { name: 'Carrollton', population: '133,434', famous: 'Diverse Community' },
    { name: 'Midland', population: '146,038', famous: 'Oil Capital' },
    { name: 'Waco', population: '138,486', famous: 'Heart of Texas' },
    { name: 'Denton', population: '148,915', famous: 'Music City' },
  ]
  
  return (
    <Layout>
      <Head>
        <title>All Texas Cities - OnlyInTX | Texas Pride Apparel for Every City</title>
        <meta name="description" content="Shop authentic Texas pride apparel for all Texas cities. From major metros to small towns, find t-shirts, hoodies and gifts celebrating your Texas city." />
        <meta name="keywords" content="Texas cities apparel, Texas t-shirts, Texas city pride, Texas merchandise, all Texas cities, Texas clothing" />
        <link rel="canonical" href="https://onlyintx.com/cities" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              All Texas Cities
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Celebrating every corner of the Lone Star State with authentic Texas pride apparel
            </p>
          </div>
          
          {/* Available Now Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-texas-blue text-center mb-12">
              🌟 Shop Now - Available Cities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {activeCities.map((city) => (
                <Link key={city.slug} href={`/${city.slug}`} className="group">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <div className="bg-gradient-to-r from-texas-blue to-texas-red p-6 text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">{city.name}</h3>
                      <p className="text-texas-gold font-semibold">{city.tagline}</p>
                    </div>
                    <div className="p-6 text-center">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        ✅ Shop Now
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Coming Soon Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-texas-red text-center mb-12">
              🚀 Coming Soon - More Texas Cities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoonCities.map((city, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center border-2 border-dashed border-gray-300 hover:border-texas-gold transition-colors duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{city.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Pop: {city.population}</p>
                  <p className="text-sm text-texas-blue font-medium mb-4">{city.famous}</p>
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    🔄 Coming Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Request Section */}
          <div className="bg-texas-blue text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't See Your Texas City?</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              We're working hard to represent every Texas community! Request your city or suggest a design - we love hearing from fellow Texans.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link 
                href="/contact" 
                className="inline-block bg-texas-gold text-texas-blue px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-200"
              >
                Request Your City
              </Link>
              <Link 
                href="/contact" 
                className="inline-block bg-texas-red text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors duration-200"
              >
                Suggest a Design
              </Link>
            </div>
            <p className="text-gray-200 mt-4 text-sm">
              💡 Got a great design idea? We feature the best community suggestions!
            </p>
          </div>
          
          {/* SEO Content */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Texas City Pride Apparel</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                From the bustling streets of Houston to the music venues of Austin, from the historic charm of San Antonio to the big city energy of Dallas - every Texas city has its own unique character and pride. OnlyInTX celebrates that diversity with authentic apparel designed specifically for each Texas community.
              </p>
              <p className="mb-4">
                Whether you're from a major metropolitan area or a small Texas town, we believe your city deserves recognition. Our designs capture the essence of what makes each Texas location special - from local landmarks and cultural icons to the unique personality that defines each community.
              </p>
              <p className="mb-0">
                Can't find your Texas city yet? We're constantly expanding our collection based on customer requests. Reach out and let us know which Texas city should be next - we love connecting with fellow Texans who share our passion for Lone Star State pride!
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  )
}