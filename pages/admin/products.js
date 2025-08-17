import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function AdminProducts() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Austin Keep It Weird Tee', city: 'Austin', price: 24.99, status: 'Active', printfulId: 'PF001' },
    { id: 2, name: 'Dallas Big D Skyline Hoodie', city: 'Dallas', price: 39.99, status: 'Active', printfulId: 'PF002' },
    { id: 3, name: 'Houston Space City Tee', city: 'Houston', price: 26.99, status: 'Draft', printfulId: 'PF003' },
    { id: 4, name: 'San Antonio River Walk Vintage Tee', city: 'San Antonio', price: 24.99, status: 'Active', printfulId: 'PF004' },
    { id: 5, name: 'Austin Music Capital Hoodie', city: 'Austin', price: 42.99, status: 'Active', printfulId: 'PF005' },
    { id: 6, name: 'Dallas Downtown District Tee', city: 'Dallas', price: 28.99, status: 'Draft', printfulId: 'PF006' },
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    city: '',
    price: '',
    description: '',
    printfulId: ''
  })
  
  const cities = ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Plano', 'Lubbock', 'Amarillo']
  
  const handleAddProduct = (e) => {
    e.preventDefault()
    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      status: 'Draft'
    }
    setProducts([...products, product])
    setNewProduct({ name: '', city: '', price: '', description: '', printfulId: '' })
    setShowAddForm(false)
  }
  
  const deleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }
  
  const toggleStatus = (id) => {
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'Active' ? 'Draft' : 'Active' }
        : p
    ))
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your Texas city apparel and gifts</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-texas-blue text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
        
        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g., Austin Keep It Weird Tee"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    required
                    value={newProduct.city}
                    onChange={(e) => setNewProduct({...newProduct, city: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="24.99"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Printful Product ID</label>
                  <input
                    type="text"
                    value={newProduct.printfulId}
                    onChange={(e) => setNewProduct({...newProduct, printfulId: e.target.value})}
                    placeholder="PF001"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  placeholder="Show your Texas pride with this awesome design..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-texas-blue"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-texas-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Products ({products.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Printful ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-texas-gold text-texas-blue rounded-full">
                        {product.city}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {product.printfulId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(product.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                          product.status === 'Active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {product.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-texas-blue hover:text-blue-700 transition-colors">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Active Products</h4>
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Draft Products</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'Draft').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Average Price</h4>
            <p className="text-2xl font-bold text-texas-blue">
              ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}