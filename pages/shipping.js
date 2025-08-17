import Layout from '../components/Layout'
import Head from 'next/head'

export default function Shipping() {
  return (
    <Layout>
      <Head>
        <title>Shipping Information - OnlyInTX | Fast Texas Pride Delivery</title>
        <meta name="description" content="OnlyInTX shipping info: Free shipping on orders over $50. Fast delivery of Texas pride apparel across the US. View shipping rates and delivery times." />
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
          <div className="bg-texas-red text-white rounded-lg p-6 mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">🚚 FREE SHIPPING ON ORDERS OVER $50!</h2>
            <p className="text-lg">Get your Texas gear delivered fast with free shipping on qualifying orders</p>
          </div>
          
          {/* Shipping Options */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-texas-blue mb-6">Shipping Options & Rates</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Standard Shipping</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">5-7 Business Days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">$7.99 (FREE over $50)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Express Shipping</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">3-4 Business Days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">$12.99</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Priority Shipping</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">1-2 Business Days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">$19.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
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