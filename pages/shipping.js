import Layout from '../components/Layout'
import Head from 'next/head'

export default function Shipping() {
  return (
    <Layout>
      <Head>
        <title>Shipping Information - OnlyInTX | Fast Texas Pride Delivery</title>
        <meta name="description" content="OnlyInTX shipping info: Always FREE shipping on ALL orders. Fast delivery of Texas pride apparel across the US. No minimums required." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Shipping Information
            </h1>
            <p className="text-xl text-gray-600">
              Fast, reliable delivery of your Texas pride gear
            </p>
          </div>
          
          {/* Free Shipping Banner */}
          <div className="bg-green-500 text-white rounded-lg p-6 mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">🚚 FREE SHIPPING ON ALL ORDERS!</h2>
            <p className="text-xl">Always free shipping - no minimums, no conditions</p>
          </div>
          
          {/* Shipping Options */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-texas-blue mb-6">Shipping & Delivery</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-green-800 mb-2">✨ Standard Shipping - Always FREE</h3>
              <div className="text-green-700">
                <p className="mb-2"><strong>Delivery Time:</strong> 5-7 Business Days</p>
                <p className="mb-2"><strong>Cost:</strong> FREE on all orders</p>
                <p><strong>Tracking:</strong> Full tracking provided via email</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-center">
              We believe in making Texas pride accessible to everyone, so we've eliminated all shipping fees. 
              Every order ships free, no matter the size!
            </p>
          </div>
          
          {/* Processing Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-texas-blue mb-4">📦 Processing Time</h3>
              <p className="text-gray-700 mb-4">
                All orders are processed within 1-3 business days. Orders placed on weekends or holidays will be processed the next business day.
              </p>
              <p className="text-gray-700">
                You'll receive a tracking number via email once your order ships so you can follow your Texas pride all the way to your door!
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-texas-blue mb-4">🌎 Delivery Areas</h3>
              <p className="text-gray-700 mb-4">
                We currently ship to all 50 US states. Whether you're representing Texas from the Lone Star State itself or showing your Texas pride from anywhere in America, we've got you covered.
              </p>
              <p className="text-sm text-gray-500">
                International shipping coming soon!
              </p>
            </div>
          </div>
          
          {/* Special Situations */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold text-texas-blue mb-6">Special Shipping Situations</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🎁 Gift Orders</h4>
                <p className="text-gray-700">
                  Sending Texas pride as a gift? We can ship directly to the recipient with a gift message. Just add the details during checkout!
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">📍 P.O. Box Deliveries</h4>
                <p className="text-gray-700">
                  We ship to P.O. Boxes via USPS for Standard and Express shipping options.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🏢 Business Addresses</h4>
                <p className="text-gray-700">
                  Business deliveries are welcome! Please include your company name and any special delivery instructions during checkout.
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Tracking */}
          <div className="bg-texas-gold text-texas-blue rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">📱 Track Your Order</h3>
            <p className="text-lg mb-4">
              Once your order ships, you'll receive a tracking number via email. You can track your package status anytime to see exactly when your Texas gear will arrive.
            </p>
            <p className="font-medium">
              Questions about your shipment? Contact us and we'll help track down your Texas pride!
            </p>
          </div>
          
          {/* Contact for Shipping Questions */}
          <div className="text-center bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Shipping Questions?</h3>
            <p className="text-gray-600 mb-6">
              Need rush delivery or have special shipping requirements? We're here to help get your Texas gear to you as fast as possible.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-texas-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
          
        </div>
      </div>
    </Layout>
  )
}