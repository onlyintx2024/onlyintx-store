import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'OnlyInTX',
    storeDescription: 'Authentic Texas designs for every city',
    contactEmail: 'onlyintx2024@gmail.com',
    shippingRate: 5.99,
    taxRate: 8.25,
    currency: 'USD',
    printifyShopId: '18727817',
    stripeWebhookSecret: '',
    autoFulfillment: true,
    emailNotifications: true
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  loadSettings();
}, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Settings saved successfully:', data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      throw new Error(data.message || 'Failed to save settings');
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
          <p className="mt-2 text-gray-600">Manage your store configuration and preferences.</p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Store Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Store Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  id="storeName"
                  value={settings.storeName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">
                  Store Description
                </label>
                <textarea
                  name="storeDescription"
                  id="storeDescription"
                  rows={3}
                  value={settings.storeDescription}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Shipping */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="shippingRate" className="block text-sm font-medium text-gray-700">
                  Shipping Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shippingRate"
                  id="shippingRate"
                  value={settings.shippingRate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="taxRate"
                  id="taxRate"
                  value={settings.taxRate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  name="currency"
                  id="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Integration */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">API Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="printifyShopId" className="block text-sm font-medium text-gray-700">
                  Printify Shop ID
                </label>
                <input
                  type="text"
                  name="printifyShopId"
                  id="printifyShopId"
                  value={settings.printifyShopId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  readOnly
                />
                <p className="mt-1 text-sm text-gray-500">Currently connected to OnlyInTX shop</p>
              </div>
              
              <div>
                <label htmlFor="stripeWebhookSecret" className="block text-sm font-medium text-gray-700">
                  Stripe Webhook Secret
                </label>
                <input
                  type="password"
                  name="stripeWebhookSecret"
                  id="stripeWebhookSecret"
                  value={settings.stripeWebhookSecret ? '••••••••••••••••' : ''}
                  onChange={handleInputChange}
                  placeholder="whsec_... (Set in environment variables)"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  readOnly
                />
                <p className="mt-1 text-sm text-gray-500">Required for order webhooks</p>
              </div>
            </div>
          </div>

          {/* Automation Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Automation</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="autoFulfillment"
                  name="autoFulfillment"
                  type="checkbox"
                  checked={settings.autoFulfillment}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="autoFulfillment" className="ml-2 block text-sm text-gray-900">
                  Auto-fulfill orders in Printify
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                  Send email notifications for new orders
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                saved 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50`}
            >
              {loading ? 'Saving...' : saved ? 'Settings Saved!' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}