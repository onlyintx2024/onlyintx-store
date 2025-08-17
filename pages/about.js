import Layout from '../components/Layout'
import Head from 'next/head'

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About Us - OnlyInTX | Authentic Texas Pride Apparel</title>
        <meta name="description" content="Learn about OnlyInTX - your source for authentic Texas pride apparel celebrating every city and town in the Lone Star State." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About OnlyInTX
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Born from a deep love for the Lone Star State, OnlyInTX celebrates the unique spirit of every Texas city, town, and landmark.
            </p>
          </div>
          
          {/* Our Story */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-texas-blue mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                Texas isn't just a state—it's a way of life. From the music capital of Austin to the space city of Houston, from the historic Alamo in San Antonio to the big energy of Dallas, every corner of Texas has its own unique character and pride.
              </p>
              <p className="mb-6">
                OnlyInTX was founded on the belief that every Texan deserves to wear their city's pride with authentic style. Whether you're from a bustling metroplex or a charming small town, we've got designs that celebrate what makes your piece of Texas special.
              </p>
              <p className="mb-6">
                We're not just another apparel company—we're fellow Texans who understand that saying "I'm from Texas" isn't just geography, it's identity. That's why every design we create is crafted with respect for Texas heritage and the unique spirit of each community.
              </p>
            </div>
          </div>
          
          {/* Our Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-texas-red mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To create premium apparel that authentically represents the pride, heritage, and unique character of every Texas city and town. We believe every Texan should have access to quality gear that celebrates their home with style and authenticity.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-texas-red mb-4">Our Promise</h3>
              <p className="text-gray-700">
                Every product is designed with Texas pride and printed with premium materials. We're committed to quality that lasts and designs that respect the heritage of the communities they represent. When you wear OnlyInTX, you're wearing authentic Texas pride.
              </p>
            </div>
          </div>
          
          {/* Values */}
          <div className="bg-texas-blue text-white rounded-lg p-8 mb-12">
            <h3 className="text-3xl font-bold text-center mb-8">Our Texas Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-texas-blue">🤝</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Community First</h4>
                <p className="text-gray-200">We celebrate every Texas community, from major cities to small towns that make our state unique.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-texas-blue">⭐</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Authentic Pride</h4>
                <p className="text-gray-200">Every design respects the heritage and character of the places and people it represents.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-texas-blue">🏆</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Premium Quality</h4>
                <p className="text-gray-200">Texas-sized quality in every product, because our customers deserve nothing less.</p>
              </div>
            </div>
          </div>
          
          {/* Contact CTA */}
          <div className="text-center bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Story?</h3>
            <p className="text-gray-600 mb-6">
              We'd love to hear from fellow Texans! Whether you have questions about our products, want to suggest a new city design, or just want to share your Texas pride, we're all ears.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-texas-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Get In Touch
            </a>
          </div>
          
        </div>
      </div>
    </Layout>
  )
}