// pages/admin/printify-test.js
import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function PrintfulTest() {
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/printify/test')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Printify Connection Test</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Your Printify API Connection</h2>
          
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-6 py-3 bg-texas-blue text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>

          {testResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? '✅ Connection Successful!' : '❌ Connection Failed'}
              </h3>
              
              <p className={`mt-2 ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.message}
              </p>

              {testResult.error && (
                <p className="mt-2 text-red-600 text-sm">
                  Error: {typeof testResult.error === 'string' ? testResult.error : JSON.stringify(testResult.error)}
                </p>
              )}

              {testResult.debug && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-800">Debug Info:</h4>
                  <pre className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(testResult.debug, null, 2)}
                  </pre>
                </div>
              )}

              {testResult.shops && (
                <div className="mt-4">
                  <h4 className="font-medium text-green-800">Connected Shops:</h4>
                  <ul className="mt-2 text-sm text-green-700">
                    {testResult.shops.map((shop) => (
                      <li key={shop.id}>
                        Shop ID: {shop.id} - {shop.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {testResult.sampleProducts && (
                <div className="mt-4">
                  <h4 className="font-medium text-green-800">Available Products (Sample):</h4>
                  <ul className="mt-2 text-sm text-green-700">
                    {testResult.sampleProducts.map((product) => (
                      <li key={product.id}>
                        ID: {product.id} - {product.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800">Setup Instructions:</h3>
          <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Go to your Printify dashboard</li>
            <li>Navigate to My Account → API</li>
            <li>Generate or copy your API token</li>
            <li>Add it to your .env.local file as PRINTIFY_API_KEY</li>
            <li>Restart your development server</li>
            <li>Click "Test Connection" above</li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  )
}