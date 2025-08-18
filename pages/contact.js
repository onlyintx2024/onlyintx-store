import Layout from '../components/Layout'
import Head from 'next/head'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, we'll just show an alert. Later we can integrate with email service.
    alert('Thanks for reaching out! We\'ll get back to you within 24 hours.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  return (
    <Layout>
      <Head>
        <title>Contact Us - OnlyInTX | Get in Touch with Texas Pride Experts</title>
        <meta name="description" content="Contact OnlyInTX for questions about Texas apparel, custom designs, bulk orders, or customer service. We're here to help with all your Texas pride needs." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help with all your Texas pride needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-texas-blue mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                  >
                    <option value="">Select a topic</option>
                    <option value="Order Question">Order Question</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Shipping Question">Shipping Question</option>
                    <option value="Return/Exchange">Return/Exchange</option>
                    <option value="Custom Design Request">Custom Design Request</option>
                    <option value="Bulk/Wholesale Order">Bulk/Wholesale Order</option>
                    <option value="Website Issue">Website Issue</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-texas-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              
              {/* Quick Contact */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-texas-blue mb-6">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-texas-gold rounded-full flex items-center justify-center mr-4">
                      <span className="text-texas-blue font-bold">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">onliyintx@gmail.com</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-texas-gold rounded-full flex items-center justify-center mr-4">
                      <span className="text-texas-blue font-bold">⏰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Response Time</h3>
                      <p className="text-gray-600">24 hours or less</p>
                      <p className="text-sm text-gray-500">Monday - Friday, 9 AM - 6 PM CST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-texas-gold rounded-full flex items-center justify-center mr-4">
                      <span className="text-texas-blue font-bold">🏢</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">Proudly based in Texas</p>
                      <p className="text-sm text-gray-500">Serving customers nationwide</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQ Quick Links */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-texas-blue mb-4">Quick Answers</h3>
                <div className="space-y-3">
                  <a href="/shipping" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">📦 Shipping Information</h4>
                    <p className="text-sm text-gray-600">Delivery times, shipping costs, and tracking info</p>
                  </a>
                  <a href="/returns" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">🔄 Returns & Exchanges</h4>
                    <p className="text-sm text-gray-600">Easy 30-day returns and exchange process</p>
                  </a>
                  <a href="/about" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">ℹ️ About OnlyInTX</h4>
                    <p className="text-sm text-gray-600">Learn about our Texas pride mission</p>
                  </a>
                </div>
              </div>
              
              {/* Special Requests */}
              <div className="bg-texas-blue text-white rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4">Special Requests</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">🎨 Custom Designs</h4>
                    <p className="text-gray-200 text-sm">
                      Need a design for your Texas town that we don't have? We love creating custom designs for Texas communities!
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📦 Bulk Orders</h4>
                    <p className="text-gray-200 text-sm">
                      Planning an event, fundraiser, or need team apparel? Contact us for special bulk pricing and custom options.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🏪 Wholesale</h4>
                    <p className="text-gray-200 text-sm">
                      Interested in carrying OnlyInTX products in your store? We'd love to discuss wholesale opportunities.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  )
}