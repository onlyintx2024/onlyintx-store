import Layout from '../components/Layout'
import Head from 'next/head'

export default function Privacy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - OnlyInTX | Your Data Protection & Privacy Rights</title>
        <meta name="description" content="OnlyInTX Privacy Policy: Learn how we protect your personal information, data collection practices, and your privacy rights when shopping for Texas apparel." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600">
              Your privacy matters to us as much as Texas pride
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: January 2025
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
            
            <div className="bg-texas-blue text-white p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold mb-2 text-white">Your Privacy, Our Promise</h2>
              <p className="text-gray-200 mb-0">
                OnlyInTX respects your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
              </p>
            </div>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Contact information (name, email, phone number, shipping address)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Order history and preferences</li>
              <li>Communications with our customer service team</li>
              <li>Account information if you create an account</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Website usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Process and fulfill your orders</li>
              <li>Communicate about your orders and account</li>
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send promotional emails (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Service Providers:</strong> Third parties who help us operate our business (payment processing, shipping, email services)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or transfer of our business</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h3>
            <p className="text-gray-700 mb-6">
              We work with trusted partners including Stripe (payment processing), Printful (order fulfillment), and Vercel (website hosting). These partners have their own privacy policies and security measures.
            </p>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of promotional emails</li>
              <li>Request a copy of your data</li>
              <li>Contact us with privacy concerns</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 mb-6">
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookies through your browser settings, though some features may not work properly if cookies are disabled.
            </p>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-6">
              Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will delete it promptly.
            </p>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
            </p>
            
            <h2 className="text-2xl font-bold text-texas-red mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> onliyintx@gmail.com</p>
              <p className="text-gray-700 mb-2"><strong>General Contact:</strong> onliyintx@gmail.com</p>
              <p className="text-gray-700 mb-0"><strong>Contact Form:</strong> <a href="/contact" className="text-texas-blue hover:underline">Visit our contact page</a></p>
            </div>
            
          </div>
        </div>
      </div>
    </Layout>
  )
}