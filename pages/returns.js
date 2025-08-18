import Layout from '../components/Layout'
import Head from 'next/head'

export default function Returns() {
  return (
    <Layout>
      <Head>
        <title>Returns & Exchanges - OnlyInTX | Easy Texas Pride Returns</title>
        <meta name="description" content="OnlyInTX returns policy: Easy 30-day returns and exchanges on Texas apparel. Customer satisfaction guaranteed. View our simple return process." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Returns & Exchanges
            </h1>
            <p className="text-xl text-gray-600">
              Your satisfaction is as big as Texas - we guarantee it
            </p>
          </div>
          
          {/* Satisfaction Guarantee */}
          <div className="bg-texas-blue text-white rounded-lg p-8 mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">🤝 Texas-Sized Satisfaction Guarantee</h2>
            <p className="text-xl">
              Not completely happy with your order? We'll make it right with easy 30-day returns and exchanges.
            </p>
          </div>
          
          {/* Return Policy Overview */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-texas-red mb-6">Return Policy Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">✅ What You Can Return</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Unworn items with original tags</li>
                  <li>• Items in original packaging</li>
                  <li>• Defective or damaged products</li>
                  <li>• Wrong size or color received</li>
                  <li>• Items that don't match description</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">⏰ Return Timeframe</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>30 days</strong> from delivery date</li>
                  <li>• Items must be unworn and unwashed</li>
                  <li>• Original tags must be attached</li>
                  <li>• Include original packaging when possible</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Return Process */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-texas-blue mb-6">Easy Return Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-texas-blue">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                <p className="text-gray-600">Email us or use our contact form to start your return. We'll send you a prepaid return label.</p>
              </div>
              
              <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-texas-blue">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Pack & Ship</h3>
                <p className="text-gray-600">Pack your items securely, attach our prepaid label, and drop off at any shipping location.</p>
              </div>
              
              <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-texas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-texas-blue">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Get Refunded</h3>
                <p className="text-gray-600">Once we receive your return, we'll process your refund within 3-5 business days.</p>
              </div>
            </div>
          </div>
          
          {/* Exchanges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-texas-red mb-4">🔄 Exchanges</h3>
              <p className="text-gray-700 mb-4">
                Need a different size or color? We make exchanges easy! Follow the same return process and let us know what you'd like instead.
              </p>
              <p className="text-gray-700 mb-4">
                We'll ship your new item as soon as we receive your return - no waiting for refund processing.
              </p>
              <p className="text-sm text-gray-500">
                Price differences will be charged or refunded accordingly.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-texas-red mb-4">💰 Refunds</h3>
              <p className="text-gray-700 mb-4">
                Refunds are processed to your original payment method within 3-5 business days of receiving your return.
              </p>
              <p className="text-gray-700 mb-4">
                Original shipping costs are non-refundable unless the return is due to our error (wrong item, defective product, etc.).
              </p>
              <p className="text-sm text-gray-500">
                Bank processing times may vary (typically 5-10 business days).
              </p>
            </div>
          </div>
          
          {/* Special Situations */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-texas-blue mb-6">Special Situations</h2>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🚨 Defective Items</h4>
                <p className="text-gray-700">
                  Received a defective item? We'll cover all return shipping costs and send a replacement immediately. Your satisfaction is our priority!
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">📦 Wrong Item Received</h4>
                <p className="text-gray-700">
                  If we sent you the wrong item, we'll cover return shipping and send the correct item right away. Keep the wrong item until we sort it out!
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">📏 Sizing Issues</h4>
                <p className="text-gray-700">
                  Not sure about sizing? Check our size guide before ordering. If the fit isn't right, we make size exchanges easy and fast.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🎁 Gift Returns</h4>
                <p className="text-gray-700">
                  Returning a gift? No problem! We can process the return and issue store credit or help coordinate an exchange with the original purchaser.
                </p>
              </div>
            </div>
          </div>
          
          {/* Cannot Return */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Items We Cannot Accept for Return</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Items worn, washed, or damaged by customer</li>
              <li>• Items with removed or damaged tags</li>
              <li>• Custom or personalized items (unless defective)</li>
              <li>• Items returned after 30 days</li>
              <li>• Items with odors (smoke, perfume, etc.)</li>
            </ul>
          </div>
          
          {/* Contact for Returns */}
          <div className="text-center bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need to Start a Return?</h3>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help make your return as easy as possible. Reach out and we'll get you taken care of!
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <a 
                href="/contact" 
                className="inline-block bg-texas-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Contact Us
              </a>
              <a 
                href="mailto:onliyintx@gmail.com" 
                className="inline-block bg-texas-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Email Returns Team
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  )
}